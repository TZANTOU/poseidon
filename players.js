/*
const playersData = {
    "players": [
        {
            "name": "Αργύρης Αλευράς",
            "position": "GK",
            "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTo6kZKSErPmqDKxIzTWHuB2UuAY8K4CFTI9Q&s"
        },
        {
            "name": "Αποστόλης Οικονομόπουλος",
            "position": "CB",
            "imageUrl": "https://i.ytimg.com/vi/wWyD7PakZ2A/hq720.jpg"
        },
        {
            "name": "Παναγιώτης Σκαλτσάς",
            "position": "CB",
            "imageUrl": "https://argolidatv.gr/wp-content/uploads/2024/01/421516283_422014303537141_8758062610976938688_n.webp"
        },
        {
            "name": "Αλκιβιάδης Καζάς",
            "position": "LB/RB",
            "imageUrl": "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhrg0gka0vtJMOabsbNg7sva3Wyc8nCxg58Z87YfhsMYnzporqJtmPt9ZpfHHrUF7vnMdHhmUO2U2efDbZKq8aqGxZfZBLrkWwArDh6oiMu-lrSjfhydnUrDGrFv6i-8LgBI4Dmi1TyRlI/s1600/1639034628435116-0.png"
        },
        {
            "name": "Χριστόφορος Κουτσοποδιώτηςsss",
            "position": "RB/CDM/CAMm",
            "imageUrl": "https://es.pinterest.com/christopherkouts/"
        },
        {
            "name": "Agustin Tresa",
            "position": "CDM/CAM",
            "imageUrl": "https://i.ytimg.com/vi/wWyD7PakZ2A/hq720.jpg"
        },
        {
            "name": "Χρήστο Κέλλι",
            "position": "ST/RW/LW/CAM",
            "imageUrl": "https://www.argolidaportal.gr/sites/default/files/field/gallery/kely_dsc_4408.jpg"
        },
        {
            "name": "Ανάργυρος Αποστόλου",
            "position": "RW",
            "imageUrl": "https://cdn.inflact.com/media/439001024_453949020503827_7700203124534984803_n.heic?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.29350-15%2F439001024_453949020503827_7700203124534984803_n.heic%3Fse%3D7%26stp%3Ddst-jpg_e35%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_cat%3D107%26_nc_ohc%3Dh4djQYTEND4Q7kNvgGrlugB%26_nc_gid%3D658f112834e6489b9cfe3ba60f7610d0%26edm%3DAPs17CUBAAAA%26ccb%3D7-5%26ig_cache_key%3DMzM0OTY4Mjg3OTg0MjI4NTY2NA%253D%253D.3-ccb7-5%26oh%3D00_AYAV8T8n6Ps_Nc0TRq-yh8IqGFMOad-ltlw0tvHPjLHEzA%26oe%3D66EFCE42%26_nc_sid%3D10d13b&time=1726603200&key=9bcae684923775d2b5d10cc76454c426"
        },
        {
            "name": "Ανάργυρος Λαζάρου",
            "position": "CB/CDM",
            "imageUrl": "https://i.ytimg.com/vi/wWyD7PakZ2A/hq720.jpg"
        },
        {
            "name": "Νικόλας Λαζάρου",
            "position": "ST",
            "imageUrl": "https://cdn.inflact.com/media/438946103_747683384157231_5344038833085242736_n.heic?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.29350-15%2F438946103_747683384157231_5344038833085242736_n.heic%3Fse%3D7%26stp%3Ddst-jpg_e35%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_cat%3D103%26_nc_ohc%3D7zU0PNkaVLcQ7kNvgFL-d8i%26_nc_gid%3D79a2e1746095423cba30a5d43661f9d3%26edm%3DAPs17CUBAAAA%26ccb%3D7-5%26ig_cache_key%3DMzM0ODM2MTQ4ODI3NDc1Njk4MQ%253D%253D.3-ccb7-5%26oh%3D00_AYD8aWKlVTgk9DGfrI1qAojZ1UomD8DbPsLLcqy_Eaxh9g%26oe%3D66EFB272%26_nc_sid%3D10d13b&time=1726603200&key=0ea3e08b7a3c709196e8fede5c495920"
        },
        {
            "name": "Γιώργος Μπάρδης",
            "position": "LB",
            "imageUrl": "https://cdn.inflact.com/media/438707665_409658461699216_3314803693549327640_n.heic?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.29350-15%2F438707665_409658461699216_3314803693549327640_n.heic%3Fstp%3Ddst-jpg_e35%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_cat%3D104%26_nc_ohc%3D0x117m9b2vwQ7kNvgH_XRTq%26edm%3DAPs17CUBAAAA%26ccb%3D7-5%26ig_cache_key%3DMzM0NTkxNTU0MjQ1MDM5NTM3MQ%253D%253D.3-ccb7-5%26oh%3D00_AYBd_m8jDTCxJB03H1CbcWHh8j5KLYUuZYcR5V5gsJ-_BQ%26oe%3D66EF9B98%26_nc_sid%3D10d13b&time=1726603200&key=9f4fe32fed5a8d3ca6200080c22b4765"
        },
        {
            "name": "Φάνης Παπασταύρου",
            "position": "CM/RB",
            "imageUrl":"https://cdn.inflact.com/media/459230141_1432559064088309_5582667884287026845_n.heic?url=https%3A%2F%2Fscontent.cdninstagram.com%2Fv%2Ft51.29350-15%2F459230141_1432559064088309_5582667884287026845_n.heic%3Fstp%3Ddst-jpg_e35%26_nc_ht%3Dscontent.cdninstagram.com%26_nc_cat%3D101%26_nc_ohc%3DFnF8sUTltm8Q7kNvgHK-eBm%26_nc_gid%3D5e38bd69a520402083f70703743221a9%26edm%3DAPs17CUBAAAA%26ccb%3D7-5%26oh%3D00_AYC6bu2EUkgIj1hAhrg4KS8DZtlpacZoOa5xtmb2jzsmmg%26oe%3D66EFCDE3%26_nc_sid%3D10d13b&time=1726603200&key=361d7b0bdba96515c081d933fb5c3090"
        }
    ]
};

// Επιλέγουμε το container όπου θα τοποθετηθούν οι καρτέλες
const playersContainer = document.getElementById('players-container');

// Λειτουργία για τη δημιουργία καρτελών
playersData.players.forEach(player => {
    // Δημιουργούμε το div για την καρτέλα του παίκτη
    const playerCard = document.createElement('div');
    playerCard.classList.add('player-card');

    // Δημιουργούμε το img στοιχείο για την εικόνα του παίκτη
    const playerImage = document.createElement('img');
    playerImage.src = player.imageUrl;
    playerImage.alt = player.name;

    // Δημιουργούμε το στοιχείο για το όνομα του παίκτη
    const playerName = document.createElement('h3');
    playerName.classList.add('player-name');
    playerName.textContent = player.name;

    // Δημιουργούμε το στοιχείο για τη θέση του παίκτη
    const playerPosition = document.createElement('p');
    playerPosition.classList.add('player-position');
    playerPosition.textContent = player.position;

    // Προσθέτουμε τα στοιχεία στην καρτέλα
    playerCard.appendChild(playerImage);
    playerCard.appendChild(playerName);
    playerCard.appendChild(playerPosition);

    // Προσθέτουμε την καρτέλα στο container
    playersContainer.appendChild(playerCard);
});
*/
let votes = {}; // Αντικείμενο για τις ψήφους των παικτών

// Φόρτωση των παικτών από το players.json
fetch('players.json')
    .then(response => response.json())
    .then(data => {
        
        document.querySelectorAll('.player').forEach(playerElement => {
            playerElement.addEventListener('mouseenter', (event) => {
                const playerId = event.target.getAttribute('data-player-id');
                const currentPlayer = players.find(player => player.id == playerId);
        
                // Βρίσκει όλους τους παίκτες της ίδιας θέσης
                const samePositionPlayers = players.filter(player => player.position === currentPlayer.position);
        
                // Καθαρίζει το container των παικτών της ίδιας θέσης
                const samePositionContainer = document.getElementById('same-position-players');
                samePositionContainer.innerHTML = '';
                samePositionContainer.classList.remove('hidden');
        
                // Προσθέτει κάθε παίκτη στο container
                samePositionPlayers.forEach(player => {
                    const playerImg = document.createElement('img');
                    playerImg.src = player.image;
                    playerImg.alt = player.name;
                    playerImg.title = player.name;
        
                    samePositionContainer.appendChild(playerImg);
                });
            });
        
            // Κρυφή η λίστα όταν δεν γίνεται hover
            playerElement.addEventListener('mouseleave', () => {
                const samePositionContainer = document.getElementById('same-position-players');
                samePositionContainer.classList.add('hidden');
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

    function sendVoteToServer(playerId) {
        fetch('/api/vote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ playerId: playerId })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Vote registered:', data);
        })
        .catch(error => console.error('Error sending vote:', error));
    }
    
    // Στο event listener της ψήφου
    playerCard.querySelector('.vote-button').addEventListener('click', function() {
        votes[player.id]++;
        document.getElementById(`player-${player.id}-votes`).innerText = votes[player.id];
        sendVoteToServer(player.id); // Αποστολή ψήφου στον server
    });

