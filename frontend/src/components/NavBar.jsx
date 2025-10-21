import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";
import userProfileIcon from "../assets/userProfileIcon.svg";

export default function NavBar({ links = [], menuItems = [] }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuRef.current || !btnRef.current) return;
      const clickedInsideMenu = menuRef.current.contains(e.target);
      const clickedButton = btnRef.current.contains(e.target);
      if (!clickedInsideMenu && !clickedButton) setOpen(false);
    };

    const onEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEscape);
    };
  }, []);

  return (
    <header className="nav" style={{ borderRadius: 12 }}>
      <div className="nav-left">
        <a href="/" className="brand" aria-label="Home">
          <img
            src={logo}
            style={{ width: "50px", height: "50px" }}
            alt=""
            className="avatar-img"
          />
          <span className="app-name">Local Market</span>
        </a>
      </div>

      <div className="nav-right">
        <button
          ref={btnRef}
          className="avatar-btn"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="Open profile menu"
        >
          <img
            src={userProfileIcon}
            style={{ width: "35px", height: "35px" }}
            alt=""
            className="avatar-img"
          />
        </button>

        {open && (
          <div
            ref={menuRef}
            className="menu"
            role="menu"
            aria-label="Profile menu"
          >
            {menuItems.map((item, index) =>
              item.href ? (
                <a
                  key={index}
                  href={item.href}
                  role="menuitem"
                  tabIndex={0}
                  className={`menu-item ${item.className || ""}`}
                >
                  {item.label}
                </a>
              ) : (
                <button
                  key={index}
                  onClick={item.onClick}
                  role="menuitem"
                  tabIndex={0}
                  className={`menu-item ${item.className || ""}`}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
        )}
      </div>
    </header>
  );
}
