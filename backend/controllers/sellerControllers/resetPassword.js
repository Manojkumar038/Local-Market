import crypto from "crypto";
import bcrypt from "bcryptjs";
import Seller from "../../models/seller.js";
import { Resend } from "resend";

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const resend = new Resend(process.env.RESEND_API_KEY);
        // console.log(email)

        const seller = await Seller.findOne({ email });
        if (!seller) {
            // Security: don’t reveal account existence
            return res.status(200).json({
                message: "If an account exists, a reset link has been sent.",
            });
        }

        const resetToken = crypto.randomBytes(32).toString("hex");

        seller.resetToken = crypto.createHash("sha256").update(resetToken).digest("hex");

        seller.resetTokenExpiry = Date.now() + 5 * 60 * 1000; // 5 min

        await seller.save();

        const resetUrl = `${process.env.FRONTEND_URL}/seller/reset-password?token=${resetToken}`;

        const response = await resend.emails.send({
            from: "Locomerc <noreply@locomerc.store>",
            to: email,
            subject: "Reset your password",
            html: `
                <p>Click the link below to reset your password:</p>
                <a href="${resetUrl}"
                            style="display:inline-block; padding:12px 20px; background:#4f46e5; 
                            color:white; text-decoration:none; border-radius:8px; font-weight:600;">
                            Reset password
                            </a>
                <p>This link expires in 5 minutes.</p>
            `,
        });
        // console.log(response)
        res.json({
            message: "If an account exists, a reset link has been sent.",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" });
    }
};


export const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const hashedToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const seller = await Seller.findOne({
            resetToken: hashedToken,
            resetTokenExpiry: { $gt: Date.now() },
        });

        if (!seller) {
            return res.status(400).json({
                message: "Invalid or expired reset token",
            });
        }

        // Set new password
        seller.password = await bcrypt.hash(password, 10);
        seller.resetPasswordToken = null;
        seller.resetPasswordExpiry = null;

        await seller.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Unable to reset password" });
    }
};
