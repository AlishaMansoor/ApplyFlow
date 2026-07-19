import express from 'express';
const messagerouter = express.Router();

import {isAuth} from '../middlewares/authmiddleware.js'

import {getMessageHistory, sendMessage, getUnreadCount, markMessagesAsRead} from '../controllers/messagecontrollers.js' 

messagerouter.get('/unread-count', isAuth, getUnreadCount);
messagerouter.put('/mark-read/:conversationId', isAuth, markMessagesAsRead);

messagerouter.get('/:conversationId',isAuth, getMessageHistory);
messagerouter.post('/:conversationId',isAuth, sendMessage);

export default messagerouter;