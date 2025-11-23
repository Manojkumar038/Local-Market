import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";
import userProfileIcon from "../assets/userProfileIcon.svg";

export default function NavBar({
  showMenu = true, 
  menuItems = [], 
  showLinks = false,
  links = [], // 
  appName = "Local Market",
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  // close menu when clicking outside
  useEffect(() => {
    if (!showMenu) return;

    const handleOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showMenu]);

  return (
    <header className="nav">
      {/* Left - Brand */}
      <div className="nav-left">
        <Link to="/" className="brand">
          <img
            src={logo}
            alt="Logo"
            style={{ width: "50px", height: "50px" }}
          />
          <span className="app-name">{appName}</span>
        </Link>

        {/* Optional top-level navigation links */}
        {showLinks && (
          <nav className="nav-links">
            {links.map((l, i) => (
              <Link key={i} to={l.href} className="nav-link">
                {l.label}
              </Link>
            ))}
          </nav>
        )}
      </div>

      {/* Right - Menu (toggleable) */}
      {showMenu && (
        <div className="nav-right">
          <button
            ref={btnRef}
            className="avatar-btn"
            onClick={() => setOpen((v) => !v)}
          >
            <img
              src={userProfileIcon}
              style={{ width: "35px", height: "35px" }}
              alt="User Icon"
            />
          </button>

          {open && (
            <div ref={menuRef} className="menu">
              {menuItems.length > 0 ? (
                menuItems.map((item, index) =>
                  item.href ? (
                    <Link
                      key={index}
                      to={item.href}
                      className="menu-item"
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={index}
                      className="menu-item"
                      onClick={() => {
                        item.onClick?.();
                        setOpen(false);
                      }}
                    >
                      {item.label}
                    </button>
                  )
                )
              ) : (
                <div className="menu-item muted">No actions available</div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
