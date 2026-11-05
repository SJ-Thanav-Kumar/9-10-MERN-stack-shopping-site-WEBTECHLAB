import { useState } from "react";
import { Link, Navigate, NavLink } from "react-router-dom";
import { API } from "../api";
import { useAuth } from "../context/AuthContext";

const blank = { username: "", emailId: "", age: "", password: "" };

export default function Auth({ mode }) {
  const isLogin = mode === "login";
  const { user, login } = useAuth();
  const [form, setForm] = useState(blank);
  const [notice, setNotice] = useState(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/products" replace />;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(`${API}${isLogin ? "/login" : "/users"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(isLogin ? { emailId: form.emailId, password: form.password } : form),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice({ type: "error", text: data.message });
      } else if (isLogin) {
        login({ token: data.token, username: data.username, emailId: form.emailId.toLowerCase().trim() });
      } else {
        setNotice({ type: "success", text: data.message });
        setForm(blank);
      }
    } catch {
      setNotice({ type: "error", text: "Cannot reach the server" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="page-container section-tight">
      <div className="form-card">
        <div className="tabs" role="navigation" aria-label="Account">
          <NavLink to="/login" className="tab">Log in</NavLink>
          <NavLink to="/register" className="tab">Sign up</NavLink>
        </div>

        <h1 style={{ fontSize: 30, marginBottom: 32 }}>{isLogin ? "Welcome back" : "Create an account"}</h1>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {!isLogin && (
            <label className="form-field">
              <span className="label-tiny">Username</span>
              <input className="field" name="username" autoComplete="username" placeholder="Your name" value={form.username} onChange={handleChange} />
            </label>
          )}
          <label className="form-field">
            <span className="label-tiny">Email ID</span>
            <input className="field" name="emailId" type="email" autoComplete="email" placeholder="you@example.com" value={form.emailId} onChange={handleChange} />
          </label>
          {!isLogin && (
            <label className="form-field">
              <span className="label-tiny">Age</span>
              <input className="field" name="age" type="number" placeholder="Age" value={form.age} onChange={handleChange} />
            </label>
          )}
          <label className="form-field">
            <span className="label-tiny">Password</span>
            <input className="field" name="password" type="password" autoComplete={isLogin ? "current-password" : "new-password"} placeholder={isLogin ? "Your password" : "At least 8 characters"} value={form.password} onChange={handleChange} />
          </label>
          <button type="submit" className="btn-primary btn-block" disabled={busy}>
            {busy ? "Please wait..." : isLogin ? "Log in" : "Sign up"}
          </button>
        </form>

        {notice && (
          <div className="notice" role={notice.type === "error" ? "alert" : "status"}>
            <span className="label-tiny">{notice.type === "error" ? "Error" : "Success"}</span>
            {notice.text}
          </div>
        )}

        <p className="form-foot">
          {isLogin ? (
            <>New here? <Link to="/register">Create an account</Link></>
          ) : (
            <>Already registered? <Link to="/login">Log in</Link></>
          )}
        </p>
      </div>
    </section>
  );
}
