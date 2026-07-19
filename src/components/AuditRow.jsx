const ACTION_ICON = {
  pharmacy_approved: "✅",
  pharmacy_rejected: "❌",
  user_deactivated:  "🚫",
  user_restored:     "♻️",
  admin_created:     "👤",
  admin_suspended:   "⏸️",
  flag_toggled:      "🚩",
  restock_sent:      "📦",
};

const AuditRow = ({ log }) => (
  <tr>
    <td className="text-sm text-muted">
      {log.createdAt ? new Date(log.createdAt).toLocaleString("en-IN") : "—"}
    </td>
    <td>
      <span style={{ marginRight: 6 }}>{ACTION_ICON[log.action] || "📝"}</span>
      <span style={{ fontWeight: 600 }}>{log.action?.replace(/_/g, " ")}</span>
    </td>
    <td>
      <div>{log.performedBy?.name || "—"}</div>
      <div className="text-sm text-muted">{log.performedBy?.email}</div>
    </td>
    <td className="text-sm">{log.targetType || "—"}</td>
    <td
      className="text-sm text-muted"
      style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
    >
      {log.details || "—"}
    </td>
  </tr>
);

export default AuditRow;