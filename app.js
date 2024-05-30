const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const { Chess } = require('chess.js');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const chess = new Chess();

let players = {};

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { title: 'Custom Chess Game' });
});

io.on('connection', (socket) => {
    console.log("user connected");

    // Assign players
    if (!players.white) {
        players.white = socket.id;
        socket.emit("playerRole", "w");
    } else if (!players.black) {
        players.black = socket.id;
        socket.emit("playerRole", "b");
    } else {
        socket.emit("spectatorRole");
    }

    // Handle player disconnect
    socket.on("disconnect", () => {
        if (socket.id === players.black) {
            delete players.black;
        } else if (socket.id === players.white) {
            delete players.white;
        }
        console.log("user disconnected");
    });

    // Handle player move
    socket.on("move", (move) => {
        try {
            const { from, to, promotion } = move;
            const playerTurn = chess.turn();
            if ((playerTurn === 'w' && socket.id !== players.white) || (playerTurn === 'b' && socket.id !== players.black)) {
                return;
            }
            const result = chess.move({ from, to, promotion });
            if (result) {
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            } else {
                socket.emit("invalidMove", move);
            }
        } catch (err) {
            socket.emit("invalidMove", move);
        }
    });
});

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});
