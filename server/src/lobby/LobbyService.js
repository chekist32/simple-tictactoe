const ULID = require('ulid');
const bcrypt = require('bcrypt')

const LobbyEntity = require('./LobbyEntity');
const LobbyDatabase = require('./LobbyDatabase');
const HttpError = require('../http/HttpError');
const { userService } = require('../user/UserService');


class LobbyService {
    #lobbyDatabase = new LobbyDatabase();

    constructor() {};

    createLobby(lobbyDataFromUser) {
        const lobbyId = ULID.ulid();

        let maxUsers;
        if (lobbyDataFromUser.chosenGame = 'tic_tac_toe') {
            maxUsers = 2;
        }

        let pass = '';
        if (lobbyDataFromUser.pass !== '' || lobbyDataFromUser.pass) {
            pass = bcrypt.hashSync(lobbyDataFromUser.pass, 10);  
        }

        const createdLobby = new LobbyEntity(lobbyId,
                                            lobbyDataFromUser.lobbyName.trim(),
                                            pass,
                                            lobbyDataFromUser.chosenGame,
                                            lobbyDataFromUser.users,
                                            maxUsers,
                                            lobbyDataFromUser.admin);

        this.#lobbyDatabase.save(lobbyId, createdLobby);

        userService.addLobbyId(lobbyDataFromUser.users[0], lobbyId);

        return createdLobby;
    }

    getLobby(lobbyId) {
        return this.#lobbyDatabase.findElementById(lobbyId);
    }

    getAllLobbies() {
        return this.#lobbyDatabase.findAll();
    }

    getAllUsers(lobbyId) {
        const lobby = this.#lobbyDatabase.findElementById(lobbyId)
        if (!lobby) return null;

        return lobby.users;
    }

    joinLobby(lobbyId, userId, pass) {
        const lobby = this.#lobbyDatabase.findElementById(lobbyId);
        if (!lobby) throw new HttpError("There is no such lobby", 404);

        else if (lobby.users.includes(userId)) return lobby;

        else if (lobby.users.length >= lobby.maxUsers)
            throw new HttpError("Lobby is full", 500);

        else if (lobby.lobbyPass && !bcrypt.compareSync(pass, lobby.lobbyPass)) 
            throw new HttpError("Invalid password", 401);

        else if (!lobby.users.includes(userId)) {
            lobby.users.push(userId);

            userService.addLobbyId(userId, lobbyId);

            this.#lobbyDatabase.save(lobbyId, lobby);
        }

        return lobby;
    }

    lobbyExists(lobbyId) {
        return this.#lobbyDatabase.existsById(lobbyId);
    }

    isLobbyAdmin(lobbyId, userId) {
        const lobby = this.#lobbyDatabase.findElementById(lobbyId);
        if (!lobby) return false;
        
        if (lobby.users.includes(userId)) {
            return lobby.admin === userId;
        }

        return false;
    }

    leaveLobby(lobbyId, userId) {
        const lobby = this.#lobbyDatabase.findElementById(lobbyId);
        if (!lobby || !this.belongsToLobby(lobbyId, userId)) return false;

        if (lobby.admin === userId) {
            this.#lobbyDatabase.deleteElement(lobbyId);
            return null;
        }

        lobby.users = lobby.users.filter(user => user !== userId);

        this.#lobbyDatabase.save(lobbyId, lobby);

        return lobby;
    }

    belongsToLobby(lobbyId, userId) {
        const lobby = this.#lobbyDatabase.findElementById(lobbyId);
        if (!lobby) return false;

        return lobby.users.includes(userId);
    }

    deleteLobby(lobbyId) {
        return this.#lobbyDatabase.deleteElement(lobbyId);
    }
}

const lobbyService = new LobbyService();

module.exports = {
    LobbyService,
    lobbyService
}