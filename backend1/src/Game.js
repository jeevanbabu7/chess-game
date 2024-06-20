import { Chess } from 'chess.js';
import { GAME_OVER, INIT_GAME, MOVE } from './Messages.js';

export default class Game {
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;

        // Send initial game setup messages to players
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'w'
            }
        }));

        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: 'b'
            }
        }));
    }

    makeMove(socket, move) {
        // Ensure the move is made by the correct player's turn
        if (this.moveCount % 2 === 0 && socket !== this.player1) return;
        if (this.moveCount % 2 === 1 && socket !== this.player2) return;


        try {
            // Attempt to make the move on the chess board
            console.log("move count: ", this.moveCount);
            this.board.move(move);
            console.log(this.board.ascii());

        } catch (err) {
            console.log(err);
            return;
        }

        if (this.moveCount % 2 === 0) {
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        } else {
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move
            }));
        }

        // Check if the game is over
        if (this.board.isGameOver()) {
            // Determine the winner based on the current turn color
            const winner = this.board.turn() === 'w' ? 'Black' : 'White';

            // Notify both players about the game over
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            }));

            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: { winner }
            }));

            return;
        }

        this.moveCount++;
  
        // Additional logic for managing time:
        // You can implement a function to calculate elapsed time
        // and send reminders or handle time-outs as needed.
        // Example:
        // const elapsedSeconds = Math.floor((new Date() - this.startTime) / 1000);
        // const timeLimitSeconds = 600; // example: 10 minutes
        // if (elapsedSeconds >= timeLimitSeconds) {
        //     // Handle time-out logic
        //     // Example: send GAME_OVER message with timeout reason
        // }
        // else {
        //     // Send reminders or manage time incrementally
        // }
    }
}
