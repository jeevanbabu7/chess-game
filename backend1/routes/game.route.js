import express from 'express'
import { makeMove } from '../controller/game.controller.js';

const Router = express.Router()
Router.post('/move', makeMove);

export default Router;