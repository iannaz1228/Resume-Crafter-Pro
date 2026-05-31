import { useRef, useEffect } from "react";
import type { Resume } from "@/lib/resume-types";

// ---------- Shared helpers ----------

// Timeline dot for OrangeSwirl — background set imperatively, no React style prop.
function TimelineDot({ color }: { color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.style.setProperty("background", color); }, [color]);
  return <div ref={ref} className="resume-timeline-dot" />;
}

function ContactLine({ r }: { r: Resume }) {
  const p = r.personal;
  const v = p.visibility;
  const items: string[] = [];
  if (v.location && p.location) items.push(p.location);
  if (v.email && p.email) items.push(p.email);
  if (v.phone && p.phone) items.push(p.phone);
  if (v.linkedin && p.linkedin) items.push(p.linkedin);
  if (v.github && p.github) items.push(p.github);
  if (v.portfolio && p.portfolio) items.push(p.portfolio);
  if (v.website && p.website) items.push(p.website);
  return <div className="contact-line">{items.join("  ·  ")}</div>;
}

function Photo({
  r,
  border,
  shadow,
  size,
}: {
  r: Resume;
  border?: string;
  shadow?: string;
  size?: number;
}) {
  const p = r.personal;
  if (!p.showPhoto || !p.photo) return null;
  const radius = p.photoShape === "circle" ? "9999px" : p.photoShape === "rounded" ? "12px" : "0";
  const dim = size ?? p.photoSize;
  return (
    <img
      src={p.photo}
      alt={p.fullName}
      style={{
        width: dim,
        height: dim,
        borderRadius: radius,
        objectFit: "cover",
        border: border ?? "none",
        boxShadow: shadow,
        display: "block",
        flexShrink: 0,
      }}
    />
  );
}

function SkillsBlock({ r, accentColor, dark = false }: { r: Resume; accentColor: string; dark?: boolean }) {
  const c = r.customization;
  const visible = r.skills;
  if (visible.length === 0) return null;
  const grouped = visible.reduce<Record<string, typeof visible>>((acc, s) => {
    const k = s.category || "Skills";
    (acc[k] ||= []).push(s);
    return acc;
  }, {});

  if (c.skillStyle === "pills") {
    return (
      <div className="space-y-2">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            {Object.keys(grouped).length > 1 && (
              <div className="text-[10px] font-semibold uppercase opacity-70 mb-1">{cat}</div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {items.map((s) => (
                <span
                  key={s.id}
                  className="rounded px-2 py-0.5 text-[11px]"
                  style={{ background: `${accentColor}22`, color: accentColor }}
                >
                  {s.name}
                  {c.showSkillLevels && c.skillStyle === "pills" ? ` · ${s.level}%` : ""}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (c.skillStyle === "bullets") {
    return (
      <div className="space-y-2">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            {Object.keys(grouped).length > 1 && (
              <div className="text-[10px] font-semibold uppercase opacity-70 mb-1">{cat}</div>
            )}
            <ul style={{ listStyle: "disc", paddingLeft: 16, margin: 0 }}>
              {items.map((s) => (
                <li key={s.id} style={{ marginBottom: 2 }}>
                  {s.name}
                  {c.showSkillLevels ? ` — ${s.level}%` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  }

  if (c.skillStyle === "text") {
    return (
      <div className="space-y-1.5">
        {Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <span className="font-semibold">{cat}: </span>
            <span>{items.map((s) => s.name).join(", ")}</span>
          </div>
        ))}
      </div>
    );
  }

  if (c.skillStyle === "percent") {
    return (
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {visible.map((s) => (
          <div key={s.id} className="flex justify-between">
            <span>{s.name}</span>
            {c.showSkillLevels && <span className="opacity-70">{s.level}%</span>}
          </div>
        ))}
      </div>
    );
  }

  // bars
  return (
    <div className="space-y-2">
      {visible.map((s) => (
        <div key={s.id}>
          <div className="flex justify-between text-[11px]">
            <span>{s.name}</span>
            {c.showSkillLevels && <span className="opacity-70">{s.level}%</span>}
          </div>
          <div className="h-1 w-full rounded" style={{ background: dark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.08)" }}>
            <div
              className="h-1 rounded"
              style={{ width: `${s.level}%`, background: accentColor }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

interface TemplateProps {
  resume: Resume;
}

function SectionTitle({
  children,
  color,
  variant = "underline",
}: {
  children: React.ReactNode;
  color: string;
  variant?: "underline" | "bar" | "plain" | "caps";
}) {
  if (variant === "bar") {
    return (
      <div className="mb-2 flex items-center gap-2">
        <div className="h-3 w-1 rounded" style={{ background: color }} />
        <h3 className="text-[12px] font-bold uppercase tracking-widest" style={{ color }}>
          {children}
        </h3>
      </div>
    );
  }
  if (variant === "plain") {
    return (
      <h3 className="mb-2 text-[13px] font-bold" style={{ color }}>
        {children}
      </h3>
    );
  }
  if (variant === "caps") {
    return (
      <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em]" style={{ color }}>
        {children}
      </h3>
    );
  }
  return (
    <h3
      className="mb-2 border-b pb-1 text-[12px] font-bold uppercase tracking-widest"
      style={{ color, borderColor: `${color}55` }}
    >
      {children}
    </h3>
  );
}

function renderSection(
  key: string,
  r: Resume,
  primary: string,
  accent: string,
  titleVariant: "underline" | "bar" | "plain" | "caps",
) {
  if (!r.visibility[key as keyof typeof r.visibility]) return null;

  if (key === "summary" && r.summary) {
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Summary</SectionTitle>
        <p style={{ whiteSpace: "pre-wrap" }}>{r.summary}</p>
      </section>
    );
  }
  if (key === "experience") {
    const items = r.experience.filter((e) => !e.hidden);
    if (items.length === 0) return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Experience</SectionTitle>
        <div className="space-y-3">
          {items.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <div className="font-semibold">{e.position}</div>
                <div className="text-[11px] opacity-70">{[e.startDate, e.endDate].filter(Boolean).join(" — ")}</div>
              </div>
              <div className="flex flex-wrap justify-between text-[11.5px] opacity-90">
                <div className="italic" style={{ color: accent }}>{e.company}</div>
                <div className="opacity-70">{e.location}</div>
              </div>
              {e.description && (
                <p className="mt-1" style={{ whiteSpace: "pre-wrap" }}>{e.description}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (key === "education") {
    const items = r.education.filter((e) => !e.hidden);
    if (items.length === 0) return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Education</SectionTitle>
        <div className="space-y-2">
          {items.map((e) => (
            <div key={e.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <div className="font-semibold">{e.school}</div>
                <div className="text-[11px] opacity-70">{[e.startDate, e.endDate].filter(Boolean).join(" — ")}</div>
              </div>
              <div className="text-[11.5px]">
                {[e.degree, e.field].filter(Boolean).join(", ")}
                {e.showGpa !== false && e.gpa && <> · GPA {e.gpa}</>}
                {e.showHonors !== false && e.honors && <> · {e.honors}</>}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (key === "projects") {
    const items = r.projects.filter((p) => !p.hidden);
    if (items.length === 0) return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Projects</SectionTitle>
        <div className="space-y-2.5">
          {items.map((p) => (
            <div key={p.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <div className="font-semibold">
                  {p.name}
                  {p.role && <span className="opacity-70 font-normal"> · {p.role}</span>}
                </div>
                <div className="text-[11px]" style={{ color: accent }}>
                  {[p.github, p.demo, p.website].filter(Boolean).join(" · ")}
                </div>
              </div>
              {p.description && <p className="mt-0.5">{p.description}</p>}
              {p.tech && <div className="text-[11px] opacity-70 mt-0.5">Tech: {p.tech}</div>}
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (key === "skills") {
    if (r.skills.length === 0) return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Skills</SectionTitle>
        <SkillsBlock r={r} accentColor={accent} />
      </section>
    );
  }
  if (key === "certifications") {
    const items = r.certifications.filter((c) => !c.hidden);
    if (items.length === 0) return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Certifications</SectionTitle>
        <div className="space-y-1">
          {items.map((c) => (
            <div key={c.id} className="flex flex-wrap justify-between">
              <div>
                <span className="font-semibold">{c.name}</span>
                {c.org && <span className="opacity-80"> — {c.org}</span>}
              </div>
              <div className="text-[11px] opacity-70">{c.date}</div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (key === "languages") {
    const items = r.languages.filter((l) => !l.hidden);
    if (items.length === 0) return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>Languages</SectionTitle>
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {items.map((l) => (
            <div key={l.id}>
              <span className="font-semibold">{l.name}</span>
              {l.proficiency && <span className="opacity-70"> — {l.proficiency}</span>}
            </div>
          ))}
        </div>
      </section>
    );
  }
  if (key === "references") {
    if (r.customization.referencesMode === "hidden") return null;
    return (
      <section key={key}>
        <SectionTitle color={primary} variant={titleVariant}>References</SectionTitle>
        {r.customization.referencesMode === "available" ? (
          <p className="italic opacity-80">Available upon request.</p>
        ) : (
          <div className="space-y-1">
            {r.references.filter((x) => !x.hidden).map((ref) => (
              <div key={ref.id}>
                <span className="font-semibold">{ref.name}</span>
                {ref.position && <span className="opacity-80"> — {ref.position}</span>}
                {ref.contact && <span className="opacity-70"> · {ref.contact}</span>}
              </div>
            ))}
          </div>
        )}
      </section>
    );
  }
  return null;
}

// ---------- Templates ----------

function Wrapper({ resume, children }: TemplateProps & { children: React.ReactNode }) {
  const c = resume.customization;
  return (
    <div
      className="resume-page"
      style={{
        background: c.backgroundColor,
        color: c.textColor,
        fontFamily: `${c.fontFamily}, Inter, system-ui, sans-serif`,
        fontSize: `${c.fontSize}px`,
        lineHeight: c.lineHeight,
        width: "210mm",
        minHeight: "297mm",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}
    >
      {children}
    </div>
  );
}

// 1. ATS Professional — classic, serif-ish, single column
export function AtsProfessional({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  return (
    <Wrapper resume={resume}>
      <div style={{ padding: "20mm" }}>
        <header style={{ textAlign: "center", marginBottom: c.sectionSpacing }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: c.textColor, letterSpacing: "-0.01em" }}>
            {p.fullName}
          </h1>
          {p.title && <div style={{ marginTop: 2, opacity: 0.8 }}>{p.title}</div>}
          <div style={{ marginTop: 6, fontSize: 11 }}>
            <ContactLine r={resume} />
          </div>
        </header>
        <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {resume.sectionOrder.map((k) => renderSection(k, resume, c.primaryColor, c.accentColor, "underline"))}
        </div>
      </div>
    </Wrapper>
  );
}

// 2. Modern Developer — accent sidebar header
export function ModernDeveloper({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  return (
    <Wrapper resume={resume}>
      <header
        style={{
          background: `linear-gradient(135deg, ${c.primaryColor}, ${c.accentColor})`,
          color: "white",
          padding: "18mm 18mm 14mm",
          display: "flex",
          alignItems: "center",
          gap: 18,
        }}
      >
        <Photo r={resume} />
        <div style={{ flex: 1 }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.02em" }}>{p.fullName}</h1>
          {p.title && <div style={{ opacity: 0.9, marginTop: 2 }}>{p.title}</div>}
          <div style={{ marginTop: 8, fontSize: 11, opacity: 0.95 }}>
            <ContactLine r={resume} />
          </div>
        </div>
      </header>
      <div
        style={{
          padding: "14mm 18mm",
          display: "flex",
          flexDirection: "column",
          gap: c.sectionSpacing,
        }}
      >
        {resume.sectionOrder.map((k) => renderSection(k, resume, c.primaryColor, c.accentColor, "bar"))}
      </div>
    </Wrapper>
  );
}

// 3. Executive — serif, two-column, refined
export function Executive({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const leftKeys = ["summary", "experience", "projects"] as const;
  const rightKeys = ["skills", "education", "certifications", "languages", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ padding: "18mm 20mm", fontFamily: `Georgia, ${c.fontFamily}, serif` }}>
        <header style={{ borderBottom: `2px solid ${c.primaryColor}`, paddingBottom: 10, marginBottom: c.sectionSpacing }}>
          <h1 style={{ fontSize: 30, fontWeight: 700, color: c.primaryColor, letterSpacing: "0.02em" }}>
            {p.fullName?.toUpperCase()}
          </h1>
          {p.title && <div style={{ fontStyle: "italic", marginTop: 2 }}>{p.title}</div>}
          <div style={{ marginTop: 6, fontSize: 11 }}>
            <ContactLine r={resume} />
          </div>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {leftKeys.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, c.primaryColor, c.accentColor, "underline"))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {rightKeys.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, c.primaryColor, c.accentColor, "caps"))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

// 4. Student — friendly, photo prominent
export function Student({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  return (
    <Wrapper resume={resume}>
      <div style={{ padding: "18mm" }}>
        <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: c.sectionSpacing }}>
          <Photo r={resume} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: c.primaryColor }}>{p.fullName}</h1>
            {p.title && <div style={{ opacity: 0.8 }}>{p.title}</div>}
            <div style={{ marginTop: 6, fontSize: 11 }}>
              <ContactLine r={resume} />
            </div>
          </div>
        </header>
        <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {resume.sectionOrder.map((k) => renderSection(k, resume, c.primaryColor, c.accentColor, "plain"))}
        </div>
      </div>
    </Wrapper>
  );
}

// 5. Minimalist — black/white, generous whitespace
export function Minimalist({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  return (
    <Wrapper resume={resume}>
      <div style={{ padding: "22mm 22mm" }}>
        <header style={{ marginBottom: c.sectionSpacing * 1.5 }}>
          <h1 style={{ fontSize: 32, fontWeight: 300, letterSpacing: "-0.02em" }}>{p.fullName}</h1>
          {p.title && (
            <div style={{ marginTop: 4, fontSize: 13, opacity: 0.7 }}>{p.title}</div>
          )}
          <div style={{ marginTop: 10, fontSize: 11, opacity: 0.7 }}>
            <ContactLine r={resume} />
          </div>
        </header>
        <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing * 1.2 }}>
          {resume.sectionOrder.map((k) => renderSection(k, resume, c.textColor, c.primaryColor, "caps"))}
        </div>
      </div>
    </Wrapper>
  );
}

// 6. Creative Designer — bold sidebar
export function CreativeDesigner({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const sidebarKeys = ["skills", "languages", "certifications"] as const;
  const mainKeys = ["summary", "experience", "projects", "education", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", minHeight: "297mm" }}>
        <aside
          style={{
            background: c.primaryColor,
            color: "#fff",
            padding: "18mm 14mm",
            display: "flex",
            flexDirection: "column",
            gap: c.sectionSpacing,
          }}
        >
          {p.showPhoto && p.photo && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo r={resume} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.1 }}>{p.fullName}</h1>
            {p.title && <div style={{ opacity: 0.9, marginTop: 4 }}>{p.title}</div>}
          </div>
          <div style={{ fontSize: 11, opacity: 0.95 }}>
            <ContactLine r={resume} />
          </div>
          {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
            <div key={k} style={{ color: "#fff" }}>
              {renderSection(k, resume, "#fff", c.accentColor, "caps")}
            </div>
          ))}
        </aside>
        <main style={{ padding: "18mm 16mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {mainKeys.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, c.primaryColor, c.accentColor, "bar"))}
        </main>
      </div>
    </Wrapper>
  );
}

// 7. Corporate Compact — top color band, two-column body
export function CorporateCompact({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const left = ["summary", "experience", "projects"] as const;
  const right = ["skills", "education", "certifications", "languages", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <header style={{ background: c.primaryColor, color: "#fff", padding: "12mm 16mm" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Photo r={resume} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.01em" }}>{p.fullName}</h1>
            {p.title && <div style={{ opacity: 0.9, marginTop: 2, fontSize: 12 }}>{p.title}</div>}
          </div>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, opacity: 0.95 }}>
          <ContactLine r={resume} />
        </div>
      </header>
      <div style={{ padding: "12mm 16mm", display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {left.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, c.primaryColor, c.accentColor, "underline"))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {right.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, c.primaryColor, c.accentColor, "caps"))}
        </div>
      </div>
    </Wrapper>
  );
}

// 8. Elegant Serif — refined serif single column with rule
export function ElegantSerif({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  return (
    <Wrapper resume={resume}>
      <div style={{ padding: "22mm 24mm", fontFamily: `Georgia, ${c.fontFamily}, serif` }}>
        <header style={{ textAlign: "center", marginBottom: c.sectionSpacing }}>
          <h1 style={{ fontSize: 34, fontWeight: 400, color: c.primaryColor, letterSpacing: "0.04em" }}>
            {p.fullName}
          </h1>
          {p.title && (
            <div style={{ marginTop: 4, fontStyle: "italic", opacity: 0.8 }}>{p.title}</div>
          )}
          <div
            style={{
              margin: "12px auto 0",
              width: 60,
              height: 1,
              background: c.primaryColor,
              opacity: 0.6,
            }}
          />
          <div style={{ marginTop: 10, fontSize: 11 }}>
            <ContactLine r={resume} />
          </div>
        </header>
        <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {resume.sectionOrder.map((k) => renderSection(k, resume, c.primaryColor, c.accentColor, "caps"))}
        </div>
      </div>
    </Wrapper>
  );
}

// 9. Tech Dark — dark sidebar for engineers
export function TechDark({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const sidebarKeys = ["skills", "education", "certifications", "languages"] as const;
  const mainKeys = ["summary", "experience", "projects", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 2fr", minHeight: "297mm" }}>
        <aside
          style={{
            background: "#0f172a",
            color: "#e2e8f0",
            padding: "18mm 12mm",
            display: "flex",
            flexDirection: "column",
            gap: c.sectionSpacing,
          }}
        >
          {p.showPhoto && p.photo && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo r={resume} />
            </div>
          )}
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.15, color: "#fff" }}>{p.fullName}</h1>
            {p.title && <div style={{ opacity: 0.8, marginTop: 4, fontSize: 11 }}>{p.title}</div>}
          </div>
          <div style={{ fontSize: 10.5, opacity: 0.85, lineHeight: 1.6 }}>
            <ContactLine r={resume} />
          </div>
          {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
            <div key={k}>{renderSection(k, resume, c.accentColor, c.accentColor, "caps")}</div>
          ))}
        </aside>
        <main style={{ padding: "18mm 16mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {mainKeys.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, c.primaryColor, c.accentColor, "bar"))}
        </main>
      </div>
    </Wrapper>
  );
}

// ---------- Image-inspired templates ----------

// Pill-style section heading used by amber/bronze templates
function PillHeading({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: "6px 14px",
        borderRadius: 999,
        display: "inline-block",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        fontSize: 11,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

function renderWithCustomHeading(
  key: string,
  r: Resume,
  primary: string,
  accent: string,
  Heading: (label: string) => React.ReactNode,
) {
  if (!r.visibility[key as keyof typeof r.visibility]) return null;
  const label = {
    summary: "About Me",
    experience: "Job Experience",
    education: "Education",
    projects: "Projects",
    skills: "Skills",
    certifications: "Certificate",
    languages: "Languages",
    references: "References",
  }[key] || key;

  const body = renderSection(key, r, primary, accent, "plain");
  if (!body) return null;
  return (
    <section key={key}>
      {Heading(label)}
      {/* strip default heading from body */}
      <div>{((body as React.ReactElement).props as { children?: React.ReactNode[] }).children?.slice(1) ?? null}</div>
    </section>
  );
}

// 10. Amber Pill — orange sidebar, pill-style headers (ref: Muhammad Hanif)
export function AmberPill({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const accent = c.primaryColor || "#F5A623";
  const sidebarKeys = ["certifications", "education"] as const;
  const mainKeys = ["summary", "experience", "skills", "projects", "languages", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "0.85fr 2fr", minHeight: "297mm" }}>
        <aside style={{ background: "#fff", padding: "14mm 10mm", borderRight: `1px dashed ${accent}66` }}>
          {p.showPhoto && p.photo && (
            <div
              style={{
                background: accent,
                borderRadius: "0 0 60px 60px",
                padding: "10px 10px 24px",
                marginBottom: 16,
                display: "flex",
                justifyContent: "center",
              }}
            >
              <Photo r={resume} border="3px solid #fff" />
            </div>
          )}
          <div style={{ marginBottom: 18 }}>
            <PillHeading label="Contact Me" color={accent} />
            <div style={{ fontSize: 10.5, lineHeight: 1.6 }}>
              {p.phone && <div>📞 {p.phone}</div>}
              {p.email && <div>✉ {p.email}</div>}
              {p.location && <div>📍 {p.location}</div>}
              {p.linkedin && <div>in/ {p.linkedin}</div>}
            </div>
          </div>
          {sidebarKeys.map((k) =>
            resume.sectionOrder.includes(k)
              ? renderWithCustomHeading(k, resume, accent, accent, (l) => <PillHeading label={l} color={accent} />)
              : null,
          )}
        </aside>
        <main style={{ padding: "14mm 14mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          <header style={{ background: "#f3f3f3", padding: "14px 18px", borderRadius: 8 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "0.04em" }}>{p.fullName?.toUpperCase()}</h1>
            {p.title && <div style={{ opacity: 0.7, marginTop: 2, letterSpacing: "0.2em", fontSize: 11 }}>{p.title?.toUpperCase()}</div>}
          </header>
          {mainKeys.map((k) =>
            resume.sectionOrder.includes(k)
              ? renderWithCustomHeading(k, resume, accent, accent, (l) => <PillHeading label={l} color={accent} />)
              : null,
          )}
        </main>
      </div>
    </Wrapper>
  );
}

// 11. Wave Navy — teal/navy with curved divider (ref: Adrian Rafael)
export function WaveNavy({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const primary = c.primaryColor || "#1B6FA8";
  const sidebarKeys = ["skills", "languages", "certifications"] as const;
  const mainKeys = ["summary", "education", "experience", "projects", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ position: "relative", minHeight: "297mm" }}>
        <header
          style={{
            background: "#fff",
            padding: "14mm 18mm 8mm",
            borderBottom: `3px solid ${primary}`,
            display: "flex",
            gap: 16,
            alignItems: "center",
          }}
        >
          {p.showPhoto && p.photo && (
            <Photo r={resume} border={`4px solid ${primary}`} />
          )}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 30, fontWeight: 700, color: primary, letterSpacing: "-0.01em" }}>{p.fullName}</h1>
            {p.title && <div style={{ marginTop: 4, opacity: 0.75 }}>{p.title}</div>}
          </div>
        </header>
        <div style={{ display: "grid", gridTemplateColumns: "0.85fr 2fr" }}>
          <aside style={{ padding: "10mm 10mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            <div>
              <h3 style={{ color: primary, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 6 }}>Contact</h3>
              <div style={{ fontSize: 10.5, lineHeight: 1.7 }}>
                {p.email && <div>{p.email}</div>}
                {p.phone && <div>{p.phone}</div>}
                {p.location && <div>{p.location}</div>}
                {p.linkedin && <div>{p.linkedin}</div>}
              </div>
            </div>
            {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
              <div key={k}>{renderSection(k, resume, primary, primary, "caps")}</div>
            ))}
          </aside>
          <main style={{ padding: "10mm 14mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing, borderLeft: `1px solid ${primary}22` }}>
            {mainKeys.map((k) => resume.sectionOrder.includes(k) && (
              <div key={k}>
                <div style={{ background: `${primary}15`, padding: "4px 12px", borderRadius: 4, marginBottom: 8, fontWeight: 700, color: primary, textTransform: "uppercase", letterSpacing: "0.15em", fontSize: 12 }}>
                  {k}
                </div>
                <div>{(((renderSection(k, resume, primary, primary, "plain") as React.ReactElement | null)?.props as { children?: React.ReactNode[] } | undefined)?.children)?.slice(1)}</div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </Wrapper>
  );
}

// 12. Geo Bronze — angular corner accents (ref: Anne Winston)
export function GeoBronze({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const primary = c.primaryColor || "#B47542";
  const sidebarKeys = ["summary", "skills"] as const;
  const mainKeys = ["education", "experience", "projects", "languages", "certifications", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ position: "relative", minHeight: "297mm", overflow: "hidden" }}>
        {/* corner shapes */}
        <div style={{ position: "absolute", top: 0, left: 0, width: 220, height: 90, background: primary, clipPath: "polygon(0 0, 100% 0, 70% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 220, height: 70, background: `${primary}cc`, clipPath: "polygon(30% 0, 100% 0, 100% 100%, 0 100%)" }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 240, height: 80, background: `${primary}88`, clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)" }} />

        <div style={{ display: "grid", gridTemplateColumns: "0.8fr 2fr", padding: "20mm 16mm", gap: 16, position: "relative", zIndex: 1 }}>
          <aside style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing, alignItems: "center", textAlign: "center" }}>
            {p.showPhoto && p.photo && (
              <Photo r={resume} border={`4px solid ${primary}`} />
            )}
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: "0.04em" }}>{p.fullName?.toUpperCase()}</h1>
              {p.title && <div style={{ color: primary, fontStyle: "italic", marginTop: 2 }}>{p.title}</div>}
            </div>
            {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
              <div key={k} style={{ width: "100%", textAlign: "left" }}>
                {renderSection(k, resume, primary, primary, "plain")}
              </div>
            ))}
            <div style={{ width: "100%", textAlign: "left" }}>
              <h3 style={{ color: primary, fontWeight: 700, marginBottom: 6 }}>Contact</h3>
              <div style={{ fontSize: 10.5, lineHeight: 1.7 }}>
                {p.email && <div>{p.email}</div>}
                {p.phone && <div>{p.phone}</div>}
                {p.location && <div>{p.location}</div>}
              </div>
            </div>
          </aside>
          <main style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {mainKeys.map((k) =>
              resume.sectionOrder.includes(k)
                ? renderWithCustomHeading(k, resume, primary, primary, (l) => <PillHeading label={l} color={primary} />)
                : null,
            )}
          </main>
        </div>
      </div>
    </Wrapper>
  );
}

// 13. Noir Wave — black sidebar with yellow accent (ref: Miller Burt)
export function NoirWave({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const accent = c.accentColor || "#F5C518";
  const sidebarKeys = ["languages"] as const;
  const mainKeys = ["summary", "experience", "education", "skills", "projects", "certifications", "references"] as const;
  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "0.75fr 2fr", minHeight: "297mm", position: "relative" }}>
        <aside style={{ background: "#0a0a0a", color: "#fff", padding: "16mm 12mm 16mm 12mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {p.showPhoto && p.photo && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo r={resume} border={`3px solid ${accent}`} />
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, lineHeight: 1.15 }}>{p.fullName?.toUpperCase()}</h1>
            {p.title && <div style={{ color: accent, marginTop: 4, letterSpacing: "0.18em", fontSize: 11, textTransform: "uppercase" }}>{p.title}</div>}
          </div>
          <div>
            <h3 style={{ borderBottom: `1px solid ${accent}`, paddingBottom: 4, marginBottom: 8, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontSize: 11 }}>Contact</h3>
            <div style={{ fontSize: 10.5, lineHeight: 1.7, opacity: 0.9 }}>
              {p.location && <div>📍 {p.location}</div>}
              {p.email && <div>✉ {p.email}</div>}
              {p.phone && <div>📞 {p.phone}</div>}
              {p.linkedin && <div>in {p.linkedin}</div>}
            </div>
          </div>
          {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
            <div key={k}>{renderSection(k, resume, accent, accent, "caps")}</div>
          ))}
        </aside>
        {/* yellow curved spine */}
        <div style={{ position: "absolute", left: "calc(0.75 / 2.75 * 100%)", top: 0, bottom: 0, width: 14, background: accent, transform: "translateX(-50%)" }} />
        <main style={{ padding: "16mm 14mm 16mm 18mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {mainKeys.map((k) => resume.sectionOrder.includes(k) && renderSection(k, resume, "#0a0a0a", accent, "plain"))}
        </main>
      </div>
    </Wrapper>
  );
}

// 14. Navy Sidebar Pro — dark navy sidebar + clean main column
export function NavySidebarPro({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const navy = "#1f2a44";
  const deepNavy = "#162038";
  const accent = c.accentColor || "#4a78c8";
  const sidebarKeys = ["education", "skills", "languages", "certifications"] as const;
  const mainKeys = ["summary", "experience", "projects", "references"] as const;

  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "34% 66%", minHeight: "297mm" }}>
        <aside
          style={{
            background: `linear-gradient(180deg, ${deepNavy}, ${navy})`,
            color: "#ffffff",
            padding: "16mm 10mm",
            display: "flex",
            flexDirection: "column",
            gap: c.sectionSpacing,
          }}
        >
          {p.showPhoto && p.photo && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Photo r={resume} border="3px solid #ffffff" shadow={`0 0 0 4px ${accent}55`} />
            </div>
          )}
          <div style={{ textAlign: "center" }}>
            <h1 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{p.fullName}</h1>
            {p.title && (
              <div
                style={{
                  display: "inline-block",
                  marginTop: 6,
                  background: accent,
                  color: "#fff",
                  padding: "3px 10px",
                  borderRadius: 999,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                }}
              >
                {p.title}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.25)", paddingBottom: 4, marginBottom: 8, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 10.5 }}>
              Contact
            </h3>
            <div style={{ fontSize: 10, lineHeight: 1.7, opacity: 0.92 }}>
              {p.location && <div>◉ {p.location}</div>}
              {p.email && <div>✉ {p.email}</div>}
              {p.phone && <div>☎ {p.phone}</div>}
              {p.linkedin && <div>in · {p.linkedin}</div>}
              {p.github && <div>gh · {p.github}</div>}
              {p.website && <div>web · {p.website}</div>}
            </div>
          </div>

          {sidebarKeys.map(
            (k) =>
              resume.sectionOrder.includes(k) && (
                <div key={k} style={{ fontSize: 10.5 }}>
                  {renderSection(k, resume, "#ffffff", accent, "caps")}
                </div>
              ),
          )}
        </aside>

        <main
          style={{
            background: "#ffffff",
            color: "#1e293b",
            padding: "16mm 14mm",
            display: "flex",
            flexDirection: "column",
            gap: c.sectionSpacing,
          }}
        >
          {mainKeys.map(
            (k) => resume.sectionOrder.includes(k) && renderSection(k, resume, navy, accent, "plain"),
          )}
        </main>
      </div>
    </Wrapper>
  );
}

// 15. Crimson Hex — black bg with red curved banner + hexagon iconography
export function CrimsonHex({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const red = c.primaryColor || "#E63946";
  const ink = "#111111";
  const sidebarKeys = ["skills", "languages", "certifications", "references"] as const;
  const mainKeys = ["summary", "experience", "education", "projects"] as const;
  const Hex = ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ flex: "none" }}>
      <polygon points="12,2 21,7 21,17 12,22 3,17 3,7" fill={red} />
    </svg>
  );

  return (
    <Wrapper resume={resume}>
      <div style={{ position: "relative", background: ink, color: "#fff", minHeight: "297mm", overflow: "hidden" }}>
        {/* Decorative top shapes */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "60%", height: 140, background: red, borderBottomRightRadius: "50% 90%" }} />
        <div style={{ position: "absolute", top: -30, right: 40, width: 110, height: 110, background: red, clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)", border: "4px solid #fff" }} />
        <div style={{ position: "absolute", top: 90, right: -40, width: 120, height: 120, background: "#fff", clipPath: "polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%)", opacity: 0.08 }} />

        {/* Header */}
        <header style={{ position: "relative", padding: "16mm 14mm 10mm", display: "flex", alignItems: "center", gap: 16 }}>
          {p.showPhoto && p.photo && <Photo r={resume} />}
          <div>
            <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1, color: "#fff" }}>
              {p.fullName}
            </h1>
            {p.title && <div style={{ marginTop: 6, color: "#111", background: "#fff", display: "inline-block", padding: "2px 10px", borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{p.title}</div>}
          </div>
        </header>

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "38% 62%", gap: 0 }}>
          {/* Black sidebar */}
          <aside style={{ padding: "0 12mm 16mm 14mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Hex /><h3 style={{ fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 13, color: "#fff" }}>Contact</h3>
              </div>
              <div style={{ borderTop: `2px solid ${red}`, width: 40, marginBottom: 8 }} />
              <div style={{ fontSize: 10.5, lineHeight: 1.8, opacity: 0.9 }}>
                {p.phone && <div>{p.phone}</div>}
                {p.email && <div>{p.email}</div>}
                {p.website && <div>{p.website}</div>}
                {p.location && <div>{p.location}</div>}
                {p.linkedin && <div>{p.linkedin}</div>}
              </div>
            </div>
            {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
              <div key={k}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Hex />
                  <div style={{ fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", fontSize: 13, color: "#fff" }}>
                    {k === "skills" ? "Skills" : k === "languages" ? "Languages" : k === "certifications" ? "Certifications" : "Reference"}
                  </div>
                </div>
                <div style={{ borderTop: `2px solid ${red}`, width: 40, marginBottom: 8 }} />
                <div style={{ fontSize: 10.5 }}>{renderSection(k, resume, "#fff", red, "plain")}</div>
              </div>
            ))}
          </aside>

          {/* White main */}
          <main style={{ background: "#fff", color: ink, padding: "16mm 14mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing, borderTopLeftRadius: 24 }}>
            {mainKeys.map((k) => resume.sectionOrder.includes(k) && (
              <div key={k}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <Hex />
                  <h3 style={{ color: ink, fontWeight: 900, letterSpacing: "0.06em", textTransform: "uppercase", fontSize: 16 }}>
                    {k === "summary" ? "About Me" : k === "experience" ? "Experience" : k === "education" ? "Education" : "Projects"}
                  </h3>
                </div>
                <div style={{ borderTop: `2px solid ${red}`, width: 60, marginBottom: 8 }} />
                <div style={{ color: ink }}>{renderSection(k, resume, red, red, "plain")}</div>
              </div>
            ))}
          </main>
        </div>
      </div>
    </Wrapper>
  );
}

// 16. Orange Swirl — cream bg with orange flowing accents + year-tagged timeline
export function OrangeSwirl({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const orange = c.primaryColor || "#F2762E";
  const dark = "#1b1b1b";
  const mainKeys = ["summary", "education", "experience", "projects"] as const;
  const sideKeys = ["skills", "languages", "certifications", "references"] as const;

  return (
    <Wrapper resume={resume}>
      <div style={{ position: "relative", background: "#fafaf6", color: dark, minHeight: "297mm", overflow: "hidden" }}>
        {/* Swirl shapes */}
        <div style={{ position: "absolute", top: -80, right: -120, width: 420, height: 420, borderRadius: "50%", background: `radial-gradient(circle at 30% 30%, ${orange}, transparent 60%)`, opacity: 0.85 }} />
        <div style={{ position: "absolute", top: 40, right: -60, width: 280, height: 280, borderRadius: "50%", border: `14px solid ${orange}`, opacity: 0.25 }} />
        <div style={{ position: "absolute", top: 0, left: 0, width: "70%", height: 8, background: dark }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: 60, background: `linear-gradient(180deg, transparent, ${orange}22)` }} />

        <header style={{ position: "relative", padding: "16mm 14mm 6mm", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 20 }}>
          <div>
            <h1 style={{ fontSize: 36, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase", color: dark, lineHeight: 1 }}>{p.fullName}</h1>
            {p.title && <div style={{ marginTop: 6, color: orange, fontWeight: 700, letterSpacing: "0.3em", textTransform: "uppercase", fontSize: 11 }}>{p.title}</div>}
            {resume.summary && resume.visibility.summary && (
              <p style={{ marginTop: 10, maxWidth: 360, fontSize: 11, color: "#333" }}>{resume.summary}</p>
            )}
          </div>
          {p.showPhoto && p.photo ? (
            <Photo r={resume} border={`4px solid ${orange}`} shadow="0 8px 20px rgba(0,0,0,0.15)" />
          ) : (
            <div style={{ width: p.photoSize, height: p.photoSize, borderRadius: p.photoShape === "circle" ? "50%" : p.photoShape === "rounded" ? 12 : 0, border: `4px solid ${orange}`, background: "#e8e3d8" }} />
          )}
        </header>

        <div style={{ position: "relative", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, padding: "4mm 14mm 14mm" }}>
          {/* Left: timeline experience/education */}
          <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {resume.visibility.education && resume.education.length > 0 && (
              <section>
                <div style={{ background: dark, color: "#fff", padding: "6px 12px", display: "inline-block", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>Education</div>
                <div style={{ marginTop: 10, borderLeft: `3px solid ${orange}`, paddingLeft: 14 }}>
                  {resume.education.filter((e) => !e.hidden).map((e) => (
                    <div key={e.id} style={{ marginBottom: 12, position: "relative" }}>
                      <TimelineDot color={orange} />
                      {(e.startDate || e.endDate) && (
                        <div style={{ fontSize: 10, color: orange, fontWeight: 700, marginBottom: 2 }}>
                          {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                        </div>
                      )}
                      <div style={{ fontWeight: 800 }}>{e.degree}{e.field && ` · ${e.field}`}</div>
                      <div style={{ fontSize: 11, color: "#555" }}>{e.school}</div>
                      {(e.showGpa !== false && e.gpa || e.showHonors !== false && e.honors) && (
                        <div style={{ fontSize: 10.5, color: "#666", marginTop: 2 }}>
                          {e.showGpa !== false && e.gpa && <>GPA {e.gpa}</>}
                          {e.showGpa !== false && e.gpa && e.showHonors !== false && e.honors && " · "}
                          {e.showHonors !== false && e.honors && <>{e.honors}</>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
            {resume.visibility.experience && resume.experience.length > 0 && (
              <section>
                <div style={{ background: dark, color: "#fff", padding: "6px 12px", display: "inline-block", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12 }}>Work Experience</div>
                <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8 }}>
                  {resume.experience.filter((e) => !e.hidden).map((e, i) => (
                    <div key={e.id} style={{ position: "relative", background: orange, color: "#fff", padding: "8px 12px 8px 18px", borderRadius: 2, clipPath: "polygon(0 0,100% 0,100% 100%,3% 100%,0 60%)" }}>
                      <div style={{ fontSize: 10, fontWeight: 800, opacity: 0.95 }}>Work Experience 0{i + 1}</div>
                      <div style={{ fontWeight: 800, fontSize: 12 }}>{e.position} — {e.company}</div>
                      {e.description && <div style={{ fontSize: 10.5, opacity: 0.95, marginTop: 2 }}>{e.description}</div>}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: skills / languages / extras */}
          <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {sideKeys.map((k) => resume.sectionOrder.includes(k) && (
              <section key={k}>
                <div style={{ borderBottom: `3px solid ${orange}`, paddingBottom: 4, marginBottom: 8, fontWeight: 900, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 13, color: dark }}>
                  {k === "skills" ? "Expertise" : k === "languages" ? "Languages" : k === "certifications" ? "Certifications" : "References"}
                </div>
                {renderSection(k, resume, dark, orange, "plain")}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

// 17. Coral Card — banner header, dark info cards + orange tab pills
export function CoralCard({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const orange = c.primaryColor || "#F08A2C";
  const dark = "#2b2f33";
  const card = "#f1efe9";
  const sidebarKeys = ["skills", "languages", "certifications"] as const;
  const mainKeys = ["summary", "education", "experience", "projects", "references"] as const;

  return (
    <Wrapper resume={resume}>
      <div style={{ background: card, color: dark, minHeight: "297mm" }}>
        {/* Banner header */}
        <header style={{ position: "relative", background: dark, color: "#fff", padding: `10mm 14mm 10mm ${Math.max(60, p.photoSize / 3.78 + 16)}mm`, minHeight: Math.max(110, p.photoSize + 24) }}>
          <div style={{ position: "absolute", left: 18, top: 12 }}>
            {p.showPhoto && p.photo ? (
              <Photo r={resume} border={`5px solid ${orange}`} />
            ) : (
              <div style={{ width: p.photoSize, height: p.photoSize, borderRadius: p.photoShape === "circle" ? "50%" : p.photoShape === "rounded" ? 12 : 0, border: `5px solid ${orange}`, background: "#3a3f44", display: "grid", placeItems: "center", color: orange, fontWeight: 900, fontSize: 32 }}>{p.fullName.charAt(0)}</div>
            )}
          </div>
          <div style={{ position: "absolute", right: 14, top: 18, width: 14, height: 14, borderRadius: "50%", background: orange }} />
          <div style={{ position: "absolute", bottom: -18, left: 60, width: 26, height: 26, borderRadius: "50%", background: orange }} />
          <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: "0.04em", textTransform: "uppercase" }}>{p.fullName}</h1>
          {p.title && <div style={{ marginTop: 4, color: orange, fontSize: 14, fontWeight: 600 }}>{p.title}</div>}
        </header>

        <div style={{ display: "grid", gridTemplateColumns: "38% 62%", gap: 14, padding: "14mm 12mm" }}>
          {/* Left column with cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ background: dark, color: "#fff", padding: 14, borderRadius: 4 }}>
              <div style={{ background: orange, color: "#fff", textAlign: "center", padding: "4px 10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12, marginBottom: 10 }}>Info</div>
              <div style={{ fontSize: 11, lineHeight: 1.7 }}>
                {p.fullName && <div>{p.fullName}</div>}
                {p.location && <div style={{ marginTop: 4 }}>{p.location}</div>}
              </div>
            </div>
            <div style={{ background: dark, color: "#fff", padding: 14, borderRadius: 4 }}>
              <div style={{ background: orange, color: "#fff", textAlign: "center", padding: "4px 10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12, marginBottom: 10 }}>Contacts</div>
              <div style={{ fontSize: 11, lineHeight: 1.8 }}>
                {p.phone && <div>📞 {p.phone}</div>}
                {p.email && <div>✉ {p.email}</div>}
                {p.linkedin && <div>in {p.linkedin}</div>}
                {p.website && <div>● {p.website}</div>}
              </div>
            </div>
            {sidebarKeys.map((k) => resume.sectionOrder.includes(k) && (
              <div key={k} style={{ background: dark, color: "#fff", padding: 14, borderRadius: 4 }}>
                <div style={{ background: orange, color: "#fff", textAlign: "center", padding: "4px 10px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12, marginBottom: 10 }}>
                  {k === "skills" ? "Power Change" : k === "languages" ? "Languages" : "Certifications"}
                </div>
                <div style={{ fontSize: 11 }}>{renderSection(k, resume, "#fff", orange, "plain")}</div>
              </div>
            ))}
          </div>

          {/* Right column: sectioned with orange underline + tab labels */}
          <div style={{ display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {mainKeys.map((k) => resume.sectionOrder.includes(k) && (
              <section key={k}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div style={{ background: dark, color: "#fff", padding: "5px 18px", fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", fontSize: 12, clipPath: "polygon(8% 0,92% 0,100% 100%,0 100%)" }}>
                    {k === "summary" ? "About Me" : k === "experience" ? "Work Experience" : k === "education" ? "Education" : k === "projects" ? "Interest" : "References"}
                  </div>
                </div>
                <div style={{ borderBottom: `2px solid ${orange}`, marginBottom: 8 }} />
                {renderSection(k, resume, dark, orange, "plain")}
              </section>
            ))}
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

// 18. Orange Dynamic — dark sidebar, orange accent banners, education timeline
export function OrangeDynamic({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const orange = c.primaryColor || "#F97316";
  const dark = "#2b2e31";

  const SideLabel = ({ label }: { label: string }) => (
    <div
      style={{
        background: orange, color: "#fff", padding: "3px 8px",
        fontWeight: 700, fontSize: 10, textTransform: "uppercase" as const,
        letterSpacing: "0.15em", textAlign: "center" as const,
        borderRadius: 2, marginBottom: 8,
      }}
    >
      {label}
    </div>
  );

  const RightBanner = ({ label }: { label: string }) => (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div
          style={{
            background: dark, color: "#fff", padding: "5px 20px",
            fontWeight: 700, fontSize: 11, letterSpacing: "0.15em",
            textTransform: "uppercase" as const,
            clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)",
          }}
        >
          {label}
        </div>
      </div>
      <div style={{ borderBottom: `2px solid ${orange}`, marginTop: 2 }} />
    </div>
  );

  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "0.55fr 1fr", minHeight: "297mm" }}>
        {/* LEFT: dark sidebar */}
        <aside style={{ background: dark, color: "#fff", padding: "14mm 10mm 12mm" }}>
          {p.showPhoto && p.photo && (
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
              <Photo r={resume} border={`3px solid ${orange}`} />
            </div>
          )}

          <div style={{ textAlign: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.2 }}>{p.fullName?.toUpperCase()}</div>
            {p.title && (
              <div style={{ color: orange, fontSize: 10.5, fontWeight: 600, marginTop: 4, letterSpacing: "0.08em" }}>
                {p.title}
              </div>
            )}
          </div>

          {/* INFO */}
          <div style={{ background: "#fff", color: dark, borderRadius: 4, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ background: orange, color: "#fff", padding: "3px 8px", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: "0.15em", textAlign: "center" }}>INFO</div>
            <div style={{ padding: "7px 10px", fontSize: 10.5, lineHeight: 1.7 }}>
              {p.fullName && <div>👤 {p.fullName}</div>}
              {p.location && <div>📍 {p.location}</div>}
              {p.email && <div>✉ {p.email}</div>}
            </div>
          </div>

          {/* POWER CHANGE (skills — respects skillStyle setting) */}
          {resume.visibility.skills && resume.skills.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <SideLabel label="POWER CHANGE" />
              <SkillsBlock r={resume} accentColor={orange} dark />
            </div>
          )}

          {/* CONTACTS */}
          <div style={{ marginBottom: 12 }}>
            <SideLabel label="CONTACTS" />
            <div style={{ fontSize: 10.5, lineHeight: 1.8 }}>
              {p.phone && <div>📞 {p.phone}</div>}
              {p.email && <div>✉ {p.email}</div>}
              {p.linkedin && <div>in {p.linkedin}</div>}
              {p.website && <div>🌐 {p.website}</div>}
            </div>
          </div>

          {/* WORK EXPERIENCE (compact sidebar) */}
          {resume.visibility.experience && resume.experience.filter((e) => !e.hidden).length > 0 && (
            <div>
              <SideLabel label="WORK EXPERIENCE" />
              {resume.experience.filter((e) => !e.hidden).map((e) => (
                <div key={e.id} style={{ marginBottom: 10 }}>
                  <div style={{ color: orange, fontSize: 10, fontWeight: 700 }}>
                    {e.startDate}{e.endDate ? ` – ${e.endDate}` : " – Now"}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 10.5 }}>{e.position}</div>
                  <div style={{ opacity: 0.7, fontSize: 10 }}>{e.company}</div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* RIGHT: white main */}
        <main style={{ background: "#fff", padding: "14mm 12mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          {/* ABOUT ME */}
          {resume.visibility.summary && resume.summary && (
            <section>
              <RightBanner label="ABOUT ME" />
              <p style={{ fontSize: 11, lineHeight: 1.7, color: "#555", marginTop: 6 }}>{resume.summary}</p>
            </section>
          )}

          {/* EDUCATION — custom timeline */}
          {resume.visibility.education && resume.education.filter((e) => !e.hidden).length > 0 && (
            <section>
              <RightBanner label="EDUCATION" />
              <div style={{ marginTop: 8, paddingLeft: 14, borderLeft: `2px solid ${orange}`, position: "relative" }}>
                {resume.education.filter((e) => !e.hidden).map((e) => (
                  <div key={e.id} style={{ marginBottom: 10, position: "relative" }}>
                    <TimelineDot color={orange} />
                    {(e.startDate || e.endDate) && (
                      <div className="edu-date-dark">
                        {[e.startDate, e.endDate].filter(Boolean).join(" – ")}
                      </div>
                    )}
                    <div style={{ fontWeight: 700, fontSize: 11 }}>
                      {[e.degree, e.field].filter(Boolean).join(" · ")}
                    </div>
                    <div style={{ fontSize: 10.5, color: "#666" }}>{e.school}</div>
                    {(e.showGpa !== false && e.gpa || e.showHonors !== false && e.honors) && (
                      <div className="edu-meta-gray">
                        {e.showGpa !== false && e.gpa && <>GPA {e.gpa}</>}
                        {e.showGpa !== false && e.gpa && e.showHonors !== false && e.honors && " · "}
                        {e.showHonors !== false && e.honors && <>{e.honors}</>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* INTEREST (languages as orange pills) */}
          {resume.visibility.languages && resume.languages.filter((l) => !l.hidden).length > 0 && (
            <section>
              <RightBanner label="INTEREST" />
              <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {resume.languages.filter((l) => !l.hidden).map((l) => (
                  <span
                    key={l.id}
                    style={{ background: orange, color: "#fff", padding: "4px 14px", borderRadius: 4, fontSize: 10.5, fontWeight: 600 }}
                  >
                    {l.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* PERSONAL SKILLS (certifications) */}
          {resume.visibility.certifications && resume.certifications.filter((c2) => !c2.hidden).length > 0 && (
            <section>
              <RightBanner label="PERSONAL SKILLS" />
              {renderSection("certifications", resume, dark, orange, "plain")}
            </section>
          )}

          {/* Projects + References via standard render */}
          {(["projects", "references"] as const).map((k) =>
            resume.sectionOrder.includes(k)
              ? renderWithCustomHeading(k, resume, dark, orange, (label) => (
                  <div style={{ marginBottom: 6 }}>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <div style={{ background: dark, color: "#fff", padding: "5px 20px", fontWeight: 700, fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", clipPath: "polygon(8% 0, 92% 0, 100% 100%, 0 100%)" }}>{label}</div>
                    </div>
                    <div style={{ borderBottom: `2px solid ${orange}`, marginTop: 2 }} />
                  </div>
                ))
              : null,
          )}
        </main>
      </div>
    </Wrapper>
  );
}

// 19. Blue Wave — navy full-height sidebar with wave header, star skills, language circles
export function BlueWave({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const navy = c.primaryColor || "#1B3F7A";
  const sky = c.accentColor || "#4A9ED6";

  const mainKeys = ["summary", "experience", "education", "projects", "certifications", "references"] as const;

  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "0.62fr 1fr", minHeight: "297mm" }}>
        {/* LEFT: navy sidebar (full height) */}
        <aside style={{ background: navy, color: "#fff", padding: "14mm 12mm 14mm", display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.01em" }}>{p.fullName?.toUpperCase()}</h1>
            {p.title && (
              <div style={{ fontSize: 10, opacity: 0.7, marginTop: 5, letterSpacing: "0.15em", textTransform: "uppercase" }}>{p.title}</div>
            )}
          </div>

          {/* CONTACT */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ background: sky, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>💬</div>
              <span style={{ fontWeight: 700, letterSpacing: "0.12em", fontSize: 11, textTransform: "uppercase" }}>Contact</span>
            </div>
            <div style={{ fontSize: 10.5, lineHeight: 1.9, paddingLeft: 4 }}>
              {p.phone && <div>📞 {p.phone}</div>}
              {p.email && <div>✉ {p.email}</div>}
              {p.location && <div>📍 {p.location}</div>}
              {p.linkedin && <div>in {p.linkedin}</div>}
            </div>
          </div>

          {/* SKILLS — respects skillStyle setting */}
          {resume.visibility.skills && resume.skills.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ background: sky, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>💡</div>
                <span style={{ fontWeight: 700, letterSpacing: "0.12em", fontSize: 11, textTransform: "uppercase" }}>Skills</span>
              </div>
              <SkillsBlock r={resume} accentColor={sky} dark />
            </div>
          )}

          {/* LANGUAGE with circle gauges */}
          {resume.visibility.languages && resume.languages.filter((l) => !l.hidden).length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ background: sky, borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>🌐</div>
                <span style={{ fontWeight: 700, letterSpacing: "0.12em", fontSize: 11, textTransform: "uppercase" }}>Language</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingLeft: 4 }}>
                {resume.languages.filter((l) => !l.hidden).map((l) => {
                  const pct =
                    l.proficiency === "Native" ? 100
                    : l.proficiency === "Fluent" ? 90
                    : l.proficiency === "Advanced" ? 75
                    : l.proficiency === "Intermediate" ? 60
                    : 40;
                  return (
                    <div key={l.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: 48 }}>
                      <div style={{ width: 46, height: 46, borderRadius: "50%", border: `3px solid ${sky}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>
                        {pct}%
                      </div>
                      <div style={{ fontSize: 8, marginTop: 4, textAlign: "center", letterSpacing: "0.08em", textTransform: "uppercase" }}>{l.name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT: white main column */}
        <main style={{ background: "#fff", display: "flex", flexDirection: "column" }}>
          {/* Wave header area in right column */}
          <div style={{ position: "relative", background: navy, padding: "14mm 14mm 20mm" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Photo r={resume} border="4px solid rgba(255,255,255,0.25)" shadow="0 4px 16px rgba(0,0,0,0.3)" />
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 28, background: "#fff", borderTopLeftRadius: 50, borderTopRightRadius: 50 }} />
          </div>

          <div style={{ padding: "14mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
            {mainKeys.map((k) =>
              resume.sectionOrder.includes(k)
                ? renderWithCustomHeading(k, resume, navy, sky, (label) => (
                    <div
                      style={{
                        background: sky, color: "#fff", padding: "5px 12px",
                        borderRadius: 2, marginBottom: 8,
                        fontWeight: 700, letterSpacing: "0.12em",
                        textTransform: "uppercase" as const, fontSize: 11,
                      }}
                    >
                      {label}
                    </div>
                  ))
                : null,
            )}
          </div>
        </main>
      </div>
    </Wrapper>
  );
}

// 20. Violet Gradient — pink-to-purple gradient sidebar, gradient name text
export function VioletGradient({ resume }: TemplateProps) {
  const c = resume.customization;
  const p = resume.personal;
  const pink = c.primaryColor || "#EC4899";
  const purple = c.accentColor || "#8B5CF6";
  const gradient = `linear-gradient(180deg, ${pink} 0%, ${purple} 100%)`;
  const gradH = `linear-gradient(90deg, ${pink}, ${purple})`;

  const mainKeys = ["summary", "experience", "education", "projects", "certifications"] as const;

  const SidePillLabel = ({ label }: { label: string }) => (
    <div
      style={{
        border: "2px solid #fff", color: "#fff", padding: "4px 0",
        borderRadius: 20, fontWeight: 700, fontSize: 10,
        textTransform: "uppercase" as const, textAlign: "center" as const,
        letterSpacing: "0.12em", marginBottom: 10,
      }}
    >
      {label}
    </div>
  );

  return (
    <Wrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "0.52fr 1fr", minHeight: "297mm" }}>
        {/* LEFT: gradient sidebar */}
        <aside style={{ background: gradient, color: "#fff", padding: "14mm 10mm 12mm", display: "flex", flexDirection: "column", gap: 16 }}>
          {p.showPhoto && p.photo && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div style={{ padding: 4, background: "rgba(255,255,255,0.2)", borderRadius: "9999px" }}>
                <Photo r={resume} border="3px solid #fff" />
              </div>
            </div>
          )}

          <div>
            <SidePillLabel label="Contact Me" />
            <div style={{ fontSize: 10.5, lineHeight: 1.85 }}>
              {p.phone && <div>📞 {p.phone}</div>}
              {p.email && <div>✉ {p.email}</div>}
              {p.location && <div>📍 {p.location}</div>}
              {p.linkedin && <div>in {p.linkedin}</div>}
              {p.website && <div>🌐 {p.website}</div>}
            </div>
          </div>

          {resume.visibility.skills && resume.skills.length > 0 && (
            <div>
              <SidePillLabel label="Skills" />
              <SkillsBlock r={resume} accentColor={purple} dark />
            </div>
          )}

          {resume.visibility.references && resume.references.filter((r2) => !r2.hidden).length > 0 && (
            <div>
              <SidePillLabel label="References" />
              {resume.references.filter((r2) => !r2.hidden).map((ref) => (
                <div key={ref.id} style={{ fontSize: 10.5, lineHeight: 1.6, marginBottom: 10 }}>
                  <div style={{ fontWeight: 700 }}>{ref.name}</div>
                  {ref.position && <div style={{ opacity: 0.85, fontSize: 10 }}>{ref.position}</div>}
                  {ref.contact && <div style={{ opacity: 0.7, fontSize: 9.5 }}>📞 {ref.contact}</div>}
                </div>
              ))}
            </div>
          )}

          {resume.visibility.languages && resume.languages.filter((l) => !l.hidden).length > 0 && (
            <div>
              <SidePillLabel label="Language" />
              <div style={{ fontSize: 10.5, lineHeight: 1.85 }}>
                {resume.languages.filter((l) => !l.hidden).map((l) => (
                  <div key={l.id}>• {l.name}{l.proficiency ? ` — ${l.proficiency}` : ""}</div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* RIGHT: white main column */}
        <main style={{ background: "#fff", padding: "14mm 14mm", display: "flex", flexDirection: "column", gap: c.sectionSpacing }}>
          <header style={{ marginBottom: 4 }}>
            <h1
              style={{
                fontSize: 36, fontWeight: 900, lineHeight: 1.05,
                backgroundImage: gradH,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: pink,
              }}
            >
              {p.fullName}
            </h1>
            {p.title && (
              <div style={{ color: "#888", fontSize: 12, marginTop: 6, fontWeight: 500 }}>{p.title}</div>
            )}
          </header>

          {mainKeys.map((k) =>
            resume.sectionOrder.includes(k)
              ? renderWithCustomHeading(k, resume, "#333", pink, (label) => (
                  <div
                    style={{
                      backgroundImage: gradH, color: "#fff",
                      padding: "5px 14px", borderRadius: 4,
                      fontWeight: 700, fontSize: 11,
                      letterSpacing: "0.12em", textTransform: "uppercase" as const,
                      marginBottom: 8,
                    }}
                  >
                    {label}
                  </div>
                ))
              : null,
          )}

          {resume.sectionOrder.includes("references") &&
            renderWithCustomHeading("references", resume, "#333", pink, (label) => (
              <div style={{ backgroundImage: gradH, color: "#fff", padding: "5px 14px", borderRadius: 4, fontWeight: 700, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase" as const, marginBottom: 8 }}>{label}</div>
            ))}
        </main>
      </div>
    </Wrapper>
  );
}

export const TEMPLATE_MAP = {
  "ats-professional": AtsProfessional,
  "modern-developer": ModernDeveloper,
  executive: Executive,
  student: Student,
  minimalist: Minimalist,
  "creative-designer": CreativeDesigner,
  "corporate-compact": CorporateCompact,
  "elegant-serif": ElegantSerif,
  "tech-dark": TechDark,
  "amber-pill": AmberPill,
  "wave-navy": WaveNavy,
  "geo-bronze": GeoBronze,
  "noir-wave": NoirWave,
  "navy-sidebar-pro": NavySidebarPro,
  "crimson-hex": CrimsonHex,
  "orange-swirl": OrangeSwirl,
  "coral-card": CoralCard,
  "orange-dynamic": OrangeDynamic,
  "blue-wave": BlueWave,
  "violet-gradient": VioletGradient,
} as const;

export const TEMPLATE_LIST: Array<{ id: keyof typeof TEMPLATE_MAP; name: string; tag: string }> = [
  { id: "ats-professional", name: "ATS Professional", tag: "Classic" },
  { id: "modern-developer", name: "Modern Developer", tag: "Tech" },
  { id: "executive", name: "Executive", tag: "Leadership" },
  { id: "student", name: "Student", tag: "Entry-level" },
  { id: "minimalist", name: "Minimalist", tag: "Clean" },
  { id: "creative-designer", name: "Creative Designer", tag: "Bold" },
  { id: "corporate-compact", name: "Corporate Compact", tag: "Business" },
  { id: "elegant-serif", name: "Elegant Serif", tag: "Editorial" },
  { id: "tech-dark", name: "Tech Dark", tag: "Engineer" },
  { id: "amber-pill", name: "Amber Pill", tag: "Vibrant" },
  { id: "wave-navy", name: "Wave Navy", tag: "Corporate" },
  { id: "geo-bronze", name: "Geo Bronze", tag: "Geometric" },
  { id: "noir-wave", name: "Noir Accent", tag: "Bold dark" },
  { id: "navy-sidebar-pro", name: "Navy Sidebar Pro", tag: "Professional" },
  { id: "crimson-hex", name: "Crimson Hex", tag: "Graphic" },
  { id: "orange-swirl", name: "Orange Swirl", tag: "Creative" },
  { id: "coral-card", name: "Coral Card", tag: "Modern" },
  { id: "orange-dynamic", name: "Orange Dynamic", tag: "Creative" },
  { id: "blue-wave", name: "Blue Wave", tag: "Professional" },
  { id: "violet-gradient", name: "Violet Gradient", tag: "Creative" },
];


