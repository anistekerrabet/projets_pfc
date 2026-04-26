import { useState } from "react";
import CopyBtn from "../CopyBtn";

export default function PanelCCP({ totalDZD, bookingRef }) {
  const [fileName, setFileName] = useState(null);
  return (
    <div>
      <div className="cl-ccp-info">
        <h4>💳 Paiement par CCP <span className="cl-ccp-badge">Algérie Poste</span></h4>
        <div className="cl-ccp-details">
          {[
            { key: "N° Compte CCP",    val: "1234567 clé 89" },
            { key: "Nom bénéficiaire", val: "CARLOC SARL" },
          ].map(({ key, val }) => (
            <div className="cl-ccp-row" key={key}>
              <span className="key">{key}</span>
              <span className="val">{val} <CopyBtn text={val} /></span>
            </div>
          ))}
          <div className="cl-ccp-row">
            <span className="key">Montant à virer</span>
            <span className="val" style={{ color: "var(--orange)" }}>{totalDZD.toLocaleString()} DZD</span>
          </div>
          <div className="cl-ccp-row">
            <span className="key">Motif du virement</span>
            <span className="val">{bookingRef} <CopyBtn text={bookingRef} /></span>
          </div>
        </div>
        <div className="cl-ccp-steps">
          <p>Comment procéder :</p>
          {[
            <>Rendez-vous sur l'application <strong>Baridi Mob</strong> ou dans n'importe quel bureau de poste</>,
            <>Effectuez le virement vers le compte <strong>CCP 1234567 clé 89</strong> au nom de CARLOC SARL</>,
            <>Indiquez comme motif votre <strong>numéro de référence</strong> (généré ci-dessous)</>,
            <>Téléchargez le <strong>reçu de virement</strong> et joignez-le ci-dessous</>,
          ].map((txt, i) => (
            <div className="cl-ccp-step" key={i}>
              <div className="num">{i + 1}</div>
              <div className="txt">{txt}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="cl-card">
        <div className="cl-card-header">Joindre le reçu de virement</div>
        <div className="cl-upload-zone" onClick={() => document.getElementById("cl-file-input").click()}>
          <input
            type="file" id="cl-file-input" accept="image/*,.pdf" style={{ display: "none" }}
            onChange={(e) => e.target.files?.[0] && setFileName(e.target.files[0].name)}
          />
          <div className="icon">📎</div>
          <p>Cliquez pour télécharger votre reçu CCP</p>
          <div className="hint">JPG, PNG, PDF · Max 5 Mo</div>
        </div>
        {fileName && <div className="cl-uploaded-file">✅ {fileName}</div>}
      </div>
    </div>
  );
}
