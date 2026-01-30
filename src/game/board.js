const { BOARD_SIZE, SHIP_SIZES, CELL_VALUES } = require('../config/constants');

function createEmptyBoard() {
    return Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(CELL_VALUES.EMPTY));
}

function canPlaceShip(board, row, col, size, horizontal) {
    if (row < 0 || col < 0) return false;
    
    for (let i = 0; i < size; i++) {
        if (horizontal) {
            if (col + i >= BOARD_SIZE || board[row][col + i] !== CELL_VALUES.EMPTY) {
                return false;
            }
        } else {
            if (row + i >= BOARD_SIZE || board[row + i][col] !== CELL_VALUES.EMPTY) {
                return false;
            }
        }
    }
    return true;
}

function placeShip(board, row, col, size, horizontal) {
    for (let i = 0; i < size; i++) {
        if (horizontal) {
            board[row][col + i] = CELL_VALUES.SHIP;
        } else {
            board[row + i][col] = CELL_VALUES.SHIP;
        }
    }
}

function generateShipPlacement() {
    const board = createEmptyBoard();
    
    SHIP_SIZES.forEach(size => {
        let placed = false;
        let attempts = 0;
        const maxAttempts = 100;
        
        while (!placed && attempts < maxAttempts) {
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);
            const horizontal = Math.random() < 0.5;
            
            if (canPlaceShip(board, row, col, size, horizontal)) {
                placeShip(board, row, col, size, horizontal);
                placed = true;
            }
            attempts++;
        }
        
        if (!placed) {
            console.warn(`Failed to place ship of size ${size}`);
        }
    });
    
    return board;
}

function validateCoordinates(row, col) {
    return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

module.exports = {
    createEmptyBoard,
    canPlaceShip,
    placeShip,
    generateShipPlacement,
    validateCoordinates
};