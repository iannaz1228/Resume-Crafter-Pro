import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  Save,
  Eye,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Zap,
  FolderGit2,
  Palette,
  Award,
  Globe2,
  Users,
  Menu,
  X,
  LayoutDashboard,
  Home,
  Moon,
  Sun,
} from "lucide-react";
import type { Resume } from "@/lib/resume-types";
import { useThemeStore } from "@/store/theme-store";
import logoImg from "@/../favicon-package/favicon-64x64.png";
import { MobilePreviewModal } from "./MobilePreviewModal";
import { MobilePersonalSection } from "./sections/MobilePersonalSection";
import { MobileSummarySection } from "./sections/MobileSummarySection";
import { MobileExperienceSection } from "./sections/MobileExperienceSection";
import { MobileEducationSection } from "./sections/MobileEducationSection";
import { MobileSkillsSection } from "./sections/MobileSkillsSection";
import { MobileProjectsSection } from "./sections/MobileProjectsSection";
import { MobileDesignSection } from "./sections/MobileDesignSection";
import { MobileCertificationsSection } from "./sections/MobileCertificationsSection";
import { MobileLanguagesSection } from "./sections/MobileLanguagesSection";
import { MobileReferencesSection } from "./sections/MobileReferencesSection";

type Section =
  | "personal" | "summary" | "work" | "education"
  | "skills" | "projects" | "certifications" | "languages"
  | "references" | "design";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

const SECTION_NAV: { id: Section; label: string; Icon: React.ElementType }[] = [
  { id: "personal",       label: "Info",     Icon: User },
  { id: "summary",        label: "Summary",  Icon: FileText },
  { id: "work",           label: "Work",     Icon: Briefcase },
  { id: "education",      label: "Education",Icon: GraduationCap },
  { id: "skills",         label: "Skills",   Icon: Zap },
  { id: "projects",       label: "Projects", Icon: FolderGit2 },
  { id: "certifications", label: "Certs",    Icon: Award },
  { id: "languages",      label: "Languages",Icon: Globe2 },
  { id: "references",     label: "Refs",     Icon: Users },
  { id: "design",         label: "Design",   Icon: Palette },
];

export function MobileEditor({ resume, update }: Props) {
  const [section, setSection] = useState<Section>("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [saved, setSaved] = useState(true);
  const { theme, toggle } = useThemeStore();

  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 600);
    return () => clearTimeout(t);
  }, [resume]);

  const props = { resume, update };

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── Top header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-2 border-b border-border/60 bg-card/90 px-3 py-2.5 backdrop-blur">

        {/* Hamburger ← left */}
        <button
          type="button"
          onClick={() => setShowDrawer(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl hover:bg-accent"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Resume name + save state ← center */}
        <div className="min-w-0 flex-1 px-1">
          <input
            value={resume.name}
            onChange={(e) => update((r) => ({ ...r, name: e.target.value }))}
            className="block w-full truncate bg-transparent text-sm font-semibold outline-none"
            placeholder="Resume name"
          />
          <div className="flex items-center gap-1 text-[10px] leading-none text-muted-foreground">
            <Save className={`h-2.5 w-2.5 transition-colors ${saved ? "text-emerald-500" : "text-amber-500"}`} />
            {saved ? "Saved" : "Saving…"}
          </div>
        </div>

        {/* Preview → right */}
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
        >
          <Eye className="h-3.5 w-3.5" /> Preview
        </button>
      </header>

      {/* ── Section content ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-8 pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            {section === "personal"       && <MobilePersonalSection       {...props} />}
            {section === "summary"        && <MobileSummarySection        {...props} />}
            {section === "work"           && <MobileExperienceSection     {...props} />}
            {section === "education"      && <MobileEducationSection      {...props} />}
            {section === "skills"         && <MobileSkillsSection         {...props} />}
            {section === "projects"       && <MobileProjectsSection       {...props} />}
            {section === "certifications" && <MobileCertificationsSection {...props} />}
            {section === "languages"      && <MobileLanguagesSection      {...props} />}
            {section === "references"     && <MobileReferencesSection     {...props} />}
            {section === "design"         && <MobileDesignSection         {...props} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Preview modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && (
          <MobilePreviewModal resume={resume} onClose={() => setShowPreview(false)} />
        )}
      </AnimatePresence>

      {/* ── Navigation drawer ────────────────────────────────────────── */}
      <AnimatePresence>
        {showDrawer && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowDrawer(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-card shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-4">
                <Link
                  to="/"
                  onClick={() => setShowDrawer(false)}
                  className="flex items-center gap-2.5 font-display font-semibold"
                >
                  <img src={logoImg} alt="ResumeCraft Pro" className="h-8 w-8 rounded-lg object-contain shadow-glow" />
                  <span>
                    ResumeCraft <span className="text-gradient">Pro</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Main navigation */}
              <nav className="flex flex-col gap-1 p-3">
                <p className="px-2 pt-1 pb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Navigate
                </p>

                <Link
                  to="/dashboard"
                  onClick={() => setShowDrawer(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  My Resumes
                </Link>

                <Link
                  to="/"
                  onClick={() => setShowDrawer(false)}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  <Home className="h-4 w-4 text-muted-foreground" />
                  Home
                </Link>
              </nav>

              {/* Section jump */}
              <div className="flex flex-col gap-1 border-t border-border p-3">
                <p className="px-2 pt-1 pb-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  Jump to section
                </p>
                {SECTION_NAV.map(({ id, label, Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setSection(id); setShowDrawer(false); }}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      section === id
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    {label}
                    {section === id && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Footer: theme toggle */}
              <div className="mt-auto border-t border-border p-4">
                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent"
                >
                  {theme === "dark"
                    ? <Sun className="h-4 w-4 text-muted-foreground" />
                    : <Moon className="h-4 w-4 text-muted-foreground" />
                  }
                  {theme === "dark" ? "Light mode" : "Dark mode"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
