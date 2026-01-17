import "./RequestRecipe.css";

// CTA section prompting users to request missing recipes
export default function RequestRecipe() {
  return (
    <section className="request-recipe">
      <div className="rr-line"></div>
      <h2 className="rr-title">Don't see what you're looking for?</h2>

      <p className="rr-subtext">
        Help us improve by requesting a recipe you think is missing.
      </p>

      <a href="/askus" className="rr-btn">
        Request a Recipe
      </a>
    </section>
  );
}