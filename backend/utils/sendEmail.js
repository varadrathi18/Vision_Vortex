import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendNotificationEmail = async (to, subscriptionName, amount) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject: 'Subscription Expiring Soon!',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2 style="color: #20c997;">Your subscription is ending in 3 days!</h2>
                    <p>Hi there,</p>
                    <p>This is a reminder that your <strong>${subscriptionName}</strong> subscription for <strong>${amount}</strong> will expire in 3 days.</p>
                    <p>Please log in to your dashboard to Continue or Cancel this subscription.</p>
                    <div style="margin-top: 30px;">
                        <a href="http://localhost:5173" style="background-color: #20c997; color: #000; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
                    </div>
                    <p style="margin-top: 30px; font-size: 12px; color: #999;">Vision Vortex - Automatic Notification</p>
                </div>
            `
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${to}: ${result.response}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        return false;
    }
};
