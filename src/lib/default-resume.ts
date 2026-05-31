import type { Resume, SectionVisibility } from "./resume-types";

export const uid = () => Math.random().toString(36).slice(2, 10);

export const DEFAULT_SECTION_ORDER: Array<keyof SectionVisibility> = [
  "summary",
  "experience",
  "education",
  "projects",
  "skills",
  "certifications",
  "languages",
  "references",
];

export function createBlankResume(name = "Untitled Resume"): Resume {
  const now = Date.now();
  return {
    id: uid(),
    name,
    createdAt: now,
    updatedAt: now,
    personal: {
      fullName: "Ian Magistrado Naz",
      title: "Senior Product Designer",
      phone: "+1 (555) 123-4567",
      email: "iannaz1228@gmail.com",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/iannaz1228",
      github: "github.com/iannaz1228",
      portfolio: "infosyscoreteam.com",
      website: "",
      photoShape: "circle",
      photoSize: 96,
      showPhoto: true,
      visibility: {
        phone: true,
        email: true,
        location: true,
        linkedin: true,
        github: true,
        portfolio: true,
        website: false,
      },
    },
    summary:
      "Product designer with 7+ years crafting human-centered SaaS experiences. Led design systems at scale, shipped 0→1 products used by 1M+ users, and partner deeply with engineering to translate ambitious ideas into measurable outcomes.",
    experience: [
      {
        id: uid(),
        company: "Northwind Labs",
        position: "Senior Product Designer",
        location: "Remote",
        startDate: "2022",
        endDate: "Present",
        description:
          "• Led redesign of core analytics suite, lifting weekly active usage by 38%.\n• Built and maintain Aurora, our design system across web + mobile (120+ components).\n• Mentor 3 designers and run weekly design critiques.",
      },
      {
        id: uid(),
        company: "Lumen Studio",
        position: "Product Designer",
        location: "New York, NY",
        startDate: "2019",
        endDate: "2022",
        description:
          "• Shipped onboarding overhaul that reduced TTV from 11 to 4 minutes.\n• Partnered with research to run 40+ usability sessions per quarter.",
      },
    ],
    education: [
      {
        id: uid(),
        school: "Rhode Island School of Design",
        degree: "BFA",
        field: "Graphic Design",
        startDate: "2014",
        endDate: "2018",
        gpa: "3.8",
        honors: "Magna Cum Laude",
      },
    ],
    projects: [
      {
        id: uid(),
        name: "Aurora Design System",
        role: "Lead Designer",
        description:
          "Multi-brand component library powering 6 product lines with built-in accessibility checks.",
        tech: "Figma, React, Tailwind, Storybook",
        github: "github.com/iannaz1228",
        demo: "aurora.design",
        website: "",
      },
    ],
    skills: [
      { id: uid(), name: "Product Design", level: 95, category: "Design" },
      { id: uid(), name: "Design Systems", level: 92, category: "Design" },
      { id: uid(), name: "Prototyping", level: 88, category: "Design" },
      { id: uid(), name: "User Research", level: 80, category: "Research" },
      { id: uid(), name: "Figma", level: 98, category: "Tools" },
      { id: uid(), name: "React / Tailwind", level: 75, category: "Tools" },
    ],
    certifications: [
      {
        id: uid(),
        name: "NN/g UX Certification",
        org: "Nielsen Norman Group",
        date: "2021",
        url: "",
      },
    ],
    languages: [
      { id: uid(), name: "English", proficiency: "Native" },
      { id: uid(), name: "Spanish", proficiency: "Professional" },
    ],
    references: [],
    sectionOrder: [...DEFAULT_SECTION_ORDER],
    visibility: {
      summary: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
      certifications: true,
      languages: true,
      references: true,
    },
    customization: {
      template: "amber-pill",
      primaryColor: "#E8843C",
      accentColor: "#00D4FF",
      textColor: "#1a1b2e",
      backgroundColor: "#ffffff",
      fontFamily: "Inter",
      fontSize: 11,
      sectionSpacing: 18,
      lineHeight: 1.5,
      skillStyle: "bars",
      showSkillLevels: true,
      referencesMode: "available",
    },
  };
}
