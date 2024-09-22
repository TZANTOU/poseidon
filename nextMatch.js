const loadNextMatch = async () => {
    try {
        const response = await fetch('data/schedule.json'); // Φορτώνουμε το πρόγραμμα
        const schedule = await response.json();

        if (schedule && Array.isArray(schedule.games)){
            // Παίρνουμε το σημερινό timestamp
            const now = new Date();
            const futureGames = [];
            const completedGames = [];
            schedule.games.forEach(game => {
                const gameDate = new Date(game.date);
                if (gameDate.getTime() > now.getTime()) {
                    futureGames.push(game);
                } else {
                    completedGames.push(game);
                }
            });

            if (futureGames.length > 0) {
                const nextMatch = futureGames[0]; // Το πιο κοντινό μελλοντικό παιχνίδι
                displayNextMatch(nextMatch);
            } else {
                document.getElementById('next-match').textContent = 'Δεν υπάρχουν προγραμματισμένοι αγώνες';
            }
            displayCompletedGames(completedGames);
        }else{
            console.error('Η μορφή των δεδομένων δεν είναι σωστή');
        }
    }catch (error) {
        console.error('Error loading next match data:', error);
    }
};

const displayNextMatch = (nextMatch) => {
            // Βρίσκουμε τον επόμενο αγώνα (τον πρώτο αγώνα μετά την τρέχουσα ημερομηνία)
            

            // Αν βρεθεί αγώνας
            if (nextMatch) {
                const nextMatchContainer = document.getElementById('next-match');
                
                // Δημιουργούμε το HTML για τον αγώνα
                let homeTeam = 'ΠΟΣΕΙΔΩΝ';
                let awayTeam = nextMatch.opponent;
                let homeLogo = 'images/logo.png'; // Προσάρμοσε το path του λογοτύπου της ομάδας ΠΟΣΕΙΔΩΝ
                let awayLogo = nextMatch.logo;
                if (nextMatch.home_away === 'Εκτός') {
                    homeTeam = nextMatch.opponent;
                    awayTeam = 'ΠΟΣΕΙΔΩΝ';
                    homeLogo = nextMatch.logo;
                    awayLogo = 'images/logo.png'; // Λογότυπο της ομάδας ΠΟΣΕΙΔΩΝ
                }
                nextMatchContainer.innerHTML = `
                    <div class="match-details">
                        <span class="next-match-text">NEXT MATCH</span>
                        <img src="${homeLogo}" alt="${homeTeam} logo" class="team-logo">
                        <span class="vs-text">VS</span>
                        <img src="${awayLogo}" alt="${awayTeam} logo" class="team-logo">
                    </div>
                    <div class="match-info">
                        <p>${nextMatch.matchday}</p>
                        <p>Ημερομηνία: ${nextMatch.date}</p>
                    </div>
                    <div id="countdown-timer" class="countdown-timer">
                            Ξεκινάει σε: <span id="time-left">--:--:--</span>
                    </div>
                `;

                // Λήψη ημερομηνίας αγώνα
                const matchDate = new Date(nextMatch.date).getTime();

                // Ενημέρωση του χρονόμετρου κάθε δευτερόλεπτο
                const updateCountdown = () => {
                    const now = new Date().getTime();
                    const timeLeft = matchDate - now;

                    if (timeLeft > 0) {
                        // Υπολογισμός των ημερών, ωρών, λεπτών και δευτερολέπτων
                        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
                        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
                        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

                        // Ενημέρωση του HTML με τον υπολειπόμενο χρόνο
                        document.getElementById('time-left').textContent =
                            `${days}d ${hours}h ${minutes}m ${seconds}s`;
                    } else {
                        // Αν ο αγώνας έχει ξεκινήσει, δείξε ένα μήνυμα
                        document.getElementById('countdown-timer').innerHTML = 'Ο αγώνας ξεκίνησε!';
                    }
                };
                updateCountdown(); // Πρώτη άμεση ενημέρωση
                setInterval(updateCountdown, 1000); // Ενημέρωση κάθε δευτερόλεπτο
            } else {
                document.getElementById('next-match').textContent = 'Δεν υπάρχουν προγραμματισμένοι αγώνες';
            }
            
}
const displayCompletedGames = (completedGames) => {
    const completedGamesContainer = document.getElementById('completed-games');
    completedGamesContainer.innerHTML = ''; // Καθαρισμός προηγούμενου περιεχομένου

    if (completedGames.length === 0) {
        completedGamesContainer.innerHTML = '<p>Δεν υπάρχουν ολοκληρωμένοι αγώνες.</p>';
        return;
    }

    completedGames.forEach(game => {
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
};
// Φορτώνουμε τον επόμενο αγώνα όταν φορτωθεί το DOM
document.addEventListener('DOMContentLoaded', loadNextMatch);
