import { registerUser, loginUser } from "../controllers/userControllers/authController.js";
import  { verifyUser, verifyLogin, verifyGoogleLogin }  from "../controllers/userControllers/verifyUser.js";
import { getStores, getStoreInfo } from '../controllers/userControllers/storeInfo.js';
import express from 'express';


const router = express.Router();

//Routes 
router.post('/signup', registerUser);
router.post('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.post('/verify-user-login', verifyLogin);
router.post('/verify-google-login', verifyGoogleLogin);

router.get('/get-stores', getStores);
router.get('/get-store-info', getStoreInfo);

export default router;

