import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Wrapper component that protects admin routes from unauthorized access
export default function RequireAdmin({ children }) {
  const navigate = useNavigate();
  const { isLoggedIn, user, openAuthModal } = useAuth();

  // Redirect if user is not authenticated or lacks admin role
  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal("login");
      navigate("/", { replace: true });
      return;
    }

    if (user?.role !== "admin") {
      navigate("/", { replace: true });
    }
  }, [isLoggedIn, user, openAuthModal, navigate]);

  // Render nothing while redirecting
  if (!isLoggedIn || user?.role !== "admin") return null;

  return children;
}