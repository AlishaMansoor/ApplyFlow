import express from 'express';
const notificationrouter = express.Router();

import {isAuth} from '../middlewares/authmiddleware.js';
import { getAllNotifications, getNotificationCount, markAsRead } from '../controllers/notificationcontrollers.js';

notificationrouter.get('/allnotifications', isAuth, getAllNotifications);
notificationrouter.get('/notification-count', isAuth, getNotificationCount);
notificationrouter.put('/markread/:notificationId', isAuth, markAsRead);

export default notificationrouter;