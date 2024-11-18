const express = require('express');
const fs = require('fs');

const app = express();
app.use(express.json());

const VOTES_FILE = './votes.json';

const readVotes = () => {
    if (!fs.existsSync(VOTES_FILE)) {
        return {};
    }
    const data = fs.readFileSync(VOTES_FILE, 'utf8');
    return JSON.parse(data);
};
const writeVotes = (votes) => {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votes, null, 2));
};
app.post('/submit-vote', (req, res) => {
    const { playerId } = req.body;

    if (!playerId) {
        return res.status(400).json({ error: 'No player ID provided' });
    }

    const votes = readVotes();

    // Αύξηση ψήφου για τον παίκτη
    if (!votes[playerId]) {
        votes[playerId] = 0;
    }
    votes[playerId] += 1;

    writeVotes(votes);

    // Υπολογισμός MVP και επιστροφή δεδομένων
    const totalVotes = Object.values(votes).reduce((sum, count) => sum + count, 0);
    const mvp = Object.keys(votes).reduce((a, b) => (votes[a] > votes[b] ? a : b));

    res.json({
        mvp: { name: mvp, percentage: ((votes[mvp] / totalVotes) * 100).toFixed(2) },
        topPlayers: Object.entries(votes)
            .sort(([, a], [, b]) => b - a)
            .map(([name, count]) => ({
                name,
                percentage: ((count / totalVotes) * 100).toFixed(2),
            })),
    });
});

// Εκκίνηση του server
app.listen(3000, () => {
    console.log(`Server running on http://localhost:3000`);
});