import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo, useCallback } from "react";
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
  const hydrated = usePersistHydration(useResumeStore);
  const resume = useResumeStore((s) => s.resumes[id]);
  const updateResume = useResumeStore((s) => s.updateResume);

  const [tab, setTab] = useState<"content" | "design">("content");
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

  const update = useCallback(
    (fn: (r: Resume) => Resume) => updateResume(id, fn),
    [id, updateResume],
  );

  const templateId = resume?.customization.template;
  const Template = useMemo(() => {
    if (!templateId) return null;
    return TEMPLATE_MAP[templateId] ?? TEMPLATE_MAP["modern-developer"];
  }, [templateId]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-background bg-gradient-hero">
        <SiteNav />
        <div className="mx-auto max-w-7xl px-6 py-12 text-sm text-muted-foreground">Loading resume…</div>
      </div>
    );
  }

  if (!resume || !Template) return null;

  const exportPDF = async () => {
    const node = document.getElementById("resume-print");
    if (!node) {
      toast.error("Preview not ready");
      return;
    }
    toast.loading("Generating PDF…", { id: "pdf" });
    const previousStyle = node.getAttribute("style");
    const wasHidden = node.classList.contains("hidden");
    document.documentElement.classList.add("pdf-export-mode");
    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      // Make hidden clone visible off-screen so html2canvas can rasterize it
      node.setAttribute(
        "style",
        "position:fixed;left:-10000px;top:0;display:block;background:#fff;",
      );
      // force visibility class
      node.classList.remove("hidden");

      const canvas = await html2canvas(node, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: node.scrollWidth,
        windowHeight: node.scrollHeight,
      });

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = 210;
      const pageH = 297;
      const imgH = (canvas.height * pageW) / canvas.width;
      const img = canvas.toDataURL("image/jpeg", 0.95);

      if (imgH <= pageH) {
        pdf.addImage(img, "JPEG", 0, 0, pageW, imgH);
      } else {
        // multi-page slicing
        let remaining = imgH;
        let y = 0;
        while (remaining > 0) {
          pdf.addImage(img, "JPEG", 0, y, pageW, imgH);
          remaining -= pageH;
          if (remaining > 0) {
            pdf.addPage();
            y -= pageH;
          }
        }
      }
      pdf.save(`${resume.name.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded", { id: "pdf" });
    } catch (err) {
      console.error(err);
      toast.error("PDF export failed", { id: "pdf" });
    } finally {
      if (previousStyle === null) node.removeAttribute("style");
      else node.setAttribute("style", previousStyle);
      if (wasHidden) node.classList.add("hidden");
      else node.classList.remove("hidden");
      document.documentElement.classList.remove("pdf-export-mode");
    }
  };

  const printPDF = () => window.print();

  const previewWidth = 820; // full A4 width for scaling calculation
  const scale = size === "desktop" ? 0.78 : size === "tablet" ? 0.60 : 0.55; // increased mobile scale from 0.42 to 0.55

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
                  onClick={() => setSize(s)}
                  className={`grid h-7 w-7 place-items-center rounded-md ${size === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent/40"}`}
                  aria-label={s}
                >
                  {s === "desktop" ? <Monitor className="h-3.5 w-3.5" /> : s === "tablet" ? <Tablet className="h-3.5 w-3.5" /> : <Smartphone className="h-3.5 w-3.5" />}
                </button>
              ))}
            </div>
            <button type="button" onClick={printPDF} className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium hover:bg-accent/30">
              <Printer className="h-3.5 w-3.5" /> Print
            </button>
            <button
              onClick={exportPDF}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground shadow-glow"
            >
              <Download className="h-3.5 w-3.5" /> Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Workspace */}
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-3 px-2 py-6 sm:gap-6 sm:px-4 lg:grid-cols-[480px_1fr]">
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
          </div>

          <div className="max-h-[calc(100vh-180px)] space-y-3 overflow-y-auto pr-1">
            {tab === "content" ? (
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
            ) : (
              <CustomizationPanel resume={resume} update={update} />
            )}
          </div>
        </div>

        {/* Right preview */}
        <div className="relative">
          <div className="max-h-[calc(100vh-180px)] overflow-y-auto rounded-2xl glass p-4 shadow-elegant">
            <div className="mb-3 text-center text-xs text-muted-foreground">
              A4 · {resume.customization.template.replace(/-/g, " ")} · Print preview is exact
            </div>
            <div className="mx-auto flex items-start justify-center">
              <motion.div
                key={size}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{
                  width: previewWidth,
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  height: 297 * 3.78 * scale + 40,
                }}
              >
                <Template resume={resume} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden full-resolution clone for printing */}
      <div id="resume-print" className="hidden print:block">
        <Template resume={resume} />
      </div>
    </div>
  );
}
