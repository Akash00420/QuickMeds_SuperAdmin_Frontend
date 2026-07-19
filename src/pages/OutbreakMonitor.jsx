import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOutbreakData, getDemandSpikes, sendRestockAlert } from "../Reducer/AnalyticsSlice";
import OutbreakCard from "../components/OutbreakCard";
import Loader from "../components/Loader";

const OutbreakMonitor = () => {
  const dispatch = useDispatch();
  const { outbreakAlerts, demandSpikes, loading } = useSelector((s) => s.analytics);

  useEffect(() => {
    dispatch(getOutbreakData());
    dispatch(getDemandSpikes());
  }, []);

  const handleSendRestock = (alert) => {
    if (window.confirm(`Send restock alert for ${alert.medicineCategory} to ${alert.affectedPharmacies} pharmacies?`)) {
      dispatch(sendRestockAlert({
        medicineCategory: alert.medicineCategory,
        region:           alert.region,
      }));
    }
  };

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">Outbreak Monitor</div>
          <div className="page-subtitle">AI-powered demand spike detection across the platform</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => { dispatch(getOutbreakData()); dispatch(getDemandSpikes()); }}>
          ↻ Refresh
        </button>
      </div>

      {loading ? <Loader text="Analyzing demand patterns..." /> : (
        <>
          {/* Active outbreak alerts */}
          <div className="section-header">
            <div className="section-title">🚨 Active Outbreak Alerts ({outbreakAlerts.length})</div>
          </div>

          {outbreakAlerts.length === 0 ? (
            <div className="card mb-6" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <div style={{ fontWeight: 600, color: "#64748B" }}>No active outbreak alerts</div>
              <div className="text-sm text-muted">Demand patterns are within normal range.</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 28 }}>
              {outbreakAlerts.map((alert, i) => (
                <OutbreakCard key={i} alert={alert} onSendRestock={handleSendRestock} />
              ))}
            </div>
          )}

          {/* Demand spikes table */}
          <div className="section-header mt-4">
            <div className="section-title">📊 Demand Spikes — Last 30 Days</div>
          </div>

          {demandSpikes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <div className="empty-state-title">No demand spike data yet</div>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Medicine</th><th>Category</th><th>Region</th><th>Spike</th><th>Peak Date</th><th>Pharmacies</th></tr>
                </thead>
                <tbody>
                  {demandSpikes.map((spike, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{spike.medicineName}</td>
                      <td><span className="badge badge-blue">{spike.category}</span></td>
                      <td>{spike.region}</td>
                      <td><span className="text-red font-bold">+{spike.percentIncrease}%</span></td>
                      <td className="text-sm text-muted">
                        {spike.peakDate ? new Date(spike.peakDate).toLocaleDateString("en-IN") : "—"}
                      </td>
                      <td>{spike.affectedPharmacies}</td>
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

export default OutbreakMonitor;