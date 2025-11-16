import React from "react";
import { motion } from "framer-motion";

export default function MarketLoader() {
  const items = ["🧸", "🎁", "💻", "👕"];

  return (
    <div
      style={{
        position: "fixed", // override everything
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "white",
        zIndex: 9999999,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        margin: 0,
        padding: 0,
      }}
    >
      <div style={{ display: "flex", gap: "20px" }}>
        {items.map((emoji, index) => (
          <motion.div
            key={index}
            initial={{ x: -20 }}
            animate={{ x: 20 }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: 1,
              delay: index * 0.2,
            }}
            style={{ fontSize: "28px" }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      <div
        style={{
          marginTop: "20px",
          fontSize: "16px",
          color: "#555",
          fontWeight: 600,
        }}
      >
        Loading Please Wait...
      </div>
    </div>
  );
}
