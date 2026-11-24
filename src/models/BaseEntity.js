export default class BaseEntity {
    constructor(id = null) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setId(id) {
        this.id = id;
    }
}