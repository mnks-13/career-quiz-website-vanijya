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

export const PROFESSION_QUESTIONS: Record<Profession, Question[]> = {
  [Profession.DOCTOR]: generateProfessionQuestions("Healthcare", "Medical Science"),
  [Profession.ARCHITECT]: generateProfessionQuestions("Spatial Design", "Structural Planning"),
  [Profession.ENGINEER]: generateProfessionQuestions("Technical Systems", "Problem Solving"),
  [Profession.ENTREPRENEUR]: generateProfessionQuestions("Risk Taking", "Business Strategy"),
  [Profession.FASHION_DESIGNER]: generateProfessionQuestions("Aesthetics", "Trend Analysis"),
  [Profession.TEACHER]: generateProfessionQuestions("Instruction", "Patience"),
  [Profession.SOFTWARE_DEVELOPER]: generateProfessionQuestions("Coding Logic", "System Architecture"),
  [Profession.DIGITAL_MARKETER]: generateProfessionQuestions("Content Strategy", "Data Analytics"),
};

function generateProfessionQuestions(skill1: string, skill2: string): Question[] {
  // Helper to generate 10 questions efficiently for the demo
  const questions: Question[] = [];
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: i,
      text: i % 2 === 0 
        ? `I enjoy tasks that involve deep ${skill1}.` 
        : `I am comfortable dealing with complex challenges related to ${skill2}.`,
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