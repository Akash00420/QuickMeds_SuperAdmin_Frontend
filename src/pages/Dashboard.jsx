import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPlatformStats } from "../Reducer/AnalyticsSlice";
import { getAllAdmins } from "../Reducer/AdminSlice";
import { getAllPharmacies } from "../Reducer/PharmacySlice";
import { getAllUsers } from "../Reducer/UserSlice";
import Loader from "../components/Loader";

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { platformStats, loading } = useSelector((s) => s.analytics);
  const { admins }     = useSelector((s) => s.admin);
  const { pharmacies } = useSelector((s) => s.pharmacy);
  const { users }      = useSelector((s) => s.user);

  useEffect(() => {
    dispatch(getPlatformStats());
    dispatch(getAllAdmins());
    dispatch(getAllPharmacies());
    dispatch(getAllUsers());
  }, []);

  if (loading && !platformStats) return <Loader text="Loading platform data..." />;

  const totalUsers      = platformStats?.totalUsers      ?? users.length;
  const totalPharmacies = platformStats?.totalPharmacies ?? pharmacies.length;
  const pendingVerify   = pharmacies.filter((p) => !p.isVerified);
  const activeAdmins    = admins.filter((a) => a.isActive).length;

  // One row per pharmacy owner (dedup in case an owner has multiple pharmacies)
  const pharmacyOwners = Array.from(
    new Map(
      pharmacies
        .filter((p) => p.owner)
        .map((p) => [p.owner._id || p.owner.email, p])
    ).values()
  );

  return (
    <div className="sa-main">
      {/* Hero */}
      <div className="hero-banner">
        <div className="hero-banner-title">Overview Dashboard</div>
        <div className="hero-banner-sub">System performance &amp; management</div>
      </div>

      {/* Stats — 2x2 */}
      <div className="stat-grid stat-grid-2">
        <div className="stat-card">
          <div className="stat-icon icon-blue">👥</div>
          <div className="stat-label">Total Users</div>
          <div className="stat-value">{totalUsers}</div>
        </div>

        <div className="stat-card stat-card-accent">
          <div className="stat-icon icon-teal">🏥</div>
          <div className="stat-label">Pharmacies</div>
          <div className="stat-value">{totalPharmacies}</div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-indigo">🛡️</div>
          <div className="stat-label">Admins</div>
          <div className="stat-value">{admins.length}</div>
          <div className="stat-sub">
            {admins.length > 0 && activeAdmins === admins.length ? "All Active" : `${activeAdmins} active`}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon icon-amber">🛡️</div>
          <div className="stat-label">Pending</div>
          <div
            className="stat-value"
            style={{ color: pendingVerify.length ? "#A32D2D" : "#0F6E56" }}
          >
            {pendingVerify.length}
          </div>
          <div className="stat-sub">{pendingVerify.length === 0 ? "Verified" : "Awaiting review"}</div>
        </div>
      </div>

      {/* Outbreak alerts */}
      <div className="outbreak-row">
        <div className="flex items-center gap-3">
          <span className="stat-icon icon-gray" style={{ marginBottom: 0 }}>⚠️</span>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Outbreak Alerts</div>
        </div>
        <div className="text-sm text-muted">
          {platformStats?.outbreakAlerts ? `${platformStats.outbreakAlerts} active` : "No active reports"}
        </div>
      </div>

      {/* Pending verifications */}
      <div className="card section-block">
        <div className="section-header">
          <div className="section-title">Pending Verifications</div>
          <span className="stat-icon icon-indigo" style={{ marginBottom: 0, width: 30, height: 30, fontSize: 14 }}>
            🛡️
          </span>
        </div>

        {pendingVerify.length === 0 ? (
          <div style={{ textAlign: "center", padding: "28px 8px" }}>
            <div className="verified-check">✓</div>
            <div className="empty-state-title">All pharmacies verified</div>
            <div className="empty-state-sub">System state is current and compliant.</div>
          </div>
        ) : (
          <div className="table-wrap" style={{ marginTop: 12 }}>
            <table>
              <thead><tr><th>Pharmacy</th><th>Owner</th><th></th></tr></thead>
              <tbody>
                {pendingVerify.slice(0, 5).map((p) => (
                  <tr key={p._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.name}</div>
                      <div className="text-sm text-muted">{p.address?.city}</div>
                    </td>
                    <td className="text-sm">{p.owner?.name || "—"}</td>
                    <td>
                      <button className="btn btn-teal btn-sm" onClick={() => navigate("/pharmacies")}>
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <button className="fab-btn" onClick={() => navigate("/pharmacies")} title="Go to Pharmacies">
          +
        </button>
      </div>

      {/* Admin accounts */}
      <div className="card section-block">
        <div className="section-header">
          <div className="section-title">Admin Accounts</div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ textTransform: "uppercase", fontSize: 11 }}
            onClick={() => navigate("/admins")}
          >
            View all
          </button>
        </div>
        <div className="admin-mini-list">
          {admins.slice(0, 5).map((a) => (
            <div className="admin-mini-row" key={a._id}>
              <span className="admin-avatar-circle">{initials(a.name)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                <div className="text-sm text-muted">{a.role || "Administrator"}</div>
              </div>
              <span className={`badge ${a.isActive ? "badge-green" : "badge-red"}`}>
                {a.isActive ? "Active" : "Suspended"}
              </span>
            </div>
          ))}
          {admins.length === 0 && (
            <div className="empty-state-sub" style={{ textAlign: "center", padding: 20 }}>
              No admins yet
            </div>
          )}
        </div>
      </div>

      {/* Pharmacy owners */}
      <div className="card section-block">
        <div className="section-header">
          <div className="section-title">Pharmacy Owners</div>
          <button
            className="btn btn-ghost btn-sm"
            style={{ textTransform: "uppercase", fontSize: 11 }}
            onClick={() => navigate("/pharmacies")}
          >
            View all
          </button>
        </div>
        <div className="admin-mini-list">
          {pharmacyOwners.slice(0, 5).map((p) => (
            <div className="admin-mini-row" key={p.owner._id || p.owner.email}>
              <span className="admin-avatar-circle owner-avatar">{initials(p.owner.name)}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{p.owner.name}</div>
                <div className="text-sm text-muted">{p.name}</div>
              </div>
              <span className={`badge ${p.isActive ? "badge-green" : "badge-red"}`}>
                {p.isActive ? "Active" : "Suspended"}
              </span>
            </div>
          ))}
          {pharmacyOwners.length === 0 && (
            <div className="empty-state-sub" style={{ textAlign: "center", padding: 20 }}>
              No pharmacy owners yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;