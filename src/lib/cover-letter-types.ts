export type CoverLetterLayout =
  | "classic"
  | "modern-header"
  | "dark-sidebar"
  | "light-sidebar"
  | "graphic";

export interface CoverLetterSettings {
  showHeader: boolean;
  showContactInfo: boolean;
  dateFormat: "long" | "short" | "numeric";
  signatureStyle: "typed" | "name-only" | "formal";
}

export interface CoverLetterData {
  date: string;
  hiringManagerName: string;
  hiringManagerTitle: string;
  companyName: string;
  companyAddress: string;
  subjectLine: string;
  greeting: string;
  introduction: string;
  bodyParagraph1: string;
  bodyParagraph2: string;
  closingParagraph: string;
  closingPhrase: string;
  jobTitle: string;
  jobDescription: string;
  keySkills: string;
  settings: CoverLetterSettings;
}
