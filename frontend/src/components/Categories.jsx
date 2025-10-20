// ...existing code...
import React from "react";

export const categories = [
  { key: "home", title: "Home", description: "Furniture & decor", icon: "🏡" },
  {
    key: "handmade",
    title: "Handmade",
    description: "Crafts & gifts",
    icon: "🧵",
  },
  {
    key: "fashion",
    title: "Fashion",
    description: "Clothing & accessories",
    icon: "👗",
  },
];

export default function Categories() {
  return (
    <div
      className="categories-wrapper"
      style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        padding: 12,
        flexWrap: "wrap",
       
        margin: "10px 2px",
        borderRadius: 12,
      }}
    >
      {categories.map((cat) => (
        <div
          key={cat.key}
          className="category-card"
          style={{
            width: "calc(23% - 8px)",
            height: 100,
            borderRadius: 8,
            border: "1px solid #eee",
            boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
            padding: 16,
            textAlign: "center",
            background: "#fff",
            cursor: "pointer",
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              /* placeholder for click behavior */
            }
          }}
          onClick={() => {
            /* placeholder for click behavior */
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 8 }} aria-hidden>
            {cat.icon}
          </div>
          <h3 style={{ margin: "1px 0", fontSize: 16 }}>{cat.title}</h3>
          <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
            {cat.description}
          </p>
        </div>
      ))}
    </div>
  );
}
// ...existing code...
