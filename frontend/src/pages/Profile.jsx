import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { request } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout, setUsername } = useAuth();
  const [deleted, setDeleted] = useState(false);
  const [form, setForm] = useState({ username: "", age: "", password: "" });
  const [notice, setNotice] = useState(null);
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return;
    const t = setTimeout(() => setConfirming(false), 4000);
    return () => clearTimeout(t);
  }, [confirming]);

  if (!user) return <Navigate to={deleted ? "/register" : "/login"} replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // The token proves who is asking; the backend only lets you change your own account
  const send = async (method, body) => {
    const res = await request(`/users?emailId=${encodeURIComponent(user.emailId)}`, {
      method,
      body,
      token: user.token,
    });
    if (res.status === 401) {
      logout();
      return false;
    }
    setNotice({ type: res.ok ? "success" : "error", text: res.data.message });
    return res.ok;
  };

  const handlePut = async () => {
    if (await send("PUT", form) && form.username) setUsername(form.username.trim());
  };

  const handlePatch = async () => {
    const changed = {};
    Object.entries(form).forEach(([k, v]) => {
      if (v !== "") changed[k] = v;
    });
    if (await send("PATCH", changed) && changed.username) setUsername(changed.username.trim());
  };

  const handleDelete = async () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    if (await send("DELETE")) {
      setDeleted(true);
      logout();
    }
  };

  return (
    <section className="page-container section-tight">
      <div className="form-card">
        <span className="label-tiny">Account</span>
        <h1 style={{ fontSize: 30, margin: "8px 0 8px" }}>My Profile</h1>
        <p className="muted" style={{ marginBottom: 32 }}>{user.emailId}</p>

        <div className="form">
          <label className="form-field">
            <span className="label-tiny">Username</span>
            <input className="field" name="username" placeholder="New username" value={form.username} onChange={handleChange} />
          </label>
          <label className="form-field">
            <span className="label-tiny">Age</span>
            <input className="field" name="age" type="number" placeholder="New age" value={form.age} onChange={handleChange} />
          </label>
          <label className="form-field">
            <span className="label-tiny">Password</span>
            <input className="field" name="password" type="password" autoComplete="new-password" placeholder="New password" value={form.password} onChange={handleChange} />
          </label>

          <div className="button-stack">
            <button type="button" className="btn-primary" onClick={handlePut}>Update all details (PUT)</button>
            <button type="button" className="btn-outline" onClick={handlePatch}>Update filled fields only (PATCH)</button>
            <button type="button" className="btn-outline" onClick={handleDelete}>
              {confirming ? "Click again to confirm" : "Delete account (DELETE)"}
            </button>
          </div>
        </div>

        {notice && (
          <div className="notice" role={notice.type === "error" ? "alert" : "status"}>
            <span className="label-tiny">{notice.type === "error" ? "Error" : "Success"}</span>
            {notice.text}
          </div>
        )}

        <p className="form-foot">
          <Link to="/products">Back to catalogue</Link>
          {" · "}
          <button type="button" className="inline-link" style={{ background: "none", border: 0, borderBottom: "1px solid var(--border)", padding: 0, cursor: "pointer", font: "inherit" }} onClick={logout}>
            Log out
          </button>
        </p>
      </div>
    </section>
  );
}
