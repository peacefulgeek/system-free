import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
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
              className="px-6 py-3 bg-health text-white font-medium text-sm rounded-md hover:bg-health-dark transition-colors"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
