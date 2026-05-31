import { useState, useEffect, useRef } from "react";
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
  PenLine,
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
import { MobileCoverLetterSection } from "./sections/MobileCoverLetterSection";

type Section =
  | "personal" | "summary" | "work" | "education"
  | "skills" | "projects" | "certifications" | "languages"
  | "references" | "cover-letter" | "design";

interface Props {
  resume: Resume;
  update: (fn: (r: Resume) => Resume) => void;
}

// Compact labels for the horizontal tab bar (space-constrained)
const SECTION_TABS: { id: Section; label: string; Icon: React.ElementType }[] = [
  { id: "personal",       label: "Personal",      Icon: User },
  { id: "summary",        label: "Summary",        Icon: FileText },
  { id: "work",           label: "Experience",     Icon: Briefcase },
  { id: "education",      label: "Education",      Icon: GraduationCap },
  { id: "skills",         label: "Skills",         Icon: Zap },
  { id: "projects",       label: "Projects",       Icon: FolderGit2 },
  { id: "certifications", label: "Certifications", Icon: Award },
  { id: "languages",      label: "Languages",      Icon: Globe2 },
  { id: "references",     label: "References",     Icon: Users },
  { id: "cover-letter",   label: "Cover Letter",   Icon: PenLine },
  { id: "design",         label: "Design",         Icon: Palette },
];

// Full names and logical groups for the drawer
const DRAWER_GROUPS: {
  label: string;
  items: { id: Section; label: string; Icon: React.ElementType }[];
}[] = [
  {
    label: "Resume Content",
    items: [
      { id: "personal",       label: "Personal Info",    Icon: User },
      { id: "summary",        label: "Summary",          Icon: FileText },
      { id: "work",           label: "Work Experience",  Icon: Briefcase },
      { id: "education",      label: "Education",        Icon: GraduationCap },
      { id: "skills",         label: "Skills",           Icon: Zap },
      { id: "projects",       label: "Projects",         Icon: FolderGit2 },
      { id: "certifications", label: "Certifications",   Icon: Award },
      { id: "languages",      label: "Languages",        Icon: Globe2 },
      { id: "references",     label: "References",       Icon: Users },
    ],
  },
  {
    label: "Application",
    items: [
      { id: "cover-letter", label: "Cover Letter", Icon: PenLine },
    ],
  },
  {
    label: "Appearance",
    items: [
      { id: "design", label: "Design & Style", Icon: Palette },
    ],
  },
];

export function MobileEditor({ resume, update }: Props) {
  const [section, setSection] = useState<Section>("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [saved, setSaved] = useState(true);
  const { theme, toggle } = useThemeStore();

  const tabBarRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSaved(false);
    const t = setTimeout(() => setSaved(true), 600);
    return () => clearTimeout(t);
  }, [resume]);

  // Keep active tab centred in the scrollable bar whenever section changes
  useEffect(() => {
    const activeEl = activeTabRef.current;
    const container = tabBarRef.current;
    if (!activeEl || !container) return;
    const targetLeft =
      activeEl.offsetLeft - container.offsetLeft - container.clientWidth / 2 + activeEl.clientWidth / 2;
    container.scrollTo({ left: targetLeft, behavior: "smooth" });
  }, [section]);

  const navigateTo = (id: Section) => {
    setSection(id);
    setShowDrawer(false);
  };

  const props = { resume, update };

  return (
    <div className="flex min-h-screen flex-col bg-background">

      {/* ── Top header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border/50 bg-card/95 backdrop-blur-xl">

        {/* Title row */}
        <div className="flex items-center gap-2 px-3 py-2.5">
          <button
            type="button"
            onClick={() => setShowDrawer(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-foreground transition-colors active:bg-accent"
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0 flex-1 px-0.5">
            <input
              value={resume.name}
              onChange={(e) => update((r) => ({ ...r, name: e.target.value }))}
              className="block w-full truncate bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="Untitled resume"
            />
            <div className="flex items-center gap-1 text-[10px] leading-none text-muted-foreground">
              <Save
                className={`h-2.5 w-2.5 transition-colors ${saved ? "text-emerald-500" : "text-amber-400"}`}
              />
              {saved ? "Saved" : "Saving…"}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview(true)}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-opacity active:opacity-80"
          >
            <Eye className="h-3.5 w-3.5" />
            Preview
          </button>
        </div>

        {/* ── Horizontal section tab bar ───────────────────────────── */}
        <div
          ref={tabBarRef}
          className="flex gap-1 overflow-x-scroll px-2 pb-2.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [-webkit-overflow-scrolling:touch]"
        >
          {SECTION_TABS.map(({ id, label, Icon }) => {
            const active = section === id;
            return (
              <button
                key={id}
                type="button"
                ref={active ? activeTabRef : undefined}
                onClick={() => setSection(id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                }`}
              >
                <Icon className="h-3 w-3" />
                {label}
                {active && <span className="h-1 w-1 rounded-full bg-primary" />}
              </button>
            );
          })}
        </div>
      </header>

      {/* ── Section content ──────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto pb-10 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={section}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
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
            {section === "cover-letter"   && <MobileCoverLetterSection    {...props} />}
            {section === "design"         && <MobileDesignSection         {...props} />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Preview modal ────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPreview && (
          <MobilePreviewModal
            resume={resume}
            onClose={() => setShowPreview(false)}
            initialView={section === "cover-letter" ? "cover-letter" : "resume"}
          />
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
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowDrawer(false)}
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320, mass: 0.8 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-card shadow-2xl"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between border-b border-border/60 px-4 py-4">
                <Link
                  to="/"
                  onClick={() => setShowDrawer(false)}
                  className="flex items-center gap-2.5 font-display font-semibold"
                >
                  <img
                    src={logoImg}
                    alt="ResumeCraft Pro"
                    className="h-8 w-8 rounded-lg object-contain shadow-glow"
                  />
                  <span>
                    ResumeCraft <span className="text-gradient">Pro</span>
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowDrawer(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  aria-label="Close menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Scrollable drawer body */}
              <div className="flex-1 overflow-y-auto px-3 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

                {/* Navigate group */}
                <p className="px-2 pb-1 pt-0.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                  Navigate
                </p>
                <nav className="mb-1 space-y-0.5">
                  <Link
                    to="/dashboard"
                    onClick={() => setShowDrawer(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <LayoutDashboard className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                    My Resumes
                  </Link>
                  <Link
                    to="/"
                    onClick={() => setShowDrawer(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <Home className="h-3.5 w-3.5 text-muted-foreground" />
                    </span>
                    Home
                  </Link>
                </nav>

                {/* Section groups */}
                {DRAWER_GROUPS.map((group) => (
                  <div key={group.label} className="mt-4">
                    <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map(({ id, label, Icon }) => {
                        const active = section === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => navigateTo(id)}
                            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                              active
                                ? "bg-primary/10 text-primary"
                                : "text-foreground hover:bg-accent"
                            }`}
                          >
                            <span
                              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                active ? "bg-primary/15" : "bg-muted"
                              }`}
                            >
                              <Icon
                                className={`h-3.5 w-3.5 ${active ? "text-primary" : "text-muted-foreground"}`}
                              />
                            </span>
                            {label}
                            {active && (
                              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer: theme toggle */}
              <div className="border-t border-border/60 p-3">
                <button
                  type="button"
                  onClick={toggle}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted">
                    {theme === "dark"
                      ? <Sun className="h-3.5 w-3.5 text-muted-foreground" />
                      : <Moon className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
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
