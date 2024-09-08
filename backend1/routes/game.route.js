import express from 'express'
import { getMoves, makeMove } from '../controller/game.controller.js';

const Router = express.Router()
Router.post('/move', makeMove);
Router.post('/getMoves', getMoves);

export default Router;