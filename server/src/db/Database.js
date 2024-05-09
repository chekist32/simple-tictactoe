module.exports = class Database {
    #MAX_ELEMENTS = 100000;
    #database = new Map();

    constructor() {};

    

    save(id, entity) {
        if (this.#database.size > this.#MAX_ELEMENTS) {
            throw Error("Too many elements");
        }
        this.#database.set(id, entity);
    }

    findElementById(id) {
        return this.#database.get(id);
    }

    findAll() {
        return Array.from(this.#database.values());
    }

    existsById(id) {
        return this.#database.has(id);
    }

    deleteElement(id) {
        this.#database.delete(id);
    }
}