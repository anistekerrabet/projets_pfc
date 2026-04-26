const STEPS = ["Véhicule", "Réservation", "Paiement", "Confirmation"];

export default function Stepper({ currentStep }) {
  return (
    <div className="cl-stepper">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const isDone   = num < currentStep;
        const isActive = num === currentStep;
        return (
          <div className="cl-step" key={num}>
            <div className={`cl-bubble ${isDone ? "done" : isActive ? "active" : ""}`}>
              {isDone ? "✓" : num}
            </div>
            <span className={`cl-slabel ${isActive ? "active" : ""}`}>{label}</span>
            {num < STEPS.length && (
              <div className={`cl-sline ${isDone ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
