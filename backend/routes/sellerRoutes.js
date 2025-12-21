import { registerUser, loginUser } from "../controllers/sellerControllers/authController.js";
import { verifyUser, verifyLogin, verifyGoogleLogin } from "../controllers/sellerControllers/verifySeller.js";
import { addProduct, deleteProduct, updateProduct, getAllProducts, getProductDetails, getSeller } from '../controllers/sellerControllers/productDetails.js'
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { createOrUpdateStore } from "../controllers/sellerControllers/storeControllers.js";
import { deleteCloudinaryImage }  from "../controllers/sellerControllers/cloudStorage.js";
import { forgotPassword, resetPassword } from '../controllers/sellerControllers/resetPassword.js';
import {
    signupLimiter,
    loginLimiter,
    magicLinkLimiter,
    googleLoginLimiter,
    forgotPasswordLimiter
} from "../middleware/rateLimitters.js";



const router = express.Router();

// Public Routes
router.get('/verify-seller', magicLinkLimiter, verifyUser);
router.get('/verify-seller-login', magicLinkLimiter, verifyLogin);

router.post('/signup', signupLimiter, registerUser);
router.post('/login-seller', loginLimiter, loginUser);
router.post('/verify-google-login', googleLoginLimiter, verifyGoogleLogin);
router.post('/forgot-password', forgotPasswordLimiter, forgotPassword);
router.post('/reset-password', forgotPasswordLimiter, resetPassword);

// Protected Routes
router.use(authMiddleware);

router.get('/get-product-details/:productId', getProductDetails);
router.get('/get-all-products', getAllProducts);
router.get('/get-seller-info', getSeller);

router.post('/add-product', addProduct);
router.post('/delete-product', deleteProduct);
router.post("/delete-cloudinary-image", deleteCloudinaryImage);

router.put('/update-product', updateProduct);
router.put("/create-store", createOrUpdateStore);

export default router;
