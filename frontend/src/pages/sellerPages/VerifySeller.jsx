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
      const server_url = import.meta.env.VITE_BACKEND_URL;
      console.log(token); 
      if (!token) {
        alert("Invalid link");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await axios.post(
          `${server_url}/api/seller/verify-seller-login?token=${token}`
        );

        const data = response.data;
        const now = new Date().getTime();
        const expiryTime = new Date(now + 5 * 60 * 60 * 1000);
        login(data.token, expiryTime);
        navigate("/seller/");
      } catch (error) {
        console.error("Error verifying link:", error);
        alert("Invalid or expired link." + error);
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
          <h2 className="verify-text">Verifying your magic link...</h2>
        </div>
      ) : (
        <h2 className="verify-error">Verification failed. Redirecting...</h2>
      )}
    </div>
  );
};

export default VerifyMagicLink;
