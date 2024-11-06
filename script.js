const supportsTemplate = function(){
    return 'content' in document.createElement('template')
}
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0'); // Εξασφαλίζει ότι η μέρα έχει δύο ψηφία
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Μήνας από 0-11, οπότε προσθέτουμε 1
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const articlesPerPage = 12;
let currentPage = 1;
let articles = [];

const loadNewsFromJSON = async () =>{
    try{
        const response = await fetch('data/latest-news.json');
        const data = await response.json();
        articles = data.articles;
        const totalArticles = articles.length;
        const totalPages = Math.ceil(totalArticles / articlesPerPage);

        articles.sort((a, b) => new Date(b.date) - new Date(a.date));
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
            
            const reverseIndex = totalArticles - 1 - index;
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
        if(i==1){
            return;
        }
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            displayArticles(articles, currentPage); // Επαναφόρτωση των άρθρων για τη νέα σελίδα

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
        const response = await fetch('data/latest-news.json');
        const data = await response.json();
        const carousel = document.getElementById('carousel');
        
        const articles = data.articles;
        const recentArticles = articles.slice(-3).reverse();
        const totalArticles = articles.length;
        
        recentArticles.forEach((article, index) => {
            const articleElement = document.createElement('div');
            articleElement.classList.add('carousel-item');

            const reverseIndex = totalArticles - 1 - index;
            const articleLink = `article.html?id=${reverseIndex}`;

            articleElement.innerHTML = `
                <img src="${article.imageUrl}" alt="${article.title}" class="carousel-image">
                <h2>${article.title}</h2>
                <p>${article.description}</p>
                <a href="${articleLink}" class="read-more">Διαβάστε περισσότερα</a>
            `;

            // Προσθήκη στο carousel
            carousel.appendChild(articleElement);
        });
        
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




