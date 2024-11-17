
// Φόρτωση των παικτών από το players.json
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

