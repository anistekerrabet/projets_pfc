export default function Navbar() {
  return (
    <nav className="cl-nav">
      <div className="cl-logo"><span>◆</span>CARLOC</div>
      <div className="cl-nav-links">
        <a href="#">Accueil</a>
        <a href="#">Login</a>
        <a href="#" style={{ fontSize: 20 }}>☰</a>
      </div>
    </nav>
  );
}
