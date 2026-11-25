import logger from '../utils/logger.js';

export default class CoffeeSaverService {
    constructor(eventManager = null) {
        this.eventManager = eventManager;
        this.records = [];
    }

    async process(payload = null) {
        const entry = {
            id: Date.now(),
            data: payload,
            processedAt: new Date().toISOString()
        };

        this.records.push(entry);
        logger.info(`CoffeeSaverService processed entry (ID: ${entry.id})`);

        if (this.eventManager) {
            this.eventManager.emit('coffeeSaver:processed', entry);
        }

        return entry;
    }

    getAllRecords() {
        return this.records;
    }

    clearRecords() {
        this.records = [];
    }
}
