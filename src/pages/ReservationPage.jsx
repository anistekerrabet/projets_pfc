import { useNavigate } from "react-router-dom";
import { WILAYAS, PRICE_PER_DAY, EUR_TO_DZD } from "../constants";
import CarSummary from "../components/CarSummary";

export default function ReservationPage({ booking, setBooking }) {
  const navigate = useNavigate();

  const { dateStart, dateEnd, wilaya, pickup, dropoff, prenom, nom, tel, email, permis } = booking;

  const days = (() => {
    if (!dateStart || !dateEnd) return 0;
    const d = Math.ceil((new Date(dateEnd) - new Date(dateStart)) / 86400000);
    return d > 0 ? d : 0;
  })();

  const totalEUR = PRICE_PER_DAY * days;
  const totalDZD = Math.round(totalEUR * EUR_TO_DZD);

  const fmt = (d) => new Date(d).toLocaleDateString("fr-DZ", { day: "2-digit", month: "short", year: "numeric" });
  const today = new Date().toISOString().split("T")[0];
  const set = (key) => (e) => setBooking((b) => ({ ...b, [key]: e.target.value }));

  const handleNext = () => {
    if (days <= 0) { alert("Veuillez sélectionner vos dates de location."); return; }
    const ref = "CARLOC-" + Math.random().toString(36).substr(2, 6).toUpperCase();
    navigate("/payment", { state: { days, totalEUR, totalDZD, bookingRef: ref } });
  };

  return (
    <div>
      <div className="cl-section-title">Votre <span>Réservation</span></div>
      <CarSummary />

      {/* Dates */}
      <div className="cl-card">
        <div className="cl-card-header">Dates de location</div>
        <div className="cl-form-row">
          <div className="cl-form-group">
            <label className="cl-label">Date de départ</label>
            <input className="cl-input" type="date" min={today} value={dateStart} onChange={set("dateStart")} />
          </div>
          <div className="cl-form-group">
            <label className="cl-label">Date de retour</label>
            <input className="cl-input" type="date" min={today} value={dateEnd} onChange={set("dateEnd")} />
          </div>
        </div>
        {days > 0 && (
          <div className="cl-date-range">
            <div className="cl-date-box"><div className="lbl">Départ</div><div className="val">{fmt(dateStart)}</div></div>
            <div className="cl-date-arrow">→</div>
            <div className="cl-date-box"><div className="lbl">Retour</div><div className="val">{fmt(dateEnd)}</div></div>
            <div className="cl-nights-badge">{days} jour{days > 1 ? "s" : ""}</div>
          </div>
        )}
      </div>

      {/* Lieu */}
      <div className="cl-card">
        <div className="cl-card-header">Lieu de prise en charge</div>
        <div className="cl-form-row cl-form-single">
          <div className="cl-form-group">
            <label className="cl-label">Wilaya</label>
            <select className="cl-select" value={wilaya} onChange={set("wilaya")}>
              <option value="">Sélectionner...</option>
              {WILAYAS.map((w) => <option key={w}>{w}</option>)}
            </select>
          </div>
        </div>
        <div className="cl-form-row">
          <div className="cl-form-group">
            <label className="cl-label">Lieu de prise en charge</label>
            <select className="cl-select" value={pickup} onChange={set("pickup")}>
              <option>Agence principale</option>
              <option>Aéroport</option>
              <option>Livraison à domicile (+500 DA)</option>
            </select>
          </div>
          <div className="cl-form-group">
            <label className="cl-label">Lieu de restitution</label>
            <select className="cl-select" value={dropoff} onChange={set("dropoff")}>
              <option>Même lieu</option>
              <option>Agence principale</option>
              <option>Aéroport</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conducteur */}
      <div className="cl-card">
        <div className="cl-card-header">Informations conducteur</div>
        <div className="cl-form-row">
          <div className="cl-form-group">
            <label className="cl-label">Prénom</label>
            <input className="cl-input" type="text" placeholder="Prénom" value={prenom} onChange={set("prenom")} />
          </div>
          <div className="cl-form-group">
            <label className="cl-label">Nom</label>
            <input className="cl-input" type="text" placeholder="Nom de famille" value={nom} onChange={set("nom")} />
          </div>
        </div>
        <div className="cl-form-row">
          <div className="cl-form-group">
            <label className="cl-label">N° de téléphone</label>
            <input className="cl-input" type="tel" placeholder="05 XX XX XX XX" value={tel} onChange={set("tel")} />
          </div>
          <div className="cl-form-group">
            <label className="cl-label">Email</label>
            <input className="cl-input" type="email" placeholder="votre@email.com" value={email} onChange={set("email")} />
          </div>
        </div>
        <div className="cl-form-row cl-form-single">
          <div className="cl-form-group">
            <label className="cl-label">N° permis de conduire</label>
            <input className="cl-input" type="text" placeholder="Ex: 16 123456789" value={permis} onChange={set("permis")} />
          </div>
        </div>
      </div>

      {/* Récap */}
      {days > 0 && (
        <div className="cl-card">
          <div className="cl-card-header">Récapitulatif</div>
          <div className="cl-summary-lines">
            <div className="cl-summary-line"><span>Toyota Corolla Auto</span><span>30€/jour</span></div>
            <div className="cl-summary-line"><span>{days} jour(s) × 30€</span><span>{totalEUR}€</span></div>
            <div className="cl-summary-line"><span>Assurance incluse</span><span style={{ color: "var(--success)" }}>✓ Incluse</span></div>
            <div className="cl-summary-line total">
              <span>Total à payer</span>
              <span className="amount">{totalEUR}€ ≈ {totalDZD.toLocaleString()} DZD</span>
            </div>
          </div>
        </div>
      )}

      <button className="cl-btn-primary" onClick={handleNext}>
        Continuer vers le paiement →
      </button>
    </div>
  );
}
