import mongoose from 'mongoose';
import User from './Authmodels.js'

const ConnectionSchema = mongoose.Schema({
    
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    status: {
        type:String,
        enum: ["", "pending", "accepted", "rejected"],
        default: "pending"

    }
}, { timestamps: true });

const Connection=mongoose.model("Connection", ConnectionSchema);
export default Connection;