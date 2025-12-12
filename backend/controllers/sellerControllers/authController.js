import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 
// import mailgun from 'mailgun-js';
import PendingUser from '../../models/temp.js';
import Seller from '../../models/seller.js';
import { fileURLToPath } from 'url';
import { Resend } from "resend";


const __filename = fileURLToPath(import.meta.url);


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
        const seller = await Seller.findOne({email});
        const resend = new Resend(process.env.RESEND_API_KEY);
        // const mg = getMailgun();
        
        if(seller) {
            return res.status(400).json({message: "Seller Exists..Please Login."});
        }
        
        
        const hashedPassword = await bcrypt.hash(password, 10);

        const token = jwt.sign(
            {
                email: email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "4m" }
        );
        
        const pendingUser = new PendingUser({
            name, email, password: hashedPassword
        });

        await pendingUser.save();

        const magicLink = `${process.env.FRONTEND_URL}/seller/verify?token=${token}&type=signup`;

        // const mailOptions = {
        //     from: "Verify <noreply@LocalMarket>",
        //     to: email,
        //     subject: "Verify your Identity for entering into the Local Market!!",
        //     text: `Click the link to verify your account:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        // };

        // await mg.messages().send(mailOptions);

        const response = await resend.emails.send({
            from: "Locomerc <noreply@locomerc.store>",
            to: email,
            subject: "Verify your emial to enter locomerc",
            html: `
                <p>Hi seller,</p>

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
        const resend = new Resend(process.env.RESEND_API_KEY);
        // const mg = getMailgun();


        if(!seller) return res.status(400).json({message: 'Seller not found. Please signup!!'});

        // console.log(seller.password);
        const match = await bcrypt.compare(password, seller.password);

        if(!match) return res.status(401).json({message: 'The password is incorrect. Please try again!!'});

        const token = jwt.sign(
            {
                userId: seller._id,
                email: seller.email,
            },
            process.env.SECRET_KEY,
            { expiresIn: "4m" }
        );

        seller.loginToken = token;
        seller.loginTokenExpiry = Date.now() + 4 * 60 * 1000; // 4 minutes
        await seller.save();

        const magicLink = `${process.env.FRONTEND_URL}/seller/verify?token=${token}&type=login`;

        // const mailOptions = {
        //     from: "Verify <noreply@ledger>",
        //     to: email,
        //     subject: "Verify your Identity for entering into the Local Market!!",
        //     text: `Click the link to log in:\n\n${magicLink}\n\nThis link expires in 4 minutes.`,
        // };

        // await mg.messages().send(mailOptions);

        const response = await resend.emails.send({
            from: "Locomerc <noreply@locomerc.store>",
            to: email,
            subject: "Verify your emial to enter locomerc",
            html: `
                <p>Hi seller, ${seller.name} </p>

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

        res.status(200).json({ message: "A verification link has been sent to your mail. Please verify." });

    } catch (error) {
        console.log(`Error from ${__filename} \n` + error);
        res.status(500).json({ message: "An error occured while logging you in!! Please try again." });
    }
}