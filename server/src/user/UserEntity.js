const UserEntityError = require("./UserEntityError");

module.exports = class UserEntity {
    userId;
    username;
    sessionId;
    connection = null;
    lastActivityDate;
    lobbyId = null;

    constructor(userId, username, sessionId, connection, lastActivityDate) {
        if(!userId || !username || !sessionId || !lastActivityDate) {
            throw new UserEntityError("Invalid data type inside constructor");
        }
        this.userId = userId.toString();
        this.username = username.toString();
        this.sessionId = sessionId.toString();
        this.connection = connection;
        this.lastActivityDate = lastActivityDate.toString();
    }
}