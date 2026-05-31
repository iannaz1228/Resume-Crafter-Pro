import { motion } from "framer-motion";
import { X, Download } from "lucide-react";
import { TEMPLATE_MAP } from "@/components/resume-templates";
import { exportResumeToPDF } from "@/lib/export-pdf";
import type { Resume } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  onClose: () => void;
}

const A4_PX = 820;
const A4_H_PX = Math.round(297 * 3.78); // 1123px

export function MobilePreviewModal({ resume, onClose }: Props) {
  const Template = TEMPLATE_MAP[resume.customization.template] ?? TEMPLATE_MAP["modern-developer"];
  const availableWidth = typeof window !== "undefined" ? window.innerWidth - 24 : 360;
  const scale = Math.max(0.3, availableWidth / A4_PX);

  const handleExport = () =>
    exportResumeToPDF(
      "mobile-resume-for-pdf",
      `${resume.name.replace(/\s+/g, "_")}.pdf`
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 32 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-accent"
          aria-label="Close preview"
        >
          <X className="h-5 w-5" />
        </button>
        <span className="text-sm font-semibold">Resume Preview</span>
        <button
          type="button"
          onClick={handleExport}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Download className="h-3.5 w-3.5" /> Export PDF
        </button>
      </div>

      {/* Scrollable preview */}
      <div className="flex-1 overflow-y-auto bg-muted/30 p-3">
        {/* Clip container — exact scaled A4 footprint */}
        <div
          className="mx-auto overflow-hidden rounded-lg shadow-lg"
          style={{ width: A4_PX * scale, height: A4_H_PX * scale }}
        >
          <div
            style={{
              width: A4_PX,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <Template resume={resume} />
          </div>
        </div>
      </div>

      {/* Off-screen clone for pdf export (never visible to user) */}
      <div id="mobile-resume-for-pdf" className="hidden">
        <Template resume={resume} />
      </div>
    </motion.div>
  );
}
