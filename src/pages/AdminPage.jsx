import { useEffect, useState } from "react";
import "./AdminPage.css";
import { useAuth } from "../context/AuthContext";
import SimpleModal from "../components/DeletedModal";

// Admin dashboard for managing users and recipes
export default function AdminPage() {
  const { token, apiBase, user } = useAuth();

  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingRecipes, setLoadingRecipes] = useState(true);

  const [err, setErr] = useState("");
  const [deletingId, setDeletingId] = useState("");

  // Modal state for info and confirmation dialogs
  const [modal, setModal] = useState({
    open: false,
    title: "",
    message: "",
    confirm: false,
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: null,
  });

  // Open info modal (notification only)
  const openInfoModal = (title, message) => {
    setModal({
      open: true,
      title,
      message,
      confirm: false,
      confirmText: "OK",
      cancelText: "Cancel",
      onConfirm: null,
    });
  };

  // Open confirmation modal (requires user action)
  const openConfirmModal = ({ title, message, onConfirm }) => {
    setModal({
      open: true,
      title,
      message,
      confirm: true,
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm,
    });
  };

  const closeModal = () => {
    setModal((p) => ({ ...p, open: false, onConfirm: null }));
  };

  // Form state for adding new recipes
  const [form, setForm] = useState({
    title: "",
    category: "",
    area: "",
    imageUrl: "",
    youtubeUrl: "",
    instructions: "",
  });

  const CATEGORY_OPTIONS = [
    "Main",
    "Dessert",
    "Seafood",
    "Chicken",
    "Beef",
    "Lamb",
    "Vegetarian",
    "Pasta",
    "Soup",
    "Snack",
    "Appetizer",
    "Other",
  ];

  // Fetch all users on mount
  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      setLoadingUsers(true);
      setErr("");

      try {
        const res = await fetch(`${apiBase}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.message || "Failed to load users");
        if (!cancelled) setUsers(data.users || []);
      } catch (e) {
        if (!cancelled) setErr(e?.message || "Could not load users.");
      } finally {
        if (!cancelled) setLoadingUsers(false);
      }
    }

    loadUsers();
    return () => {
      cancelled = true;
    };
  }, [apiBase, token]);

  // Fetch all admin recipes
  const loadRecipes = async () => {
    setLoadingRecipes(true);
    setErr("");

    try {
      const res = await fetch(`${apiBase}/api/admin/recipes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to load recipes");

      setRecipes(data.recipes || []);
    } catch (e) {
      setErr(e?.message || "Could not load recipes.");
    } finally {
      setLoadingRecipes(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, [apiBase, token]);

  // Create new recipe and refresh list
  const submitRecipe = async (e) => {
    e.preventDefault();
    setErr("");

    try {
      const res = await fetch(`${apiBase}/api/admin/recipes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to create recipe");

      openInfoModal("Recipe added", "Your recipe was added successfully.");

      setForm({
        title: "",
        category: "",
        area: "",
        imageUrl: "",
        youtubeUrl: "",
        instructions: "",
      });

      await loadRecipes();
    } catch (e2) {
      setErr(e2?.message || "Could not add recipe.");
    }
  };

  // Delete recipe and update UI
  const doDeleteRecipe = async (recipeId, title) => {
    setErr("");
    setDeletingId(recipeId);

    try {
      const res = await fetch(`${apiBase}/api/admin/recipes/${recipeId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Failed to delete recipe");

      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));

      closeModal();
      openInfoModal("Recipe deleted", `"${title || "Recipe"}" was deleted.`);
    } catch (e) {
      closeModal();
      setErr(e?.message || "Could not delete recipe.");
    } finally {
      setDeletingId("");
    }
  };

  // Open confirmation before deleting recipe
  const requestDeleteRecipe = (recipeId, title) => {
    openConfirmModal({
      title: "Delete recipe?",
      message: `Are you sure you want to delete "${title || "this recipe"}"? This cannot be undone.`,
      onConfirm: () => doDeleteRecipe(recipeId, title),
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-wrap">
        {/* Page header */}
        <div className="admin-head">
          <div>
            <p className="admin-kicker">Admin</p>
            <h1 className="admin-title">Dashboard</h1>
            <p className="admin-subtitle">
              Signed in as <b>{user?.username}</b> ({user?.role})
            </p>
          </div>
        </div>

        {err && <p className="admin-status">{err}</p>}

        {/* Users table (view-only) */}
        <div className="admin-card">
          <h2 className="admin-sectionTitle">Users</h2>

          {loadingUsers ? (
            <p className="admin-status">Loading users...</p>
          ) : (
            <>
              <div className="admin-tableWrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td>{u.username}</td>
                        <td className="admin-email">{u.email}</td>
                        <td>
                          <span
                            className={`admin-role ${
                              u.role === "admin" ? "isAdmin" : ""
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td>
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="admin-note">
                Note: This users table is <b>view-only</b> (no delete).
              </p>
            </>
          )}
        </div>

        {/* Recipe creation form */}
        <div className="admin-card" style={{ marginTop: "16px" }}>
          <h2 className="admin-sectionTitle">Add Recipe</h2>

          <form className="admin-form" onSubmit={submitRecipe}>
            <label className="admin-field">
              <span>Title *</span>
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="e.g., Chicken Adobo"
                required
              />
            </label>

            <div className="admin-twoCol">
              <label className="admin-field">
                <span>Category *</span>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, category: e.target.value }))
                  }
                  required
                  style={{
                    width: "95%",
                    padding: "12px 12px",
                    borderRadius: "14px",
                    border: "2px solid rgba(19, 34, 165, 0.18)",
                    outline: "none",
                    fontFamily: "var(--body-font)",
                    background: "#fff",
                    color: "var(--primary)",
                  }}
                >
                  <option value="">Choose a category</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </label>

              <label className="admin-field">
                <span>Area (optional)</span>
                <input
                  value={form.area}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, area: e.target.value }))
                  }
                  placeholder="e.g., Filipino"
                />
              </label>
            </div>

            <div className="admin-twoCol">
              <label className="admin-field">
                <span>Image URL (optional)</span>
                <input
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, imageUrl: e.target.value }))
                  }
                  placeholder="https://..."
                />
              </label>

              <label className="admin-field">
                <span>YouTube URL (optional)</span>
                <input
                  value={form.youtubeUrl}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, youtubeUrl: e.target.value }))
                  }
                  placeholder="https://youtube.com/..."
                />
              </label>
            </div>

            <label className="admin-field">
              <span>Instructions *</span>
              <textarea
                value={form.instructions}
                onChange={(e) =>
                  setForm((p) => ({ ...p, instructions: e.target.value }))
                }
                placeholder="Write the steps..."
                required
              />
            </label>

            <button className="admin-primaryBtn" type="submit">
              Add recipe
            </button>
          </form>
        </div>

        {/* List of created recipes with delete option */}
        <div className="admin-card" style={{ marginTop: "16px" }}>
          <h2 className="admin-sectionTitle">Your Recipes</h2>

          {loadingRecipes ? (
            <p className="admin-status">Loading recipes...</p>
          ) : recipes.length === 0 ? (
            <p className="admin-note">No recipes added yet.</p>
          ) : (
            <div className="admin-recipesGrid">
              {recipes.map((r) => (
                <div className="admin-recipeItem" key={r.id}>
                  <div className="admin-recipeThumb">
                    {r.imageUrl ? (
                      <img src={r.imageUrl} alt={r.title} />
                    ) : (
                      <div className="admin-thumbFallback" />
                    )}
                  </div>

                  <div className="admin-recipeText">
                    <p className="admin-recipeTitle">{r.title}</p>
                    <p className="admin-recipeMeta">
                      {r.category}
                      {r.area ? ` • ${r.area}` : ""}
                    </p>
                    <p className="admin-recipeMeta2">
                      {r.createdAt
                        ? new Date(r.createdAt).toLocaleDateString()
                        : ""}
                    </p>

                    <button
                      className="admin-dangerBtn"
                      type="button"
                      onClick={() => requestDeleteRecipe(r.id, r.title)}
                      disabled={deletingId === r.id}
                      title="Delete this recipe"
                    >
                      {deletingId === r.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <p className="admin-note">
            Note: This recipe section is <b>create + view + delete</b>.
          </p>
        </div>
      </div>

      {/* Confirmation and info modals */}
      <SimpleModal
        open={modal.open}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        confirm={modal.confirm}
        confirmText={modal.confirmText}
        cancelText={modal.cancelText}
        onConfirm={modal.onConfirm}
        autoCloseMs={2000}
      />
    </div>
  );
}