import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2, Users } from "lucide-react";
import type { Resume, ReferenceItem } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

function newItem(): ReferenceItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    position: "",
    contact: "",
    hidden: false,
  };
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
      />
    </div>
  );
}

function RefCard({
  item,
  index,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  item: ReferenceItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<ReferenceItem>) => void;
  onDelete: () => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left"
      >
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {item.name || <span className="font-normal text-muted-foreground">Reference Name</span>}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {item.position || "Title / Company"}
          </p>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border px-4 pb-4 pt-4">
          <Field label="Full Name" value={item.name} onChange={(v) => onUpdate({ name: v })} placeholder="Jane Smith" />
          <Field label="Title & Company" value={item.position} onChange={(v) => onUpdate({ position: v })} placeholder="Engineering Manager at Acme Inc." />
          <Field label="Email / Phone" value={item.contact} onChange={(v) => onUpdate({ contact: v })} placeholder="jane@acme.com" />
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}

const MODE_OPTIONS = [
  { value: "available", label: "Available upon request", desc: "Shows a standard note on your resume" },
  { value: "custom",    label: "Show references",         desc: "List specific people with contact info" },
  { value: "hidden",    label: "Hide section",            desc: "Don't include references at all" },
] as const;

export function MobileReferencesSection({ resume, update }: Props) {
  const mode = resume.customization.referencesMode ?? "available";
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const setMode = (m: typeof mode) =>
    update((r) => ({ ...r, customization: { ...r.customization, referencesMode: m } }));

  const addItem = () => {
    const item = newItem();
    update((r) => ({ ...r, references: [...r.references, item] }));
    setExpandedId(item.id);
  };

  const updateItem = (id: string, patch: Partial<ReferenceItem>) =>
    update((r) => ({
      ...r,
      references: r.references.map((ref) => (ref.id === id ? { ...ref, ...patch } : ref)),
    }));

  const deleteItem = (id: string) => {
    update((r) => ({ ...r, references: r.references.filter((ref) => ref.id !== id) }));
    setExpandedId(null);
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">References</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">How references appear on your resume</p>
      </div>

      {/* Mode selector */}
      <div className="space-y-2 rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Display Mode</p>
        {MODE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setMode(opt.value)}
            className={`flex w-full items-start gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors ${
              mode === opt.value
                ? "border-primary bg-primary/10"
                : "border-border bg-background hover:border-primary/40"
            }`}
          >
            <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${
              mode === opt.value ? "border-primary bg-primary" : "border-muted-foreground"
            }`} />
            <div>
              <p className={`text-sm font-medium ${mode === opt.value ? "text-primary" : "text-foreground"}`}>
                {opt.label}
              </p>
              <p className="text-xs text-muted-foreground">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Reference cards — only shown in "custom" mode */}
      {mode === "custom" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              {resume.references.length} reference{resume.references.length !== 1 ? "s" : ""}
            </p>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
            >
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>

          {resume.references.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
              <Users className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm font-medium text-muted-foreground">No references added yet</p>
              <button type="button" onClick={addItem} className="mt-2 text-xs text-primary underline underline-offset-2">
                Add your first reference
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {resume.references.map((item, i) => (
                <RefCard
                  key={item.id}
                  item={item}
                  index={i}
                  expanded={expandedId === item.id}
                  onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                  onUpdate={(patch) => updateItem(item.id, patch)}
                  onDelete={() => deleteItem(item.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
