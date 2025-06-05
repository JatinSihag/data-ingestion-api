const express = require('express');
const ingestionManager = require('./services/ingestionManager');

const app = express();
app.use(express.json());

/**
 * POST /ingest
 * Accepts a list of IDs and a priority, and returns a unique ingestion_id.
 * I validate the input and give a helpful error if something's wrong.
 */
app.post('/ingest', (req, res) => {
    const { ids, priority } = req.body;
    if (!Array.isArray(ids) || !['HIGH', 'MEDIUM', 'LOW'].includes(priority)) {
        return res.status(400).json({ error: 'Invalid payload. Please provide an array of ids and a valid priority.' });
    }
    const ingestion_id = ingestionManager.addIngestion(ids, priority);
    res.json({ ingestion_id });
});

/**
 * GET /status/:ingestion_id
 * Lets you check the status of your ingestion request.
 */
app.get('/status/:ingestion_id', (req, res) => {
    const status = ingestionManager.getStatus(req.params.ingestion_id);
    if (!status) return res.status(404).json({ error: 'Ingestion ID not found.' });
    res.json(status);
});

/**
 * GET /health
 * Simple health check endpoint.
 */
app.get('/health', (req, res) => {
    res.json({ status: "ok" });
});

module.exports = app;