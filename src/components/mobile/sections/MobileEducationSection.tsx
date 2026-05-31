import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2, GraduationCap } from "lucide-react";
import type { Resume, EducationItem } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

function newItem(): EducationItem {
  return {
    id: crypto.randomUUID(),
    school: "",
    degree: "",
    field: "",
    startDate: "",
    endDate: "",
    gpa: "",
    honors: "",
    hidden: false,
    showGpa: false,
    showHonors: false,
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

function EduCard({
  item,
  index,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  item: EducationItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<EducationItem>) => void;
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
            {item.degree
              ? `${item.degree}${item.field ? ` in ${item.field}` : ""}`
              : <span className="font-normal text-muted-foreground">Degree</span>}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {item.school || "School"}{item.endDate ? ` · ${item.endDate}` : ""}
          </p>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        }
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border px-4 pb-4 pt-4">
          <Field label="School / University" value={item.school} onChange={(v) => onUpdate({ school: v })} placeholder="Stanford University" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Degree" value={item.degree} onChange={(v) => onUpdate({ degree: v })} placeholder="B.S." />
            <Field label="Field of Study" value={item.field} onChange={(v) => onUpdate({ field: v })} placeholder="Computer Science" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Start" value={item.startDate} onChange={(v) => onUpdate({ startDate: v })} placeholder="Sep 2016" />
            <Field label="End" value={item.endDate} onChange={(v) => onUpdate({ endDate: v })} placeholder="May 2020" />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={item.showGpa}
                onChange={(e) => onUpdate({ showGpa: e.target.checked })}
                className="h-4 w-4 rounded border-border accent-primary"
              />
              Show GPA
            </label>
            {item.showGpa && (
              <input
                value={item.gpa}
                onChange={(e) => onUpdate({ gpa: e.target.value })}
                placeholder="3.9"
                className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            )}
          </div>
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

export function MobileEducationSection({ resume, update }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.education[0]?.id ?? null
  );

  const addItem = () => {
    const item = newItem();
    update((r) => ({ ...r, education: [...r.education, item] }));
    setExpandedId(item.id);
  };

  const updateItem = (id: string, patch: Partial<EducationItem>) =>
    update((r) => ({
      ...r,
      education: r.education.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

  const deleteItem = (id: string) => {
    update((r) => ({ ...r, education: r.education.filter((e) => e.id !== id) }));
    setExpandedId(null);
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Education</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {resume.education.length} entr{resume.education.length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {resume.education.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <GraduationCap className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No education added yet</p>
          <button type="button" onClick={addItem} className="mt-2 text-xs text-primary underline underline-offset-2">
            Add a degree or certification
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resume.education.map((item, i) => (
            <EduCard
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
    </div>
  );
}
