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

export function MobilePersonalSection({ resume, update }: Props) {
  const p = resume.personal;

  const set = (key: keyof typeof p, value: string) =>
    update((r) => ({ ...r, personal: { ...r.personal, [key]: value } }));

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">Personal Info</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">Your name, title, and contact details</p>
      </div>

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

      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Online</p>
        <Field
          label="LinkedIn URL"
          value={p.linkedin}
          onChange={(v) => set("linkedin", v)}
          placeholder="linkedin.com/in/iannaz1228"
        />
        <Field
          label="GitHub URL"
          value={p.github}
          onChange={(v) => set("github", v)}
          placeholder="github.com/iannaz1228"
        />
        <Field
          label="Portfolio / Website"
          value={p.portfolio}
          onChange={(v) => {
            set("portfolio", v);
            set("website", v);
          }}
          placeholder="infosyscoreteam.com"
        />
      </div>
    </div>
  );
}
