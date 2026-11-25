import BaseEntity from './BaseEntity.js';

export default class Order extends BaseEntity {
    constructor(
        id = null,
        customerName = '',
        items = [],
        status = 'pending',
        createdAt = new Date().toISOString()
    ) {
        super(id);

        this.customerName = customerName;
        this.items = items;
        this.status = status;
        this.createdAt = createdAt;
        this.total = this.calculateTotal();
    }

    addItem(product, quantity = 1) {
        const unitPrice = typeof product.getFinalPrice === 'function'
            ? product.getFinalPrice()
            : Number(product.price);

        this.items.push({
            productId: product.getId(),
            name: product.name,
            quantity: Number(quantity),
            unitPrice
        });

        this.total = this.calculateTotal();
    }

    calculateTotal() {
        return this.items.reduce((sum, item) => {
            return sum + (Number(item.unitPrice) * Number(item.quantity));
        }, 0);
    }

    setStatus(status) {
        this.status = status;
    }
}
