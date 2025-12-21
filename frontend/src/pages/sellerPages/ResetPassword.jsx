import { useState } from "react";
import axios from "axios";
import "../../styles/UserStyles/PasswordReset.css";

export default function ResetPassword() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = new URLSearchParams(window.location.search).get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      return alert("Passwords do not match");
    }

    setLoading(true);

    try {
      await axios.post(`${backendUrl}/api/seller/reset-password`, {
        token,
        password,
      });

      setDone(true);
    } catch (error) {
      alert(error.response?.data?.message || "Invalid or expired reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      <div className="card">
        <h1 className="title">Reset Password</h1>

        {done ? (
          <p>
            Password reset successful. <a href="/seller/login">Log in</a>
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label>New password</label>
              <input
                type="password"
                minLength={8}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="field">
              <label>Confirm password</label>
              <input
                type="password"
                minLength={8}
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            <button className="primary-btn" disabled={loading}>
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
