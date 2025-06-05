/**
 * IngestionService handles the core logic for processing ingestion requests.
 * I wanted this to be simple, async, and easy to extend!
 */

class IngestionService {
    constructor() {
        this.requests = new Map(); // Store ingestion requests
    }

    async processIngestionRequest(ingestionRequest) {
        const ingestionId = this.generateIngestionId();
        ingestionRequest.ingestion_id = ingestionId;
        ingestionRequest.status = 'processing';
        this.requests.set(ingestionId, ingestionRequest);

        // Simulate asynchronous processing
        await this.simulateProcessing(ingestionId);

        return ingestionId;
    }

    async simulateProcessing(ingestionId) {
        // Simulate a delay for processing
        return new Promise((resolve) => {
            setTimeout(() => {
                const request = this.requests.get(ingestionId);
                request.status = 'completed'; // Update status to completed
                this.requests.set(ingestionId, request);
                resolve();
            }, 5000); // Simulate 5 seconds processing time
        });
    }

    getRequestStatus(ingestionId) {
        return this.requests.get(ingestionId) || null;
    }

    generateIngestionId() {
        return `ingestion_${Date.now()}`; // Simple unique ID generation
    }
}

module.exports = IngestionService;