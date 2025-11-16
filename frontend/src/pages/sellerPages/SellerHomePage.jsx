import React, { useState, useEffect, useRef } from "react";
import NavBar from "../../components/NavBar";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Banner from "../../assets/banner.svg";
import MarketLoader from "../../components/MarketLoader";


export default function StorePage() {

  const navigate = useNavigate();

  const [openMenuId, setOpenMenuId] = useState(null);
  const containerRef = useRef(null);
  const [storeData, setStoreData] = useState(null);
  const [items, setItems] = useState([]);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState({
    storeName: "",
    bannerImage: "",
    storeDescription: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSellerData() {
      try {
        const token = localStorage.getItem("token");

        const sellerResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/seller/get-seller-info`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const seller = sellerResponse.data;

        const storeData = {
          storeCreated: seller.storeCreated,
          storeName: seller.storeName,
          bannerImage: seller.storeBanner?.trim() || Banner,
          storeDescription: seller.storeDescription,
        };

        setStoreData(storeData);

        if (!seller.storeCreated) {
          setLoading(false);
          return navigate("/seller/create-store");
        } 

        if (seller.storeCreated) {
          const products = await axios.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/seller/get-product-details/${seller._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          setItems(products.data.products);
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);
    }

    getSellerData();
  }, []);

  
  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      setOpenMenuId(null);
      return;
    }
    // FIXED: use _id not id
    setItems((prev) => prev.filter((p) => p._id !== id));
    setOpenMenuId(null);
  }

  // Edit dialog handlers
  const openEditor = () => {
    setDraft(storeData);
    setEditOpen(true);
  };
  const closeEditor = () => setEditOpen(false);

  const saveEditor = (e) => {
    e.preventDefault();
    setStoreData(draft);
    setEditOpen(false);
  };

  if (loading || !storeData) {
    return <MarketLoader />;
  }


  return (
    <>
      <NavBar
        menuItems={[
          { label: "Profile", href: "/profile" },
          { label: "Add Products", href: "/add-product" },
          { label: "My Orders", href: "/orders" },
          { label: "Settings", href: "/settings" },
          {
            label: "Logout",
            onClick: () => alert("Logging out..."),
            className: "danger",
          },
        ]}
      />

      <header
        className="store-hero"
        role="banner"
        style={{
          backgroundImage: `url("${storeData.bannerImage}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="store-hero__overlay">
          <div className="store-title-row">
            <h1 className="store-title">{storeData.storeName}</h1>

            <button
              className="edit-btn"
              aria-label="Edit store details"
              onClick={openEditor}
              title="Edit store"
            >
              ✏️
            </button>
          </div>
          <p className="store-note">{storeData.storeDescription}</p>
        </div>
      </header>

      <section className="products-section" aria-label="Products">
        <h2 className="section-heading">Products</h2>

        <div className="products-grid" ref={containerRef}>
          {items.map((p) => (
            <article key={p._id} className="product-card" tabIndex={0}>
              <div className="product-media">
                <img src={p.image} alt={p.name} />
              </div>

              <div className="product-body">
                <div className="product-top">
                  <h3 className="product-name">{p.name}</h3>
                  <span className="product-price">{p.price}</span>
                </div>
                <p className="product-note">{p.note}</p>
              </div>

              <div className="card-actions">
                <button
                  className="kebab-btn"
                  aria-haspopup="true"
                  aria-expanded={openMenuId === p._id}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((cur) => (cur === p._id ? null : p._id));
                  }}
                >
                  ⋮
                </button>

                {openMenuId === p._id && (
                  <div
                    className="kebab-menu"
                    role="menu"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* FIX: Pass product id */}
                    <a
                      className="menu-item"
                      href={`/manage-product/${p._id}`}
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      Manage
                    </a>

                    <button
                      className="menu-item danger"
                      onClick={() => handleDelete(p._id)}
                    >
                      Delete Product
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Edit sheet modal */}
      {editOpen && (
        <div className="sheet-backdrop" onClick={closeEditor}>
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="editStoreHeading"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="editStoreHeading" className="sheet-title">
              Edit store
            </h3>

            <form onSubmit={saveEditor} className="sheet-form">
              {/* FIX: correct keys */}
              <div className="f">
                <label htmlFor="sname">Name</label>
                <input
                  id="sname"
                  type="text"
                  value={draft.storeName}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, storeName: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="f">
                <label htmlFor="snote">Note</label>
                <textarea
                  id="snote"
                  rows={3}
                  value={draft.storeDescription}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      storeDescription: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="f">
                <label htmlFor="sbanner">Banner image URL</label>
                <input
                  id="sbanner"
                  type="url"
                  placeholder="https://…/banner.svg"
                  value={draft.bannerImage}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, bannerImage: e.target.value }))
                  }
                />
              </div>

              <div className="actions">
                <button
                  type="button"
                  className="btn light"
                  onClick={closeEditor}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* STYLES REMAIN SAME */}
    </>
  );
}
