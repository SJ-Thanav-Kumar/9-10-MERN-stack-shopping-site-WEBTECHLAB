import { useWishlist } from "../context/WishlistContext";
import { Heart } from "./icons";

export default function WishlistButton({ product, inline = false }) {
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  return (
    <button
      type="button"
      className={`wish-btn${wished ? " on" : ""}${inline ? " inline" : ""}`}
      aria-pressed={wished}
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
      onClick={() => toggle(product.id)}
    >
      <Heart size={18} filled={wished} />
    </button>
  );
}
