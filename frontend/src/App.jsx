import UserRoutes from "./routes/UserRoutes.jsx";
import SellerRoutes from "./routes/SellerRoutes.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserAuthProvider } from "./context/UserAuthContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* USER SIDE */}
        <Route
          path="/*"
          element={
            <UserAuthProvider>
              <UserRoutes />
            </UserAuthProvider>
          }
        />

        {/* SELLER SIDE */}
        <Route
          path="/seller/*"
          element={
            <AuthProvider>
              <SellerRoutes />
            </AuthProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
