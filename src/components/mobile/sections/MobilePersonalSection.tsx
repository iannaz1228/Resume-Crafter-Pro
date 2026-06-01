import { useRef } from "react";
import { Camera, X } from "lucide-react";
import type { Resume } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

const SHAPES = [
  { value: "circle",  label: "Circle" },
  { value: "rounded", label: "Rounded" },
  { value: "square",  label: "Square" },
] as const;

export function MobilePersonalSection({ resume, update }: Props) {
  const p = resume.personal;
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof p, value: string | boolean) =>
    update((r) => ({ ...r, personal: { ...r.personal, [key]: value } }));

  const handlePhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => set("photo", e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const shapeClass =
    p.photoShape === "circle" ? "rounded-full" : p.photoShape === "rounded" ? "rounded-xl" : "rounded-sm";

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">Personal Info</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Your name, title, and contact details</p>
      </div>

      {/* ── Photo upload ─────────────────────────────────────────── */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Profile Photo
        </p>

        <div className="flex items-center gap-4">
          {/* Preview / tap-to-upload */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={`relative h-[72px] w-[72px] shrink-0 overflow-hidden bg-muted transition-opacity active:opacity-70 ${shapeClass}`}
            aria-label="Upload photo"
          >
            {p.photo ? (
              <img src={p.photo} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                <Camera className="h-5 w-5" />
                <span className="text-[9px] font-medium">Upload</span>
              </span>
            )}
          </button>

          <div className="flex-1 space-y-3">
            {/* Show / hide toggle */}
            <label className="flex cursor-pointer items-center justify-between">
              <span className="text-sm text-foreground">Show photo on resume</span>
              <input
                type="checkbox"
                className="sr-only"
                checked={!!p.showPhoto}
                onChange={(e) => set("showPhoto", e.target.checked)}
              />
              <span
                aria-hidden="true"
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${p.showPhoto ? "bg-primary" : "bg-muted"}`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${p.showPhoto ? "translate-x-4" : "translate-x-0.5"}`}
                />
              </span>
            </label>

            {/* Shape picker */}
            <div className="flex gap-1.5">
              {SHAPES.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => set("photoShape", value)}
                  className={`flex-1 rounded-lg py-1 text-[11px] font-medium transition-colors ${
                    p.photoShape === value
                      ? "bg-primary/10 text-primary"
                      : "border border-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Size slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Photo Size</span>
            <span className="text-xs font-semibold text-foreground">{p.photoSize ?? 80}px</span>
          </div>
          <input
            type="range"
            aria-label="Photo size"
            min={48}
            max={160}
            value={p.photoSize ?? 80}
            onChange={(e) => update((r) => ({ ...r, personal: { ...r.personal, photoSize: Number(e.target.value) } }))}
            className="w-full accent-primary"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground/60">
            <span>Small</span>
            <span>Large</span>
          </div>
        </div>

        {/* Action row */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground"
          >
            <Camera className="h-3.5 w-3.5" />
            {p.photo ? "Change Photo" : "Upload Photo"}
          </button>
          {p.photo && (
            <button
              type="button"
              onClick={() => set("photo", "")}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 py-2.5 text-xs font-medium text-destructive"
              aria-label="Remove photo"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          )}
        </div>

        {/* Hidden file input — accepts gallery + camera on mobile */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          title="Upload profile photo"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])}
        />
      </div>

      {/* ── Name & title ─────────────────────────────────────────── */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <Field
          label="Full Name"
          value={p.fullName}
          onChange={(v) => set("fullName", v)}
          placeholder="Alex Morgan"
        />
        <Field
          label="Professional Title"
          value={p.title}
          onChange={(v) => set("title", v)}
          placeholder="Senior Product Designer"
        />
      </div>

      {/* ── Contact ──────────────────────────────────────────────── */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
        <Field
          label="Email"
          type="email"
          value={p.email}
          onChange={(v) => set("email", v)}
          placeholder="alex@example.com"
        />
        <Field
          label="Phone"
          type="tel"
          value={p.phone}
          onChange={(v) => set("phone", v)}
          placeholder="+1 (555) 123-4567"
        />
        <Field
          label="Location"
          value={p.location}
          onChange={(v) => set("location", v)}
          placeholder="San Francisco, CA"
        />
      </div>

      {/* ── Online ───────────────────────────────────────────────── */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Online</p>
        <Field
          label="LinkedIn URL"
          value={p.linkedin}
          onChange={(v) => set("linkedin", v)}
          placeholder="linkedin.com/in/yourname"
        />
        <Field
          label="GitHub URL"
          value={p.github}
          onChange={(v) => set("github", v)}
          placeholder="github.com/yourname"
        />
        <Field
          label="Portfolio / Website"
          value={p.portfolio}
          onChange={(v) => {
            set("portfolio", v);
            set("website", v);
          }}
          placeholder="yourwebsite.com"
        />
      </div>
    </div>
  );
}
