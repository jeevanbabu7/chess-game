import { Box } from '@mui/material';
import React, { useState } from 'react'

const BlackBoard = ({handleMove, handleDrag, handleDrop, winner, board, inCheck}) => {
    const newBoard = board.slice();
    console.log(inCheck);
    
    return (
        <Box>
            {newBoard.reverse().map((row, indexi) => {
                const newRow = row.slice()
                return(
                <Box key={indexi} sx={{ display: "flex" }}>
                    {newRow.reverse().map((cell, indexj) => {
                        let checkMate = winner && cell && cell.type == 'k' && cell.color !== winner;
                        let incheck = cell && inCheck === cell.color && cell.type == 'k';
                        return (
                            <div key={`(${indexi},${indexj})`} id={`(${indexi},${indexj})`} style={{
                                display: 'flex',
                                width: '4.5rem',
                                height: '4.5rem',
                                backgroundColor: (checkMate || (incheck))? 'red': (indexi + indexj) % 2 === 0 ? '#EEEED2' : '#769656',
                                justifyContent: 'center',
                                alignItems: 'center',
                                transitionDuration: '.5s',
                            }}
                                onClick={(event) => {
                                    console.log();
                                    handleMove(event, cell, indexi, indexj, 'b')}}
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
            )})}
        </Box>
    )
}

export default BlackBoard
