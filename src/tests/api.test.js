/**
 * These are my API tests for the Data Ingestion API System.
 * I wanted to make sure everything works as expected, including error handling!
 */

const request = require('supertest');
const app = require('../app'); // Use the exported app for testing

describe('Data Ingestion API', () => {
    it('should accept a valid ingestion request and return an id', async () => {
        // This test checks if a valid request returns an ingestion_id
        const res = await request(app)
            .post('/ingest')
            .send({ ids: [1, 2, 3, 4, 5], priority: 'HIGH' });
        expect(res.body).toHaveProperty('ingestion_id');
    });

    it('should return 400 for invalid payload', async () => {
        // This test checks for proper error handling on bad input
        const res = await request(app)
            .post('/ingest')
            .send({ ids: "not-an-array", priority: 'HIGH' });
        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/Invalid payload/);
    });

    it('should return 404 for unknown ingestion_id', async () => {
        // This test checks if the API returns 404 for a non-existent ingestion_id
        const res = await request(app).get('/status/doesnotexist');
        expect(res.status).toBe(404);
    });

    it('should return health status', async () => {
        // This test checks the /health endpoint for a quick server check
        const res = await request(app).get('/health');
        expect(res.body).toEqual({ status: "ok" });
    });
});