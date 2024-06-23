import mongoose from "mongoose";

const MoveSchema = new mongoose.Schema({
    gameId: {
        type: String,
        required: true
    },
    playerId: {
        type: String,
        required: true
    },
    move: {
        type:String,
        required: true
    }

},{timestamps: true})

const Move = mongoose.model('Move', MoveSchema);

export default  Move;