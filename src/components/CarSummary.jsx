export default function CarSummary() {
  return (
    <div className="cl-car-summary">
      <div className="cl-car-img">🚗</div>
      <div className="cl-car-info">
        <h3>Toyota Corolla Auto</h3>
        <p>Automatique · Blanc · 5 places · 470L</p>
        <p style={{ marginTop: 4, fontSize: 11, color: "#666" }}>200 km inclus · 20 DA/km supp.</p>
      </div>
      <div className="cl-car-price">
        <strong>4 350</strong>
        <span>DA/jour</span>
      </div>
    </div>
  );
}