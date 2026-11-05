import { useParams } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import NotFound from "./NotFound";
import { categories, products } from "../data/products";

export default function Category() {
  const { category } = useParams();
  const current = categories.find((c) => c.slug === category);

  if (!current) return <NotFound />;

  const list = products.filter((p) => p.category === current.slug);

  return (
    <section className="page-container section-tight">
      <div className="page-title">
        <span className="label-tiny">Collection &middot; {list.length} items</span>
        <h1>{current.title}</h1>
        <p className="muted">{current.blurb}</p>
      </div>
      <ProductGrid products={list} />
    </section>
  );
}
