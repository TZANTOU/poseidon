const supportsTemplate = function(){
    return 'content' in document.createElement('template')
}
const toISO = (d) => /^\d{2}\/\d{2}\/\d{4}$/.test(d) ? d.split('/').reverse().join('-') : d;
const formatDate = (dateString) => {
  const dt = new Date(toISO(dateString));
  if (isNaN(dt)) return dateString || '';
  const day = String(dt.getDate()).padStart(2,'0');
  const month = String(dt.getMonth()+1).padStart(2,'0');
  const year = dt.getFullYear();
  return `${day}/${month}/${year}`;
};

const articlesPerPage = 12;
let currentPage = 1;
let articles = [];

// === NEW (Sheet config + helpers) ===
const SHEET_ID = "1bzU8I1ENHuZMaeL53gngYwH_xDjbwgio7Or8nu0Sfac";
const SHEET_TABS = ["articles", "Form Responses 1", "Sheet1"];
const LOCAL_JSON_URL = "data/latest-news.json";

function slugify(s){
  const map = {'ά':'a','α':'a','β':'v','γ':'g','δ':'d','ε':'e','έ':'e','ζ':'z','η':'i','ή':'i','θ':'th','ι':'i','ί':'i','ϊ':'i','ΐ':'i','κ':'k','λ':'l','μ':'m','ν':'n','ξ':'x','ο':'o','ό':'o','π':'p','ρ':'r','σ':'s','ς':'s','τ':'t','υ':'y','ύ':'y','ϋ':'y','ΰ':'y','φ':'f','χ':'h','ψ':'ps','ω':'o','ώ':'o'};
  return String(s||'').toLowerCase()
    .replace(/[άαβγδεέζηήθιίϊΐκλμνξοόπρσςτυύϋΰφχψωώ]/g, ch => map[ch] || ch)
    .replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}
function gvizUrl(sheetId, sheetName){
  return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json&t=${Date.now()}`;
}
function parseGviz(text){
  const prefix="/*O_o*/\ngoogle.visualization.Query.setResponse(", suffix=");";
  const s=text.trim(); if(!s.startsWith(prefix)) throw new Error("Unexpected GViz wrapper");
  return JSON.parse(s.slice(prefix.length, s.length - suffix.length));
}
function rowsToArticles(gviz){
  const cols=(gviz.table.cols||[]).map(c=>(c.label||"").trim());
  const idx={
    title: cols.findIndex(c=>c.toLowerCase()==="title"),
    date: cols.findIndex(c=>c.toLowerCase()==="date"),
    imageUrl: cols.findIndex(c=>c.toLowerCase()==="imageurl"),
    description: cols.findIndex(c=>c.toLowerCase()==="description"),
    content: cols.findIndex(c=>c.toLowerCase()==="content"),
    slug: cols.findIndex(c=>c.toLowerCase()==="slug"),
  };
  const cell=(row,i)=> i<0 ? "" : (row.c[i]?.f ?? row.c[i]?.v ?? "");
  const rows = gviz.table.rows || [];
  return rows.map(r=>{
    const title=String(cell(r,idx.title)||"").trim(); if(!title) return null;
    const date=String(cell(r,idx.date)||"").trim();
    const imageUrl=String(cell(r,idx.imageUrl)||"").trim();
    const description=String(cell(r,idx.description)||"").trim();
    const content=String(cell(r,idx.content)||"").trim();
    const manualSlug=String(cell(r,idx.slug)||"").trim();
    return { title, date, imageUrl, description, content, slug: manualSlug || slugify(title) };
  }).filter(Boolean);
}

async function fetchJsonArticles(){
  const res=await fetch(LOCAL_JSON_URL,{cache:"no-store"});
  if(!res.ok) throw new Error(`HTTP ${res.status} on ${LOCAL_JSON_URL}`);
  const data=await res.json();
  const arr = Array.isArray(data?.articles) ? data.articles : Array.isArray(data) ? data : [];
  return arr.map((a,i)=>({ ...a, id: typeof a.id==="number" ? a.id : i, slug: a.slug || slugify(a.title) }));
}
async function fetchSheetArticles(){
  let lastErr;
  for(const tab of SHEET_TABS){
    try{
      const res=await fetch(gvizUrl(SHEET_ID,tab),{cache:"no-store"});
      if(!res.ok) throw new Error(`HTTP ${res.status} (${tab})`);
      const txt=await res.text();
      const gviz=parseGviz(txt);
      const rows=rowsToArticles(gviz);
      if(!rows.length) throw new Error(`No rows in "${tab}"`);
      return rows; // χωρίς id
    }catch(e){ lastErr=e; }
  }
  throw lastErr || new Error("Unable to read from Google Sheet.");
}

function computeBaseOffset(jsonArticles){
  const ids=jsonArticles.map(a=>typeof a.id==="number"?a.id:null).filter(v=>v!==null);
  return ids.length ? Math.max(...ids)+1 : jsonArticles.length;
}
async function buildCombinedArticles(){
  let json=[]; try{ json=await fetchJsonArticles(); }catch(e){ console.warn("JSON load failed:",e); }
  const offset = computeBaseOffset(json);
  let sheet=[]; try{ sheet=await fetchSheetArticles(); }catch(e){ console.warn("Sheet load failed:",e); }
  const sheetWithIds = sheet.map((a,i)=>({ ...a, id: offset + i }));
  return [...json, ...sheetWithIds];
}



const loadNewsFromJSON = async () =>{
    try{
        articles = await buildCombinedArticles();
        const totalArticles = articles.length;
        const totalPages = Math.ceil(totalArticles / articlesPerPage);

        articles.sort((a, b) => new Date(toISO(b.date)) - new Date(toISO(a.date)));
        displayArticles(articles, currentPage);
        
        createPagination(totalPages);
    }catch(error){
        console.error("Error loading JSON:", error);
    }

};

const displayArticles = (articles, page) => {
    if(supportsTemplate()){
        let temp = document.getElementById('template-news-card');
        let newsContainer = document.getElementById('news-container');

        newsContainer.innerHTML = '';
        const totalArticles = articles.length;
        
        const startIndex = (page - 1) * articlesPerPage;
        const endIndex = Math.min(startIndex + articlesPerPage, totalArticles);

        

        const articlesToDisplay = articles.slice(startIndex, endIndex);
        articlesToDisplay.forEach((article, index) =>{
            let content = temp.content.cloneNode(true);
            content.getElementById('news-title').textContent = article.title;
            content.getElementById('news-source').textContent = formatDate(article.date);
            content.getElementById('news-desc').textContent = article.description;
            content.getElementById('news-img').src = article.imageUrl;
            
            const globalIndex = startIndex + index;
            const reverseIndex = totalArticles - 1 - globalIndex;
            let articleLink = document.createElement('a');
            articleLink.href = `article.html?id=${reverseIndex}`;
            articleLink.appendChild(content);
            
            
            
            
            newsContainer.appendChild(articleLink);

        });

    }    
}
const createPagination = (totalPages) => {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-btn');
        if(totalPages==1){
            return;
        }
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayArticles(articles, currentPage); // Επαναφόρτωση των άρθρων για τη νέα σελίδα
            window.scrollTo({
                top: 0,
                behavior: 'smooth', // Ομαλή μετακίνηση
            });
            const previousActiveButton = document.querySelector('.page-btn.active');
            if (previousActiveButton) {
                previousActiveButton.classList.remove('active');
            }
            
            // Προσθήκη active στο τρέχον κουμπί
            pageButton.classList.add('active');
        });
        pagination.appendChild(pageButton);
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    loadNewsFromJSON();
})

document.addEventListener('DOMContentLoaded', () => {
    // Βρίσκουμε το κουμπί και το μενού
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.main-menu');

    // Όταν ο χρήστης πατάει το κουμπί, εναλλάσσουμε την εμφάνιση του μενού
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
});


const loadScheduleFromJSON = async () => {
    try {
        const response = await fetch('data/schedule.json');
        const data = await response.json();
        return data.games;
        
    } catch (error) {
        console.error("Error loading schedule:", error);
        return[];
    }
    
};


document.addEventListener('DOMContentLoaded', async() => {
    const scheduleList = document.getElementById('schedule-list');
    const template = document.getElementById('template-matchday');
    
    const games = await loadScheduleFromJSON();

    // Φόρτωση προγράμματος 
    const loadProgram = () => {
        scheduleList.innerHTML = '';
        games.forEach(game => {
            if (game.result) {
                return;
            }
            const clone =template.content.cloneNode(true);
            clone.querySelector('.matchday-title').textContent = game.matchday;
            clone.querySelector('.match-date').textContent = `Ημερομηνία: ${game.date}`;
            
            const daysUntil = calculateDaysUntil(game.date);
            clone.querySelector('.days-until').textContent = `Απομένουν ${daysUntil} ημέρες`;

            clone.querySelector('.opponent').textContent = `vs ${game.opponent}`;
            
            if (game.home_away === "Εντός") {
                clone.querySelector('.matchday').style.backgroundColor = "red";
            } else {
                clone.querySelector('.matchday').style.backgroundColor = "blue";
            }
            scheduleList.appendChild(clone);
        });
        loadProgram();
}});

const calculateDaysUntil = (dateString) => {
    const today = new Date();
    const matchDate = new Date(dateString);
    const timeDiff = matchDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Μετατροπή από milliseconds σε ημέρες
    return daysDiff;
};



// Καλέστε τη συνάρτηση για να δημιουργήσετε το ημερολόγιο


document.addEventListener('DOMContentLoaded', async() => {
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarBody = document.getElementById('calendar-body');
    const monthYearEl = document.getElementById('month-year');

    if (!prevMonthBtn || !nextMonthBtn || !calendarBody || !monthYearEl) {
        console.error("Missing calendar elements in the HTML!");
        return;
    }
    let currentDate = new Date();

    const games = await loadScheduleFromJSON();


    const loadCalendar = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        
        // Ενημέρωση τίτλου
        monthYearEl.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;

        // Εύρεση πρώτης ημέρας και αριθμού ημερών
        calendarBody.innerHTML = '';

        // Δημιουργία ημέρες της εβδομάδας
        const daysOfWeek = ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πεμ', 'Παρ', 'Σάβ'];
        const daysOfWeekRow = document.createElement('div');
        daysOfWeekRow.classList.add('days-of-week');
        daysOfWeek.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.classList.add('day-name');
            dayElement.textContent = day;
            daysOfWeekRow.appendChild(dayElement);
        });
        calendarBody.appendChild(daysOfWeekRow);
        
        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();;
        
        // Δημιουργία των ημερών του μήνα
        
        
        // Κενά κελιά μέχρι την πρώτη ημέρα του μήνα
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('calendar-day','empty');
            calendarBody.appendChild(emptyCell);
        }
        
        for (let day = 1; day <= lastDay; day++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            dayElement.textContent = day;

            const gameDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const game = games ? games.find(g => g.date.startsWith(gameDate)) : null;
            if (game) {
                const matchInfo = document.createElement('div');
                matchInfo.classList.add('match-info');
    
                const logo = document.createElement('img');
                logo.src = game.logo;
                logo.alt = game.opponent;
                logo.classList.add('team-logo');
    
                const opponent = document.createElement('span');
                
                matchInfo.appendChild(logo);
                matchInfo.appendChild(opponent);
    
                dayElement.appendChild(matchInfo);
                dayElement.style.backgroundColor = game.home_away === 'Εντός' ? 'red' : 'blue';
            }
            calendarBody.appendChild(dayElement);
        }
    };

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        loadCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        loadCalendar();
    });

    // Φόρτωση του αρχικού ημερολογίου
    loadCalendar();
});



const loadCarouselFromJSON = async () => {
    let currentSlide = 0;
    let slides =[];


    try{
        const combined = await buildCombinedArticles();
        const latest3 = combined.filter(a=>typeof a.id==='number').sort((a,b)=>b.id-a.id).slice(0,3);
        
        const carousel = document.getElementById('carousel');
        if(!carousel) return;
        carousel.innerHTML = '';
        
        latest3.forEach(article =>{
            const articleElement = document.createElement('div');
            articleElement.classList.add('carousel-item');
            const articleLink = `article.html?id=${encodeURIComponent(article.id)}`;
            articleElement.innerHTML = `
                <img src="${article.imageUrl}" alt="${article.title}" class="carousel-image">
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${articleLink}" class="read-more">Διαβάστε περισσότερα</a>
            `;
            carousel.appendChild(articleElement);

        })
        
        slides = document.querySelectorAll('.carousel-item');
        const totalSlides = slides.length;
        function updateCarousel() {
            const carousel = document.querySelector('.carousel');
            carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        }
        document.querySelector('.next-button').addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
        
        document.querySelector('.prev-button').addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
         // Αυτόματη εναλλαγή κάθε 5 δευτερόλεπτα
         setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
            }, 5000);
    }catch(error){
        console.error('Error loading articles for carousel:',error);
    }
};
document.addEventListener('DOMContentLoaded', () => {
    loadCarouselFromJSON();
});




