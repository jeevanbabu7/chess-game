const { spawn } = require('child_process');
const path = require('path');

// Path to Stockfish binary
const stockfishPath = path.join(__dirname, 'path/to/stockfish');

const stockfish = spawn(stockfishPath);

stockfish.stdout.on('data', (data) => {
    console.log(`Stockfish output: ${data}`);
});

stockfish.stderr.on('data', (data) => {
    console.error(`Stockfish error: ${data}`);
});

stockfish.on('close', (code) => {
    console.log(`Stockfish process exited with code ${code}`);
});

// Function to send commands to Stockfish
function sendCommand(command) {
    stockfish.stdin.write(`${command}\n`);
}

// Initialize Stockfish
sendCommand('uci'); // UCI initialization command
sendCommand('position startpos'); // Set up initial position
sendCommand('go depth 10'); // Start calculation with a search depth of 10
