import type { Resume, TemplateId } from "@/lib/resume-types";
import { TEMPLATE_MAP } from "@/components/resume-templates";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

const PRESET_COLORS = [
  { hex: "#2563EB", label: "Blue" },
  { hex: "#7C3AED", label: "Violet" },
  { hex: "#DB2777", label: "Pink" },
  { hex: "#DC2626", label: "Red" },
  { hex: "#D97706", label: "Amber" },
  { hex: "#16A34A", label: "Green" },
  { hex: "#0891B2", label: "Cyan" },
  { hex: "#374151", label: "Slate" },
  { hex: "#111827", label: "Black" },
];

const FONTS = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Merriweather",
  "Playfair Display",
  "Source Code Pro",
];

function toTitle(id: string) {
  return id.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function MobileDesignSection({ resume, update }: Props) {
  const c = resume.customization;

  const setCustom = <K extends keyof typeof c>(key: K, value: (typeof c)[K]) =>
    update((r) => ({ ...r, customization: { ...r.customization, [key]: value } }));

  const templateIds = Object.keys(TEMPLATE_MAP) as TemplateId[];

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">Design</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Template, colors, and typography</p>
      </div>

      {/* Template picker */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Template</p>
        <div className="grid grid-cols-2 gap-2">
          {templateIds.map((tid) => (
            <button
              key={tid}
              type="button"
              onClick={() => setCustom("template", tid)}
              className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                c.template === tid
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
            >
              {toTitle(tid)}
            </button>
          ))}
        </div>
      </div>

      {/* Primary color */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Primary Color</p>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              type="button"
              onClick={() => setCustom("primaryColor", hex)}
              title={label}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                c.primaryColor === hex ? "ring-2 ring-offset-2 ring-offset-card ring-foreground" : ""
              }`}
              style={{ backgroundColor: hex }}
              aria-label={label}
            />
          ))}
          {/* Custom color */}
          <label
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border-2 border-dashed border-border text-muted-foreground hover:border-primary"
            title="Custom color"
          >
            <span className="text-xs">+</span>
            <input
              type="color"
              value={c.primaryColor}
              onChange={(e) => setCustom("primaryColor", e.target.value)}
              className="sr-only"
            />
          </label>
        </div>
        <p className="mt-2.5 text-xs text-muted-foreground">
          Current: <code className="font-mono">{c.primaryColor}</code>
        </p>
      </div>

      {/* Accent color */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Accent Color</p>
        <div className="flex flex-wrap gap-2.5">
          {PRESET_COLORS.map(({ hex, label }) => (
            <button
              key={hex}
              type="button"
              onClick={() => setCustom("accentColor", hex)}
              title={label}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition-transform hover:scale-110 ${
                c.accentColor === hex ? "ring-2 ring-offset-2 ring-offset-card ring-foreground" : ""
              }`}
              style={{ backgroundColor: hex }}
              aria-label={label}
            />
          ))}
        </div>
      </div>

      {/* Font family */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Font</p>
        <div className="grid grid-cols-2 gap-2">
          {FONTS.map((font) => (
            <button
              key={font}
              type="button"
              onClick={() => setCustom("fontFamily", font)}
              className={`rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors ${
                c.fontFamily === font
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground"
              }`}
              style={{ fontFamily: font }}
            >
              {font}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
