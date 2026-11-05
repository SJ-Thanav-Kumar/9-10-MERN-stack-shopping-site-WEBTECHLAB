import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";
import { RatingBadge } from "./RatingBadge";
import WishlistButton from "./WishlistButton";

export default function ProductCard({ product, summary }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const link = `/product/${product.id}`;

  const add = () => {
    addItem(product, qty);
    setQty(1);
  };

  return (
    <article className="card product-card">
      <div className="img-treatment media">
        <Link to={link} tabIndex={-1} aria-hidden="true">
          <img src={product.img} alt="" loading="lazy" />
        </Link>
        <WishlistButton product={product} />
      </div>
      <span className="label-tiny">{product.category}</span>
      <h3><Link to={link}>{product.name}</Link></h3>
      <RatingBadge summary={summary} />
      <div className="price">{formatPrice(product.price)}</div>

      <div className="product-actions">
        <div className="qty">
          <button type="button" className="qty-btn" aria-label={`Decrease quantity of ${product.name}`} onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
          <span className="qty-value" aria-live="polite">{qty}</span>
          <button type="button" className="qty-btn" aria-label={`Increase quantity of ${product.name}`} onClick={() => setQty((q) => q + 1)}>+</button>
        </div>
        <button type="button" className="btn-outline" onClick={add}>Add</button>
      </div>
    </article>
  );
}
