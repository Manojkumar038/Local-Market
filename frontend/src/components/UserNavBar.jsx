import logo from "../assets/logo.svg"
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/UserAuthContext";
import { useState, useRef, useEffect } from "react";
import "../styles/UserStyles/UserNavBar.css"


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useAuth();
  const isLoggedIn = !!token;

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const redirectLogin = () => {
    localStorage.setItem("redirectAfterLogin", location.pathname);
    navigate("/login");
  };

  return (
    <header className="nav">
      <div className="logo" onClick={() => navigate("/")}>
        <img src={logo} alt="Logo" style={{ height: 46, width: 46 }} />
      </div>

      <input className="search" placeholder="Search for products, stores..." />

      <div className="icons">
        {isLoggedIn && (
          <>
            <button className="icon-btn" title="Wishlist">
              ♡
            </button>
            <button className="icon-btn" title="Cart">
              🛒
            </button>

            <div className="account-menu-container" ref={menuRef}>
              <button
                className="icon-btn"
                title="Account"
                onClick={() => setShowMenu(!showMenu)}
              >
                👤
              </button>

              {showMenu && (
                <div className="account-menu">
                  <div
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/profile");
                    }}
                  >
                    👤 Profile
                  </div>

                  <div
                    className="menu-item"
                    onClick={() => {
                      setShowMenu(false);
                      navigate("/orders");
                    }}
                  >
                    📦 Orders
                  </div>

                  <div
                    className="menu-item logout"
                    onClick={() => {
                      setShowMenu(false);
                      localStorage.clear();
                      navigate("/login");
                    }}
                  >
                    🚪 Logout
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {!isLoggedIn && (
          <button className="icon-btn" onClick={redirectLogin}>
            👤 Login
          </button>
        )}
      </div>
    </header>
  );
}
