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

  const accept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-liberty/95 backdrop-blur-sm border-t border-white/10">
      <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-white/80">
          We use cookies to improve your experience. No tracking, no ads — just
          analytics to make the content better.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={decline}
            className="text-sm text-white/50 hover:text-white/80 transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium bg-health text-white rounded-md hover:bg-health-dark transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
