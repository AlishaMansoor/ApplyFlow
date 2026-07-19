import express from 'express';
const conversationrouter=express.Router();
import { isAuth } from '../middlewares/authmiddleware.js';
import {getAllConversations } from '../controllers/conversationcontrollers.js'

conversationrouter.get('/all', isAuth, getAllConversations);
// conversationrouter.get('/:conversationId/messages', isAuth, getMessages);
// conversationrouter.post('/:conversationId/message', isAuth, sendMessage);

export default conversationrouter;