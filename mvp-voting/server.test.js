const request = require('supertest');
const fs = require('fs');
const app = require('./server'); // Το αρχείο Express server

describe('POST /submit-vote', () => {
    
    beforeEach(() => {
        // Reset votes.json πριν από κάθε τεστ
        fs.writeFileSync('votes.json', JSON.stringify({}));
        // Καθαρισμός του set ψήφων IP
        
    });
    it('should add a vote for a player and return updated results', async () => {
        const res = await request(app)
            .post('/submit-vote')
            .send({ playerId: 'player1' })
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toBe(200);
        expect(res.body.mvp.id).toBe('player1');
    });

    it('should return 400 if playerId is missing', async () => {
        const res = await request(app)
            .post('/submit-vote')
            .send({})
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('Player ID is required.');
    });

    it('should prevent duplicate voting voting using IP simulation', async () => {
        // Προσομοίωση πρώτης ψήφου
        const res1 = await request(app)
        .post('/submit-vote')
        .set('X-Forwarded-For', '123.45.67.1') // Πρώτη IP
        .send({ playerId: 'player1' })
        .set('Content-Type', 'application/json');

        expect(res1.statusCode).toBe(200); // Πρέπει να γίνει δεκτή
        // Προσπάθεια δεύτερης ψήφου από την ίδια IP
        const res2 = await request(app)
        .post('/submit-vote')
        .set('X-Forwarded-For', '123.45.67.1') // Ίδια IP
        .send({ playerId: 'player1' })
        .set('Content-Type', 'application/json');

        expect(res2.statusCode).toBe(403); // Πρέπει να απορριφθεί
        expect(res2.body.error).toBe('You have already voted.');
        // Προσπάθεια ψήφου από νέα IP
        const res3 = await request(app)
        .post('/submit-vote')
        .set('X-Forwarded-For', '123.45.67.2') // Διαφορετική IP
        .send({ playerId: 'player2' })
        .set('Content-Type', 'application/json');

        expect(res3.statusCode).toBe(200); // Πρέπει να γίνει δεκτή
    });
    it('should show updated results immediately after voting', async () => {
        // Προσομοίωση ψήφου
        const res = await request(app)
            .post('/submit-vote')
            .send({ playerId: 'player1' })
            .set('Content-Type', 'application/json');
    
        expect(res.statusCode).toBe(200);
    
        // Ελέγχει αν επιστρέφονται τα σωστά αποτελέσματα
        
        expect(res.body.results).toEqual({ player1: 1 });
        expect(res.body.mvp.id).toBe('player1');
        expect(res.body.mvp.votes).toBe(1);
    });
});