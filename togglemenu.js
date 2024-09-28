document.addEventListener('DOMContentLoaded', () => {
    // Βρίσκουμε το κουμπί και το μενού
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.main-menu');

    // Όταν ο χρήστης πατάει το κουμπί, εναλλάσσουμε την εμφάνιση του μενού
    menuToggle.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });
});
