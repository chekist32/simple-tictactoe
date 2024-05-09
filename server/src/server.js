const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');

const config = require('./config/config');
const serverConfig = config.dev.server;

const server = require('http').createServer(app);
const cors = require('cors');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ server })

const UserController = require("./user/UserController");
const { userService } = require("./user/UserService");

const { lobbyService } = require('./lobby/LobbyService');
const LobbyController = require('./lobby/LobbyController');
const LobbyBrowserDTO = require('./lobby/LobbyBrowserDTO');

const { ticTacToeService } = require('./game/tictactoe/TicTacToeService');
const TicTacToeDTO = require('./game/tictactoe/TicTacToeDTO');

const WebsocketMessageHandler = require('./WebsocketMessageHandler');

const customCookieParser = require('./CustomCookieParser');


const corsOptions = {   
    origin: ['http://localhost:5173'],
    credentials: true
} 

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

function userValidationMiddleware(req, res, next) {
    const cookies = req.cookies;

    if (req.path === '/api/user' || req.path === '/api/user/registerUser') {
        return next();
    }
    else if (userService.validateUser(cookies.userId, cookies.sessionId)) {
        return next();
    }

    return res.sendStatus(401);
}


app.use(userValidationMiddleware);

app.use('/api/user', UserController);
app.use('/api/lobby', LobbyController);


wss.on('connection', function connection(ws, req) {
    ws.on('error', (err) => console.error('error occured ' + err));

    const cookies = customCookieParser(req.headers.cookie);

    if (!userService.validateUser(cookies.userId, cookies.sessionId)) {
        ws.close();
    }

    userService.addSocketConnection(cookies.userId, ws);


    ws.on('message', (msg) => {
        if (!userService.validateUser(cookies.userId, cookies.sessionId)) {
            return ws.send('restricted');
        }

        const res = WebsocketMessageHandler(msg, cookies.userId);
        if (res) {
            const parsedRes = JSON.parse(res);
            if (parsedRes.clients === 'all') {
                wss.clients.forEach(client => {
                    client.send(res);
                })
            } else if (parsedRes.clients && parsedRes.clients.length > 0) {
                const clients = userService.getSocketConnections(parsedRes.clients);
                clients.forEach(client => {
                    if (client) {
                        client.send(res);   
                    }
                })
            }
       }
    })

    ws.on('close', () => {
        const lobbyId = userService.getUser(cookies.userId).lobbyId; 

        if (lobbyService.lobbyExists(lobbyId)) {

            const connections = userService.getSocketConnections(lobbyService.getAllUsers(lobbyId));

            const leftGame = ticTacToeService.leaveGame(lobbyId, cookies.userId);

            if (leftGame !== false) {
                connections.forEach(connection => {
                    if (connection) {
                        connection.send(JSON.stringify({
                            object: 'game',
                            type: 'updateGame',
                            payload: {
                                gameData: TicTacToeDTO(leftGame)
                            }
                        }))
                    }
                })
            }

            const leftLobby = lobbyService.leaveLobby(lobbyId, cookies.userId);

            if (leftLobby === null) {
                const lobbyBrowserMsg = {
                    object: 'lobbyBrowser',
                    type: 'deleteLobby',
                    payload: {
                        lobbyData: {
                            lobbyId: lobbyId
                        }
                    }
                }
    
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(lobbyBrowserMsg));
                });
            }
            else if (leftLobby) {
                const lobbyBrowserMsg = {
                    object: 'lobbyBrowser',
                    type: 'updateLobby',
                    payload: {
                        lobbyData: LobbyBrowserDTO(leftLobby)
                    }
                }
                wss.clients.forEach(client => {
                    client.send(JSON.stringify(lobbyBrowserMsg));
                });
            }
        }
        userService.deleteSocketConnection(cookies.userId);
        
        console.log('connection was closed')
    })
});


app.set('wss', wss);


server.listen(serverConfig.port, () => {
    console.log('Server was started on port: %s', serverConfig.port);
});