import { registerUser, loginUser } from "../controllers/sellerControllers/authController.js";
import { verifyUser, verifyLogin, verifyGoogleLogin } from "../controllers/sellerControllers/verifySeller.js";
import { addProduct, deleteProduct, updateProduct, getAllProducts, getProductDetails, getSeller } from '../controllers/sellerControllers/productDetails.js'
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = express.Router();

// Public Routes
router.post('/signup', registerUser);
router.post('/verify-seller', verifyUser);
router.post('/login-seller', loginUser);
router.post('/verify-seller-login', verifyLogin);
router.post('/verify-google-login', verifyGoogleLogin);

// Protected Routes
router.use(authMiddleware);

router.post('/add-product', addProduct);
router.post('/delete-product', deleteProduct);
router.post('/update-product', updateProduct);

router.get('/get-product-details/:storeId', getProductDetails);
router.get('/get-all-products', getAllProducts);
router.get('/get-seller-info', getSeller);

export default router;
