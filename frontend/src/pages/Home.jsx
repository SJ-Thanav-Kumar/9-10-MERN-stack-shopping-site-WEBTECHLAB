import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { useCart } from "../context/CartContext";
import { categories, featured, formatPrice, heroProduct, products } from "../data/products";

export default function Home() {
  const { addItem } = useCart();

  return (
    <>
      <section className="hero divider-bottom">
        <div className="page-container section hero-layout">
          <div className="hero-media img-treatment">
            <img src={heroProduct.heroImg} alt={heroProduct.name} />
          </div>
          <div className="hero-copy">
            <span className="label-tiny" style={{ marginBottom: 16 }}>New arrival</span>
            <h1>{heroProduct.name}</h1>
            <p>
              Experience absolute silence. Engineered for the minimalists, these noise-cancelling
              headphones strip away the excess, leaving only pure, uninterrupted sound.
            </p>
            <div className="hero-price">{formatPrice(heroProduct.price)}</div>
            <button type="button" className="btn-primary" onClick={() => addItem(heroProduct)}>
              Add to Cart
            </button>
          </div>
        </div>
      </section>

      <section className="page-container section">
        <div className="section-head">
          <h2>Featured Essentials</h2>
          <Link to="/search" className="nav-link label-tiny">View all</Link>
        </div>
        <ProductGrid products={featured} />
      </section>

      <section className="page-container" style={{ paddingBottom: 100 }}>
        <div className="section-head">
          <h2>Shop by Category</h2>
        </div>
        <div className="category-grid">
          {categories.map((c) => (
            <Link key={c.slug} to={`/${c.slug}`} className="card category-card">
              <span className="label-tiny">
                {products.filter((p) => p.category === c.slug).length} items
              </span>
              <h3>{c.title}</h3>
              <p className="muted">{c.blurb}</p>
              <span className="label-tiny go">View collection &rarr;</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
