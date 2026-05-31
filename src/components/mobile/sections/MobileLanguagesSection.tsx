import { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Globe2, ChevronDown } from "lucide-react";
import type { Resume, LanguageItem } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

const PROFICIENCY_OPTIONS = [
  "Native",
  "Fluent",
  "Professional",
  "Conversational",
  "Elementary",
];

// Custom dropdown that never overflows the viewport.
// Anchors right-0 (expands leftward) and flips upward when space is tight.
function Picker({
  value,
  onChange,
  options,
  className = "",
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [openUp, setOpenUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const el = containerRef.current;
    if (el) {
      const rect = el.getBoundingClientRect();
      setOpenUp(window.innerHeight - rect.bottom < 240);
    }
    const close = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("touchstart", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("touchstart", close);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-1.5 rounded-xl border border-border bg-background px-2.5 py-2.5 text-xs font-medium outline-none focus:border-primary"
      >
        <span className="truncate">{value}</span>
        <ChevronDown
          className={`h-3 w-3 shrink-0 text-muted-foreground transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          className={`absolute right-0 z-[100] w-44 overflow-hidden rounded-xl border border-border bg-card shadow-xl ${
            openUp ? "bottom-full mb-1" : "top-full mt-1"
          }`}
        >
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}
              className={`flex w-full items-center px-3.5 py-2.5 text-left text-xs transition-colors ${
                value === opt
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function newItem(): LanguageItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    proficiency: "Professional",
    hidden: false,
  };
}

export function MobileLanguagesSection({ resume, update }: Props) {
  const [newName, setNewName] = useState("");
  const [newProf, setNewProf] = useState("Professional");

  const addItem = () => {
    if (!newName.trim()) return;
    const item = newItem();
    item.name = newName.trim();
    item.proficiency = newProf;
    update((r) => ({ ...r, languages: [...r.languages, item] }));
    setNewName("");
    setNewProf("Professional");
  };

  const updateItem = (id: string, patch: Partial<LanguageItem>) =>
    update((r) => ({
      ...r,
      languages: r.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)),
    }));

  const deleteItem = (id: string) =>
    update((r) => ({ ...r, languages: r.languages.filter((l) => l.id !== id) }));

  return (
    <div className="space-y-5 px-4 pb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Languages</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {resume.languages.length} language{resume.languages.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Add new language */}
      <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Add Language
        </p>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="e.g. Spanish"
            className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <Picker
            value={newProf}
            onChange={setNewProf}
            options={PROFICIENCY_OPTIONS}
            className="w-[130px] shrink-0"
          />
        </div>
        <button
          type="button"
          onClick={addItem}
          disabled={!newName.trim()}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3.5 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" /> Add Language
        </button>
      </div>

      {/* Language list */}
      {resume.languages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <Globe2 className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No languages added yet</p>
          <p className="mt-1 text-xs text-muted-foreground/70">Use the form above to add languages</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-card [&>*:first-child]:rounded-t-2xl [&>*:last-child]:rounded-b-2xl">
          {resume.languages.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <input
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  className="block w-full truncate bg-transparent text-sm font-medium outline-none"
                  placeholder="Language"
                />
              </div>
              <Picker
                value={item.proficiency}
                onChange={(v) => updateItem(item.id, { proficiency: v })}
                options={PROFICIENCY_OPTIONS}
                className="w-[120px] shrink-0"
              />
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
                aria-label="Remove"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
