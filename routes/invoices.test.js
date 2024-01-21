const request = require('supertest');
const app = require('../app');

describe('GET /invoices', () => {
    it('responds with 200', async () => {
        const response = await request(app).get('/invoices');
        expect(response.status).toBe(200);
    })
})

describe('GET /invoices/:id', () => {
    it('responds with 200', async () => {
        let id = 2
        const response = await request(app).get('/invoices/${id}');
        expect(response.status).toBe(200);
    })
})

