import React, { useState } from 'react';
import { Box } from '@mui/material';
import { MOVE } from '../pages/Game';
import './ChessBoard.css';
import { MoveDown } from '@mui/icons-material';

const calculateCell = (i, j) => {
    let letter = String.fromCharCode(97 + j);
    return letter + (8 - i);
};

const EmitMoveSound = (move) => {
    const type = move.length > 2 ? "capture" : "move";
    const sound = new Audio(`sounds/${type}.mp3`);
    sound.play();
};

const ChessBoard = ({ moveCount, setMoveCount, color, chess, setBoard, board, socket }) => {
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [winner, setWinner] = useState(null);

    const handleMove = (event, cell, indexi, indexj) => {
        let square = calculateCell(indexi, indexj);

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
                if (square[1] === '8') {
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
                EmitMoveSound(chess.history().pop());

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
        handleMove(e, cell, indexi, indexj);
    };

    const handleDragStart = (e) => {
        console.log("dragging", e.target);
        e.target.style.backgroundColor = 'none';
    };

    const handleDrop = (e, cell, indexi, indexj) => {
        e.preventDefault();
        handleMove(e, cell, indexi, indexj);
    };

    return (
        <>
            <Box>
                {board.map((row, indexi) => (
                    <Box key={indexi} sx={{ display: "flex" }}>
                        {row.map((cell, indexj) => {
                            let lost = winner && cell && cell.type === 'k' && cell.color === winner;
                            return (
                                <div key={`(${indexi},${indexj})`} id={`(${indexi},${indexj})`} style={{
                                    display: 'flex',
                                    width: '4.5rem',
                                    height: '4.5rem',
                                    backgroundColor: lost ? '#c74936' : (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    transitionDuration: '.5s',
                                }}
                                    onClick={(event) => handleMove(event, cell, indexi, indexj)}
                                >
                                    {cell ? (
                                        <img
                                            className='piece'
                                            style={{
                                                height: '3.8rem',
                                                width: '4rem',
                                            }}
                                            src={`pieces/${cell.type}_${cell.color}.png`}
                                            draggable="true"
                                            onDragStart={(e) => handleDrag(e, cell, indexi, indexj)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, cell, indexi, indexj)}
                                        />
                                    ) : (
                                        <div
                                            className='piece'
                                            onClick={(e) => console.log(e.target)}
                                            onDragOver={(e) => e.preventDefault()}
                                            onDrop={(e) => handleDrop(e, cell, indexi, indexj)}
                                        ></div>
                                    )}
                                </div>
                            );
                        })}
                    </Box>
                ))}
            </Box>
        </>
    );
};

export default ChessBoard;
