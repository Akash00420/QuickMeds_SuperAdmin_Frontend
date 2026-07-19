const URGENCY = {
  high:   { cls: "badge-red",   label: "High"   },
  medium: { cls: "badge-amber", label: "Medium" },
  low:    { cls: "badge-blue",  label: "Low"    },
};

const OutbreakCard = ({ alert, onSendRestock }) => {
  const urgency = URGENCY[alert.urgency] || URGENCY.medium;

  return (
    <div
      className="card"
      style={{
        borderLeft: `4px solid ${alert.urgency === "high" ? "#E24B4A" : "#EF9F27"}`,
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>🧪 {alert.medicineCategory}</div>
          <div className="text-sm text-muted">{alert.region}</div>
        </div>
        <span className={`badge ${urgency.cls}`}>{urgency.label} Urgency</span>
      </div>

      <div className="flex gap-3 mb-4" style={{ flexWrap: "wrap" }}>
        <div className="stat-card" style={{ flex: 1, minWidth: 120, padding: "12px 16px" }}>
          <div className="stat-label">Demand Spike</div>
          <div className="stat-value" style={{ fontSize: 20, color: "#E24B4A" }}>
            +{alert.percentIncrease}%
          </div>
        </div>
        <div className="stat-card" style={{ flex: 1, minWidth: 120, padding: "12px 16px" }}>
          <div className="stat-label">Pharmacies Affected</div>
          <div className="stat-value" style={{ fontSize: 20 }}>{alert.affectedPharmacies}</div>
        </div>
        <div className="stat-card" style={{ flex: 1, minWidth: 120, padding: "12px 16px" }}>
          <div className="stat-label">Detected</div>
          <div className="stat-value" style={{ fontSize: 14, fontWeight: 600 }}>
            {alert.detectedAt
              ? new Date(alert.detectedAt).toLocaleDateString("en-IN")
              : "—"}
          </div>
        </div>
      </div>

      <button className="btn btn-primary btn-sm" onClick={() => onSendRestock?.(alert)}>
        📦 Send Restock Alert
      </button>
    </div>
  );
};

export default OutbreakCard;