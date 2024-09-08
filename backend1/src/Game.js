import { Chess } from 'chess.js';
import GameData from '../models/game.models.js';
import { GAME_OVER, INIT_GAME, MOVE, RECONNECT } from './Messages.js';

const createGameInDB = async (player1Id, player2Id) => {
    try {

        const newGame = new GameData({
            player1: player1Id, 
            player2: player2Id
        });

        await newGame.save();

        return newGame._id;
    } catch (err) {
        console.log(err);
        throw err; // Optionally rethrow the error to handle it elsewhere
    }
}

export default class Game {
    constructor(player1, player2, player1Id, player2Id) {
        this.player1 = player1;
        this.player2 = player2;
        this.player1Id = player1Id;
        this.player2Id = player2Id;
        this.board = new Chess();
        this.startTime = new Date();
        this.moveCount = 0;

        // Call an async function within the constructor
        (async () => {
            try {
                this.gameId = await createGameInDB(player1Id, player2Id);
            

                // Send initial game setup messages to players
                this.player1.send(JSON.stringify({
                    type: INIT_GAME,
                    payload: {
                        color: 'w',
                        gameId: this.gameId
                    }
                }));

                this.player2.send(JSON.stringify({
                    type: INIT_GAME,
                    payload: {
                        color: 'b',
                        gameId: this.gameId
                    }
                }));
            } catch (err) {
                console.error('Error creating game in DB:', err);
                // Handle error appropriately, perhaps by notifying players or logging
            }
        })();

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
            const winner = this.board.turn() === 'w' ? 'black' : 'white';
            console.log("Game over");

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

    reconnect(socket, playerId) {
        if (playerId === this.player1Id) {
            this.player1 = socket;
        } else if (playerId === this.player2Id) {
            this.player2 = socket;
        }

        // Notify the reconnected player about the current game state
        console.log("Reconnecting player", playerId);
        
        socket.send(JSON.stringify({
            type: RECONNECT,
            payload: {
                color: this.player1 === socket ? 'w' : 'b',
                gameId: this.gameId
            }
        }));

    }
}
