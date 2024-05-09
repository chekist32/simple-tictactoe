const express = require('express');
const LobbyController = express.Router();
const { lobbyService } = require('./LobbyService');
const lobbyBrowserMessageHandler = require('./LobbyBrowserMessageHandler');

const getLobbyBrowserDTO = require('./LobbyBrowserDTO')

LobbyController.put('/join/:id', function joinLobby(req, res) {
    const wss = req.app.get('wss');

    const userId = req.cookies.userId;

    const lobbyId = req.params.id;
    const pass = req.body.pass;


    try {
        lobbyService.joinLobby(lobbyId, userId, pass);
    } catch (err) {
        return res.status(err.statusCode).send(err.message);
    }

    const wsMessage = lobbyBrowserMessageHandler({
        object: 'lobbyBrowser', 
        type: 'updateLobby',
        payload: {
            lobbyData: {
                lobbyId: lobbyId
            }
        } 
    });
    
    if (wsMessage) {
        wss.clients.forEach(client => {
            client.send(wsMessage); 
        }); 
    }

    res.sendStatus(200);
});

LobbyController.post('/createLobby', function createLobby(req, res) {
    const wss = req.app.get('wss');

    const userId = req.cookies.userId;

    const lobbyName = req.body.lobbyName;
    const pass = req.body.pass;
    const chosenGame = req.body.chosenGame;

    if (typeof(pass) !== 'string' || typeof(lobbyName) !== 'string' || !chosenGame || typeof(chosenGame) !== 'string' ) {
        return res.sendStatus(400);
    }

    const lobbyDataFromUser = {
        lobbyName: lobbyName,
        pass: pass,
        chosenGame: chosenGame,
        users: [userId],
        admin: userId
    }

    try { 
        const createdLobby = lobbyService.createLobby(lobbyDataFromUser);
        
        const lobbyBrowserDTO = getLobbyBrowserDTO(createdLobby);
        
        const wsMessage = {
            object: 'lobbyBrowser',
            type: 'createLobby',
            payload: {
                lobbyData: lobbyBrowserDTO,
            },
            clients: 'all'
        }
        wss.clients.forEach(client => {
            client.send(JSON.stringify(wsMessage));
        });

        return res.status(201).json(lobbyBrowserDTO);
    } catch(err) {
        return res.sendStatus(500);
    }
    
});

module.exports = LobbyController;


