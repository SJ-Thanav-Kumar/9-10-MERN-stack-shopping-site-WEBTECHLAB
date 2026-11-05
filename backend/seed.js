// Adds the products shown on the website to MongoDB. Run once with: npm run seed
// Safe to run again: products that already exist (same name) are skipped.
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

const item = (productId, productName, productPrice, category, quantity, description, file) => ({
  productId,
  productName,
  productPrice,
  category,
  quantity,
  description,
  image: `/products/${file}`,
});

const products = [
  item(105, 'Aural Void Pro', 399, 'Electronics', 15, 'Noise-cancelling wireless headphones with a clean, minimal design.', 'aural-void-pro.jpg'),
  item(106, 'Mechanical Keyboard', 150, 'Electronics', 30, 'Compact mechanical keyboard with tactile switches and a detachable cable.', 'mechanical-keyboard.jpg'),
  item(107, 'Wireless Earbuds', 129, 'Electronics', 40, 'True wireless earbuds with a pocket-sized charging case.', 'wireless-earbuds.jpg'),
  item(108, 'Monochrome Watch', 299, 'Electronics', 12, 'Minimal smartwatch with a matte black finish.', 'monochrome-watch.png'),
  item(109, 'Precision Mouse', 79, 'Electronics', 50, 'Ergonomic mouse with an adjustable high-precision sensor.', 'precision-mouse.jpg'),
  item(110, 'Studio Speaker', 189, 'Electronics', 20, 'Compact studio speaker with balanced, room-filling sound.', 'studio-speaker.jpg'),
  item(111, 'USB-C Hub', 59, 'Electronics', 60, 'Multi-port USB-C hub with HDMI, USB-A and a card reader.', 'usbc-hub.jpg'),
  item(112, 'Portable SSD', 109, 'Electronics', 35, 'Pocket-sized 1TB solid state drive with fast transfer speeds.', 'portable-ssd.jpg'),
  item(113, '4K Webcam', 119, 'Electronics', 25, '4K webcam with autofocus and a built-in microphone.', '4k-webcam.jpg'),

  item(114, 'Canvas Totebag', 30, 'Clothing', 80, 'Sturdy everyday tote in heavyweight cotton canvas.', 'canvas-totebag.jpg'),
  item(115, 'Heavyweight Tee', 35, 'Clothing', 100, 'Boxy-fit t-shirt in thick, durable cotton.', 'heavyweight-tee.jpg'),
  item(116, 'Black Hoodie', 85, 'Clothing', 45, 'Soft fleece-lined hoodie with a relaxed fit.', 'black-hoodie.jpg'),
  item(117, 'Tapered Trousers', 95, 'Clothing', 40, 'Tapered trousers in a smooth stretch fabric.', 'tapered-trousers.jpg'),
  item(118, 'Wool Beanie', 25, 'Clothing', 70, 'Warm ribbed beanie knitted from soft wool.', 'wool-beanie.jpg'),
  item(119, 'Minimal Sneakers', 120, 'Clothing', 30, 'Clean low-top sneakers with a cushioned sole.', 'minimal-sneakers.jpg'),
  item(120, 'Linen Overshirt', 110, 'Clothing', 35, 'Lightweight overshirt in breathable washed linen.', 'linen-overshirt.jpg'),
  item(121, 'Crew Socks 3-Pack', 18, 'Clothing', 150, 'Three pairs of soft cotton crew socks.', 'crew-socks.jpg'),

  item(122, 'Matte Black Flask', 45, 'Utilities', 60, 'Insulated steel flask that keeps drinks hot or cold for hours.', 'matte-black-flask.jpg'),
  item(123, 'Desk Lamp', 65, 'Utilities', 40, 'Adjustable LED desk lamp with dimmable warm light.', 'desk-lamp.jpg'),
  item(124, 'Notebook Set', 22, 'Utilities', 90, 'Set of dotted notebooks with durable covers.', 'notebook-set.jpg'),
  item(125, 'Cable Organiser', 15, 'Utilities', 120, 'Keeps desk cables tidy and untangled.', 'cable-organiser.jpg'),
  item(126, 'Ceramic Mug', 28, 'Utilities', 70, 'Matte ceramic mug with a comfortable handle.', 'ceramic-mug.jpg'),
  item(127, 'Pen Set', 40, 'Utilities', 55, 'Smooth-writing pen set in a slim case.', 'pen-set.jpg'),
  item(128, 'Laptop Stand', 70, 'Utilities', 35, 'Foldable aluminium laptop stand for better posture.', 'laptop-stand.jpg'),
  item(129, 'Wall Clock', 55, 'Utilities', 25, 'Minimal silent-sweep wall clock.', 'wall-clock.jpg'),
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  for (const p of products) {
    if (await Product.exists({ productName: p.productName })) {
      console.log('Skipped (already exists):', p.productName);
    } else {
      await Product.create(p);
      console.log('Added:', p.productName);
    }
  }

  console.log('Products in database:', await Product.countDocuments());
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.log('Seeding failed:', err.message);
  process.exit(1);
});
