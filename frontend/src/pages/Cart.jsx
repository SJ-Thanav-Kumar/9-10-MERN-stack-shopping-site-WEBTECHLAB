import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../data/products";

export default function Cart() {
  const { user } = useAuth();
  const { items, total, changeQty, remove, clear, notify } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);

  const checkout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      clear();
      setProcessing(false);
      notify("Order Placed");
      navigate("/");
    }, 1000);
  };

  return (
    <section className="page-container section-tight">
      <div className="narrow">
        <div className="page-head">
          <h1>Your Cart</h1>
          <Link to="/" className="nav-link link-back">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Shop
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="empty-box">
            <p>Your cart is quiet and empty.</p>
            <Link to="/" className="btn-outline">Continue Shopping</Link>
          </div>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="card cart-item">
                  <div className="img-treatment">
                    <img src={item.img} alt={item.name} />
                  </div>
                  <div className="cart-info">
                    <h3>{item.name}</h3>
                    <div className="display muted">{formatPrice(item.price)}</div>
                  </div>
                  <div className="cart-controls">
                    <div className="qty">
                      <button type="button" className="qty-btn" aria-label={`Decrease quantity of ${item.name}`} onClick={() => changeQty(item.id, -1)}>-</button>
                      <span className="qty-value">{item.qty}</span>
                      <button
                        type="button"
                        className="qty-btn"
                        aria-label={`Increase quantity of ${item.name}`}
                        disabled={item.stock !== undefined && item.qty >= item.stock}
                        onClick={() => changeQty(item.id, 1)}
                      >+</button>
                    </div>
                    <div className="line-total">{formatPrice(item.price * item.qty)}</div>
                    <button type="button" className="nav-link" aria-label={`Remove ${item.name}`} onClick={() => remove(item.id)}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="summary">
              <div className="summary-row">
                <span className="muted">Subtotal</span>
                <span className="display">{formatPrice(total)}</span>
              </div>
              <div className="summary-row">
                <span className="muted">Shipping</span>
                <span className="display">Calculated at checkout</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
              {user ? (
                <button type="button" className="btn-primary" disabled={processing} onClick={checkout}>
                  {processing ? "Processing..." : "Checkout"}
                </button>
              ) : (
                <>
                  <p className="muted" style={{ marginBottom: 16 }}>Log in to place your order.</p>
                  <Link to="/login" className="btn-primary">Log in to checkout</Link>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
