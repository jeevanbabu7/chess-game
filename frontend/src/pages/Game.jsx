import React, { useEffect, useState } from 'react'
import './Game.css'
import { Box, Button, ButtonBase, Grid, styled } from '@mui/material'
import ChessBoard from '../components/ChessBoard'
import useSocket from '../hooks/useSocket'
import  {Chess} from 'chess.js'
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";

const Game = () => {

    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
       
        if(!socket) return;
        socket.onmessage = (e) =>{
            const message = JSON.parse(e.data);
            console.log("received");
            switch(message.type) {
                case INIT_GAME:
                    console.log("Game started.");
                    setColor(message.payload.color);
                    setStarted(true);
                    return
                case MOVE:
                    console.log("move made");
                    const move = message.payload;
                    console.log(move);
                    chess.move(move)
                    setBoard(chess.board())
                    console.log(chess.ascii());
                    return
                case GAME_OVER:
                    console.log("Game over");
                    setStarted(false);
                    return

                
            }
        }

    },[socket]);

    if(!socket) return <div><h1>Connecting....</h1></div>
    
    return (
        <>

            <Grid container>
                <Grid item xs={12} md={8} className='left-container'>
                    <ChessBoard color={color} setBoard={setBoard} chess={chess} board={board} socket={socket}/>
                </Grid>

                <Grid item xs={12} md={4}className='right-container'>
                    
                    <Box width={100} sx={{
                        width: '20rem',
                        marginTop: '5rem'
                        
                    }}>
                        {!started && <Button variant='contained' color='success' fullWidth onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME
                            }))
                        }}>Play</Button>}
                    </Box>
                
                </Grid>

            </Grid>
        </>
    )
}

export default Game