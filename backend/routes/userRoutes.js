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
    forgotPasswordLimiter
} from "../middleware/rateLimitters.js";
import { forgotPassword, resetPassword } from '../controllers/userControllers/resetPassword.js';

const router = express.Router();

//Public Routes 
router.post('/signup', signupLimiter, registerUser);
router.post('/login-user', loginLimiter, loginUser);
router.post('/verify-google-login', googleLoginLimiter, verifyGoogleLogin);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', forgotPasswordLimiter, resetPassword);

router.get('/verify-user-login', magicLinkLimiter, verifyLogin);
router.get('/verify-user', magicLinkLimiter, verifyUser);
router.get('/get-stores', getStores);
router.get('/get-store-info', getStoreInfo);
router.get('/get-product-info/:productId', getProductDetails);

//Protected Routes
router.use(authMiddleware);

export default router;

