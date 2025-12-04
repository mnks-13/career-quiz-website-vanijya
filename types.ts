
export enum AppStep {
  HOME,
  ABOUT,
  TEAM,
  QUIZ_GENERAL,
  PROFESSION_SELECTION,
  PROFESSION_OVERVIEW,
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
  LAW = "Law",
  PSYCHOLOGY = "Psychology",
  DESIGNING = "Designing"
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
