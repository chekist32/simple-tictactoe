const lobbyBrowserMessageHandler = require('./lobby/LobbyBrowserMessageHandler')
const lobbyMessageHandler = require('./lobby/LobbyMessageHandler')
const tictactoeMessageHandler = require('./game/tictactoe/TicTacToeMessageHandler')

module.exports = function websocketMessageHandler(msg, userId) {
    const parsedMsg = JSON.parse(msg);
    parsedMsg.userId = userId;

    switch (parsedMsg.object) {
        case "lobbyBrowser":
            return lobbyBrowserMessageHandler(parsedMsg);

        case 'lobby': 
            return lobbyMessageHandler(parsedMsg);
            
        case 'tictactoe':
            return tictactoeMessageHandler(parsedMsg);

        default:
            return null;
    }
} 