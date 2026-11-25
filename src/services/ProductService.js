import Product from '../models/Product.js';
import ProductCollection from '../collections/ProductCollection.js';
import logger from '../utils/logger.js';

export default class ProductService {
    constructor(eventManager = null) {
        this.collection = new ProductCollection();
        this.eventManager = eventManager;
    }

    createProduct(data) {
        const product = new Product(
            data.id,
            data.name,
            data.category,
            data.price,
            data.available ?? 1,
            data.specialOffer ?? 0,
            data.offerPrice ?? null,
            data.offerQuantity ?? 0
        );

        this.collection.add(product);
        logger.info(`Producto agregado: ${product.name} (ID: ${product.getId()})`);

        if (this.eventManager) {
            this.eventManager.emit('product:created', product);
        }

        return product;
    }

    getProductById(id) {
        return this.collection.getById(id);
    }

    getAllProducts() {
        return this.collection.getAll();
    }

    getAvailableProducts() {
        return this.collection
            .getAll()
            .filter(product => Number(product.available) === 1);
    }

    getProductsByCategory(category) {
        return this.collection
            .getAll()
            .filter(product => product.category === category);
    }

    updateProduct(id, updatedData) {
        const product = this.getProductById(id);
        if (!product) {
            logger.warn(`Producto no encontrado para actualizar (ID: ${id})`);
            return null;
        }

        if (updatedData.name !== undefined) product.name = updatedData.name;
        if (updatedData.category !== undefined) product.category = updatedData.category;
        if (updatedData.price !== undefined) product.price = Number(updatedData.price);
        if (updatedData.available !== undefined) product.available = updatedData.available;
        if (updatedData.specialOffer !== undefined) product.specialOffer = updatedData.specialOffer;
        if (updatedData.offerPrice !== undefined) product.offerPrice = updatedData.offerPrice;
        if (updatedData.offerQuantity !== undefined) product.offerQuantity = updatedData.offerQuantity;

        logger.info(`Producto actualizado: ${product.name} (ID: ${id})`);

        if (this.eventManager) {
            this.eventManager.emit('product:updated', product);
        }

        return product;
    }

    deleteProduct(id) {
        const deleted = this.collection.remove(id);
        if (deleted) {
            logger.info(`Producto eliminado (ID: ${id})`);
            if (this.eventManager) {
                this.eventManager.emit('product:deleted', id);
            }
        }
        return deleted;
    }
}
