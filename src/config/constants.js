const BOARD_SIZE = 10;
const SHIP_SIZES = [5, 4, 3, 3, 2];
const MAX_PLAYERS = 2;
const TURN_TIME = 30; // seconds

const CELL_VALUES = {
    EMPTY: 0,
    SHIP: 1,
    HIT: 2,
    MISS: 3
};

module.exports = {
    BOARD_SIZE,
    SHIP_SIZES,
    MAX_PLAYERS,
    TURN_TIME,
    CELL_VALUES
};