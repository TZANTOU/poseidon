document.addEventListener('DOMContentLoaded', () => {
    const accessToken = 'EAALnw97dIscBOzWVvrdfnmHuLlwyBE8iKEqZCgCMgsmLnnWWZAwSipT6vFrB4wQAjiTGHAQzEQ9POSFPNYGtExZBfzYKg9HqxWeDSIdNZBMSWJuGXnm7EqnQ01F67M6G7fipj5IYqyaIWH6S3FJdhPzIGrM8uwVQ4QKc9c8saQzqpxiy7zClpez0tUZCJ2ySQxVR7b1B2sY74kve6vAZDZD';
const pageId = '101671998906489';
const albumsEndpoint = `https://graph.facebook.com/v21.0/${pageId}/albums?fields=name,cover_photo,count&access_token=${accessToken}`;
fetch(albumsEndpoint)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      // Εντοπίζουμε το άλμπουμ "Φωτογραφίες χρονολογίου"
      const timelineAlbum = data.data.find(album => album.name === 'Φωτογραφίες χρονολογίου');
      if (!timelineAlbum) {
        throw new Error('Timeline Photos album not found.');
      }

      // URL για τις φωτογραφίες του συγκεκριμένου άλμπουμ
      const photosEndpoint = `https://graph.facebook.com/v21.0/${timelineAlbum.id}/photos?fields=source,name&access_token=${accessToken}`;
      loadPhotos(photosEndpoint); // Κλήση για φόρτωση φωτογραφιών
    })
    .catch(error => console.error('Error:', error));
});
function loadPhotos(url) {
    fetch(url)
    .then(response => {
      if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
      return response.json();
    })
    .then(data => {
      const albumsContainer = document.getElementById('albums-container');
      if (!albumsContainer) throw new Error('Albums container not found in the DOM.');

      // Προσθήκη φωτογραφιών στο DOM
      data.data.forEach(photo => {
        const img = document.createElement('img');
        img.src = photo.source;
        img.alt = photo.name || 'Facebook Photo';
        img.style.width = '800px';
        img.style.margin = '10px';
        albumsContainer.appendChild(img);
      });

      // Προσθήκη pagination αν υπάρχει επόμενη σελίδα
      if (data.paging && data.paging.next) {
        const loadMoreButton = document.createElement('button');
        loadMoreButton.textContent = 'Φόρτωση Περισσότερων';
        loadMoreButton.style.margin = '20px';
        albumsContainer.appendChild(loadMoreButton);

        loadMoreButton.addEventListener('click', () => {
          loadMoreButton.disabled = true; // Απενεργοποίηση του κουμπιού κατά τη διάρκεια της φόρτωσης
          loadPhotos(data.paging.next);  // Φορτώνει την επόμενη σελίδα
        });
      }
    })
    .catch(error => console.error('Error loading photos:', error));
}    

