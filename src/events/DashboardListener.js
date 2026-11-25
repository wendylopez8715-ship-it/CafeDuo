import logger from '../utils/logger.js';

export default class DashboardListener {
    constructor(eventManager, onUpdateCallback = null) {
        this.eventManager = eventManager;
        this.onUpdateCallback = onUpdateCallback;

        this.handleDashboardRefresh = this.handleDashboardRefresh.bind(this);
    }

    register() {
        if (!this.eventManager) {
            logger.warn('EventManager is not available for DashboardListener');
            return;
        }

        this.eventManager.on('order:created', this.handleDashboardRefresh);
        this.eventManager.on('order:statusUpdated', this.handleDashboardRefresh);
        this.eventManager.on('coffeeSaver:processed', this.handleDashboardRefresh);
        logger.info('DashboardListener registered');
    }

    unregister() {
        if (!this.eventManager) return;

        this.eventManager.off('order:created', this.handleDashboardRefresh);
        this.eventManager.off('order:statusUpdated', this.handleDashboardRefresh);
        this.eventManager.off('coffeeSaver:processed', this.handleDashboardRefresh);
        logger.info('DashboardListener unregistered');
    }

    handleDashboardRefresh(payload) {
        logger.info('DashboardListener: refreshing dashboard state');
        if (typeof this.onUpdateCallback === 'function') {
            this.onUpdateCallback(payload);
        }
    }
}
