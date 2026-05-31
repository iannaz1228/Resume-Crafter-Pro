import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { TemplateId } from "@/lib/resume-types";
import { TEMPLATE_MAP } from "@/components/resume-templates";
import { createMockResume } from "@/lib/mock-resume";

interface TemplatePreviewModalProps {
  templateId: TemplateId | null;
  templateName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TemplatePreviewModal({
  templateId,
  templateName,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) {
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !templateId) return null;

  const mockResume = createMockResume(templateId);
  const Template = TEMPLATE_MAP[templateId];

  if (!Template) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-2 shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-white">{templateName}</h2>
            <p className="text-sm text-slate-200">Live preview with sample data</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-white/20 transition-colors text-white hover:text-white ml-auto"
            aria-label="Close preview"
            title="Close (ESC)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Preview Container */}
        <div
          ref={previewRef}
          className="flex-1 overflow-auto flex justify-center bg-gradient-to-b from-muted/50 to-muted p-8"
        >
          <div className="scale-[0.65] origin-top-center">
            <Template resume={mockResume} />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 bg-slate-50 px-6 py-2 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Press ESC to close</p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="rounded-lg px-4 py-1.5 text-sm font-medium bg-white border border-border hover:bg-accent transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
