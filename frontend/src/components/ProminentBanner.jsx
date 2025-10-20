// ...existing code...
import React from "react";

export default function Banner({
  title = "Local Market",
  subtitle = "Discover handmade, fashion & home goods near you",
  ctaText = "Shop Local",
  onCta = () => {},
  backgroundImage = "",
  height = 320,
}) {
  const bgStyle = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : { background: "linear-gradient(135deg,#72bbb1ff 0%, #95e6e5ff 100%)" };

  return (
    <section
      className="local-banner"
      style={{ position: "relative", width: "100%", overflow: "hidden" }}
      aria-label="Local Market banner"
    >
      <div
        className="local-banner__bg"
        style={{
          height,
          ...bgStyle,
        }}
        aria-hidden
      />
      <div
        className="local-banner__overlay"
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <div
          className="local-banner__card"
          style={{
            maxWidth: 1100,
            width: "100%",
            display: "flex",
            gap: 20,
            alignItems: "center",
            justifyContent: "space-between",
            background: "rgba(255,255,255,0.9)",
            borderRadius: 12,
            padding: "18px 22px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            backdropFilter: "saturate(120%) blur(6px)",
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                margin: 0,
                fontSize: 28,
                lineHeight: 1.05,
                color: "#163534",
                fontWeight: 700,
                overflowWrap: "break-word",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "8px 0 0",
                color: "#3b3b3b",
                fontSize: 15,
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={onCta}
              aria-label={ctaText}
              style={{
                padding: "10px 18px",
                borderRadius: 10,
                border: "none",
                background: "#0b5fff",
                color: "#fff",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 6px 18px rgba(11,95,255,0.18)",
              }}
            >
              {ctaText}
            </button>
            <button
              type="button"
              onClick={() =>
                window.scrollBy({ top: height, behavior: "smooth" })
              }
              title="Learn more"
              style={{
                padding: "8px 12px",
                borderRadius: 10,
                border: "1px solid rgba(0,0,0,0.06)",
                background: "#fff",
                cursor: "pointer",
              }}
            >
              Learn more
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .local-banner__card h1 { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        @media (max-width: 720px) {
          .local-banner__card {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
            padding: 14px;
          }
          .local-banner__card h1 { font-size: 20px; }
          .local-banner__card p { font-size: 13px; }
          .local-banner__card > div:last-child { justify-content: flex-start; gap: 8px; }
        }
      `}</style>
    </section>
  );
}

