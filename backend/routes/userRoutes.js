import { registerUser, loginUser } from "../controllers/userControllers/authController.js";
import  { verifyUser, verifyLogin, verifyGoogleLogin }  from "../controllers/userControllers/verifyUser.js";
import { getStores, getStoreInfo } from '../controllers/userControllers/storeInfo.js';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getProductDetails } from '../controllers/userControllers/storeInfo.js'
import {
    signupLimiter,
    loginLimiter,
    magicLinkLimiter,
    googleLoginLimiter,
} from "../middleware/rateLimitters.js";


const router = express.Router();

//Public Routes 
router.post('/signup', signupLimiter, registerUser);
router.get('/verify-user', magicLinkLimiter, verifyUser);
router.post('/login-user', loginLimiter, loginUser);
router.get('/verify-user-login', magicLinkLimiter, verifyLogin);
router.post('/verify-google-login', googleLoginLimiter, verifyGoogleLogin);

router.get('/get-stores', getStores);
router.get('/get-store-info', getStoreInfo);
router.get('/get-product-info/:productId', getProductDetails);


//Protected Routes
router.use(authMiddleware);

export default router;

