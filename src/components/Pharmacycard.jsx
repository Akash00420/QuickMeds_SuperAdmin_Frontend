import { useDispatch } from "react-redux";
import { verifyPharmacy, deactivatePharmacy } from "../Reducer/PharmacySlice";

const statusOf = (p) => {
  if (!p.isActive) return "suspended";
  if (!p.isVerified) return "pending";
  return "verified";
};

const PharmacyCard = ({ pharmacy }) => {
  const dispatch = useDispatch();
  const status = statusOf(pharmacy);

  return (
    <div className={`pharmacy-card status-${status}`}>
      <div className="pharmacy-card-top">
        <div>
          <div className="pharmacy-card-name">{pharmacy.name}</div>
          <div className="pharmacy-card-loc">
            📍 {pharmacy.address?.city}
            {pharmacy.address?.state ? `, ${pharmacy.address.state}` : ""}
          </div>
        </div>
        <div className="pharmacy-card-status-badges">
          <span className={`badge ${pharmacy.isVerified ? "badge-green" : "badge-amber"}`}>
            {pharmacy.isVerified ? "Verified" : "Pending"}
          </span>
          <span className={`badge ${pharmacy.isActive ? "badge-green" : "badge-red"}`}>
            {pharmacy.isActive ? "Active" : "Suspended"}
          </span>
        </div>
      </div>

      <div className="pharmacy-card-meta">
        <div>
          <div className="pharmacy-card-meta-label">Owner</div>
          <div className="pharmacy-card-meta-value">{pharmacy.owner?.email || "—"}</div>
        </div>
        <div>
          <div className="pharmacy-card-meta-label">Medicines</div>
          <div className="pharmacy-card-meta-value">{pharmacy.medicineCount ?? 0} SKUs</div>
        </div>
      </div>

      <div className="pharmacy-card-actions">
        {!pharmacy.isVerified && (
          <button
            className="btn btn-teal btn-sm"
            onClick={() => dispatch(verifyPharmacy({ pharmacyId: pharmacy._id, approve: true }))}
          >
            ✓ Verify
          </button>
        )}
        {pharmacy.isVerified && (
          <button
            className="btn btn-outline btn-sm"
            onClick={() => dispatch(verifyPharmacy({ pharmacyId: pharmacy._id, approve: false }))}
          >
            Revoke
          </button>
        )}
        {pharmacy.isActive && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              if (window.confirm(`Deactivate ${pharmacy.name}?`)) {
                dispatch(deactivatePharmacy(pharmacy._id));
              }
            }}
          >
            Ban
          </button>
        )}
      </div>
    </div>
  );
};

export default PharmacyCard;