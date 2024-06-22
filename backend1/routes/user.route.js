import express from 'express'
import { google } from '../controller/user.controller.js';
const authRouter = express.Router();

authRouter.post('/google', google);

export default authRouter;
