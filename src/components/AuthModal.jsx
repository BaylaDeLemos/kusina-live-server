// src/components/AuthModal.jsx
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

export default function AuthModal() {
  const { authOpen, authMode, setAuthMode, closeAuthModal, login, signup } =
    useAuth();

  // Track local open state for window event listeners
  const [localOpen, setLocalOpen] = useState(false);

  const isOpen = authOpen || localOpen;

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [signupForm, setSignupForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  // Dynamic title based on auth mode
  const title = useMemo(
    () => (authMode === "login" ? "Welcome back" : "Create your account"),
    [authMode],
  );

  // Listen for custom auth modal event from RecipesPage
  useEffect(() => {
    const handler = (e) => {
      const mode = e?.detail?.mode || "login";
      setAuthMode(mode);
      setLocalOpen(true);
    };

    window.addEventListener("kusina:open-auth-modal", handler);
    return () => window.removeEventListener("kusina:open-auth-modal", handler);
  }, [setAuthMode]);

  // Close modal and clear errors
  const closeAll = () => {
    closeAuthModal?.();
    setLocalOpen(false);
    setErr("");
  };

  // Close modal on ESC key
  useEffect(() => {
    if (!isOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Prevent background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  // Clear errors when modal opens or auth mode changes
  useEffect(() => {
    if (!isOpen) return;
    setErr("");
  }, [isOpen, authMode]);

  if (!isOpen) return null;

  // Handle login form submission
  const submitLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await login(loginForm);
      setLoginForm({ email: "", password: "" });
      closeAll();
    } catch (error) {
      setErr(error?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  };

  // Handle signup form submission
  const submitSignup = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await signup(signupForm);
      setSignupForm({ username: "", email: "", password: "" });
      closeAll();
    } catch (error) {
      setErr(error?.message || "Signup failed");
    } finally {
      setBusy(false);
    }
  };

  // Framer Motion animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.96, y: 8 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
    exit: {
      opacity: 0,
      scale: 0.96,
      y: 8,
      transition: { duration: 0.2, ease: "easeIn" },
    },
  };

  const formVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="authModal-backdrop"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.2 }}
          onMouseDown={closeAll}
        >
          <motion.div
            className="authModal"
            role="dialog"
            aria-modal="true"
            aria-label="Authentication"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <motion.div
              className="authModal-top"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <div>
                <p className="authModal-kicker">Kusina</p>
                <motion.h2
                  className="authModal-title"
                  key={authMode}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {title}
                </motion.h2>
              </div>

              <motion.button
                className="authModal-close"
                type="button"
                onClick={closeAll}
                aria-label="Close"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                ✕
              </motion.button>
            </motion.div>

            <motion.div
              className="authModal-tabs"
              variants={itemVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.button
                className={`authModal-tab ${authMode === "login" ? "active" : ""}`}
                type="button"
                onClick={() => setAuthMode("login")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Login
              </motion.button>
              <motion.button
                className={`authModal-tab ${authMode === "signup" ? "active" : ""}`}
                type="button"
                onClick={() => setAuthMode("signup")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                Sign up
              </motion.button>
            </motion.div>

            <AnimatePresence mode="wait">
              {err && (
                <motion.p
                  className="authModal-error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {err}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {authMode === "login" ? (
                <motion.form
                  className="authModal-form"
                  onSubmit={submitLogin}
                  key="login"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.label
                    className="authModal-field"
                    variants={itemVariants}
                  >
                    <span>Email</span>
                    <motion.input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) =>
                        setLoginForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      whileFocus={{
                        boxShadow: "0 10px 22px rgba(19, 34, 165, 0.10)",
                      }}
                      transition={{ duration: 0.2 }}
                      required
                    />
                  </motion.label>

                  <motion.label
                    className="authModal-field"
                    variants={itemVariants}
                  >
                    <span>Password</span>
                    <motion.input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) =>
                        setLoginForm((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      placeholder="••••••••"
                      whileFocus={{
                        boxShadow: "0 10px 22px rgba(19, 34, 165, 0.10)",
                      }}
                      transition={{ duration: 0.2 }}
                      required
                    />
                  </motion.label>

                  <motion.button
                    className="authModal-btn"
                    type="submit"
                    disabled={busy}
                    variants={itemVariants}
                    whileHover={{ scale: busy ? 1 : 1.02 }}
                    whileTap={{ scale: busy ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {busy ? "Logging in..." : "Login"}
                  </motion.button>

                  <motion.p
                    className="authModal-switch"
                    variants={itemVariants}
                  >
                    Don't have an account?{" "}
                    <motion.button
                      type="button"
                      className="authModal-linkBtn"
                      onClick={() => setAuthMode("signup")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Sign up
                    </motion.button>
                  </motion.p>
                </motion.form>
              ) : (
                <motion.form
                  className="authModal-form"
                  onSubmit={submitSignup}
                  key="signup"
                  variants={formVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                >
                  <motion.label
                    className="authModal-field"
                    variants={itemVariants}
                  >
                    <span>Username</span>
                    <motion.input
                      type="text"
                      value={signupForm.username}
                      onChange={(e) =>
                        setSignupForm((p) => ({
                          ...p,
                          username: e.target.value,
                        }))
                      }
                      placeholder="bayla"
                      whileFocus={{
                        boxShadow: "0 10px 22px rgba(19, 34, 165, 0.10)",
                      }}
                      transition={{ duration: 0.2 }}
                      required
                    />
                  </motion.label>

                  <motion.label
                    className="authModal-field"
                    variants={itemVariants}
                  >
                    <span>Email</span>
                    <motion.input
                      type="email"
                      value={signupForm.email}
                      onChange={(e) =>
                        setSignupForm((p) => ({ ...p, email: e.target.value }))
                      }
                      placeholder="you@example.com"
                      whileFocus={{
                        boxShadow: "0 10px 22px rgba(19, 34, 165, 0.10)",
                      }}
                      transition={{ duration: 0.2 }}
                      required
                    />
                  </motion.label>

                  <motion.label
                    className="authModal-field"
                    variants={itemVariants}
                  >
                    <span>Password</span>
                    <motion.input
                      type="password"
                      value={signupForm.password}
                      onChange={(e) =>
                        setSignupForm((p) => ({
                          ...p,
                          password: e.target.value,
                        }))
                      }
                      placeholder="Create a password"
                      whileFocus={{
                        boxShadow: "0 10px 22px rgba(19, 34, 165, 0.10)",
                      }}
                      transition={{ duration: 0.2 }}
                      required
                      minLength={6}
                    />
                  </motion.label>

                  <motion.button
                    className="authModal-btn"
                    type="submit"
                    disabled={busy}
                    variants={itemVariants}
                    whileHover={{ scale: busy ? 1 : 1.02 }}
                    whileTap={{ scale: busy ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                  >
                    {busy ? "Creating account..." : "Create account"}
                  </motion.button>

                  <motion.p
                    className="authModal-switch"
                    variants={itemVariants}
                  >
                    Already have an account?{" "}
                    <motion.button
                      type="button"
                      className="authModal-linkBtn"
                      onClick={() => setAuthMode("login")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      Login
                    </motion.button>
                  </motion.p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
