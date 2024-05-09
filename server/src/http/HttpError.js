module.exports = class HttpError extends Error {
    statusCode;
    constructor(message, statusCode) {
        super(message);
        this.name = HttpError.name;
        this.statusCode = statusCode;
    }
}