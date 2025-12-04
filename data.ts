import { Archetype, Profession, Question } from './types';

export const GENERAL_QUESTIONS: Question[] = [
  {
    id: 1,
    text: "When facing a new problem, what is your first instinct?",
    options: [
      { label: "Brainstorm wild, out-of-the-box ideas.", value: Archetype.CREATIVE },
      { label: "Analyze the facts and look for patterns.", value: Archetype.LOGICAL },
      { label: "Ask others for their input and perspective.", value: Archetype.SOCIAL },
      { label: "Look for the quickest, most efficient practical fix.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 2,
    text: "In a group project, you naturally take on the role of:",
    options: [
      { label: "The visionary with the big ideas.", value: Archetype.CREATIVE },
      { label: "The planner who organizes the data.", value: Archetype.LOGICAL },
      { label: "The presenter or negotiator.", value: Archetype.SOCIAL },
      { label: "The builder who makes the prototype.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 3,
    text: "Which activity sounds most appealing for a weekend?",
    options: [
      { label: "Painting, writing, or designing.", value: Archetype.CREATIVE },
      { label: "Solving puzzles or coding.", value: Archetype.LOGICAL },
      { label: "Volunteering or hanging out with friends.", value: Archetype.SOCIAL },
      { label: "Fixing something or building furniture.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 4,
    text: "How do you handle conflict?",
    options: [
      { label: "I look for a novel solution that pleases everyone.", value: Archetype.CREATIVE },
      { label: "I use logic to prove which side is correct.", value: Archetype.LOGICAL },
      { label: "I listen and mediate between parties.", value: Archetype.SOCIAL },
      { label: "I focus on moving forward and getting back to work.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 5,
    text: "What do you value most in a leader?",
    options: [
      { label: "Vision and inspiration.", value: Archetype.CREATIVE },
      { label: "Intelligence and strategy.", value: Archetype.LOGICAL },
      { label: "Empathy and communication.", value: Archetype.SOCIAL },
      { label: "Competence and results.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 6,
    text: "When learning something new, you prefer:",
    options: [
      { label: "Visual aids and open-ended exploration.", value: Archetype.CREATIVE },
      { label: "Structured logic and clear rules.", value: Archetype.LOGICAL },
      { label: "Group discussions and role-play.", value: Archetype.SOCIAL },
      { label: "Hands-on practice and trial-and-error.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 7,
    text: "Your friends describe you as:",
    options: [
      { label: "Imaginative.", value: Archetype.CREATIVE },
      { label: "Smart.", value: Archetype.LOGICAL },
      { label: "Friendly.", value: Archetype.SOCIAL },
      { label: "Reliable.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 8,
    text: "Which tool would you rather master?",
    options: [
      { label: "Adobe Photoshop or a paintbrush.", value: Archetype.CREATIVE },
      { label: "Excel or Python.", value: Archetype.LOGICAL },
      { label: "Public speaking or social media.", value: Archetype.SOCIAL },
      { label: "A 3D printer or power tools.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 9,
    text: "A successful career to you means:",
    options: [
      { label: "Creating something that didn't exist before.", value: Archetype.CREATIVE },
      { label: "Solving complex, difficult problems.", value: Archetype.LOGICAL },
      { label: "Helping people and making connections.", value: Archetype.SOCIAL },
      { label: "Building tangible, useful things.", value: Archetype.PRACTICAL },
    ]
  },
  {
    id: 10,
    text: "If you had to plan an event, you would focus on:",
    options: [
      { label: " The theme and decorations.", value: Archetype.CREATIVE },
      { label: "The budget and schedule.", value: Archetype.LOGICAL },
      { label: "The guest list and entertainment.", value: Archetype.SOCIAL },
      { label: " The logistics and setup.", value: Archetype.PRACTICAL },
    ]
  }
];

export const PROFESSION_OVERVIEWS: Record<Profession, { description: string; fields: string[] }> = {
  [Profession.LAW]: {
    description: "Law in the modern era goes far beyond the courtroom arguments seen in movies. It is the structural framework of society, requiring high intellectual rigour, a command over language, and the ability to construct logical arguments. Whether you are interested in high-stakes corporate mergers, protecting intellectual property in the tech boom, or clearing the path for justice through the judiciary, this field offers immense power to drive change.",
    fields: [
      "Civil & Criminal Litigation",
      "Corporate Law & Mergers (M&A)",
      "Judicial Services (Magistracy)",
      "Cyber Law & Data Privacy",
      "Intellectual Property Rights (IPR)",
      "Alternative Dispute Resolution (Arbitration)",
      "Public Policy & Human Rights",
      "Legal Journalism & Research"
    ]
  },
  [Profession.PSYCHOLOGY]: {
    description: "Psychology is one of the fastest-growing fields today as mental health awareness takes center stage globally. It is the scientific exploration of the human mind and behavior. This path is not limited to clinical therapy; it spans across corporate boardrooms, sports academies, and educational institutions. If you have emotional intelligence and an analytical mind, you can shape how organizations work and how individuals heal.",
    fields: [
      "Clinical Psychology",
      "Counseling & Guidance (School/NGO)",
      "Industrial-Organizational (Corporate HR)",
      "Sports & Performance Psychology",
      "Child Development & Special Education",
      "Forensic & Criminal Psychology",
      "Consumer Behavior & Marketing",
      "Rehabilitation Psychology"
    ]
  },
  [Profession.DESIGNING]: {
    description: "Designing is the perfect blend of creativity and commerce. It is about problem-solving through aesthetics and functionality. As digital transformation accelerates and the demand for sustainable lifestyle products grows, designers are the architects of the user experience. From the clothes we wear to the apps we use and the spaces we live in, design is everywhere.",
    fields: [
      "Fashion & Textile Design",
      "UI/UX Design (User Experience)",
      "Graphic Design & Brand Identity",
      "Interior & Spatial Architecture",
      "Animation, VFX & Game Design",
      "Product & Industrial Design",
      "Jewelry & Accessory Design",
      "Design Management & Strategy"
    ]
  }
};

export const PROFESSION_QUESTIONS: Record<Profession, Question[]> = {
  [Profession.LAW]: generateProfessionQuestions("Critical Analysis", "Persuasive Reasoning"),
  [Profession.PSYCHOLOGY]: generateProfessionQuestions("Human Behavior Analysis", "Empathy"),
  [Profession.DESIGNING]: generateProfessionQuestions("Visual Creativity", "User-Centric Problem Solving"),
};

function generateProfessionQuestions(skill1: string, skill2: string): Question[] {
  const questions: Question[] = [];
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: i,
      text: i % 2 === 0 
        ? `I naturally enjoy tasks that involve deep ${skill1}.` 
        : `I am comfortable handling complex challenges related to ${skill2}.`,
      options: [
        { label: "Strongly Agree", value: 10 },
        { label: "Agree", value: 7 },
        { label: "Neutral", value: 5 },
        { label: "Disagree", value: 2 },
      ]
    });
  }
  return questions;
}