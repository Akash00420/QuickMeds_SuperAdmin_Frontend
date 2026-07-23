import { useNavigate } from "react-router-dom";

/**
 * Reusable back button — drop this at the top of any page.
 * Usage: <BackButton />          -> goes to previous history entry
 *        <BackButton to="/dashboard" /> -> goes to a specific route instead
 */
const BackButton = ({ to, label = "Back" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
    else navigate(-1);
  };

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={handleClick}
      style={{ marginBottom: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
    >
      ← {label}
    </button>
  );
};

export default BackButton;