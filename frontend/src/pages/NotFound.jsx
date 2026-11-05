import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="page-container section-tight">
      <div className="empty-box">
        <span className="label-tiny">404</span>
        <h1 style={{ fontSize: 36, margin: "8px 0 16px" }}>Page not found</h1>
        <p>That page doesn&rsquo;t exist.</p>
        <Link to="/" className="btn-outline">Back to Home</Link>
      </div>
    </section>
  );
}
