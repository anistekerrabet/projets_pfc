import { useState } from "react";

export default function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button className="cl-copy-btn" onClick={handleCopy} style={copied ? { color: "var(--success)" } : {}}>
      {copied ? "✓ Copié" : "Copier"}
    </button>
  );
}
