const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(express.static(path.join("__dirname")));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'battleship.html'));
});

const clients = new Set();
let gameState = {
    boards: {},
    currentPlayer: 1,
    gameActive: false
};

wss.on('connection', (ws) => {
    clients.add(ws);

    if (clients.size === 1) {
        ws.send(JSON.stringify({ type: 'player', number: 1 }));
    } else if (clients.size === 2) {
        ws.send(JSON.stringify({ type: 'player', number: 2 }));
        broadcastGameState();
    } else {
        ws.send(JSON.stringify({ type: 'error', message: 'Game is full' }));
        ws.close();
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'move') {
            gameState.boards[data.player] = data.board;
            gameState.currentPlayer = data.currentPlayer;
            gameState.gameActive = data.gameActive;
        } else if (data.type === 'start') {
            gameState.gameActive = true;
            gameState.currentPlayer = 1;
        } else if (data.type === 'reset') {
            gameState = {
                boards: {},
                currentPlayer: 1,
                gameActive: false
            };
        }

        broadcastGameState();
    });

    ws.on('close', () => {
        clients.delete(ws);
        if (clients.size === 0) {
            gameState = {
                boards: {},
                currentPlayer: 1,
                gameActive: false
            };
        }
    });
});

function broadcastGameState() {
    const message = JSON.stringify({ type: 'gameState', ...gameState });
    for (const client of clients) {
        client.send(message);
    }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});