import Seller from '../models/seller.js';
import User from '../models/user.js';


const googleLoginSeller = async (req, res) => {
    const {name, email } = req.body;

    if(!name || !email) {
        return res.status(400).json({message: 'Login failed please try again. authController.js'})
    }

    try {
        var seller =  await Seller.findOne({ email });

        if(!seller) {
            //Send additonal data collection fields for phone , store Name and address details. 
            seller = new Seller({ name, email});
            await seller.save();

            const token = jwt.sign(
                {
                    email: email,
                    sellerId: seller._id
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
        }
    } catch (error) {
        console.error("Google sign-in error:", error);
        res.status(500).json({ message: "Something went wrong...Please try again!!", error: error.message });
    }
}

const googleLogin = async (req, res) => {
    const { name, email } = req.body;

    if (!name || !email) {
        return res.status(400).json({ message: 'Login failed please try again. authController.js' })
    }

    try {
        var user = await User.findOne({ email });

        if (!user) {
            //Send additonal data collection fields for phone , store Name and address details. 
            user = new User({ name, email });
            await User.save();

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
        }
    } catch (error) {
        console.error("Google sign-in error at googleLogin user:", error);
        res.status(500).json({ message: "Something went wrong...Please try again!!", error: error.message });
    }
}

export default {googleLoginSeller, googleLogin};

