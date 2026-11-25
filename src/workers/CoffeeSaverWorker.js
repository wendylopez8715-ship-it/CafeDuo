import CoffeeSaverService from '../services/CoffeeSaverService.js';
import logger from '../utils/logger.js';

export default class CoffeeSaverWorker {
    constructor(eventManager = null, intervalMs = 60000) {
        this.service = new CoffeeSaverService(eventManager);
        this.eventManager = eventManager;
        this.intervalMs = intervalMs;
        this.timer = null;
        this.isRunning = false;
    }

    start() {
        if (this.isRunning) {
            logger.warn('CoffeeSaverWorker ya está en ejecución');
            return;
        }

        this.isRunning = true;
        logger.info(`CoffeeSaverWorker iniciado (intervalo: ${this.intervalMs}ms)`);

        this.timer = setInterval(() => {
            this.execute();
        }, this.intervalMs);
    }

    stop() {
        if (!this.isRunning) {
            return;
        }

        clearInterval(this.timer);
        this.timer = null;
        this.isRunning = false;
        logger.info('CoffeeSaverWorker detenido');
    }

    async execute(payload = null) {
        try {
            logger.info('Ejecutando tarea en CoffeeSaverWorker...');
            const result = await this.service.process(payload);

            if (this.eventManager) {
                this.eventManager.emit('worker:coffeeSaverCompleted', result);
            }

            return result;
        } catch (error) {
            logger.error('Error en CoffeeSaverWorker:', error);
            if (this.eventManager) {
                this.eventManager.emit('worker:coffeeSaverError', error);
            }
            return null;
        }
    }
}
