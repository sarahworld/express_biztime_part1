const request = require('supertest');
const app = require('../app');

describe('GET /companies', () => {
    it('responds with 200', async () => {
        const response = await request(app).get('/companies');
        expect(response.status).toBe(200);
    })
})

describe('GET /companies/:code', () => {
    it('responds with 200', async () => {
        let code = 'apple'
        const response = await request(app).get('/companies/${code}');
        expect(response.status).toBe(200);
    })
})

