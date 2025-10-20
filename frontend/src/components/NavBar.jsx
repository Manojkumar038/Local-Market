import { useEffect, useRef, useState } from "react";
import "../styles/navbar.css";
import logo from '../assets/logo.svg';
import userProfileIcon from '../assets/userProfileIcon.svg';


export default function NavBar() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const onClickOutside = (e) => {
      if (!menuRef.current) return;
      if (!btnRef.current) return;
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
            <a
              href="/profile"
              role="menuitem"
              tabIndex={0}
              className="menu-item"
            >
              Profile
            </a>
            <a
              href="/settings"
              role="menuitem"
              tabIndex={0}
              className="menu-item"
            >
              Settings
            </a>
            <button
              role="menuitem"
              tabIndex={0}
              className="menu-item danger"
              onClick={() => alert("Logout")}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
