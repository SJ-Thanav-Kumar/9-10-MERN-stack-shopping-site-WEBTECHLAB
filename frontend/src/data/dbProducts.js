import { allProducts, placeholderImg } from "./products";

// The first four database products were saved without an image, so they are matched by name
const localImages = {
  "Wireless Mouse": "/products/wireless-mouse.jpg",
  "Notebook Pack": "/products/notebook-pad.jpg",
  "Water Bottle": "/products/water-bottle.jpg",
  "USB-C Cable": "/products/usbc-cable.jpg",
};

// Turns a MongoDB product into the same shape the placeholder products use.
// A product that is also on the site (same name) reuses the site's id, so its
// cart, wishlist and reviews are shared between the Catalogue and the category pages.
export const normaliseDbProduct = (p) => {
  const siteProduct = allProducts.find((item) => item.name === p.productName);
  return {
    id: siteProduct ? siteProduct.id : `db-${p._id}`,
    name: p.productName,
    category: p.category,
    price: p.productPrice,
    img: p.image || localImages[p.productName] || placeholderImg(p.productName),
    stock: p.quantity,
    quantity: p.quantity,
    productId: p.productId,
    description: p.description,
  };
};
