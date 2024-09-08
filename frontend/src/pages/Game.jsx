import React, { useEffect, useState } from 'react';
import './Game.css';
import { Box, Button, Grid, Typography } from '@mui/material';
import ChessBoard from '../components/ChessBoard';
import Timer from '../components/Timer';
import useSocket from '../hooks/useSocket';
import { useSelector } from 'react-redux';
import { Chess } from 'chess.js';
import MoveHistory from '../components/MoveHistory';
import { EmitMoveSound, EmitSound } from '../utils/SoundEmitters';
export const INIT_GAME = "init_game";
export const MOVE = "move";
export const GAME_OVER = "game_over";
const RECONNECT = "reconnect";

const Game = () => {
    const socket = useSocket();
    const [chess, setChess] = useState(new Chess());
    const [board, setBoard] = useState(chess.board());
    const [color, setColor] = useState(null);
    const [started, setStarted] = useState(false);
    const [winner, setWinner] = useState(null);
    const [moveCount, setMoveCount] = useState(0);
    const [gameId, setGameId] = useState(null);
    const { currentUser } = useSelector(state => state.user);
    const [opponent, setOpponent] = useState(null);
    const [yourTime, setYourTime] = useState(0);
    const [opponentTime, setOpponentTime] = useState(0);
    const [turn, setTurn] = useState('w'); // 'w' for white, 'b' for black
    const [inCheck, setInCheck] = useState(null);

    let yourIntervalID, opponentIntervalId;
   
    const handleResign = (event) => {
        setWinner(prev => (color == 'w') ? 'b': 'w');
        socket.send(JSON.stringify({
            type: GAME_OVER, 
            status: `${color} resigned`
        }));
        clearInterval(yourIntervalID);
        clearInterval(opponentIntervalId);
    }

    const clearBoard = () => {
        chess.reset();
        setBoard(chess.board());
        setStarted(true);
        setWinner(false);
    };

    


    function regenerateBoard() {
            
        console.log("uuuuuuuuuuu", gameId);
        
        fetch('http://localhost:5000/api/game/getMoves', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameId
            })
        })
        .then(res => res.json())
        .then(data => {
            const moves = data.moves;
            const timeElasped = new Date() - new Date(data.gameStartTime);
            setChess(new Chess());
            setYourTime(600 - Math.floor(timeElasped / 1000));
            setOpponentTime(600 - Math.floor(timeElasped / 1000));
            console.log(timeElasped);
            
            // if(Math.floor(timeElasped / 1000) > 600) {
            //     setWinner(() => (color == 'w') ? 'b': 'w');
            //     console.log("mmmm");
            //     return;
            // }

            setTurn(() => {
                return moves.length % 2 ? 'b': 'w';
            });
            setMoveCount(moves.length);
            console.log(moves);
            moves.forEach(move => {
                console.log(move);
                chess.move(move);
                console.log(chess.ascii());
                
            });
            setBoard(chess.board());
        })
        
    }

    useEffect(() => {
        if (!socket) return;
        const playerId = currentUser._id;
        socket.onmessage = (e) => {
            const message = JSON.parse(e.data);
            console.log(message);
            
            switch (message.type) {
                case RECONNECT:
                    setGameId(message.payload.gameId);
                    setStarted(true);
                    setWinner(false);
                    console.log("color ", message.payload.color);
                    if(gameId) {
                        regenerateBoard();
                    }
                    setColor(message.payload.color);
                    return;
                case INIT_GAME:
                    clearBoard();
                    setColor(message.payload.color);
                    setGameId(message.payload.gameId);
                    EmitSound('game-start');
                    return;
                case MOVE:
                    const move = message.payload;
                    chess.move(move);
                    EmitMoveSound(chess);
                    setBoard(chess.board());
                    setMoveCount(prevCnt => prevCnt + 1);
                    setTurn(chess.turn());
                    if(chess.inCheck()) {
                        setInCheck(() => (moveCount % 2) ? 'b': 'w')
                        EmitSound("check");
                    }else setInCheck(null);
                    return;
                case GAME_OVER:
                    setStarted(false);
                    setWinner( prev => message.payload.winner[0] == 'w' ? 'b': 'w' );
                    clearInterval(yourIntervalID);
                    clearInterval(opponentIntervalId);
                    return;
                default:
                    return;
            }
        };

        socket.send(JSON.stringify({
            type: RECONNECT,
            id: currentUser._id,
            payload: {
                playerId
            }
        }));

        
        return () => {
            socket.onmessage = null; 
        };
    }, [socket, gameId]);

    useEffect(() => {
        const handleTurnChange = () => {
            if (color && turn === color && started) {
                clearInterval(opponentIntervalId);
                yourIntervalID = setInterval(() => {
                    setYourTime(prevTime => {
                        if (prevTime > 0 && !winner ) {
                            return prevTime - 1;
                        } else {
                            // If your time is zero, stop both timers
                            setWinner(prev => (color == 'w') ? 'b': 'w');
                            clearInterval(yourIntervalID);
                            clearInterval(opponentIntervalId);
                            return prevTime;
                        }
                    });
                }, 1000);
            } else if (color && started) {
                clearInterval(yourIntervalID);
                opponentIntervalId = setInterval(() => {
                    setOpponentTime(prevTime => {
                        if (prevTime > 0 && !winner) {
                            return prevTime - 1;
                        } else {
                            // If opponent's time is zero, stop both timers
                            clearInterval(yourIntervalID);
                            clearInterval(opponentIntervalId);
                            setWinner(color);
                            return prevTime;
                        }
                    });
                }, 1000);
            }
        };
    
        handleTurnChange();
    
        return () => {
            clearInterval(yourIntervalID);
            clearInterval(opponentIntervalId);
        };
    }, [color, turn, started]);
    
    useEffect(() => {

    }, [gameId]);

    if (!socket) return <div><h1>Connecting....</h1></div>;

    
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
                        sx={{height: '90vh', marginRight: "1rem"}}    
                    >
                    
                        <Box display='flex' flexDirection="column" justifyContent='center' gap='.5rem'>
                            <Timer time={opponentTime} /> 
                            <img src='profile.png' style={{width: "80px"}} alt="Image"/>
                            <Typography color='white' sx={{fontWeight: 500}}>Opponent</Typography>
                        </Box>
                        <Box display='flex' flexDirection="column" justifyContent='center' gap='.5rem'>
                            <img src='profile.png' style={{width: "80px"}} alt="Image"/>
                            <Typography color='white' sx={{fontWeight: 500}}>{currentUser.username}</Typography>
                            <Timer time={yourTime}/> 
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
                        winner={winner}
                        yourTime={yourTime}
                        opponentTime={opponentTime}
                        turn={turn}
                        setTurn={setTurn}
                        inCheck={inCheck}
                        setInCheck={setInCheck}
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
                            setYourTime(600);
                            setOpponentTime(600);
                            socket.send(JSON.stringify({
                                type: INIT_GAME,
                                id: currentUser._id
                            }))
                            
                            // setChess(new Chess())
                        }}>
                            <Typography sx={{
                                fontWeight: 600
                            }}>
                                Rapid (10 + 0)
                            </Typography>
                        </Button>}

                        {!started && 
                        <Button variant='contained' sx={{height: "3rem"}} color='success' fullWidth onClick={() => {
                            setYourTime(300);
                            setOpponentTime(300);
                            socket.send(JSON.stringify({
                                type: INIT_GAME,
                                id: currentUser._id
                            }))
                            
                        }}>
                            <Typography sx={{
                                fontWeight: 600
                            }}>
                                Blitz (5 + 0)
                            </Typography>
                        </Button>}

                        {chess.history().length  && <MoveHistory chess={chess}/>}
                        <Box
                            
                        >
                            <Button 
                                sx={{backgroundColor: '#769656',
                                '&:hover': {
                                    backgroundColor: "#1B5E20"
                                },
                                width: "100%"
                                }} 
                                variant='contained'
                                onClick={handleResign}
                            >
                                <Typography variant='h6'>
                                    Resign
                                </Typography>
                            </Button>
                        </Box>
                        
                    </Box>
                
                </Grid>

            </Grid>
        </>
    )
}

export default Game
