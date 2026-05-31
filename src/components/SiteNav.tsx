import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useThemeStore } from "@/store/theme-store";
import logoImg from "@/../favicon-package/favicon-64x64.png";

function useSectionNav() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const scroll = () =>
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    if (pathname === "/") {
      scroll();
    } else {
      navigate({ to: "/" }).then(() => setTimeout(scroll, 80));
    }
  };
}

export function SiteNav() {
  const { theme, toggle } = useThemeStore();
  const sectionNav = useSectionNav();
  return (
    <header className="no-print sticky top-0 z-50 glass">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <img src={logoImg} alt="ResumeCraft Pro" className="h-8 w-8 rounded-lg shadow-glow object-contain" />
          <span>
            ResumeCraft <span className="text-gradient">Pro</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
          <a href="#features" onClick={sectionNav("features")} className="hover:text-foreground transition-colors">Features</a>
          <a href="#templates" onClick={sectionNav("templates")} className="hover:text-foreground transition-colors">Templates</a>
          <a href="#pricing" onClick={sectionNav("pricing")} className="hover:text-foreground transition-colors">Pricing</a>
          <Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
        </nav>
        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-lg border border-border bg-card transition-colors hover:bg-accent/40"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/dashboard"
            className="hidden rounded-lg bg-gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5 sm:inline-block"
          >
            Start building
          </Link>
        </div>
      </div>
    </header>
  );
}
