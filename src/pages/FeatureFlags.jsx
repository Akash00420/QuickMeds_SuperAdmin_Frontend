import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getFeatureFlags } from "../Reducer/FeatureFlagSlice";
import FeatureFlagRow from "../components/FeatureFlagRow";
import Loader from "../components/Loader";

const FeatureFlags = () => {
  const dispatch = useDispatch();
  const { flags, loading } = useSelector((s) => s.featureFlag);

  useEffect(() => { dispatch(getFeatureFlags()); }, []);

  const enabledCount = flags.filter((f) => f.enabled).length;

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">Feature Flags</div>
          <div className="page-subtitle">
            {flags.length} flags · {enabledCount} enabled · {flags.length - enabledCount} disabled
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => dispatch(getFeatureFlags())}>
          ↻ Refresh
        </button>
      </div>

      <div className="card mb-6" style={{ background: "#F5F3FF", border: "1.5px solid #C7D2FE" }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: 20 }}>⚠️</span>
          <div>
            <div style={{ fontWeight: 600, color: "#4338CA", fontSize: 13 }}>Live changes — no redeploy needed</div>
            <div className="text-sm text-muted">Toggling a flag takes effect immediately across all connected clients.</div>
          </div>
        </div>
      </div>

      {loading ? <Loader text="Loading feature flags..." /> : (
        flags.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚩</div>
            <div className="empty-state-title">No feature flags configured</div>
            <div className="empty-state-sub">Feature flags will appear here once added to the backend.</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Flag Key</th><th>Category</th><th>Enabled</th><th>Last Updated</th></tr>
              </thead>
              <tbody>
                {flags.map((f) => <FeatureFlagRow key={f.key} flag={f} />)}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default FeatureFlags;