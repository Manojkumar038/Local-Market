import { registerUser, loginUser } from "../controllers/sellerControllers/authController.js";
import { verifyUser, verifyLogin, verifyGoogleLogin } from "../controllers/sellerControllers/verifySeller.js";
import { addProduct, deleteProduct, updateProduct, getAllProducts, getProductDetails, getSeller } from '../controllers/sellerControllers/productDetails.js'
import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js'
import { createOrUpdateStore } from "../controllers/sellerControllers/storeControllers.js";
import { deleteCloudinaryImage }  from "../controllers/sellerControllers/cloudStorage.js";

const router = express.Router();

// Public Routes
router.post('/signup', registerUser);
router.get('/verify-seller', verifyUser);
router.post('/login-seller', loginUser);
router.get('/verify-seller-login', verifyLogin);
router.post('/verify-google-login', verifyGoogleLogin);

// Protected Routes
router.use(authMiddleware);

router.post('/add-product', addProduct);
router.post('/delete-product', deleteProduct);
router.put('/update-product', updateProduct);
router.post("/delete-cloudinary-image", deleteCloudinaryImage);


router.get('/get-product-details/:productId', getProductDetails);
router.get('/get-all-products', getAllProducts);
router.get('/get-seller-info', getSeller);

router.put("/create-store", createOrUpdateStore);

export default router;
