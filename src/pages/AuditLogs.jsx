import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuditLogs } from "../Reducer/SystemSlice";
import AuditRow from "../components/AuditRow";
import Loader from "../components/Loader";

const ACTION_TYPES = ["all", "pharmacy_approved", "pharmacy_rejected", "user_deactivated", "admin_created", "flag_toggled", "restock_sent"];

const AuditLogs = () => {
  const dispatch = useDispatch();
  const { auditLogs, loading } = useSelector((s) => s.system);
  const [actionFilter, setActionFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(getAuditLogs()); }, []);

  const filtered = auditLogs.filter((log) => {
    const matchAction = actionFilter === "all" || log.action === actionFilter;
    const matchSearch =
      log.performedBy?.name?.toLowerCase().includes(search.toLowerCase()) ||
      log.action?.toLowerCase().includes(search.toLowerCase());
    return matchAction && matchSearch;
  });

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">Audit Logs</div>
          <div className="page-subtitle">{auditLogs.length} recorded actions</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => dispatch(getAuditLogs())}>
          ↻ Refresh
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by admin name or action..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select
          className="form-select"
          style={{ width: "auto", minWidth: 180 }}
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
        >
          {ACTION_TYPES.map((a) => (
            <option key={a} value={a}>
              {a === "all" ? "All actions" : a.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      {loading ? <Loader text="Loading audit logs..." /> : (
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <div className="empty-state-title">No audit logs found</div>
            <div className="empty-state-sub">Admin actions will be recorded here automatically.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Time</th><th>Action</th><th>Performed By</th><th>Target</th><th>Details</th></tr>
              </thead>
              <tbody>
                {filtered.map((log, i) => <AuditRow key={i} log={log} />)}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default AuditLogs;