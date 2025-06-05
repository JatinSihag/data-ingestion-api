/**
 * IngestionController handles incoming ingestion requests.
 * I wanted this to be simple, clear, and easy to extend!
 */

class IngestionController {
    constructor() {
        // Stores all ingestion requests by their unique ID
        this.ingestionRequests = {};
    }

    /**
     * Handles POST /ingest
     * Accepts a list of IDs and a priority, creates a new ingestion job,
     * and simulates processing it asynchronously.
     */
    submitIngestionRequest(req, res) {
        const { ids, priority, batches } = req.body;
        const ingestionId = this.generateIngestionId();

        // Store the request with initial status
        this.ingestionRequests[ingestionId] = {
            status: 'processing',
            ids,
            priority,
            batches,
            createdAt: new Date(),
        };

        // Simulate background processing (in a real app, this would be a queue/job)
        this.processIngestionRequest(ingestionId);

        // Respond right away with the new ingestion ID
        res.status(202).json({ ingestion_id: ingestionId });
    }

    /**
     * Generates a unique ingestion ID.
     * (I used a random string for simplicity.)
     */
    generateIngestionId() {
        return 'ingestion_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Simulates processing the ingestion request asynchronously.
     * After 5 seconds, marks the job as completed.
     */
    processIngestionRequest(ingestionId) {
        setTimeout(() => {
            if (this.ingestionRequests[ingestionId]) {
                this.ingestionRequests[ingestionId].status = 'completed';
            }
        }, 5000); // Simulate a delay for processing
    }
}

module.exports = new IngestionController();