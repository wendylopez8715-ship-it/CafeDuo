import logger from '../utils/logger.js';

export default class OrderListener {
    constructor(eventManager, orderService = null) {
        this.eventManager = eventManager;
        this.orderService = orderService;

        this.handleOrderCreated = this.handleOrderCreated.bind(this);
        this.handleOrderUpdated = this.handleOrderUpdated.bind(this);
        this.handleOrderStatusUpdated = this.handleOrderStatusUpdated.bind(this);
        this.handleOrderDeleted = this.handleOrderDeleted.bind(this);
    }

    register() {
        if (!this.eventManager) {
            logger.warn('EventManager is not available for OrderListener');
            return;
        }

        this.eventManager.on('order:created', this.handleOrderCreated);
        this.eventManager.on('order:updated', this.handleOrderUpdated);
        this.eventManager.on('order:statusUpdated', this.handleOrderStatusUpdated);
        this.eventManager.on('order:deleted', this.handleOrderDeleted);
        logger.info('OrderListener registered');
    }

    unregister() {
        if (!this.eventManager) return;

        this.eventManager.off('order:created', this.handleOrderCreated);
        this.eventManager.off('order:updated', this.handleOrderUpdated);
        this.eventManager.off('order:statusUpdated', this.handleOrderStatusUpdated);
        this.eventManager.off('order:deleted', this.handleOrderDeleted);
        logger.info('OrderListener unregistered');
    }

    handleOrderCreated(order) {
        logger.info(`OrderListener: new order created (ID: ${order?.getId?.() ?? 'unknown'})`);
    }

    handleOrderUpdated(order) {
        logger.info(`OrderListener: order updated (ID: ${order?.getId?.() ?? 'unknown'})`);
    }

    handleOrderStatusUpdated(order) {
        logger.info(`OrderListener: order ${order?.getId?.() ?? 'unknown'} changed status to ${order?.status ?? 'unknown'}`);
    }

    handleOrderDeleted(orderId) {
        logger.info(`OrderListener: order deleted (ID: ${orderId ?? 'unknown'})`);
    }
}
