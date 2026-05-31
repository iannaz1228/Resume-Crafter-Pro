import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { Footer } from "@/components/Footer";
import { TemplatePreviewModal } from "@/components/TemplatePreviewModal";
import { UseTemplateButton } from "@/components/UseTemplateButton";
import { TEMPLATE_LIST, TEMPLATE_MAP } from "@/components/resume-templates";
import { createMockResume } from "@/lib/mock-resume";
import type { TemplateId } from "@/lib/resume-types";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Templates — ResumeCraft Pro" },
      { name: "description", content: "20 ATS-friendly resume templates for every industry and style. Switch templates instantly without losing your data." },
    ],
  }),
  component: TemplatesPage,
});

function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [previewModal, setPreviewModal] = useState<{
    templateId: TemplateId;
    templateName: string;
  } | null>(null);

  const filtered = TEMPLATE_LIST.filter(
    (t) =>
      query === "" ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.tag.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <SiteNav />

      {/* Hero */}
      <section className="px-6 pb-12 pt-20 text-center">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs font-semibold uppercase tracking-widest text-primary"
          >
            Templates
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-4 font-display text-4xl font-bold md:text-6xl"
          >
            {TEMPLATE_LIST.length} templates.{" "}
            <span className="text-gradient">One click to switch.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-muted-foreground"
          >
            Every template is ATS-tested and fully customizable. Switch at any time without losing your data.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative mx-auto mt-8 max-w-sm"
          >
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates…"
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </motion.div>
        </div>
      </section>

      {/* Template grid */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">
              No templates match "<strong>{query}</strong>"
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.map((t, i) => {
                const Template = TEMPLATE_MAP[t.id];
                const mockResume = createMockResume(t.id);
                return (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="glass group flex flex-col overflow-hidden rounded-2xl"
                  >
                    <div className="flex h-56 items-start justify-center overflow-hidden border-b border-border/60 bg-muted">
                      {Template && (
                        <div className="relative h-[281px] w-[205px] shrink-0 overflow-hidden">
                          <div className="absolute left-0 top-0 w-[820px] origin-top-left scale-[0.25]">
                            <Template resume={mockResume} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex-1">
                        <div className="font-display text-base font-semibold">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.tag}</div>
                      </div>
                      <div className="flex gap-2 pt-3">
                        <button
                          type="button"
                          onClick={() => setPreviewModal({ templateId: t.id, templateName: t.name })}
                          className="flex-1 rounded-lg bg-secondary/50 px-2.5 py-1.5 text-xs font-medium text-secondary-foreground transition-colors hover:bg-secondary"
                        >
                          Preview
                        </button>
                        <UseTemplateButton
                          templateId={t.id}
                          className="flex-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-center text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                        />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl glass rounded-3xl p-10 text-center shadow-elegant">
          <h2 className="font-display text-3xl font-bold">Ready to start?</h2>
          <p className="mt-3 text-muted-foreground">Pick any template and start editing immediately. Free, no account required.</p>
          <Link
            to="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-glow"
          >
            Go to dashboard <ArrowRight className="h-4 w-4" />
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
