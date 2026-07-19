import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuperAdmin, clearError } from "../Reducer/AuthSlice";

const Login = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: "", password: "" });

  useEffect(() => {
    if (isAuthenticated) navigate("/dashboard");
    return () => dispatch(clearError());
  }, [isAuthenticated]);

  const handleSubmit = () => {
    if (!form.email || !form.password) return;
    dispatch(loginSuperAdmin(form));
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-mark">Q</div>
          <span style={{ fontSize: 20, fontWeight: 700, color: "#4F46E5" }}>
            QuickMeds SuperAdmin
          </span>
        </div>

        <h1 className="auth-title">Restricted Access</h1>
        <p className="auth-sub">SuperAdmin credentials required</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email address</label>
          <input
            type="email" className="form-input"
            placeholder="superadmin@quickmeds.in"
            value={form.email} autoFocus
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password" className="form-input"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        <button
          className="btn btn-primary w-full"
          style={{ justifyContent: "center", marginTop: 4 }}
          onClick={handleSubmit}
          disabled={loading || !form.email || !form.password}
        >
          {loading ? <span className="loader loader-sm" /> : "Sign In"}
        </button>
      </div>
    </div>
  );
};

export default Login;