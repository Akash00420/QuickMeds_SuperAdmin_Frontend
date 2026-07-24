import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const NAV_ITEMS = [
  { to: "/dashboard",  icon: "▦", label: "Home" },
  { to: "/pharmacies", icon: "🏥", label: "Pharmacies" },
  { to: "/admins",     icon: "🛡️", label: "Admin" },
  { to: "/notifications", icon: "🔔", label: "Alerts" },
];

const initials = (name = "") =>
  name.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");

const AppShell = () => {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.auth);

  return (
    <div className="app-shell">
      <div className="app-topbar">
        <button className="app-brand" onClick={() => navigate("/dashboard")}>
          <span className="app-avatar">{initials(user?.name) || "S"}</span>
          <span className="app-brand-name">PharmaControl</span>
        </button>
        <button className="app-settings-btn" title="Settings">⚙️</button>
      </div>

      <div className="app-body">
        <Outlet />
      </div>

      <nav className="bottom-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `bottom-nav-item ${isActive ? "active" : ""}`}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AppShell;