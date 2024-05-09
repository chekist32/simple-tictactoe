const Database = require('../db/Database');

class GameDatabase extends Database {
    constructor() {super()};
}

const gameDatabase = new GameDatabase();

module.exports = {
    GameDatabase,
    gameDatabase
}