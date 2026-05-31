import { useState, useEffect, useRef } from "react";
import { DndContext, closestCenter, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, ChevronRight, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import type { Resume } from "@/lib/resume-types";
import { uid } from "@/lib/default-resume";

type Updater = (fn: (r: Resume) => Resume) => void;

// ---------- Reusable bits ----------

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
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
      <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
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

function VisibilityToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className="grid h-7 w-7 place-items-center rounded-md hover:bg-accent/40 text-muted-foreground"
      aria-label={on ? "Hide" : "Show"}
      type="button"
    >
      {on ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
    </button>
  );
}

export function Accordion({
  title,
  defaultOpen,
  children,
  right,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  right?: React.ReactNode;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex flex-1 items-center gap-2 px-4 py-3 text-left font-display text-sm font-semibold hover:bg-accent/30"
        >
          {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {title}
        </button>
        {right && <div className="px-2">{right}</div>}
      </div>
      {open && <div className="border-t border-border p-4 space-y-3">{children}</div>}
    </div>
  );
}

// ---------- Personal ----------

export function PersonalSection({ resume, update }: { resume: Resume; update: Updater }) {
  const p = resume.personal;
  const setP = (patch: Partial<typeof p>) => update((r) => ({ ...r, personal: { ...r.personal, ...patch } }));
  const setVis = (k: keyof typeof p.visibility) =>
    update((r) => ({
      ...r,
      personal: { ...r.personal, visibility: { ...r.personal.visibility, [k]: !r.personal.visibility[k] } },
    }));

  const handlePhoto = async (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => setP({ photo: ev.target?.result as string });
    reader.readAsDataURL(file);
  };

  return (
    <Accordion title="Personal Information" defaultOpen>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name" value={p.fullName} onChange={(v) => setP({ fullName: v })} />
        <Field label="Professional title" value={p.title} onChange={(v) => setP({ title: v })} />
      </div>

      {/* Photo */}
      <div className="rounded-lg border border-border bg-background/50 p-3">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Profile photo</div>
          <label className="inline-flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={p.showPhoto}
              onChange={(e) => setP({ showPhoto: e.target.checked })}
            />
            Show photo
          </label>
        </div>
        <div className="mt-3 flex items-center gap-3">
          {p.photo ? (
            <img
              src={p.photo}
              alt=""
              className="h-16 w-16 object-cover"
              style={{ borderRadius: p.photoShape === "circle" ? "9999px" : p.photoShape === "rounded" ? 8 : 0 }}
            />
          ) : (
            <div className="grid h-16 w-16 place-items-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">
              No photo
            </div>
          )}
          <div className="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handlePhoto(e.target.files[0])}
              className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground"
            />
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <label className="text-muted-foreground">Shape</label>
              <select
                value={p.photoShape}
                onChange={(e) => setP({ photoShape: e.target.value as typeof p.photoShape })}
                className="rounded-md border border-border bg-card px-2 py-1"
              >
                <option value="circle">Circle</option>
                <option value="rounded">Rounded</option>
                <option value="square">Square</option>
              </select>
              <label className="text-muted-foreground ml-2">Size</label>
              <input
                type="range"
                min={48}
                max={160}
                value={p.photoSize}
                onChange={(e) => setP({ photoSize: Number(e.target.value) })}
              />
              <span className="text-muted-foreground">{p.photoSize}px</span>
            </div>
            {p.photo && (
              <button onClick={() => setP({ photo: undefined })} className="text-xs text-destructive hover:underline">
                Remove photo
              </button>
            )}
          </div>
        </div>
      </div>

      {(
        [
          ["phone", "Phone"],
          ["email", "Email"],
          ["location", "Location"],
          ["linkedin", "LinkedIn"],
          ["github", "GitHub"],
          ["portfolio", "Portfolio"],
          ["website", "Personal website"],
        ] as const
      ).map(([key, label]) => (
        <div key={key} className="flex items-end gap-2">
          <div className="flex-1">
            <Field
              label={label}
              value={(p as unknown as Record<string, string>)[key] || ""}
              onChange={(v) => setP({ [key]: v } as Partial<typeof p>)}
            />
          </div>
          <VisibilityToggle on={p.visibility[key]} onToggle={() => setVis(key)} />
        </div>
      ))}
    </Accordion>
  );
}

// ---------- Summary ----------

export function SummarySection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.summary;
  const taRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [resume.summary]);

  return (
    <Accordion
      title="Professional Summary"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, summary: !r.visibility.summary } }))} />}
    >
      <textarea
        ref={taRef}
        value={resume.summary}
        onChange={(e) => update((r) => ({ ...r, summary: e.target.value }))}
        rows={4}
        placeholder="A short pitch about who you are and what you do…"
        className="w-full min-h-[6rem] resize-none overflow-hidden rounded-lg border border-border bg-card px-3 py-2 text-sm outline-none focus:border-primary"
      />
      <div className="text-right text-[11px] text-muted-foreground">{resume.summary.length} characters</div>
    </Accordion>
  );
}

// ---------- Generic sortable list ----------

function SortableRow({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.6 : 1 }}
      className="rounded-lg border border-border bg-background/40 p-3"
    >
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          className="grid h-7 w-7 place-items-center rounded-md text-muted-foreground hover:bg-accent/40 cursor-grab"
          {...attributes}
          {...listeners}
          aria-label="Drag"
        >
          <GripVertical className="h-4 w-4" />
        </button>
        <div className="flex-1" />
      </div>
      {children}
    </div>
  );
}

// ---------- Experience ----------

export function ExperienceSection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.experience;
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const setItems = (items: typeof resume.experience) => update((r) => ({ ...r, experience: items }));

  const add = () =>
    update((r) => ({
      ...r,
      experience: [
        ...r.experience,
        { id: uid(), company: "", position: "", location: "", startDate: "", endDate: "", description: "" },
      ],
    }));

  const onDragEnd = (e: DragEndEvent) => {
    if (!e.over || e.active.id === e.over.id) return;
    const oldI = resume.experience.findIndex((x) => x.id === e.active.id);
    const newI = resume.experience.findIndex((x) => x.id === e.over!.id);
    setItems(arrayMove(resume.experience, oldI, newI));
  };

  return (
    <Accordion
      title="Work Experience"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, experience: !r.visibility.experience } }))} />}
    >
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={resume.experience.map((x) => x.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {resume.experience.map((item, idx) => (
              <SortableRow key={item.id} id={item.id}>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Field label="Position" value={item.position} onChange={(v) => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, position: v } : x)) }))} />
                  <Field label="Company" value={item.company} onChange={(v) => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, company: v } : x)) }))} />
                  <Field label="Location" value={item.location} onChange={(v) => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, location: v } : x)) }))} />
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start" value={item.startDate} onChange={(v) => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, startDate: v } : x)) }))} />
                    <Field label="End" value={item.endDate} onChange={(v) => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, endDate: v } : x)) }))} />
                  </div>
                </div>
                <div className="mt-2">
                  <Field label="Description / achievements" multiline value={item.description} onChange={(v) => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, description: v } : x)) }))} />
                </div>
                <div className="mt-2 flex justify-end gap-2">
                  <VisibilityToggle on={!item.hidden} onToggle={() => update((r) => ({ ...r, experience: r.experience.map((x, i) => (i === idx ? { ...x, hidden: !x.hidden } : x)) }))} />
                  <button onClick={() => update((r) => ({ ...r, experience: r.experience.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10" aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </SortableRow>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
        <Plus className="h-3.5 w-3.5" /> Add experience
      </button>
    </Accordion>
  );
}

// ---------- Education ----------

export function EducationSection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.education;
  const add = () =>
    update((r) => ({
      ...r,
      education: [...r.education, { id: uid(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", honors: "" }],
    }));
  return (
    <Accordion
      title="Education"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, education: !r.visibility.education } }))} />}
    >
      <div className="space-y-3">
        {resume.education.map((item, idx) => (
          <div key={item.id} className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="School" value={item.school} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, school: v } : x)) }))} />
              <Field label="Degree" value={item.degree} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, degree: v } : x)) }))} />
              <Field label="Field of study" value={item.field} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, field: v } : x)) }))} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Start" value={item.startDate} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, startDate: v } : x)) }))} />
                <Field label="End" value={item.endDate} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, endDate: v } : x)) }))} />
              </div>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="GPA" value={item.gpa} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, gpa: v } : x)) }))} />
                </div>
                <VisibilityToggle
                  on={item.showGpa !== false}
                  onToggle={() => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, showGpa: x.showGpa === false ? true : false } : x)) }))}
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="Honors" value={item.honors} onChange={(v) => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, honors: v } : x)) }))} />
                </div>
                <VisibilityToggle
                  on={item.showHonors !== false}
                  onToggle={() => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, showHonors: x.showHonors === false ? true : false } : x)) }))}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <VisibilityToggle on={!item.hidden} onToggle={() => update((r) => ({ ...r, education: r.education.map((x, i) => (i === idx ? { ...x, hidden: !x.hidden } : x)) }))} />
              <button type="button" onClick={() => update((r) => ({ ...r, education: r.education.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10" aria-label="Delete education">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
        <Plus className="h-3.5 w-3.5" /> Add education
      </button>
    </Accordion>
  );
}

// ---------- Projects ----------

export function ProjectsSection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.projects;
  const add = () =>
    update((r) => ({
      ...r,
      projects: [...r.projects, { id: uid(), name: "", role: "", description: "", tech: "", github: "", demo: "", website: "" }],
    }));
  return (
    <Accordion
      title="Projects"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, projects: !r.visibility.projects } }))} />}
    >
      <div className="space-y-3">
        {resume.projects.map((item, idx) => (
          <div key={item.id} className="rounded-lg border border-border bg-background/40 p-3 space-y-2">
            <div className="grid gap-2 sm:grid-cols-2">
              <Field label="Project name" value={item.name} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, name: v } : x)) }))} />
              <Field label="Role" value={item.role} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, role: v } : x)) }))} />
            </div>
            <Field label="Description" multiline value={item.description} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, description: v } : x)) }))} />
            <Field label="Tech" value={item.tech} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, tech: v } : x)) }))} />
            <div className="grid gap-2 sm:grid-cols-3">
              <Field label="GitHub" value={item.github} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, github: v } : x)) }))} />
              <Field label="Demo" value={item.demo} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, demo: v } : x)) }))} />
              <Field label="Website" value={item.website} onChange={(v) => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, website: v } : x)) }))} />
            </div>
            <div className="flex justify-end gap-2">
              <VisibilityToggle on={!item.hidden} onToggle={() => update((r) => ({ ...r, projects: r.projects.map((x, i) => (i === idx ? { ...x, hidden: !x.hidden } : x)) }))} />
              <button onClick={() => update((r) => ({ ...r, projects: r.projects.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
        <Plus className="h-3.5 w-3.5" /> Add project
      </button>
    </Accordion>
  );
}

// ---------- Skills ----------

export function SkillsSection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.skills;
  const c = resume.customization;
  const add = () =>
    update((r) => ({ ...r, skills: [...r.skills, { id: uid(), name: "", level: 70, category: "Skills" }] }));
  return (
    <Accordion
      title="Skills"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, skills: !r.visibility.skills } }))} />}
    >
      <div className="flex flex-wrap items-center gap-3 rounded-lg bg-background/40 p-2 text-xs">
        <span className="text-muted-foreground">Display</span>
        {(["bars", "percent", "pills", "text"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => update((r) => ({ ...r, customization: { ...r.customization, skillStyle: s } }))}
            className={`rounded-md px-2 py-1 capitalize ${c.skillStyle === s ? "bg-primary text-primary-foreground" : "hover:bg-accent/40"}`}
          >
            {s}
          </button>
        ))}
        <label className="ml-auto inline-flex items-center gap-1.5">
          <input
            type="checkbox"
            checked={c.showSkillLevels}
            onChange={(e) => update((r) => ({ ...r, customization: { ...r.customization, showSkillLevels: e.target.checked } }))}
          />
          Show levels
        </label>
      </div>
      <div className="space-y-2">
        {resume.skills.map((item, idx) => (
          <div key={item.id} className="rounded-lg border border-border bg-background/40 p-2 space-y-1.5">
            <div className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
              <input
                value={item.name}
                placeholder="Skill"
                onChange={(e) => update((r) => ({ ...r, skills: r.skills.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)) }))}
                className="rounded-md border border-border bg-card px-2 py-1 text-sm min-w-0"
              />
              <input
                value={item.category}
                placeholder="Category"
                onChange={(e) => update((r) => ({ ...r, skills: r.skills.map((x, i) => (i === idx ? { ...x, category: e.target.value } : x)) }))}
                className="rounded-md border border-border bg-card px-2 py-1 text-sm min-w-0"
              />
              <button type="button" aria-label="Delete skill" onClick={() => update((r) => ({ ...r, skills: r.skills.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                aria-label="Skill level"
                min={0}
                max={100}
                value={item.level}
                onChange={(e) => update((r) => ({ ...r, skills: r.skills.map((x, i) => (i === idx ? { ...x, level: Number(e.target.value) } : x)) }))}
                className="flex-1 min-w-0"
              />
              <span className="w-8 text-right text-[11px] text-muted-foreground flex-shrink-0">{item.level}%</span>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
        <Plus className="h-3.5 w-3.5" /> Add skill
      </button>
    </Accordion>
  );
}

// ---------- Certifications ----------

export function CertificationsSection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.certifications;
  const add = () =>
    update((r) => ({ ...r, certifications: [...r.certifications, { id: uid(), name: "", org: "", date: "", url: "" }] }));
  return (
    <Accordion
      title="Certifications"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, certifications: !r.visibility.certifications } }))} />}
    >
      <div className="space-y-2">
        {resume.certifications.map((item, idx) => (
          <div key={item.id} className="grid gap-2 rounded-lg border border-border bg-background/40 p-3 sm:grid-cols-2">
            <Field label="Name" value={item.name} onChange={(v) => update((r) => ({ ...r, certifications: r.certifications.map((x, i) => (i === idx ? { ...x, name: v } : x)) }))} />
            <Field label="Organization" value={item.org} onChange={(v) => update((r) => ({ ...r, certifications: r.certifications.map((x, i) => (i === idx ? { ...x, org: v } : x)) }))} />
            <Field label="Date" value={item.date} onChange={(v) => update((r) => ({ ...r, certifications: r.certifications.map((x, i) => (i === idx ? { ...x, date: v } : x)) }))} />
            <Field label="URL" value={item.url} onChange={(v) => update((r) => ({ ...r, certifications: r.certifications.map((x, i) => (i === idx ? { ...x, url: v } : x)) }))} />
            <div className="col-span-2 flex justify-end">
              <button onClick={() => update((r) => ({ ...r, certifications: r.certifications.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
        <Plus className="h-3.5 w-3.5" /> Add certification
      </button>
    </Accordion>
  );
}

// ---------- Languages ----------

export function LanguagesSection({ resume, update }: { resume: Resume; update: Updater }) {
  const v = resume.visibility.languages;
  const add = () => update((r) => ({ ...r, languages: [...r.languages, { id: uid(), name: "", proficiency: "" }] }));
  return (
    <Accordion
      title="Languages"
      right={<VisibilityToggle on={v} onToggle={() => update((r) => ({ ...r, visibility: { ...r.visibility, languages: !r.visibility.languages } }))} />}
    >
      <div className="space-y-2">
        {resume.languages.map((item, idx) => (
          <div key={item.id} className="grid grid-cols-[1fr_1fr_auto] gap-2 rounded-lg border border-border bg-background/40 p-2">
            <input value={item.name} placeholder="Language" onChange={(e) => update((r) => ({ ...r, languages: r.languages.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)) }))} className="rounded-md border border-border bg-card px-2 py-1 text-sm" />
            <input value={item.proficiency} placeholder="Proficiency" onChange={(e) => update((r) => ({ ...r, languages: r.languages.map((x, i) => (i === idx ? { ...x, proficiency: e.target.value } : x)) }))} className="rounded-md border border-border bg-card px-2 py-1 text-sm" />
            <button onClick={() => update((r) => ({ ...r, languages: r.languages.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
      <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
        <Plus className="h-3.5 w-3.5" /> Add language
      </button>
    </Accordion>
  );
}

// ---------- References ----------

export function ReferencesSection({ resume, update }: { resume: Resume; update: Updater }) {
  const c = resume.customization;
  const add = () =>
    update((r) => ({ ...r, references: [...r.references, { id: uid(), name: "", position: "", contact: "" }] }));
  return (
    <Accordion title="References">
      <div className="flex gap-2 text-xs">
        {(["available", "custom", "hidden"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => update((r) => ({ ...r, customization: { ...r.customization, referencesMode: m } }))}
            className={`rounded-md px-2 py-1 capitalize ${c.referencesMode === m ? "bg-primary text-primary-foreground" : "border border-border hover:bg-accent/40"}`}
          >
            {m === "available" ? "Available on request" : m}
          </button>
        ))}
      </div>
      {c.referencesMode === "custom" && (
        <>
          <div className="space-y-2">
            {resume.references.map((item, idx) => (
              <div key={item.id} className="grid gap-2 rounded-lg border border-border bg-background/40 p-3 sm:grid-cols-3">
                <Field label="Name" value={item.name} onChange={(v) => update((r) => ({ ...r, references: r.references.map((x, i) => (i === idx ? { ...x, name: v } : x)) }))} />
                <Field label="Position" value={item.position} onChange={(v) => update((r) => ({ ...r, references: r.references.map((x, i) => (i === idx ? { ...x, position: v } : x)) }))} />
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Field label="Contact" value={item.contact} onChange={(v) => update((r) => ({ ...r, references: r.references.map((x, i) => (i === idx ? { ...x, contact: v } : x)) }))} />
                  </div>
                  <button onClick={() => update((r) => ({ ...r, references: r.references.filter((_, i) => i !== idx) }))} className="grid h-7 w-7 place-items-center rounded-md text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={add} className="inline-flex items-center gap-1.5 rounded-md bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/20">
            <Plus className="h-3.5 w-3.5" /> Add reference
          </button>
        </>
      )}
    </Accordion>
  );
}
