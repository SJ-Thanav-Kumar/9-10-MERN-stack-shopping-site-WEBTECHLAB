import { useState } from "react";
import { Link } from "react-router-dom";

export default function Logo() {
  const [filling, setFilling] = useState(false);

  return (
    <Link
      to="/"
      aria-label="9/10 home"
      className={`logo${filling ? " is-filling" : ""}`}
      onClick={() => setFilling(true)}
      onAnimationEnd={(e) => {
        if (e.target === e.currentTarget) setFilling(false);
      }}
    >
      <span>9/10</span>
      <span className="logo-water" aria-hidden="true">9/10</span>
      <span className="logo-wave" aria-hidden="true" />
    </Link>
  );
}
