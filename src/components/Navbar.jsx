import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import Logo from "../assets/Kusina Logo.png";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const { isLoggedIn, user, openAuthModal, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Close mobile menu on screen resize above tablet size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close user dropdown when clicking outside
  useEffect(() => {
    const onDoc = () => {
      if (!userMenuOpen) return;
      setUserMenuOpen(false);
    };
    document.addEventListener("click", onDoc);
    return () => document.removeEventListener("click", onDoc);
  }, [userMenuOpen]);

  const username = user?.username || "User";
  const isAdmin = user?.role === "admin";

  return (
    <nav className="navbar">
      <div className="logo">
        <Link to="/" aria-label="Go to home">
          <img src={Logo} alt="Kusina Logo" />
        </Link>
      </div>

      {/* Desktop navigation links */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/RecipesPage">Recipes</Link>
        <Link to="/OurStory">Our Story</Link>
        <Link to="/AskUs">Ask Us</Link>

        {/* Auth button or user menu */}
        {!isLoggedIn ? (
          <button
            className="signup-btn"
            type="button"
            onClick={() => openAuthModal("login")}
          >
            Sign Up / Login
          </button>
        ) : (
          <div
            style={{ position: "relative", display: "inline-flex" }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="signup-btn"
              type="button"
              onClick={() => setUserMenuOpen((v) => !v)}
              aria-haspopup="menu"
              aria-expanded={userMenuOpen}
              title={username}
              style={{ gap: "8px" }}
            >
              <span aria-hidden="true" style={{ display: "inline-flex" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 21a8 8 0 10-16 0"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M12 11a4 4 0 100-8 4 4 0 000 8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span>{username}</span>
            </button>

            {/* User dropdown menu */}
            {userMenuOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 10px)",
                  background: "var(--background)",
                  border: "2px solid var(--primary)",
                  borderRadius: "14px",
                  padding: "10px",
                  minWidth: "180px",
                  boxShadow: "0 14px 34px rgba(19, 34, 165, 0.18)",
                  zIndex: 50,
                  display: "grid",
                  gap: "10px",
                }}
              >
                <Link
                  to="/user"
                  style={{
                    width: "85%",
                    border: "2px solid var(--primary)",
                    background: "var(--background)",
                    color: "var(--primary)",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontFamily: "var(--body-font)",
                    fontWeight: 900,
                    fontSize: "14px",
                    textDecoration: "none",
                    textAlign: "center",
                  }}
                >
                  My Account
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    style={{
                      width: "85%",
                      border: "2px solid var(--primary)",
                      background: "var(--background)",
                      color: "var(--primary)",
                      borderRadius: "12px",
                      padding: "10px 12px",
                      cursor: "pointer",
                      fontFamily: "var(--body-font)",
                      fontWeight: 900,
                      fontSize: "14px",
                      textDecoration: "none",
                      textAlign: "center",
                    }}
                  >
                    Admin Panel
                  </Link>
                )}

                <button
                  type="button"
                  onClick={logout}
                  style={{
                    width: "100%",
                    border: "2px solid var(--primary)",
                    background: "var(--background)",
                    color: "var(--primary)",
                    borderRadius: "12px",
                    padding: "10px 12px",
                    cursor: "pointer",
                    fontFamily: "var(--body-font)",
                    fontSize: "14px",
                    fontWeight: 900,
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile hamburger button */}
      <button
        className={`hamburger ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label="Menu"
        aria-expanded={menuOpen}
        type="button"
      >
        <span />
        <span />
        <span />
      </button>

      {/* Mobile menu backdrop overlay */}
      <div
        className={`menu-backdrop ${menuOpen ? "active" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile side menu */}
      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <Link to="/" onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link to="/RecipesPage" onClick={() => setMenuOpen(false)}>
          Recipes
        </Link>
        <Link to="/OurStory" onClick={() => setMenuOpen(false)}>
          Our Stories
        </Link>
        <Link to="/AskUs" onClick={() => setMenuOpen(false)}>
          Ask Us
        </Link>

        {!isLoggedIn ? (
          <button
            className="signup-btn"
            type="button"
            onClick={() => openAuthModal("login")}
          >
            Sign Up / Login
          </button>
        ) : (
          <>
            <Link to="/user" onClick={() => setMenuOpen(false)}>
              My Account
            </Link>

            {isAdmin && (
              <Link to="/admin" onClick={() => setMenuOpen(false)}>
                Admin Panel
              </Link>
            )}

            <button className="signup-btn" type="button" onClick={logout}>
              Logout ({username})
            </button>
          </>
        )}
      </div>
    </nav>
  );
}