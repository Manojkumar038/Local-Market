import { registerUser, loginUser } from "../controllers/userControllers/authController.js";
import  { verifyUser, verifyLogin, verifyGoogleLogin }  from "../controllers/userControllers/verifyUser.js";
import { getStores, getStoreInfo } from '../controllers/userControllers/storeInfo.js';
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { getProductDetails } from '../controllers/userControllers/storeInfo.js'

const router = express.Router();

//Public Routes 
router.post('/signup', registerUser);
router.get('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.get('/verify-user-login', verifyLogin);
router.post('/verify-google-login', verifyGoogleLogin);

router.get('/get-stores', getStores);
router.get('/get-store-info', getStoreInfo);
router.get('/get-product-info/:productId', getProductDetails);


//Protected Routes
router.use(authMiddleware);

export default router;

