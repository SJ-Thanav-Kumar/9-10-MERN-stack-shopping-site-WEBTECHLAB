import ProductCard from "./ProductCard";
import { useSummaries } from "../hooks/useSummaries";

export default function ProductGrid({ products }) {
  const summaries = useSummaries(products.map((p) => p.id));

  return (
    <div className="product-grid">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} summary={summaries[p.id]} />
      ))}
    </div>
  );
}
