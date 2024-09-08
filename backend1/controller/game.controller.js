import Move from "../models/moves.model.js";
import { errorHandler } from "../utils/error-handler.js";

export const makeMove = async (req, res, next) => {
    try {
        const {playerId, gameId, move} = req.body;
        console.log(req.body);
        const newMove = new Move({
            playerId,
            gameId,
            move
        })

        await newMove.save();
        return res.status(200).json(newMove._doc);
    }catch(err) {
        next(err)
    }
}

export const getMoves = async(req, res, next) => {
    try {
        const {gameId} = req.body;
        const response = await Move.find({gameId});
        console.log(response);
        
        const moves = response.map(move => move.move);
        console.log(response[0]);
        
        return res.status(200).json({
            moves,
            gameStartTime: response[0].createdAt || 600000  // default time 10 minutes
        }); 
    }
    catch(e) {
        console.log(e);
        
    }
}

