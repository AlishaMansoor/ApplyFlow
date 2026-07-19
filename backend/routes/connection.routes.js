import express from 'express';
const connectionrouter = express.Router();
import { isAuth } from '../middlewares/authmiddleware.js'
import { createConnection, getRequests, getRequestCount,acceptRequest, rejectRequest, getRequestStatus } from '../controllers/connectioncontrollers.js'


connectionrouter.get('/request-count', isAuth, getRequestCount);
connectionrouter.get('/all', isAuth, getRequests)
connectionrouter.put('/accept/:connectionId', isAuth, acceptRequest);
connectionrouter.put('/reject/:connectionId', isAuth, rejectRequest);
connectionrouter.post('/:receiverId', isAuth, createConnection);
connectionrouter.get('/requeststatus/:receiverId', isAuth, getRequestStatus);

export default connectionrouter;