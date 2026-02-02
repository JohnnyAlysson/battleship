const { generateShipPlacement, createEmptyBoard } = require('./board');
const { log } = require('../config/logger');

class GameState {
    constructor() {
        log('STATE', 'GameState instance created');
        this.reset();
    }

    reset() {
        log('STATE', 'GameState reset to initial values');

        if (this.turnTimer) {
            clearTimeout(this.turnTimer);
        }
        this.timeLeft = 30;

        this.boards = {
            1: null,
            2: null
        };
        this.actualBoards = {
            1: null,
            2: null
        };
        this.shipBoards = {
            1: null,
            2: null
        };
        this.currentPlayer = 1;
        this.gameActive = false;
        this.playersReady = 0;
        this.attackHistory = {
            1: [],
            2: []
        };
    }

    initialize() {
        log('STATE', 'Initializing game - Generating ship placements');
        
        this.actualBoards[1] = generateShipPlacement();
        log('STATE', 'Ships generated for Player 1', { totalShips: 5 });
        
        this.actualBoards[2] = generateShipPlacement();
        log('STATE', 'Ships generated for Player 2', { totalShips: 5 });
        
        // Store ship positions for sending to clients
        this.shipBoards[1] = JSON.parse(JSON.stringify(this.actualBoards[1]));
        this.shipBoards[2] = JSON.parse(JSON.stringify(this.actualBoards[2]));
        log('STATE', 'Ship boards cloned for client display');
        
        const { getOpponentBoardView } = require('./rules');
        this.boards[1] = getOpponentBoardView(this.actualBoards[1], this.attackHistory[1]);
        this.boards[2] = getOpponentBoardView(this.actualBoards[2], this.attackHistory[2]);
        log('STATE', 'Opponent board views created');
        
        this.currentPlayer = 1;
        this.gameActive = true;
        this.playersReady = 0;

        this.timeLeft = 30;
        this.startTurnTimer();

        log('STATE', 'Timer started');
        
        log('STATE', 'Game initialization complete', { 
            currentPlayer: this.currentPlayer, 
            gameActive: this.gameActive 
        });
    }

    startTurnTimer() {
        if (this.turnTimer) {
            clearInterval(this.turnTimer);
        }
        
        this.timeLeft = 30;
        
        const timerInterval = setInterval(() => {
            this.timeLeft--;
            
            if (this.timeLeft <= 0) {
                clearInterval(timerInterval);
                log('STATE', `Turn timer expired for Player ${this.currentPlayer}`);
                this.switchTurn();
                
                // Broadcast the state change after timer expires
                const { broadcastGameState } = require('../websocket/broadcaster');
                // Store clients reference to use here
                if (this.clients) {
                    broadcastGameState(this.clients, this);
                }
            }
        }, 1000);
        
        this.turnTimer = timerInterval;
    }

    recordAttack(playerNumber, row, col) {
        log('STATE', `Recording attack for Player ${playerNumber}`, { row, col });
        
        this.attackHistory[playerNumber].push({ row, col });
        
        const opponent = playerNumber === 1 ? 2 : 1;
        const { getOpponentBoardView } = require('./rules');
        this.boards[opponent] = getOpponentBoardView(
            this.actualBoards[opponent],
            this.attackHistory[playerNumber]
        );
        
        const hit = this.actualBoards[opponent][row][col] === 1;
        log('STATE', `Attack result: ${hit ? 'HIT' : 'MISS'}`, { 
            attacker: playerNumber, 
            target: opponent,
            totalAttacks: this.attackHistory[playerNumber].length 
        });
    }

    switchTurn() {
        const oldPlayer = this.currentPlayer;
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
        this.startTurnTimer();
        log('STATE', `Turn switched, timer reset`, { from: oldPlayer, to: this.currentPlayer });
    }

    endGame() {
        if (this.turnTimer) {
            clearInterval(this.turnTimer);
        }
        log('STATE', 'Game ended');
        this.gameActive = false;
    }

    getState() {
        return {
            type: 'gameState',
            currentPlayer: this.currentPlayer,
            gameActive: this.gameActive,
            timeLeft: this.timeLeft,
            boards: this.boards,
            shipBoards: this.shipBoards,
            attackHistory: this.attackHistory
        };
    }
}

module.exports = GameState;