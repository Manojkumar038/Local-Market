import jwt from 'jsonwebtoken';
import PendingUser from '../../models/temp.js';
import Seller from '../../models/seller.js';
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

        let seller = await Seller.findOne({ email: pendingUser.email });
        
        if (!seller) {
            seller = new Seller({
                name: pendingUser.name,
                email: pendingUser.email,
                password: pendingUser.password,
                providers: { local: true },
            });
        } else {
            // Link local auth to existing account (e.g., Google user)
            seller.password = pendingUser.password;
            seller.providers.local = true;
        }
        

        await PendingUser.deleteOne({_id: pendingUser._id});
        await seller.save();

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

        const seller = await Seller.findOne({
            email: decoded.email,
            loginToken: token,
            loginTokenExpiry: { $gt: Date.now() },
        });

        if (!seller) {
            return res.status(400).json({
                message: "Login link is invalid or has expired.",
            });
        }

        if (!seller.providers?.local) {
            return res.status(400).json({
                message: "Use Google login for this account.",
            });
        }

        

        const loginToken = jwt.sign(
            {
                userId: seller._id,
                email: seller.email
            },
            process.env.SECRET_KEY ,
            { expiresIn: "7D" }
        );

        seller.loginToken = null;
        seller.loginTokenExpiry = null;
        await seller.save();

        res.status(200).json({
            message: 'Login Sucessful.',
            token: loginToken,
            userId: seller._id,
            email: seller.email
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
            
        let seller = await Seller.findOne({ email });

        if (!seller) {
            seller = new Seller({
                name,
                email,
                providers: { google: true },
                picture,
            });
            await seller.save();
        } else {
            if (!seller.providers.google) {
                seller.providers.google = true;
                await seller.save(); 
            }
        }

        
        const token = jwt.sign(
            {
                email: seller.email,
                userId: seller._id,
            },
            process.env.SECRET_KEY,
            { expiresIn: "7d" } 
        );

        res.json({
            token,
            user: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                picture: seller.picture || null,
            },
            message: "Google login successful",
        });
    } catch (error) {
        console.error("Google sign-in errocr:", error);
        res.status(401).json({ message: "Invalid Google token" });
    }
}