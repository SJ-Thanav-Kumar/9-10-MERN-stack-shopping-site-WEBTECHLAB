import { Link, useSearchParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { allProducts } from "../data/products";

export default function Search() {
  const [params] = useSearchParams();
  const q = (params.get("q") || "").trim();
  const needle = q.toLowerCase();

  const results = allProducts.filter(
    (p) => !needle || p.name.toLowerCase().includes(needle) || p.category.includes(needle)
  );

  return (
    <section className="page-container section-tight">
      <div className="page-title">
        <span className="label-tiny">{results.length} result{results.length === 1 ? "" : "s"}</span>
        <h1>{q ? `Results for “${q}”` : "All Products"}</h1>
      </div>
      {results.length === 0 ? (
        <div className="empty-box">
          <p>Nothing matched your search.</p>
          <Link to="/" className="btn-outline">Back to Home</Link>
        </div>
      ) : (
        <ProductGrid products={results} />
      )}
    </section>
  );
}
