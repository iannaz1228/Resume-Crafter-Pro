import { useState } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2, FolderGit2 } from "lucide-react";
import type { Resume, ProjectItem } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

function newItem(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    role: "",
    description: "",
    tech: "",
    github: "",
    demo: "",
    website: "",
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

function ProjectCard({
  item,
  index,
  expanded,
  onToggle,
  onUpdate,
  onDelete,
}: {
  item: ProjectItem;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  onUpdate: (patch: Partial<ProjectItem>) => void;
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
            {item.name || <span className="font-normal text-muted-foreground">Project Name</span>}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {item.tech || "Add tech stack"}
          </p>
        </div>
        {expanded
          ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
        }
      </button>

      {expanded && (
        <div className="space-y-4 border-t border-border px-4 pb-4 pt-4">
          <Field label="Project Name" value={item.name} onChange={(v) => onUpdate({ name: v })} placeholder="Aurora Design System" />
          <Field label="Your Role" value={item.role} onChange={(v) => onUpdate({ role: v })} placeholder="Lead Designer" />
          <div>
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={item.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={4}
              placeholder="What problem did it solve? What was your impact?"
              className="w-full resize-none rounded-xl border border-border bg-background px-3.5 py-3 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
            />
          </div>
          <Field label="Tech Stack" value={item.tech} onChange={(v) => onUpdate({ tech: v })} placeholder="React, TypeScript, Tailwind" />
          <Field label="GitHub URL" value={item.github} onChange={(v) => onUpdate({ github: v })} placeholder="github.com/user/project" />
          <Field label="Live Demo URL" value={item.demo} onChange={(v) => onUpdate({ demo: v })} placeholder="project.vercel.app" />
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

export function MobileProjectsSection({ resume, update }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(
    resume.projects[0]?.id ?? null
  );

  const addItem = () => {
    const item = newItem();
    update((r) => ({ ...r, projects: [...r.projects, item] }));
    setExpandedId(item.id);
  };

  const updateItem = (id: string, patch: Partial<ProjectItem>) =>
    update((r) => ({
      ...r,
      projects: r.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));

  const deleteItem = (id: string) => {
    update((r) => ({ ...r, projects: r.projects.filter((p) => p.id !== id) }));
    setExpandedId(null);
  };

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Projects</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {resume.projects.length} project{resume.projects.length !== 1 ? "s" : ""}
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

      {resume.projects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <FolderGit2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No projects added yet</p>
          <button type="button" onClick={addItem} className="mt-2 text-xs text-primary underline underline-offset-2">
            Add your first project
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {resume.projects.map((item, i) => (
            <ProjectCard
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
