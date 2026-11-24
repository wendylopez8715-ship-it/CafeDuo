export default class ProductCollection {
    constructor() {
        this.products = new Map();
    }

    add(product) {
        this.products.set(product.getId(), product);
    }

    getById(id) {
        return this.products.get(Number(id)) || null;
    }

    getAll() {
        return Array.from(this.products.values());
    }

    remove(id) {
        return this.products.delete(Number(id));
    }

    clear() {
        this.products.clear();
    }

    getCount() {
        return this.products.size;
    }
}