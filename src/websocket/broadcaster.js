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
        client.send(JSON.stringify({ type: 'player', number: playerNumber }));
    }
}

module.exports = {
    broadcastGameState,
    sendError,
    sendPlayerAssignment
};