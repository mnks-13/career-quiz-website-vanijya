

export enum AppStep {
  HOME,
  ABOUT,
  TEAM,
  USER_DETAILS,
  QUIZ_GENERAL,
  PROFESSION_SELECTION,
  QUIZ_PROFESSION,
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

export interface DetailedProfile {
  title: string;
  summary: string; // 1-2 sentences
  description: string; // Short paragraph
  keySkills: string[]; // 5-7 bullets
  personalityFit: string[]; // 3-5 bullets
  pathway: string; // Clear steps, newlines
  salary: string; // Exact format
  growth: string[]; // 4-6 bullets
  fitReason: string; // Short friendly paragraph
}

export interface JobSuggestion {
  title: string;
  summary: string;
  description: string;
  keySkills: string[];
  personalityFit: string[];
  pathway: string;
  salary: string;
  growth: string[];
  fitReason: string;
}

export interface UserDetails {
  name: string;
  email: string;
  standard: string;
  stream?: string;
}

export interface QuizState {
  step: AppStep;
  // Store answers by index to allow going back. 
  // General: array of Archetype strings. Profession: array of scores.
  generalAnswers: (Archetype | null)[]; 
  professionAnswers: (number | null)[];
  
  userDetails: UserDetails | null;

  selectedProfession: Profession | null;
  finalArchetype: Archetype | null;
  
  // Store aptitude scores (0-100) for each profession
  aptitudeScores: Record<Profession, number | null>;
  
  // Store history of answers for professions [score, score, ...]
  professionHistory: Record<string, (number | null)[]>;
}