import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  LayoutTemplate,
  Palette,
  Download,
  Wand2,
  Eye,
  CheckCircle2,
  Zap,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";
import { UseTemplateButton } from "@/components/UseTemplateButton";
import { TEMPLATE_LIST, TEMPLATE_MAP } from "@/components/resume-templates";
import { createMockResume } from "@/lib/mock-resume";
import type { TemplateId } from "@/lib/resume-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeCraft Pro — Build a premium resume in minutes" },
      {
        name: "description",
        content:
          "A real-time visual resume builder with 6 premium templates, full design control, and instant PDF export. ATS-friendly out of the box.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  { icon: Eye, title: "Real-time preview", desc: "Every keystroke renders instantly across desktop, tablet, and mobile views." },
  { icon: LayoutTemplate, title: "20 premium templates", desc: "From ATS-strict to creative designer — switch templates instantly without losing data." },
  { icon: Palette, title: "Total design control", desc: "Tune colors, type, spacing, layout, and section order to match your brand." },
  { icon: Download, title: "Pixel-perfect PDF", desc: "Export print-ready PDFs that survive ATS parsing and hiring-manager scrutiny." },
  { icon: Wand2, title: "Smart sections", desc: "Drag to reorder. Hide what you don't need. Group skills by category." },
  { icon: Zap, title: "Autosave & JSON", desc: "Local autosave keeps your work safe. Import / export JSON for backups." },
];

function Landing() {
  const [previewModal, setPreviewModal] = useState<{
    templateId: TemplateId;
    templateName: string;
  } | null>(null);
  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <SiteNav />

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-32">
        <div className="mx-auto max-w-5xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            New: real-time multi-template engine
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl"
          >
            Resumes that <span className="text-gradient">land interviews</span>,
            <br className="hidden md:inline" /> not in the rejection pile.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          >
            A premium visual builder with live preview, six templates, and pixel-perfect PDF export.
            Built for students, engineers, designers, and executives.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Start building free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <a
              href="#templates"
              onClick={(e) => { e.preventDefault(); document.getElementById("templates")?.scrollIntoView({ behavior: "smooth" }); }}
              className="inline-flex items-center gap-2 rounded-xl border border-border glass px-6 py-3 text-sm font-medium hover:bg-accent/20"
            >
              Browse templates
            </a>
          </motion.div>

          {/* Hero mock */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="relative mx-auto mt-20 max-w-5xl"
          >
            <div className="absolute -inset-x-20 -top-10 -bottom-10 -z-10 rounded-[40px] bg-gradient-mesh blur-3xl opacity-60" />
            <div className="glass overflow-hidden rounded-2xl shadow-elegant">
              <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr]">
                <div className="border-r border-border/60 p-6 text-left">
                  <div className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">Builder</div>
                  <div className="mt-3 space-y-2.5">
                    {["Full Name", "Professional Title", "Summary", "Experience", "Skills"].map((l, i) => (
                      <div key={l} className={`rounded-md ${i === 2 ? "h-16" : "h-7"} bg-muted/70`} />
                    ))}
                  </div>
                </div>
                <div className="bg-white p-6 text-left text-slate-900">
                  <div className="border-b-2 border-indigo-500 pb-3">
                    <div className="font-display text-xl font-bold">Ian Magistrado Naz</div>
                    <div className="text-xs text-slate-500">Senior Product Designer · San Francisco</div>
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">Experience</div>
                    <div className="h-2 rounded bg-slate-200" />
                    <div className="h-2 w-5/6 rounded bg-slate-200" />
                    <div className="h-2 w-4/6 rounded bg-slate-200" />
                  </div>
                  <div className="mt-3 space-y-2">
                    <div className="text-[10px] font-semibold uppercase tracking-widest text-indigo-600">Skills</div>
                    <div className="flex flex-wrap gap-1.5">
                      {["Figma", "Design Systems", "Research", "Prototyping"].map((s) => (
                        <span key={s} className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] text-indigo-700">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Features</div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Everything you need. <span className="text-gradient">Nothing in the way.</span>
            </h2>
          </div>
          <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className="group glass rounded-2xl p-6 transition-all hover:shadow-glow">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
                  <f.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-display text-lg font-semibold">{f.title}</div>
                <div className="mt-1.5 text-sm text-muted-foreground">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Templates</div>
            <h2 className="mt-3 font-display text-4xl font-bold md:text-5xl">20 templates. One click to switch.</h2>
            <p className="mt-4 text-muted-foreground">Every template is ATS-tested and fully customizable.</p>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {TEMPLATE_LIST.map((t) => {
              const Template = TEMPLATE_MAP[t.id];
              const mockResume = createMockResume(t.id);
              return (
                <div key={t.id} className="group relative overflow-hidden rounded-2xl glass flex flex-col">
                  <div className="flex h-56 items-start justify-center overflow-hidden border-b border-border/60 bg-muted">
                    {Template && (
                      <div className="relative h-[281px] w-[205px] shrink-0 overflow-hidden">
                        <div className="absolute left-0 top-0 w-[820px] origin-top-left scale-[0.25]">
                          <Template resume={mockResume} />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 flex flex-col p-5">
                    <div className="flex-1">
                      <div className="font-display text-base font-semibold">{t.name}</div>
                      <div className="text-xs text-muted-foreground">{t.tag}</div>
                    </div>
                    <div className="flex gap-2 pt-3">
                      <button
                        type="button"
                        onClick={() => setPreviewModal({ templateId: t.id, templateName: t.name })}
                        className="flex-1 rounded-lg bg-secondary/50 px-2.5 py-1.5 text-xs font-medium text-secondary-foreground hover:bg-secondary transition-colors"
                      >
                        Preview
                      </button>
                      <UseTemplateButton
                        templateId={t.id}
                        className="flex-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/20 transition-colors text-center"
                      >
                        Use
                      </UseTemplateButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section id="pricing" className="px-6 py-24">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-10 text-center shadow-elegant">
          <h2 className="font-display text-4xl font-bold">Free during early access</h2>
          <p className="mt-3 text-muted-foreground">
            Unlimited resumes, all 20 templates, full export. Premium AI features arriving soon.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {["Unlimited resumes", "All 20 templates", "PDF + JSON export", "No watermark"].map((x) => (
              <div key={x} className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {x}
              </div>
            ))}
          </div>
          <Link
            to="/dashboard"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Open dashboard <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <Footer />

      {previewModal && (
        <TemplatePreviewModal
          templateId={previewModal.templateId}
          templateName={previewModal.templateName}
          isOpen={!!previewModal}
          onClose={() => setPreviewModal(null)}
        />
      )}
    </div>
  );
}
