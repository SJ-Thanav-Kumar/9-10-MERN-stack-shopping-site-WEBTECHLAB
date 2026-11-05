import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import Category from "./pages/Category";
import Search from "./pages/Search";
import Cart from "./pages/Cart";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import Catalogue from "./pages/Catalogue";
import Product from "./pages/Product";
import Wishlist from "./pages/Wishlist";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScrollToTop />
            <Routes>
              <Route element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Auth key="login" mode="login" />} />
                <Route path="register" element={<Auth key="register" mode="register" />} />
                <Route path="cart" element={<Cart />} />
                <Route path="profile" element={<Profile />} />
                <Route path="products" element={<Catalogue />} />
                <Route path="product/:id" element={<Product />} />
                <Route path="wishlist" element={<Wishlist />} />
                <Route path="search" element={<Search />} />
                <Route path=":category" element={<Category />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
