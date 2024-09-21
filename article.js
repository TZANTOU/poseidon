const loadArticle = async() =>{
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');

    try{
        const response = await fetch('data/latest-news.json');
        const data = await response.json();

        const article = data.articles[articleId];
        if(article){
            document.getElementById('article-title').textContent = article.title;
            document.getElementById('article-date').textContent = article.date;
            document.getElementById('article-img').src = article.imageUrl;
            document.getElementById('article-content').innerHTML = article.content;
            document.getElementById('article-description').innerHTML = article.description;
        }
        else{
            document.getElementById('article-content').textContent = 'Δεν βρέθηκε Άρθρο. ';
        }
    }catch(error){
        console.error('Error loading article:', error);
        document.getElementById('article-content').textContent = 'Σφάλμα κατά τη φόρτωση του άρθρου.';
    
    }
};
document.addEventListener('DOMContentLoaded', loadArticle);