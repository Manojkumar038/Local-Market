import { Routes, Route } from "react-router-dom";
import Home from "./pages/userPages/HomePage.jsx";
import StorePage from "./pages/userPages/StorePage.jsx";
import SellerHomePage from "./pages/sellerPages/SellerHomePage.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/seller" element={<SellerHomePage />} />
      </Routes>
    </>
  );
}
