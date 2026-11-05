import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RatingBadge } from "../components/RatingBadge";
import Reviews from "../components/Reviews";
import WishlistButton from "../components/WishlistButton";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { allProducts, formatPrice } from "../data/products";
import { useDbProducts } from "../hooks/useDbProducts";
import { useReviews } from "../hooks/useReviews";
import NotFound from "./NotFound";

export default function Product() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const isDb = id.startsWith("db-");
  const db = useDbProducts(isDb);
  const product = isDb ? db.products.find((p) => p.id === id) : allProducts.find((p) => p.id === id);
  const { data, error, refresh } = useReviews(product ? id : null);

  if (isDb && !user) {
    return (
      <section className="page-container section-tight">
        <div className="empty-box">
          <p>Log in to view this product.</p>
          <Link to="/login" className="btn-outline">Log in</Link>
        </div>
      </section>
    );
  }
  if (isDb && db.status === "loading") {
    return <section className="page-container section-tight"><p className="muted">Loading...</p></section>;
  }
  if (!product) return <NotFound />;

  return (
    <>
      <section className="hero detail divider-bottom">
        <div className="page-container section-tight hero-layout">
          <div className="hero-media img-treatment">
            <img src={product.img} alt={product.name} />
          </div>
          <div className="hero-copy">
            <span className="label-tiny" style={{ marginBottom: 16 }}>{product.category}</span>
            <h1>{product.name}</h1>
            <RatingBadge summary={data?.summary} />
            {product.description && <p>{product.description}</p>}
            {(product.productId !== undefined || product.quantity !== undefined) && (
              <dl className="meta" style={{ width: "100%", maxWidth: 320 }}>
                {product.productId !== undefined && <div><dt>Product ID</dt><dd>{product.productId}</dd></div>}
                {product.quantity !== undefined && <div><dt>Available</dt><dd>{product.quantity}</dd></div>}
              </dl>
            )}
            <div className="hero-price">{formatPrice(product.price)}</div>

            <div className="detail-actions">
              <div className="qty">
                <button type="button" className="qty-btn" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
                <span className="qty-value" aria-live="polite">{qty}</span>
                <button type="button" className="qty-btn" aria-label="Increase quantity" onClick={() => setQty((q) => q + 1)}>+</button>
              </div>
              <button
                type="button"
                className="btn-primary"
                disabled={product.quantity === 0}
                onClick={() => {
                  addItem(product, qty);
                  setQty(1);
                }}
              >
                {product.quantity === 0 ? "Out of stock" : "Add to Cart"}
              </button>
              <WishlistButton product={product} inline />
            </div>
          </div>
        </div>
      </section>

      <Reviews productKey={id} data={data} error={error} onChanged={refresh} />
    </>
  );
}
