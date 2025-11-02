import { registerUser, loginUser } from "../controllers/sellerControllers/authController.js";
import { verifyUser, verifyLogin, verifyGoogleLogin } from "../controllers/sellerControllers/verifyUser.js";
import { addProduct, deleteProduct, updateProduct, getAllProducts } from '../controllers/sellerControllers/productDetails.js'
import express from 'express';


const router = express.Router();

router.post('/signup', registerUser);
router.post('/verify-user', verifyUser);
router.post('/login-user', loginUser);
router.post('/verify-user-login', verifyLogin);
router.post('/verify-google-login', verifyGoogleLogin);

router.post('/add-product', addProduct);
router.post('/delete-product', deleteProduct);
router.post('/update-product', updateProduct);

router.get('/get-all-products', getAllProducts);