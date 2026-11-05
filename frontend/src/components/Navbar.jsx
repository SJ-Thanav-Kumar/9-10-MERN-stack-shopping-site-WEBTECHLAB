import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { categories } from "../data/products";
import { Heart } from "./icons";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  const { keys: wished } = useWishlist();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const onSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="site-header">
      <div className="page-container header-inner">
        <Logo />

        <nav className="site-nav" aria-label="Primary">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          {categories.map((c) => (
            <NavLink key={c.slug} to={`/${c.slug}`} className="nav-link">{c.title}</NavLink>
          ))}
          {user && <NavLink to="/products" className="nav-link">Catalogue</NavLink>}
        </nav>

        <div className="header-right">
          <form role="search" onSubmit={onSearch}>
            <input
              type="search"
              className="search-input"
              placeholder="Search..."
              aria-label="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          {user ? (
            <>
              <Link to="/profile" className="nav-link small nav-user">{user.username}</Link>
              <button type="button" className="nav-link small hide-small" onClick={logout}>Log out</button>
            </>
          ) : (
            <Link to="/login" className="nav-link small">
              <span className="hide-small">Log in / Sign up</span>
              <span className="only-small">Log in</span>
            </Link>
          )}

          {user && (
            <NavLink
              to="/wishlist"
              className="nav-link btn-icon"
              aria-label={`Wishlist, ${wished.length} item${wished.length === 1 ? "" : "s"}`}
            >
              <Heart size={20} />
              {wished.length > 0 && <span className="cart-badge" aria-hidden="true">{wished.length}</span>}
            </NavLink>
          )}

          <NavLink
            to="/cart"
            className="nav-link btn-icon"
            aria-label={`Cart, ${count} item${count === 1 ? "" : "s"}`}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {count > 0 && <span className="cart-badge" aria-hidden="true">{count}</span>}
          </NavLink>
        </div>
      </div>
    </header>
  );
}
