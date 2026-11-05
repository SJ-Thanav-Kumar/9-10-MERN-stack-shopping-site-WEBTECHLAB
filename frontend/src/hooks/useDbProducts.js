import { useEffect, useState } from "react";
import { request } from "../api";
import { useAuth } from "../context/AuthContext";
import { normaliseDbProduct } from "../data/dbProducts";

// Loads the products stored in MongoDB (needs a logged-in user)
export function useDbProducts(enabled = true) {
  const { user, logout } = useAuth();
  const [state, setState] = useState({ status: "loading", products: [], message: "" });

  useEffect(() => {
    if (!user || !enabled) return;
    let cancelled = false;

    request("/products", { token: user.token }).then((res) => {
      if (cancelled) return;
      if (res.status === 401) {
        logout();
      } else if (!res.ok) {
        setState({ status: "error", products: [], message: res.data.message });
      } else {
        setState({
          status: "ready",
          products: (res.data.products || []).map(normaliseDbProduct),
          message: res.data.message || "",
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [user, enabled, logout]);

  return state;
}
