import { useEffect, useState } from "react";
import { request } from "../api";

// Review summaries for many products at once: { [productId]: { label, percent, total, ... } }
export function useSummaries(keys) {
  const [summaries, setSummaries] = useState({});
  const joined = keys.slice(0, 60).join(",");

  useEffect(() => {
    if (!joined) return;
    let cancelled = false;

    request(`/reviews/summary?keys=${joined}`).then((res) => {
      if (!cancelled && res.ok) setSummaries(res.data.summaries);
    });

    return () => {
      cancelled = true;
    };
  }, [joined]);

  return summaries;
}
