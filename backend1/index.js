import {WebSocketServer} from 'ws';
import  GameManager  from './src/GameManager.js';
import mongoose from 'mongoose'
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/user.route.js'
import gameRouter from './routes/game.route.js'
import { errorHandler } from './utils/error-handler.js';

dotenv.config(); 

const port = 5000;
const app = express()

app.use(cors()) 
app.use(cookieParser())
app.use(express.json())
app.use(errorHandler)


mongoose.connect(process.env.DB_STR, {
    useNewUrlParser: false,
    useUnifiedTopology: false,
})
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

app.listen(port, () => {
    console.log("Server listening on port 5000");
});

// Routes-----------------------------------------------------------------------------

app.use('/api/auth',authRouter)
app.use('/api/game', gameRouter)

// --------------------------------------------------------------------------------------

const wss = new WebSocketServer({ port: 8000 });
const gameManager = new GameManager();


wss.on('connection', function connection(ws){

    gameManager.addUser(ws)
    // ws.on('message',(data) => console.log(data))
    ws.on('disconnect',() => gameManager.removeUser(ws))

});