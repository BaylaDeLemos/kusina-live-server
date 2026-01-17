import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./RecipesPage.css";
import RequestRecipe from "../components/RequestRecipe";
import { useAuth } from "../context/AuthContext";

const PAGE_SIZE = 12;

// Recipes browsing page with search, filters, and pagination
export default function RecipesPage() {
  const { isLoggedIn, token, apiBase, openAuthModal } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const requestIdRef = useRef(0);

  // Track user's favorites and saved list from MongoDB
  const [favorites, setFavorites] = useState([]);
  const [userList, setUserList] = useState([]);

  const filters = useMemo(
    () => [
      "All",
      "Beef",
      "Chicken",
      "Dessert",
      "Lamb",
      "Appetizer",
      "Pasta",
      "Seafood",
    ],
    []
  );

  // Prompt login if user tries to favorite/save while not logged in
  const requireLogin = (mode = "login") => openAuthModal(mode);

  // Create auth headers for API calls
  const authHeaders = useMemo(() => {
    if (!token) return { "Content-Type": "application/json" };
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  // Fetch user's favorites and saved list from backend
  useEffect(() => {
    let cancelled = false;

    async function loadMe() {
      if (!isLoggedIn || !token) {
        setFavorites([]);
        setUserList([]);
        return;
      }

      try {
        const res = await fetch(`${apiBase}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load profile");

        if (cancelled) return;

        setFavorites(data?.user?.favorites || []);
        setUserList(data?.user?.savedList || []);
      } catch {
        if (cancelled) return;
        setFavorites([]);
        setUserList([]);
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, token, apiBase]);

  const isFavorite = (idMeal) => favorites.includes(idMeal);
  const isInList = (idMeal) => userList.includes(idMeal);

  // Toggle meal as favorite
  const toggleFavorite = async (idMeal) => {
    if (!isLoggedIn) {
      requireLogin("login");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/user/favorites/toggle`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mealId: idMeal }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update favorites");

      setFavorites(data.favorites || []);
    } catch {
      // Non-blocking error
    }
  };

  // Toggle meal in saved list
  const toggleList = async (idMeal) => {
    if (!isLoggedIn) {
      requireLogin("login");
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/user/list/toggle`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ mealId: idMeal }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update list");

      setUserList(data.savedList || []);
    } catch {
      // Non-blocking error
    }
  };

  // Helper to fetch and parse JSON
  const fetchJson = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  // Remove duplicate meals by ID
  const dedupeById = (arr) => {
    const map = new Map();
    arr.forEach((m) => map.set(m.idMeal, m));
    return [...map.values()];
  };

  // Load all meals by fetching each letter (a-z) from MealDB
  const loadAllMeals = async () => {
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError("");

    try {
      const letters = "abcdefghijklmnopqrstuvwxyz".split("");

      const results = await Promise.all(
        letters.map(async (ch) => {
          const data = await fetchJson(
            `https://www.themealdb.com/api/json/v1/1/search.php?f=${ch}`
          );
          return data.meals || [];
        })
      );

      if (reqId !== requestIdRef.current) return;

      const merged = dedupeById(results.flat());
      setRecipes(merged);
      setPage(1);
    } catch {
      setError("Couldn't load recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load recipes by category filter
  const loadByFilter = async (filterName) => {
    const reqId = ++requestIdRef.current;
    setLoading(true);
    setError("");

    try {
      if (filterName === "All") {
        await loadAllMeals();
        return;
      }

      const mealDbCategory =
        filterName === "Appetizer" ? "Starter" : filterName;

      const data = await fetchJson(
        `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(
          mealDbCategory
        )}`
      );

      if (reqId !== requestIdRef.current) return;

      setRecipes(data.meals || []);
      setPage(1);
    } catch {
      setError("Couldn't load recipes. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Search by recipe name within current filter
  const handleSearch = async (termOverride) => {
    const reqId = ++requestIdRef.current;
    const term = (termOverride ?? search).trim();

    setLoading(true);
    setError("");

    try {
      if (!term) {
        await loadByFilter(activeFilter);
        return;
      }

      const data = await fetchJson(
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          term
        )}`
      );

      if (reqId !== requestIdRef.current) return;

      const found = data.meals || [];

      if (activeFilter === "All") {
        setRecipes(found);
      } else {
        const mealDbCategory =
          activeFilter === "Appetizer" ? "Starter" : activeFilter;
        setRecipes(found.filter((m) => m.strCategory === mealDbCategory));
      }

      setPage(1);
    } catch {
      setError("Search failed. Please try again.");
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  // Load all recipes on mount
  useEffect(() => {
    loadAllMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search as user types
  useEffect(() => {
    const t = setTimeout(() => {
      handleSearch(search);
    }, 450);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeFilter]);

  const onFilterClick = async (filterName) => {
    setActiveFilter(filterName);
    setSearch("");
    await loadByFilter(filterName);
  };

  const totalPages = Math.max(1, Math.ceil(recipes.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const start = (safePage - 1) * PAGE_SIZE;
  const paginated = recipes.slice(start, start + PAGE_SIZE);

  const goToPage = (p) => {
    const next = Math.max(1, Math.min(p, totalPages));
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate pagination button numbers with ellipsis
  const pageButtons = (() => {
    const maxButtons = 7;
    if (totalPages <= maxButtons)
      return Array.from({ length: totalPages }, (_, i) => i + 1);

    const half = Math.floor(maxButtons / 2);
    let startPage = safePage - half;
    let endPage = safePage + half;

    if (startPage < 1) {
      startPage = 1;
      endPage = maxButtons;
    }
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxButtons + 1;
    }

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
  })();

  // Framer Motion animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  const filterVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  return (
    <div className="recipes2-page">
      {/* Page header with search and filters */}
      <motion.div
        className="recipes2-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="recipes2-title">Recipes</h1>

        <p className="recipes2-subtitle">
          Browse the different kinds of delicious recipes from around the world.
          Find your next favorite dish!
        </p>

        {/* Search input with debounce */}
        <motion.div
          className="recipes2-search"
          whileHover={{ boxShadow: "0 8px 24px rgba(19, 34, 165, 0.15)" }}
          transition={{ duration: 0.3 }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search for recipes..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
          />
          <button onClick={() => handleSearch()} aria-label="Search" type="button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="white" strokeWidth="2" />
              <line
                x1="16.65"
                y1="16.65"
                x2="21"
                y2="21"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </motion.div>

        {/* Category filter buttons with staggered animation */}
        <motion.div
          className="recipes2-filters"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filters.map((f) => (
            <motion.button
              key={f}
              className={`recipes2-pill ${activeFilter === f ? "active" : ""}`}
              onClick={() => onFilterClick(f)}
              type="button"
              variants={filterVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              {f}
            </motion.button>
          ))}
        </motion.div>
      </motion.div>

      <div className="recipes2-gridWrap">
        {error && (
          <motion.p
            className="recipes2-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </motion.p>
        )}
        {loading && (
          <motion.p
            className="recipes2-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            Loading...
          </motion.p>
        )}

        {!loading && !error && recipes.length === 0 && (
          <motion.p
            className="recipes2-status"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            No recipes found.
          </motion.p>
        )}

        {!loading && !error && recipes.length > 0 && (
          <>
            {/* Recipe cards grid */}
            <motion.div
              className="recipes2-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              key={`page-${safePage}`}
            >
              {paginated.map((meal) => (
                <motion.div
                  className="recipes2-card"
                  key={meal.idMeal}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="card-imageWrap">
                    {/* Recipe image linking to detail page */}
                    <Link
                      to={`/recipe/${meal.idMeal}`}
                      className="recipeCardLink"
                      aria-label={`Open ${meal.strMeal}`}
                    >
                      <img src={meal.strMealThumb} alt={meal.strMeal} />
                    </Link>

                    {/* Favorite and saved list buttons overlay */}
                    <div className="card-actionsOverlay">
                      <motion.button
                        className={`icon-fab ${
                          isFavorite(meal.idMeal) ? "active" : ""
                        } ${!isLoggedIn ? "locked" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleFavorite(meal.idMeal);
                        }}
                        aria-label="Add to favorites"
                        title={isLoggedIn ? "Add to favorites" : "Log in to use favorites"}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.1 20.3C12.04 20.34 11.96 20.34 11.9 20.3
       C9.1 18.1 3.5 13.4 3.5 8.9
       C3.5 6.4 5.5 4.5 8 4.5
       C9.6 4.5 11.1 5.3 12 6.6
       C12.9 5.3 14.4 4.5 16 4.5
       C18.5 4.5 20.5 6.4 20.5 8.9
       C20.5 13.4 14.9 18.1 12.1 20.3Z"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            fill={isFavorite(meal.idMeal) ? "currentColor" : "none"}
                          />
                        </svg>
                      </motion.button>

                      <motion.button
                        className={`icon-fab ${
                          isInList(meal.idMeal) ? "active" : ""
                        } ${!isLoggedIn ? "locked" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleList(meal.idMeal);
                        }}
                        aria-label="Add to list"
                        title={isLoggedIn ? "Add to list" : "Log in to use lists"}
                        type="button"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </div>

                  <Link to={`/recipe/${meal.idMeal}`} className="recipeCardLink">
                    <h3>{meal.strMeal}</h3>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination controls */}
            <motion.div
              className="recipes2-pagination"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <button
                className="pageNav"
                onClick={() => goToPage(safePage - 1)}
                disabled={safePage === 1}
                type="button"
              >
                Prev
              </button>

              {pageButtons[0] !== 1 && (
                <>
                  <button className="pageBtn" onClick={() => goToPage(1)} type="button">
                    1
                  </button>
                  <span className="dots">…</span>
                </>
              )}

              {pageButtons.map((p) => (
                <motion.button
                  key={p}
                  className={`pageBtn ${p === safePage ? "active" : ""}`}
                  onClick={() => goToPage(p)}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  {p}
                </motion.button>
              ))}

              {pageButtons[pageButtons.length - 1] !== totalPages && (
                <>
                  <span className="dots">…</span>
                  <button
                    className="pageBtn"
                    onClick={() => goToPage(totalPages)}
                    type="button"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                className="pageNav"
                onClick={() => goToPage(safePage + 1)}
                disabled={safePage === totalPages}
                type="button"
              >
                Next
              </button>
            </motion.div>
          </>
        )}
      </div>

      {/* Recipe request CTA section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
      >
        <RequestRecipe />
      </motion.div>
    </div>
  );
}