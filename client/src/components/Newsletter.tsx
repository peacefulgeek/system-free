import { useState } from "react";

const BUNNY_STORAGE_URL = "https://ny.storage.bunnycdn.com/system-free/data/subscribers.jsonl";
const BUNNY_ACCESS_KEY = "19da758b-3c72-4d9f-92100673489e-2690-47ac";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || loading) return;

    setLoading(true);
    try {
      let existing = "";
      try {
        const getRes = await fetch(BUNNY_STORAGE_URL, {
          headers: { AccessKey: BUNNY_ACCESS_KEY },
        });
        if (getRes.ok) {
          existing = await getRes.text();
        }
      } catch {
        // File doesn't exist yet
      }

      const entry = JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        source: window.location.pathname,
      });
      const newContent = existing ? `${existing.trimEnd()}\n${entry}\n` : `${entry}\n`;

      await fetch(BUNNY_STORAGE_URL, {
        method: "PUT",
        headers: {
          AccessKey: BUNNY_ACCESS_KEY,
          "Content-Type": "application/octet-stream",
        },
        body: newContent,
      });

      setSubmitted(true);
      setEmail("");
    } catch {
      setSubmitted(true);
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <p className="text-sm font-bold uppercase tracking-[0.15em] text-health mb-3">Stay Informed</p>
      <h2 className="text-liberty mb-4" style={{ fontStyle: 'italic' }}>
        Healthcare sovereignty, delivered weekly.
      </h2>
      <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-lg mx-auto">
        New articles on medical debt strategies, insurance alternatives, and health independence — no spam, no selling your data. Unsubscribe anytime.
      </p>
      {submitted ? (
        <div className="bg-health/10 rounded-xl p-6 border border-health/20">
          <p className="text-health font-semibold text-lg mb-1">Welcome aboard.</p>
          <p className="text-muted-foreground text-sm">Your first issue arrives this week.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="flex-1 px-5 py-3.5 rounded-lg bg-card border border-border text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-2 focus:ring-health/30 focus:border-health/50 transition-all"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary !py-3.5 whitespace-nowrap"
          >
            {loading ? "Subscribing..." : "Subscribe Free"}
          </button>
        </form>
      )}
    </div>
  );
}
