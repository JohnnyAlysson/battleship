const { generateShipPlacement, createEmptyBoard } = require('./board');

class GameState {
    constructor() {
        this.reset();
    }

    reset() {
        this.boards = {
            1: null,
            2: null
        };
        this.actualBoards = {
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
        this.actualBoards[1] = generateShipPlacement();
        this.actualBoards[2] = generateShipPlacement();
        
        const { getOpponentBoardView } = require('./rules');
        this.boards[1] = getOpponentBoardView(this.actualBoards[1], this.attackHistory[1]);
        this.boards[2] = getOpponentBoardView(this.actualBoards[2], this.attackHistory[2]);
        
        this.currentPlayer = 1;
        this.gameActive = true;
        this.playersReady = 0;
    }

    recordAttack(playerNumber, row, col) {
        this.attackHistory[playerNumber].push({ row, col });
        
        const opponent = playerNumber === 1 ? 2 : 1;
        const { getOpponentBoardView } = require('./rules');
        this.boards[opponent] = getOpponentBoardView(
            this.actualBoards[opponent],
            this.attackHistory[playerNumber]
        );
    }

    switchTurn() {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
    }

    endGame() {
        this.gameActive = false;
    }

    getState() {
        return {
            type: 'gameState',
            currentPlayer: this.currentPlayer,
            gameActive: this.gameActive,
            boards: this.boards,
            attackHistory: this.attackHistory
        };
    }
}

module.exports = GameState;