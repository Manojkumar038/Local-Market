import { useState } from "react";
import axios from "axios";
import "../../styles/UserStyles/PasswordReset.css";

export default function ForgotPassword() {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(`${backendUrl}/api/seller/forgot-password`, { email });
      setSubmitted(true);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth">
      <div className="card">
        <h1 className="title">Forgot Password</h1>

        {submitted ? (
          <p style={{ color: "#475569" }}>
            If an account exists, a reset link has been sent to your email.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="form">
            <div className="field">
              <label>Email</label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button className="primary-btn" disabled={loading}>
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
