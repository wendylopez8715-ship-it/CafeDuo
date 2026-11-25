class OrderCollection {
  constructor(orders = []) {
    this.orders = Array.isArray(orders) ? [...orders] : [];
  }

  add(order) {
    this.orders.push(order);
    return order;
  }

  getAll() {
    return [...this.orders];
  }

  getById(id) {
    return this.orders.find((order) => String(order.id) === String(id)) || null;
  }

  updateStatus(id, status) {
    const order = this.getById(id);
    if (!order) return null;
    order.status = status;
    return order;
  }

  remove(id) {
    const index = this.orders.findIndex((order) => String(order.id) === String(id));
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }
}

export default OrderCollection;