const { ticTacToeService } = require('./TicTacToeService')
const { lobbyService } = require('../../lobby/LobbyService');
const { userService } = require('../../user/UserService');
const getTicTacToeDTO = require('./TicTacToeDTO')

module.exports = function ticTacToeMessageHandler(parsedMsg) {
    const gameData = parsedMsg.payload.gameData;
    
    if (!gameData) return null;

    const msg = {
        object: 'tictactoe',
        type: 'updateGame',
        payload: {
            gameData: {

            }
        } 

    }

    const clients = lobbyService.getAllUsers(gameData.lobbyId);
    if (clients === null) return null;

    switch (parsedMsg.type) {
        case 'initGame': {
            const game = ticTacToeService.initGame(gameData.lobbyId, parsedMsg.userId);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;

            return JSON.stringify(msg);
        }
        case 'joinGame': {
            const game = ticTacToeService.joinGame(gameData.lobbyId, parsedMsg.userId);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;
            
            return JSON.stringify(msg); 
        } 

        case 'chooseSide': {
            const game = ticTacToeService.chooseSide(gameData.lobbyId, parsedMsg.userId, gameData.chosenSide);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game); 

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;
            
            return JSON.stringify(msg); 
        }

        case 'changeReadyState': {
            const game = ticTacToeService.changeReadyState(gameData.lobbyId, parsedMsg.userId, gameData.isReady);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game); 

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;
            
            return JSON.stringify(msg); 
        }


        case 'updateGame': {
            const game = ticTacToeService.getGame(gameData.lobbyId);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;  
            
            return JSON.stringify(msg);
        }

        case 'makeMove': {
            const game = ticTacToeService.makeMove(gameData.lobbyId, parsedMsg.userId, gameData.coordinates);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;

            return JSON.stringify(msg);
        }

        case 'leaveGame': {
            const game = ticTacToeService.leaveGame(gameData.lobbyId, parsedMsg.userId);
            if (game === false) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);
              
            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;

            return JSON.stringify(msg);
            
        }

        case 'startGame': {
            const game = ticTacToeService.startGame(gameData.lobbyId, parsedMsg.userId);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;

            return JSON.stringify(msg);
        }

        case 'restartGame': {
            const game = ticTacToeService.restartGame(gameData.lobbyId, parsedMsg.userId);
            if (!game) return null;

            const ticTacToeDTO = getTicTacToeDTO(game);

            msg.payload.gameData = ticTacToeDTO;
            msg.clients = clients;

            return JSON.stringify(msg);
        }

        default:
            return null;
    }
}