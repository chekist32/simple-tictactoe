module.exports = class TicTacToeEntity {
    static GAME_STATUS = {
        UNINITIALIZED: 0,
        STARTED: 1,
        ENDED: 2
    }
    lobbyId
    players
    turn
    winner
    status = TicTacToeEntity.GAME_STATUS.UNINITIALIZED
    gameState = [
        [undefined, undefined, undefined],
        [undefined, undefined, undefined],
        [undefined, undefined, undefined]
    ]

    constructor(lobbyId, players) {
        this.lobbyId = lobbyId;
        this.players = players;
    }
}