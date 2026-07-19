import './utils/envconfigiration.js'
import express from 'express'
import cookieParser from 'cookie-parser'
import dbconnection from './utils/dbconnection.js'

import { createServer } from "http";
import { Server } from 'socket.io';

import authrouter from './routes/auth.routes.js'
import userrouter from './routes/user.routes.js'
import jobrouter from './routes/job.routes.js'
import applicationrouter from './routes/application.routes.js'
import connectionrouter from './routes/connection.routes.js'
import conversationrouter from './routes/conversation.routes.js'
import messagerouter from './routes/message.routes.js';
import inviterouter from './routes/invite.routes.js'
import notificationrouter from './routes/notification.routes.js'
import cors from 'cors'

import mongoose from 'mongoose';
import Message from './models/messagemodel.js';
import Connection from './models/connectionmodel.js';
import Conversation from './models/conversationmodel.js';
import Invite from './models/invitemodel.js';
import Notification from './models/notificationmodel.js';

const app = express();
const onlineUsers = new Map();

app.use(express.json());
app.use(cookieParser());
// app.use(cors({
//     origin: "http://localhost:5173",
//     credentials: true
// })
// );

const allowedOrigins = [
    "http://localhost:5173",
    "https://applyflowfrontend.vercel.app", 
    "https://applyflowfrontend-hsrsmmwpg-alisha19.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow local dev, main domain, and ANY Vercel preview URL ending in .vercel.app
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

dbconnection();
app.set('onlineUsers', onlineUsers); // Make the onlineUsers instance available in Express routes via req.app.get('onlineUsers');



// app.get("/", (req, res) => { res.send('Backend is running') });

app.use('/api/auth', authrouter);
app.use('/api/user', userrouter);
app.use('/api/job', jobrouter);
app.use('/api/application', applicationrouter);
app.use('/api/connection', connectionrouter);
app.use('/api/conversation', conversationrouter);
app.use('/api/messages', messagerouter);
app.use('/api/invite', inviterouter);
app.use('/api/notification', notificationrouter);

const httpServer = createServer(app); // wraps fully-configured Express app inside a raw Node http server



const io = new Server(httpServer, {
   cors: {
        origin: (origin, callback) => {
            // Match the exact flexible rule we gave to Express
            if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true
    }
});


app.set('io', io); // Make the Socket.IO instance available in Express routes via req.app.get('io')





io.on('connection', (socket) => {
    // console.log("index.js, ws api, connection event:a user connected: ", socket.id);
    const userId = socket.handshake.query.userId; // from frontend on connect
    
    // Safety check: Only map valid user IDs
    if (userId && userId !== 'undefined') {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is online.`);
    }

    io.emit('get-online-users', Array.from(onlineUsers.keys()));


    socket.on('join-conversation', (conversationId) => {
        socket.join(conversationId);
        // console.log(`Socket ${socket.id} joined room thread container: ${conversationId}`);
    });

    socket.on('leave-conversation', (conversationId) => {
        socket.leave(conversationId);
        // console.log(`Socket ${socket.id} left room thread container: ${conversationId}`);
    });

    socket.on('typing', ({ conversationId }) => {
        // console.log(`typing event :Socket ${socket.id} is typing in conversation: ${conversationId}`);
        // broadcast.to sends in the room EXCEPT the person who emitted it
        socket.broadcast.to(conversationId).emit('user-typing', { conversationId });
    });

    socket.on('stop-typing', ({ conversationId }) => {
        // console.log(`stop-typing event :Socket ${socket.id} stopped typing in conversation: ${conversationId}`);
        socket.broadcast.to(conversationId).emit('user-stopped-typing', { conversationId });
    });

    socket.on('mark-as-read', ({ conversationId, readerId }) => {
        // Notify the other user in the room that their messages were viewed
        socket.broadcast.to(conversationId).emit('conversation-read', { conversationId });
    });

    socket.on('send-message', ({conversationId, message, receiverId })=>{
        console.log(`listening 'send-message' event from frontend!`);
        const onlineUsers = app.get('onlineUsers');
        const receiverSocketId = onlineUsers?.get(receiverId?.toString());

        //Send message to room if they are actively in the chat window
        socket.to(conversationId).emit('receive-message', message);

        //Navbar Badge (red dot) emit, Send live notification ping if they are on another page/inactive but online
        if (receiverSocketId) {
            console.log(`sending 'new-message-notification' event from backend`);
            io.to(receiverSocketId).emit('new-message-notification', {
                conversationId,
                message
            });
            console.log(`'new-message-notification' event sent from backend`);
        }
    });

    socket.on('disconnect', () => {
        // console.log("a user disconnected", socket.id);
        onlineUsers.delete(userId.toString());
        console.log(`User ${userId} went offline.`);
        
        io.emit('get-online-users', Array.from(onlineUsers.keys()));
    });


});



// app.listen(process.env.PORT, () => {
//     console.log(`Server is listening at port ${process.env.PORT}`);
// });


// previously app was listening http requests
// now httpServer.listen(...) — do same effect fo HTTP, but ALSO
// activates the socket layer that's piggybacking on the same server


httpServer.listen(process.env.PORT, () => {
    console.log(`Server is listening at port ${process.env.PORT}`);
});

// app.listen(...) was always secretly creating an http.Server behind the scenes — Express just hid that step. now creating that http.Server explicitly, to have a hook to also hand to Socket.io.