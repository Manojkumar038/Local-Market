import "../../styles/UserStyles/HomePage.css";
import logo from "../../assets/logo.svg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/UserAuthContext.jsx";

export default function Home() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const isLoggedIn = !!token;

  const categories = [
    { name: "For You", icon: "✨" },
    { name: "Electronics", icon: "🖥️" },
    { name: "Clothing", icon: "👕" },
    { name: "Home", icon: "🏠" },
  ];

  const stores = [
    {
      title: "Tech Nexus Electronics",
      desc: "Your go-to hub for the latest smartphones, laptops, and smart home gadgets.",
      img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    },
    {
      title: "The Artisan Bakery",
      desc: "Handcrafted bread, gourmet pastries, and morning coffee brewed with love.",
      img: "https://images.unsplash.com/photo-1542831371-d531d36971e6",
    },
    {
      title: "EcoThread Apparel",
      desc: "Sustainable and ethically produced clothing for all seasons.",
      img: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f",
    },
    {
      title: "Home Harmony Decor",
      desc: "Transform your living space with contemporary home décor.",
      img: "https://images.unsplash.com/photo-1505693314120-0d443867891c",
    },
  ];

  return (
    <div>
      {/* NAVBAR */}
      <header className="nav">
        <div className="logo">
          <img src={logo} alt="Logo" style={{ height: 46, width: 46 }} />
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
              <button className="icon-btn" title="Account">
                👤
              </button>
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
          {stores.map((s) => (
            <div className="store-card" key={s.title}>
              <img src={s.img} alt={s.title} />
              <div className="store-body">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
                <button className="btn-orange small">➜ Visit Store</button>
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
