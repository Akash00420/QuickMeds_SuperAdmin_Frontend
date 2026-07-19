import { useDispatch } from "react-redux";
import { toggleUserStatus } from "../Reducer/UserSlice";

const ROLE_BADGE = {
  user:       "badge-blue",
  pharmacist: "badge-green",
  admin:      "badge-indigo",
  superadmin: "badge-indigo",
};

const UserRow = ({ user }) => {
  const dispatch = useDispatch();

  return (
    <tr>
      <td>
        <div style={{ fontWeight: 600 }}>{user.name}</div>
        <div className="text-sm text-muted">{user.email}</div>
      </td>
      <td>
        <span className={`badge ${ROLE_BADGE[user.role] || "badge-gray"}`}>
          {user.role}
        </span>
      </td>
      <td>{user.phone || "—"}</td>
      <td>
        <span className={`badge ${user.isActive ? "badge-green" : "badge-red"}`}>
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="text-sm text-muted">
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "—"}
      </td>
      <td>
        <button
          className={`btn btn-sm ${user.isActive ? "btn-danger" : "btn-teal"}`}
          onClick={() => dispatch(toggleUserStatus(user._id))}
          disabled={user.role === "superadmin"}
        >
          {user.isActive ? "Deactivate" : "Restore"}
        </button>
      </td>
    </tr>
  );
};

export default UserRow;