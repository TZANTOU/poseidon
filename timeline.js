function isMobile() {
    return window.innerWidth <= 768; // Αν η οθόνη έχει πλάτος <= 768px, θεωρείται κινητό
}

const events = document.querySelectorAll('.event');

// Αντιστοιχίες μεταξύ χρονιάς και φωτογραφίας
const photos = {
    "1956": "images/1956.jpg",
    "1970": "images/1970.jpg",
    "1979": "images/1979.jpg",
    "1985": "images/1985.jpg",
    "1986": "images/1986.jpg",
    "1994": "images/1994.jpg",
    "1995": "images/1995.jpg",
    "1997": "images/1997.jpg",
    "2016": "images/2016.jpg"
};

// Προσθήκη event listeners σε κάθε χρονιά για την εμφάνιση της φωτογραφίας
events.forEach(event => {
    
    const year = event.getAttribute('data-year');
    const photoSrc = photos[year];

    if (photoSrc) {
        // Δημιουργία νέου στοιχείου εικόνας και προσθήκη στο DOM
        let photoElement = document.createElement('img');
        photoElement.src = photoSrc;
        photoElement.classList.add('photo');
        event.appendChild(photoElement);
    }
    
});
function enableDesktopHover() {
    events.forEach(event => {
        event.addEventListener('mouseenter', () => {
            const img = event.querySelector('img');
            img.classList.add('show');
        });

        event.addEventListener('mouseleave', () => {
            const img = event.querySelector('img');
            img.classList.remove('show');
        });
    });
}
function enableMobileScroll() {
    const observerOptions = {
        root: null,  // Παρακολουθούμε σε όλη την οθόνη
        rootMargin: '0px',
        threshold: 0.5  // Ενεργοποίηση όταν το 50% του στοιχείου είναι ορατό
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const photoElement = entry.target.querySelector('img');

            if (entry.isIntersecting) {
                // Προσθήκη της κλάσης για τη μεγέθυνση
                photoElement.classList.add('show');
            } else {
                // Αφαίρεση της κλάσης όταν δεν είναι στο κέντρο της οθόνης
                photoElement.classList.remove('show');
            }
        });
    }, observerOptions);

    events.forEach(event => {
        observer.observe(event);
    });
}
function initializeInteraction() {
    if (isMobile()) {
        enableMobileScroll();
    } else {
        enableDesktopHover();
    }
}

// Ενεργοποίηση του σωστού χειρισμού με βάση το μέγεθος της οθόνης
initializeInteraction();

// Αναπροσαρμογή όταν αλλάζει το μέγεθος της οθόνης
window.addEventListener('resize', () => {
    // Καθαρισμός παλιών event listeners
    events.forEach(event => {
        event.replaceWith(event.cloneNode(true));
    });

    initializeInteraction();
});