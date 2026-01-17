import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import "./Hero.css";

import LeftSVG from "../assets/left.svg";
import RightSVG from "../assets/right.svg";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

// Detect when element enters viewport and trigger animation
function useScrollReveal() {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  return [ref, isVisible];
}

// Wrapper for fade-in and slide-up animation on scroll
function RevealSection({ children, delay = 0 }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

export default function Hero() {
  // Enable smooth page scrolling
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <main className="lp">
      {/* Hero section with brand intro and tagline */}
      <RevealSection>
        <section className="hero2">
          <img src={LeftSVG} alt="" className="hero2-svg left" />
          <img src={RightSVG} alt="" className="hero2-svg right" />

          <div className="hero2-inner">
            <motion.div
              className="hero2-topline"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="hero2-brand">KUSINA</p>
              <p className="hero2-mini">homey recipes • across cultures</p>
            </motion.div>

            <div className="hero2-frame">
              <div className="hero2-frameOverlay" />
              <motion.div
                className="hero2-frameContent"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <h1 className="hero2-title">A taste of home in every dish</h1>
                <p className="hero2-desc">
                  Skip the "what do I cook?" stress. Find cozy, real-food recipes
                  with clear steps, made for busy days and beginner kitchens.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
      </RevealSection>

      {/* Scrolling marquee ticker */}
      <div className="lp-ticker" aria-hidden="true">
        <div className="lp-tickerFade left" />
        <div className="lp-tickerFade right" />

        <div className="lp-tickerTrack">
          <span>COOK BETTER • EAT BETTER • </span>
          <span>WITH KUSINA'S EASY TO READ RECIPES • </span>
          <span>COOK BETTER • EAT BETTER • </span>
          <span>WITH KUSINA'S EASY TO READ RECIPES • </span>
          <span>COOK BETTER • EAT BETTER • </span>
        </div>
      </div>

      {/* Featured recipe highlight with image */}
      <RevealSection delay={0.1}>
        <section className="lp-featured">
          <div className="lp-featuredCard">
            <motion.div
              className="lp-featuredText"
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <p className="lp-kicker">Featured this week</p>
              <h2 className="lp-h2">Comfort food starter pack</h2>

              <div className="lp-rating" aria-label="Rating">
                <span className="lp-stars" aria-hidden="true">
                  ★★★★★
                </span>
                <span className="lp-ratingText">
                  Quick, cozy, beginner-approved
                </span>
              </div>

              <p className="lp-p">
                Discover recipes from around the world with simple
                ingredients, clear steps, and a save button so you never lose your
                favorites.
              </p>

              <div className="lp-chipRow">
                <span className="lp-chip">Beginner</span>
                <span className="lp-chip">Homey</span>
                <span className="lp-chip">Global</span>
              </div>

              <div className="lp-actions">
                <Link to="/recipespage" className="hero2-link">
                  <button className="hero2-btn small">Find a recipe</button>
                </Link>
                <Link to="/user" className="hero2-link">
                  <button className="hero2-btn ghost small">View saved</button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="lp-featuredVisual"
              aria-label="Featured visual"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <img
                className="lp-featuredImg"
                src="public/featured.jpg"
                alt="Featured recipe"
              />
            </motion.div>
          </div>
        </section>
      </RevealSection>

      {/* Brand promise section with dark background */}
      <RevealSection delay={0.2}>
        <section className="lp-poster">
          <div className="lp-posterInner">
            <motion.p
              className="lp-posterTags"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <span>COMFORT</span>
              <span>•</span>
              <span>QUICK</span>
              <span>•</span>
              <span>HOME</span>
            </motion.p>

            <motion.h2
              className="lp-posterTitle"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              "<span>Some things aren't enjoyable when rushed,</span>
              <br />
              <span>but cooking shouldn't be one of it.</span>"
            </motion.h2>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/recipespage" className="lp-posterBtn">
                Start cooking →
              </Link>
            </motion.div>
          </div>
        </section>
      </RevealSection>

      {/* Three-step process walkthrough */}
      <RevealSection delay={0.1}>
        <section className="lp-steps2">
          <motion.div
            className="lp-head2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="lp-kicker center">How it works</p>
            <h2 className="lp-h2 center">Cook. Save. Repeat.</h2>
          </motion.div>

          <div className="lp-stepGrid2">
            {[1, 2, 3].map((step) => (
              <motion.div
                key={step}
                className="lp-stepCard2"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: step * 0.1 }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="lp-stepPhoto">
                  <img
                    src={`public/step${step}.jpg`}
                    alt={`Step ${step}`}
                    className="lp-stepImg"
                  />
                  <span className="lp-stepBadge">STEP {step}</span>
                </div>
                <div className="lp-stepBody">
                  <h3>
                    {step === 1 && "Pick a dish"}
                    {step === 2 && "Follow the steps"}
                    {step === 3 && "Save your favorites"}
                  </h3>
                  <p>
                    {step === 1 && "Search your craving or browse categories."}
                    {step === 2 && "Clear instructions + video link when available."}
                    {step === 3 && "Favorites + Saved List in your My Account."}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* Primary call-to-action with large typography */}
      <RevealSection delay={0.2}>
        <section className="lp-bigType">
          <div className="lp-bigTypeInner">
            <motion.p
              className="lp-kicker center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              Kusina moment
            </motion.p>
            <motion.h2
              className="lp-bigWord"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              viewport={{ once: true }}
            >
              COOK TODAY
            </motion.h2>
            <motion.p
              className="lp-p center lp-bigSub"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Your next comfort meal is one search away.
            </motion.p>

            <motion.div
              className="lp-actions centerRow"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Link to="/recipespage" className="hero2-link">
                <button className="hero2-btn">Browse recipes</button>
              </Link>
              <Link to="/askus" className="hero2-link">
                <button className="hero2-btn ghost">Request a recipe</button>
              </Link>
            </motion.div>
          </div>
        </section>
      </RevealSection>

      {/* Closing marquee ticker */}
      <div className="lp-ticker2" aria-hidden="true">
        <div className="lp-tickerFade left" />
        <div className="lp-tickerFade right" />

        <div className="lp-tickerTrack">
          <span> ★ KUSINA, YOUR VERY OWN RECIPE BOOK ★ </span>
          <span> KUSINA, YOUR VERY OWN RECIPE BOOK ★ </span>
          <span> KUSINA, YOUR VERY OWN RECIPE BOOK ★ </span>
        </div>
      </div>
    </main>
  );
}