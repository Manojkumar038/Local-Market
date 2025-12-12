import "../../styles/UserStyles/HomePage.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserAuthContext.jsx";
import { useState, useRef, useEffect } from "react";
import axios from 'axios';

export default function Home() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const { token } = useAuth();
  const [isLoggedIn, setIsLoggedIn] = useState(!!token);
  
  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);
  
  useEffect(() => {
    const fetchStores = async () => {
      try {

        const res = await axios.get(`${backendUrl}/api/user/get-stores`);
        console.log(res);
        setStores(res.data.stores);
        console.log(stores)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);


  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  const categories = [
    { name: "For You", icon: "✨" },
    { name: "Electronics", icon: "🖥️" },
    { name: "Clothing", icon: "👕" },
    { name: "Home", icon: "🏠" },
  ];


  return (
    <div>
      {/* NAVBAR */}
      <header className="nav">
        <div className="logo">
          <img src={logo} alt="Logo" style={{ height: 46, width: 46 }} />
          <span className="app-name">Local Market</span>
        </div>
        <input
          className="search"
          placeholder="Search for products, stores..."
        />

        <div className="icons">
          {/* ✅ Show when logged in */}
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

          {/* ✅ Show when logged out */}
          {!isLoggedIn && (
            <button
              className="icon-btn"
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", location.pathname);
                navigate("/login");
              }}
            >
              👤 Login
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Welcome to Local Market</h1>
        <p>
          Discover authentic products from trusted stores. Shop electronics,
          clothing, and home essentials easily.
        </p>

        <div className="hero-buttons">
          {/* Show ONLY when logged out */}
          {!isLoggedIn && (
            <button
              className="btn-orange"
              onClick={() => {
                localStorage.setItem("redirectAfterLogin", location.pathname);
                navigate("/login");
              }}
            >
              🛍 Start Shopping
            </button>
          )}

          {/* Always show */}
          <button
            className="btn-outline"
            onClick={() =>
              document
                .getElementById("stores")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            🏬 Browse Stores
          </button>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="block">
        <div className="section-head">
          <div>
            <h2>Shop by Category</h2>
            <p>Explore our curated selection of product categories</p>
          </div>
          <button className="light-btn">View All</button>
        </div>

        <div className="categories">
          {categories.map((c) => (
            <div className="category-card" key={c.name}>
              <div className="icon">{c.icon}</div>
              <span>{c.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* STORES */}
      <section className="block" id="stores">
        <div className="section-head">
          <div>
            <h2>Featured Stores</h2>
            <p>
              Discover trusted sellers with quality products and great service
            </p>
          </div>
          <button className="light-btn">View All Stores</button>
        </div>

        <div className="stores">
          {loading && <p>Loading stores...</p>}
          {error && <p className="error">{error}</p>}

          {!loading && !error && stores.length === 0 && (
            <p>No stores available</p>
          )}

          {!loading &&
            !error &&
            stores.map((s) => (
              <div className="store-card" key={s.id}>
                <img src={s.banner} alt={s.name} />
                <div className="store-body">
                  <h3>{s.name}</h3>
                  <p>{s.description}</p>
                  <button
                    className="btn-orange small"
                    onClick={() => navigate(`/store/${s.id}`)}
                  >
                    ➜ Visit Store
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>About &nbsp; Privacy &nbsp; Terms &nbsp; Contact</div>
        <div>© 2025 Local Market. All rights reserved.</div>
      </footer>
    </div>
  );
}
