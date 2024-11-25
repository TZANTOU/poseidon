//document.addEventListener("DOMContentLoaded", () => {
    // Βρες όλες τις εικόνες στη σελίδα
    //const images = document.querySelectorAll('img');

  //  images.forEach(img => {
 //       img.addEventListener('error', () => {
//            const brokenUrl = img.src;
//            console.warn(`Image not loaded: ${brokenUrl}`);

            // Κάλεσε το Facebook Graph API για αναζήτηση
//            searchImageOnFacebook(brokenUrl)
//                .then(newImageUrl => {
//                    if (newImageUrl) {
//                        img.src = newImageUrl; // Αντικατάσταση εικόνας
//                    } else {
//                        img.alt = 'Image not found'; // Εναλλακτικό κείμενο
//                    }
//                })
//                .catch(err => {
//                    console.error("Error searching image on Facebook:", err);
//                    img.alt = 'Image not found';
//                });
//        });
//    });
//});

// Συνάρτηση αναζήτησης στο Facebook API
//async function searchImageOnFacebook(imageUrl) {
//    const accessToken = 'EAALnw97dIscBO3jbZBQJBhpftAeWVQyEJzhzEhNxcla5mNlYuGM9665DKKFGvxZAZACS36RRyvxdaan2QMN3s8TsEaRw0wJebhZCbxYENi6Byueike8Fu2ZBhlIz1teJOFC8J7Yc2ZBLGzZCGYhvfkMRKb3vNRRiccFgwHzYD2qrYBHcn4IJhWaK8LNU5ZCuPr6s5yu7yrkrY2jMZAAuMbEi0FMsZD'; // Αντικατέστησε με το δικό σου Access Token
//    const searchEndpoint = `https://graph.facebook.com/v21.0/search`;

//    try {
//        const response = await fetch(`${searchEndpoint}?q=${encodeURIComponent(imageUrl)}&type=photo&access_token=${accessToken}`);
//        const data = await response.json();

//        if (data && data.data && data.data.length > 0) {
//            // Επέστρεψε το πρώτο αποτέλεσμα
//            return data.data[0].source;
//        } else {
//            console.warn('No image found on Facebook for URL:', imageUrl);
//            return null;
//        }
//    } catch (error) {
//        console.error("Error in Facebook API call:", error);
//        return null;
//    }
//}

async function findPhotoInAlbum(albumId, filename, accessToken) {
    const photosApiUrl = `https://graph.facebook.com/v21.0/${albumId}/photos?fields=images&access_token=${accessToken}`;

    try {
        const response = await fetch(photosApiUrl);
        const data = await response.json();

        if (data && data.data) {
            const matchingPhoto = data.data.find(photo => 
                photo.id.includes(filename.split('_')[0])
            );

            if (matchingPhoto) {
                console.log("Matching photo found:", matchingPhoto);
                return matchingPhoto.images[0].source;// Επιστρέφει το πρώτο URL της εικόνας
            } else {
                console.warn("No matching photo found for filename:", filename);
                return null;
            }
        } else {
            console.error("Error fetching photos:", data.error);
            return null;
        }
    } catch (error) {
        console.error("Error connecting to Facebook API:", error);
        return null;
    }
}

// Παράδειγμα χρήσης
document.addEventListener('DOMContentLoaded', async () => {
    const accessToken = 'EAALnw97dIscBO3jbZBQJBhpftAeWVQyEJzhzEhNxcla5mNlYuGM9665DKKFGvxZAZACS36RRyvxdaan2QMN3s8TsEaRw0wJebhZCbxYENi6Byueike8Fu2ZBhlIz1teJOFC8J7Yc2ZBLGzZCGYhvfkMRKb3vNRRiccFgwHzYD2qrYBHcn4IJhWaK8LNU5ZCuPr6s5yu7yrkrY2jMZAAuMbEi0FMsZD'; // Αντικατέστησε με το δικό σου token
    const pageId = '101671998906489'; // Αντικατέστησε με το ID της σελίδας/χρήστη
    const albumId = '193994029672504';
    const filename = 'https://www.facebook.com/photo/?fbid=589302596808310&set=a.193994029672504';
    const imageUrl = await findPhotoInAlbum(albumId, filename, accessToken);
    if (imageUrl) {
        console.log("Found image URL:", imageUrl);
        document.getElementById('target-image').src = imageUrl;
    } else {
        console.warn("Image not found in the album.");
    }
});