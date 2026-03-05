import cron from 'node-cron';
import Subscription from '../models/Subscription.js';
import { Notification } from '../models/Notification.js';
import { User } from '../models/User.js';
import { sendNotificationEmail } from '../utils/sendEmail.js';

// Run every day at midnight (0 0 * * *)
export const startCronJobs = () => {
    // For testing: '* * * * *' runs every minute. 
    // Usually for production we use '0 0 * * *' (Midnight)
    cron.schedule('0 0 * * *', async () => {
        console.log('Running daily subscription check...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const threeDaysFromNow = new Date(today);
            threeDaysFromNow.setDate(today.getDate() + 3);

            // Need an upper bound so we only get exactly 3 days out
            const upperThreeDays = new Date(threeDaysFromNow);
            upperThreeDays.setHours(23, 59, 59, 999);

            const expiringSubscriptions = await Subscription.find({
                billingDate: {
                    $gte: threeDaysFromNow,
                    $lte: upperThreeDays
                }
            });

            console.log(`Found ${expiringSubscriptions.length} subscriptions expiring in 3 days.`);

            for (const sub of expiringSubscriptions) {
                // Check if we already created a notification for this subscription's current deadline to avoid duplicates
                const existingNotification = await Notification.findOne({
                    subscriptionId: sub._id,
                    deadlineDate: {
                        $gte: threeDaysFromNow,
                        $lte: upperThreeDays
                    }
                });

                if (!existingNotification) {
                    const user = await User.findById(sub.userId);
                    if (user) {
                        // 1. Create Dashboard Notification
                        await Notification.create({
                            userId: sub.userId,
                            subscriptionId: sub._id,
                            message: `Your subscription to ${sub.subscriptionName} will end in 3 days.`,
                            deadlineDate: sub.billingDate
                        });

                        // 2. Send Email
                        await sendNotificationEmail(user.email, sub.subscriptionName, `${sub.amount} ${sub.currency || ''}`);
                    }
                }
            }

        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });

    console.log('Cron jobs initialized.');
};
