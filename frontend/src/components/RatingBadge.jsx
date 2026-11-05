import { Minus, ThumbDown, ThumbUp } from "./icons";

const plural = (n) => `${n} review${n === 1 ? "" : "s"}`;

// Picks an icon from the percentage of positive reviews
function Mood({ percent }) {
  if (percent >= 70) return <ThumbUp filled />;
  if (percent >= 40) return <Minus />;
  return <ThumbDown filled />;
}

// Compact one-line rating, shown on product cards
export function RatingBadge({ summary }) {
  if (!summary) return <div className="rating" />;
  if (summary.total === 0) return <div className="rating">No reviews yet</div>;
  if (summary.label === "Need more reviews") return <div className="rating">{plural(summary.total)}</div>;

  return (
    <div className="rating">
      <Mood percent={summary.percent} />
      <strong>{summary.label}</strong>
      <span>({summary.percent}% of {summary.total})</span>
    </div>
  );
}

// Larger "overall reviews" panel with a percentage bar, shown above the review list
export function RatingSummary({ summary }) {
  if (!summary) return null;

  const scored = summary.total > 0 && summary.label !== "Need more reviews";

  return (
    <div className="rating-summary">
      <span className="label-tiny">Overall reviews</span>
      <div className="rating-title">
        {scored && <Mood percent={summary.percent} />}
        <h3>{scored ? summary.label : summary.total === 0 ? "No reviews yet" : "Need more reviews"}</h3>
      </div>
      {summary.total > 0 && (
        <p className="muted">
          {summary.percent}% of {plural(summary.total)} recommend this product
          ({summary.positive} positive, {summary.negative} negative)
        </p>
      )}
      {summary.total > 0 && (
        <div className="rating-bar" role="img" aria-label={`${summary.percent}% positive`}>
          <div style={{ width: `${summary.percent}%` }} />
        </div>
      )}
    </div>
  );
}
