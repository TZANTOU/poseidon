const loadNextMatch = async () => {
    try {
        const response = await fetch('data/schedule.json'); // Φορτώνουμε το πρόγραμμα
        const schedule = await response.json();

        if (schedule && Array.isArray(schedule.games)){
        // Παίρνουμε το σημερινό timestamp
        const now = new Date();

        // Βρίσκουμε τον επόμενο αγώνα (τον πρώτο αγώνα μετά την τρέχουσα ημερομηνία)
        const nextMatch = schedule.games.find(game => {const matchDate = new Date(game.date); return matchDate.getTime() >= now.getTime();});

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
    }else{
        console.error('Η μορφή των δεδομένων δεν είναι σωστή');
    }
    } catch (error) {
        console.error('Error loading next match data:', error);
    }
};

// Φορτώνουμε τον επόμενο αγώνα όταν φορτωθεί το DOM
document.addEventListener('DOMContentLoaded', loadNextMatch);
