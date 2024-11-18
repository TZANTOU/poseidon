const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

const VOTES_FILE = 'votes.json';
const hasVoted = new Set();
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Something went wrong!' });
});
// Endpoint για αποστολή ψήφου
app.post('/submit-vote', (req, res) => {
    try{
        const { playerId } = req.body;
        app.set('trust proxy', true); // Επιτρέπει την ανάλυση του X-Forwarded-For
        const userIP =req.headers['x-forwarded-for'] || req.ip;
        console.log('Client IP:', userIP); // Καταγραφή της IP
        if (!playerId) {
            return res.status(400).send({ error: 'Player ID is required.' });
        }
        console.log(`Vote received for playerId: ${playerId}`);
        let votes;
            try {
                votes = JSON.parse(fs.readFileSync('VOTES_FILE', 'utf-8') || '{}');
            } catch (error) {
                votes = {}; // Δημιουργία νέου κενού αντικειμένου αν αποτύχει η ανάγνωση
            }
        
        if (hasVoted.has(userIP)){
            return res.status(403).send({ error: 'You have already voted.' });
        }
        hasVoted.add(userIP);
        votes[playerId] = (votes[playerId] || 0) + 1;

        fs.writeFileSync(VOTES_FILE, JSON.stringify(votes));
        

        const sortedVotes = Object.entries(votes).sort(([, a], [, b]) => b - a);
        const mvp = Object.keys(votes).reduce((topPlayer, player) => {
            if (!topPlayer || votes[player] > votes[topPlayer]) {
                return player;
            }
            return topPlayer;
        }, null);

        res.status(200).send({
            message: 'Vote registered successfully.',
            mvp:{id: mvp, votes: votes[mvp]},
            allResults:sortedVotes.map(([id,votes])=>({id,votes})),
        });
    }
    catch(error){
        console.error('Error in /submit-vote:', error);
        res.status(500).send({ error: 'Something went wrong!' });
    }
});

// Εξαγωγή του app χωρίς να το ξεκινάμε
module.exports = app;

// Αν το αρχείο τρέχει άμεσα, ξεκίνα τον server
if (require.main === module) {
    app.listen(3000, () => {
        console.log('Server running on http://localhost:3000');
    });
}