import logger from '../utils/logger.js';

export default class CoffeeSaverListener {
    constructor(eventManager, coffeeSaverService) {
        this.eventManager = eventManager;
        this.coffeeSaverService = coffeeSaverService;

        this.handleOrderCreated = this.handleOrderCreated.bind(this);
        this.handleCoffeeSaverProcessed = this.handleCoffeeSaverProcessed.bind(this);
    }

    register() {
        if (!this.eventManager) {
            logger.warn('EventManager is not available for CoffeeSaverListener');
            return;
        }

        this.eventManager.on('order:created', this.handleOrderCreated);
        this.eventManager.on('coffeeSaver:processed', this.handleCoffeeSaverProcessed);
        logger.info('CoffeeSaverListener registered');
    }

    unregister() {
        if (!this.eventManager) return;

        this.eventManager.off('order:created', this.handleOrderCreated);
        this.eventManager.off('coffeeSaver:processed', this.handleCoffeeSaverProcessed);
        logger.info('CoffeeSaverListener unregistered');
    }

    async handleOrderCreated(order) {
        logger.info(`CoffeeSaverListener received order:created (ID: ${order?.getId?.() ?? 'unknown'})`);
        if (this.coffeeSaverService) {
            await this.coffeeSaverService.process(order);
        }
    }

    handleCoffeeSaverProcessed(entry) {
        logger.info(`CoffeeSaverListener confirmed entry processed (ID: ${entry?.id ?? 'unknown'})`);
    }
}
