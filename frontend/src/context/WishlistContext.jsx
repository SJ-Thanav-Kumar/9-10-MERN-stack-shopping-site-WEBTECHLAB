/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../api";
import { useAuth } from "./AuthContext";
import { useCart } from "./CartContext";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, logout } = useAuth();
  const { notify } = useCart();
  const navigate = useNavigate();
  const [state, setState] = useState({ owner: null, keys: [] });

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    request("/wishlist", { token: user.token }).then((res) => {
      if (cancelled) return;
      if (res.status === 401) logout();
      else if (res.ok) setState({ owner: user.emailId, keys: res.data.items });
    });

    return () => {
      cancelled = true;
    };
  }, [user, logout]);

  const loaded = Boolean(user) && state.owner === user.emailId;
  const keys = useMemo(() => (loaded ? state.keys : []), [loaded, state.keys]);

  const toggle = useCallback(
    async (key) => {
      if (!user) {
        notify("Log in to use your wishlist");
        navigate("/login");
        return;
      }

      const wished = keys.includes(key);
      const apply = (add) =>
        setState((s) => ({
          owner: user.emailId,
          keys: add ? [key, ...s.keys.filter((k) => k !== key)] : s.keys.filter((k) => k !== key),
        }));

      apply(!wished);
      const res = wished
        ? await request(`/wishlist/${key}`, { method: "DELETE", token: user.token })
        : await request("/wishlist", { method: "POST", body: { productKey: key }, token: user.token });

      if (res.status === 401) {
        logout();
      } else if (!res.ok) {
        apply(wished);
        notify(res.data.message || "Something went wrong");
      } else {
        notify(wished ? "Removed from wishlist" : "Added to wishlist");
      }
    },
    [user, keys, notify, navigate, logout]
  );

  const value = useMemo(
    () => ({ keys, loaded, has: (key) => keys.includes(key), toggle }),
    [keys, loaded, toggle]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => useContext(WishlistContext);
