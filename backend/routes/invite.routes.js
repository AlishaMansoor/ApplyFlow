import express from 'express';
const inviterouter = express.Router();

import {isAuth} from '../middlewares/authmiddleware.js';
import {createInvite, acceptInvite, rejectInvite, getAllInvites} from '../controllers/invitecontrollers.js';


inviterouter.put("/accept/:inviteId", isAuth, acceptInvite);
inviterouter.put("/reject/:inviteId", isAuth, rejectInvite);
inviterouter.post('/:receiverId', isAuth, createInvite);
inviterouter.get('/getallinvites', isAuth, getAllInvites);

export default inviterouter;