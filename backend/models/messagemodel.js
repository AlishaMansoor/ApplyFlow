import mongoose from 'mongoose';
import User from './Authmodels.js';
import Conversation from './conversationmodel.js'
 
const MessageSchema = new mongoose.Schema({
    text:{
        type:String,
        required:true,
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    conversationId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Conversation",
        required:true
    },
    isRead:{
      type:Boolean,
      default:false
    }
}, {timestamps:true});

const Message = mongoose.model("Message", MessageSchema);

export default Message;