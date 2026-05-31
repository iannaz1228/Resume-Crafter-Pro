import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Eye, LayoutTemplate, Palette, Download, Wand2, Zap,
  CheckCircle2, ArrowRight, Shield, Smartphone, RefreshCw,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — ResumeCraft Pro" },
      { name: "description", content: "Everything you need to build a professional resume: live preview, 20 templates, full design control, and PDF export." },
    ],
  }),
  component: FeaturesPage,
});

const FEATURES = [
  {
    Icon: Eye,
    title: "Real-time preview",
    desc: "Every keystroke renders instantly. See exactly how your resume looks as you type — no saving, no refreshing.",
    bullets: ["Live A4 canvas", "Desktop / tablet / mobile zoom", "Print-accurate rendering"],
  },
  {
    Icon: LayoutTemplate,
    title: "20 premium templates",
    desc: "From ATS-strict to creative designer — switch templates in one click without losing a single character of your data.",
    bullets: ["ATS-tested layouts", "Instant template switching", "Per-template color schemes"],
  },
  {
    Icon: Palette,
    title: "Total design control",
    desc: "Tune colors, typography, spacing, layout, and section order. Your resume should look like you, not a template.",
    bullets: ["Custom primary & accent colors", "Font family & size controls", "Drag-to-reorder sections"],
  },
  {
    Icon: Download,
    title: "Pixel-perfect PDF export",
    desc: "Export print-ready PDFs that survive ATS parsing and hiring-manager scrutiny. No blurry text, no layout shifts.",
    bullets: ["2× high-resolution rendering", "Multi-page support", "JSON backup export"],
  },
  {
    Icon: Wand2,
    title: "Smart section management",
    desc: "Drag to reorder. Hide sections you don't need. Group skills by category with custom levels.",
    bullets: ["Drag & drop reordering", "Show / hide any section", "Skill categories & levels"],
  },
  {
    Icon: Zap,
    title: "Autosave & offline-first",
    desc: "Your data is saved to localStorage automatically. Works offline. No account required.",
    bullets: ["Instant autosave", "No account needed", "JSON import / export"],
  },
  {
    Icon: Smartphone,
    title: "Mobile-first editor",
    desc: "Full form-based editing on mobile. Add experience, skills, and education from your phone without any clipping or overflow.",
    bullets: ["Dedicated mobile editor", "Section-by-section forms", "Fullscreen PDF preview"],
  },
  {
    Icon: Shield,
    title: "Privacy by default",
    desc: "Your resume data never leaves your device. No servers, no tracking, no account required.",
    bullets: ["100% client-side", "localStorage only", "No data collection"],
  },
  {
    Icon: RefreshCw,
    title: "Multi-resume management",
    desc: "Create unlimited resumes for different roles. Duplicate, rename, and manage them from your dashboard.",
    bullets: ["Unlimited resumes", "One-click duplicate", "Per-resume customization"],
  },
];

function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <SiteNav />

      {/* Hero */}
      <section className="px-6 pb-16 pt-20 text-center">
        <div className="mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Features
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl font-bold leading-tight md:text-6xl"
          >
            Everything you need.{" "}
            <span className="text-gradient">Nothing in the way.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-5 max-w-xl text-muted-foreground"
          >
            ResumeCraft Pro packs a professional-grade builder into a fast,
            privacy-first web app. No account. No bloat. Just results.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
            >
              Start building free <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/templates" className="inline-flex items-center gap-2 rounded-xl border border-border glass px-6 py-3 text-sm font-medium hover:bg-accent/20">
              Browse templates
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-2xl p-6"
              >
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <f.Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                <ul className="mt-4 space-y-1.5">
                  {f.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary" />
                      {b}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-10 text-center shadow-elegant">
          <h2 className="font-display text-3xl font-bold">Ready to build yours?</h2>
          <p className="mt-3 text-muted-foreground">Free during early access. No account required.</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Open dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
