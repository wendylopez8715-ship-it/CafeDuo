import database from '../config/database.js';

export default class OrderService {

    async getAllOrders() {
        const [orders] = await database.query(
            'SELECT * FROM orders ORDER BY id DESC'
        );

        return orders;
    }

    async getOrderById(id) {
        const [orders] = await database.query(
            'SELECT * FROM orders WHERE id = ?',
            [id]
        );

        return orders[0] || null;
    }

    async getOrderItems(orderId) {
        const [items] = await database.query(
            `SELECT oi.*, p.name AS product_name
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId]
        );

        return items;
    }

    async createOrder(customerName, items) {
        if (!customerName || !customerName.trim()) {
            throw new Error('Customer name is required.');
        }

        if (!Array.isArray(items) || items.length === 0) {
            throw new Error('The order must contain products.');
        }

        const connection = await database.getConnection();

        try {
            await connection.beginTransaction();

            let total = 0;
            const orderItems = [];

            for (const item of items) {
                const productId = Number(item.productId);
                const quantity = Number(item.quantity);

                if (!Number.isInteger(quantity) || quantity <= 0) {
                    throw new Error('Invalid product quantity.');
                }

                const [products] = await connection.query(
                    'SELECT * FROM products WHERE id = ? FOR UPDATE',
                    [productId]
                );

                const product = products[0];

                if (!product || !product.available) {
                    throw new Error('Product is not available.');
                }

                let unitPrice = Number(product.price);

                if (
                    product.special_offer &&
                    product.offer_price !== null &&
                    Number(product.offer_quantity) >= quantity
                ) {
                    unitPrice = Number(product.offer_price);
                }

                const subtotal = unitPrice * quantity;
                total += subtotal;

                orderItems.push({
                    productId,
                    quantity,
                    unitPrice,
                    subtotal,
                    offerUsed:
                        product.special_offer &&
                        product.offer_price !== null &&
                        Number(product.offer_quantity) >= quantity
                });
            }

            const [orderResult] = await connection.query(
                `INSERT INTO orders (customer_name, total, status)
                 VALUES (?, ?, 'pending')`,
                [customerName.trim(), total]
            );

            const orderId = orderResult.insertId;

            for (const item of orderItems) {
                await connection.query(
                    `INSERT INTO order_items
                     (order_id, product_id, quantity, unit_price)
                     VALUES (?, ?, ?, ?)`,
                    [
                        orderId,
                        item.productId,
                        item.quantity,
                        item.unitPrice
                    ]
                );

                if (item.offerUsed) {
                    await connection.query(
                        `UPDATE products
                         SET offer_quantity = offer_quantity - ?
                         WHERE id = ?`,
                        [item.quantity, item.productId]
                    );

                    await connection.query(
                        `UPDATE products
                         SET special_offer = 0,
                             offer_price = NULL
                         WHERE id = ?
                           AND offer_quantity <= 0`,
                        [item.productId]
                    );
                }
            }

            await connection.commit();

            return {
                id: orderId,
                customerName: customerName.trim(),
                total,
                status: 'pending',
                items: orderItems
            };

        } catch (error) {
            await connection.rollback();
            throw error;

        } finally {
            connection.release();
        }
    }

    async updateOrderStatus(id, status) {
        const allowedStatuses = [
            'pending',
            'completed',
            'cancelled'
        ];

        if (!allowedStatuses.includes(status)) {
            throw new Error('Invalid order status.');
        }

        const [result] = await database.query(
            'UPDATE orders SET status = ? WHERE id = ?',
            [status, id]
        );

        return result.affectedRows > 0;
    }
}