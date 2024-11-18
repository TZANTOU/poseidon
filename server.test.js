const request = require('supertest');
const fs = require('fs');
const app = require('./server'); // Το αρχείο Express server

describe('POST /submit-vote', () => {
    beforeEach(() => {
        // Reset votes.json πριν από κάθε τεστ
        fs.writeFileSync('votes.json', JSON.stringify({}));
    });

    it('should add a vote for a player and return updated results', async () => {
        const res = await request(app)
            .post('/submit-vote')
            .send({ playerId: 'player1' })
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.mvp).toBeDefined();
        expect(res.body.topPlayers).toBeDefined();
        expect(res.body.mvp.id).toEqual('player1');
    });

    it('should return 400 if playerId is missing', async () => {
        const res = await request(app)
            .post('/submit-vote')
            .send({})
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('Player ID is required');
    });

    it('should prevent duplicate voting using localStorage simulation', async () => {
        // Προσομοίωση πρώτης ψήφου
        await request(app)
            .post('/submit-vote')
            .send({ playerId: 'player1' })
            .set('Content-Type', 'application/json');

        // Δεύτερη ψήφος
        const res = await request(app)
            .post('/submit-vote')
            .send({ playerId: 'player1' })
            .set('Content-Type', 'application/json');
        
        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toBe('You have already voted');
    });
});