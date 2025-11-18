import jwt from 'jsonwebtoken';
import PendingUser from '../../models/temp.js';
import Seller from '../../models/seller.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';


import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);


export const verifyUser = async (req, res) => {
    try {
        const { token } = req.query;

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        const pendingUser = await PendingUser.findOne({
            email: decoded.email, 
        });

        if(!pendingUser) return res.status(400).json({message: 'Request Expired. Please try again.'});

        const seller = new Seller({
            name: pendingUser.name,
            email: pendingUser.email,
            password: pendingUser.password
        })

        await seller.save();
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

        if (!decoded) return res.status(400).json({ message: 'Request Expired. Please try again.' });


        const loginToken = jwt.sign(
            { userId: decoded.userId, email: decoded.email },
            process.env.SECRET_KEY,
        );

        res.status(200).json({
            message: 'Login Sucessful.',
            token: loginToken,
            userId: decoded.userId,
            email: decoded.email
        });


    } catch (error) {
        console.log(`Error from ${__filename} \n` + error);
        if (error.name === 'TokenExpiredError') {
            return res.status(400).json({ message: "Verification link has expired" });
        }
        res.status(500).json({ message: "Error occurred!! Please try again." });
    }
}

export const verifyGoogleLogin = async (req, res) => {
    const { email, name, picture } = req.body;

    if (!email || !name) {
        return res.status(400).json({ message: "Email and name are required." });
    }

    try {
        let seller = await Seller.findOne({ email });

        if (!seller) {
            const dummyPassword = crypto.randomBytes(32).toString('hex');
            const hashedPassword = await bcrypt.hash(dummyPassword, 10);
            seller = new Seller({ name, email, password: hashedPassword });
            await seller.save();
        }

        const token = jwt.sign(
            {
                email: email,
                userId: seller._id
            },
            process.env.SECRET_KEY,
        );

        res.json({
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                picture: seller.picture || null,
            },
            message: "Login successful"
        });

    }catch(error) {
        console.log(`Error from ${__filename} \n` + error);
        res.status(500).json({ message: "Some Error occurred!! Please try again." });
    }
}