const loadNextMatch = async () => {
    try {
        const response = await fetch('data/schedule.json'); // Φορτώνουμε το πρόγραμμα
        const schedule = await response.json();

        if (schedule && Array.isArray(schedule.games)){
        // Παίρνουμε το σημερινό timestamp
        const now = new Date().getTime();

        // Βρίσκουμε τον επόμενο αγώνα (τον πρώτο αγώνα μετά την τρέχουσα ημερομηνία)
        const nextMatch = schedule.games.find(game => new Date(game.date).getTime() > now);

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
            `;
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
