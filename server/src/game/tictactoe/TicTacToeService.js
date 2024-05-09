const { gameDatabase } = require('../GameDatabase');
const { lobbyService } = require('../../lobby/LobbyService');
const TicTacToeEntity = require('./TicTacToeEntity');

function getResult(gameState) {
    if (!Array.isArray(gameState)) return null;

        let res;

        for (const row of gameState) {
            if (res === 3) return 1;
            else if (res === 0) return 0;
            
            res = 0;
            
            for (const elem of row) {
                res += elem;
            }
        }

        if (res === 3) return 1;
        else if (res === 0) return 0;


        for (let column = 0; column < gameState.length; column++) {
            if (res === 3) return 1;
            else if (res === 0) return 0;
            
            res = 0;
            
            for (let row = 0; row < gameState.length; row++) {
                res += gameState[row][column];
            }  
        }

        if (res === 3) return 1;
        else if (res === 0) return 0;


        res = 0;
        for (let i = 0; i < gameState.length; i++) {
            res += gameState[i][i]
        }

        if (res === 3) return 1;
        else if (res === 0) return 0;


        res = 0;
        for (let i = 0; i < gameState.length; i++) {
            res += gameState[gameState.length-1-i][i]
        }

        if (res === 3) return 1;
        else if (res === 0) return 0;

    return null;
}

class TicTacToeService {

    initGame(lobbyId, admin) {
        if (lobbyService.lobbyExists(lobbyId) && 
            !gameDatabase.existsById(lobbyId) && 
            lobbyService.isLobbyAdmin(lobbyId, admin)) {

                const players = {};
                players[admin] = {userId: admin, chosenSide: null, isReady: false, isAdmin: true}

                const gameEntity = new TicTacToeEntity(lobbyId, players);
                
                gameDatabase.save(lobbyId, gameEntity);
                
                return gameEntity;  
        }

        return null;
    }

    joinGame(lobbyId, userId) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;

        const isJoined = Object.values(game.players).some(player => player.userId === userId);

        if (isJoined) return game;

        if (lobbyService.lobbyExists(lobbyId) && 
            lobbyService.belongsToLobby(lobbyId, userId) && 
            game.status === TicTacToeEntity.GAME_STATUS.UNINITIALIZED) {

            game.players[userId] = {userId: userId, chosenSide: null, isReady: false, isAdmin: false}
            gameDatabase.save(lobbyId, game);

            return game;
        }
        return null;
    }
    
    getGame(lobbyId) {
        const game = gameDatabase.findElementById(lobbyId)
        if (!game) return null;

        return game;
    }

    chooseSide(lobbyId, userId, side) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;

        if (lobbyService.lobbyExists(lobbyId) && 
            lobbyService.belongsToLobby(lobbyId, userId) && 
            (side === null ||
            !Object.values(game.players).some(player => player.chosenSide === side)) &&
            game.status === TicTacToeEntity.GAME_STATUS.UNINITIALIZED) {

            const player = game.players[userId];
            
            player.chosenSide = side;

            if (side === null) player.isReady = false;

            game.players[userId] = player;

            gameDatabase.save(lobbyId, game);

            return game;
        }
        return null;
    }

    changeReadyState(lobbyId, userId, state) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;

        if (lobbyService.lobbyExists(lobbyId) && 
            lobbyService.belongsToLobby(lobbyId, userId) && 
            game.players[userId].chosenSide !== null &&
            game.status === TicTacToeEntity.GAME_STATUS.UNINITIALIZED) {

            const player = game.players[userId];

            player.isReady = state;

            game.players[userId] = player;

            gameDatabase.save(lobbyId, game);

            return game;
    }
    return null;
}


    startGame(lobbyId, userId) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;

        if (lobbyService.lobbyExists(lobbyId) &&
            lobbyService.belongsToLobby(lobbyId, userId) &&
            lobbyService.isLobbyAdmin(lobbyId, userId) &&
            Object.values(game.players).length === 2 && 
            Object.values(game.players).every(player => player.chosenSide !== null && player.isReady) &&
            game.status === TicTacToeEntity.GAME_STATUS.UNINITIALIZED) {

            const firstPlayer = Object.values(game.players).find(player => player.chosenSide === 1);
            const secondPlayer = Object.values(game.players).find(player => player.chosenSide === 0);
            
            game.turn = {
                players: [
                    firstPlayer.userId,
                    secondPlayer.userId
                ],
                currentTurnIndex: 0,
                numberOfCommittedTurns: 0
            }

            game.status = TicTacToeEntity.GAME_STATUS.STARTED;
            gameDatabase.save(lobbyId, game);

            return game;
        }
        return null;
    }

    makeMove(lobbyId, userId, coordinates) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;

        if (lobbyService.lobbyExists(lobbyId) && 
            lobbyService.belongsToLobby(lobbyId, userId) && 
            !game.winner &&
            userId === game.turn.players[game.turn.currentTurnIndex] && 
            game.gameState[coordinates.row][coordinates.column] === undefined) {

                game.gameState[coordinates.row][coordinates.column] = game.players[userId].chosenSide;
                game.turn.currentTurnIndex = (game.turn.currentTurnIndex + 1) % 2;
                game.turn.numberOfCommittedTurns++;

                const result = getResult(game.gameState);

                if (result !== null) {
                    game.winner = Object.values(game.players).find(player => player.chosenSide === result).userId;
                    game.status = TicTacToeEntity.GAME_STATUS.ENDED;
                }
                else if (game.turn.numberOfCommittedTurns === 9) {
                    game.winner = 'none';
                    game.status = TicTacToeEntity.GAME_STATUS.ENDED;
                }

                gameDatabase.save(lobbyId, game);

                return game;
            }
        return null;
    }

    leaveGame(lobbyId, userId) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;

        if (lobbyService.belongsToLobby(lobbyId, userId)) {

            if (lobbyService.isLobbyAdmin(lobbyId, userId)) {
                gameDatabase.deleteElement(lobbyId);
                return null;
            } 

            delete game.players[userId];
            
            game.turn = undefined;
            game.winner = undefined;
            game.status = TicTacToeEntity.GAME_STATUS.UNINITIALIZED;
            game.gameState = [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined]
            ]
            return game;
        }

       return false;
    }
   
    restartGame(lobbyId, userId) {
        const game = gameDatabase.findElementById(lobbyId);
        if (!game) return null;


        if (lobbyService.lobbyExists(lobbyId) && lobbyService.isLobbyAdmin(lobbyId, userId)) {
            game.turn = undefined;
            game.winner = undefined;
            game.status = TicTacToeEntity.GAME_STATUS.UNINITIALIZED;
            game.gameState = [
                [undefined, undefined, undefined],
                [undefined, undefined, undefined],
                [undefined, undefined, undefined]
            ]
    
            return game;
        }

        return null;
    }

}




const ticTacToeService = new TicTacToeService();

module.exports = {
    ticTacToeService,
    TicTacToeService
}