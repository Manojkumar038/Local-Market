import React, { useState, useEffect, useRef } from "react";
import defaultStores from "../../data/store.js";
import NavBar from "../../components/NavBar";

function makeSvgDataUri(svgString) {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

const products = [
  {
    id: 1,
    name: "Oak Side Table",
    price: "$129",
    image: makeSvgDataUri(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#fff7f0'/><rect x='120' y='140' width='560' height='300' rx='12' fill='#d6eadf'/><text x='50%' y='85%' text-anchor='middle' fill='#163534' font-size='28'>Oak Side Table</text></svg>`
    ),
    note: "Compact, hand-finished oak side table.",
  },
  {
    id: 2,
    name: "Handwoven Basket",
    price: "$45",
    image: makeSvgDataUri(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#f0fff8'/><circle cx='400' cy='260' r='160' fill='#f6e7d9'/><text x='50%' y='85%' text-anchor='middle' fill='#163534' font-size='28'>Handwoven Basket</text></svg>`
    ),
    note: "Perfect for blankets and storage.",
  },
  {
    id: 3,
    name: "Ceramic Mug",
    price: "$18",
    image: makeSvgDataUri(
      `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#fffaf6'/><ellipse cx='400' cy='260' rx='160' ry='120' fill='#cfe7e0'/><text x='50%' y='85%' text-anchor='middle' fill='#163534' font-size='28'>Ceramic Mug</text></svg>`
    ),
    note: "Hand-thrown, dishwasher safe.",
  },
];

export default function StorePage({ store = defaultStores[0] }) {
  const [items, setItems] = useState(products);
  const [openMenuId, setOpenMenuId] = useState(null);
  const containerRef = useRef(null);

  // Local editable store state (name, note, banner url)
  const [storeData, setStoreData] = useState({
    name: store.name || "Green Home",
    note: store.note || "",
    image: store.image || "",
  });

  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(storeData);

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

  function handleManage(product) {
    alert(`Manage "${product.name}" (id: ${product.id})`);
    setOpenMenuId(null);
  }

  function handleDelete(id) {
    if (!window.confirm("Delete this product?")) {
      setOpenMenuId(null);
      return;
    }
    setItems((prev) => prev.filter((p) => p.id !== id));
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
    // TODO: call API to persist changes
    // await fetch('/api/store', { method:'PUT', body: JSON.stringify(draft) })
  };

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
          backgroundImage: `url("${storeData.image}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="store-hero__overlay">
          <div className="store-title-row">
            <h1 className="store-title">{storeData.name}</h1>
            <button
              className="edit-btn"
              aria-label="Edit store details"
              onClick={openEditor}
              title="Edit store"
            >
              ✏️
            </button>
          </div>
          <p className="store-note">{storeData.note}</p>
        </div>
      </header>

      <section className="products-section" aria-label="Products">
        <h2 className="section-heading">Products</h2>
        <div className="products-grid" ref={containerRef}>
          {items.map((p) => (
            <article key={p.id} className="product-card" tabIndex={0}>
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
                  aria-expanded={openMenuId === p.id}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId((cur) => (cur === p.id ? null : p.id));
                  }}
                >
                  <span className="dots">⋮</span>
                </button>

                {openMenuId === p.id && (
                  <div
                    className="kebab-menu"
                    role="menu"
                    onMouseDown={(e) => e.stopPropagation()}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <a
                      className="menu-item"
                      href="/manage-product"
                      style={{ textDecoration: "none", display: "block" }}
                    >
                      Manage
                    </a>
                    <button
                      className="menu-item danger"
                      onClick={() => handleDelete(p.id)}
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
              <div className="f">
                <label htmlFor="sname">Name</label>
                <input
                  id="sname"
                  type="text"
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="f">
                <label htmlFor="snote">Note</label>
                <textarea
                  id="snote"
                  rows={3}
                  value={draft.note}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, note: e.target.value }))
                  }
                />
              </div>

              <div className="f">
                <label htmlFor="sbanner">Banner image URL</label>
                <input
                  id="sbanner"
                  type="url"
                  placeholder="https://…/banner.svg"
                  value={draft.image}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, image: e.target.value }))
                  }
                />
                <small className="hint">
                  Use an SVG or a large image for crisp rendering.
                </small>
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

      <style>{`
        .store-page { font-family: "Segoe UI", Arial, sans-serif; color: #0e3b36; padding-bottom: 48px; }
        .store-hero {
          height: 320px;
          display: flex;
          align-items: flex-end;
          position: relative;
          border-bottom-left-radius: 18px;
          border-bottom-right-radius: 18px;
          overflow: hidden;
          box-shadow: 0 8px 28px rgba(11,95,255,0.06);
        }
        .store-hero__overlay {
          width: 100%;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.92) 70%);
          padding: 20px 28px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .store-title-row { display: flex; align-items: center; gap: 10px; }
        .store-title { margin: 0; font-size: 28px; font-weight: 700; color: #252828ff; }
        .edit-btn {
          border: none; background: #f1f4f7ff; color: #0f172a;
          width: 34px; height: 34px; border-radius: 8px; cursor: pointer;
          display: inline-flex; align-items: center; justify-content: center;
        }
        .edit-btn:hover { background: #e2e8f0; }

        .store-note { margin: 0; color: #111615ff; opacity: 0.9; max-width: 900px; font-size: 16px; }

        .products-section { max-width: 1100px; margin: 22px auto; padding: 0 18px; }
        .section-heading { margin: 0 0 12px 0; font-size: 18px; color: #0e3b36; }

        .products-grid { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
        .product-card {
          position: relative;
          background: #fff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.06);
          display: flex;
          flex-direction: column;
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }
        .product-media img { width: 100%; height: 130px; object-fit: cover; display: block; background: #e2bbbbff; }
        .product-body { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
        .product-top { display:flex; justify-content: space-between; align-items: baseline; gap: 8px; }
        .product-name { margin: 0; font-size: 15px; font-weight: 600; color: #163534; }
        .product-price { font-weight: 700; color: #0b5fff; }
        .product-note { margin: 0; color: #55615f; font-size: 13px; }

        .card-actions { position: absolute; top: 10px; right: 10px; z-index: 4; }
        .kebab-btn {
          width: 36px; height: 36px; border-radius: 8px; border: none; background: transparent;
          display: inline-flex; align-items: center; justify-content: center; cursor: pointer;
          font-size: 20px; font-weight: 600;
        }
        .kebab-btn:active { transform: translateY(1px); }
        .kebab-menu {
          position: absolute; right: 0; margin-top: 8px; background: #f2f1f1ff; border-radius: 8px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.12); display: flex; flex-direction: column;
          min-width: 160px; overflow: hidden; z-index: 10;
        }
        .kebab-menu .menu-item {
          padding: 10px 12px; text-align: left; background: transparent; border: none; cursor: pointer;
          font-size: 14px; font-weight: 500; color: #163534;
        }
        .kebab-menu .menu-item:hover { background: #f5f7f6; }
        .kebab-menu .menu-item.danger { color: #d23; }

        /* Edit sheet modal */
        .sheet-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.4);
          display: grid;
          place-items: center;        /* center vertically and horizontally */
          z-index: 50;
        }

        .sheet {
          width: 100%;
          max-width: 700px;           /* adjust as needed */
          background: #fff;
          border-radius: 16px;        /* full rounded corners when centered */
          padding: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.25);
          transform: translateY(0);   /* ensure no offset */
        }
        .sheet-title { margin: 0 0 8px; font-size: 18px; font-weight: 700; color: #0f172a; }
        .sheet-form { display: grid; gap: 12px; }
        .f { display: grid; gap: 6px; }
        label { font-size: 13px; color: #334155; }
        input, textarea {

          padding: 10px 12px; width: 90%; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 14px; outline: none;
        }
        input:focus, textarea:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,0.15); }
        .hint { color: #64748b; font-size: 12px; }
        .actions { margin-top: 4px; display: flex; gap: 10px; justify-content: flex-end; }
        .btn { padding: 10px 12px; border-radius: 10px; font-weight: 500; cursor: pointer; border: 0; }
        .btn.light { background: #f1f5f9; color: #0f172a; }
        .btn.light:hover { background: #e2e8f0; }
        .btn.primary { background: #61d9d1ff; color: #f5f5f5ff; }
        .btn.primary:active { transform: translateY(1px); }

        @media (max-width: 900px) {
          .products-grid { grid-template-columns: repeat(2, 1fr); }
          .store-hero { height: 260px; }
        }
        @media (max-width: 600px) {
          .products-grid { grid-template-columns: 1fr; }
          .store-hero { height: 220px; }
          .store-title { font-size: 20px; }
        }
          
      `}</style>
    </>
  );
}
