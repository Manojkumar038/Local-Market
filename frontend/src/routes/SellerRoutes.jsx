import { Routes, Route } from "react-router-dom";
import StorePage from "../pages/sellerPages/SellerHomePage.jsx";
import AddProductPage from "../pages/sellerPages/AddProducts.jsx";
import ManageProduct from "../pages/sellerPages/ManageProduct.jsx";
import LoginSeller from "../pages/sellerPages/LoginAsSeller.jsx";
import VerifySeller from "../pages/sellerPages/VerifySeller.jsx";
import ProtectRoutes from "../pages/sellerPages/ProtectRoutes.jsx";
import CreateStore from "../pages/sellerPages/CreateStore.jsx";

export default function SellerRoutes() {
  return (
    <Routes>
      <Route element={<ProtectRoutes />}>
        <Route index element={<StorePage />} /> {/* FIXED */}
        <Route path="add-product" element={<AddProductPage />} />
        <Route path="manage-product" element={<ManageProduct />} />
        <Route path="create-store" element={<CreateStore/>} />
      </Route>

      <Route path="login" element={<LoginSeller />} />
      <Route path="verify" element={<VerifySeller />} />
    </Routes>
  );
}
