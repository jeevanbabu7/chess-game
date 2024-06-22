import mongoose from "mongoose";
import Game from "../src/Game";

const GameSchema = new mongoose.Schema({
    player1: {
        type: String,
        required: true
    },
    player2: {
        type: String,
        required: true
    },
    status: {
        type: String, 
    }
},{timestamps: true})

const Game = new mongoose.model('Game', GameSchema);

export default Game;