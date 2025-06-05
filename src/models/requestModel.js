/**
 * RequestModel represents a single ingestion request.
 * I wanted this class to be simple, flexible, and easy to use!
 */

class RequestModel {
    /**
     * Creates a new ingestion request.
     * @param {string} ingestion_id - Unique ID for this request
     * @param {Array<number>} ids - List of IDs to ingest
     * @param {string} priority - Priority level (HIGH, MEDIUM, LOW)
     * @param {Array<Object>} batches - Array of batch objects
     */
    constructor(ingestion_id, ids, priority, batches) {
        this.ingestion_id = ingestion_id;
        this.ids = ids;
        this.priority = priority;
        this.batches = batches;
        this.status = 'pending'; // initial status
    }

    /**
     * Updates the overall status of the request.
     * @param {string} newStatus - The new status (pending, triggered, completed)
     */
    updateStatus(newStatus) {
        this.status = newStatus;
    }

    /**
     * Adds a new batch to this request.
     * @param {Object} batch - The batch object to add
     */
    addBatch(batch) {
        this.batches.push(batch);
    }

    /**
     * Returns a summary of this ingestion request.
     */
    getDetails() {
        return {
            ingestion_id: this.ingestion_id,
            ids: this.ids,
            priority: this.priority,
            batches: this.batches,
            status: this.status
        };
    }
}

module.exports = RequestModel;