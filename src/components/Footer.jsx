import "./Footer.css";
import Logo from "../assets/Kusina Logo.png";
import { Link } from "react-router-dom";

import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* Logo and tagline section */}
        <div className="footer-top">
          <div className="footer-logo">
            <img src={Logo} alt="Kusina Logo" />
          </div>

          <p className="footer-quote">"A taste of home in every dish"</p>
        </div>

        {/* Navigation links */}
        <nav className="footer-nav" aria-label="Footer navigation">
          <Link to="/">Home</Link>
          <Link to="/RecipesPage">Recipes</Link>
          <Link to="/OurStory">Our Story</Link>
          <Link to="/AskUs">Ask Us</Link>
        </nav>

        <div className="footer-line" />

        {/* Copyright and social media links */}
        <div className="footer-bottom">
          <p className="footer-copy">© {year} Kusina. All rights reserved.</p>

          <div className="footer-socials" aria-label="Social links">
            <a href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
