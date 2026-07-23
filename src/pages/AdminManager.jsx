import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdmins, createAdmin, clearGeneratedPassword } from "../Reducer/AdminSlice";
import AdminCard from "../components/AdminCard";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

const INITIAL = { name: "", email: "", phone: "" };

const AdminManager = () => {
  const dispatch = useDispatch();
  const { admins, loading, error, generatedPassword } = useSelector((s) => s.admin);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INITIAL);

  useEffect(() => { dispatch(getAllAdmins()); }, []);

  const handleCreate = async () => {
    if (!form.name || !form.email) return;
    const result = await dispatch(createAdmin(form));
    if (result.meta.requestStatus === "fulfilled") {
      setForm(INITIAL);
      setShowForm(false);
    }
  };

  return (
    <div className="sa-main">
      <BackButton to="/dashboard" />

      <div className="page-header">
        <div>
          <div className="page-title">Admin Accounts</div>
          <div className="page-subtitle">
            {admins.length} admins · {admins.filter((a) => a.isActive).length} active
          </div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Create Admin
        </button>
      </div>

      {/* Generated password reveal — shown once */}
      {generatedPassword && (
        <div className="password-reveal mb-6">
          <div className="password-reveal-label">✅ Admin Created — Share this password once</div>
          <div className="password-reveal-value">{generatedPassword}</div>
          <div className="password-reveal-note">This will not be shown again. Copy it now.</div>
          <button className="btn btn-ghost btn-sm mt-2"
            onClick={() => dispatch(clearGeneratedPassword())}>
            Dismiss
          </button>
        </div>
      )}

      {error && <div className="auth-error mb-4">{error}</div>}

      {loading ? (
        <Loader text="Loading admins..." />
      ) : admins.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🛡️</div>
          <div className="empty-state-title">No admin accounts yet</div>
          <div className="empty-state-sub">Create the first admin to delegate platform control.</div>
          <button className="btn btn-primary mt-4" onClick={() => setShowForm(true)}>
            + Create Admin
          </button>
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr><th>Name</th><th>Phone</th><th>Status</th><th>Created</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {admins.map((a) => <AdminCard key={a._id} admin={a} />)}
            </tbody>
          </table>
        </div>
      )}

      {/* Create admin modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">Create Admin Account</div>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <p className="text-sm text-muted mb-4">
              A password will be auto-generated and shown once after creation.
            </p>

            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input className="form-input" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email *</label>
              <input type="email" className="form-input" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input className="form-input" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className="modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={loading || !form.name || !form.email}
              >
                {loading ? <span className="loader loader-sm" /> : "Create Admin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminManager;