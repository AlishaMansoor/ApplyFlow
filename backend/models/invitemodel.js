import mongoose from 'mongoose';
import User from './Authmodels.js';
import Job from './jobmodel.js';

const InviteSchema = mongoose.Schema({
    
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

    },
    jobId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    }
}, { timestamps: true });

const Invite =mongoose.model("Invite", InviteSchema);
export default Invite;