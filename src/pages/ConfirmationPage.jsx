import { useLocation, useNavigate } from "react-router-dom";

export default function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    navigate("/");
    return null;
  }

  const { bookingRef } = state;

  return (
    <div className="cl-success">
      <div className="cl-success-icon">✅</div>
      <h2>Réservation <span>Confirmée !</span></h2>
      <p>
        Votre demande de réservation a été reçue avec succès.<br />
        Nous vous contacterons dans les <strong>24 heures</strong> pour confirmer
        votre réservation après vérification du paiement.
      </p>
      <div className="cl-booking-ref">
        <div className="lbl">Numéro de référence</div>
        <div className="ref">{bookingRef}</div>
      </div>
      <p style={{ fontSize: 11, color: "#555", marginBottom: 24 }}>
        Gardez ce numéro précieusement. Un SMS de confirmation vous sera envoyé.
      </p>
      <button className="cl-btn-primary" onClick={() => navigate("/")}>
        Nouvelle réservation
      </button>
    </div>
  );
}
