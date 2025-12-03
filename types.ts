export enum AppStep {
  HOME,
  QUIZ_GENERAL,
  PROFESSION_SELECTION,
  QUIZ_PROFESSION,
  LOADING_RESULTS,
  RESULTS
}

export interface Question {
  id: number;
  text: string;
  options: {
    label: string;
    value: string | number; // String for Archetype (General), Number for Score (Profession)
  }[];
}

export enum Archetype {
  CREATIVE = "Creative Thinker",
  LOGICAL = "Logical Analyzer",
  SOCIAL = "Social Communicator",
  PRACTICAL = "Practical Builder"
}

export enum Profession {
  DOCTOR = "Doctor",
  ARCHITECT = "Architect",
  ENGINEER = "Engineer",
  ENTREPRENEUR = "Entrepreneur",
  FASHION_DESIGNER = "Fashion Designer",
  TEACHER = "Teacher",
  SOFTWARE_DEVELOPER = "Software Developer",
  DIGITAL_MARKETER = "Digital Marketer"
}

export interface JobSuggestion {
  title: string;
  description: string;
  fitReason: string;
}

export interface QuizState {
  step: AppStep;
  generalAnswers: Record<string, number>; // Map archetype to count
  selectedProfession: Profession | null;
  professionScore: number;
  finalArchetype: Archetype | null;
  jobSuggestions: JobSuggestion[];
}