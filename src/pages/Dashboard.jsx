import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPlatformStats } from "../Reducer/AnalyticsSlice";
import { getAllAdmins } from "../Reducer/AdminSlice";
import { getAllPharmacies } from "../Reducer/PharmacySlice";
import { getAllUsers } from "../Reducer/UserSlice";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import BackButton from "../components/BackButton";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);
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
  const pendingVerify   = pharmacies.filter((p) => !p.isVerified).length;
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
      <BackButton />

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
          Platform Overview 🛡️
        </h1>
        <p className="page-subtitle">
          Welcome back, {user?.name?.split(" ")[0] || "SuperAdmin"}
        </p>
      </div>

      {/* Stats */}
      <div className="stat-grid">
        <StatCard icon="👥" label="Total Users"     value={totalUsers}      sub="Registered accounts"        iconClass="icon-blue" />
        <StatCard icon="🏥" label="Pharmacies"      value={totalPharmacies} sub={`${pendingVerify} pending`} iconClass="icon-teal" />
        <StatCard icon="🛡️" label="Active Admins"   value={activeAdmins}    sub={`${admins.length} total`}   iconClass="icon-indigo" />
        <StatCard icon="⚠️" label="Pending Verify"  value={pendingVerify}   sub="Awaiting approval"          iconClass="icon-amber" />
        <StatCard icon="🧪" label="Outbreak Alerts" value={platformStats?.outbreakAlerts ?? "—"} sub="This month" iconClass="icon-red" />
      </div>

      {/* Three-column section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>

        {/* Pending pharmacies */}
        <div>
          <div className="section-header">
            <div className="section-title">Pending Verifications</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/pharmacies")}>
              View all →
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Pharmacy</th><th>Owner</th><th>Action</th></tr></thead>
              <tbody>
                {pharmacies.filter((p) => !p.isVerified).slice(0, 5).map((p) => (
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
                {pharmacies.filter((p) => !p.isVerified).length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: "center", color: "#94A3B8", padding: 24 }}>
                      All pharmacies verified ✅
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pharmacy owners */}
        <div>
          <div className="section-header">
            <div className="section-title">Pharmacy Owners</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/pharmacies")}>
              Manage →
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Status</th></tr></thead>
              <tbody>
                {pharmacyOwners.slice(0, 5).map((p) => (
                  <tr key={p.owner._id || p.owner.email}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{p.owner.name}</div>
                      <div className="text-sm text-muted">{p.owner.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${p.isActive ? "badge-green" : "badge-red"}`}>
                        {p.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                  </tr>
                ))}
                {pharmacyOwners.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", color: "#94A3B8", padding: 24 }}>
                      No pharmacy owners yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Admin accounts */}
        <div>
          <div className="section-header">
            <div className="section-title">Admin Accounts</div>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate("/admins")}>
              Manage →
            </button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Name</th><th>Status</th></tr></thead>
              <tbody>
                {admins.slice(0, 5).map((a) => (
                  <tr key={a._id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{a.name}</div>
                      <div className="text-sm text-muted">{a.email}</div>
                    </td>
                    <td>
                      <span className={`badge ${a.isActive ? "badge-green" : "badge-red"}`}>
                        {a.isActive ? "Active" : "Suspended"}
                      </span>
                    </td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr>
                    <td colSpan={2} style={{ textAlign: "center", color: "#94A3B8", padding: 24 }}>
                      No admins yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;