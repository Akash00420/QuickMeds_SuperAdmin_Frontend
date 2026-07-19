import { useDispatch } from "react-redux";
import { toggleAdminStatus, deleteAdmin } from "../Reducer/AdminSlice";

const AdminCard = ({ admin }) => {
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>{admin.name}</div>
        <div className="text-sm text-muted">{admin.email}</div>
      </td>
      <td>{admin.phone || "—"}</td>
      <td>
        <span className={`badge ${admin.isActive ? "badge-green" : "badge-red"}`}>
          {admin.isActive ? "Active" : "Suspended"}
        </span>
      </td>
      <td className="text-sm text-muted">
        {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString("en-IN") : "—"}
      </td>
      <td>
        <div className="flex gap-2">
          <button
            className={`btn btn-sm ${admin.isActive ? "btn-danger" : "btn-teal"}`}
            onClick={() =>
              dispatch(toggleAdminStatus({ adminId: admin._id, isActive: !admin.isActive }))
            }
          >
            {admin.isActive ? "Suspend" : "Restore"}
          </button>
          <button
            className="btn btn-sm btn-ghost"
            onClick={() => {
              if (window.confirm(`Delete admin ${admin.name}? This cannot be undone.`)) {
                dispatch(deleteAdmin(admin._id));
              }
            }}
          >
            🗑️
          </button>
        </div>
      </td>
    </tr>
  );
};

export default AdminCard;