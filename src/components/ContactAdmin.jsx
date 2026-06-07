import { useState } from "react";
import { motion } from "framer-motion";

export default function ContactAdmin() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email.trim() || !message.trim()) {
      setError("Please fill in both fields before sending.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (message.length > 5000) {
      setError("Message too long (max 5000 characters).");
      return;
    }
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderEmail: email, body: message }),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 429) { setError("Too many requests, please slow down."); return; }
        let data = {};
        try { data = await res.json(); } catch { /* noop */ }
        setError(data.msg || "Failed to send message");
        return;
      }
      setSent(true);
    } catch (e) {
      setError("Failed to send message");
    }
  };

  const handleReset = () => {
    setEmail("");
    setMessage("");
    setError("");
    setSent(false);
  };

  return (
    <section
      id="contact-admin"
      className="relative py-24 px-6 bg-black border-b border-accent/10"
      style={{ backgroundImage: 'radial-gradient(circle at top right, rgba(183,158,79,0.12) 0%, transparent 35%), radial-gradient(circle at bottom left, rgba(183,158,79,0.06) 0%, transparent 40%)' }}
    >
      <div className="relative z-10 max-w-2xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-accent text-xs tracking-[0.25em] uppercase mb-6 text-center"
        >
          Contact Admin
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-anton text-[clamp(36px,6vw,64px)] leading-[1.1] text-cream mb-6 text-center uppercase"
          style={{ letterSpacing: "-0.02em" }}
        >
          We're Ready to Help You Connect
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="font-ui text-sm text-cream/70 mb-10 max-w-lg mx-auto text-center"
        >
          Have a question about configuring your specific streaming stick, or want advice on selecting the best player app for your TV? Our support team is active around the clock to make sure you enjoy an elite experience from day one.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="bg-black-light/80 border border-accent/10 rounded-[28px] p-8 shadow-[0_28px_80px_rgba(0,0,0,0.35)] backdrop-blur-sm"
        >
          {sent ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-14 h-14 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7 h-7 text-accent"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              </div>
              <p className="text-base font-medium text-cream mb-1">Message sent!</p>
              <p className="text-sm text-cream/65 mb-6">
                Thanks for reaching out. The admin will review your message shortly.
              </p>
              <button
                onClick={handleReset}
                className="text-sm text-accent hover:text-cream underline bg-transparent border-none cursor-pointer p-0"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
              }}
              autoComplete="off"
            >
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email-input" className="text-sm font-medium text-snow/70">
                  Direct Support Email
                </label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="support@kick-stream.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-3 text-sm rounded-2xl border border-border bg-black text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-transparent transition"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="msg-input" className="text-sm font-medium text-snow/70">
                  Live Concierge Support
                </label>
                <textarea
                  id="msg-input"
                  placeholder="Click the chat widget at the bottom right of your screen to speak directly with an expert right now."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 text-sm rounded-2xl border border-border bg-black text-cream placeholder-cream/30 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-transparent resize-y transition"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 mt-2 text-sm font-semibold rounded-full bg-accent text-black hover:bg-accent/90 active:scale-[0.98] transition cursor-pointer border-none uppercase tracking-[0.14em]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M10 14l11 -11" />
                  <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5" />
                </svg>
                Send message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}