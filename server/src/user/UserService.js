const ULID = require('ulid');
const UserEntity = require('./UserEntity');
const UserDatabase = require('./UserDatabase');
const HttpError = require('../http/HttpError');

class UserService {
    #userDatabase = new UserDatabase();

    constructor() {};

    createUser() {
        const userId = ULID.ulid();
        const username = 'Player'+ (Math.random() * 100000 + 1).toFixed(0);
        const sessionId = ULID.ulid();

        const addedUser = new UserEntity(userId, username, sessionId, null, new Date());

        this.#userDatabase.save(userId, addedUser);

        return addedUser;
    }

    getUser(userId) {
        return this.#userDatabase.findElementById(userId);
    }

    getAllUsers() {
        return this.#userDatabase.findAll();
    }

    validateUser(userId, sessionId) {
        if (!userId || !sessionId) return false;

        const user = this.#userDatabase.findElementById(userId);
        if(!user) return false;

        return user.sessionId === sessionId
    }


    addSocketConnection(userId, connection) {
        const user = this.#userDatabase.findElementById(userId);
        if(!user) return null;

        user.connection = connection;
        
        this.#userDatabase.save(userId, user);

        return user;
    }

    addLobbyId(userId, lobbyId) {
        const user = this.#userDatabase.findElementById(userId);
        if(!user) return null;

        user.lobbyId = lobbyId;

        this.#userDatabase.save(userId, user);

        return user;
    }

    deleteSocketConnection(userId) {
        const user = this.#userDatabase.findElementById(userId);
        if(!user) return null;

        user.connection = null;
        
        this.#userDatabase.save(userId, user);

        return user;
    }

    getSocketConnection(userId) {
        const user = this.#userDatabase.findElementById(userId);
        if(!user) return false;
        
        return user.connection;
    }

    getSocketConnections(userIdArray) {
        const connections = [];

        userIdArray.forEach(userId => {
            const user = this.#userDatabase.findElementById(userId);
            if (user) connections.push(user.connection);
        });
        
        return connections;
    }

    updateUserLastActivity(userId) {
        const user = this.#userDatabase.findElementById(userId);
        if(!user) return null;

        user.lastActivityDate = new Date();
        
        this.#userDatabase.save(userId, user);
        
        return user;
    }

    updateUsername(userId, username) {
        const user = this.#userDatabase.findElementById(userId);
        if(!user) throw new HttpError('Bad userId', 400);

        const usernameStr = username.toString();

        if (usernameStr.length > 24) throw new HttpError('Too long username (max 24 characters)', 400);
         
        else if (usernameStr.length <= 0) throw new HttpError('Username can`t be empty', 400);

        user.username = username;

        this.#userDatabase.save(userId, user);

        return user;
    }

    deleteUser(userId) {
        this.#userDatabase.deleteElement(userId);
    }
}

const userService = new UserService();

module.exports = {
    UserService,
    userService
}