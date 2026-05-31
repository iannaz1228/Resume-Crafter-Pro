import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useIsMobile } from "@/hooks/use-device";
import { MobileEditor } from "@/components/mobile/MobileEditor";
import { exportResumeToPDF, exportCoverLetterToPDF, exportPackagePDF } from "@/lib/export-pdf";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Printer,
  Save,
  Smartphone,
  Tablet,
  Monitor,
  Settings2,
  Layers,
  FileText,
  Package,
} from "lucide-react";
import { toast } from "sonner";
import { useResumeStore } from "@/store/resume-store";
import type { Resume } from "@/lib/resume-types";
import { TEMPLATE_MAP } from "@/components/resume-templates";
import {
  PersonalSection,
  SummarySection,
  ExperienceSection,
  EducationSection,
  ProjectsSection,
  SkillsSection,
  CertificationsSection,
  LanguagesSection,
  ReferencesSection,
} from "@/components/builder-sections";
import { CustomizationPanel } from "@/components/CustomizationPanel";
import { CoverLetterSection } from "@/components/CoverLetterSection";
import { CoverLetterTemplate } from "@/components/cover-letter-templates";
import { SiteNav } from "@/components/SiteNav";
import { usePersistHydration } from "@/hooks/use-persist-hydration";

export const Route = createFileRoute("/builder/$id")({
  head: () => ({
    meta: [
      { title: "Resume Builder — ResumeCraft Pro" },
      { name: "description", content: "Design your resume with live preview." },
    ],
  }),
  component: Builder,
});

type PreviewSize = "desktop" | "tablet" | "mobile";

function Builder() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hydrated = usePersistHydration(useResumeStore);
  const resume = useResumeStore((s) => s.resumes[id]);
  const updateResume = useResumeStore((s) => s.updateResume);

  const [tab, setTab] = useState<"content" | "design" | "cover-letter">("content");
  const [size, setSize] = useState<PreviewSize>("desktop");
  const [saved, setSaved] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!resume) {
      toast.error("Resume not found");
      navigate({ to: "/dashboard" });
    }
  }, [hydrated, resume, navigate]);

  // visual save indicator
  useEffect(() => {
    if (!resume) return;
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 600);
    return () => clearTimeout(t);
  }, [resume]);

  const previewContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const clipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = previewContainerRef.current;
    if (!el) return;
    const update = () => setContainerWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const update = useCallback(
    (fn: (r: Resume) => Resume) => updateResume(id, fn),
    [id, updateResume],
  );

  const templateId = resume?.customization.template;
  const Template = useMemo(() => {
    if (!templateId) return null;
    return TEMPLATE_MAP[templateId] ?? TEMPLATE_MAP["modern-developer"];
  }, [templateId]);

  const A4_PX = 820;
  const A4_H_PX = 297 * 3.78; // ~1122px
  const targetScale = size === "desktop" ? 0.78 : size === "tablet" ? 0.60 : 0.42;
  const fitScale = Math.max(0.2, containerWidth / A4_PX);
  const scale = Math.min(targetScale, fitScale);

  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    el.style.setProperty("--clip-w", `${A4_PX * scale}px`);
    el.style.setProperty("--clip-h", `${A4_H_PX * scale + 20}px`);
  }, [scale, hydrated]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background bg-gradient-hero">
        <SiteNav />
        <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-muted-foreground">Loading resume…</div>
      </div>
    );
  }

  if (!resume || !Template) return null;

  // Mobile gets its own full-screen editor — no desktop chrome
  if (isMobile) {
    return <MobileEditor resume={resume} update={update} />;
  }

  const exportPDF = () =>
    exportResumeToPDF("resume-print", `${resume.name.replace(/\s+/g, "_")}.pdf`);

  const exportCL = () =>
    exportCoverLetterToPDF(
      "cover-letter-print",
      `${resume.name.replace(/\s+/g, "_")}_CoverLetter.pdf`,
    );

  const printPDF = () => window.print();

  const isCoverLetter = tab === "cover-letter";

  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <SiteNav />

      {/* Sub-header */}
      <div className="no-print sticky top-16 z-40 border-b border-border/60 glass">
        <div className="mx-auto flex h-14 max-w-[1600px] items-center justify-between gap-3 px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Link to="/dashboard" className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent/40" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <input
              value={resume.name}
              onChange={(e) => update((r) => ({ ...r, name: e.target.value }))}
              placeholder="Resume name"
              className="min-w-0 max-w-xs truncate rounded-md bg-transparent px-2 py-1 font-display font-semibold outline-none hover:bg-accent/30 focus:bg-card"
            />
            <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:inline-flex">
              <Save className={`h-3.5 w-3.5 transition-colors ${saved ? "text-emerald-500" : "text-amber-500"}`} />
              {saved ? "Saved" : "Saving…"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1 rounded-lg border border-border bg-card p-0.5 md:flex">
              {(["desktop", "tablet", "mobile"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  className={`grid h-7 w-7 place-items-center rounded-md ${size === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/40"}`}
                  aria-label={s}
                >
                  {s === "desktop" ? <Monitor className="h-3.5 w-3.5" /> : s === "tablet" ? <Tablet className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>

            {/* Resume export buttons — shown when NOT on cover letter tab */}
            {!isCoverLetter && (
              <>
                <button type="button" onClick={printPDF} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent/30">
                  <Printer className="h-3.5 w-3.5" /> Print
                </button>
                <button
                  type="button"
                  onClick={exportPDF}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  <Download className="h-3.5 w-3.5" /> Export PDF
                </button>
              </>
            )}

            {/* Cover letter export buttons — shown on cover letter tab */}
            {isCoverLetter && (
              <>
                <button
                  type="button"
                  onClick={exportCL}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent/30"
                >
                  <FileText className="h-3.5 w-3.5" /> Export Cover Letter PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportPackagePDF(resume)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
                >
                  <Package className="h-3.5 w-3.5" /> Export Package
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 px-4 py-6 lg:grid-cols-[480px_1fr]">
        {/* Left panel */}
        <div className="no-print space-y-3">
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setTab("content")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium ${tab === "content" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/40"}`}
            >
              <Layers className="h-3.5 w-3.5" /> Content
            </button>
            <button
              type="button"
              onClick={() => setTab("design")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium ${tab === "design" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/40"}`}
            >
              <Settings2 className="h-3.5 w-3.5" /> Design
            </button>
            <button
              type="button"
              onClick={() => setTab("cover-letter")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-md py-1.5 text-xs font-medium ${tab === "cover-letter" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/40"}`}
            >
              <FileText className="h-3.5 w-3.5" /> Cover Letter
            </button>
          </div>

          <div className="max-h-[calc(100vh-180px)] space-y-3 overflow-y-auto pr-1">
            {tab === "content" && (
              <>
                <PersonalSection resume={resume} update={update} />
                <SummarySection resume={resume} update={update} />
                <ExperienceSection resume={resume} update={update} />
                <EducationSection resume={resume} update={update} />
                <ProjectsSection resume={resume} update={update} />
                <SkillsSection resume={resume} update={update} />
                <CertificationsSection resume={resume} update={update} />
                <LanguagesSection resume={resume} update={update} />
                <ReferencesSection resume={resume} update={update} />
              </>
            )}
            {tab === "design" && <CustomizationPanel resume={resume} update={update} />}
            {tab === "cover-letter" && <CoverLetterSection resume={resume} update={update} />}
          </div>
        </div>

        {/* Right preview */}
        <div className="relative">
          <div className="rounded-2xl glass p-2 sm:p-4 shadow-elegant">
            <div className="mb-2 text-center text-xs text-muted-foreground">
              {isCoverLetter
                ? `Cover Letter · ${resume.customization.template.replace(/-/g, " ")}`
                : `A4 · ${resume.customization.template.replace(/-/g, " ")} · Print preview is exact`}
            </div>
            {/* Measure available width so scale never overflows the container */}
            <div ref={previewContainerRef} className="flex items-start justify-center">
              {/* Clip container: exactly the scaled A4 footprint, no overflow */}
              <div
                ref={clipRef}
                className="relative shrink-0 overflow-hidden w-[var(--clip-w)] h-[var(--clip-h)]"
              >
                <motion.div
                  key={`${size}-${tab}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: A4_PX,
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                  }}
                >
                  {isCoverLetter ? (
                    <CoverLetterTemplate resume={resume} />
                  ) : (
                    <Template resume={resume} />
                  )}
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-resolution clones for PDF export */}
      <div id="resume-print" className="hidden print:block">
        <Template resume={resume} />
      </div>
      <div id="cover-letter-print" className="hidden">
        <CoverLetterTemplate resume={resume} />
      </div>
    </div>
  );
}
