import { Link } from "@tanstack/react-router";
import { Github, Facebook, Mail, Code2, ExternalLink } from "lucide-react";

const FB_URL = "https://www.facebook.com/profile.php?id=61588589180451";
import logoImg from "@/../favicon-package/favicon-64x64.png";
import iannazImg from "@/iannaz.jpg";

function SocialBtn({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto") ? undefined : "_blank"}
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border transition-colors hover:bg-accent/40"
    >
      {children}
    </a>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-background to-muted/30 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2 font-display font-bold">
              <img src={logoImg} alt="ResumeCraft Pro" className="h-7 w-7 rounded-lg object-contain shadow-glow" />
              <span>ResumeCraft <span className="text-gradient">Pro</span></span>
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              Build stunning, ATS-friendly resumes in minutes. Free during early access.
            </p>
            <div className="mt-4 flex gap-2">
              <SocialBtn href="https://github.com/iannaz1228" label="GitHub">
                <Github className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href={FB_URL} label="Facebook">
                <Facebook className="h-3.5 w-3.5" />
              </SocialBtn>
              <SocialBtn href="mailto:iannaz1228@gmail.com" label="Email">
                <Mail className="h-3.5 w-3.5" />
              </SocialBtn>
            </div>
          </div>

          {/* Product links */}
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
              <li><Link to="/features"  className="transition-colors hover:text-foreground">Features</Link></li>
              <li><Link to="/templates" className="transition-colors hover:text-foreground">Templates</Link></li>
              <li><Link to="/pricing"   className="transition-colors hover:text-foreground">Pricing</Link></li>
              <li><Link to="/dashboard" className="transition-colors hover:text-foreground">Dashboard</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold">Legal</h4>
            <ul className="mt-3 space-y-2.5 text-xs text-muted-foreground">
              <li><Link to="/privacy" className="transition-colors hover:text-foreground">Privacy Policy</Link></li>
              <li><Link to="/terms"   className="transition-colors hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Developer card */}
          <div>
            <h4 className="text-sm font-semibold">Built by</h4>
            <div className="mt-3 rounded-2xl border border-border bg-card p-4">
              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <img
                  src={iannazImg}
                  alt="Ian Magistrado Naz"
                  className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-primary/30"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Ian Magistrado Naz</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Code2 className="h-3 w-3" /> Full-Stack Developer
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="mt-3 space-y-1.5">
                <a
                  href="https://infosyscoreteam.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-primary transition-colors hover:underline"
                >
                  <ExternalLink className="h-3 w-3 shrink-0" />
                  infosyscoreteam.com
                </a>
                <a
                  href="mailto:iannaz1228@gmail.com"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Mail className="h-3 w-3 shrink-0" />
                  iannaz1228@gmail.com
                </a>
                <a
                  href="https://github.com/iannaz1228"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Github className="h-3 w-3 shrink-0" />
                  github.com/iannaz1228
                </a>
                <a
                  href={FB_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Facebook className="h-3 w-3 shrink-0" />
                  facebook.com/Ian Naz
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/40 pt-6 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} ResumeCraft Pro · Built for ambitious careers.</span>
          <span>Crafted with care by <a href="mailto:iannaz1228@gmail.com" className="text-primary hover:underline">Ian Naz</a></span>
        </div>
      </div>
    </footer>
  );
}
