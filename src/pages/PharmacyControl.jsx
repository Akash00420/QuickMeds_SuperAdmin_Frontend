import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPharmacies } from "../Reducer/PharmacySlice";
import PharmacyCard from "../components/PharmacyCard";
import Loader from "../components/Loader";

const FILTERS = [
  { key: "all",      label: "All Pharmacies" },
  { key: "verified", label: "Verified" },
  { key: "pending",  label: "Pending" },
  { key: "inactive", label: "Suspended" },
];

const PharmacyControl = () => {
  const dispatch = useDispatch();
  const { pharmacies, total, loading } = useSelector((s) => s.pharmacy);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => { dispatch(getAllPharmacies()); }, []);

  const verifiedCount  = pharmacies.filter((p) => p.isVerified && p.isActive).length;
  const pendingCount   = pharmacies.filter((p) => !p.isVerified).length;
  const suspendedCount = pharmacies.filter((p) => !p.isActive).length;

  const filtered = pharmacies.filter((p) => {
    const matchFilter =
      filter === "all"      ? true :
      filter === "pending"  ? !p.isVerified :
      filter === "verified" ? p.isVerified && p.isActive :
      filter === "inactive" ? !p.isActive : true;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.name?.toLowerCase().includes(q) ||
      p.owner?.name?.toLowerCase().includes(q) ||
      p.owner?.email?.toLowerCase().includes(q) ||
      p.address?.city?.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  return (
    <div className="sa-main">
      <div style={{ marginBottom: 18 }}>
        <div className="page-title">Manage Pharmacies</div>
        <div className="page-subtitle">
          Review, verify, and manage clinical pharmacy partners across the network.
        </div>
      </div>

      {/* Network summary strip */}
      <div className="network-strip">
        <div className="network-strip-item">
          <div className="network-strip-value">{total || pharmacies.length}</div>
          <div className="network-strip-label">Total</div>
        </div>
        <div className="network-strip-item">
          <div className="network-strip-value" style={{ color: "#0F6E56" }}>{verifiedCount}</div>
          <div className="network-strip-label">Verified</div>
        </div>
        <div className="network-strip-item">
          <div className="network-strip-value" style={{ color: "#854F0B" }}>{pendingCount}</div>
          <div className="network-strip-label">Pending</div>
        </div>
        <div className="network-strip-item">
          <div className="network-strip-value" style={{ color: "#A32D2D" }}>{suspendedCount}</div>
          <div className="network-strip-label">Suspended</div>
        </div>
      </div>

      {/* Search */}
      <div className="search-input-wrap mb-4" style={{ width: "100%" }}>
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search by name, owner, or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Filter chips */}
      <div className="chip-row">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            className={`chip ${filter === f.key ? "active" : ""}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key === "pending" && pendingCount > 0 && ` (${pendingCount})`}
          </button>
        ))}
      </div>

      <button
        className="btn btn-outline btn-sm mb-4"
        onClick={() => dispatch(getAllPharmacies())}
      >
        ↻ Refresh
      </button>

      {loading ? (
        <Loader text="Loading pharmacies..." />
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏥</div>
          <div className="empty-state-title">No pharmacies found</div>
          <div className="empty-state-sub">
            {search ? "Try a different search term." : "Nothing matches this filter yet."}
          </div>
        </div>
      ) : (
        <div>
          {filtered.map((p) => (
            <PharmacyCard key={p._id} pharmacy={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PharmacyControl;