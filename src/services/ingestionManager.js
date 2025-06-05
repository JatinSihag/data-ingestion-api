const { v4: uuidv4 } = require('uuid');

// Priority mapping for easy sorting
const PRIORITY_ORDER = { HIGH: 1, MEDIUM: 2, LOW: 3 };

/**
 * IngestionManager handles all batching, queueing, and processing logic.
 * I wanted to keep this class simple, readable, and robust.
 */
class IngestionManager {
    constructor() {
        // All ingestion requests are stored here
        this.ingestions = new Map();
        // This queue holds all batches waiting to be processed
        this.batchQueue = [];
        // Only one processing loop should run
        this.processing = false;
        this.startProcessing();
    }

    /**
     * Adds a new ingestion request, splits IDs into batches,
     * and puts them in the processing queue.
     */
    addIngestion(ids, priority) {
        const ingestion_id = uuidv4();
        const created_time = Date.now();
        const batches = [];
        for (let i = 0; i < ids.length; i += 3) {
            const batch_ids = ids.slice(i, i + 3);
            const batch_id = uuidv4();
            batches.push({
                batch_id,
                ids: batch_ids,
                status: 'yet_to_start',
                created_time,
                priority,
            });
            this.batchQueue.push({
                batch_id,
                ids: batch_ids,
                status: 'yet_to_start',
                created_time,
                priority,
                ingestion_id,
            });
        }
        this.ingestions.set(ingestion_id, {
            ingestion_id,
            status: 'yet_to_start',
            batches,
            created_time,
            priority,
        });
        return ingestion_id;
    }

    /**
     * Returns the current status of an ingestion request.
     */
    getStatus(ingestion_id) {
        const ingestion = this.ingestions.get(ingestion_id);
        if (!ingestion) return null;
        // Figure out the overall status based on batch statuses
        const batchStatuses = ingestion.batches.map(b => b.status);
        if (batchStatuses.every(s => s === 'yet_to_start')) ingestion.status = 'yet_to_start';
        else if (batchStatuses.every(s => s === 'completed')) ingestion.status = 'completed';
        else ingestion.status = 'triggered';
        return {
            ingestion_id,
            status: ingestion.status,
            batches: ingestion.batches.map(b => ({
                batch_id: b.batch_id,
                ids: b.ids,
                status: b.status,
            })),
        };
    }

    /**
     * Main processing loop: always picks the highest-priority batch,
     * processes it, and waits 5 seconds before the next one.
     */
    async startProcessing() {
        if (this.processing) return;
        this.processing = true;
        while (true) {
            if (this.batchQueue.length === 0) {
                await this.sleep(1000);
                continue;
            }
            // Sort by priority, then by arrival time
            this.batchQueue.sort((a, b) => {
                if (PRIORITY_ORDER[a.priority] !== PRIORITY_ORDER[b.priority]) {
                    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
                }
                return a.created_time - b.created_time;
            });
            const batch = this.batchQueue.shift();
            // Mark as triggered
            const ingestion = this.ingestions.get(batch.ingestion_id);
            const batchRef = ingestion.batches.find(b => b.batch_id === batch.batch_id);
            batchRef.status = 'triggered';
            // Simulate external API call for each id (delay)
            await Promise.all(batch.ids.map(id => this.simulateExternalApi(id)));
            batchRef.status = 'completed';
            // Wait 5 seconds before next batch
            await this.sleep(5000);
        }
    }

    /**
     * Simulates an external API call for each ID.
     */
    async simulateExternalApi(id) {
        await this.sleep(500);
        return { id, data: 'processed' };
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new IngestionManager();