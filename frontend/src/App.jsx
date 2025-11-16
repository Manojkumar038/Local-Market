import UserRoutes from "./routes/UserRoutes.jsx";
import SellerRoutes from "./routes/SellerRoutes.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<UserRoutes />} />
        <Route path="/seller/*" element={<SellerRoutes />} />
      </Routes>
    </BrowserRouter>
  );
}