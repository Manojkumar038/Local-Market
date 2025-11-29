import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/navbar.css";
import logo from "../assets/logo.svg";
import userProfileIcon from "../assets/userProfileIcon.svg";

export default function NavBar({
  showMenu = true,
  menuItems = [],
  showLinks = false,
  links = [],
  appName = "ShopHub",
  showSearch = false,
  searchValue = "",
  onSearchChange,
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();
  const btnRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (
        !menuRef.current?.contains(e.target) &&
        !btnRef.current?.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="nav">
      <div className="nav-left">
        <Link className="brand" to="/">
          <img src={logo} alt="logo" />
          <span className="app-name">{appName}</span>
        </Link>
      </div>

      {showSearch && (
        <div className="nav-search">
          <input
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search for products, stores..."
          />
        </div>
      )}

      {showMenu && (
        <div className="nav-right">
          <button
            ref={btnRef}
            className="avatar-btn"
            onClick={() => setOpen(!open)}
          >
            <img src={userProfileIcon} alt="user" />
          </button>

          {open && (
            <div ref={menuRef} className="menu">
              {menuItems.map((item, i) =>
                item.href ? (
                  <Link key={i} to={item.href} className="menu-item">
                    {item.label}
                  </Link>
                ) : (
                  <button key={i} className="menu-item" onClick={item.onClick}>
                    {item.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
