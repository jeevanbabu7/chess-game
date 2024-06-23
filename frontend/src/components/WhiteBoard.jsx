import { Box } from '@mui/material';
import React, { useState } from 'react'

const WhiteBoard = ({chess, handleMove, handleDrag, handleDrop, winner, board}) => {

 
    return (
        <Box>
            {board.map((row, indexi) => (
                <Box key={indexi} sx={{ display: "flex" }}>
                    {row.map((cell, indexj) => {
                        // console.log(indexi,indexj);
                        let lost = winner && cell && cell.type === 'k' && cell.color !== winner;
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
                                onClick={(event) => handleMove(event, cell, indexi, indexj, 'b')}
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
                                        onDrop={(e) => handleDrop(e, cell, indexi, indexj, 'w')}
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
    )
}

export default WhiteBoard
