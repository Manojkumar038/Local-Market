import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mailgun from "mailgun-js";
import PendingUser from "../../models/userTemp.js";
import User from "../../models/user.js";



function getMailgun() {
    if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
        throw new Error("Mailgun env vars missing");
    }

    return mailgun({
        apiKey: process.env.MAILGUN_API_KEY,
        domain: process.env.MAILGUN_DOMAIN,
    });
}


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const mg = getMailgun();
        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res
                .status(400)
                .json({ message: "User already exists. Please login." });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const token = jwt.sign(
            { email },
            process.env.SECRET_KEY,
            { expiresIn: "4m" }
        );

        // Save pending user
        await PendingUser.create({
            name,
            email,
            password: hashedPassword,
            token,
        });

        const magicLink = `${process.env.FRONTEND_URL}/user/verify?token=${token}&type=signup`;

        // Mail options
        const mailOptions = {
            from: `LocoMerc <noreply@${process.env.MAILGUN_DOMAIN}>`,
            to: email,
            subject: "Verify your email",
            text: `Click the link below to verify your account:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        };

        // Send email
        await mg.messages().send(mailOptions);

        res.status(200).json({
            message: "Verification link sent to your email.",
        });
    } catch (error) {
        console.error("REGISTER USER ERROR:", error);
        res.status(500).json({
            message: "Something went wrong. Please try again.",
        });
    }
};

 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const mg = getMailgun();
        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res
                .status(400)
                .json({ message: "User not found. Please signup." });
        }

        // Compare password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res
                .status(401)
                .json({ message: "Invalid password. Try again." });
        }

        // Generate login verification token
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            process.env.SECRET_KEY,
            { expiresIn: "4m" }
        );

        const magicLink = `${process.env.FRONTEND_URL}/user/verify?token=${token}&type=login`;

        const mailOptions = {
            from: `LocoMerc <noreply@${process.env.MAILGUN_DOMAIN}>`,
            to: email,
            subject: "Login verification",
            text: `Click the link below to verify login:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        };

        await mg.messages().send(mailOptions);

        res.status(200).json({
            message: "Login verification link sent to your email.",
        });
    } catch (error) {
        console.error("LOGIN USER ERROR:", error);
        res.status(500).json({
            message: "Something went wrong. Please try again.",
        });
    }
};
