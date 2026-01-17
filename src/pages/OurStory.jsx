import { useEffect, useMemo, useRef, useState } from "react";
import "./OurStory.css";
import Logo from "../assets/Kusina Logo.png";

import N1 from "../assets/story/n1.jpg";
import N3 from "../assets/story/n3.jpg";
import N4 from "../assets/story/n4.jpg";
import N5 from "../assets/story/n5.jpg";

// Hook to observe elements and trigger scroll-based reveal animation
function useRevealOnScroll(options = {}) {
  const refs = useRef([]);
  const [ready, setReady] = useState(false);

  const ioOptions = useMemo(
    () => ({
      root: null,
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12,
      ...options,
    }),
    [options],
  );

  useEffect(() => {
    setReady(true);

    // Observe elements and add class when they enter viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, ioOptions);

    refs.current.forEach((el) => el && observer.observe(el));

    return () => observer.disconnect();
  }, [ioOptions]);

  // Register element for observation
  const register = (el) => {
    if (!el) return;
    if (refs.current.includes(el)) return;
    refs.current.push(el);
  };

  return { register, ready };
}

// Story landing page with scroll-reveal sections
export default function OurStory() {
  const { register } = useRevealOnScroll();

  return (
    <div className="os-page">
      {/* Hero section with mission statement and brand card */}
      <header className="os-hero reveal" ref={register}>
        <div className="os-heroInner">
          <div className="os-heroLeft">
            <p className="os-kicker">Our Story</p>
            <h1 className="os-title">About Kusina</h1>
            <p className="os-lede">
              Kusina is for busy days and real cravings—when instant meals don't
              feel like enough. I'm building a calm space for recipes that feel
              familiar, doable, and worth repeating.
            </p>

            <div className="os-heroMeta">
              <div className="os-pill">Minimal</div>
              <div className="os-pill">Comfort food</div>
              <div className="os-pill">Beginner-friendly</div>
            </div>
          </div>

          <div className="os-heroRight">
            <div className="os-heroCard">
              <div className="os-heroCardTop">
                <img className="os-logo" src={Logo} alt="Kusina logo" />
                <div className="os-miniCopy">
                  <p className="os-miniKicker">A taste of home</p>
                  <p className="os-miniText">
                    Clean recipes, warm vibes, and a little joy in the kitchen.
                  </p>
                </div>
              </div>

              <div className="os-heroImgWrap">
                <img src={N1} alt="Cooking together at home" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* First story section: The idea and mission */}
      <section className="os-section reveal" ref={register}>
        <div className="os-grid os-gridA">
          <div className="os-imageCard">
            <img src={N5} alt="Hands preparing ingredients" />
          </div>

          <div className="os-copy">
            <p className="os-sectionKicker">The idea</p>
            <h2 className="os-h2">Why Kusina exists</h2>
            <p className="os-p">
              I wanted recipes that feel like a friend helping you cook—clear,
              comforting, and not overwhelming. Kusina is designed to feel calm,
              even when life is busy.
            </p>
            <p className="os-p">
              It's not about being perfect in the kitchen. It's about making
              home-cooking part of your lifestyle—one easy dish at a time.
            </p>

            <div className="os-quote revealUp" ref={register}>
              <p>
                "Food is comfort. Food is connection. And sometimes it's the
                smallest dish that brings you back to yourself."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Second story section: Design philosophy and features */}
      <section className="os-section reveal" ref={register}>
        <div className="os-grid os-gridB">
          <div className="os-copy">
            <p className="os-sectionKicker">The vibe</p>
            <h2 className="os-h2">Designed to feel warm and minimal</h2>
            <p className="os-p">
              I'm keeping the layout simple so you can focus on what
              matters—finding a recipe, saving it, and actually cooking it. No
              clutter. No noise.
            </p>

            <div className="os-featureRow">
              <div className="os-feature revealUp" ref={register}>
                <h3 className="os-h3">Simple search</h3>
                <p className="os-pSmall">
                  Find meals fast with clean filters and a calm layout.
                </p>
              </div>
              <div className="os-feature revealUp" ref={register}>
                <h3 className="os-h3">Save what you love</h3>
                <p className="os-pSmall">
                  Favorites + lists (for your user page later).
                </p>
              </div>
              <div className="os-feature revealUp" ref={register}>
                <h3 className="os-h3">Cook with confidence</h3>
                <p className="os-pSmall">
                  Approachable recipes for any skill level.
                </p>
              </div>
            </div>
          </div>

          <div className="os-imageCard os-imageCardTall">
            <img src={N4} alt="Cooking in a pan by the window" />
          </div>
        </div>
      </section>

      {/* Third story section: Core values and next steps */}
      <section className="os-section reveal" ref={register}>
        <div className="os-editorial">
          <div className="os-editorialTop">
            <div className="os-copy">
              <p className="os-sectionKicker">The heart</p>
              <h2 className="os-h2">Cooking is a shared language</h2>
              <p className="os-p">
                My favorite recipes are the ones you make more than once—because
                they become yours. Kusina is here to help you build that kind of
                recipe collection.
              </p>
            </div>
          </div>

          <div className="os-editorialImgs">
            <div className="os-imageCard os-imageCardWide">
              <img src={N3} alt="Kids cooking together at a table" />
            </div>

            <div className="os-miniStack">
              <div className="os-miniCard revealUp" ref={register}>
                <p className="os-miniCardKicker">Kusina goals</p>
                <ol className="os-miniList">
                  <ol>Make cooking feel doable</ol>
                  <ol>Keep things clean + calm</ol>
                  <ol>Highlight comfort + culture</ol>
                  <ol>Help you build meal routines</ol>
                </ol>
              </div>

              <div
                className="os-miniCard os-miniCardAccent revealUp"
                ref={register}
              >
                <p className="os-miniCardKicker">Start here</p>
                <p className="os-miniCardText">
                  Browse recipes, save your favorites, and build a meal plan
                  that fits your week.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
