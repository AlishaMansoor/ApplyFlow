import Connection from '../models/connectionmodel.js'
import Conversation from '../models/conversationmodel.js'
import { createNotification } from './notificationcontrollers.js';
import User from '../models/Authmodels.js';
import Notification from '../models/notificationmodel.js';
import Job from '../models/jobmodel.js';
import mongoose from 'mongoose';
export const createConnection = async (req, res) => {

    try {
        const senderId = req.user.userid;
        const { receiverId } = req.params;
        const { status } = req.body || 'pending';


        const sender = await User.findById(senderId).select('firstName lastName userName profileImage');
        
 
        
        //Prevent self-requests
        if (senderId.toString() === receiverId.toString()) {
            return res.status(400).json({ message: "Cannot send request to yourself" });
        }
        const connectionExist = await Connection.findOne({ $or: [
            {senderId:senderId, receiverId:receiverId},
            {senderId:receiverId, receiverId:senderId}
        ] });
        
        if (connectionExist) {
            return res.status(400).json({ message: "Connection Exists, Request already sent" });
        }
        
        const connection = await Connection.create({
            senderId, receiverId, status,
        });
        

        const notificationType = "connection-request";
        const message = `${sender.firstName} ${sender.lastName} sent you a connection request`

        const notification = await createNotification({ senderId, receiverId, type: notificationType, message });
        console.log("Notification created inside createConnection", notification);


        const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'firstName lastName userName profileImage type');

        const populatedConnection = await Connection.findById(connection._id)
            .populate('senderId', 'firstName lastName userName profileImage');


        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId && io) {
            io.to(receiverSocketId).emit('new-connection-request', {
               connection: populatedConnection,
                notification: populatedNotification
            });
            console.log("event 'new-connection-request' emitted from createConnection")
        }

        res.status(200).json({ message: "Request sent successfully: ", connection:populatedConnection });
    } catch (e) {
        res.status(500).json({ message: "Backend Error in sending request:", error: e.message });
        console.log("Error in creating connection creating connection(request): ", e.message);
    }

}

export const getRequests = async (req, res) => {
    try {
        const id = req.user.userid;
        const requests = await Connection.find({
            receiverId: id,
            status: 'pending',
        }).populate('senderId', 'firstName lastName userName profileImage headline');
        // console.log("connectioncontrollers, getRequests controller: All requests after fetching from db", requests);
        res.status(200).json({ requestData: requests });
    } catch (err) {
        res.status(500).json({ message: "Error fetching Requests", error: e.message });
    }

}

export const getRequestCount = async (req, res) => {
    try {
        const id = req.user.userid;
        console.log(id);
        const count = await Connection.countDocuments({
            receiverId: id,
            status: 'pending',
        });
        // console.log("connectioncontrollers, getRequestCount controller: request-count: ", count)
        res.status(200).json({ requestcount: count });
    } catch (e) {
        res.status(500).json({ message: "Error fetching Request-count", error: e.message });
    }

}

export const acceptRequest = async (req, res) => {
    try {
        const id = req.user.userid;//user accepting the req, Receiver
        const { connectionId } = req.params;
        const { status } = req.body;

        const connection = await Connection.findById(connectionId);
        if (!connection) return res.status(404).json({ message: "Connection not found" });
        
        connection.status = status;
        await connection.save();

        const candidate = await User.findById(id).select('firstName lastName');
        
       
        let conversation = await Conversation.findOne({
            participants: {
                $all: [
                    new mongoose.Types.ObjectId(connection.senderId), 
                    new mongoose.Types.ObjectId(connection.receiverId)
                ]
            }
        }); 
        if (!conversation) {
            conversation = await Conversation.create({
            participants: [connection.senderId, connection.receiverId],
            connectionId: connection._id,
        });
    }


        const notificationType = "connection-request-update";
        const message = `${candidate.firstName} ${candidate.lastName} accepted your connection request`;

        const notification = await createNotification({ 
            senderId: id, 
            receiverId: connection.senderId, 
            type : notificationType, 
            message 
        });
        console.log("Notification created inside acceptRequest", notification);
        
       

        const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'firstName lastName userName profileImage type');

        const populatedConversation = await Conversation.findById(conversation._id)
            .populate('participants', 'firstName lastName userName profileImage');
        
        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const senderSocketId = onlineUsers?.get(connection.senderId.toString());
        if (senderSocketId && io) {
            io.to(senderSocketId).emit('connection-accepted', {
                notification: populatedNotification,
                conversation: populatedConversation
            });
               console.log("event 'connection-accepted' emitted from acceptRequest");
       
        }
        
        res.status(200).json({ message: "Request Accepted, Conversation created", conversation:populatedConversation });
    

    } catch (e) {
        res.status(500).json({ message: "Error Accepting request", error: e.message });
        console.log("Backend Error in accepting request: ", e.message);
    }
}

export const rejectRequest = async (req, res) => {
    try {
        const id = req.user.userid; // The user rejecting the request (Receiver)
        const { connectionId } = req.params;

        const connection = await Connection.findByIdAndDelete(
            connectionId,
        );
        if (!connection) return res.status(404).json({ message: "Connection not found!" });

        const candidate = await User.findById(id).select('firstName lastName');

       
        const type = "connection-request-update";
        const message = `${candidate.firstName} ${candidate.lastName} rejected you connection request`;

        const notification = await createNotification({ 
            senderId: id, // Actor
            receiverId: connection.senderId, // Recipient
            type, 
            message 
        });
        console.log("notification created inside rejectRequest");


        const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'firstName lastName userName profileImage type');

        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const senderSocketId = onlineUsers.get(connection.senderId.toString());
        
        if (senderSocketId && io) {
            io.to(senderSocketId).emit('connection-rejected', {notification: populatedNotification});
            console.log("event 'connection-rejected' emitted from rejectRequest");
        }

        return res.status(200).json({ message: "Connection rejected" });
    
    } catch (e) {
        console.error("Backend Error in rejecting request: ", e.message);
        return res.status(500).json({ message: "Error rejecting request", error: e.message })
    }
}


export const getRequestStatus = async (req, res) => {
    try {
        const senderId = req.user.userid;
        const { receiverId } = req.params;
        const connection = await Connection.findOne({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId } // ← check BOTH directions!
            ]
        });
        if (!connection) {
            return res.status(200).json({ status: 'none' });
        }
        res.status(200).json({ status: connection.status });
    } catch (e) {
        console.log("Backend error in getting request status", e.message);
        res.status(500).json({ message: "Backend error in fetching request status: ", error: e.message });
    }
}