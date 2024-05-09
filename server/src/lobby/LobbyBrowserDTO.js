module.exports = function getLobbyBrowserDTO(lobbyModel) {
    if (!lobbyModel) return null; 

    const lobbyBrowserDTO = {
        lobbyId: lobbyModel.lobbyId,
        isLocked: lobbyModel.lobbyPass === '' ? false : true,
        lobbyName: lobbyModel.lobbyName,
        chosenGame: lobbyModel.chosenGame,
        players: lobbyModel.users.length.toString() + '/' + lobbyModel.maxUsers
    }
    
    return lobbyBrowserDTO;
}