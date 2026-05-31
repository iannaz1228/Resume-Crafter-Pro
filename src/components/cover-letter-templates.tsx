import type { Resume, TemplateId, PersonalInfo } from "@/lib/resume-types";
import type { CoverLetterData, CoverLetterLayout, CoverLetterSettings } from "@/lib/cover-letter-types";
import { createBlankCoverLetter } from "@/lib/default-cover-letter";

// ─── Template → layout family mapping ───────────────────────────────────────

export const COVER_LETTER_LAYOUT_MAP: Record<TemplateId, CoverLetterLayout> = {
  "ats-professional":  "classic",
  "minimalist":        "classic",
  "elegant-serif":     "classic",
  "executive":         "classic",
  "student":           "classic",
  "modern-developer":  "modern-header",
  "corporate-compact": "modern-header",
  "wave-navy":         "modern-header",
  "blue-wave":         "modern-header",
  "tech-dark":         "dark-sidebar",
  "navy-sidebar-pro":  "dark-sidebar",
  "noir-wave":         "dark-sidebar",
  "orange-dynamic":    "dark-sidebar",
  "creative-designer": "light-sidebar",
  "amber-pill":        "light-sidebar",
  "geo-bronze":        "light-sidebar",
  "violet-gradient":   "light-sidebar",
  "crimson-hex":       "graphic",
  "orange-swirl":      "graphic",
  "coral-card":        "graphic",
};

// ─── Shared helpers ──────────────────────────────────────────────────────────

function formatCLDate(raw: string, format: CoverLetterSettings["dateFormat"]): string {
  if (raw) return raw;
  const d = new Date();
  if (format === "numeric") return d.toLocaleDateString("en-US");
  if (format === "short")
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function buildContactLine(p: PersonalInfo, settings: CoverLetterSettings): string {
  if (!settings.showContactInfo) return "";
  const items: string[] = [];
  if (p.visibility.email && p.email) items.push(p.email);
  if (p.visibility.phone && p.phone) items.push(p.phone);
  if (p.visibility.location && p.location) items.push(p.location);
  if (p.visibility.linkedin && p.linkedin) items.push(p.linkedin);
  if (p.visibility.portfolio && p.portfolio) items.push(p.portfolio);
  return items.join("  ·  ");
}

// A4 page wrapper — mirrors the resume Wrapper pattern.
// overflow, overflow-wrap, word-break handled by .resume-page CSS class in styles.css.
function CLWrapper({
  resume,
  children,
}: {
  resume: Resume;
  children: React.ReactNode;
}) {
  const c = resume.customization;
  return (
    <div
      className="resume-page relative box-border"
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

// Shared letter body — rendered inside all 5 layouts.
// Only dynamic color values use inline style; static properties use Tailwind.
function LetterBody({
  cl,
  resume,
  primaryColor,
}: {
  cl: CoverLetterData;
  resume: Resume;
  primaryColor: string;
}) {
  const s = cl.settings;
  const dateStr = formatCLDate(cl.date, s.dateFormat);
  const p = resume.personal;

  return (
    <div className="flex flex-col gap-[14px]">
      {dateStr && <div>{dateStr}</div>}

      {(cl.hiringManagerName || cl.hiringManagerTitle || cl.companyName || cl.companyAddress) && (
        <div className="leading-[1.6]">
          {cl.hiringManagerName && (
            <div className="font-semibold">{cl.hiringManagerName}</div>
          )}
          {cl.hiringManagerTitle && <div>{cl.hiringManagerTitle}</div>}
          {cl.companyName && <div>{cl.companyName}</div>}
          {cl.companyAddress && (
            <div className="resume-text-wrap">{cl.companyAddress}</div>
          )}
        </div>
      )}

      {cl.subjectLine && (
        <div className="font-bold" style={{ color: primaryColor }}>{cl.subjectLine}</div>
      )}

      {cl.greeting && <div>{cl.greeting}</div>}

      {cl.introduction && <p className="m-0 resume-text-wrap">{cl.introduction}</p>}
      {cl.bodyParagraph1 && <p className="m-0 resume-text-wrap">{cl.bodyParagraph1}</p>}
      {cl.bodyParagraph2 && <p className="m-0 resume-text-wrap">{cl.bodyParagraph2}</p>}
      {cl.closingParagraph && <p className="m-0 resume-text-wrap">{cl.closingParagraph}</p>}

      <div className="mt-2">
        <div>{cl.closingPhrase}</div>
        <div className="mt-8">
          <div className="font-semibold">{p.fullName}</div>
          {s.signatureStyle === "formal" && p.title && (
            <div className="text-[0.9em] opacity-70">{p.title}</div>
          )}
          {s.signatureStyle === "typed" && p.email && (
            <div className="text-[0.85em] opacity-60">{p.email}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Layout: Classic ─────────────────────────────────────────────────────────
// ats-professional, minimalist, elegant-serif, executive, student
// Centered/left header with name + rule, clean single-column body

function CoverLetterClassic({ resume }: { resume: Resume }) {
  const c = resume.customization;
  const p = resume.personal;
  const cl = { ...createBlankCoverLetter(), ...resume.coverLetter };
  const contactLine = buildContactLine(p, cl.settings);
  const isSerif = c.template === "elegant-serif" || c.template === "executive";

  return (
    <CLWrapper resume={resume}>
      <div style={{ padding: "22mm 22mm 18mm 22mm" }}>
        {cl.settings.showHeader && (
          <div style={{ marginBottom: 20, textAlign: "left" }}>
            <div
              style={{
                fontSize: "1.7em",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: c.textColor,
                fontFamily: isSerif ? "Georgia, serif" : undefined,
              }}
            >
              {p.fullName}
            </div>
            {p.title && (
              <div
                style={{
                  fontSize: "0.9em",
                  color: c.primaryColor,
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                {p.title}
              </div>
            )}
            {contactLine && (
              <div
                style={{
                  fontSize: "0.78em",
                  color: c.textColor,
                  opacity: 0.65,
                  marginTop: 4,
                }}
              >
                {contactLine}
              </div>
            )}
            <div
              style={{
                marginTop: 12,
                height: 2,
                background: c.primaryColor,
                borderRadius: 2,
              }}
            />
          </div>
        )}

        <div style={{ fontSize: `${c.fontSize}px` }}>
          <LetterBody cl={cl} resume={resume} primaryColor={c.primaryColor} />
        </div>
      </div>
    </CLWrapper>
  );
}

// ─── Layout: Modern Header ───────────────────────────────────────────────────
// modern-developer, corporate-compact, wave-navy, blue-wave
// Full-width colored top band, white text; white body below

function CoverLetterModernHeader({ resume }: { resume: Resume }) {
  const c = resume.customization;
  const p = resume.personal;
  const cl = { ...createBlankCoverLetter(), ...resume.coverLetter };
  const contactLine = buildContactLine(p, cl.settings);

  return (
    <CLWrapper resume={resume}>
      {cl.settings.showHeader && (
        <div
          style={{
            background: c.primaryColor,
            padding: "16mm 18mm 14mm 18mm",
            color: "#ffffff",
          }}
        >
          <div style={{ fontSize: "1.8em", fontWeight: 800, letterSpacing: "-0.02em" }}>
            {p.fullName}
          </div>
          {p.title && (
            <div style={{ fontSize: "0.9em", opacity: 0.85, marginTop: 3 }}>{p.title}</div>
          )}
          {contactLine && (
            <div style={{ fontSize: "0.75em", opacity: 0.75, marginTop: 5 }}>
              {contactLine}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: "14mm 18mm 18mm 18mm", fontSize: `${c.fontSize}px` }}>
        <LetterBody cl={cl} resume={resume} primaryColor={c.primaryColor} />
      </div>
    </CLWrapper>
  );
}

// ─── Layout: Dark Sidebar ────────────────────────────────────────────────────
// tech-dark, navy-sidebar-pro, noir-wave, orange-dynamic
// Dark left sidebar with contact; white body right

function CoverLetterDarkSidebar({ resume }: { resume: Resume }) {
  const c = resume.customization;
  const p = resume.personal;
  const cl = { ...createBlankCoverLetter(), ...resume.coverLetter };

  const sidebarBg =
    c.template === "tech-dark" || c.template === "noir-wave" ? "#0f172a" : c.primaryColor;

  return (
    <CLWrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "32% 68%", minHeight: "297mm" }}>
        {/* Sidebar */}
        {cl.settings.showHeader && (
          <div
            style={{
              background: sidebarBg,
              padding: "20mm 10mm 20mm 12mm",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div>
              <div style={{ fontSize: "1.1em", fontWeight: 800, lineHeight: 1.2 }}>
                {p.fullName}
              </div>
              {p.title && (
                <div
                  style={{
                    fontSize: "0.78em",
                    opacity: 0.75,
                    marginTop: 4,
                    color: c.accentColor,
                  }}
                >
                  {p.title}
                </div>
              )}
            </div>
            <div
              style={{
                width: 24,
                height: 2,
                background: c.accentColor,
                borderRadius: 2,
                marginTop: 4,
              }}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 5, marginTop: 4 }}>
              {cl.settings.showContactInfo && (
                <>
                  {p.visibility.email && p.email && (
                    <div style={{ fontSize: "0.72em", opacity: 0.8, wordBreak: "break-all" }}>
                      {p.email}
                    </div>
                  )}
                  {p.visibility.phone && p.phone && (
                    <div style={{ fontSize: "0.72em", opacity: 0.8 }}>{p.phone}</div>
                  )}
                  {p.visibility.location && p.location && (
                    <div style={{ fontSize: "0.72em", opacity: 0.8 }}>{p.location}</div>
                  )}
                  {p.visibility.linkedin && p.linkedin && (
                    <div style={{ fontSize: "0.72em", opacity: 0.8, wordBreak: "break-all" }}>
                      {p.linkedin}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Body */}
        <div
          style={{
            background: c.backgroundColor,
            padding: "20mm 14mm 20mm 14mm",
            fontSize: `${c.fontSize}px`,
            gridColumn: cl.settings.showHeader ? undefined : "1 / -1",
          }}
        >
          <LetterBody cl={cl} resume={resume} primaryColor={c.primaryColor} />
        </div>
      </div>
    </CLWrapper>
  );
}

// ─── Layout: Light Sidebar ───────────────────────────────────────────────────
// creative-designer, amber-pill, geo-bronze, violet-gradient
// Vibrant primaryColor sidebar (not near-black), white body

function CoverLetterLightSidebar({ resume }: { resume: Resume }) {
  const c = resume.customization;
  const p = resume.personal;
  const cl = { ...createBlankCoverLetter(), ...resume.coverLetter };

  return (
    <CLWrapper resume={resume}>
      <div style={{ display: "grid", gridTemplateColumns: "30% 70%", minHeight: "297mm" }}>
        {/* Sidebar */}
        {cl.settings.showHeader && (
          <div
            style={{
              background: c.primaryColor,
              padding: "20mm 10mm 20mm 12mm",
              color: "#ffffff",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <div>
              <div style={{ fontSize: "1.1em", fontWeight: 800, lineHeight: 1.2 }}>
                {p.fullName}
              </div>
              {p.title && (
                <div style={{ fontSize: "0.78em", opacity: 0.85, marginTop: 4 }}>{p.title}</div>
              )}
            </div>
            <div
              style={{
                width: 20,
                height: 2.5,
                background: "rgba(255,255,255,0.5)",
                borderRadius: 2,
                marginTop: 6,
              }}
            />
            {cl.settings.showContactInfo && (
              <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 4 }}>
                {p.visibility.email && p.email && (
                  <div style={{ fontSize: "0.72em", opacity: 0.9, wordBreak: "break-all" }}>
                    {p.email}
                  </div>
                )}
                {p.visibility.phone && p.phone && (
                  <div style={{ fontSize: "0.72em", opacity: 0.9 }}>{p.phone}</div>
                )}
                {p.visibility.location && p.location && (
                  <div style={{ fontSize: "0.72em", opacity: 0.9 }}>{p.location}</div>
                )}
                {p.visibility.linkedin && p.linkedin && (
                  <div style={{ fontSize: "0.72em", opacity: 0.9, wordBreak: "break-all" }}>
                    {p.linkedin}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div
          style={{
            background: c.backgroundColor,
            padding: "20mm 14mm 20mm 14mm",
            fontSize: `${c.fontSize}px`,
            gridColumn: cl.settings.showHeader ? undefined : "1 / -1",
          }}
        >
          <LetterBody cl={cl} resume={resume} primaryColor={c.primaryColor} />
        </div>
      </div>
    </CLWrapper>
  );
}

// ─── Layout: Graphic ─────────────────────────────────────────────────────────
// crimson-hex, orange-swirl, coral-card
// Decorative shape in header zone, name/title overlay, body below

function CoverLetterGraphic({ resume }: { resume: Resume }) {
  const c = resume.customization;
  const p = resume.personal;
  const cl = { ...createBlankCoverLetter(), ...resume.coverLetter };
  const contactLine = buildContactLine(p, cl.settings);

  return (
    <CLWrapper resume={resume}>
      {/* Header zone with decorative shape */}
      {cl.settings.showHeader && (
        <div style={{ position: "relative", overflow: "hidden", paddingBottom: 8 }}>
          {/* Background blob */}
          <div
            style={{
              position: "absolute",
              top: -40,
              right: -60,
              width: 260,
              height: 260,
              borderRadius: "50%",
              background: c.primaryColor,
              opacity: 0.12,
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 6,
              background: c.primaryColor,
            }}
          />
          <div style={{ position: "relative", padding: "16mm 22mm 10mm 22mm" }}>
            <div style={{ fontSize: "1.7em", fontWeight: 800, letterSpacing: "-0.02em" }}>
              {p.fullName}
            </div>
            {p.title && (
              <div
                style={{ fontSize: "0.9em", color: c.primaryColor, fontWeight: 500, marginTop: 2 }}
              >
                {p.title}
              </div>
            )}
            {contactLine && (
              <div style={{ fontSize: "0.78em", opacity: 0.6, marginTop: 4 }}>{contactLine}</div>
            )}
          </div>
          <div
            style={{
              marginLeft: 22 * 3.78,
              marginRight: 22 * 3.78,
              height: 2,
              background: c.primaryColor,
              opacity: 0.3,
            }}
          />
        </div>
      )}

      <div
        style={{
          padding: cl.settings.showHeader ? "10mm 22mm 18mm 22mm" : "22mm",
          fontSize: `${c.fontSize}px`,
        }}
      >
        <LetterBody cl={cl} resume={resume} primaryColor={c.primaryColor} />
      </div>
    </CLWrapper>
  );
}

// ─── Dispatch component ───────────────────────────────────────────────────────

export function CoverLetterTemplate({ resume }: { resume: Resume }) {
  const layout = COVER_LETTER_LAYOUT_MAP[resume.customization.template] ?? "classic";
  switch (layout) {
    case "modern-header":
      return <CoverLetterModernHeader resume={resume} />;
    case "dark-sidebar":
      return <CoverLetterDarkSidebar resume={resume} />;
    case "light-sidebar":
      return <CoverLetterLightSidebar resume={resume} />;
    case "graphic":
      return <CoverLetterGraphic resume={resume} />;
    default:
      return <CoverLetterClassic resume={resume} />;
  }
}
