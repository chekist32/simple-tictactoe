const LobbyBrowserDTO = require('./LobbyBrowserDTO');
const { lobbyService } = require('./LobbyService');

module.exports = function lobbyMessageHandler(parsedMsg) {
    const msg = {
        object: 'lobby',
        type: '',
        payload: {
            lobbyData: {

            }
        }
    }

    const lobbyData = parsedMsg.payload.lobbyData;
    if (!lobbyData) return null;

    switch (parsedMsg.type) {
        case 'leaveLobby':
            msg.type = 'leaveLobby';

            const leftLobby = lobbyService.leaveLobby(lobbyData.lobbyId, parsedMsg.userId);

            const lobbyBrowserMsg = {
                object: 'lobbyBrowser',
                type: '',
                payload: {
                    lobbyData: {
                        
                    }
                }
            }

            if (leftLobby === null) {
                lobbyBrowserMsg.type = 'deleteLobby';
                lobbyBrowserMsg.payload.lobbyData = { lobbyId: lobbyData.lobbyId };
                
                lobbyBrowserMsg.clients = 'all';

                return JSON.stringify(lobbyBrowserMsg);
            }
            else if (leftLobby) {
                lobbyBrowserMsg.type = 'updateLobby';
                lobbyBrowserMsg.payload.lobbyData = LobbyBrowserDTO(leftLobby);
                
                lobbyBrowserMsg.clients = 'all';

                return JSON.stringify(lobbyBrowserMsg);
            }

            return null;
    
        default:
            return null;
    }

}