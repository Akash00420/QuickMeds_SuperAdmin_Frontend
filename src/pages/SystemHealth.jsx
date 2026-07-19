import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSystemHealth } from "../Reducer/SystemSlice";
import HealthWidget from "../components/HealthWidget";
import Loader from "../components/Loader";

const SystemHealth = () => {
  const dispatch = useDispatch();
  const { health, loading } = useSelector((s) => s.system);

  useEffect(() => {
    dispatch(getSystemHealth());
    const interval = setInterval(() => dispatch(getSystemHealth()), 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">System Health</div>
          <div className="page-subtitle">Auto-refreshes every 30 seconds</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => dispatch(getSystemHealth())}>
          ↻ Refresh Now
        </button>
      </div>

      {loading && !health ? <Loader text="Checking system status..." /> : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24 }}>
            <HealthWidget icon="🗄️" label="MongoDB" status={health?.mongodb || "ok"} value={health?.mongodbPing ? `${health.mongodbPing}ms` : null} />
            <HealthWidget icon="🚀" label="Express Server" status={health?.server || "ok"} value={health?.uptime ? `${Math.floor(health.uptime / 3600)}h uptime` : null} />
            <HealthWidget icon="🔌" label="Socket.io" status={health?.socketio || "ok"} value={health?.socketConnections ? `${health.socketConnections} connections` : null} />
            <HealthWidget icon="☁️" label="Cloudinary" status={health?.cloudinary || "ok"} value={null} />
          </div>

          <div className="section-header">
            <div className="section-title">Platform Metrics</div>
          </div>

          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-icon icon-indigo">⚡</div>
              <div className="stat-label">Avg Response Time</div>
              <div className="stat-value">{health?.avgResponseTime ? `${health.avgResponseTime}ms` : "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-red">❌</div>
              <div className="stat-label">API Errors (24h)</div>
              <div className="stat-value">{health?.errorCount24h ?? "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-teal">📡</div>
              <div className="stat-label">Active Sockets</div>
              <div className="stat-value">{health?.socketConnections ?? "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon icon-blue">💾</div>
              <div className="stat-label">Memory Usage</div>
              <div className="stat-value">{health?.memoryUsageMB ? `${health.memoryUsageMB}MB` : "—"}</div>
            </div>
          </div>

          {health?.lastChecked && (
            <p className="text-sm text-muted mt-4">
              Last checked: {new Date(health.lastChecked).toLocaleString("en-IN")}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default SystemHealth;