import { Link, Navigate } from "react-router-dom";
import { RatingBadge } from "../components/RatingBadge";
import WishlistButton from "../components/WishlistButton";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { useDbProducts } from "../hooks/useDbProducts";
import { useSummaries } from "../hooks/useSummaries";

export default function Catalogue() {
  const { user } = useAuth();
  const { addItem } = useCart();
  const { status, products, message } = useDbProducts();
  const summaries = useSummaries(products.map((p) => p.id));

  if (!user) return <Navigate to="/login" replace />;

  return (
    <section className="page-container section-tight">
      <div className="page-title">
        <span className="label-tiny">Welcome, {user.username}</span>
        <h1>Catalogue</h1>
        <p className="muted">Products currently available in the store database.</p>
      </div>

      {status === "loading" && <p className="muted">Loading...</p>}

      {status === "error" && (
        <div className="empty-box"><p>{message}</p></div>
      )}

      {status === "ready" && products.length === 0 && (
        <div className="empty-box"><p>{message || "No products available"}</p></div>
      )}

      {status === "ready" && products.length > 0 && (
        <div className="product-grid">
          {products.map((p) => (
            <article key={p.id} className="card catalogue-card">
              <WishlistButton product={p} />
              <div className="img-treatment" style={{ marginBottom: 24 }}>
                <img src={p.img} alt="" loading="lazy" />
              </div>
              <span className="label-tiny">{p.category}</span>
              <h3><Link to={`/product/${p.id}`}>{p.name}</Link></h3>
              <RatingBadge summary={summaries[p.id]} />
              <div className="price">{formatPrice(p.price)}</div>
              {p.description && <p className="desc">{p.description}</p>}
              <dl className="meta">
                {p.productId !== undefined && <div><dt>Product ID</dt><dd>{p.productId}</dd></div>}
                {p.quantity !== undefined && <div><dt>Available</dt><dd>{p.quantity}</dd></div>}
              </dl>
              <button
                type="button"
                className="btn-outline btn-small"
                style={{ marginTop: "auto" }}
                disabled={p.quantity === 0}
                onClick={() => addItem(p)}
              >
                {p.quantity === 0 ? "Out of stock" : "Add to cart"}
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
