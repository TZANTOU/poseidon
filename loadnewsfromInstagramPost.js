const instagramUserId = 'USER_ID';  // Το ID του Instagram χρήστη @poseidon_didumon
const accessToken = 'ACCESS_TOKEN'; // Το Access Token από το Instagram API

const loadInstagramPosts = async () => {
  try {
    const response = await fetch(`https://graph.instagram.com/${instagramUserId}/media?fields=id,caption,media_url&access_token=${accessToken}`);
    const data = await response.json();
    
    if (data && data.data && Array.isArray(data.data)) {
      // Παίρνουμε το πρώτο post (πιο πρόσφατο)
      const latestPost = data.data[0];

      // Δημιουργούμε άρθρο με βάση το Instagram post
      const newArticle = {
        title: 'Instagram Post',
        date: new Date().toISOString().split('T')[0], // Τρέχουσα ημερομηνία
        imageUrl: latestPost.media_url, // Η εικόνα από το post
        description: latestPost.caption.split('.')[0] + '.', // Η πρώτη πρόταση της περιγραφής
        content: latestPost.caption // Όλο το περιεχόμενο του post
      };

      // Φόρτωσε το υπάρχον JSON άρθρων και πρόσθεσε το νέο άρθρο
      const responseArticles = await fetch('data/latest-news.json');
      const articlesData = await responseArticles.json();
      articlesData.articles.unshift(newArticle); // Πρόσθεσε το νέο άρθρο στην αρχή του array

      // Σώσε το ανανεωμένο JSON αρχείο (απαιτεί backend)
      await saveUpdatedArticles(articlesData);  // Αυτή η λειτουργία πρέπει να υλοποιηθεί στο backend

      console.log('Το άρθρο προστέθηκε με επιτυχία από το Instagram!');
    } else {
      console.error('Δεν βρέθηκαν posts ή το format δεν είναι σωστό');
    }
  } catch (error) {
    console.error('Σφάλμα κατά τη λήψη των δεδομένων από το Instagram:', error);
  }
};

const saveUpdatedArticles = async (articlesData) => {
  // Εδώ θα χρειαστείς μια λειτουργία backend για να αποθηκεύσεις το ενημερωμένο JSON
  try{
    const response = await fetch('http:/http://127.0.0.1:5500/update-news',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(articlesData)
    });

    if(response.ok){
      console.log('Το άρθρο αποθηκεύτηκε με επιτυχία')
    }
    else{
      console.log('Σφάλμα κατά την φόρτωση του άρθρου')
    }
  }catch(error){
    console.error('Σφάλμα κατά την λήψη των δεδομένων:', error)
  }



};

// Φόρτωσε τα posts από το Instagram όταν φορτωθεί η σελίδα
document.addEventListener('DOMContentLoaded', loadInstagramPosts);