const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const GameState = require('./game/gameState');
const { MAX_PLAYERS } = require('./config/constants');
const { broadcastGameState, sendError, sendPlayerAssignment } = require('./websocket/broadcaster');
const { handleMove, handleStart, handleReset } = require('./websocket/handlers');
const { log } = require('./config/logger');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Serve static files from parent directory
app.use(express.static(path.join(__dirname, '..')));

app.get('/', (req, res) => {
    log('CONNECTION', 'HTTP request for index page');
    res.sendFile(path.join(__dirname, '..', 'battleship.html'));
});

const clients = new Map(); // Maps WebSocket -> playerNumber
const gameState = new GameState();

wss.on('connection', (ws) => {
    log('CONNECTION', `New client connected`, { totalClients: clients.size + 1 });

    if (clients.size >= MAX_PLAYERS) {
        log('CONNECTION', 'Game is full, rejecting new connection');
        ws.close();
        return;
    }

    const playerNumber = clients.size + 1;
    clients.set(ws, playerNumber);

    log('CONNECTION', `Player ${playerNumber} assigned`, { totalPlayers: clients.size });
    sendPlayerAssignment(ws, playerNumber);

    if (clients.size === MAX_PLAYERS) {
        log('GAME', '✓ Both players connected - Game can start');
    }

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message);
            log('CONNECTION', `Message received from Player ${playerNumber}`, { type: data.type });

            if (data.type === 'move') {
                handleMove(ws, playerNumber, data, clients, gameState);
            } else if (data.type === 'start') {
                log('GAME', `Player ${playerNumber} clicked Start Game`);
                handleStart(data, clients, gameState);
            } else if (data.type === 'reset') {
                log('GAME', `Player ${playerNumber} clicked Reset Game`);
                handleReset(clients, gameState);
            } else {
                log('ERROR', `Unknown message type from Player ${playerNumber}`, { type: data.type });
                sendError(ws, 'Unknown message type');
            }
        } catch (error) {
            log('ERROR', `Error processing message from Player ${playerNumber}`, { error: error.message });
            sendError(ws, 'Server error processing message');
        }
    });

    ws.on('close', () => {
        log('CONNECTION', `Player ${playerNumber} disconnected`, { remainingPlayers: clients.size - 1 });
        clients.delete(ws);
        
        if (clients.size === 0) {
            log('GAME', 'All clients disconnected - Resetting game state');
            gameState.reset();
        }
    });

    ws.on('error', (error) => {
        log('ERROR', `WebSocket error from Player ${playerNumber}`, { error: error.message });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    log('CONNECTION', `✓ Server is running`, { port: PORT, url: `http://localhost:${PORT}` });
});