import Move from "../models/moves.model.js";
import { errorHandler } from "../utils/error-handler.js";

export const makeMove = async(req, res, next) => {
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

