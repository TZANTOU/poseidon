const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// Path για το votes.json
const votesFilePath = path.join(__dirname, 'votes.json');

// Endpoint: Υποδοχή ψήφων
app.post('/submit-vote', (req, res) => {
    const { playerId } = req.body;

    // Έλεγχος αν υπάρχει playerId
    if (!playerId) {
        return res.status(400).json({ error: 'Player ID is required.' });
    }

    // Διαβάζει ή δημιουργεί το votes.json
    let votes = {};
    if (fs.existsSync(votesFilePath)) {
        try {
            votes = JSON.parse(fs.readFileSync(votesFilePath, 'utf-8'));
        } catch (err) {
            console.error("Error reading votes.json:", err); // Debugging
            return res.status(500).json({ error: 'Failed to read votes.' });
        }
    }

    // Έλεγχος αν υπάρχει ήδη ψήφος από το IP του χρήστη (προαιρετικό)
    const userIP = req.ip;
    if (!votes.meta) votes.meta = {}; // Μεταδεδομένα για τις ψήφους
    if (votes.meta[userIP]) {
        return res.status(403).json({ error: 'You have already voted.' });
    }
    votes.meta[userIP] = true;

    // Αυξάνει την ψήφο για τον playerId
    if (!votes[playerId]) votes[playerId] = 0;
    votes[playerId]++;

    // Ενημερώνει το votes.json
    fs.writeFile('votes.json', JSON.stringify(votes, null, 2), (err) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to save vote data.' });
        }
        
        // Επιστροφή των ενημερωμένων αποτελεσμάτων
        // Υπολογισμός αποτελεσμάτων
        const totalVotes = Object.values(votes).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
        const sortedResults = Object.entries(votes)
            .filter(([key]) => key !== 'meta') // Αφαιρεί το meta
            .map(([id, count]) => ({
                id,
                votes: count,
                percentage: ((count / totalVotes) * 100).toFixed(2),
            }))
            .sort((a, b) => b.votes - a.votes);

        const mvp = sortedResults[0] || { id: null, votes: 0, percentage: '0.00' };

        // Επιστροφή αποτελεσμάτων
        console.log("Votes:", votes);
        console.log("Sorted results:", sortedResults);
        console.log("MVP:", mvp);
        res.status(200).json({
            results: Object.fromEntries(Object.entries(votes).filter(([key]) => key !== 'meta')),
            mvp,
            allresults: sortedResults,
        });
    });


    
});

// Εκκίνηση του server
module.exports = app;