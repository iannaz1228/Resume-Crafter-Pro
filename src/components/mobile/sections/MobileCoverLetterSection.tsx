import { useEffect, useRef } from "react";
import { Sparkles } from "lucide-react";
import type { Resume } from "@/lib/resume-types";
import type { CoverLetterData, CoverLetterSettings } from "@/lib/cover-letter-types";
import { createBlankCoverLetter } from "@/lib/default-cover-letter";

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
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      {multiline ? (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full min-h-[4rem] resize-none overflow-hidden rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10 whitespace-pre-wrap [overflow-wrap:anywhere] break-words"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
      )}
    </div>
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
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <select
        title={label}
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
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
    <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
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

export function MobileCoverLetterSection({ resume, update }: Props) {
  const cl: CoverLetterData = { ...createBlankCoverLetter(), ...resume.coverLetter };

  const setCL = (patch: Partial<CoverLetterData>) =>
    update((r) => ({
      ...r,
      coverLetter: { ...createBlankCoverLetter(), ...r.coverLetter, ...patch },
    }));

  const setSettings = (patch: Partial<CoverLetterSettings>) =>
    setCL({ settings: { ...cl.settings, ...patch } });

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">Cover Letter</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Name and contact info are pulled from your Personal section
        </p>
      </div>

      {/* Recipient */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recipient
        </p>
        <Field
          label="Date"
          value={cl.date}
          onChange={(v) => setCL({ date: v })}
          placeholder="Leave blank for today's date"
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
          placeholder="Re: Senior Product Designer"
        />
      </div>

      {/* Letter Content */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Letter
        </p>
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
          placeholder="Thank you for your time…"
          multiline
        />
        <Field
          label="Closing Phrase"
          value={cl.closingPhrase}
          onChange={(v) => setCL({ closingPhrase: v })}
          placeholder="Sincerely,"
        />
      </div>

      {/* Settings */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Settings
        </p>
        <Toggle
          label="Show header"
          checked={cl.settings.showHeader}
          onChange={(v) => setSettings({ showHeader: v })}
        />
        <Toggle
          label="Show contact info"
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
      </div>

      {/* AI Assist */}
      <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Assist
        </p>
        <p className="text-xs text-muted-foreground">
          Save job details for AI generation — launching soon.
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
          placeholder="Figma, design systems…"
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
          className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-dashed border-primary/40 bg-primary/5 px-4 py-3 text-xs font-medium text-primary/50"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Generate with AI
          <span className="ml-auto rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
            Coming Soon
          </span>
        </button>
      </div>
    </div>
  );
}
