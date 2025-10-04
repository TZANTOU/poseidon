const HIDE_WINDOW_HOURS = 2; // αγώνας θεωρείται “σε εξέλιξη” για +2 ώρες από την έναρξη
const FIXTURES_URL = "data/fixtures_25-26.json";
const TEAM_NAME = "ΠΟΣΕΙΔΩΝ ΔΙΔΥΜΩΝ";
const TEAM_SELF_LABEL = "ΠΟΣΕΙΔΩΝ";
const TEAM_SELF_LOGO = "images/logo.png";
const TEAM_LOGOS = {
  "ΣΠΕΤΣΕΣ": "https://www.epsarg.gr/images/teamLogos/mpoumpoulinaspetson.jpg",
  "ΗΡΑΚΛΗΣ ΚΑΡΥΑΣ": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQINsPvYKk2neBye3JnxL5u4fxXAm1HWy4i1A&s"
};
const fmtDate = (d) =>
  d.toLocaleString("el-GR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

function normalizeFromFixture(fx) {
  const isHome = fx.home_away === "home" || fx.home_team === TEAM_NAME;
  const opponent = isHome ? fx.away_team : fx.home_team;

  // 1) Υπολόγισε με ασφάλεια το start_ts (seconds)
  let startTs = Number(fx.start_ts);
  if (!Number.isFinite(startTs)) {
    // fallback: ISO datetime
    if (fx.start_iso) {
      const dt = new Date(fx.start_iso);
      if (!isNaN(dt)) startTs = Math.floor(dt.getTime() / 1000);
    } else if (fx.date && fx.time) {
      // fallback: dd/mm/yy + HH:MM
      const m = String(fx.date).trim().match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
      const t = String(fx.time).trim().match(/^(\d{1,2}):(\d{2})$/);
      if (m) {
        const dd = +m[1], mm = +m[2], yy = 2000 + +m[3];
        const hh = t ? +t[1] : 0, min = t ? +t[2] : 0;
        const dt = new Date(yy, mm - 1, dd, hh, min);
        if (!isNaN(dt)) startTs = Math.floor(dt.getTime() / 1000);
      }
    }
  }
  if (!Number.isFinite(startTs)) return null; // δεν έχουμε έγκυρη ημερομηνία → παράλειψε τη γραμμή

  // 2) end_ts (seconds) με fallback στο HIDE_WINDOW_HOURS
  let endTs = Number(fx.end_ts);
  if (!Number.isFinite(endTs)) {
    endTs = startTs + HIDE_WINDOW_HOURS * 3600;
  }

  return {
    opponent,
    home_away: isHome ? "Εντός" : "Εκτός",
    matchday: fx.round || "",
    start_ts: startTs,
    end_ts: endTs,
    startDate: new Date(startTs * 1000),
    logo: TEAM_LOGOS[opponent] || "",
  };
}
function normalizeFromLegacyGame(g) {
  // Περιμένουμε: g.date (ISO ή parseable), g.result, g.opponent, g.matchday, g.home_away ('Εκτός'/'Εντός'), g.logo
  const startDate = new Date(g.date);
  const start_ts = Math.floor(startDate.getTime() / 1000);
  // +2 ώρες παράθυρο
  const end_ts = start_ts + HIDE_WINDOW_HOURS  * 3600;
  return {
    opponent: g.opponent,
    home_away: g.home_away,
    matchday: g.matchday || "",
    start_ts,
    end_ts,
    startDate,
    logo: g.logo || "",
    result: g.result || "",
  };
}

const loadNextMatch = async () => {
    try {
        const response = await fetch(FIXTURES_URL, { cache: "no-store" }); // Φορτώνουμε το πρόγραμμα
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const schedule = await response.json();

        let entries = [];
        
        if (Array.isArray(schedule?.games)){
            // Παίρνουμε το σημερινό timestamp
            
            entries = schedule.games
            .filter(
            (f) => f && (f.home_team === TEAM_NAME || f.away_team === TEAM_NAME)
            )
            .map(normalizeFromFixture)
            .filter(Boolean);
            /*const futureGames = [];
            const completedGames = [];
            schedule.games.forEach(game => {
                const gameDate = new Date(game.date);
                // Αν υπάρχει αποτέλεσμα (result), θεωρείται ολοκληρωμένο
                if (game.result) {
                    completedGames.push(game);
                } else if (gameDate.getTime() > now.getTime()) {
                    // Αν είναι μελλοντικό παιχνίδι, το προσθέτουμε στα μελλοντικά
                    futureGames.push(game);
                }
            });

            if (futureGames.length > 0) {
                const nextMatch = futureGames[0]; // Το πιο κοντινό μελλοντικό παιχνίδι
                
            } else {
                document.getElementById('next-match').textContent = 'Δεν υπάρχουν προγραμματισμένοι αγώνες';
            }
            displayCompletedGames(completedGames);
        */
        }else{
            console.error('Η μορφή των δεδομένων δεν είναι σωστή');
            return;
        }


        if (!entries.length) {
            document.getElementById("next-match").style.display = "none";
            return;
        }
        const nowSec = Math.floor(Date.now() / 1000);
        const inProgress = entries.find(e => e.start_ts <= nowSec && nowSec < e.end_ts);
        if (inProgress) {
            document.getElementById("next-match").style.display = "none";
            return;
        }
        const upcoming = entries.filter(e => e.start_ts > nowSec).sort((a, b) => a.start_ts - b.start_ts);
        if (!upcoming.length) {
            document.getElementById("next-match").style.display = "none";
            return;
        }
        const nextMatch = upcoming[0];
        displayNextMatch(nextMatch);
    }catch (error) {
        console.error('Error loading next match data:', error);
    }
};

const displayNextMatch = (nextMatch) => {
    const box = document.getElementById("next-match");
    if (!nextMatch || !box) return;

    // ποιος είναι “γηπεδούχος” στο UI
    let homeTeam = TEAM_SELF_LABEL;
    let awayTeam = nextMatch.opponent;
    let homeLogo = TEAM_SELF_LOGO;
    let awayLogo = nextMatch.logo || "images/logo-opponent-placeholder.png";

    if (nextMatch.home_away === "Εκτός") {
        homeTeam = nextMatch.opponent;
        awayTeam = TEAM_SELF_LABEL;
        homeLogo = nextMatch.logo || "images/logo-opponent-placeholder.png";
        awayLogo = TEAM_SELF_LOGO;
    }

    const formattedDate = fmtDate(nextMatch.startDate);

    box.innerHTML = `
        <div class="match-details">
        <span class="next-match-text">NEXT MATCH</span>
        <img src="${homeLogo}" alt="${homeTeam} logo" class="team-logo">
        <span class="vs-text">VS</span>
        <img src="${awayLogo}" alt="${awayTeam} logo" class="team-logo">
        </div>
        <div class="match-info">
        <p>${nextMatch.matchday || ""}</p>
        <p>Ημερομηνία: ${formattedDate}</p>
        </div>
        <div id="countdown-timer" class="countdown-timer">
        Ξεκινάει σε: <span id="time-left">--:--:--</span>
        </div>
    `;

    // Countdown
    const matchMs = nextMatch.startDate.getTime(); // ms
    const timerEl = document.getElementById("time-left");
    const wrapperEl = document.getElementById("countdown-timer");

    const updateCountdown = () => {
        const now = Date.now();
        const diff = matchMs - now;

        if (diff > 0) {
        const days = Math.floor(diff / 86400000);
        const hours = Math.floor((diff % 86400000) / 3600000);
        const minutes = Math.floor((diff % 3600000) / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        if (timerEl) timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        } else {
        if (wrapperEl) wrapperEl.textContent = "Ο αγώνας ξεκίνησε!";
        clearInterval(intervalId);
        }
    }; 
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);      
}
const displayCompletedGames = (completedGames,page = 1, gamesPerPage = 3) => {
    const completedGamesContainer = document.getElementById('completed-games');
    completedGamesContainer.innerHTML = ''; // Καθαρισμός προηγούμενου περιεχομένου

    if (completedGames.length === 0) {
        completedGamesContainer.innerHTML = '<p>Δεν υπάρχουν ολοκληρωμένοι αγώνες.</p>';
        return;
    }

    const reversedGames = [...completedGames].reverse();
    // Υπολογισμός του συνολικού αριθμού σελίδων
    const totalPages = Math.ceil(reversedGames.length / gamesPerPage);

    // Προσδιορισμός του εύρους αγώνων για εμφάνιση
    const start = (page - 1) * gamesPerPage;
    const end = start + gamesPerPage;
    const gamesToShow = reversedGames.slice(start, end);


    gamesToShow.forEach(game => {
        let homeTeam = 'ΠΟΣΕΙΔΩΝ';
        let awayTeam = game.opponent;
        let homeLogo = 'images/logo.png';
        let awayLogo = game.logo;
        let result = game.result || 'N/A'; // Χρησιμοποιούμε το αποτέλεσμα αν υπάρχει

        if (game.home_away === 'Εκτός') {
            homeTeam = game.opponent;
            awayTeam = 'ΠΟΣΕΙΔΩΝ';
            homeLogo = game.logo;
            awayLogo = 'images/logo.png';
        }

        const gameHTML = `
            <div class="completed-match">
                <img src="${homeLogo}" alt="${homeTeam} logo" class="team-logo">
                <span class="vs-text">VS</span>
                <img src="${awayLogo}" alt="${awayTeam} logo" class="team-logo">
                <div class="match-info">
                    <p>${game.matchday}</p>
                    <p>Αποτέλεσμα: ${result}</p>
                </div>
            </div>
        `;

        completedGamesContainer.innerHTML += gameHTML;
    });
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Καθαρισμός προηγούμενων κουμπιών

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.className = 'page-btn';
        if (i === page) {
            pageButton.classList.add('active'); // Ενεργό κουμπί για την τρέχουσα σελίδα
        }
        pageButton.addEventListener('click', () => displayCompletedGames(completedGames, i, gamesPerPage));
        paginationContainer.appendChild(pageButton);
    }
};
// Φορτώνουμε τον επόμενο αγώνα όταν φορτωθεί το DOM
document.addEventListener('DOMContentLoaded', loadNextMatch);
