const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Ενεργοποιούμε την επεξεργασία JSON αιτημάτων
app.use(bodyParser.json());
app.use(express.static('public'));

// Διαδρομή για αποστολή ψήφων
app.post('/submit-vote', (req, res) => {
    const { playerId } = req.body;
    if (!playerId) {
        return res.status(400).send({ message: 'Player ID is required' });
    }

    // Διαβάζουμε τα δεδομένα ψήφων
    fs.readFile('votes.json', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error reading votes file' });
        }

        let votes = JSON.parse(data);
        if (!votes[playerId]) {
            votes[playerId] = 0;
        }
        votes[playerId] += 1;

        // Αποθηκεύουμε τις νέες ψήφους στο αρχείο
        fs.writeFile('votes.json', JSON.stringify(votes), (err) => {
            if (err) {
                return res.status(500).send({ message: 'Error saving votes' });
            }
            res.status(200).send({ message: 'Vote submitted successfully' });
        });
    });
});

// Διαδρομή για επιστροφή των αποτελεσμάτων
app.get('/results', (req, res) => {
    fs.readFile('votes.json', (err, data) => {
        if (err) {
            return res.status(500).send({ message: 'Error reading votes file' });
        }

        const votes = JSON.parse(data);

        // Υπολογίζουμε τον MVP και τους άλλους παίκτες
        let totalVotes = 0;
        let topPlayers = [];
        let maxVotes = 0;
        for (let playerId in votes) {
            totalVotes += votes[playerId];
            if (votes[playerId] > maxVotes) {
                maxVotes = votes[playerId];
            }
            topPlayers.push({ playerId, votes: votes[playerId] });
        }

        topPlayers = topPlayers.map(player => ({
            playerId: player.playerId,
            name: `Player ${player.playerId}`, // Εδώ μπορείς να βάλεις τα ονόματα των παικτών από το `players.json`
            percentage: ((player.votes / totalVotes) * 100).toFixed(2)
        }));

        // Βρίσκουμε τον MVP
        const mvp = topPlayers.find(player => player.votes === maxVotes);

        res.json({
            mvp,
            topPlayers
        });
    });
});

// Εκκίνηση του server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});