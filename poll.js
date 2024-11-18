document.addEventListener("DOMContentLoaded", function() {
    fetch('players.json')
    .then(response => response.json())
    .then(data => {
        
        document.querySelectorAll('.player').forEach(playerElement => {
            playerElement.addEventListener('mouseenter', (event) => {
                const playerId = event.target.getAttribute('data-player-id');
        
                // Προσθέτει κάθε παίκτη στο container
                samePositionPlayers.forEach(player => {
                    const playerImg = document.createElement('img');
                    playerImg.src = player.image;
                    playerImg.alt = player.name;
                    playerImg.title = player.name;
        
                    samePositionContainer.appendChild(playerImg);
                });
            });
        
        });        
        const players = data.players;
        console.log(players); 

        const playersContainer = document.getElementById('players-container');
        // Δημιουργία HTML για κάθε παίκτη και προσθήκη τους στη σελίδα

        if (!playersContainer) {
            console.error('Players container not found');
            return;
        }

        if (Array.isArray(players)){
            
            playersContainer.innerHTML = '';


            players.forEach(player => {
            

            // Δημιουργία HTML για την κάρτα του παίκτη
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            playerCard.onclick = () => selectPlayer(player.id);
            playerCard.innerHTML = `
                <img src="${player.image}" alt="${player.name}">
                <div class="player-info">
                    <h3 class="player-name">${player.name}</h3>
                    <p class="player-position">${player.position}</p>
                </div>
            `;

            // Προσθήκη της κάρτας παίκτη στο container
            playersContainer.appendChild(playerCard);

           
            });
        }
        else{
            console.error('Expected array but got:', players);
        }
        
            
        
    })
    .catch(error => console.error('Error loading players:', error));

    
    const voteButton = document.getElementById('submit-vote');
    //const playerList = document.getElementById('player-list');
    const resultsSection = document.getElementById('results-section');
    const notOpenSection = document.getElementById('not-open');
    const voteSection = document.getElementById('vote-section');
    // Check if voting is open
    const matchStartTime = new Date('2024-11-18T08:30:00'); // Time when match starts (for example)
    const matchEndTime = new Date(matchStartTime.getTime() + 105 * 60000); // 105 minutes after start
    const voteCloseTime = new Date(matchEndTime.getTime() + 30 * 60000); // 30 minutes after match end
    const currentTime = new Date();
    if (currentTime < matchStartTime || currentTime > voteCloseTime) {
        voteSection.style.display = 'none';
        notOpenSection.style.display = 'block';
    }

    let selectedPlayer = null;
    function selectPlayer(playerId) {
        selectedPlayer = playerId;
        voteButton.disabled = false; // Enable the vote button
    }

    voteButton.onclick = function() {
        if (selectedPlayer !== null) {
            // Save vote to the server (simulate here with localStorage)
            if (localStorage.getItem('voted')) {
                alert('Έχετε ήδη ψηφίσει!');
                return;
            }
            localStorage.setItem('voted', 'true');
            sendVoteToServer(selectedPlayer);
        }
    }
    function sendVoteToServer(playerId) {
        // Simulate sending the vote to the server and getting results
        fetch('/submit-vote', {
            method: 'POST',
            body: JSON.stringify({playerId}),
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(results => {
            displayResults(results);
        });
    }
    function displayResults(results) {
        voteSection.style.display = 'none';
        resultsSection.style.display = 'block';

        // Show MVP and percentages
        document.getElementById('mvp-name').textContent = results.mvp.name;
        document.getElementById('mvp-percentage').textContent = results.mvp.percentage;

        // Show other top players
        const topPlayersList = document.getElementById('top-players');
        results.topPlayers.forEach(player => {
            const li = document.createElement('li');
            li.textContent = `${player.name} - ${player.percentage}%`;
            topPlayersList.appendChild(li);
        });
    }
})