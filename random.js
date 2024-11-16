const loadRandomMoment = async () => {
    try {
        const response = await fetch('data/moments.json');
        const data = await response.json();
        const moments = data.moments;
        
        
        if (moments.length > 0) {
            const today = new Date();
            const todayString = today.toISOString().slice(0, 10);
            const savedMomentIndex = localStorage.getItem('dailyMomentIndex');
            const savedDate = localStorage.getItem('dailyMomentDate');

            if (savedDate === todayString && savedMomentIndex !== null) {
                displayMoment(moments[savedMomentIndex]);
            }

            // Δημιουργούμε έναν ημερήσιο δείκτη με βάση την ημερομηνία
            const dayIndex = today.getFullYear() + today.getMonth() + today.getDate();
            const momentIndex = dayIndex % moments.length;

            // Αποθηκεύουμε το τυχαίο στιγμιότυπο για την τρέχουσα ημέρα
            localStorage.setItem('dailyMomentIndex', momentIndex);
            localStorage.setItem('dailyMomentDate', todayString);

            displayMoment(moments[momentIndex]);
        }
    } catch (error) {
        console.error("Error loading moments:", error);
    }
};


const displayMoment = (moment) => {
    const container = document.getElementById('random-moment');
    container.innerHTML = `
        <h2>Moment of the Day</h2>
        <img src="${moment.url}" alt="Moment">
        <p>${moment.caption}</p>
    `;
};

document.addEventListener('DOMContentLoaded', loadRandomMoment);