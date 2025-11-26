import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Banner from "../../assets/banner.svg";
import "../../styles/Dashboard.css";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar.jsx";
import { useAuth } from "../../context/AuthContext"; 



export default function SellerHomePage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [storeData, setStoreData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // UI state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);

  const containerRef = useRef(null);

  const recentOrders = []; // or fetched data later
  const topSelling = []; // or fetched data later

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem("token");

        const sellerResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller/get-seller-info`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const seller = sellerResponse.data;

        const formattedStore = {
          storeCreated: seller.storeCreated,
          storeName: seller.storeName,
          bannerImage: seller.storeBanner?.trim() || Banner,
          storeDescription: seller.description,
        };

        setStoreData(formattedStore);

        // Only ONE check needed
        if (seller.storeCreated !== true) {
          setLoading(false);
          return navigate("/seller/create-store");
        }

        // Fetch products
        const productResponse = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_URL
          }/api/seller/get-all-products?storeId=${seller._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log(productResponse);
        setProducts(productResponse.data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [navigate]);

  // click outside to close kebab menus
  useEffect(() => {
    function handleDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, []);

  function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      setOpenMenuId(null);
      return;
    }
    setProducts((prev) => prev.filter((p) => p._id !== id));
    setOpenMenuId(null);
  }

  if (loading || !storeData) {
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;
  }

  return (
    <>
      <NavBar showMenu={false}></NavBar>

      <div className="sd-wrapper">
        {/* Topbar - shows hamburger on mobile */}
        <header className="sd-topbar">
          <button className="hamburger" onClick={() => setDrawerOpen(true)}>
            <svg
              width="28"
              height="22"
              viewBox="0 0 28 22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 4h22M3 12h22M3 20h22"
                stroke="#000"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <div className="topbar-title">{storeData.storeName}</div>
        </header>

        {/* Drawer overlay */}
        <div
          className={`sd-drawer-backdrop ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen(false)}
          aria-hidden={drawerOpen ? "false" : "true"}
        />

        {/* Drawer / Sidebar */}
        <aside
          className={`sd-drawer ${drawerOpen ? "open" : ""}`}
          aria-hidden={!drawerOpen}
        >
          <div className="drawer-header">
            <strong>Seller Panel</strong>
            <button
              className="close-drawer"
              onClick={() => setDrawerOpen(false)}
            >
              ✕
            </button>
          </div>

          <nav className="drawer-nav">
            <a
              className="nav-item active"
              onClick={() => {
                setDrawerOpen(false);
              }}
            >
              Dashboard
            </a>

            <a
              className="nav-item"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/seller/add-product");
              }}
            >
              Add Product
            </a>
            <a
              className="nav-item"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/seller");
              }}
              style={{ opacity: 0.5, pointerEvents: "none" }}
            >
              Orders
            </a>
            <a
              className="nav-item"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/seller/settings");
              }}
            >
              Store Settings
            </a>
            <button
              className="nav-item logout"
              onClick={() => {
                logout();
                navigate("/seller/login");
              }}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Desktop sidebar (visible on md+) */}
        <aside className="sd-sidebar">
          <h3 className="sidebar-brand">Seller Panel</h3>
          <nav className="sidebar-nav">
            <a className="nav-item active">Dashboard</a>
            <a
              className="nav-item"
              onClick={() => navigate("/seller/add-product")}
            >
              Add Product
            </a>
            <a
              className="nav-item"
              onClick={() => navigate("/seller/orders")}
              style={{ opacity: 0.5, pointerEvents: "none" }}
            >
              Orders
            </a>
            <a
              className="nav-item"
              onClick={() => navigate("/seller/settings")}
            >
              Store Settings
            </a>
            <button
              className="nav-item logout"
              onClick={() => {
                logout();
                navigate("/seller/login");
              }}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Main content */}
        <main className="sd-main">
          {/* Small Banner */}
          <div className="sd-banner">
            <img
              src={storeData.bannerImage}
              alt="Store banner"
              className="sd-banner-img"
            />
            <div className="sd-banner-text">
              <h1>{storeData.storeName}</h1>
              <p className="muted">{storeData.storeDescription}</p>
            </div>
          </div>

          {/* Analytics */}
          <section className="sd-analytics">
            <div className="stat-card">
              <div className="stat-top">📦</div>
              <div className="stat-value">{products.length}</div>
              <div className="stat-label">Total Products</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">📈</div>
              <div className="stat-value">₹0</div>
              <div className="stat-label">Sales</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">👀</div>
              <div className="stat-value">0</div>
              <div className="stat-label">Visits</div>
            </div>

            <div className="stat-card">
              <div className="stat-top">💰</div>
              <div className="stat-value">₹0</div>
              <div className="stat-label">Earnings</div>
            </div>
          </section>

          {/* Recent orders + Top selling (stack on mobile) */}
          <section className="sd-split">
            {/* Recent Orders */}
            <div className="card orders-card">
              <div className="card-title">Recent Orders</div>

              {recentOrders && recentOrders.length > 0 ? (
                <div className="orders-list">
                  {recentOrders.map((order) => (
                    <div className="order-item" key={order._id}>
                      <div>
                        <div className="order-id">#{order.orderNumber}</div>
                        <div className="order-amount">₹{order.amount}</div>
                      </div>
                      <div>
                        <span className={`badge ${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-section">
                  <div className="empty-icon">📭</div>
                  <p>No recent orders.</p>
                </div>
              )}
            </div>

            {/* Top Selling */}
            <div className="card top-selling-card">
              <div className="card-title">Top Selling</div>

              {topSelling && topSelling.length > 0 ? (
                topSelling.map((p) => (
                  <div className="top-product" key={p._id}>
                    <img src={p.coverPhoto || p.image || Banner} alt="" />
                    <div>
                      <div className="prod-name">{p.name}</div>
                      <div className="prod-meta">{p.unitsSold} units sold</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-section">
                  <div className="empty-icon">📦</div>
                  <p>No top-selling products.</p>
                </div>
              )}
            </div>
          </section>

          {/* Product Grid */}
          <section className="product-grid-section">
            <div className="section-heading-row">
              <h3 className="your-products">Your Products</h3>
              <div>
                <button
                  className="btn small"
                  onClick={() => navigate("/seller/add-product")}
                >
                  Add Product
                </button>
              </div>
            </div>
            <div className="product-grid" ref={containerRef}>
              {products.map((p) => (
                <article
                  className="product-card"
                  key={p._id}
                  onClick={() => navigate(`/seller/product-details/${p._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Kebab Button – top right */}
                  <button
                    className="kebab-toggle"
                    aria-expanded={openMenuId === p._id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === p._id ? null : p._id);
                    }}
                  >
                    ⋮
                  </button>

                  {/* Kebab dropdown */}
                  {openMenuId === p._id && (
                    <div
                      className="kebab-menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="menu-item"
                        onClick={() =>
                          navigate(`/seller/manage-product/${p._id}`)
                        }
                      >
                        Manage
                      </button>
                      <button
                        className="menu-item danger"
                        onClick={() => handleDelete(p._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Product Image */}
                  <div className="product-media">
                    <img src={p.coverPhoto || p.image || Banner} alt={p.name} />
                  </div>

                  {/* Product Details */}
                  <div className="product-body">
                    <h3 className="product-name">{p.name}</h3>

                    <p className="product-description">
                      {p.description?.slice(0, 60) || "No description"}...
                    </p>

                    <div className="product-meta">
                      <span className="price">₹{p.price}</span>
                      {p.stock === 0 && (
                        <span className="stock" style={{ color: "red" }}>
                          Out of stock
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
