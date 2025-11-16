import { Routes, Route } from "react-router-dom";
import Home from "../pages/userPages/HomePage.jsx";
import StorePage from "../pages/userPages/StorePage.jsx";
import Login from "../pages/userPages/Login.jsx";

export default function UserRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/store" element={<StorePage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
