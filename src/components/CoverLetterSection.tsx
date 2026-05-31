import { useEffect, useRef } from "react";
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Resume } from "@/lib/resume-types";
import type { CoverLetterData, CoverLetterSettings } from "@/lib/cover-letter-types";
import { createBlankCoverLetter } from "@/lib/default-cover-letter";

type Updater = (fn: (r: Resume) => Resume) => void;

// ─── Reusable field components ────────────────────────────────────────────────

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  multiline?: boolean;
}) {
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      {multiline ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full min-h-[4.5rem] resize-none overflow-hidden rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary whitespace-pre-wrap [overflow-wrap:anywhere] break-words"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
        />
      )}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <div className="mb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <select
        title={label}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3">
      <span className="text-sm text-foreground">{label}</span>
      <input
        type="checkbox"
        className="sr-only"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${checked ? "bg-primary" : "bg-muted"}`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-4.5" : "translate-x-0.5"}`}
        />
      </span>
    </label>
  );
}

function Accordion({
  title,
  defaultOpen,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left font-display text-sm font-semibold hover:bg-accent/30"
      >
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        {title}
      </button>
      {open && <div className="space-y-3 border-t border-border p-4">{children}</div>}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CoverLetterSection({ resume, update }: { resume: Resume; update: Updater }) {
  const cl: CoverLetterData = { ...createBlankCoverLetter(), ...resume.coverLetter };

  const setCL = (patch: Partial<CoverLetterData>) =>
    update((r) => ({
      ...r,
      coverLetter: { ...createBlankCoverLetter(), ...r.coverLetter, ...patch },
    }));

  const setSettings = (patch: Partial<CoverLetterSettings>) =>
    setCL({ settings: { ...cl.settings, ...patch } });

  return (
    <div className="space-y-3">
      {/* Intro banner */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-xs text-muted-foreground">
        Your name, title, and contact info are pulled automatically from your resume's Personal
        section.
      </div>

      {/* Recipient */}
      <Accordion title="Recipient" defaultOpen>
        <Field
          label="Date"
          value={cl.date}
          onChange={(v) => setCL({ date: v })}
          placeholder="Leave blank to use today's date"
        />
        <Field
          label="Hiring Manager Name"
          value={cl.hiringManagerName}
          onChange={(v) => setCL({ hiringManagerName: v })}
          placeholder="Ms. Sarah Johnson"
        />
        <Field
          label="Hiring Manager Title"
          value={cl.hiringManagerTitle}
          onChange={(v) => setCL({ hiringManagerTitle: v })}
          placeholder="Head of Product"
        />
        <Field
          label="Company Name"
          value={cl.companyName}
          onChange={(v) => setCL({ companyName: v })}
          placeholder="Acme Corp"
        />
        <Field
          label="Company Address"
          value={cl.companyAddress}
          onChange={(v) => setCL({ companyAddress: v })}
          placeholder={"123 Main St\nSan Francisco, CA 94101"}
          multiline
        />
        <Field
          label="Subject Line (Optional)"
          value={cl.subjectLine}
          onChange={(v) => setCL({ subjectLine: v })}
          placeholder="Re: Senior Product Designer — Job ID 4821"
        />
      </Accordion>

      {/* Letter Content */}
      <Accordion title="Letter Content" defaultOpen>
        <Field
          label="Greeting"
          value={cl.greeting}
          onChange={(v) => setCL({ greeting: v })}
          placeholder="Dear Hiring Manager,"
        />
        <Field
          label="Introduction"
          value={cl.introduction}
          onChange={(v) => setCL({ introduction: v })}
          placeholder="I am writing to express my interest in…"
          multiline
        />
        <Field
          label="Body Paragraph 1"
          value={cl.bodyParagraph1}
          onChange={(v) => setCL({ bodyParagraph1: v })}
          placeholder="In my current role at…"
          multiline
        />
        <Field
          label="Body Paragraph 2 (Optional)"
          value={cl.bodyParagraph2}
          onChange={(v) => setCL({ bodyParagraph2: v })}
          placeholder="Additionally, I bring…"
          multiline
        />
        <Field
          label="Closing Paragraph"
          value={cl.closingParagraph}
          onChange={(v) => setCL({ closingParagraph: v })}
          placeholder="Thank you for your time and consideration…"
          multiline
        />
        <Field
          label="Closing Phrase"
          value={cl.closingPhrase}
          onChange={(v) => setCL({ closingPhrase: v })}
          placeholder="Sincerely,"
        />
      </Accordion>

      {/* AI Assist */}
      <Accordion title="AI Assist (Coming Soon)">
        <p className="text-xs text-muted-foreground">
          Fill in the job details below. When AI generation launches, these fields will be used to
          craft a tailored cover letter.
        </p>
        <Field
          label="Job Title"
          value={cl.jobTitle}
          onChange={(v) => setCL({ jobTitle: v })}
          placeholder="Senior Product Designer"
        />
        <Field
          label="Key Skills"
          value={cl.keySkills}
          onChange={(v) => setCL({ keySkills: v })}
          placeholder="Figma, design systems, user research…"
        />
        <Field
          label="Job Description"
          value={cl.jobDescription}
          onChange={(v) => setCL({ jobDescription: v })}
          placeholder="Paste the job description here…"
          multiline
        />
        <button
          type="button"
          disabled
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-4 py-2.5 text-xs font-medium text-primary/50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate with AI
          <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Coming Soon
          </span>
        </button>
      </Accordion>

      {/* Settings */}
      <Accordion title="Settings">
        <Toggle
          label="Show header (name + contact)"
          checked={cl.settings.showHeader}
          onChange={(v) => setSettings({ showHeader: v })}
        />
        <Toggle
          label="Show contact info in header"
          checked={cl.settings.showContactInfo}
          onChange={(v) => setSettings({ showContactInfo: v })}
        />
        <SelectField
          label="Date Format"
          value={cl.settings.dateFormat}
          onChange={(v) => setSettings({ dateFormat: v as CoverLetterSettings["dateFormat"] })}
          options={[
            { value: "long", label: "June 1, 2026" },
            { value: "short", label: "Jun 1, 2026" },
            { value: "numeric", label: "6/1/2026" },
          ]}
        />
        <SelectField
          label="Signature Style"
          value={cl.settings.signatureStyle}
          onChange={(v) =>
            setSettings({ signatureStyle: v as CoverLetterSettings["signatureStyle"] })
          }
          options={[
            { value: "typed", label: "Typed (name + email)" },
            { value: "name-only", label: "Name only" },
            { value: "formal", label: "Formal (name + title)" },
          ]}
        />
      </Accordion>
    </div>
  );
}
