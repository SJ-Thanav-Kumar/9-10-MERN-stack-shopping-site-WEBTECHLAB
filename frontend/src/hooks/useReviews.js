import { useCallback, useEffect, useState } from "react";
import { request } from "../api";
import { useAuth } from "../context/AuthContext";

// Reviews for one product. Logged-in users also get their own review back as `data.mine`.
export function useReviews(productKey) {
  const { user } = useAuth();
  const token = user?.token;
  const [state, setState] = useState({ key: null, data: null, error: "" });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!productKey) return;
    let cancelled = false;

    request(`/reviews/${productKey}`, { token }).then((res) => {
      if (cancelled) return;
      setState({ key: productKey, data: res.ok ? res.data : null, error: res.ok ? "" : res.data.message });
    });

    return () => {
      cancelled = true;
    };
  }, [productKey, token, version]);

  const refresh = useCallback(() => setVersion((v) => v + 1), []);
  const current = state.key === productKey;

  return { data: current ? state.data : null, error: current ? state.error : "", refresh };
}
