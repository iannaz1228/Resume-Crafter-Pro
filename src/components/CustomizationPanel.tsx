import { useState, useRef, useEffect, memo } from "react";
import type { Resume, TemplateId } from "@/lib/resume-types";
import { TEMPLATE_LIST } from "./resume-templates";
import { Accordion } from "./builder-sections";

type Updater = (fn: (r: Resume) => Resume) => void;
type Intensity = "soft" | "normal" | "bold";
type ColorPatch = { primaryColor: string; accentColor: string; textColor: string; backgroundColor: string };

// ── Per-template default color palettes ───────────────────────────────────────
// These are the "intended" colors for each template — applied automatically when
// the user picks a template and available as a one-click reset in the Colors panel.
const TEMPLATE_DEFAULT_COLORS: Record<TemplateId, ColorPatch> = {
  "ats-professional":  { primaryColor: "#1E3A8A", accentColor: "#3B82F6", textColor: "#0F172A", backgroundColor: "#FFFFFF" },
  "modern-developer":  { primaryColor: "#2563EB", accentColor: "#60A5FA", textColor: "#111827", backgroundColor: "#F1F5F9" },
  "executive":         { primaryColor: "#374151", accentColor: "#9CA3AF", textColor: "#111827", backgroundColor: "#FFFFFF" },
  "student":           { primaryColor: "#059669", accentColor: "#34D399", textColor: "#1F2937", backgroundColor: "#FFFFFF" },
  "minimalist":        { primaryColor: "#111827", accentColor: "#6B7280", textColor: "#111827", backgroundColor: "#FAFAFA" },
  "creative-designer": { primaryColor: "#7C3AED", accentColor: "#A78BFA", textColor: "#1F1B2E", backgroundColor: "#FFFFFF" },
  "corporate-compact": { primaryColor: "#1E40AF", accentColor: "#3B82F6", textColor: "#0F172A", backgroundColor: "#FFFFFF" },
  "elegant-serif":     { primaryColor: "#92400E", accentColor: "#D97706", textColor: "#1C1917", backgroundColor: "#FFFBEB" },
  "tech-dark":         { primaryColor: "#60A5FA", accentColor: "#38BDF8", textColor: "#E2E8F0", backgroundColor: "#0F172A" },
  "amber-pill":        { primaryColor: "#F5A623", accentColor: "#F5A623", textColor: "#1a1b2e", backgroundColor: "#FFFFFF" },
  "wave-navy":         { primaryColor: "#1B6FA8", accentColor: "#1B6FA8", textColor: "#1E293B", backgroundColor: "#FFFFFF" },
  "geo-bronze":        { primaryColor: "#B47542", accentColor: "#B47542", textColor: "#1C1917", backgroundColor: "#FAFAF6" },
  "noir-wave":         { primaryColor: "#0a0a0a", accentColor: "#F5C518", textColor: "#0a0a0a", backgroundColor: "#FFFFFF" },
  "navy-sidebar-pro":  { primaryColor: "#1f2a44", accentColor: "#4a78c8", textColor: "#1E293B", backgroundColor: "#FFFFFF" },
  "crimson-hex":       { primaryColor: "#E63946", accentColor: "#E63946", textColor: "#111111", backgroundColor: "#FFFFFF" },
  "orange-swirl":      { primaryColor: "#F2762E", accentColor: "#F2762E", textColor: "#1b1b1b", backgroundColor: "#FAFAF6" },
  "coral-card":        { primaryColor: "#F08A2C", accentColor: "#F08A2C", textColor: "#2b2f33", backgroundColor: "#F1EFE9" },
  "orange-dynamic":    { primaryColor: "#F97316", accentColor: "#FDBA74", textColor: "#FFFFFF", backgroundColor: "#2b2e31" },
  "blue-wave":         { primaryColor: "#1B3F7A", accentColor: "#4A9ED6", textColor: "#1E293B", backgroundColor: "#FFFFFF" },
  "violet-gradient":   { primaryColor: "#EC4899", accentColor: "#8B5CF6", textColor: "#1F1B2E", backgroundColor: "#FFFFFF" },
};

const FONTS = [
  "Inter", "Space Grotesk", "Georgia",
  "Helvetica", "Arial", "Times New Roman", "Roboto",
];

interface ColorPreset {
  id: string;
  name: string;
  vibe: string;
  // [textColor, primaryColor, accentColor, backgroundColor]
  hex: [string, string, string, string];
}

const COLOR_PRESETS: ColorPreset[] = [
  { id: "corporate-navy",  name: "Corporate Navy",     vibe: "Safe • Professional", hex: ["#0F172A", "#1E3A8A", "#3B82F6", "#F8FAFC"] },
  { id: "modern-dev",      name: "Modern Developer",   vibe: "Tech • Clean",        hex: ["#111827", "#2563EB", "#60A5FA", "#E5E7EB"] },
  { id: "minimal-green",   name: "Minimal Green ATS",  vibe: "Clean • HR-friendly", hex: ["#0B0F14", "#166534", "#22C55E", "#F1F5F9"] },
  { id: "pure-ats",        name: "Pure Black & White", vibe: "No-risk • ATS max",   hex: ["#000000", "#1F2937", "#9CA3AF", "#FFFFFF"] },
  { id: "creative-orange", name: "Creative Orange Pop",vibe: "Bold • Portfolio",    hex: ["#111827", "#F97316", "#FDBA74", "#F3F4F6"] },
  { id: "soft-purple",     name: "Soft Purple Tech",   vibe: "Modern • SaaS",       hex: ["#1F1B2E", "#7C3AED", "#A78BFA", "#F5F3FF"] },
  { id: "linkedin-blue",   name: "LinkedIn Blue",      vibe: "Safe • Professional", hex: ["#0A66C2", "#1E40AF", "#93C5FD", "#F8FAFC"] },
  { id: "elegant-gray",    name: "Elegant Gray",       vibe: "Editorial • Refined", hex: ["#111827", "#374151", "#9CA3AF", "#F9FAFB"] },
];

// ── Color helpers ──────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function shiftColor(hex: string, intensity: Intensity): string {
  if (intensity === "normal") return hex;
  const [r, g, b] = hexToRgb(hex);
  if (intensity === "soft") {
    const f = 0.28;
    return rgbToHex(Math.round(r + (255 - r) * f), Math.round(g + (255 - g) * f), Math.round(b + (255 - b) * f));
  }
  const f = 0.18;
  return rgbToHex(Math.round(r * (1 - f)), Math.round(g * (1 - f)), Math.round(b * (1 - f)));
}

function presetToColors(preset: ColorPreset, intensity: Intensity): ColorPatch {
  const [textColor, primaryColor, accentColor, backgroundColor] = preset.hex.map((h) => shiftColor(h, intensity));
  return { textColor, primaryColor, accentColor, backgroundColor };
}

function colorsMatchDefaults(c: Resume["customization"], defaults: ColorPatch): boolean {
  return (
    c.primaryColor === defaults.primaryColor &&
    c.accentColor === defaults.accentColor &&
    c.textColor === defaults.textColor &&
    c.backgroundColor === defaults.backgroundColor
  );
}

// Sets --swatch imperatively so the React `style` prop is never used (avoids linter warning).
function ColorDot({ hex }: { hex: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => { ref.current?.style.setProperty("--swatch", hex); }, [hex]);
  return <span ref={ref} className="color-swatch h-4 w-4 flex-shrink-0 rounded-full border border-black/10 shadow-sm" />;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const CustomizationPanel = memo(function CustomizationPanel({ resume, update }: { resume: Resume; update: Updater }) {
  const c = resume.customization;

  // Detect initial state: "template-default" | preset id | "custom"
  const [activePreset, setActivePreset] = useState<string>(() => {
    const defaults = TEMPLATE_DEFAULT_COLORS[c.template];
    if (defaults && colorsMatchDefaults(c, defaults)) return "template-default";
    const match = COLOR_PRESETS.find(
      (p) => p.hex[1] === c.primaryColor && p.hex[2] === c.accentColor &&
             p.hex[0] === c.textColor    && p.hex[3] === c.backgroundColor,
    );
    return match?.id ?? "custom";
  });
  const [intensity, setIntensity] = useState<Intensity>("normal");

  const setC = (patch: Partial<typeof c>) =>
    update((r) => ({ ...r, customization: { ...r.customization, ...patch } }));

  const applyTemplateDefaults = (templateId: TemplateId) => {
    const defaults = TEMPLATE_DEFAULT_COLORS[templateId];
    if (defaults) {
      setC(defaults);
      setActivePreset("template-default");
    }
  };

  const applyPreset = (preset: ColorPreset) => {
    setActivePreset(preset.id);
    setC(presetToColors(preset, intensity));
  };

  const changeIntensity = (next: Intensity) => {
    setIntensity(next);
    // Only re-apply if a color preset (not template defaults) is active
    if (activePreset !== "custom" && activePreset !== "template-default") {
      const preset = COLOR_PRESETS.find((p) => p.id === activePreset);
      if (preset) setC(presetToColors(preset, next));
    }
  };

  const onManualColor = (key: keyof ColorPatch, val: string) => {
    setActivePreset("custom");
    setC({ [key]: val });
  };

  const templateDefaults = TEMPLATE_DEFAULT_COLORS[c.template];
  const templateName = TEMPLATE_LIST.find((t) => t.id === c.template)?.name ?? c.template;
  const activePresetName = COLOR_PRESETS.find((p) => p.id === activePreset)?.name;

  const activeLabel =
    activePreset === "template-default" ? `${templateName} defaults`
    : activePreset === "custom"         ? undefined
    : activePresetName;

  return (
    <div className="space-y-3">
      {/* ── Template ── */}
      <Accordion title="Template" defaultOpen>
        <div className="max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-2">
            {TEMPLATE_LIST.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  const defaults = TEMPLATE_DEFAULT_COLORS[t.id];
                  update((r) => ({
                    ...r,
                    customization: { ...r.customization, template: t.id, ...(defaults ?? {}) },
                  }));
                  setActivePreset("template-default");
                }}
                className={`rounded-lg border p-3 text-left text-xs transition-all ${
                  c.template === t.id
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="font-display text-sm font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.tag}</div>
              </button>
            ))}
          </div>
        </div>
      </Accordion>

      {/* ── Colors ── */}
      <Accordion title="Colors" defaultOpen>

        {/* Template defaults row */}
        {templateDefaults && (
          <div className="mb-4">
            <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
              Template defaults
            </div>
            <div
              className={`flex items-center gap-3 rounded-lg border p-2.5 transition-all ${
                activePreset === "template-default"
                  ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                  : "border-border"
              }`}
            >
              {/* 4 dots */}
              <div className="flex items-center gap-1">
                {[templateDefaults.textColor, templateDefaults.primaryColor, templateDefaults.accentColor, templateDefaults.backgroundColor].map((hex, i) => (
                  <ColorDot key={i} hex={hex} />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold truncate">{templateName}</div>
                <div className="text-[10px] text-muted-foreground">Designed defaults</div>
              </div>
              {activePreset === "template-default" ? (
                <span className="text-[10px] font-medium text-primary flex-shrink-0">✓ Active</span>
              ) : (
                <button
                  type="button"
                  onClick={() => applyTemplateDefaults(c.template)}
                  className="flex-shrink-0 rounded-md bg-primary/10 px-2 py-1 text-[10px] font-medium text-primary hover:bg-primary/20"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Intensity toggle — only affects color presets */}
        <div className="mb-4">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
            Intensity
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-border text-xs">
            {(["soft", "normal", "bold"] as Intensity[]).map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => changeIntensity(level)}
                className={`py-1.5 font-medium capitalize transition-all ${
                  intensity === level
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent/40"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Palette preset cards */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Palette</div>
            <div className="text-[10px] font-medium">
              {activeLabel ? (
                <span className="text-primary">{activeLabel}</span>
              ) : (
                <span className="text-amber-500">Custom</span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className={`rounded-lg border p-2.5 text-left transition-all ${
                    isActive
                      ? "border-primary bg-primary/10 ring-1 ring-primary/30"
                      : "border-border hover:border-primary/40 hover:bg-accent/20"
                  }`}
                >
                  <div className="mb-2 flex items-center gap-1">
                    {preset.hex.map((hex, i) => <ColorDot key={i} hex={hex} />)}
                  </div>
                  <div className="text-[11px] font-semibold leading-tight">{preset.name}</div>
                  <div className="mt-0.5 text-[10px] leading-tight text-muted-foreground">{preset.vibe}</div>
                  <div className={`mt-1.5 text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground/70"}`}>
                    {isActive ? "✓ Applied" : "Apply"}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual override */}
        <div>
          <div className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
            Override
            {activePreset !== "custom" && (
              <span className="ml-1 normal-case text-amber-400/90">→ switches to Custom</span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ColorField label="Primary"    value={c.primaryColor}    onChange={(v) => onManualColor("primaryColor", v)} />
            <ColorField label="Accent"     value={c.accentColor}     onChange={(v) => onManualColor("accentColor", v)} />
            <ColorField label="Text"       value={c.textColor}       onChange={(v) => onManualColor("textColor", v)} />
            <ColorField label="Background" value={c.backgroundColor} onChange={(v) => onManualColor("backgroundColor", v)} />
          </div>
        </div>
      </Accordion>

      {/* ── Typography & spacing ── */}
      <Accordion title="Typography & spacing">
        <div className="space-y-3">
          <label className="block text-xs">
            <div className="text-muted-foreground mb-1">Font family</div>
            <select
              value={c.fontFamily}
              onChange={(e) => setC({ fontFamily: e.target.value })}
              className="w-full rounded-md border border-border bg-card px-2 py-1.5 text-sm"
            >
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </label>
          <Slider label="Font size"       min={9}   max={14} step={0.5}  value={c.fontSize}        onChange={(v) => setC({ fontSize: v })}        unit="px" />
          <Slider label="Section spacing" min={8}   max={40} step={1}    value={c.sectionSpacing}  onChange={(v) => setC({ sectionSpacing: v })}  unit="px" />
          <Slider label="Line height"     min={1.1} max={2}  step={0.05} value={c.lineHeight}      onChange={(v) => setC({ lineHeight: v })} />
        </div>
      </Accordion>
    </div>
  );
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block text-xs">
      <div className="text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center gap-2 rounded-md border border-border bg-card p-1">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-7 w-7 cursor-pointer rounded border-none bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 bg-transparent px-1 text-xs outline-none"
        />
      </div>
    </label>
  );
}

function Slider({ label, value, onChange, min, max, step, unit }: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; unit?: string;
}) {
  return (
    <label className="block text-xs">
      <div className="flex justify-between text-muted-foreground mb-1">
        <span>{label}</span>
        <span>{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
    </label>
  );
}
