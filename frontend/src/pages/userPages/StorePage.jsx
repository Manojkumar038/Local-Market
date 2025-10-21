import React from "react";
import defaultStores from "../../data/store.js";

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
  return (
    <>
      {/* Back button */}
      <button
        type="button"
        className="back-btn"
        onClick={() => navigate(-1)}
        aria-label="Go back"
      >
        ← Back
      </button>
      <header
        className="store-hero"
        role="banner"
        style={{
          backgroundImage: `url("${store.image}")`,
        }}
      >
        <div className="store-hero__overlay">
          <h1 className="store-title">{store.name}</h1>
          <p className="store-note">{store.note}</p>
        </div>
      </header>

      <section className="products-section" aria-label="Products">
        <h2 className="section-heading">Products</h2>
        <div className="products-grid">
          {products.map((p) => (
            <article key={p.id} className="product-card">
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
            </article>
          ))}
        </div>
      </section>

      <style>{`
        .back-btn{
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 3;
          padding: 8px 10px;
          border-radius: 8px;
          border: none;
          background: rgba(224, 220, 220, 0.9);
          box-shadow: 0 6px 14px rgba(56, 55, 55, 0.12);
          cursor: pointer;
          font-weight: 600;
        }
        .back-btn:active { transform: translateY(1px); }
        .store-page { font-family: "Segoe UI", Arial, sans-serif; color: #a4d5d1ff; padding-bottom: 48px; }
        .store-hero {
          height: 320px;
          background-size: cover;
          background-position: center;
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
        .store-title { margin: 0; font-size: 28px; font-weight: 700; color: #252828ff; }
        .store-note { margin: 0; color: #111615ff; opacity: 0.9; max-width: 900px; font-size: 16px; }

        .products-section { max-width: 1100px; margin: 22px auto; padding: 0 18px; }
        .section-heading { margin: 0 0 12px 0; font-size: 18px; color: #0e3b36; }

        .products-grid { display: grid; gap: 14px; grid-template-columns: repeat(3, 1fr); }
        .product-card {
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

