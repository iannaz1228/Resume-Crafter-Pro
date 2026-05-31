import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Resume } from "@/lib/resume-types";
import { createBlankResume } from "@/lib/default-resume";

interface ResumeStore {
  resumes: Record<string, Resume>;
  createResume: (name?: string) => string;
  duplicateResume: (id: string) => string | null;
  deleteResume: (id: string) => void;
  updateResume: (id: string, updater: (r: Resume) => Resume) => void;
  importResume: (data: Resume) => string;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set, get) => ({
      resumes: {},
      createResume: (name) => {
        const r = createBlankResume(name);
        set((s) => ({ resumes: { ...s.resumes, [r.id]: r } }));
        return r.id;
      },
      duplicateResume: (id) => {
        const src = get().resumes[id];
        if (!src) return null;
        const copy: Resume = {
          ...src,
          id: Math.random().toString(36).slice(2, 10),
          name: `${src.name} (Copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((s) => ({ resumes: { ...s.resumes, [copy.id]: copy } }));
        return copy.id;
      },
      deleteResume: (id) =>
        set((s) => {
          const next = { ...s.resumes };
          delete next[id];
          return { resumes: next };
        }),
      updateResume: (id, updater) =>
        set((s) => {
          const cur = s.resumes[id];
          if (!cur) return s;
          const next = updater(cur);
          next.updatedAt = Date.now();
          return { resumes: { ...s.resumes, [id]: next } };
        }),
      importResume: (data) => {
        const r: Resume = { ...data, id: Math.random().toString(36).slice(2, 10), updatedAt: Date.now() };
        set((s) => ({ resumes: { ...s.resumes, [r.id]: r } }));
        return r.id;
      },
    }),
    { name: "resumecraft-pro-v1", skipHydration: true },
  ),
);
