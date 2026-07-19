import Notification from '../models/notificationmodel.js'
import User from '../models/Authmodels.js';

import Job from '../models/jobmodel.js';
import Conversation from '../models/conversationmodel.js';
import Connection from '../models/connectionmodel.js';

//helper function to create a notification
export const createNotification = async ({ senderId, receiverId, type, message }) => {
  try {
    const notification = await Notification.create({ senderId, receiverId, type, message });
    return notification;
  } catch(e) {
    console.error("Error creating notification:", e.message);
    //Throwing the error so the function calling this helper 
    // knows that the database operation failed.
    throw new Error(e.message);
  }
}


export const getAllNotifications = async (req, res) => {
    try {
        const userid = req.user.userid;
        const notifications = await Notification.find({ receiverId: userid })
        .populate('senderId', 'firstName lastName userName profileImage')
        .sort({ createdAt: -1 });
        res.status(200).json({notifications});
    } catch (e) {
        console.log("Error in notificationcontrollers,", e.message);
        res.status(500).json({ message: "Error in getting notifications", error: e.message });
    }
}

export const getNotificationCount = async (req, res) => {
    try {
        const userid = req.user.userid;
        const count = await Notification.countDocuments({ receiverId: userid , isRead: false});
        
        res.status(200).json({count});
    } catch (e) {
        console.log("Error in notification-count in notificationcontrollers,", e.message);
        res.status(500).json({ message: "Error in getting notification count", error: e.message });
    }
}

export const markAsRead = async (req,res) =>{
    try{
        const {notificationId} = req.params;
        await Notification.findByIdAndUpdate(notificationId, {isRead:true}, {new:true});
        res.status(200).json({message:"notification marked as read!"});
    }catch(e){
         console.log("Error in marking notofication read in notificationcontrollers,", e.message);
        res.status(500).json({ message: "Error in mark as read", error: e.message });
    }
}