import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPharmacies } from "../Reducer/PharmacySlice";
import PharmacyRow from "../components/PharmacyRow";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

const PharmacyControl = () => {
  const dispatch = useDispatch();
  const { pharmacies, total, loading } = useSelector((s) => s.pharmacy);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(getAllPharmacies()); }, []);

  const filtered = pharmacies.filter((p) => {
    const matchFilter =
      filter === "all"      ? true :
      filter === "pending"  ? !p.isVerified :
      filter === "verified" ? p.isVerified && p.isActive :
      filter === "inactive" ? !p.isActive : true;
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.city?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="sa-main">
      <BackButton to="/dashboard" />

      <div className="page-header">
        <div>
          <div className="page-title">Pharmacy Control</div>
          <div className="page-subtitle">
            {total || pharmacies.length} total ·{" "}
            {pharmacies.filter((p) => !p.isVerified).length} pending verification
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => dispatch(getAllPharmacies())}>
          ↻ Refresh
        </button>
      </div>

      <div className="tabs">
        {["all", "pending", "verified", "inactive"].map((f) => (
          <button key={f} className={`tab-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
            {f === "pending" && pharmacies.filter((p) => !p.isVerified).length > 0 && (
              <span className="badge badge-amber" style={{ marginLeft: 6 }}>
                {pharmacies.filter((p) => !p.isVerified).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="filter-bar">
        <div className="search-input-wrap">
          <span className="search-icon">🔍</span>
          <input className="search-input" placeholder="Search by name or city..."
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {loading ? <Loader text="Loading pharmacies..." /> : (
        filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏥</div>
            <div className="empty-state-title">No pharmacies found</div>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Pharmacy</th><th>Owner</th><th>Verified</th>
                  <th>Status</th><th>Medicines</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => <PharmacyRow key={p._id} pharmacy={p} />)}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default PharmacyControl;