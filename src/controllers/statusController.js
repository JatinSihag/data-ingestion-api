/**
 * StatusController is responsible for handling status checks for ingestion requests.
 * I wanted this to be simple and easy to extend if needed!
 */
class StatusController {
    constructor() {
        // Stores the status of each ingestion request by ID
        this.statuses = {};
    }

    /**
     * GET /status/:ingestion_id
     * Returns the status of a specific ingestion request.
     */
    getStatus(req, res) {
        const ingestionId = req.params.ingestion_id;

        // If the ingestion ID doesn't exist, let the user know!
        if (!this.statuses[ingestionId]) {
            return res.status(404).json({ error: 'Sorry, that ingestion ID was not found. Please check your ID and try again.' });
        }

        // Return the status and details for this ingestion request
        return res.status(200).json({
            ingestion_id: ingestionId,
            status: this.statuses[ingestionId].status,
            details: this.statuses[ingestionId].details,
        });
    }

    /**
     * Internal method to update the status of an ingestion request.
     */
    updateStatus(ingestionId, status, details) {
        this.statuses[ingestionId] = { status, details };
    }
}

module.exports = StatusController;