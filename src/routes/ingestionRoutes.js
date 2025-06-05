/**
 * Sets up routes for ingestion-related endpoints.
 * I wanted this to be modular and easy to plug into the main app!
 */

const express = require('express');
const IngestionController = require('../controllers/ingestionController');

const router = express.Router();
const ingestionController = new IngestionController();

/**
 * Registers ingestion routes with the main Express app.
 * @param {Express.Application} app - The main Express app instance
 */
function setIngestionRoutes(app) {
    // Route for submitting a new ingestion request
    router.post('/ingest', ingestionController.submitIngestionRequest.bind(ingestionController));
    // You can add more ingestion-related routes here in the future!
    app.use('/api', router);
}

module.exports = setIngestionRoutes;