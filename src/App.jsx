import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import RecipesPage from "./pages/RecipesPage";
import OurStory from "./pages/OurStory";
import AskUs from "./pages/AskUs";
import RecipeDetail from "./pages/RecipeDetail";
import AuthModal from "./components/AuthModal";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";
import RequireAdmin from "./components/RequireAdmin";

function App() {
  return (
    <Router>
      <Navbar />

      {/* Home page with hero section */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
            </>
          }
        />
        {/* Public recipe browsing */}
        <Route path="/recipespage" element={<RecipesPage />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        {/* Public recipe browsing */}
        <Route path="/ourstory" element={<OurStory />} />
        <Route path="/askus" element={<AskUs />} />

        {/* User profile and favorites */}
        <Route path="/user" element={<UserPage />} />

        {/* Admin panel - requires admin role */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />
      </Routes>

      <AuthModal />
      <Footer />
    </Router>
  );
}

export default App;
