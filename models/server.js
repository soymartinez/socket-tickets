const express = require('express');
const cors = require('cors');
const { serverSocket } = require('../sockets/serverSocket');

class Server {

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.server = require('http').createServer(this.app);
        this.io = require('socket.io')(this.server);

        // midellware
        this.midellware();

        // routes
        this.routes();

        // sockets
        this.socketEvents();
    }

    socketEvents() {
        this.io.on('connection', serverSocket);
    }

    midellware() {
        this.app.use(cors());
        this.app.use(express.static('public'));
    }

    routes() {
        // this.app.use(require('../routes/index'));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log('Servidor listo en puerto', this.port + ` ➡  http://localhost:${this.port}/`);
        });
    }
}

module.exports = Server;