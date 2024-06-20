import { Box } from '@mui/material'
import React, { useState } from 'react'
import { MOVE } from '../pages/Game';

const calculateCell = (i , j) => {
    let letter = String.fromCharCode(97 + j);
    // console.log(i, j);
    // console.log("from",letter + (8 - i));
    return letter + (8 - i);
}

const ChessBoard = ({color, chess, setBoard, board, socket}) => {

    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    
  return (
    <>
        <Box>
            {board.map((row, indexi) => {
                return (
                    <Box key={indexi} sx={{
                        display: "flex", 
                    }}>
                        {row.map((cell, indexj) => {
                            return <div key={indexj} style={{
                                display: 'flex',
                                width: '4.5rem',
                                height: '4.5rem',
                                backgroundColor: (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
                              
                            }}
                            onClick={(event) => {
                                let square = calculateCell(indexi, indexj); 

                                if(!from) {
                                    if(cell.color != undefined && color == cell.color)   // cannot move the pices of other color
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
                            
                                
                               
                                
                                
                            }}
                            >
                                {/* {cell ? cell.type: ""} */}
                                {cell && <img  src={`pieces/${cell.type}_${cell.color}.png`}/>}
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
