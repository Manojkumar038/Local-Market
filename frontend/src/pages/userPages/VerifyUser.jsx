import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/UserAuthContext.jsx";
import "../../styles/verifySeller.css";

const VerifyMagicLink = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {

      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const type = params.get("type").toString();
      
      if (!["signup", "login"].includes(type)) {
        alert("Invalid verification type.");
        navigate("/login");
        return;
      }

      const server_url = import.meta.env.VITE_BACKEND_URL;
      
      if (!token) {
        alert("Invalid link fromm this ");
        localStorage.removeItem("redirectAfterLogin");
        navigate("/login");
        return;
      }

      try {
        const endpoint =
          type === "signup"
            ? `${server_url}/api/user/verify-user?token=${encodeURIComponent(
                token
              )}`
            : `${server_url}/api/user/verify-user-login?token=${encodeURIComponent(
                token
              )}`;

        const response = await axios.get(endpoint);
        const data = response.data;

        // console.log(data)

        if (type === "signup") {
          alert("Signup verified successfully.");
          const expiryTime = Date.now() + 5 * 60 * 60 * 1000;
          login(data.token, data.user || null, expiryTime);
          navigate("/");
          window.location.reload();
        } else {
          const expiryTime = Date.now() + 5 * 60 * 60 * 1000;
          login(data.token, data.user || null, expiryTime);

          const redirectPath = localStorage.getItem("redirectAfterLogin");
          if (redirectPath) {
            localStorage.removeItem("redirectAfterLogin");
            navigate(redirectPath);
          } else {
            navigate("/");
          }
        }
      } catch (error) {
        console.error("Verification error:", error);
        alert("Invalid or expired link.");
        localStorage.removeItem("redirectAfterLogin"); // ✅ added safety
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate, login]);

  return (
    <div className="verify-container">
      {loading ? (
        <div className="verify-content">
          <div className="spinner"></div>
          <h2 className="verify-text">Verifying your link...</h2>
        </div>
      ) : (
        <h2 className="verify-error">Verification failed. Redirecting...</h2>
      )}
    </div>
  );
};

export default VerifyMagicLink;
