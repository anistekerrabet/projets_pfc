import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PAY_METHODS } from "../constants";
import PanelCCP from "../components/payment/PanelCCP";
import { PanelEdahabia, PanelCIB, PanelCash } from "../components/payment/PanelOthers";

export default function PaymentPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [payMethod, setPayMethod] = useState("ccp");

  if (!state) {
    navigate("/");
    return null;
  }

  const { days, totalEUR, totalDZD, bookingRef } = state;

  const handleConfirm = () => {
    navigate("/confirmation", { state: { bookingRef } });
  };

  return (
    <div>
      <button className="cl-btn-secondary" onClick={() => navigate("/")}>← Retour</button>
      <div className="cl-section-title">Mode de <span>Paiement</span></div>
      <div className="cl-info-note">
        💡 Tous les paiements sont sécurisés. Le paiement en ligne est disponible via CCP (Carte CIB/EDAHABIA) ou virement CCP.
      </div>

      {/* Méthodes */}
      <div className="cl-card">
        <div className="cl-card-header">Choisir votre mode de paiement</div>
        <div className="cl-pay-methods">
          {PAY_METHODS.map(({ id, icon, label, sub }) => (
            <div
              key={id}
              className={`cl-pay-method ${payMethod === id ? "selected" : ""}`}
              onClick={() => setPayMethod(id)}
            >
              <div className="cl-pm-icon">{icon}</div>
              <div>
                <div className="cl-pm-label">{label}</div>
                <div className="cl-pm-sub">{sub}</div>
              </div>
              {payMethod === id && <div className="cl-pm-check">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {payMethod === "ccp"      && <PanelCCP      totalDZD={totalDZD} bookingRef={bookingRef} />}
      {payMethod === "edahabia" && <PanelEdahabia />}
      {payMethod === "cib"      && <PanelCIB />}
      {payMethod === "cash"     && <PanelCash     totalDZD={totalDZD} />}

      {/* Récap final */}
      <div className="cl-card">
        <div className="cl-card-header">Récapitulatif final</div>
        <div className="cl-summary-lines">
          <div className="cl-summary-line"><span>Toyota Corolla Auto</span><span>{days} j × 30€</span></div>
          <div className="cl-summary-line"><span>Assurance</span><span style={{ color: "var(--success)" }}>Incluse</span></div>
          <div className="cl-summary-line total">
            <span>Montant total</span>
            <span className="amount">{totalEUR}€ ≈ {totalDZD.toLocaleString()} DZD</span>
          </div>
        </div>
      </div>

      <button className="cl-btn-primary" onClick={handleConfirm}>🔒 Confirmer et réserver</button>
    </div>
  );
}
