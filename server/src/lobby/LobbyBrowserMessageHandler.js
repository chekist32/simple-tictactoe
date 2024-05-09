const { lobbyService } = require('./LobbyService');
const getLobbyBrowserDTO = require('./LobbyBrowserDTO');


module.exports = function LobbyBrowserMessageHandler(parsedMsg) {
    const msg = {
        object: 'lobbyBrowser',
        type: '',
        payload: {
            lobbyData: {

            }
        }
    }
    switch (parsedMsg.type) {
        case 'createLobby':{
            msg.type = 'createLobby';

            const lobbyBrowserDTO = getLobbyBrowserDTO(createdLobby);

            msg.payload.lobbyData = lobbyBrowserDTO;
            msg.clients = 'all';

            return JSON.stringify(msg);
        }

        case 'getAllLobbies': {
            msg.type = 'getAllLobbies';

            const lobbyBrowserDTOArray = [];

            const lobbyModelArray = lobbyService.getAllLobbies();

            lobbyModelArray.forEach(lobbyModel => {
                const lobbyBrowserDTO = getLobbyBrowserDTO(lobbyModel);

                lobbyBrowserDTOArray.push(lobbyBrowserDTO);
            })

            msg.payload.lobbyData = lobbyBrowserDTOArray;
            msg.clients = 'all';

            return JSON.stringify(msg);
        }

        case 'updateLobby': {
            msg.type = 'updateLobby';

            const lobbyBrowserDTO = getLobbyBrowserDTO(lobbyService.getLobby(parsedMsg.payload.lobbyData.lobbyId));
            
            msg.payload.lobbyData = lobbyBrowserDTO;
            msg.clients = 'all';
            
            return JSON.stringify(msg);
        }

        default:
            return null;
    }
}