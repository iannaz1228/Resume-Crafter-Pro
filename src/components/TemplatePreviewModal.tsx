import { useRef, useEffect } from "react";
import { X } from "lucide-react";
import type { TemplateId } from "@/lib/resume-types";
import { TEMPLATE_MAP } from "@/components/resume-templates";
import { createMockResume } from "@/lib/mock-resume";

const A4_W = 820;
const A4_H = 1122;

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
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose]);

  // Set CSS variables imperatively to avoid JSX inline-style lint warnings.
  // ResizeObserver keeps them in sync when the modal or viewport resizes.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    function apply() {
      const w = el!.getBoundingClientRect().width;
      const s = Math.min(0.9, Math.max(0.25, (w - 64) / A4_W));
      el!.style.setProperty("--ps", String(s));
      el!.style.setProperty("--pw", `${A4_W * s}px`);
      el!.style.setProperty("--ph", `${A4_H * s}px`);
    }

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isOpen]);

  if (!isOpen || !templateId) return null;

  const mockResume = createMockResume(templateId);
  const Template = TEMPLATE_MAP[templateId];

  if (!Template) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-2 shadow-md">
          <div>
            <h2 className="text-lg font-semibold text-white">{templateName}</h2>
            <p className="text-sm text-slate-200">Live preview with sample data</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close preview"
            title="Close (ESC)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Preview — clip-container via CSS vars, no inline styles */}
        <div
          ref={containerRef}
          className="flex flex-1 justify-center overflow-auto bg-gradient-to-b from-muted/50 to-muted p-8"
        >
          <div className="w-[var(--pw)] h-[var(--ph)] shrink-0 overflow-hidden">
            <div className="w-[820px] origin-top-left [transform:scale(var(--ps))]">
              <Template resume={mockResume} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border/60 bg-slate-50 px-6 py-2">
          <p className="text-xs text-muted-foreground">Press ESC to close</p>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border bg-white px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
