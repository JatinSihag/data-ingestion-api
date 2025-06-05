/**
 * Sets up routes for status-related endpoints.
 * I wanted this to be modular and easy to plug into the main app!
 */

const express = require('express');
const StatusController = require('../controllers/statusController');

/**
 * Registers status routes with the main Express app.
 * @param {Express.Application} app - The main Express app instance
 */
const setStatusRoutes = (app) => {
    const router = express.Router();
    const statusController = new StatusController();

    // Route for checking the status of an ingestion request
    router.get('/:ingestion_id', statusController.getStatus.bind(statusController));

    // You can add more status-related routes here in the future!
    app.use('/status', router);
};

module.exports = setStatusRoutes;