import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./UserPage.css";

// User profile page showing favorites and saved recipes
export default function UserPage() {
  const { isLoggedIn, user, token, apiBase, openAuthModal } = useAuth();

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [me, setMe] = useState(null);

  // Cache meal details fetched from MealDB
  const [mealMap, setMealMap] = useState({});
  const [busyId, setBusyId] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      openAuthModal("login");
      setLoading(false);
      setMe(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // Fetch user profile from backend
  useEffect(() => {
    if (!isLoggedIn) return;

    let cancelled = false;

    async function loadMe() {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(`${apiBase}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load account");

        if (!cancelled) setMe(data.user);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Couldn't load your account.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMe();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn, apiBase, token]);

  // Fetch meal details from MealDB by ID
  const fetchMeal = async (idMeal) => {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
        idMeal,
      )}`,
    );
    const data = await res.json().catch(() => ({}));
    return data.meals?.[0] || null;
  };

  // Load meal thumbnails and names for favorites and saved list
  useEffect(() => {
    if (!me) return;

    let cancelled = false;

    async function loadMeals() {
      const ids = Array.from(
        new Set([...(me.favorites || []), ...(me.savedList || [])]),
      );

      if (ids.length === 0) return;

      try {
        const results = await Promise.all(ids.map((id) => fetchMeal(id)));
        if (cancelled) return;

        const nextMap = {};
        results.forEach((m) => {
          if (m?.idMeal) {
            nextMap[m.idMeal] = {
              idMeal: m.idMeal,
              strMeal: m.strMeal,
              strMealThumb: m.strMealThumb,
            };
          }
        });

        setMealMap((prev) => ({ ...prev, ...nextMap }));
      } catch {
        // Non-blocking; page still works without meal thumbnails
      }
    }

    loadMeals();
    return () => {
      cancelled = true;
    };
  }, [me]);

  const favorites = useMemo(() => me?.favorites || [], [me]);
  const savedList = useMemo(() => me?.savedList || [], [me]);

  // Remove meal from favorites
  const toggleFavorite = async (mealId) => {
    if (!isLoggedIn) return openAuthModal("login");

    setBusyId(`fav:${mealId}`);
    setErr("");

    try {
      const res = await fetch(`${apiBase}/api/user/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || "Failed to update favorites");

      setMe((prev) => ({
        ...prev,
        favorites: data.favorites || [],
      }));
    } catch (e) {
      setErr(e?.message || "Couldn't update favorites.");
    } finally {
      setBusyId("");
    }
  };

  // Remove meal from saved list
  const toggleSavedList = async (mealId) => {
    if (!isLoggedIn) return openAuthModal("login");

    setBusyId(`list:${mealId}`);
    setErr("");

    try {
      const res = await fetch(`${apiBase}/api/user/list/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealId }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update list");

      setMe((prev) => ({
        ...prev,
        savedList: data.savedList || [],
      }));
    } catch (e) {
      setErr(e?.message || "Couldn't update list.");
    } finally {
      setBusyId("");
    }
  };

  const displayUser = me || user;

  return (
    <div className="user-page">
      <div className="user-wrap">
        {/* Page header with user info */}
        <div className="user-top">
          <div>
            <p className="user-kicker">My Account</p>
            <h1 className="user-title">
              {displayUser?.username ? displayUser.username : "Your account"}
            </h1>
            <p className="user-sub">
              {displayUser?.email ? displayUser.email : ""}
            </p>
          </div>

          <Link className="user-back" to="/recipespage">
            ← Back to Recipes
          </Link>
        </div>

        {/* Not logged in state */}
        {!isLoggedIn && (
          <div className="user-card">
            <p className="user-emptyTitle">You're not logged in.</p>
            <p className="user-emptyText">
              Please log in to view your favorites and saved recipes.
            </p>
            <button
              className="user-btn"
              type="button"
              onClick={() => openAuthModal("login")}
            >
              Log in / Sign up
            </button>
          </div>
        )}

        {isLoggedIn && loading && <p className="user-status">Loading...</p>}
        {isLoggedIn && err && <p className="user-status">{err}</p>}

        {/* Logged in: display favorites and saved list */}
        {isLoggedIn && !loading && !err && me && (
          <div className="user-grid">
            {/* Favorites section */}
            <section className="user-card">
              <div className="user-cardHead">
                <h2 className="user-h2">Favorites</h2>
                <span className="user-pill">{favorites.length}</span>
              </div>

              {favorites.length === 0 ? (
                <p className="user-emptyText">
                  No favorites yet. Tap the heart on a recipe to add one.
                </p>
              ) : (
                <div className="user-list">
                  {favorites.map((idMeal) => {
                    const m = mealMap[idMeal];
                    return (
                      <div className="user-item" key={`fav-${idMeal}`}>
                        <Link
                          className="user-itemLink"
                          to={`/recipe/${idMeal}`}
                        >
                          <div className="user-thumb">
                            {m?.strMealThumb ? (
                              <img src={m.strMealThumb} alt={m.strMeal} />
                            ) : (
                              <div className="user-thumbFallback" />
                            )}
                          </div>
                          <div className="user-itemText">
                            <p className="user-itemTitle">
                              {m?.strMeal || `Recipe ${idMeal}`}
                            </p>
                            <p className="user-itemMini">View details</p>
                          </div>
                        </Link>

                        <button
                          className="user-miniBtn"
                          type="button"
                          onClick={() => toggleFavorite(idMeal)}
                          disabled={busyId === `fav:${idMeal}`}
                          title="Remove from favorites"
                        >
                          {busyId === `fav:${idMeal}` ? "..." : "Remove"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Saved list section */}
            <section className="user-card">
              <div className="user-cardHead">
                <h2 className="user-h2">Saved Recipes</h2>
                <span className="user-pill">{savedList.length}</span>
              </div>

              {savedList.length === 0 ? (
                <p className="user-emptyText">
                  Your saved list is empty. Tap the plus button on recipes to
                  save them.
                </p>
              ) : (
                <div className="user-list">
                  {savedList.map((idMeal) => {
                    const m = mealMap[idMeal];
                    return (
                      <div className="user-item" key={`list-${idMeal}`}>
                        <Link
                          className="user-itemLink"
                          to={`/recipe/${idMeal}`}
                        >
                          <div className="user-thumb">
                            {m?.strMealThumb ? (
                              <img src={m.strMealThumb} alt={m.strMeal} />
                            ) : (
                              <div className="user-thumbFallback" />
                            )}
                          </div>
                          <div className="user-itemText">
                            <p className="user-itemTitle">
                              {m?.strMeal || `Recipe ${idMeal}`}
                            </p>
                            <p className="user-itemMini">View details</p>
                          </div>
                        </Link>

                        <button
                          className="user-miniBtn"
                          type="button"
                          onClick={() => toggleSavedList(idMeal)}
                          disabled={busyId === `list:${idMeal}`}
                          title="Remove from saved recipes"
                        >
                          {busyId === `list:${idMeal}` ? "..." : "Remove"}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  );
}
