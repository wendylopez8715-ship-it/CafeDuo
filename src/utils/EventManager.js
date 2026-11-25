export default class EventManager {
    constructor() {
        this.events = new Map();
    }

    on(eventName, listener) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }
        this.events.get(eventName).push(listener);
    }

    off(eventName, listenerToRemove) {
        if (!this.events.has(eventName)) return;

        const filteredListeners = this.events
            .get(eventName)
            .filter(listener => listener !== listenerToRemove);

        this.events.set(eventName, filteredListeners);
    }

    emit(eventName, data) {
        if (!this.events.has(eventName)) return;

        this.events.get(eventName).forEach(listener => {
            listener(data);
        });
    }

    clear(eventName) {
        if (eventName) {
            this.events.delete(eventName);
        } else {
            this.events.clear();
        }
    }
}
