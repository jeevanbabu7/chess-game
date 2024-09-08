
import { Box } from '@mui/material';
import React, { useState } from 'react'

const WhiteBoard = ({chess, handleMove, handleDrag, handleDrop, winner, board, inCheck}) => {

    return (
        <Box>
            {board.map((row, indexi) => (
                <Box key={indexi} sx={{ display: "flex" }}>
                    {row.map((cell, indexj) => {
                        let checkMate = winner && cell && cell.type == 'k' && cell.color !== winner;
                        let check =inCheck &&  cell && inCheck === cell.color && cell.type == 'k';
                        return (
                            <div key={`(${indexi},${indexj})`} id={`(${indexi},${indexj})`} style={{
                                display: 'flex',
                                width: '4.5rem',
                                height: '4.5rem',
                                backgroundColor: (checkMate || check) ? 'red': (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transitionDuration: '.5s',
                            }}
                            onClick={(event) => handleMove(event, cell, indexi, indexj, 'w')}
                            >
                                {cell ? (
                                    <div className='piece-wrapper' style={{width: '100%', height: '100%', backgroundColor: "transparent"}}
                                        draggable="true"
                                        onDragStart={(e) => handleDrag(e, cell, indexi, indexj)}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, cell, indexi, indexj, 'w')}
                                    >
                                        <img
                                            className='piece'
                                            style={{
                                                height: '3.8rem',
                                                width: '4rem',
                                            }}
                                            src={`pieces/${cell.type}_${cell.color}.png`}
                                            
                                        />
                                    </div>
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
