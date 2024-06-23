import mongoose from "mongoose";

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
        type: String,  // game over or playing
       
    },
    timeControl: {
        type: Number,
        default: 600
    }
},{timestamps: true})

const GameData = new mongoose.model('GameData', GameSchema);

export default GameData;