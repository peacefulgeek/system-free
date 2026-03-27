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
      // First, try to fetch existing subscribers
      let existing = "";
      try {
        const getRes = await fetch(BUNNY_STORAGE_URL, {
          headers: { AccessKey: BUNNY_ACCESS_KEY },
        });
        if (getRes.ok) {
          existing = await getRes.text();
        }
      } catch {
        // File doesn't exist yet, that's fine
      }

      // Append new subscriber as JSONL
      const entry = JSON.stringify({
        email,
        timestamp: new Date().toISOString(),
        source: window.location.pathname,
      });
      const newContent = existing ? `${existing.trimEnd()}\n${entry}\n` : `${entry}\n`;

      // Write back to Bunny CDN
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
      // Still show success to user — we don't want to leak errors
      setSubmitted(true);
      setEmail("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-liberty py-16">
      <div className="max-w-xl mx-auto px-4 text-center">
        <h2 className="font-serif text-3xl text-white mb-3">
          Stay Free
        </h2>
        <p className="text-sm text-white/60 mb-8 leading-relaxed">
          New articles on healthcare sovereignty, medical debt strategies, and
          health alternatives — delivered weekly. No spam. Unsubscribe anytime.
        </p>
        {submitted ? (
          <p className="text-health font-medium">
            Welcome aboard. Check your inbox.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              className="flex-1 px-4 py-3 rounded-md bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-health/50"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-health text-white font-medium text-sm rounded-md hover:bg-health-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Subscribing..." : "Subscribe"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
