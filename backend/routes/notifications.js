import express from 'express';
import { Notification } from '../models/Notification.js';
import Subscription from '../models/Subscription.js';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

// Get all unread notifications for a user
router.get('/', verifyToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id, status: 'unread' })
            .populate('subscriptionId', 'subscriptionName amount currency')
            .sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: 'Server error fetching notifications' });
    }
});

// Handle 'Continue' or 'Cancel' actions
router.post('/:id/action', verifyToken, async (req, res) => {
    try {
        const { action } = req.body; // 'continue' or 'cancel'
        const notificationId = req.params.id;

        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        if (notification.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Unauthorized to modify this notification' });
        }

        if (action === 'cancel') {
            // Delete the subscription if the user chooses 'Cancel'
            await Subscription.findByIdAndDelete(notification.subscriptionId);
        }

        // Regardless of action, mark the notification as resolved
        notification.status = 'resolved';
        await notification.save();

        res.json({ message: `Action '${action}' performed successfully`, notification });
    } catch (error) {
        console.error("Error performing action on notification:", error);
        res.status(500).json({ error: 'Server error performing action' });
    }
});

export default router;
