import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../Reducer/AuthSlice";

const LINKS = [
  { to: "/dashboard",     label: "Dashboard"  },
  { to: "/admins",        label: "Admins"     },
  { to: "/pharmacies",    label: "Pharmacies" },
  { to: "/users",         label: "Users"      },
  { to: "/outbreak",      label: "Outbreak"   },
  { to: "/billing",       label: "Billing"    },
  { to: "/feature-flags", label: "Flags"      },
  { to: "/system-health", label: "System"     },
  { to: "/audit-logs",    label: "Audit"      },
];

const Navbar = ({ onNotifOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);
  const { unreadCount } = useSelector((s) => s.notification);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "SA";

  return (
    <nav className="sa-navbar">
      <div className="flex items-center gap-3">
        <div className="navbar-logo">
          <div className="navbar-logo-mark">Q</div>
          <span>QuickMeds</span>
        </div>
        <span className="navbar-badge">SuperAdmin</span>
      </div>

      <div className="navbar-links">
        {LINKS.map((link) => (
          <button
            key={link.to}
            className={`navbar-link ${location.pathname === link.to ? "active" : ""}`}
            onClick={() => navigate(link.to)}
          >
            {link.label}
          </button>
        ))}
      </div>

      <div className="navbar-right">
        <button className="notif-btn" onClick={onNotifOpen}>
          🔔
          {unreadCount > 0 && (
            <span className="notif-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </button>
        <button className="avatar-btn" title={user?.name || "SuperAdmin"}>
          {initials}
        </button>
        <button
          className="btn btn-ghost btn-sm"
          style={{ color: "#94A3B8" }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;