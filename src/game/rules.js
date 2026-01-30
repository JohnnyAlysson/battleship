const { BOARD_SIZE, CELL_VALUES } = require('../config/constants');

function isHit(actualBoard, row, col) {
    return actualBoard[row][col] === CELL_VALUES.SHIP;
}

function checkWin(attackHistory, actualBoard) {
    // Check if all ships on the board have been hit
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            if (actualBoard[i][j] === CELL_VALUES.SHIP) {
                const hit = attackHistory.some(pos => pos.row === i && pos.col === j);
                if (!hit) {
                    return false; // Ship still intact
                }
            }
        }
    }
    return true; // All ships destroyed
}

function hasAlreadyAttacked(attackHistory, row, col) {
    return attackHistory.some(pos => pos.row === row && pos.col === col);
}

function getOpponentBoardView(actualBoard, attackHistory) {
    // Returns a view of the opponent's board showing only hits and misses
    const { createEmptyBoard } = require('./board');
    const view = createEmptyBoard();
    
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const attacked = attackHistory.some(pos => pos.row === i && pos.col === j);
            if (attacked) {
                view[i][j] = actualBoard[i][j] === CELL_VALUES.SHIP ? CELL_VALUES.HIT : CELL_VALUES.MISS;
            }
        }
    }
    return view;
}

module.exports = {
    isHit,
    checkWin,
    hasAlreadyAttacked,
    getOpponentBoardView
};