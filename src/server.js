const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const GameState = require('./game/gameState');
const { MAX_PLAYERS } = require('./config/constants');
const { broadcastGameState, sendError, sendPlayerAssignment } = require('./websocket/broadcaster');
const { handleMove, handleStart, handleReset } = require('./websocket/handlers');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'battleship.html'));
});

const clients = new Map(); // Maps WebSocket -> playerNumber
const gameState = new GameState();

wss.on('connection', (ws) => {
    console.log('New client connected');

    if (clients.size >= MAX_PLAYERS) {
        console.log('Game is full, rejecting connection');
        ws.close();
        return;
    }

    const playerNumber = clients.size + 1;
    clients.set(ws, playerNumber);

    console.log(`Assigned player number: ${playerNumber}`);
    sendPlayerAssignment(ws, playerNumber);

    if (clients.size === MAX_PLAYERS) {
        console.log('Both players connected');
    }

    ws.on('message', (message) => {
        try {
            console.log(`Player ${playerNumber} sent:`, message);
            const data = JSON.parse(message);

            if (data.type === 'move') {
                handleMove(ws, playerNumber, data, clients, gameState);
            } else if (data.type === 'start') {
                handleStart(data, clients, gameState);
            } else if (data.type === 'reset') {
                handleReset(clients, gameState);
            } else {
                sendError(ws, 'Unknown message type');
            }
        } catch (error) {
            console.error('Error processing message:', error);
            sendError(ws, 'Server error processing message');
        }
    });

    ws.on('close', () => {
        console.log(`Player ${playerNumber} disconnected`);
        clients.delete(ws);
        
        if (clients.size === 0) {
            console.log('All clients disconnected, resetting game state');
            gameState.reset();
        }
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error from player ${playerNumber}:`, error);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});