export default function CarSummary() {
  return (
    <div className="cl-car-summary">
      <div className="cl-car-img">🚗</div>
      <div className="cl-car-info">
        <h3>Toyota Corolla Auto</h3>
        <p>Automatique · Blanc · 5 places · 470L</p>
        <p style={{ marginTop: 4, fontSize: 11, color: "#666" }}>200 km inclus · 0,20€/km supp.</p>
      </div>
      <div className="cl-car-price">
        <strong>30€</strong>
        <span>/jour</span>
      </div>
    </div>
  );
}
