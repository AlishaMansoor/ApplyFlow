import mongoose from 'mongoose';
import User from './Authmodels.js'


const NotificationSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true

    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    type: {
        type: String,
        enum: ["invite","invite-update", "connection-request", "application-update", "connection-request-update"],
        required:true,

    },
    message: {
        type: String,
    },
    isRead: {
        type: Boolean,
        default:false
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;