import Message from '../models/messagemodel.js';
import Conversation from '../models/conversationmodel.js';

export const getMessageHistory = async (req, res) => {
    try {
        const { conversationId } = req.params;

        const messages = await Message.find({ conversationId }).sort({ createdAt: 1 });

        if (!messages || messages.length === 0) {
            return res.status(200).json({ message: "No messeges history found.", messages: [] });
        }
        // console.log("All fetched messages: ", messages);
        res.status(200).json({ message: "Messeges history fetched successfully: ", messages });
    } catch (e) {
        console.log("Error in Backend getMessageHistory Controller: ", e.message);
        res.status(500).json({ message: "Backend error fetching ", error: e.message });
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const { text } = req.body;
        const senderId = req.user.userid; // can be of sender or receiver [both participants]

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Message content string cannot be empty" });
        }
        const message = await Message.create({
            text: text.trim(), conversationId, senderId
        });

        //updating last message too, for the conversation room
        const conversation = await Conversation.findOneAndUpdate(
            { _id: conversationId },
            { lastMessage: text.trim() },
            { new: true }
        );

        const io = req.app.get('io'); // Get the Socket.IO instance from the app
        if (io) {
            // console.log(`sendMessage controller: Emitting new-message-received event to conversationId: ${conversationId}`);
            io.to(conversationId).emit('new-message-received', message);
        }

        // console.log("message sent: ", message.text);
        res.status(201).json({ message: "Message sent successfully: ", message: message });
    } catch (e) {
        console.log("Error in Backend sendMessage Controller: ", e.message);
        res.status(500).json({ message: "backend error in sendMessage controller", error: e.message });
    }
}






export const getUnreadCount = async (req, res) => {
    try{
        const userId = req.user.userid;


        //finding all the conversation, the user belong to
        const conversations = await Conversation.find({ participants: userId});
        const conversationIds = conversations.map(conv => conv._id);

        //finding unread messages count for the user, in all the conversations he belongs to
        const unreadCount = await Message.countDocuments({
            conversationId: { $in: conversationIds },
            senderId: { $ne: userId }, // Exclude messages sent by the user(not sent by  userId)
            isRead: false
        });
        res.status(200).json({ message: "Unread messages count fetched successfully: ", unreadCount });
    }catch(e){
        console.log("error in getUnreadCount controller: ", e.message);
        res.status(500).json({ message: "backend error in getUnreadCount controller", error: e.message });
    }
}





export const markMessagesAsRead = async (req, res) => {
    try{
        const { conversationId } = req.params;
        const userId = req.user.userid;

        // console.log(`markMessagesAsRead controller: Marking messages as read for user ${userId} in conversation ${conversationId}`);

        //finding all the messages in the conversation, that are not sent by the user and are unread
        const result = await Message.updateMany(
            { conversationId, senderId: { $ne: userId }, isRead: false },
            { $set: { isRead: true } }
        );
        // console.log(`Marked ${result.modifiedCount} messages as read in conversation ${conversationId} for user ${userId}`);
        res.status(200).json({ message: "Messages marked as read successfully: " });
    }catch(e){
        console.log("error in markMessagesAsRead controller: ", e.message);
        res.status(500).json({ message: "backend error in markMessagesAsRead controller", error: e.message });
    }
}

