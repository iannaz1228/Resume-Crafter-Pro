import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Moon, Sun, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "@/store/theme-store";
import logoImg from "@/../favicon-package/favicon-64x64.png";

const NAV_LINKS = [
  { label: "Features",  to: "/features" },
  { label: "Templates", to: "/templates" },
  { label: "Pricing",   to: "/pricing" },
  { label: "Dashboard", to: "/dashboard" },
] as const;

export function SiteNav() {
  const { theme, toggle } = useThemeStore();
  const [open, setOpen] = useState(false);

  return (
    <header className="no-print sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <img src={logoImg} alt="ResumeCraft Pro" className="h-8 w-8 rounded-lg object-contain shadow-glow" />
          <span>ResumeCraft <span className="text-gradient">Pro</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.label} to={l.to} className="transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card transition-colors hover:bg-accent/40"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/dashboard"
            className="hidden rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 md:inline-block"
          >
            Start building
          </Link>

          {/* Hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card transition-colors hover:bg-accent/40 md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="border-t border-border/60 bg-card/95 px-4 pb-4 pt-2 backdrop-blur md:hidden"
          >
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  {l.label}
                </Link>
              ))}
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-1 rounded-xl bg-gradient-primary px-3 py-2.5 text-center text-sm font-semibold text-primary-foreground"
              >
                Start building →
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
