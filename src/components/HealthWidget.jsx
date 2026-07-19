const HealthWidget = ({ label, status, value, icon }) => {
  const statusMap = {
    ok:      { cls: "ok",      text: "Healthy",  color: "#1D9E75" },
    warning: { cls: "warning", text: "Degraded", color: "#EF9F27" },
    error:   { cls: "error",   text: "Down",     color: "#E24B4A" },
  };

  const s = statusMap[status] || statusMap.ok;

  return (
    <div className="card" style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 28 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>{label}</div>
        <div className="flex items-center gap-2">
          <span className={`health-dot ${s.cls}`} />
          <span className="text-sm" style={{ color: s.color, fontWeight: 600 }}>
            {s.text}
          </span>
        </div>
      </div>
      {value && (
        <div style={{ textAlign: "right" }}>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{value}</div>
        </div>
      )}
    </div>
  );
};

export default HealthWidget;