import express from 'express'
import { sendPrompt } from '../controller/prompt.controller.js';
import verifyToken from '../middleware/prompt.middleware.js';


const router = express.Router();

router.post('/prompt', verifyToken, sendPrompt)


export default router;