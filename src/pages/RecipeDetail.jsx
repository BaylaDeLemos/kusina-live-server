import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./RecipeDetail.css";

// Individual recipe detail page with ingredients, instructions, and video
export default function RecipeDetail() {
  const { id } = useParams();

  const { isLoggedIn, token, apiBase, openAuthModal } = useAuth();

  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Track favorite and saved list status
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInList, setIsInList] = useState(false);

  // Button loading states during API calls
  const [busy, setBusy] = useState(""); // "fav" | "list" | ""

  const requireLogin = () => openAuthModal("login");

  // Parse instructions into individual steps
  const parseInstructions = (text) => {
    if (!text) return [];
    const cleaned = text.replace(/step\s*\d+[:.)-]?\s*/gi, "");
    const parts = cleaned.split(/\r?\n+|\. +|;\s+/);
    return parts.map((s) => s.trim()).filter((s) => s.length > 0);
  };

  // Fetch recipe from MealDB API
  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setErr("");

      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${encodeURIComponent(
            id,
          )}`,
        );
        if (!res.ok) throw new Error("Failed request");

        const data = await res.json();
        const m = data.meals?.[0] ?? null;

        if (!cancelled) setMeal(m);
      } catch {
        if (!cancelled) setErr("Couldn't load this recipe. Please try again.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Sync favorite and saved list status from backend
  useEffect(() => {
    if (!isLoggedIn) {
      setIsFavorite(false);
      setIsInList(false);
      return;
    }

    let cancelled = false;

    async function sync() {
      try {
        const res = await fetch(`${apiBase}/api/user/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) return;

        if (cancelled) return;

        const favs = data.user?.favorites || [];
        const list = data.user?.savedList || [];

        setIsFavorite(favs.includes(id));
        setIsInList(list.includes(id));
      } catch {
        // Non-blocking sync error
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [id, isLoggedIn, apiBase, token]);

  // Toggle recipe as favorite
  const toggleFavorite = async () => {
    if (!isLoggedIn) return requireLogin();

    setBusy("fav");
    setErr("");

    try {
      const res = await fetch(`${apiBase}/api/user/favorites/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealId: id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data?.message || "Failed to update favorites");

      setIsFavorite(!!data.added);
    } catch (e) {
      setErr(e?.message || "Couldn't update favorites.");
    } finally {
      setBusy("");
    }
  };

  // Toggle recipe in saved list
  const toggleList = async () => {
    if (!isLoggedIn) return requireLogin();

    setBusy("list");
    setErr("");

    try {
      const res = await fetch(`${apiBase}/api/user/list/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ mealId: id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to update list");

      setIsInList(!!data.added);
    } catch (e) {
      setErr(e?.message || "Couldn't update saved recipes.");
    } finally {
      setBusy("");
    }
  };

  // Extract ingredients and measurements from MealDB fields
  const ingredients = useMemo(() => {
    if (!meal) return [];
    const items = [];
    for (let i = 1; i <= 20; i++) {
      const ing = meal[`strIngredient${i}`];
      const meas = meal[`strMeasure${i}`];
      if (ing && ing.trim()) {
        items.push({
          ingredient: ing.trim(),
          measure: meas?.trim() || "",
        });
      }
    }
    return items;
  }, [meal]);

  const steps = useMemo(() => parseInstructions(meal?.strInstructions), [meal]);

  // Extract YouTube video ID from meal URL
  const youtubeUrl = meal?.strYoutube?.trim() || "";
  const youtubeId = youtubeUrl.includes("v=")
    ? new URL(youtubeUrl).searchParams.get("v")
    : "";

  return (
    <div className="rd-page">
      <div className="rd-wrap">
        <div className="rd-topbar">
          <Link to="/recipespage" className="rd-back">
            ← Back to Recipes
          </Link>
        </div>

        {loading && <p className="rd-status">Loading recipe...</p>}
        {err && <p className="rd-status">{err}</p>}

        {!loading && !err && meal && (
          <>
            {/* Recipe hero with title, image, and action buttons */}
            <section className="rd-hero">
              <div className="rd-heroLeft">
                <p className="rd-kicker">
                  {meal.strArea} • {meal.strCategory}
                </p>

                <h1 className="rd-title">{meal.strMeal}</h1>

                <div className="rd-actions">
                  <button
                    className={`rd-actionBtn ${isInList ? "active" : ""}`}
                    onClick={toggleList}
                    type="button"
                    disabled={busy === "list"}
                    title={isLoggedIn ? "Save recipe" : "Log in to save"}
                  >
                    {busy === "list"
                      ? "Saving..."
                      : isInList
                        ? "Saved"
                        : "Save recipe"}
                  </button>

                  <button
                    className={`rd-actionBtn ghost ${isFavorite ? "active" : ""}`}
                    onClick={toggleFavorite}
                    type="button"
                    disabled={busy === "fav"}
                    title={
                      isLoggedIn ? "Add to favorites" : "Log in to favorite"
                    }
                  >
                    {busy === "fav"
                      ? "Updating..."
                      : isFavorite
                        ? "Favorited"
                        : "Add to favorites"}
                  </button>

                  {youtubeUrl && (
                    <a
                      className="rd-actionBtn video"
                      href={youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      ▶ Watch video
                    </a>
                  )}
                </div>

                <div className="rd-metaRow">
                  <div className="rd-metaPill">
                    Ingredients: {ingredients.length}
                  </div>
                  <div className="rd-metaPill">Steps: {steps.length}</div>
                </div>
              </div>

              <div className="rd-heroRight">
                <div className="rd-imgCard">
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                </div>
              </div>
            </section>

            {/* Ingredients and instructions grid */}
            <section className="rd-grid">
              {/* Ingredients list */}
              <div className="rd-card">
                <h2 className="rd-h2">Ingredients</h2>
                <ul className="rd-ingredients">
                  {ingredients.map((it, idx) => (
                    <li key={`${it.ingredient}-${idx}`}>
                      <span className="rd-ingName">{it.ingredient}</span>
                      <span className="rd-ingMeas">{it.measure}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Step-by-step instructions */}
              <div className="rd-card">
                <h2 className="rd-h2">Instructions</h2>

                {steps.length === 0 ? (
                  <p className="rd-status">
                    No instructions available for this recipe.
                  </p>
                ) : (
                  <ol className="rd-steps">
                    {steps.map((s, idx) => (
                      <li key={idx}>
                        <span className="rd-stepNum">{idx + 1}</span>
                        <p className="rd-stepText">{s}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {/* YouTube video embed (if available) */}
              {youtubeId && (
                <div className="rd-card rd-videoCard">
                  <h2 className="rd-h2">Tutorial</h2>
                  <div className="rd-videoWrap">
                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="Recipe tutorial video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
