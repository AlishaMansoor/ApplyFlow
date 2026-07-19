import Invite from '../models/invitemodel.js';
import Connection from '../models/connectionmodel.js';
import Conversation from '../models/conversationmodel.js';
import { createNotification } from './notificationcontrollers.js';
import Job from '../models/jobmodel.js';
import mongoose from 'mongoose';
import User from '../models/Authmodels.js';
import Notification from '../models/notificationmodel.js';


export const createInvite = async (req, res) => {

    try {
        const userid = req.user.userid;
        const { receiverId } = req.params;
        const { jobId } = req.body;

        const existingInvite = await Invite.findOne({ senderId: userid, receiverId, jobId });
        if (existingInvite) {
            return res.status(400).json({ message: "Invite already sent for this job" });
        }

        const recruiter = await User.findById(userid).select('firstName lastName organization');
        const job = await Job.findById(jobId);

        const notificationType = "invite";
        const message = `${recruiter.firstName} ${recruiter.lastName} invited you to apply for ${job.title} at ${recruiter.organization?.organizationName}`


        const invite = await Invite.create({
            senderId: userid,
            receiverId: receiverId,
            jobId: jobId,

        });


        const notification = await createNotification({// connection id of riya and alisha connection 6a491f3b3cca918e1429deab
            senderId: userid,
            receiverId,
            type: notificationType,
            message: message
        });
        console.log("Notification created of invite from invite controller: ");



        const populatedNotification = await Notification.findById(notification._id)
            .populate('senderId', 'firstName lastName userName profileImage type');

        const populatedInvite = await Invite.findById(invite._id)
            .populate('senderId', 'firstName lastName userName profileImage')
            .populate('jobId', 'title companyName');


        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const receiverSocketId = onlineUsers?.get(receiverId.toString());
        if (receiverSocketId && io) {
            io.to(receiverSocketId).emit('new-invite', {
                invite: populatedInvite,
                notification: populatedNotification,
            });
        }

        res.status(200).json({ message: "Invite created/sent successfully", invite: populatedInvite });

    } catch (e) {
        console.log("Error in invitecontrollers, createInvite: ", e.message);
        res.status(500).json({ message: "Error in sending/creating invite: ", error: e.message });
    }
}


export const acceptInvite = async (req, res) => {
    try {
        const { inviteId } = req.params;
        const candidateId = req.user.userid; // candidate accepting the request

        const candidate = await User.findById(candidateId).select('firstName lastName');

        const invite = await Invite.findById(inviteId).populate('receiverId', 'firstName lastName profileImage');
        if (!invite) return res.status(404).json({ message: "Invite not found" });

        const job = await Job.findById(invite.jobId);
        await Invite.findByIdAndUpdate(inviteId, { status: "accepted" });

        const receiverId = invite.senderId; // Recruiter ID
        const senderId = invite.receiverId; // candidate id
        const type = "invite-update";
        const message = `${candidate.firstName} ${candidate.lastName} accepted your invite.`

        const notification = await createNotification({ senderId, receiverId, type, message });
        const populatedNotification = await Notification.findById(notification._id).populate('senderId', 'firstName lastName profileImage');

        // checking if connection already exists in EITHER direction
        const existingConnection = await Connection.findOne({
            $or: [
                {
                    senderId: new mongoose.Types.ObjectId(invite.senderId),
                    receiverId: new mongoose.Types.ObjectId(invite.receiverId)
                },
                {
                    senderId: new mongoose.Types.ObjectId(invite.receiverId),
                    receiverId: new mongoose.Types.ObjectId(invite.senderId)
                }
            ]
        });

        let connectionId = existingConnection?._id;
        if (!existingConnection) {
            const connection = await Connection.create({
                senderId: invite.senderId, // recuiter
                receiverId: invite.receiverId, //candidate
                status: "accepted"
            });
            connectionId = connection._id;
        }

        // checking if conversation already exists

        let existingConversation = await Conversation.findOne({
            participants: {
                $all: [new mongoose.Types.ObjectId(invite.senderId), new mongoose.Types.ObjectId(invite.receiverId)]
            }
        });
        

        if (!existingConversation) {
            //creating Conversation  only if not exists
            existingConversation = await Conversation.create({
                participants: [invite.senderId, invite.receiverId],
                connectionId: connectionId
            });
        }
        const populatedConversation = await Conversation.findById(existingConversation._id)
            .populate('participants', 'firstName lastName userName profileImage');

        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');

        const recruiterSocketId = onlineUsers.get(invite.senderId.toString());
        if (recruiterSocketId && io) {
            io.to(recruiterSocketId).emit('invite-accepted', { notification: populatedNotification, conversation: populatedConversation });
        }

        res.status(200).json({ message: "Invite accepted successfully", conversation: populatedConversation });
    } catch (e) {
        console.log("Error in invitecontrollers in acceptInvite.", e.message);
        res.status(500).json({ message: "Error in accepting th invite request: ", error: e.message })
    }

}


export const rejectInvite = async (req, res) => {
    try {
        const { inviteId } = req.params;
        const invite = await Invite.findById(inviteId);
        if (!invite) return res.status(404).json({ message: "Invite not found" });

        const candidate = await User.findById(req.user.userid).select('firstName lastName');
        const job = await Job.findById(invite.jobId);

        const receiverId = invite.senderId;
        const senderId = invite.receiverId;
        const type = "invite-update";
        const message = `${candidate.firstName} ${candidate.lastName} rejected your invite.`

        const notification = await createNotification({ senderId, receiverId, type, message });

        // const populatedInvite = await Invite.findById(invite._id).populate('receiverId', 'firstName lastName profileImage');
        const populatedNotification = await Notification.findById(notification._id).populate('senderId', 'firstName lastName profileImage')


        const io = req.app.get('io');
        const onlineUsers = req.app.get('onlineUsers');
        const recruiterSocketId = onlineUsers.get(invite.senderId.toString());
        if (recruiterSocketId && io) {
            io.to(recruiterSocketId).emit('invite-rejected', {
                notification: populatedNotification
            });
        }
        await Invite.findByIdAndDelete(inviteId);
        res.status(200).json({ message: "Invite declined" });
    } catch (e) {
        res.status(500).json({ message: "Error declining invite", error: e.message });
    }
}


export const getAllInvites = async (req, res) => {
    try {
        const userid = req.user.userid;
        const invites = await Invite.find({ receiverId: userid, status: 'pending' }).populate('senderId', 'firstName lastName userName profileImage').populate('jobId', 'title organization');
        res.status(200).json({ invites });
    } catch (e) {
        console.log("Error in getAllInvites", e.message);
        res.status(500).json({ message: "Error in getting all invites", error: e.message });
    }
}