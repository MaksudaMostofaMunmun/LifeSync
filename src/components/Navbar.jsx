import { Link, useLocation, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const linkStyle = (path) => ({
    color:
      location.pathname === path
        ? "#60a5fa"
        : "white",
    textDecoration: "none",
    fontWeight:
      location.pathname === path
        ? "bold"
        : "normal",
    transition: "0.3s",
  });

  return (
    <nav
      style={{
        background: "#1f2937",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
      }}
    >
      <h2
        style={{
          margin: 0,
        }}
      >
        🚀 LifeSync
      </h2>

      <div
        style={{
          display: "flex",
          gap: "25px",
          alignItems: "center",
        }}
      >
        <Link
          to="/dashboard"
          style={linkStyle("/dashboard")}
        >
          🏠 Dashboard
        </Link>

        <Link
          to="/bazaar"
          style={linkStyle("/bazaar")}
        >
          🛒 Bazaar
        </Link>

        <Link
          to="/study"
          style={linkStyle("/study")}
        >
          📚 Study
        </Link>

        <Link
          to="/expense"
          style={linkStyle("/expense")}
        >
          💰 Expense
        </Link>

        <Link
          to="/goals"
          style={linkStyle("/goals")}
        >
          🎯 Goals
        </Link>

        <button
          onClick={logout}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 15px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;