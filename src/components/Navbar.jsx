import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <nav className="cl-nav">
      <div className="cl-logo">
        <img src="/logo.png" alt="CARLOC" style={{ height: 44, objectFit: "contain" }} />
      </div>
      <div className="cl-nav-links">
        <a href="/">Accueil</a>
        <a href="#">Login</a>
        <button
          onClick={() => navigate(isAdmin ? "/" : "/admin")}
          style={{
            background: isAdmin ? "var(--orange-dim)" : "var(--card2)",
            border: `1px solid ${isAdmin ? "var(--orange)" : "var(--border)"}`,
            color: isAdmin ? "var(--orange)" : "var(--text-muted)",
            borderRadius: "var(--radius-full)",
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "var(--font-body)",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: "all 0.2s",
          }}
        >
          {isAdmin ? "← Client" : "▦ Admin"}
        </button>
        <button
          className="cl-theme-toggle"
          onClick={() => {
            const html = document.documentElement;
            html.dataset.theme = html.dataset.theme === "light" ? "" : "light";
          }}
          title="Changer le thème"
        >
          🌙
        </button>
      </div>
    </nav>
  );
}
