import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "kusina_token";
const USER_KEY = "kusina_user";

// Safely retrieve user from localStorage
function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || "null");
  } catch {
    return null;
  }
}

// Retrieve JWT token from localStorage
function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

// Auth provider managing user session, modal state, and API calls
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(getStoredToken);

  // Authentication modal state
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");

  const isLoggedIn = !!token && !!user;
  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const openAuthModal = (mode = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const closeAuthModal = () => setAuthOpen(false);

  // Clear user session and remove stored credentials
  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  // Save token and user to state and localStorage
  const saveSession = (nextToken, nextUser) => {
    setToken(nextToken);
    setUser(nextUser);
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
  };

  // Register new user account
  const signup = async ({ username, email, password }) => {
    const res = await fetch(`${apiBase}/api/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Signup failed");

    saveSession(data.token, data.user);
    closeAuthModal();
    return data;
  };

  // Authenticate existing user
  const login = async ({ email, password }) => {
    const res = await fetch(`${apiBase}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.message || "Login failed");

    saveSession(data.token, data.user);
    closeAuthModal();
    return data;
  };

  // Sync token changes to localStorage
  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  }, [token]);

  // Sync user changes to localStorage
  useEffect(() => {
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
    else localStorage.removeItem(USER_KEY);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn,
      apiBase,
      authOpen,
      authMode,
      openAuthModal,
      closeAuthModal,
      login,
      signup,
      logout,
      setAuthMode,
    }),
    [user, token, isLoggedIn, apiBase, authOpen, authMode]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access auth context
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}