import mongoose from 'mongoose'
import User from './Authmodels.js'

const ConversationSchema=new  mongoose.Schema({

    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    }],
    connectionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Connection",
    },
    lastMessage:{
        type:String,
        default:"",
    },
    lastMessageAt: {
    type: Date,
    default: Date.now
  },

},{timestamps:true});

const Conversation=mongoose.model("Conversation", ConversationSchema);
export default Conversation;