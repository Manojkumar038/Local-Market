import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/verifySeller.css";

const VerifyMagicLink = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { login } = useAuth();

  useEffect(() => {
    const verifyToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const type = params.get("type"); // login OR signup
      const server_url = import.meta.env.VITE_BACKEND_URL;
      if (!token) {
        alert("Invalid link");
        setLoading(false);
        navigate("/seller/login");
        return;
      }

      try {
        // Decide API endpoint based on "type"
        const endpoint =
          type === "signup"
            ? `${server_url}/api/seller/verify-seller?token=${token}`
            : `${server_url}/api/seller/verify-seller-login?token=${token}`;

        const response = await axios.get(endpoint);
        const data = response.data;

        if (type === "signup") {
          // Signup verified
          alert("Signup verified successfully! Please log in.");
          navigate("/seller/login");
        } else {
          // Login verified → Set session
          const expiryTime = Date.now() + 24 * 7 * 60 * 60 * 1000;
          login(data.token, expiryTime);
          navigate("/seller/");
        }
      } catch (error) {
        console.error("Verification error:", error);
        alert("Invalid or expired link.");
        navigate("/seller/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [navigate]);

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
