// ...existing code...
import React from "react";
import defaultStores from '../data/store.js';


const makeSvgDataUri = (svg) =>
  "data:image/svg+xml;utf8," + encodeURIComponent(svg);

// ...existing code...
export default function Stores({ stores = defaultStores }) {
  return (
    <section className="stores-section" aria-label="Stores list">
      <div className="stores-grid">
        {stores.map((s) => (
          <article key={s.id} className="store-card" role="article">
            <img
              src={s.image}
              alt={`${s.name} storefront`}
              className="store-image"
            />
            <div className="store-content">
              <h3 className="store-name">{s.name}</h3>
              <p className="store-note">{s.note}</p>
            </div>
          </article>
        ))}
      </div>

      <style>{`
        .stores-section { padding: 18px; max-width: 1200px; margin: 0 auto;}
        .stores-grid { display: grid; gap: 16px; grid-template-columns: repeat(3, 1fr); }
        .store-card {
          background: #dbeceaff;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 6px 18px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          transition: transform .12s ease, box-shadow .12s ease;
        }
        .store-card:hover { transform: translateY(-4px); box-shadow: 0 12px 30px rgba(0,0,0,0.12); }
        .store-image { width: 100%; height: 120px; object-fit: cover; display: block; }
        .store-content { padding: 12px 14px; display: flex; flex-direction: column; gap: 8px; }
        .store-name { margin: 0; font-size: 16px; font-weight: 600; color: #3e4040ff; }
        .store-note { margin: 0; color: #252323ff; font-size: 14px; }

        /* Responsive: 2 columns on medium, 1 column on small/mobile */
        @media (max-width: 900px) {
          .stores-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .stores-grid { grid-template-columns: 1fr; }
          .store-image { height: 200px; }
        }
      `}</style>
    </section>
  );
}
