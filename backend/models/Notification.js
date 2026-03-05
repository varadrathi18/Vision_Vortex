import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subscription', required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['unread', 'resolved'], default: 'unread' },
    deadlineDate: { type: Date, required: true }
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
