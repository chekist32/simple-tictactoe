module.exports = class LobbyEntity {
    lobbyId;
    lobbyName;
    lobbyPass;
    chosenGame;
    users;
    maxUsers;
    admin;

    constructor(lobbyId, lobbyName, lobbyPass, chosenGame, users, maxUsers, admin) {
        this.lobbyId = lobbyId;
        this.users = users;
        this.lobbyName = lobbyName;
        this.lobbyPass = lobbyPass;
        this.chosenGame = chosenGame;
        this.maxUsers = maxUsers.toString();
        this.admin = admin;
    }
}