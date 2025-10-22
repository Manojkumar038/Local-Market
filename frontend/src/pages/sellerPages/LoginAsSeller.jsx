// AuthPage.jsx
import React, { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); // 'login' | 'signup'

  const onGoogleSuccess = (cred) => {
    // cred contains {credential: <JWT>, select_by: ...}
    // Send cred.credential (ID token) to backend for verification/exchange
    console.log("Google success:", cred);
    // await fetch("/api/auth/google", { method: "POST", body: JSON.stringify({ id_token: cred.credential }) })
  };

  const onGoogleError = () => {
    console.error("Google Login Failed");
  };

  const switchMode = () => setMode((m) => (m === "login" ? "signup" : "login"));

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (mode === "login") {
      // POST /api/auth/login
      console.log("Login:", data);
    } else {
      // POST /api/auth/signup
      console.log("Signup:", data);
    }
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      <section className="auth">
        <div className="card">
          <h1 className="title">
            {mode === "login"
              ? `Welcome Seller ${String.fromCodePoint(0x1f600)}`
              : "Create account"}
          </h1>
          <p className="desc">
            {" "}
            {mode === "login"
              ? `Logging in as a Seller`
              : "Registering as a Seller"}{" "}
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

      <style>{`
        .auth { min-height: 100vh; display: grid; place-items: center; background: transparent,#eef2f8); padding: 24px; margin: 10px}
        .card { width: 100%; max-width: 420px; background: #fff; border-radius: 14px; padding: 22px 22px 16px; box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
        .title {font-size: 22px; font-weight: 600; color: #0f172a; }
        .desc {margin-bottom: 20px; color: #64748b; font-size: 14px; }
        .form { display: grid; gap: 12px; margin-top: 8px; }
        .field { display: grid; gap: 6px; }
        label { font-size: 16px; color: #1f242cff;}
        input { padding: 10px 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 14px; outline: none; }
        input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .primary-btn { margin-top: 6px; width: 100%; padding: 10px 12px; background: #2563eb; color: #fff; font-weight: 700; border: 0; border-radius: 10px; cursor: pointer; }
        .primary-btn:active { transform: translateY(1px); }
        .divider { display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 10px; color: #64748b; margin: 14px 0; }
        .divider::before, .divider::after { content: ""; height: 1px; background: #e2e8f0; }
        .oauth { display: grid; place-items: center; gap: 10px; }
        .toggle { margin: 14px 0 0; text-align: center; color: #475569; font-size: 14px; }
        .link-btn { background: none; border: none; padding: 0; color: #2563eb; font-weight: 700; cursor: pointer; }
      `}</style>
    </GoogleOAuthProvider>
  );
}
