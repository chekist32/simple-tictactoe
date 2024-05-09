const { userService } = require('../../user/UserService');

module.exports = function getTicTacToeDTO(ticTacToeEntity) {
    if(!ticTacToeEntity) return null;
    
    const ticTacToeDTO = {
        lobbyId: ticTacToeEntity.lobbyId,
        players: ticTacToeEntity.players,
        turn: ticTacToeEntity.turn ? ticTacToeEntity.turn.players[ticTacToeEntity.turn.currentTurnIndex] : null,
        gameState: ticTacToeEntity.gameState,
        winner: ticTacToeEntity.winner ? ticTacToeEntity.winner : null,
        status: ticTacToeEntity.status
    }

    for (const userId in ticTacToeDTO.players) {
        const player = ticTacToeDTO.players[userId];
        player.username = userService.getUser(userId).username;
        ticTacToeDTO.players[userId] = player;
    }

    return ticTacToeDTO;
}