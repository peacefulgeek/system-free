import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => { localStorage.setItem("cookie-consent", "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem("cookie-consent", "declined"); setVisible(false); };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-liberty/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-white/10">
        <p className="text-sm text-white/80 leading-relaxed mb-4">
          We use minimal cookies for analytics only. No tracking, no ads — just data to improve the content.
        </p>
        <div className="flex items-center gap-3">
          <button onClick={decline} className="text-sm text-white/50 hover:text-white/80 transition-colors px-3 py-2">
            Decline
          </button>
          <button onClick={accept} className="flex-1 px-5 py-2.5 text-sm font-semibold bg-health text-white rounded-lg hover:bg-health-dark transition-colors shadow-md">
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
