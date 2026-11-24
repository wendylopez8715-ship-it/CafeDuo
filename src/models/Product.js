import BaseEntity from './BaseEntity.js';

export default class Product extends BaseEntity {
    constructor(
        id,
        name,
        category,
        price,
        available = 1,
        specialOffer = 0,
        offerPrice = null,
        offerQuantity = 0
    ) {
        super(id);

        this.name = name;
        this.category = category;
        this.price = Number(price);
        this.available = available;
        this.specialOffer = specialOffer;
        this.offerPrice = offerPrice;
        this.offerQuantity = offerQuantity;
    }

    getFinalPrice() {
        if (this.specialOffer && this.offerPrice !== null) {
            return Number(this.offerPrice);
        }

        return this.price;
    }
}