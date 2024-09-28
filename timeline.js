function isMobile() {
    return window.innerWidth <= 768; // Αν η οθόνη έχει πλάτος <= 768px, θεωρείται κινητό
}

const events = document.querySelectorAll('.event');

// Αντιστοιχίες μεταξύ χρονιάς και φωτογραφίας
const photos = {
    "1956": "images/1954.jpg",
    "1970": "images/1970.jpg",
    "1979": "images/1979.jpg",
    "1985": "images/1985.jpg",
    "1986": "images/1986-kefalonia.jpg",
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

document.addEventListener('DOMContentLoaded', function () {
    const albums = {
        "1956-1970": [
            { src: '1954.jpg', caption: 'Ιδρυτική Φωτογραφία 1956' },
            { src: '1959.jpg', caption: '1959 Παλαιό Γήπεδο Διδύμων' },
            { src: '1970.jpg', caption: '1970 Γήπεδο Ερμιόνης' },

        ],
        "1971-1984": [
            {src:'1972.jpg', caption:'1972, Παλαιό Γήπεδο Κοιλάδας'},
            {src:'1974.jpg', caption:'1974'},
            {src:'1976.jpg', caption:'1976'},
            {src:'1978.jpg', caption:'1978, Γήπεδο Ερμιόνης, Ύδρα - Ποσειδώνας Διδύμων 2-4'},
            { src: '1979.jpg', caption: '1979' },
            {src:'1979-argos.jpg', caption:'1979, Γήπεδο Παναργειακού'},
            {src:'1980-kiveri.jpg', caption:'1980, Ποσειδώνας Διδύμων - Ερμής Κιβερίου 2-2'},
            {src:'1980.jpg', caption:'1980, Γήπεδο Ερμιόνης'},
            {src:'1981.jpg', caption:'1981'},
            {src:'1982-1-1--portoxeli.jpg', caption: '1982 Πορτοχελιακός - Ποσειδώνας Διδύμων 1-1'},
            { src: '1982.jpg', caption: '1982' },
            {src:'1984.jpg', caption:'1984 Αργέας - Ποσειδώνας Διδύμων 1-4, Γήπεδο Παναργειακού'},
            {src:'1984-xwnika-poseidon-1-1.jpg',caption:'1984, Γήπεδο Χώνικα, Χώνικα - Ποσειδώνας Διδύμων 1-1'}
        ],
        "1985-1997": [
            { src: '1985-kupello-4-0--drepano.jpg', caption: '1985 Ποσειδώνας Διδύμων - Αστέρας Δρεπανιακός 4-0 Κύπελλο' },
            { src: '1985-2-2--panargeiakos.jpg', caption: '1985 Παναργειακός - Ποσειδώνας Διδύμων 2-2, Δ΄ Εθνική' },
            { src: '1986-kefalonia.jpg', caption: '1986 γήπεδο Κεφαλονιάς, Δ΄ Εθνική' }
        ],
        "1998-now": [
            { src: '2017.jpg', caption: '2017' },
            {src:'458108354_555380303533873_7713678727587974578_n.jpg', caption:'2024, Φιλικό Προετοιμασίας στον Γαλατά'}
        ]
    };

    const initialLoadCount = 10;

    function loadPhotos(category, container, count) {
        if (albums[category] && albums[category].length > 0) {
            const photos = albums[category].slice(0, count);
            container.innerHTML = ''; // Καθαρίζει το container

            photos.forEach(photoObj => {
                const photoContainer = document.createElement('div');
                photoContainer.classList.add('photo-container'); // Προσθέτουμε ένα div για κάθε εικόνα και λεζάντα

                const img = document.createElement('img');
                img.src = `images/${category}/${photoObj.src}`;
                img.alt = `${photoObj.caption}`;
                
                // Προσθέτουμε ένα event για να επιβεβαιώσουμε αν η εικόνα φορτώνει σωστά
                img.onerror = function() {
                    console.error(`Η εικόνα ${img.src} δεν φορτώθηκε σωστά.`);
                };

                // Δημιουργούμε ένα στοιχείο για τη λεζάντα
                const caption = document.createElement('div');
                caption.classList.add('caption');
                caption.textContent = photoObj.caption;

                // Προσθέτουμε την εικόνα και τη λεζάντα στο photoContainer
                photoContainer.appendChild(img);
                photoContainer.appendChild(caption);

                // Προσθέτουμε το photoContainer στο κύριο container
                container.appendChild(photoContainer);
            });
        } else {
            console.error(`Δεν βρέθηκαν φωτογραφίες για την κατηγορία: ${category}`);
        }
    }

    // Αρχική φόρτωση φωτογραφιών
    document.querySelectorAll('.album-category').forEach(categoryDiv => {
        const category = categoryDiv.id.replace('album-', ''); // Παίρνουμε την κατηγορία
        const container = categoryDiv.querySelector('.photos');
        loadPhotos(category, container, initialLoadCount);
    });

    // Event listener για το κουμπί "Φόρτωση Περισσότερων"
    document.querySelectorAll('.load-more').forEach(button => {
        button.addEventListener('click', function () {
            const category = this.dataset.category;
            const container = document.getElementById(`photos-${category}`);
            const currentPhotoCount = container.childElementCount;
            loadPhotos(category, container, currentPhotoCount + 10);

            if (currentPhotoCount + 10 >= albums[category].length) {
                this.style.display = 'none';
            }
        });
    });
});
