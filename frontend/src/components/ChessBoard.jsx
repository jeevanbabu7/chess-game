import React, { useState } from 'react';
import { Box } from '@mui/material';
import { MOVE } from '../pages/Game';
import BlackBoard from './BlackBoard';
import WhiteBoard from './WhiteBoard';
import './ChessBoard.css';
import { MoveDown } from '@mui/icons-material';

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

const EmitMoveSound = (chess) => {
    const move = chess.history().pop();
    const type = move[1] === 'x' ? "capture" : "move";
    if(chess.isCheckmate()) type = "mate";
    console.log(type);
    const sound = new Audio(`sounds/${type}.mp3`);
    sound.play();
};

const ChessBoard = ({ moveCount, setMoveCount, color, chess, setBoard, board, socket }) => {
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [winner, setWinner] = useState(null);

    const handleMove = (event, cell, indexi, indexj, turn) => {
        let square = calculateCell(indexi, indexj, turn);

        if (!from) {
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
                if (square[1] === '8' || square[1] === '1') {
                    move = {
                        from,
                        to: square,
                        promotion: 'q',
                    };
                }
                console.log("sending moves..", from, square);
                socket.send(JSON.stringify({
                    type: MOVE,
                    payload: move,
                }));

                setMoveCount(prevCnt => prevCnt + 1);
                console.log(chess.ascii());
                chess.move(move);
                setBoard(chess.board());
                EmitMoveSound(chess);

                if (chess.isCheckmate()) {
                    if (moveCount % 2 === 0) setWinner('b');
                    else setWinner('w');
                }
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
                    chess={chess} 
                    board={board}
                    handleMove={handleMove} 
                    winner={winner}
                    handleDrag={handleDrag}
                    handleDrop={handleDrop}
                />

    return <WhiteBoard     
                chess={chess} 
                board={board}
                handleMove={handleMove} 
                winner={winner}
                handleDrag={handleDrag}
                handleDrop={handleDrop}
            />
};

export default ChessBoard;
