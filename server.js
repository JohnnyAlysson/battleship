const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });


app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'battleship.html'));
});

const clients = new Map();
let gameState = {
    boards: {},
    currentPlayer: 1,
    gameActive: false,
    playersReady: 0
};

wss.on('connection', (ws) => {
    console.log('New client connected');

    if (clients.size >= 2) {
      console.log('Game is full, rejecting connection');
      ws.close();
      return;
    }

    const playerNumber = clients.size + 1;
    clients.set(ws, playerNumber);

    console.log(`Assigning player number: ${playerNumber}`);
    ws.send(JSON.stringify({ type: 'player', number: playerNumber }));

    if (clients.size === 2) {
      console.log('Two players connected, waiting for both to start');
      broadcastGameState();
    }


    ws.on('message', (message) => {
      console.log('Received message:', message);
      const data = JSON.parse(message);
      
      if (data.type === 'move') {
          if (gameState.currentPlayer === playerNumber && gameState.gameActive) {
              gameState.boards[data.player] = data.board;
              gameState.currentPlayer = gameState.currentPlayer === 1 ? 2 : 1;
              broadcastGameState();
          }
      } else if (data.type === 'start') {
          gameState.playersReady++;
          if (gameState.playersReady === 2) {
              gameState.gameActive = true;
              gameState.currentPlayer = 1;
              broadcastGameState();
          }
      } else if (data.type === 'reset') {
          gameState = {
              boards: {},
              currentPlayer: 1,
              gameActive: false,
              playersReady: 0
          };
          broadcastGameState();
      }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clients.delete(ws);
        if (clients.size === 0) {
            gameState = {
                boards: {},
                currentPlayer: 1,
                gameActive: false,
                playersReady: 0
            };
        }
    });
});

function broadcastGameState() {
  const message = JSON.stringify({ type: 'gameState', ...gameState });
  for (const [client, playerNumber] of clients) {
      client.send(message);
  }
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});