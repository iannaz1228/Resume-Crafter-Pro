import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Sparkles, Zap } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — ResumeCraft Pro" },
      { name: "description", content: "Free during early access. All 20 templates, unlimited resumes, PDF export, no watermark." },
    ],
  }),
  component: PricingPage,
});

const FREE_FEATURES = [
  "Unlimited resumes",
  "All 20 premium templates",
  "Live A4 preview",
  "Full design customization",
  "PDF & JSON export",
  "No watermark",
  "Mobile editor",
  "Offline-first (no account)",
];

const PRO_FEATURES = [
  "Everything in Free",
  "AI-powered content suggestions",
  "AI summary generator",
  "ATS score checker",
  "LinkedIn profile import",
  "Cloud sync across devices",
  "Priority support",
  "Early access to new templates",
];

const FAQS = [
  {
    q: "Is it really free?",
    a: "Yes. During early access, all features are completely free with no credit card required. We'll announce pricing changes with plenty of notice.",
  },
  {
    q: "Do I need an account?",
    a: "No. Your resume data is stored locally in your browser. No sign-up, no email, no password needed.",
  },
  {
    q: "What happens to my data?",
    a: "Everything stays on your device in localStorage. Nothing is sent to any server. Export JSON anytime to back up your data.",
  },
  {
    q: "When will the Pro plan launch?",
    a: "We're building AI features now. Pro pricing will be announced at launch — existing users will get a grandfathered rate.",
  },
  {
    q: "Can I export my resume?",
    a: "Yes. Export a high-resolution PDF instantly from the builder. You can also export your data as JSON for backup or import.",
  },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <SiteNav />

      {/* Hero */}
      <section className="px-6 pb-16 pt-20 text-center">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Pricing
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl font-bold md:text-6xl"
          >
            Simple, honest{" "}
            <span className="text-gradient">pricing.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            Free during early access. Pro AI features coming soon.
          </motion.p>
        </div>
      </section>

      {/* Pricing cards */}
      <section className="px-6 pb-20">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">

          {/* Free tier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass flex flex-col rounded-3xl p-8 shadow-elegant"
          >
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10">
                <Zap className="h-4.5 w-4.5 text-primary" />
              </div>
              <span className="font-display text-lg font-bold">Free</span>
            </div>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-5xl font-bold">$0</span>
              <span className="mb-1 text-sm text-muted-foreground">/ forever</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Everything you need to build a great resume today.</p>

            <ul className="mt-6 flex-1 space-y-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            <Link
              to="/dashboard"
              className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-gradient-primary py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Start building free <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Pro tier (coming soon) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative flex flex-col overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 shadow-elegant"
          >
            {/* Coming soon badge */}
            <div className="absolute right-4 top-4 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
              Coming soon
            </div>

            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary shadow-glow">
                <Sparkles className="h-4.5 w-4.5 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold">Pro</span>
            </div>
            <div className="mt-4 flex items-end gap-1">
              <span className="font-display text-5xl font-bold">TBD</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">AI-powered features to help you land more interviews.</p>

            <ul className="mt-6 flex-1 space-y-3 opacity-70">
              {PRO_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            <button
              type="button"
              disabled
              className="mt-8 flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-semibold text-muted-foreground opacity-60"
            >
              Notify me at launch
            </button>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-center font-display text-2xl font-bold md:text-3xl">
            Frequently asked questions
          </h2>
          <div className="mt-8 space-y-4">
            {FAQS.map((faq, i) => (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass rounded-2xl p-5"
              >
                <h3 className="font-semibold">{faq.q}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
