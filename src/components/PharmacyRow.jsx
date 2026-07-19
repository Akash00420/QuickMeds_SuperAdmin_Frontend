import { useDispatch } from "react-redux";
import { verifyPharmacy, deactivatePharmacy } from "../Reducer/PharmacySlice";

const PharmacyRow = ({ pharmacy }) => {
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>{pharmacy.name}</div>
        <div className="text-sm text-muted">
          {pharmacy.address?.city}, {pharmacy.address?.state}
        </div>
      </td>
      <td>
        <div>{pharmacy.owner?.name || "—"}</div>
        <div className="text-sm text-muted">{pharmacy.owner?.email}</div>
      </td>
      <td>
        <span className={`badge ${pharmacy.isVerified ? "badge-green" : "badge-amber"}`}>
          {pharmacy.isVerified ? "Verified" : "Pending"}
        </span>
      </td>
      <td>
        <span className={`badge ${pharmacy.isActive ? "badge-green" : "badge-red"}`}>
          {pharmacy.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td>{pharmacy.medicineCount || 0}</td>
      <td>
        <div className="flex gap-2">
          {!pharmacy.isVerified && (
            <button
              className="btn btn-sm btn-teal"
              onClick={() =>
                dispatch(verifyPharmacy({ pharmacyId: pharmacy._id, approve: true }))
              }
            >
              ✓ Verify
            </button>
          )}
          {pharmacy.isVerified && (
            <button
              className="btn btn-sm btn-ghost"
              onClick={() =>
                dispatch(verifyPharmacy({ pharmacyId: pharmacy._id, approve: false }))
              }
            >
              Revoke
            </button>
          )}
          {pharmacy.isActive && (
            <button
              className="btn btn-sm btn-danger"
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
      </td>
    </tr>
  );
};

export default PharmacyRow;