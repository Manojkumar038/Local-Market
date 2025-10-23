import { registerUser, loginUser } from "../controllers/authController.js";
import  { verifyUser, verifyLogin, verifyGoogleLogin }  from "../controllers/userControllers/verifyUser.js";
import express from 'express';



const router = express.Router();

//Routes 
router.post('/signup', registerUser);
router.post('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.post('/verify-user-login', verifyLogin);
router.post('/verify-google-login', verifyGoogleLogin);

export default router;

