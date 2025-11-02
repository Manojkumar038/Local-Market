import bcrytp from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
import mailgun from 'mailgun-js';
import dotenv from 'dotenv';
dotenv.config({ path: `.env.development`, quiet: true });
import PendingUser from '../../models/temp.js';
import Seller from '../../models/seller.js';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);


const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
});


export const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body;
        const seller = await Seller.findOne({email});
        if(seller) {
            return res.status(400).json({message: "Seller Exists..Please Login."});
        }

        const hashedPassword = await bcrytp.hash(password, 10);
        console.log(`From ${__filename} \n Hashed Password: ` + hashedPassword);

        const token = jwt.sign(
            {
                email: email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "4m" }
        );
        
        const pendingUser = new PendingUser({
            name, email, password: hashedPassword, token
        });

        await pendingUser.save();

        const magicLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

        const mailOptions = {
            from: "Verify <noreply@ledger>",
            to: email,
            subject: "Verify your Identity for entering into the Local Market!!",
            text: `Click the link to log in:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        };

        await mg.messages().send(mailOptions);

        res.status(200).json({ message: `A verification link has been sent to your registered email address. Please check your inbox to verify your account.`});

    } catch (error) {
        console.log(`Error from ${__filename} \n` + error);
        res.status(500).json({ message: "An error occured while registering the seller!! Please try again." });
    }
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const seller = await Seller.findOne({email});
        
        if(!seller) return res.status(400).json({message: 'Seller not found. Please signup!!'});

        console.log(seller.password);
        const match = await bcrytp.compare(password, user.password);

        if(!match) return res.status(401).json({message: 'The password is incorrect. Please try again!!'});

        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "4m" }
        );

        const magicLink = `${process.env.FRONTEND_URL}/verify?token=${token}`;

        const mailOptions = {
            from: "Verify <noreply@ledger>",
            to: email,
            subject: "Verify your Identity for entering into the Local Market!!",
            text: `Click the link to log in:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        };

        await mg.messages().send(mailOptions);

        res.status(200).json({ message: "A verification link has been sent to your mail. Please verify." });

    } catch (error) {
        console.log(`Error from ${__filename} \n` + error);
        res.status(500).json({ message: "An error occured while logging you in!! Please try again." });
    }
}