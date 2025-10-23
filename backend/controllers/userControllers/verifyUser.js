import jwt from 'jsonwebtoken';
import PendingUser from '../../models/temp.js';
import User from '../../models/user.js';
import { fileURLToPath } from 'url';
import path from 'path';
import { decode } from 'punycode';

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

        if (!decoded) return res.status(400).json({ message: 'Request Expired. Please try again.' });


        const loginToken = jwt.sign(
            { userId: decoded._id, email: decoded.email },
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