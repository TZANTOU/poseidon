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
            
            const moment = moments[momentIndex];

            await fetchPhotoFromFacebook(moment.url, moment.caption);
        }
    } catch (error) {
        console.error("Error loading moments:", error);
    }
};

const fetchPhotoFromFacebook = async (momentUrl, caption) => {
    try {
        // Παίρνουμε το όνομα της εικόνας από το URL
        const photoName = momentUrl.split('/').pop().split('?')[0];  // π.χ. "463479413_589335530138350_8760454376248246463_n.jpg"

        // Ερώτημα στο Facebook Graph API για να βρούμε την εικόνα με το ίδιο όνομα
        const accessToken = 'EAALnw97dIscBOyzu3evJZBsfZBkdXqK3QWbbWhUxzdURRyLRlZBo1uQ8Aqtn5ZBaQru67JOFUFiUzHoLgb0grfatMuCEcAHhKTE6yk0L4QBNZA5HrhnnaLcro3LFr1sUa8jLSll6cuAAU3R9CX61OWZARrJ9C2ZBzWAfoRZBtS3HtVq2ZAiTe89RsTWYeIyK80jBKisBu0Vt9ZC15kRcQvYAZDZD';
        const pageId = '101671998906489';
        const photosEndpoint = `https://graph.facebook.com/v21.0/${pageId}/photos?fields=source,name&access_token=${accessToken}`;

        const response = await fetch(photosEndpoint);
        const data = await response.json();

        // Βρίσκουμε την φωτογραφία με το ίδιο όνομα
        const photo = data.data.find(p => p.name && p.name.includes(photoName));
        
        if (photo) {
            // Εμφάνιση της φωτογραφίας
            displayMoment(photo.source, caption);
        } else {
            console.error("Photo not found on Facebook with name:", photoName);
        }
    } catch (error) {
        console.error("Error fetching photo from Facebook:", error);
    }
};


const displayMoment = (photoUrl, caption) => {
    const container = document.getElementById('random-moment');
    container.innerHTML = `
        <h2>Moment of the Day</h2>
        <img src="${photoUrl}" alt="Moment">
        <p>${caption}</p>
    `;
};

document.addEventListener('DOMContentLoaded', loadRandomMoment);