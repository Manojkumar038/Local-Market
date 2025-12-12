import jwt from 'jsonwebtoken';
import PendingUser from '../../models/userTemp.js';
import User from '../../models/user.js';
import { OAuth2Client } from "google-auth-library";



export const verifyUser = async (req, res) => {
    try {
        const { token } = req.query;

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const pendingUser = await PendingUser.findOne({
            email: decoded.email,
            token,
        });

        if (!pendingUser) {
            return res
                .status(400)
                .json({ message: "Request expired. Please try again." });
        }

        let user = await User.findOne({ email: pendingUser.email });

        if (!user) {
            user = new User({
                name: pendingUser.name,
                email: pendingUser.email,
                password: pendingUser.password,
                providers: { local: true },
            });
        } else {
            // Link local auth to existing account (e.g., Google user)
            user.password = pendingUser.password;
            user.providers.local = true;
        }

        await PendingUser.deleteOne({ _id: pendingUser._id });
        await user.save();

        return res.status(200).json({
            message: "User verified successfully.",
        });
    } catch (error) {
        console.error(`Error from verifyUser\n`, error);

        if (error.name === "TokenExpiredError") {
            return res
                .status(400)
                .json({ message: "Verification link has expired" });
        }

        return res
            .status(500)
            .json({ message: "Error occurred. Please try again." });
    }
};


export const verifyLogin = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const user = await User.findOne({
            email: decoded.email,
            loginToken: token,
            loginTokenExpiry: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                message: "Login link is invalid or has expired.",
            });
        }


        if (!user.providers?.local) {
            return res.status(400).json({
                message: "Use Google login for this account.",
            });
        }

        
        const loginToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.SECRET_KEY ,
            { expiresIn: "7D" }
        );

        user.loginToken = null;
        user.loginTokenExpiry = null;
        await user.save();


        res.status(200).json({
            message: 'Login Successful.',
            token: loginToken,
            userId: user._id,
            email: user.email
        });

    } catch (error) {
        console.log(error);
        if (error.name === "TokenExpiredError") {
            return res.status(400).json({ message: "Verification link expired" });
        }
        res.status(500).json({ message: "Invalid or expired link" });
    }
};

export const verifyGoogleLogin = async (req, res) => {

    
    const { idToken } = req.body;

    const client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );


    if (!idToken) {
        return res.status(400).json({ message: "Google token is required." });
    }
    try {

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        

        const payload = ticket.getPayload();
        const email = payload.email;
        const name = payload.name;
        const picture = payload.picture;
        const emailVerified = payload.email_verified;
        
        if (!emailVerified) {
            return res.status(401).json({ message: "Google email not verified." });
        }
            
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                name,
                email,
                providers: { google: true },
                picture,
            });
            await user.save();
        } else {
            if (!user.providers.google) {
                user.providers.google = true;
                await user.save(); // link account
            }
        }

        
        const token = jwt.sign(
            {
                email: user.email,
                userId: user._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: "7d" } 
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture || null,
            },
            message: "Google login successful",
        });
    } catch (error) {
        console.error("Google sign-in errocr:", error);
        res.status(401).json({ message: "Invalid Google token" });
    }
}