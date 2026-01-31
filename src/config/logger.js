const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(category, message, data = null) {
    const timestamp = new Date().toLocaleTimeString();
    const categoryColors = {
        'CONNECTION': colors.cyan,
        'GAME': colors.green,
        'MOVE': colors.blue,
        'STATE': colors.magenta,
        'ERROR': colors.red,
        'BROADCAST': colors.yellow
    };
    
    const color = categoryColors[category] || colors.reset;
    const prefix = `${color}[${timestamp}] [${category}]${colors.reset}`;
    
    if (data) {
        console.log(`${prefix} ${message}`, data);
    } else {
        console.log(`${prefix} ${message}`);
    }
}

module.exports = { log };