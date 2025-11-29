import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { userToken } = useAuth();

  if (!userToken) {
    return <Navigate to="/seller/login" replace />;
  }

  return <Outlet />;
}
