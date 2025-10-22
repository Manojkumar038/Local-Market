import { Routes, Route } from "react-router-dom";
import Home from "./pages/userPages/HomePage.jsx";
import StorePage from "./pages/userPages/StorePage.jsx";
import SellerHomePage from "./pages/sellerPages/SellerHomePage.jsx";
import AddProductPage from "./pages/sellerPages/AddProducts.jsx";
import ManageProduct from "./pages/sellerPages/ManageProduct.jsx";
import LoginSeller from "./pages/sellerPages/LoginAsSeller.jsx";
import Login from "./pages/userPages/Login.jsx"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/seller" element={<SellerHomePage />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/manage-product" element={<ManageProduct />} />
        <Route path="/login-seller" element={<LoginSeller />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}
