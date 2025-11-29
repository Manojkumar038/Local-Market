import jwt from 'jsonwebtoken';
import PendingUser from '../../models/userTemp.js';
import User from '../../models/user.js';
import { fileURLToPath } from 'url';
import path from 'path';
import crypto from "crypto";
import bcrypt from "bcryptjs";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


export const verifyUser = async (req, res) => {
    try {
        const { token } = req.query;
        

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const pendingUser = await PendingUser.findOne({
            email: decoded.email, 
            token: token
        });

        if(!pendingUser) return res.status(400).json({message: 'Request Expired. Please try again.'});

        const user = new User({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password
        })

        await user.save();
        await PendingUser.deleteOne({_id: pendingUser._id});

        res.status(200).json({message: 'User verified successfully.'});

    } catch (error) {
        console.log(`Error from ${__filename} \n` + error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Verification link has expired" });
        }
        res.status(500).json({ message: "Error occurred!! Please try again." });
    }
}

export const verifyLogin = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        
        const user = await User.findOne({ email: decoded.email });
        
        if (!user) {
            return res.status(404).json({ message: "User does not exist." });
        }

        
        const loginToken = jwt.sign(
            {
                userId: user._id,
                email: user.email
            },
            process.env.SECRET_KEY,
            { expiresIn: "5h" }
        );

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
    const { email, name, picture } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required." });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            const dummyPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(dummyPassword, 10);
            user = new User({ name, email, password: hashedPassword });
            await user.save();
        }

        const token = jwt.sign(
            {
                email: email,
                userId: user._id
            },
            process.env.SECRET_KEY,
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                picture: user.picture || null,
            },
            message: "Login successful"
        });

    }catch(error) {
        console.log(`Error from ${__filename} \n` + error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Verification link has expired" });
        }
        res.status(500).json({ message: "Error occurred!! Please try again." });
    }
}