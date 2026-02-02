const { log } = require('../config/logger');
const { validateCoordinates } = require('../game/board');
const { checkWin, hasAlreadyAttacked } = require('../game/rules');
const { broadcastGameState, sendError } = require('./broadcaster');


function handleMove(ws, playerNumber, data, clients, gameState) {
    // Validate: is it this player's turn?
    if (gameState.currentPlayer !== playerNumber) {
        sendError(ws, 'Not your turn');
        return;
    }

    if (!gameState.gameActive) {
        sendError(ws, 'Game not active');
        return;
    }

    const { row, col } = data;
    const opponent = playerNumber === 1 ? 2 : 1;

    // Validate coordinates
    if (!validateCoordinates(row, col)) {
        sendError(ws, 'Invalid coordinates');
        return;
    }

    // Check if already attacked
    if (hasAlreadyAttacked(gameState.attackHistory[playerNumber], row, col)) {
        sendError(ws, 'Cell already attacked');
        return;
    }

    // Record the attack
    gameState.recordAttack(playerNumber, row, col);

    console.log(`Player ${playerNumber} attacked (${row}, ${col})`);

    // Check if this was a winning move
    const gameWon = checkWin(gameState.attackHistory[playerNumber], gameState.actualBoards[opponent]);

    if (gameWon) {
        gameState.endGame();
        console.log(`Player ${playerNumber} won!`);
        broadcastGameState(clients, gameState);
    } else {
        gameState.switchTurn();
        broadcastGameState(clients, gameState);
    }
}

function handleStart(data, clients, gameState) {
    gameState.playersReady++;
    console.log(`Players ready: ${gameState.playersReady}/2`);
    
    if (gameState.playersReady === 2) {
        gameState.initialize();
        log('STATE', 'Game started', { 
            gameActive: true
        });
        broadcastGameState(clients, gameState);
    }
}

function handleReset(clients, gameState) {
    console.log('Game reset requested');
    gameState.reset();
    broadcastGameState(clients, gameState);
}

module.exports = {
    handleMove,
    handleStart,
    handleReset
};