export default class OrderCollection {
    constructor() {
        this.orders = new Map();
    }

    add(order) {
        this.orders.set(order.getId(), order);
    }

    getById(id) {
        return this.orders.get(Number(id)) || this.orders.get(id) || null;
    }

    getAll() {
        return Array.from(this.orders.values());
    }

    remove(id) {
        return this.orders.delete(Number(id)) || this.orders.delete(id);
    }

    clear() {
        this.orders.clear();
    }

    getCount() {
        return this.orders.size;
    }
}
