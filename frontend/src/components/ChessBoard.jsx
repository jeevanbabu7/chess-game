import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { MOVE } from '../pages/Game';
import BlackBoard from './BlackBoard';
import WhiteBoard from './WhiteBoard';
import './ChessBoard.css';
import { useSelector } from 'react-redux';
import { EmitMoveSound,EmitSound } from '../utils/SoundEmitters.js';


const calculateCell = (i, j, turn) => {
    console.log(turn);
    if(turn === 'w') {
        
        let letter = String.fromCharCode(97 + j);
        console.log("white",letter + (8 - i));
        
        return letter + (8 - i);
    }
    else {
        let letter = String.fromCharCode(97 + 7 - j);
        return letter + (i + 1);
    }
};



const ChessBoard = ({ moveCount, setMoveCount, color, chess, setBoard, board, socket, gameId, winner,setWinner, turn, setTurn, inCheck, setInCheck}) => {
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const {currentUser} = useSelector(state => state.user);
    
    
    const updateMoves = async (move, gameId) => {
        console.log("gameId", gameId);
        console.log("move", chess.history()[chess.history().length - 1]);
       
        
        try {

            const res = await fetch('chess-game-six-kohl.vercel.app/api/game/move', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Corrected header key
                },
                body: JSON.stringify({
                    gameId,
                    playerId: currentUser._id,
                    move: chess.history()[chess.history().length - 1]
                })
            });
            
    
            const data = res.json()
            console.log(data);
    
        }catch(err) {
            console.log(err.message);
        }
    }
    const handleMove = (event, cell, indexi, indexj, turn) => {
        let square = calculateCell(indexi, indexj, turn);
        console.log(chess.ascii());
        console.log(from, winner);
        
        if (!from && !winner) {
            if (cell && color === cell.color) {
                // cannot move the pieces of other color
                setFrom((prev) => square);
            }
        } else {
            setTo((prev) => square);
            try {
                let move = {
                    from,
                    to: square,
                };
                let piece = chess.get(from); // find the piece at the starting to check if it is pawn for promotion

                if ((square[1] === '8' || square[1] === '1') && cell && piece.type === 'p') 
                    move.promotion = 'q';

                console.log("sending moves..", from, square);
                socket.send(JSON.stringify({
                    type: MOVE,
                    payload: move,
                }));
                chess.move(move);
                setMoveCount(prevCnt => prevCnt + 1);
                console.log(chess.ascii());
                updateMoves(square, gameId);
                setBoard(chess.board());
                EmitMoveSound(chess);

                setTurn(turn => {
                    return (turn == 'w') ? 'b' : 'w';
                })

                if (chess.isCheckmate()) {
                    if (moveCount % 2 === 0) setWinner('b');
                    else setWinner('w');
                    console.log("CheckMate");
                }

                if(chess.inCheck()) {
                    if(moveCount % 2 == 1) setInCheck('b');
                    else setInCheck('w');
                    EmitSound('check');
                }else setInCheck(null);

            } catch (err) {
                console.log("Invalid move");
            }
            setFrom(null);
            setTo(null);
        }
    };

    const handleDrag = (e, cell, indexi, indexj) => {
        const elem = document.getElementById(`(${indexi},${indexj})`);
        elem.style.backgroundColor = 'none';
        elem.style.cursor = 'grabbing';
        console.log(elem);
        handleMove(e, cell, indexi, indexj, color);
    };

    const handleDragStart = (e) => {
        console.log("dragging", e.target);
        e.target.style.backgroundColor = 'none';
    };

    const handleDrop = (e, cell, indexi, indexj) => {
        e.preventDefault();
        handleMove(e, cell, indexi, indexj, color);
    };
    

    if(color == 'b') 
        return <BlackBoard 
                    board={board}
                    handleMove={handleMove} 
                    winner={winner}
                    handleDrag={handleDrag}
                    handleDrop={handleDrop}
                    inCheck={inCheck}

                />

    return <WhiteBoard     

                board={board}
                handleMove={handleMove} 
                winner={winner}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
                inCheck={inCheck}

            />
};

export default ChessBoard;
