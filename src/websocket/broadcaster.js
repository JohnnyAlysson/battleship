const{BOARD_SIZE,SHIP_SIZES,CELL_VALUES}=require('../config/constants');
const { log } = require('../config/logger');

function broadcastGameState(clients, gameState) {
    const message = JSON.stringify(gameState.getState());
    
    for (const [client] of clients) {
        if (client.readyState === 1) { // 1 = OPEN
            client.send(message);
        }
    }
}

function sendError(client, message) {
    if (client.readyState === 1) {
        client.send(JSON.stringify({ type: 'error', message }));
    }
}

function sendPlayerAssignment(client, playerNumber) {
    if (client.readyState === 1) {
        const message = { 
            type: 'player', 
            number: playerNumber,
            constants:{
                BOARD_SIZE,
                SHIP_SIZES,
                CELL_VALUES
            }
        };
        client.send(JSON.stringify(message));
        log('BROADCAST', `Information from Player ${playerNumber} Sent`, message);
    }
}

module.exports = {
    broadcastGameState,
    sendError,
    sendPlayerAssignment
};