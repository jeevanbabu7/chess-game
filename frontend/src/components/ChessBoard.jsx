import { Box } from '@mui/material'
import React, { useState } from 'react'
import { MOVE } from '../pages/Game';
import './ChessBoard.css'

const calculateCell = (i , j) => {
    let letter = String.fromCharCode(97 + j);
    return letter + (8 - i);
}

const ChessBoard = ({color, chess, setBoard, board, socket}) => {

    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [dragging, setDragging] = useState(null); 

    const handleMove = (event, cell, indexi, indexj) => {
        console.log("kkkkkkk");
        let square = calculateCell(indexi, indexj); 

                                if(!from) {
                                    if(cell && color == cell.color)   // cannot move the pices of other color
                                        setFrom((prev) => square); 
                                }
                                else {

                                    setTo((prev) => square);
                                    try {
                                        console.log("sending moves..",from,square);
                                        socket.send(JSON.stringify({
                                            type: MOVE, 
                                            payload: {
                                                from,
                                                to: square
                                                
                                            }
                                        }));
                                        console.log("p1");
                                        console.log(chess.ascii());
                                        chess.move({
                                            from, 
                                            to: square
                                        });
                                        
                                        setBoard(chess.board());

                                        console.log("done");

                                    }catch(err) {
                                        console.log("Invaid move");
                                    }
                                    
                                    setFrom(null);
                                    setTo(null);
                                    
                                }
    }
    const handleDrag = (e, cell, indexi, indexj) => {
        const elem = document.getElementById(`(${indexi},${indexj})`)
        elem.style.backgroundColor = 'none';
        elem.style.cursor = 'grabbing'
        console.log(elem);
        handleMove(e, cell, indexi, indexj);
        
    }
    const handleDragStart = (e) => {
        console.log("dragging", e.target);
        e.target.style.backgroundColor = 'none';
        
    }


    
    const handleDrop = (e,cell, indexi, indexj) => {
        e.preventDefault();
        handleMove(e,cell, indexi, indexj);
    }

    
  return (
    <>
        <Box>
            {board.map((row, indexi) => {
                return (
                    <Box key={indexi} sx={{
                        display: "flex", 
                    }}>
                        {row.map((cell, indexj) => {
                            return <div key={`(${indexi},${indexj})`} id={`(${indexi},${indexj})`} style={{
                                display: 'flex',
                                width: '4.5rem',
                                height: '4.5rem',
                                backgroundColor: (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
                                display: 'flex',
                                justifyContent:'center',
                                alignItems: 'center'
                              
                            }}
                            onClick={(event) => handleMove(event, cell, indexi, indexj)}
                            >

                                {cell ? <img 
                                            className='piece' 
                                            style={{
                                                height: '3.8rem',
                                                width: '4rem'
                                            }}
                                            src={`pieces/${cell.type}_${cell.color}.png`} 
                                            draggable="true"
                                            onDragStart={(e) => handleDrag(e, cell, indexi, indexj)}  
                                            onDragOver={(e) => e.preventDefault()} 
                                            onDrop={(e) => handleDrop(e,cell, indexi, indexj)}
                                        /> : <div 
                                                    className='piece' 
                                                    onClick={(e) => console.log(e.target)} 
                                                    onDragOver={(e) => e.preventDefault()} 
                                                    onDrop={(e) => handleDrop(e,cell, indexi, indexj)}
                                                ></div>}

                                
                            </div>
                        })}
                    </Box>
                )
            })} 
        </Box>
    </>
  )
}

export default ChessBoard
