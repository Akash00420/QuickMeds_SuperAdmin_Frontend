import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers } from "../Reducer/UserSlice";
import UserRow from "../components/UserRow";
import Loader from "../components/Loader";

const UserControl = () => {
  const dispatch = useDispatch();
  const { users, total, loading } = useSelector((s) => s.user);
  const [roleFilter, setRoleFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(getAllUsers()); }, []);

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === "all" || u.role === roleFilter;
    const matchSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const counts = {
    all:        users.length,
    user:       users.filter((u) => u.role === "user").length,
    pharmacist: users.filter((u) => u.role === "pharmacist").length,
    admin:      users.filter((u) => u.role === "admin").length,
  };

  return (
    <div className="sa-main">
      <div className="page-header">
        <div>
          <div className="page-title">User Management</div>
          <div className="page-subtitle">{total || users.length} total accounts</div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => dispatch(getAllUsers())}>
          ↻ Refresh
        </button>
      </div>

      <div className="tabs">
        {["all", "user", "pharmacist", "admin"].map((r) => (
          <button key={r} className={`tab-btn ${roleFilter === r ? "active" : ""}`}
            onClick={() => setRoleFilter(r)}>
            {r.charAt(0).toUpperCase() + r.slice(1)} ({counts[r] || 0})
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by name or email..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <Loader text="Loading users..." /> : (
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <div className="empty-state-title">No users found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Role</th><th>Phone</th><th>Status</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((u) => <UserRow key={u._id} user={u} />)}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default UserControl;