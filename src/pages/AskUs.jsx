import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./AskUs.css";

// Page with FAQ, recipe requests, and contact forms
export default function AskUs() {
  // FAQ data with questions and answers
  const faqs = useMemo(
    () => [
      {
        q: "How do I request a recipe?",
        a: "Fill out the request form below with the recipe name and category. Add extra details if you want it to be closer to what you're craving.",
      },
      {
        q: "Do you add every request?",
        a: "I try to! Requests are reviewed and prioritized based on popularity, feasibility, and how well they fit Kusina's vibe (simple, homey, doable).",
      },
      {
        q: "Can I request a recipe from any culture?",
        a: "Yes — absolutely. Kusina is all about comfort food across cultures. Share the dish name and any special notes you'd like included.",
      },
      {
        q: "How long does it take to add a recipe?",
        a: "It depends on testing and formatting, but popular requests are usually faster. You can also leave your email so I can update you.",
      },
    ],
    [],
  );

  const [openIndex, setOpenIndex] = useState(0);

  // Recipe request form state
  const [requestForm, setRequestForm] = useState({
    recipe: "",
    category: "",
    details: "",
    email: "",
  });

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // Success modal state with auto-close timer
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: "", message: "" });
  const [modalTimer, setModalTimer] = useState(null);

  // Open modal with auto-close after 2 seconds
  const openModal = ({ title, message }) => {
    if (modalTimer) clearTimeout(modalTimer);

    setModalData({ title, message });
    setModalOpen(true);

    const t = setTimeout(() => {
      setModalOpen(false);
    }, 2000);

    setModalTimer(t);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (modalTimer) clearTimeout(modalTimer);
    };
  }, [modalTimer]);

  // Observe elements and trigger scroll animation when they enter viewport
  useEffect(() => {
    const elements = document.querySelectorAll(".scroll-animate");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("show");
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Submit recipe request form
  const submitRequest = (e) => {
    e.preventDefault();

    openModal({
      title: "Recipe request sent!",
      message:
        "Thanks for sharing what you're craving! I'll review this request and add it to the Kusina queue.",
    });

    setRequestForm({ recipe: "", category: "", details: "", email: "" });
  };

  // Submit contact form
  const submitContact = (e) => {
    e.preventDefault();

    openModal({
      title: "Message sent!",
      message:
        "Thank you for reaching out! We usually respond within 1-2 business days.",
    });

    setContactForm({ name: "", email: "", message: "" });
  };

  // Animation variants for FAQ items
  const faqItemVariants = {
    collapsed: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const contentVariants = {
    collapsed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.35, ease: "easeInOut" },
    },
  };

  const iconVariants = {
    collapsed: { rotate: 0 },
    open: { rotate: 180, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  return (
    <div className="ask-page">
      {/* Success modal with auto-close */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            className="k-modalOverlay"
            role="status"
            aria-live="polite"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="k-modal"
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              <div className="k-modalIcon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <h3 className="k-modalTitle">{modalData.title}</h3>
              <p className="k-modalText">{modalData.message}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAQ section with expandable items */}
      <section className="faq-wrap scroll-animate">
        <div className="faq-left">
          <p className="ask-kicker">Need help?</p>
          <h1 className="ask-title">Frequently asked questions</h1>
          <p className="ask-subtitle">
            Quick answers to common questions. If you're still unsure, scroll
            down and send me a request or message.
          </p>
        </div>

        <div className="faq-right">
          {faqs.map((item, idx) => {
            const isOpen = idx === openIndex;

            return (
              <motion.button
                key={item.q}
                className={`faq-item ${isOpen ? "open" : ""}`}
                type="button"
                onClick={() =>
                  setOpenIndex((prev) => (prev === idx ? -1 : idx))
                }
                variants={faqItemVariants}
                initial="collapsed"
                animate="visible"
                transition={{ delay: idx * 0.05 }}
              >
                <div className="faq-head">
                  <span className="faq-q">{item.q}</span>

                  <motion.span
                    className={`faq-icon ${isOpen ? "rot" : ""}`}
                    variants={iconVariants}
                    animate={isOpen ? "open" : "collapsed"}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.span>
                </div>

                {/* Smooth expand/collapse animation */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-body show"
                      variants={contentVariants}
                      initial="collapsed"
                      animate="open"
                      exit="collapsed"
                    >
                      <div className="faq-bodyInner">
                        <p>{item.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </section>

      {/* Recipe request and contact forms side-by-side */}
      <section className="forms-wrap scroll-animate scroll-delay-1">
        <div className="forms-inner">
          {/* Recipe request form */}
          <motion.div
            className="form-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <p className="ask-kicker">Requests</p>
            <h2 className="ask-h2">Request a recipe</h2>
            <p className="ask-mini">
              Tell me what you're craving and I'll add it to the Kusina queue.
            </p>

            <form className="ask-form" onSubmit={submitRequest}>
              <label className="field">
                <span>Recipe you want</span>
                <motion.input
                  type="text"
                  placeholder="e.g., Chicken Adobo, Kunafa, Ramen..."
                  value={requestForm.recipe}
                  onChange={(e) =>
                    setRequestForm((p) => ({ ...p, recipe: e.target.value }))
                  }
                  whileFocus={{
                    boxShadow: "0 10px 22px rgba(19, 34, 165, 0.12)",
                  }}
                  transition={{ duration: 0.2 }}
                  required
                />
              </label>

              <label className="field">
                <span>Category</span>
                <motion.select
                  value={requestForm.category}
                  onChange={(e) =>
                    setRequestForm((p) => ({ ...p, category: e.target.value }))
                  }
                  whileFocus={{
                    boxShadow: "0 10px 22px rgba(19, 34, 165, 0.12)",
                  }}
                  transition={{ duration: 0.2 }}
                  required
                >
                  <option value="">Choose a category</option>
                  <option value="Main">Main</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Seafood">Seafood</option>
                  <option value="Soup">Soup</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Snack">Snack</option>
                  <option value="Other">Other</option>
                </motion.select>
              </label>

              <label className="field">
                <span>Details (optional)</span>
                <motion.textarea
                  placeholder="Any notes? (spicy level, substitutions, dietary needs, etc.)"
                  value={requestForm.details}
                  onChange={(e) =>
                    setRequestForm((p) => ({ ...p, details: e.target.value }))
                  }
                  whileFocus={{
                    boxShadow: "0 10px 22px rgba(19, 34, 165, 0.12)",
                  }}
                  transition={{ duration: 0.2 }}
                />
              </label>

              <motion.button
                className="ask-btn"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Send request
              </motion.button>
            </form>
          </motion.div>

          {/* Contact form */}
          <motion.div
            className="form-card accent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <p className="ask-kicker">Contact</p>
            <h2 className="ask-h2">Contact us</h2>
            <p className="ask-mini">
              Questions, feedback, or collabs — send a message anytime.
            </p>

            <form className="ask-form" onSubmit={submitContact}>
              <div className="two-col">
                <label className="field">
                  <span>Name</span>
                  <motion.input
                    type="text"
                    placeholder="Your name"
                    value={contactForm.name}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, name: e.target.value }))
                    }
                    whileFocus={{
                      boxShadow: "0 10px 22px rgba(19, 34, 165, 0.12)",
                    }}
                    transition={{ duration: 0.2 }}
                    required
                  />
                </label>

                <label className="field">
                  <span>Email</span>
                  <motion.input
                    type="email"
                    placeholder="Your email"
                    value={contactForm.email}
                    onChange={(e) =>
                      setContactForm((p) => ({ ...p, email: e.target.value }))
                    }
                    whileFocus={{
                      boxShadow: "0 10px 22px rgba(19, 34, 165, 0.12)",
                    }}
                    transition={{ duration: 0.2 }}
                    required
                  />
                </label>
              </div>

              <label className="field">
                <span>Message</span>
                <motion.textarea
                  placeholder="Write your message here..."
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((p) => ({ ...p, message: e.target.value }))
                  }
                  whileFocus={{
                    boxShadow: "0 10px 22px rgba(19, 34, 165, 0.12)",
                  }}
                  transition={{ duration: 0.2 }}
                  required
                />
              </label>

              <motion.button
                className="ask-btn ghost"
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                Send message
              </motion.button>

              <div className="contact-note">
                <p>We usually respond within 1-2 business days.</p>
              </div>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
