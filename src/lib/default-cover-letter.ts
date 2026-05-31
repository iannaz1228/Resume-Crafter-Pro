import type { CoverLetterData } from "./cover-letter-types";

export function createBlankCoverLetter(): CoverLetterData {
  return {
    date: "",
    hiringManagerName: "",
    hiringManagerTitle: "",
    companyName: "",
    companyAddress: "",
    subjectLine: "",
    greeting: "Dear Hiring Manager,",
    introduction: "",
    bodyParagraph1: "",
    bodyParagraph2: "",
    closingParagraph: "",
    closingPhrase: "Sincerely,",
    jobTitle: "",
    jobDescription: "",
    keySkills: "",
    settings: {
      showHeader: true,
      showContactInfo: true,
      dateFormat: "long",
      signatureStyle: "typed",
    },
  };
}
