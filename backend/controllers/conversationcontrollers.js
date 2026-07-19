import Conversation from '../models/conversationmodel.js';
import Message from '../models/messagemodel.js';

export const getAllConversations = async (req, res) => {
    try {
        const id = req.user.userid;
        
        const chats = await Conversation.find({ participants: id })
        .populate('participants', 'firstName lastName userName profileImage')
        .sort({ lastMessageAt: -1 });
        // console.log("conversationcontrollers, getAllConversations controller: chats after fetching", chats);
        
        
        //add unreadCount to each conversation(chat object)
        const chatsWithUnreadCount = await Promise.all( // all queries fire at the same time in db
            chats.map(async (chat) => {
                const unreadCount = await Message.countDocuments({
                    conversationId: chat._id,
                    isRead: false,
                    senderId: { $ne: id }
                });
                return { ...chat.toObject(), unreadCount };
            })
        );
        res.status(200).json({ chats: chatsWithUnreadCount });
    } catch (e) {
        res.status(500).json({ message: "Backend error in fetching all chats", error: e.message });
    }
}

