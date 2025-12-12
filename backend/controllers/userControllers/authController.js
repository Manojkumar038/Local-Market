import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
// import mailgun from "mailgun-js";
import PendingUser from "../../models/userTemp.js";
import User from "../../models/user.js";
import { Resend } from "resend";

// function getMailgun() {
//     if (!process.env.MAILGUN_API_KEY || !process.env.MAILGUN_DOMAIN) {
//         throw new Error("Mailgun env vars missing");
//     }

//     return mailgun({
//         apiKey: process.env.MAILGUN_API_KEY,
//         domain: process.env.MAILGUN_DOMAIN,
//     });
// }


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // const mg = getMailgun();
        const resend = new Resend(process.env.RESEND_API_KEY);


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
            provider: "local",
        });


        const magicLink = `${process.env.FRONTEND_URL}/user/verify?token=${token}&type=signup`;

        // Mail options
        // const mailOptions = {
        //     from: `LocoMerc <noreply@${process.env.MAILGUN_DOMAIN}>`,
        //     to: email,
        //     subject: "Verify your email",
        //     text: `Click the link below to verify your account:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        // };

        // // Send email
        // await mg.messages().send(mailOptions);


        const response = await resend.emails.send({
            from: "Locomerc <noreply@locomerc.store>",
            to: email,
            subject: "Verify your emial to enter locomerc",
            html: `
                <p>Hi, ${user.name} </p>

                <p>Thanks for signing up at <strong>Locomerc</strong>.  
                Please click the button below to verify your account:</p>

                <p>
                    <a href="${magicLink}"
                    style="display:inline-block; padding:12px 20px; background:#4f46e5; 
                    color:white; text-decoration:none; border-radius:8px; font-weight:600;">
                    Verify Email
                    </a>
                </p>

                <p>If you did not request this email, simply ignore it.</p>

                <p>Regards,<br/>Locomerc Team</p>
                `,
        });

        console.log("Log from registeration from authController" + response);

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
        // const mg = getMailgun();
        const resend = new Resend(process.env.RESEND_API_KEY);

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res
                .status(400)
                .json({ message: "User not found. Please signup." });
        }

        if (!user.providers?.local) {
            return res.status(400).json({
                message: "This account uses Google login. Please use Continue with Google.",
            });
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

        user.loginToken = token;
        user.loginTokenExpiry = Date.now() + 4 * 60 * 1000; // 4 minutes
        await user.save();

        const magicLink = `${process.env.FRONTEND_URL}/user/verify?token=${token}&type=login`;

        // const mailOptions = {
        //     from: `LocoMerc <noreply@${process.env.MAILGUN_DOMAIN}>`,
        //     to: email,
        //     subject: "Login verification",
        //     text: `Click the link below to login:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        // };

        // await mg.messages().send(mailOptions);

        const response = await resend.emails.send({
            from: "Locomerc <noreply@locomerc.store>",
            to: email,
            subject: "Verify your emial to enter locomerc",
            html: `
                <p>Hi, ${user.name} </p>

                <p>Welcome back to <strong>Locomerc</strong>.  
                Please click the button below to safely access your account:</p>

                <p>
                    <a href="${magicLink}"
                    style="display:inline-block; padding:12px 20px; background:#4f46e5; 
                    color:white; text-decoration:none; border-radius:8px; font-weight:600;">
                    Verify Email
                    </a>
                </p>

                <p>If you did not request this email, simply ignore it.</p>

                <p>Regards,<br/>Locomerc Team</p>
                `,

        });

        // console.log(response.data)

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
