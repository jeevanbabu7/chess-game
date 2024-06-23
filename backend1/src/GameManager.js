import Game from "./Game.js";
import { INIT_GAME, MOVE } from "./Messages.js";

class GameManager {
    constructor() {
        this.games = [];
        this.users = [];
        this.pendingUser = null;
        this.pendingUserId = null;
    }

    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }

    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }

    addHandler(socket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString());
            // console.log("messge", message);
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(socket, this.pendingUser,message.id, this.pendingUserId);
                    this.games.push(game);
                    this.pendingUser = null;
                    this.pendingUserId = null;
                } else {
                    this.pendingUser = socket;
                    this.pendingUserId = message.id;
                }
            }

            if (message.type === MOVE) {
                const game = this.games.find(game =>
                    (game.player1 === socket || game.player2 === socket)    
                );
                if (game) {
                    console.log(message);
                    game.makeMove(socket, message.payload);
                    
                }
            }
        });
    }
}

export default GameManager;
