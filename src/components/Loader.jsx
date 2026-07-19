const Loader = ({ small = false, text = "" }) => (
  <div className="loader-wrap">
    <div style={{ textAlign: "center" }}>
      <div className={small ? "loader loader-sm" : "loader"} />
      {text && <p className="text-muted mt-2" style={{ fontSize: 13 }}>{text}</p>}
    </div>
  </div>
);

export default Loader;