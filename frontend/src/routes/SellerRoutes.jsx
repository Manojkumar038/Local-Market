import { Routes, Route } from "react-router-dom";
import StorePage from "../pages/sellerPages/SellerHomePage.jsx";
import AddProducts from "../pages/sellerPages/AddProducts.jsx";
import ManageProduct from "../pages/sellerPages/ManageProduct.jsx";
import LoginAsSeller from "../pages/sellerPages/LoginAsSeller.jsx";
import VerifySeller from "../pages/sellerPages/VerifySeller.jsx";
import ProtectRoutes from "../pages/sellerPages/ProtectRoutes.jsx";
import CreateStore from "../pages/sellerPages/CreateStore.jsx";
import SellerSettings from "../pages/sellerPages/Settings.jsx"
import SellerProductDetails from "../pages/sellerPages/ProductDetails.jsx";
import ForgotPassword from "../pages/sellerPages/ForgotPassword.jsx";
import ResetPassword from "../pages/sellerPages/ResetPassword.jsx";

export default function SellerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectRoutes />}>
        <Route index element={<StorePage />} />
        <Route path="add-product" element={<AddProducts />} />
        <Route path="manage-product/:productId" element={<ManageProduct />} />
        <Route path="create-store" element={<CreateStore />} />
        <Route path="settings" element={<SellerSettings />} />
        <Route
          path="product-details/:productId"
          element={<SellerProductDetails />}
        />
      </Route>

      <Route path="login" element={<LoginAsSeller />} />
      <Route path="verify" element={<VerifySeller />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
