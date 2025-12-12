import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx"; // SELLER AUTH CONTEXT

export default function LoginAsSeller() {
  const [mode, setMode] = useState("login");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { login } = useAuth(); // use seller auth context

  const onGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${backendUrl}/api/seller/verify-google-login`,
        {
          idToken: credentialResponse.credential,
        }
      );

      const token = res.data.token;
      const seller = res.data.user;

      const expiryTime = Date.now() + 5 * 24 * 60 * 60 * 1000; // 5 days

      // Use AuthContext login (NO localStorage manually)
      login(token, expiryTime);

      navigate("/seller/");
    } catch (error) {
      console.error("Google login error:", error);
      alert(
        error.response?.data?.message ||
          "Google login failed. Please try again."
      );
    }
  };

  const onGoogleError = () => {
    console.error("Google Login Failed");
  };

  const switchMode = () => setMode((m) => (m === "login" ? "signup" : "login"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    try {
      const endpoint =
        mode === "login" ? "/api/seller/login-seller" : "/api/seller/signup";

      const response = await axios.post(`${backendUrl}${endpoint}`, data);

      alert(response.data.message);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          `An error occurred during ${mode}. Please try again.`
      );
    }
  };

  return (
    <>
      <section className="auth">
        <div className="card">
          <h1 className="title">
            {mode === "login"
              ? `Welcome Seller ${String.fromCodePoint(0x1f600)}`
              : "Create account"}
          </h1>
          <p className="desc">
            {mode === "login"
              ? `Enter your credentials to access your seller account.`
              : "One step closer to the local market."}
          </p>

          <form className="form" onSubmit={handleSubmit}>
            {mode === "signup" && (
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Doe"
                  required
                />
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={8}
                required
              />
            </div>

            {mode === "signup" && (
              <div className="field">
                <label htmlFor="confirm">Confirm password</label>
                <input
                  id="confirm"
                  name="confirm"
                  type="password"
                  placeholder="••••••••"
                  minLength={8}
                  required
                />
              </div>
            )}

            <button type="submit" className="primary-btn">
              {mode === "login" ? "Log in" : "Sign up"}
            </button>
          </form>

          <div className="divider">
            <span>OR</span>
          </div>

          <div className="oauth">
            <GoogleLogin
              ux_mode="popup"
              useFedCM={false}
              onSuccess={onGoogleSuccess}
              onError={onGoogleError}
              useOneTap={false}
            />
          </div>

          <p className="toggle">
            {mode === "login" ? "New here?" : "Already have an account?"}{" "}
            <button type="button" className="link-btn" onClick={switchMode}>
              {mode === "login" ? "Create an account" : "Log in instead"}
            </button>
          </p>
        </div>
      </section>

      {/* EXACT SAME CSS – NOT CHANGED */}
      <style>{`
        .auth {
          min-height: 100vh;
          min-width: 100vw;
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          background: transparent, #eef2f8;
          padding: 24px;
        }
        .card {
          width: 100%;
          max-width: 420px;
          margin-right: 12%;
          background: #fff;
          border-radius: 14px;
          padding: 22px 22px 16px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
        }
        .title {font-size: 22px; font-weight: 600; color: #0f172a;}
        .desc {margin-bottom: 20px; color: #64748b; font-size: 14px;}
        .form {display: grid; gap: 12px; margin-top: 8px;}
        .field {display: grid; gap: 6px;}
        label {font-size: 16px; color: #1f242cff;}
        input {padding: 10px 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 14px; outline: none;}
        input:focus {border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15);}
        .primary-btn {margin-top: 6px; width: 100%; padding: 10px 12px; background: #2563eb; color: #fff; font-weight: 700; border: 0; border-radius: 10px; cursor: pointer;}
        .divider {display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; color: #64748b; margin: 14px 0;}
        .divider::before, .divider::after {content: ""; height: 1px; background: #e2e8f0;}
        .oauth {display: grid; place-items: center; gap: 10px;}
        .toggle {margin: 14px 0 0; text-align: center; color: #475569; font-size: 14px;}
        .link-btn {background: none; border: none; padding: 0; color: #2563eb; font-weight: 700; cursor: pointer;}
      `}</style>
    </>
  );
}
