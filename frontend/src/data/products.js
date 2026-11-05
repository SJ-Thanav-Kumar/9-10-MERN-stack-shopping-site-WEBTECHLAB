export const CURRENCY = "$";

export const formatPrice = (n) => `${CURRENCY}${Number(n).toLocaleString("en-US")}`;

export const placeholderImg = (label, w = 400, h = 400) =>
  `https://placehold.co/${w}x${h}/121212/E5E5E5?text=${encodeURIComponent(label).replace(/%20/g, "+")}`;

export const categories = [
  {
    slug: "electronics",
    title: "Electronics",
    blurb: "Considered hardware for focused work and quiet listening.",
  },
  {
    slug: "clothing",
    title: "Clothing",
    blurb: "Plain, durable pieces without the noise.",
  },
  {
    slug: "utilities",
    title: "Utilities",
    blurb: "Everyday tools, stripped back to what they need to be.",
  },
];

const item = (id, category, name, price, file) => ({
  id,
  category,
  name,
  price,
  img: file ? `/products/${file}` : placeholderImg(name),
});

export const heroProduct = {
  id: "hero-aural-void-pro",
  category: "electronics",
  name: "Aural Void Pro",
  price: 399,
  img: "/products/aural-void-pro.jpg",
  heroImg: "/products/aural-void-pro.jpg",
};

export const products = [
  item("el-1", "electronics", "Mechanical Keyboard", 150, "mechanical-keyboard.jpg"),
  item("el-2", "electronics", "Wireless Earbuds", 129, "wireless-earbuds.jpg"),
  item("el-3", "electronics", "Monochrome Watch", 299, "monochrome-watch.png"),
  item("el-4", "electronics", "Precision Mouse", 79, "precision-mouse.jpg"),
  item("el-5", "electronics", "Studio Speaker", 189, "studio-speaker.jpg"),
  item("el-6", "electronics", "USB-C Hub", 59, "usbc-hub.jpg"),
  item("el-7", "electronics", "Portable SSD", 109, "portable-ssd.jpg"),
  item("el-8", "electronics", "4K Webcam", 119, "4k-webcam.jpg"),

  item("cl-1", "clothing", "Canvas Totebag", 30, "canvas-totebag.jpg"),
  item("cl-2", "clothing", "Heavyweight Tee", 35, "heavyweight-tee.jpg"),
  item("cl-3", "clothing", "Black Hoodie", 85, "black-hoodie.jpg"),
  item("cl-4", "clothing", "Tapered Trousers", 95, "tapered-trousers.jpg"),
  item("cl-5", "clothing", "Wool Beanie", 25, "wool-beanie.jpg"),
  item("cl-6", "clothing", "Minimal Sneakers", 120, "minimal-sneakers.jpg"),
  item("cl-7", "clothing", "Linen Overshirt", 110, "linen-overshirt.jpg"),
  item("cl-8", "clothing", "Crew Socks 3-Pack", 18, "crew-socks.jpg"),

  item("ut-1", "utilities", "Matte Black Flask", 45, "matte-black-flask.jpg"),
  item("ut-2", "utilities", "Desk Lamp", 65, "desk-lamp.jpg"),
  item("ut-3", "utilities", "Notebook Set", 22, "notebook-set.jpg"),
  item("ut-4", "utilities", "Cable Organiser", 15, "cable-organiser.jpg"),
  item("ut-5", "utilities", "Ceramic Mug", 28, "ceramic-mug.jpg"),
  item("ut-6", "utilities", "Pen Set", 40, "pen-set.jpg"),
  item("ut-7", "utilities", "Laptop Stand", 70, "laptop-stand.jpg"),
  item("ut-8", "utilities", "Wall Clock", 55, "wall-clock.jpg"),
];

export const allProducts = [heroProduct, ...products];

const byId = Object.fromEntries(allProducts.map((p) => [p.id, p]));

export const featured = ["el-1", "ut-1", "el-3", "cl-1"].map((id) => byId[id]);
