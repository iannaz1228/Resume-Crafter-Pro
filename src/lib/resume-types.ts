import type { CoverLetterData } from "./cover-letter-types";

export type PhotoShape = "circle" | "rounded" | "square";
export type SkillStyle = "bars" | "percent" | "pills" | "text" | "bullets";
export type TemplateId =
  | "ats-professional"
  | "modern-developer"
  | "executive"
  | "student"
  | "minimalist"
  | "creative-designer"
  | "corporate-compact"
  | "elegant-serif"
  | "tech-dark"
  | "amber-pill"
  | "wave-navy"
  | "geo-bronze"
  | "noir-wave"
  | "navy-sidebar-pro"
  | "crimson-hex"
  | "orange-swirl"
  | "coral-card"
  | "orange-dynamic"
  | "blue-wave"
  | "violet-gradient";

export interface PersonalInfo {
  fullName: string;
  title: string;
  phone: string;
  email: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
  website: string;
  photo?: string; // data URL
  photoShape: PhotoShape;
  photoSize: number; // px
  showPhoto: boolean;
  visibility: Record<
    "phone" | "email" | "location" | "linkedin" | "github" | "portfolio" | "website",
    boolean
  >;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  honors: string;
  hidden?: boolean;
  showGpa?: boolean;    // undefined = show if non-empty (default)
  showHonors?: boolean; // false = explicitly hidden
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  hidden?: boolean;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  description: string;
  tech: string;
  github: string;
  demo: string;
  website: string;
  hidden?: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0-100
  category: string;
}

export interface CertificationItem {
  id: string;
  name: string;
  org: string;
  date: string;
  url: string;
  hidden?: boolean;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
  hidden?: boolean;
}

export interface ReferenceItem {
  id: string;
  name: string;
  position: string;
  contact: string;
  hidden?: boolean;
}

export interface SectionVisibility {
  summary: boolean;
  experience: boolean;
  education: boolean;
  projects: boolean;
  skills: boolean;
  certifications: boolean;
  languages: boolean;
  references: boolean;
}

export interface Customization {
  template: TemplateId;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  backgroundColor: string;
  fontFamily: string;
  fontSize: number;
  sectionSpacing: number;
  lineHeight: number;
  skillStyle: SkillStyle;
  showSkillLevels: boolean;
  referencesMode: "available" | "custom" | "hidden";
}

export interface Resume {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  personal: PersonalInfo;
  summary: string;
  experience: ExperienceItem[];
  education: EducationItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  references: ReferenceItem[];
  sectionOrder: Array<keyof SectionVisibility>;
  visibility: SectionVisibility;
  customization: Customization;
  coverLetter?: CoverLetterData;
}

export type { CoverLetterLayout, CoverLetterSettings, CoverLetterData } from "./cover-letter-types";
