import { useDispatch } from "react-redux";
import { toggleFeatureFlag } from "../Reducer/FeatureFlagSlice";

const FeatureFlagRow = ({ flag }) => {
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600, fontFamily: "monospace" }}>{flag.key}</div>
        <div className="text-sm text-muted">{flag.description}</div>
      </td>
      <td>
        <span className={`badge ${flag.category === "core" ? "badge-indigo" : "badge-gray"}`}>
          {flag.category || "general"}
        </span>
      </td>
      <td>
        <label className="toggle">
          <input
            type="checkbox"
            checked={flag.enabled}
            onChange={() =>
              dispatch(toggleFeatureFlag({ key: flag.key, enabled: !flag.enabled }))
            }
          />
          <span className="toggle-slider" />
        </label>
      </td>
      <td className="text-sm text-muted">
        {flag.updatedAt ? new Date(flag.updatedAt).toLocaleString("en-IN") : "—"}
      </td>
    </tr>
  );
};

export default FeatureFlagRow;