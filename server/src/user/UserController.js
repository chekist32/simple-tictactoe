const express = require('express');
const UserController = express.Router();
const { userService } = require('./UserService');

UserController.get('/', function retrieveUser(req, res) {
    const sessionId = req.cookies.sessionId;
    const userId = req.cookies.userId;


    if (!sessionId || !userId) {
        res.redirect('http://localhost:8081/api/user' + '/registerUser');
        return;
    }

    const user = userService.getUser(userId);
    
    if (!user || !(user.sessionId === sessionId)) {
        res.redirect('http://localhost:8081/api/user' + '/registerUser');
        return;
    }

    const UserDTO = {
        userId: user.userId,
        username: user.username
    };
    
    res.json(UserDTO);
});

UserController.get('/registerUser', function registerUser(req, res) {
    try {
        const registeredUser = userService.createUser();
        
        const UserDTO = {
            userId: registeredUser.userId,
            username: registeredUser.username
        };
    
        res.cookie('sessionId', registeredUser.sessionId, {
            httpOnly: true,
            secure: true
        })
        res.cookie('userId', registeredUser.userId, {
            httpOnly: true,
            secure: true
        });

        return res.status(201).json(UserDTO);  
    } catch (error) {
        return res.sendStatus(500);
    }
    
});

UserController.put('/updateUsername', function updateUsername(req, res) {
    const userId = req.cookies.userId;
    const newUsername = req.body.username; 

    try {
        const updatedUser = userService.updateUsername(userId, newUsername);
        return res.status(200).send({
            userId: updatedUser.userId,
            username: updatedUser.username
        });
    } catch (err) {
        return res.status(err.statusCode).send(err.message);
    }
})


module.exports = UserController;