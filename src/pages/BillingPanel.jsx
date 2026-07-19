import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillingOverview, updatePharmacyPlan } from "../Reducer/BillingSlice";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";

const PLANS = ["Free", "Basic", "Pro", "Premium"];

const PLAN_BADGE = {
  Free:    "badge-gray",
  Basic:   "badge-blue",
  Pro:     "badge-indigo",
  Premium: "badge-amber",
};

const BillingPanel = () => {
  const dispatch = useDispatch();
  const { overview, subscriptions, loading } = useSelector((s) => s.billing);
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(getBillingOverview()); }, []);

  const filtered = subscriptions.filter((s) =>
    s.pharmacyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">Billing Panel</div>
          <div className="page-subtitle">Platform revenue and subscription management</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => dispatch(getBillingOverview())}>
          ↻ Refresh
        </button>
      </div>

      {loading && !overview ? <Loader text="Loading billing data..." /> : (
        <>
          <div className="stat-grid">
            <StatCard icon="💰" label="Total Revenue"       value={overview ? `₹${overview.totalRevenue?.toLocaleString()}` : "—"} iconClass="icon-teal" />
            <StatCard icon="📈" label="Monthly Revenue"     value={overview ? `₹${overview.monthlyRevenue?.toLocaleString()}` : "—"} iconClass="icon-indigo" />
            <StatCard icon="⭐" label="Premium Plans"       value={overview?.premiumCount ?? "—"} sub="Active subscriptions" iconClass="icon-amber" />
            <StatCard icon="🆓" label="Free Plans"          value={overview?.freeCount ?? "—"} sub="No charge" iconClass="icon-gray" />
          </div>

          <div className="section-header">
            <div className="section-title">Pharmacy Subscriptions</div>
          </div>

          <div className="filter-bar">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input className="search-input" placeholder="Search pharmacy..."
                value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">💳</div>
              <div className="empty-state-title">No billing data yet</div>
              <div className="empty-state-sub">Subscription records will appear here once pharmacies sign up.</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Pharmacy</th><th>Current Plan</th><th>Since</th><th>Expires</th><th>Change Plan</th></tr>
                </thead>
                <tbody>
                  {filtered.map((s) => (
                    <tr key={s.pharmacyId}>
                      <td style={{ fontWeight: 600 }}>{s.pharmacyName}</td>
                      <td><span className={`badge ${PLAN_BADGE[s.plan] || "badge-gray"}`}>{s.plan}</span></td>
                      <td className="text-sm text-muted">
                        {s.subscribedAt ? new Date(s.subscribedAt).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td className="text-sm text-muted">
                        {s.expiresAt ? new Date(s.expiresAt).toLocaleDateString("en-IN") : "Lifetime"}
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ width: "auto", padding: "4px 10px", fontSize: 12 }}
                          value={s.plan}
                          onChange={(e) => dispatch(updatePharmacyPlan({ pharmacyId: s.pharmacyId, plan: e.target.value }))}
                        >
                          {PLANS.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BillingPanel;