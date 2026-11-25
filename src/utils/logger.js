class Logger {
    formatMessage(level, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${level}] ${message}`;
    }

    info(message, data = '') {
        console.log(this.formatMessage('INFO', message), data);
    }

    warn(message, data = '') {
        console.warn(this.formatMessage('WARN', message), data);
    }

    error(message, error = '') {
        console.error(this.formatMessage('ERROR', message), error);
    }
}

export default new Logger();
