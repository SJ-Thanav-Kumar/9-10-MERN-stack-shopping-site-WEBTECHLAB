import { Link, Navigate } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { allProducts } from "../data/products";
import { useDbProducts } from "../hooks/useDbProducts";

export default function Wishlist() {
  const { user } = useAuth();
  const { keys, loaded } = useWishlist();
  const db = useDbProducts(keys.some((k) => k.startsWith("db-")));

  if (!user) return <Navigate to="/login" replace />;

  const items = keys
    .map((k) => allProducts.find((p) => p.id === k) || db.products.find((p) => p.id === k))
    .filter(Boolean);

  return (
    <section className="page-container section-tight">
      <div className="page-title">
        <span className="label-tiny">{items.length} saved item{items.length === 1 ? "" : "s"}</span>
        <h1>Wishlist</h1>
        <p className="muted">Things you want to come back to.</p>
      </div>

      {!loaded ? (
        <p className="muted">Loading...</p>
      ) : items.length === 0 ? (
        <div className="empty-box">
          <p>Your wishlist is empty.</p>
          <Link to="/search" className="btn-outline">Browse products</Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </section>
  );
}
