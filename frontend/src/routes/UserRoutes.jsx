import { Routes, Route } from "react-router-dom";
import UserHomePage from "../pages/userPages/HomePage.jsx"; 
import StorePage from "../pages/userPages/StorePage.jsx";
import Login from "../pages/userPages/Login.jsx";
// import ProtectRoute from "../pages/userPages/ProtectRoutes.jsx";
import VerifyUser from "../pages/userPages/VerifyUser.jsx";
import ProductPage from "../pages/userPages/ProductPage.jsx";
import ForgotPassword from "../pages/userPages/ForgotPassword.jsx";
import ResetPassword from "../pages/userPages/ResetPassword.jsx";

export default function UserRoutes() {
  return (
    <Routes>
      {/* <Route element={<ProtectRoute />}>
        <Route path="/store" element={<StorePage />} />
      </Route> */}
      <Route path="/store/:id" element={<StorePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<UserHomePage />} />
      <Route path="user/verify" element={<VerifyUser />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
