import React, { useEffect, useState } from 'react'
import './Game.css'
import { Box, Button, ButtonBase, Grid, Typography, styled } from '@mui/material'
import ChessBoard from '../components/ChessBoard'
import useSocket from '../hooks/useSocket'
import {useSelector} from 'react-redux'
import  {Chess} from 'chess.js'
import MoveHistory from '../components/MoveHistory'
import { EmitMoveSound } from '../utils/SoundEmitters.js'
import { EmitSound } from '../utils/SoundEmitters.js'
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";




const Game = () => {
   
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState(null);
    const [started, setStarted] = useState(false);
    const [moveCount, setMoveCount] = useState(0);
    const [gameId, setGameId] = useState(null);
    const {currentUser} = useSelector(state => state.user);

    useEffect(() => {
        
        if(!socket) return;
        socket.onmessage = (e) =>{
            const message = JSON.parse(e.data);
            console.log("received");
            switch(message.type) {
                case INIT_GAME:
                    console.log("Game started.",message.payload.color);
                    setColor(message.payload.color);
                    setStarted(true);
                    setGameId(message.payload.gameId);
                    EmitSound('game-start')
                    return
                case MOVE:
                    console.log("move made");
                    const move = message.payload;
                    console.log(move);
                    chess.move(move);
                    EmitMoveSound(chess);
                    setBoard(chess.board());
                    setMoveCount(prevCnt => prevCnt + 1);
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
                <Grid item xs={12} md={8} className='h-screen'
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#302E2B'
                    }}
                >   
                    {started && <Box display='flex' flexDirection='column' justifyContent='space-between' 
                        sx={{height: '75vh', marginRight: "1rem"}}    
                    >
                    
                        <Box display='flex' flexDirection="column" justifyContent='center' gap='.5rem'>
                            <img src='profile.png' style={{width: "80px"}} alt="Image"/>
                            <Typography color='white' sx={{fontWeight: 500}}>Opponent</Typography>
                        </Box>
                        <Box display='flex' flexDirection="column" justifyContent='center' gap='.5rem'>
                            <img src='profile.png' style={{width: "80px"}} alt="Image"/>
                            <Typography color='white' sx={{fontWeight: 500}}>{currentUser.username}</Typography>
                        </Box>
                        
                    </Box>}


                    <ChessBoard 
                        moveCount={moveCount} 
                        setMoveCount={setMoveCount}
                        color={color} 
                        setBoard={setBoard} 
                        chess={chess} 
                        board={board} 
                        socket={socket}
                        gameId={gameId}
                    />
                </Grid>

                <Grid item xs={12} md={4}className='flex justify-center h-screen'
                    sx={{
                        backgroundColor: '#1A1A18'
                    }}
                >
                    
                    <Box width={200} sx={{
                        width: '20rem',
                        marginTop: '5rem',
                        
                        
                    }} display="flex" flexDirection="column" gap="1rem">
                        {!started && 
                        <Button variant='contained' color='success' sx={{height: "3rem"}} fullWidth onClick={() => {
                            socket.send(JSON.stringify({
                                type: INIT_GAME,
                                id: currentUser._id
                            }))
                        }}>
                            <Typography sx={{
                                fontWeight: 600
                            }}>
                                Rapid (10 + 0)
                            </Typography>
                        </Button>}

                        {!started && 
                        <Button variant='contained' sx={{height: "3rem"}} color='success' fullWidth >
                            <Typography sx={{
                                fontWeight: 600
                            }}>
                                Blitz (5 + 0)
                            </Typography>
                        </Button>}

                        {started && <MoveHistory chess={chess}/>}
                        
                    </Box>
                
                </Grid>

            </Grid>
        </>
    )
}

export default Game
