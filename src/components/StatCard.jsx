const StatCard = ({ icon, label, value, sub, iconClass = "icon-indigo" }) => (
  <div className="stat-card">
    <div className={`stat-icon ${iconClass}`}>{icon}</div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value ?? "—"}</div>
    {sub && <div className="stat-sub">{sub}</div>}
  </div>
);

export default StatCard;