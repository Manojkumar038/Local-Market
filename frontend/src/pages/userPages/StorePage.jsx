import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../styles/UserStyles/StorePage.css";
import { useNavigate } from "react-router-dom";


export default function StorePage() {
  const { id } = useParams();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(200000);
  const [showFilters, setShowFilters] = useState(false);

  const filtersRef = useRef(null);
  const toggleRef = useRef(null);

  // Fetch store + products
  useEffect(() => {
    const fetchStoreInfo = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/user/get-store-info`, {
          params: { id },
        });
        setStore(res.data.store);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Failed to load store");
      } finally {
        setLoading(false);
      }
    };

    fetchStoreInfo();
  }, [id, backendUrl]);

  // Close filters when clicking outside
  useEffect(() => {
    const closeOnOutside = (e) => {
      if (
        showFilters &&
        !filtersRef.current?.contains(e.target) &&
        !toggleRef.current?.contains(e.target)
      ) {
        setShowFilters(false);
      }
    };

    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, [showFilters]);

  // Filtering logic
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q));
    }

    list = list.filter((p) => Number(p.price) <= Number(maxPrice));

    if (sortBy === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHigh") list.sort((a, b) => b.price - a.price);

    return list;
  }, [products, search, sortBy, maxPrice]);

  if (loading) return <div className="store-page center">Loading store…</div>;
  if (error) return <div className="store-page center error">{error}</div>;
  if (!store) return <div className="store-page center">Store not found</div>;

  return (
    <div className="store-page">
      {/* HERO */}
      <header
        className="store-hero"
        style={{ backgroundImage: `url(${store.banner})` }}
      >
        <div className="store-hero-overlay">
          <div className="store-hero-text">
            <p className="store-breadcrumb">
              Products · {filteredProducts.length} items
            </p>
            <h1>{store.name}</h1>
            <p className="store-tagline">{store.description}</p>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <div className="store-main">
        {/* SEARCH + FILTER BUTTON */}
        <div className="store-main-top">
          <input
            className="store-search"
            placeholder="Search in this store..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            ref={toggleRef}
            className="store-filter-toggle"
            onClick={() => setShowFilters((p) => !p)}
          >
            ☰ Filters
          </button>

          {/* FILTER MENU */}
          <aside
            ref={filtersRef}
            className={
              "store-filters " +
              (showFilters ? "store-filters--mobile-open" : "")
            }
          >
            <div className="filters-section">
              <h3>Sort by</h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="featured">Featured</option>
                <option value="priceLow">Price: Low to High</option>
                <option value="priceHigh">Price: High to Low</option>
              </select>
            </div>

            <div className="filters-section">
              <h3>Price Range</h3>
              <div className="price-range-label">
                <span>₹0</span>
                <span>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="0"
                max="200000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <button
              className="filters-clear"
              onClick={() => {
                setSearch("");
                setSortBy("featured");
                setMaxPrice(200000);
                setShowFilters(false);
              }}
            >
              Clear Filters
            </button>
          </aside>
        </div>

        {/* PRODUCTS */}
        <main className="store-products">
          <div className="store-products-header">
            <h2>Products</h2>
            <span className="items-count">{filteredProducts.length} items</span>
          </div>

          {filteredProducts.length === 0 ? (
            <p className="empty-text">No products found</p>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((p) => (
                <article
                  className="product-card"
                  style={{cursor: "pointer"}}
                  key={p._id}
                  onClick={() => navigate(`/product/${p._id}`)}
                  
                >
                  <button className="product-wishlist">♡</button>

                  <img src={p.coverPhoto || p.images?.[0]} alt={p.name} />

                  <div className="product-info">
                    <h3>{p.name}</h3>
                    <div className="product-price">₹{p.price}</div>

                    {p.stock === 0 ? (
                      <button className="product-cart-btn disabled">
                        Out of Stock
                      </button>
                    ) : (
                      <button className="product-cart-btn">Add to Cart</button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer>
        <div>About · Privacy · Terms · Contact</div>
        <div>© 2025 Local Market. All rights reserved.</div>
      </footer>
    </div>
  );
}
