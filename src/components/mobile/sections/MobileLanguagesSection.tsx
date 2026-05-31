import { useState } from "react";
import { Plus, Trash2, Globe2 } from "lucide-react";
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
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Add Language</p>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="e.g. Spanish"
            className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm outline-none placeholder:text-muted-foreground/40 focus:border-primary focus:ring-2 focus:ring-primary/10"
          />
          <select
            value={newProf}
            onChange={(e) => setNewProf(e.target.value)}
            className="rounded-xl border border-border bg-background px-2.5 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
          >
            {PROFICIENCY_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
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
        <div className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
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
              <select
                value={item.proficiency}
                onChange={(e) => updateItem(item.id, { proficiency: e.target.value })}
                className="shrink-0 rounded-lg border border-border bg-background px-2 py-1 text-xs outline-none focus:border-primary"
              >
                {PROFICIENCY_OPTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => deleteItem(item.id)}
                className="shrink-0 flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
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
