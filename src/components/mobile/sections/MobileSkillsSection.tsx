import { useState, useRef } from "react";
import { Plus, X, Zap } from "lucide-react";
import type { Resume, SkillItem } from "@/lib/resume-types";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

export function MobileSkillsSection({ resume, update }: Props) {
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (resume.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setInput("");
      return;
    }
    const item: SkillItem = {
      id: crypto.randomUUID(),
      name: trimmed,
      level: 80,
      category: "",
    };
    update((r) => ({ ...r, skills: [...r.skills, item] }));
    setInput("");
    inputRef.current?.focus();
  };

  const removeSkill = (id: string) =>
    update((r) => ({ ...r, skills: r.skills.filter((s) => s.id !== id) }));

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addSkill(input);
    }
    if (e.key === "Backspace" && input === "" && resume.skills.length > 0) {
      const last = resume.skills[resume.skills.length - 1];
      removeSkill(last.id);
    }
  };

  const SUGGESTIONS = [
    "JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL",
    "Figma", "Git", "Docker", "AWS", "GraphQL", "REST APIs",
  ].filter((s) => !resume.skills.some((sk) => sk.name.toLowerCase() === s.toLowerCase()));

  return (
    <div className="space-y-5 px-4 pb-6">
      <div>
        <h2 className="text-base font-bold">Skills</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {resume.skills.length} skill{resume.skills.length !== 1 ? "s" : ""} added
        </p>
      </div>

      {/* Tag input */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <div
          className="flex min-h-[48px] cursor-text flex-wrap gap-2 rounded-xl border border-border bg-background px-3 py-2.5"
          onClick={() => inputRef.current?.focus()}
        >
          {resume.skills.map((skill) => (
            <span
              key={skill.id}
              className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {skill.name}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeSkill(skill.id); }}
                className="ml-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full hover:bg-primary/20"
                aria-label={`Remove ${skill.name}`}
              >
                <X className="h-2.5 w-2.5" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => { if (input.trim()) addSkill(input); }}
            placeholder={resume.skills.length === 0 ? "Type a skill, press Enter…" : "Add more…"}
            className="min-w-[120px] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/40"
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Press Enter or comma to add · Backspace to remove last</p>
      </div>

      {/* Quick suggestions */}
      {SUGGESTIONS.length > 0 && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Quick Add</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.slice(0, 8).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addSkill(s)}
                className="flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary"
              >
                <Plus className="h-3 w-3" /> {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {resume.skills.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center">
          <Zap className="mx-auto mb-3 h-8 w-8 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">No skills added yet</p>
          <p className="mt-1 text-xs text-muted-foreground/70">Type in the box above or tap a suggestion</p>
        </div>
      )}
    </div>
  );
}
