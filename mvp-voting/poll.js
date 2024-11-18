document.addEventListener("DOMContentLoaded", function() {
    fetch('players.json')
    .then(response => response.json())
    .then(data => {
        const playersContainer = document.getElementById('players-container');
        if (!playersContainer) {
            console.error('Players container not found');
            return;
        }
        // Δημιουργία HTML για κάθε παίκτη και προσθήκη τους στη σελίδα
      
        const players = data.players;

        if (Array.isArray(players)){
            
            playersContainer.innerHTML = '';


            players.forEach(player => {
            

            // Δημιουργία HTML για την κάρτα του παίκτη
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            const voteButton = document.createElement('button');
                voteButton.textContent = 'Ψήφισε';
                voteButton.classList.add('vote-button');
                voteButton.onclick = () => voteForPlayer(player.id);
            playerCard.innerHTML = `
                <img src="${player.image}" alt="${player.name}">
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-position">${player.position}</p>
                </div>
            `;
            playerCard.appendChild(voteButton);
            // Προσθήκη της κάρτας παίκτη στο container
            playersContainer.appendChild(playerCard);

           
            });
        }
        else{
            console.error('Expected array but got:', players);
        }
        
            
        
    })
    .catch(error => console.error('Error loading players:', error));

    
    //const voteButton = document.getElementById('submit-vote');
    //const playerList = document.getElementById('player-list');
    const resultsSection = document.getElementById('results-section');
    const notOpenSection = document.getElementById('not-open');
    const voteSection = document.getElementById('vote-section');
    // Check if voting is open
    const matchStartTime = new Date('2024-11-18T09:30:00'); // Time when match starts (for example)
    const matchEndTime = new Date(matchStartTime.getTime() + 105 * 60000); // 105 minutes after start
    const voteCloseTime = new Date(matchEndTime.getTime() + 30 * 60000); // 30 minutes after match end
    const currentTime = new Date();
    if (currentTime < matchStartTime || currentTime > voteCloseTime) {
        voteSection.style.display = 'none';
        notOpenSection.style.display = 'block';
    }

    function voteForPlayer(playerId) {
        // Ελέγχει αν έχει ήδη ψηφίσει
        //if (localStorage.getItem('voted')) {
       //     alert('Έχετε ήδη ψηφίσει!');
       //     return;
       // }

        // Στέλνει την ψήφο στον server
        sendVoteToServer(playerId);
    }
    function sendVoteToServer(playerId) {
        // Simulate sending the vote to the server and getting results
        fetch('http://127.0.0.1:5500/submit-vote', {
            method: 'POST',
            body: JSON.stringify({playerId}),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response =>{
            console.log(response); 
            if (!response.ok) {
                console.error(`Response status: ${response.status}, ${response.statusText}`);
                throw new Error('Failed to submit vote.');
            }
            return  response.json();
        })
        
        
        .then(results => {
            localStorage.setItem('voted', 'true'); // Αποθήκευση της ψήφου στον localStorage
            displayResults(results);
            console.log('Results from server:', results);
        });
        
    }
    
    function displayResults(results) {
    
        if (voteSection) voteSection.style.display = 'none';
        if (resultsSection) resultsSection.style.display = 'block';


        // Show MVP and percentages
        const mvpName = document.getElementById('mvp-name');
        const mvpPercentage = document.getElementById('mvp-percentage');
        if (mvpName && mvpPercentage) {
            mvpName.textContent = results.mvp.name;
            mvpPercentage.textContent = results.mvp.percentage;
        }

        // Show other top players
        const topPlayersList = document.getElementById('top-players');
        if (topPlayersList) {
            topPlayersList.innerHTML = ''; // Καθαρισμός λίστας
            results.allresults.forEach(player => {
                const li = document.createElement('li');
                li.textContent = `${player.name} - ${player.percentage}%`;
                topPlayersList.appendChild(li);
            });
            console.log('Results from server:', results);
        }
        
    }
    
})