import { useState } from "react";

export function PanelEdahabia() {
  const [card, setCard] = useState("");
  const formatCard = (v) => v.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
  return (
    <div className="cl-card">
      <div className="cl-card-header">Carte EDAHABIA</div>
      <div className="cl-info-note">Vous serez redirigé vers le portail de paiement sécurisé d'Algérie Poste pour finaliser votre paiement.</div>
      <div className="cl-form-row cl-form-single">
        <div className="cl-form-group">
          <label className="cl-label">N° Carte EDAHABIA (16 chiffres)</label>
          <input className="cl-input" type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} value={card} onChange={(e) => setCard(formatCard(e.target.value))} />
        </div>
      </div>
      <div className="cl-form-row">
        <div className="cl-form-group">
          <label className="cl-label">Date d'expiration</label>
          <input className="cl-input" type="text" placeholder="MM/AA" maxLength={5} />
        </div>
        <div className="cl-form-group">
          <label className="cl-label">Code PIN (4 chiffres)</label>
          <input className="cl-input" type="password" placeholder="••••" maxLength={4} />
        </div>
      </div>
    </div>
  );
}

export function PanelCIB() {
  const [card, setCard] = useState("");
  const formatCard = (v) => v.replace(/\D/g, "").substring(0, 16).replace(/(.{4})/g, "$1 ").trim();
  return (
    <div className="cl-card">
      <div className="cl-card-header">Carte CIB</div>
      <div className="cl-info-note">Paiement sécurisé par carte interbancaire algérienne (réseau SATIM).</div>
      <div className="cl-form-row cl-form-single">
        <div className="cl-form-group">
          <label className="cl-label">N° Carte CIB (16 chiffres)</label>
          <input className="cl-input" type="text" placeholder="XXXX XXXX XXXX XXXX" maxLength={19} value={card} onChange={(e) => setCard(formatCard(e.target.value))} />
        </div>
      </div>
      <div className="cl-form-row">
        <div className="cl-form-group">
          <label className="cl-label">Date d'expiration</label>
          <input className="cl-input" type="text" placeholder="MM/AA" maxLength={5} />
        </div>
        <div className="cl-form-group">
          <label className="cl-label">CVV</label>
          <input className="cl-input" type="password" placeholder="•••" maxLength={3} />
        </div>
      </div>
      <div className="cl-form-row cl-form-single">
        <div className="cl-form-group">
          <label className="cl-label">Nom sur la carte</label>
          <input className="cl-input" type="text" placeholder="NOM PRÉNOM" />
        </div>
      </div>
    </div>
  );
}

export function PanelCash({ totalDZD }) {
  return (
    <div className="cl-card">
      <div className="cl-card-header">Paiement en espèces</div>
      <div className="cl-info-note">
        Vous pouvez payer en espèces directement à notre agence lors de la prise en charge du véhicule.
        Un acompte de <strong style={{ color: "var(--orange)" }}>30%</strong> peut être demandé à la réservation.
      </div>
      <div className="cl-ccp-row" style={{ background: "var(--card2)", borderRadius: 10, padding: "12px 16px", marginTop: 8 }}>
        <span className="key">Montant total</span>
        <span className="val" style={{ color: "var(--orange)" }}>{totalDZD.toLocaleString()} DZD</span>
      </div>
    </div>
  );
}
