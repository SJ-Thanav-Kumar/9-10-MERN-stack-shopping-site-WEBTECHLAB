import { useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../api";
import { useAuth } from "../context/AuthContext";
import { RatingSummary } from "./RatingBadge";
import { ThumbDown, ThumbUp } from "./icons";

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function Reviews({ productKey, data, error, onChanged }) {
  const { user, logout } = useAuth();
  const [draft, setDraft] = useState(null);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("all");

  const mine = data?.mine;
  const current = draft ?? { vote: mine ? mine.recommended : null, text: mine ? mine.text : "" };
  const update = (patch) => setDraft({ ...current, ...patch });

  const send = async (options, successText) => {
    setBusy(true);
    const res = await request(`/reviews/${productKey}`, { token: user.token, ...options });
    setBusy(false);

    if (res.status === 401) {
      logout();
    } else if (!res.ok) {
      setNotice({ type: "error", text: res.data.message });
    } else {
      setNotice({ type: "success", text: successText });
      setDraft(null);
      onChanged();
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (current.vote === null) {
      setNotice({ type: "error", text: "Choose Recommend or Not Recommend" });
      return;
    }
    send(
      { method: "PUT", body: { recommended: current.vote, text: current.text } },
      mine ? "Review updated" : "Review posted"
    );
  };

  const reviews = data?.reviews ?? [];
  const shown = reviews.filter((r) => filter === "all" || r.recommended === (filter === "up"));

  return (
    <section className="page-container section-tight">
      <div className="narrow">
        <div className="section-head">
          <h2>Customer Reviews</h2>
        </div>

        {error && <div className="empty-box"><p>{error}</p></div>}

        <RatingSummary summary={data?.summary} />

        {user ? (
          <form className="review-form" onSubmit={submit} noValidate>
            <span className="label-tiny">{mine ? "Edit your review" : "Write a review"}</span>
            <p className="muted">Do you recommend this product?</p>
            <div className="vote-row">
              <button type="button" className="vote-btn" aria-pressed={current.vote === true} onClick={() => update({ vote: true })}>
                <ThumbUp /> Recommend
              </button>
              <button type="button" className="vote-btn" aria-pressed={current.vote === false} onClick={() => update({ vote: false })}>
                <ThumbDown /> Not Recommend
              </button>
            </div>
            <label className="form-field">
              <span className="label-tiny">Your review (optional)</span>
              <textarea
                className="field"
                rows={4}
                maxLength={1000}
                placeholder="Tell others why"
                value={current.text}
                onChange={(e) => update({ text: e.target.value })}
              />
            </label>
            <div className="form-row">
              <span className="label-tiny">{current.text.length} / 1000</span>
              <div className="form-row">
                {mine && (
                  <button type="button" className="btn-outline btn-small" disabled={busy} onClick={() => send({ method: "DELETE" }, "Review deleted")}>
                    Delete
                  </button>
                )}
                <button type="submit" className="btn-primary btn-small" disabled={busy}>
                  {mine ? "Update review" : "Post review"}
                </button>
              </div>
            </div>
            {notice && (
              <div className="notice" role={notice.type === "error" ? "alert" : "status"}>
                <span className="label-tiny">{notice.type === "error" ? "Error" : "Success"}</span>
                {notice.text}
              </div>
            )}
          </form>
        ) : (
          <div className="review-form">
            <p className="muted"><Link to="/login" className="inline-link">Log in</Link> to write a review.</p>
          </div>
        )}

        <div className="chips" role="group" aria-label="Filter reviews">
          {[["all", "All"], ["up", "Recommended"], ["down", "Not recommended"]].map(([value, label]) => (
            <button key={value} type="button" className="chip" aria-pressed={filter === value} onClick={() => setFilter(value)}>
              {label}
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="empty-box">
            <p>{reviews.length === 0 ? "No reviews yet. Be the first." : "No reviews match this filter."}</p>
          </div>
        ) : (
          <ul className="review-list">
            {shown.map((r) => (
              <li key={r.id} className="card review">
                <div className="review-head">
                  <span className="review-verdict">
                    {r.recommended ? <ThumbUp filled /> : <ThumbDown filled />}
                    {r.recommended ? "Recommended" : "Not Recommended"}
                  </span>
                  <span className="review-meta">
                    {r.username}{r.mine ? " (you)" : ""} &middot; {formatDate(r.createdAt)}
                  </span>
                </div>
                {r.text && <p className="review-text">{r.text}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
