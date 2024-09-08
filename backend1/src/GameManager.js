import Game from "./Game.js";
import { GAME_OVER, INIT_GAME, MOVE, RECONNECT } from "./Messages.js";

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
 
            if(message.type === GAME_OVER) {
                const game = this.games.find(game =>
                    (game.player1 === socket || game.player2 === socket)    
                );

                game.player1.send(JSON.stringify({
                    type: GAME_OVER,
                    status: message.status
                }))
                game.player2.send(JSON.stringify({
                    type: GAME_OVER,
                    status: message.status
                }))

                this.games = this.games.filter(item => item != game);
            }

            if(message.type === RECONNECT) {
                console.log("hiiiiiiii");
                const playerId = message.payload.playerId;
                console.log("ID", playerId);
                
                const game = this.games.find(game =>
                    (game.player1Id === playerId || game.player2Id === playerId)    
                );
                if(game) {
                    console.log("game found");
                    game.reconnect(socket, message.payload.playerId);
                }else {
                    console.log("no game found");
                    
                }
            }
        });
    }
}

export default GameManager;
