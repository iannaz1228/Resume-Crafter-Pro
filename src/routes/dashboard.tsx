import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useResumeStore } from "@/store/resume-store";
import { SiteNav } from "@/components/SiteNav";
import { motion } from "framer-motion";
import { FileText, Plus, Trash2, Copy, Pencil, Calendar } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";
import type { Resume } from "@/lib/resume-types";
import { usePersistHydration } from "@/hooks/use-persist-hydration";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — ResumeCraft Pro" },
      { name: "description", content: "Manage all your resumes in one place." },
    ],
  }),
  component: Dashboard,
});

function timeAgo(ts: number) {
  const s = (Date.now() - ts) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Dashboard() {
  const hydrated = usePersistHydration(useResumeStore);
  const { resumes, createResume, deleteResume, duplicateResume } = useResumeStore();
  const navigate = useNavigate();

  const list = Object.values(resumes).sort((a, b) => b.updatedAt - a.updatedAt);
  const lastModified = list[0];

  const handleCreate = () => {
    const id = createResume("Untitled Resume");
    navigate({ to: "/builder/$id", params: { id } });
  };

  return (
    <div className="min-h-screen bg-background bg-gradient-hero">
      <SiteNav />
      <main className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Dashboard</div>
            <h1 className="mt-2 font-display text-4xl font-bold">Your resumes</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create, edit and export ATS-friendly resumes.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> New resume
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <StatCard icon={FileText} label="Total resumes" value={String(list.length)} />
          <StatCard
            icon={Calendar}
            label="Last modified"
            value={lastModified ? timeAgo(lastModified.updatedAt) : "—"}
            sub={lastModified?.name}
          />
        </div>

        {/* List */}
        <div className="mt-10">
          {!hydrated ? (
            <EmptyState onCreate={handleCreate} loading />
          ) : list.length === 0 ? (
            <EmptyState onCreate={handleCreate} />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((r, i) => (
                <motion.div
                  key={r.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="group glass rounded-2xl p-5 shadow-soft transition-all hover:shadow-elegant"
                >
                  <Link
                    to="/builder/$id"
                    params={{ id: r.id }}
                    className="block"
                  >
                    <div className="relative h-40 overflow-hidden rounded-xl bg-white p-4 text-slate-800 shadow-soft">
                      <div className="text-sm font-display font-bold truncate">{r.personal.fullName || "Untitled"}</div>
                      <div className="text-[10px] text-slate-500 truncate">{r.personal.title}</div>
                      <div className="mt-2 space-y-1">
                        <div className="h-1.5 w-3/4 rounded bg-slate-200" />
                        <div className="h-1.5 w-5/6 rounded bg-slate-200" />
                        <div className="h-1.5 w-2/3 rounded bg-slate-200" />
                        <div className="h-1.5 w-4/5 rounded bg-slate-200" />
                        <div className="h-1.5 w-3/4 rounded bg-slate-200" />
                      </div>
                      <div
                        className="absolute inset-x-0 bottom-0 h-1"
                        style={{ background: r.customization.primaryColor }}
                      />
                    </div>
                  </Link>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <div className="font-display text-sm font-semibold truncate">{r.name}</div>
                      <div className="text-xs text-muted-foreground">Edited {timeAgo(r.updatedAt)}</div>
                    </div>
                    <div className="flex items-center gap-1 opacity-80 transition-opacity group-hover:opacity-100">
                      <Link
                        to="/builder/$id"
                        params={{ id: r.id }}
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent/40"
                        aria-label="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => duplicateResume(r.id)}
                        className="grid h-8 w-8 place-items-center rounded-md hover:bg-accent/40"
                        aria-label="Duplicate"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete "${r.name}"?`)) deleteResume(r.id);
                        }}
                        className="grid h-8 w-8 place-items-center rounded-md text-destructive hover:bg-destructive/10"
                        aria-label="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof FileText;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-primary text-primary-foreground">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-widest text-muted-foreground">{label}</div>
          <div className="font-display text-xl font-semibold truncate">{value}</div>
          {sub && <div className="text-xs text-muted-foreground truncate">{sub}</div>}
        </div>
      </div>
    </div>
  );
}

function EmptyState({ onCreate, loading = false }: { onCreate: () => void; loading?: boolean }) {
  return (
    <div className="glass rounded-3xl p-16 text-center">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-glow">
        <FileText className="h-7 w-7" />
      </div>
      <h3 className="mt-6 font-display text-2xl font-semibold">{loading ? "Loading resumes" : "Build your first resume"}</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        {loading ? "Checking your saved resumes on this browser." : "Pick from 13 premium templates and customize every detail."}
      </p>
      {!loading && (
        <button
          onClick={onCreate}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow"
        >
          <Plus className="h-4 w-4" /> Create resume
        </button>
      )}
    </div>
  );
}
