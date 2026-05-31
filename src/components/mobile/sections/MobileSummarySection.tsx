import type { Resume } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

export function MobileSummarySection({ resume, update }: Props) {
  const charCount = resume.summary.length;
  const wordCount = resume.summary.trim() ? resume.summary.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">Professional Summary</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">2–4 sentences about your experience and key value</p>
      </div>

      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <textarea
          value={resume.summary}
          onChange={(e) => update((r) => ({ ...r, summary: e.target.value }))}
          rows={8}
          placeholder="Passionate product designer with 7+ years crafting human-centered SaaS experiences. Shipped 0→1 products used by 1M+ users…"
          className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
          <span className={charCount > 600 ? "text-amber-500" : ""}>{charCount} characters</span>
        </div>
      </div>

      {charCount === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-5 text-center">
          <p className="text-sm font-medium text-muted-foreground">No summary yet</p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            A strong summary can increase interview callbacks by 40%
          </p>
        </div>
      )}
    </div>
  );
}
