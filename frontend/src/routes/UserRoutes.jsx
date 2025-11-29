import { Routes, Route } from "react-router-dom";
import UserHomePage from "../pages/userPages/HomePage.jsx"; 
import StorePage from "../pages/userPages/StorePage.jsx";
import Login from "../pages/userPages/Login.jsx";
import ProtectRoute from "../pages/userPages/ProtectRoutes.jsx";
import VerifyUser from "../pages/userPages/VerifyUser.jsx";


export default function UserRoutes() {
  return (
    <Routes>
      <Route element={<ProtectRoute />}>
        <Route path="/store" element={<StorePage />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/" element={<UserHomePage />} />
      <Route path="user/verify" element={<VerifyUser />} />
    </Routes>
  );
}
