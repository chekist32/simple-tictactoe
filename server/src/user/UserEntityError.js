module.exports = class UserEntityError extends Error {
    constructor(message) {
        super(message);
        this.name = UserModelError.name;
    }
}