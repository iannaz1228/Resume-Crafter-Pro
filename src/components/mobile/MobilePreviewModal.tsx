import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Download, FileText } from "lucide-react";
import { TEMPLATE_MAP } from "@/components/resume-templates";
import { CoverLetterTemplate } from "@/components/cover-letter-templates";
import { exportResumeToPDF, exportCoverLetterToPDF } from "@/lib/export-pdf";
import type { Resume } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  onClose: () => void;
  initialView?: "resume" | "cover-letter";
}

const A4_PX = 820;
const A4_H_PX = Math.round(297 * 3.78); // 1123px

export function MobilePreviewModal({ resume, onClose, initialView = "resume" }: Props) {
  const [view, setView] = useState<"resume" | "cover-letter">(initialView);

  const Template = TEMPLATE_MAP[resume.customization.template] ?? TEMPLATE_MAP["modern-developer"];
  const availableWidth = typeof window !== "undefined" ? window.innerWidth - 24 : 360;
  const scale = Math.max(0.3, availableWidth / A4_PX);

  const clipRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = clipRef.current;
    if (!el) return;
    el.style.setProperty("--m-clip-w", `${A4_PX * scale}px`);
    el.style.setProperty("--m-clip-h", `${A4_H_PX * scale}px`);
    el.style.setProperty("--m-scale", String(scale));
  }, [scale]);

  const handleExport = () => {
    if (view === "resume") {
      exportResumeToPDF("mobile-resume-for-pdf", `${resume.name.replace(/\s+/g, "_")}.pdf`);
    } else {
      exportCoverLetterToPDF(
        "mobile-cl-for-pdf",
        `${resume.name.replace(/\s+/g, "_")}_CoverLetter.pdf`,
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2 border-b border-border bg-card px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-accent"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Tab switcher */}
        <div className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-border bg-muted p-0.5">
          <button
            type="button"
            onClick={() => setView("resume")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-xs font-medium transition-colors ${view === "resume" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            Resume
          </button>
          <button
            type="button"
            onClick={() => setView("cover-letter")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-md py-1 text-xs font-medium transition-colors ${view === "cover-letter" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
          >
            <FileText className="h-3 w-3" /> Cover Letter
          </button>
        </div>

        <button
          type="button"
          onClick={handleExport}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Download className="h-3.5 w-3.5" />
          PDF
        </button>
      </div>

      {/* Scrollable preview */}
      <div className="flex-1 overflow-y-auto bg-muted/30 p-3">
        <div
          ref={clipRef}
          className="mx-auto overflow-hidden rounded-lg shadow-lg w-[var(--m-clip-w)] h-[var(--m-clip-h)]"
        >
          <div className="w-[820px] origin-top-left [transform:scale(var(--m-scale))]">
            {view === "resume" ? (
              <Template resume={resume} />
            ) : (
              <CoverLetterTemplate resume={resume} />
            )}
          </div>
        </div>
      </div>

      {/* Off-screen clones for PDF export */}
      <div id="mobile-resume-for-pdf" className="hidden">
        <Template resume={resume} />
      </div>
      <div id="mobile-cl-for-pdf" className="hidden">
        <CoverLetterTemplate resume={resume} />
      </div>
    </motion.div>
  );
}
