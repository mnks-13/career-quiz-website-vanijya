
import { Archetype, Profession, Question, DetailedProfile } from './types';

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

const commonOptions = [
  { label: "Strongly Agree", value: 10 },
  { label: "Agree", value: 7 },
  { label: "Neutral", value: 5 },
  { label: "Disagree", value: 2 },
];

export const PROFESSION_QUESTIONS: Record<Profession, Question[]> = {
  [Profession.LAW]: [
    { id: 1, text: "I enjoy reading complex texts and identifying inconsistencies in arguments.", options: commonOptions },
    { id: 2, text: "I can detach my emotions to view a situation objectively and fairly.", options: commonOptions },
    { id: 3, text: "Winning a debate is exciting to me, even if I have to argue a side I don't personally agree with.", options: commonOptions },
    { id: 4, text: "I am interested in how government policies and rules affect society.", options: commonOptions },
    { id: 5, text: "I pay close attention to the specific wording of sentences to ensure accuracy.", options: commonOptions },
    { id: 6, text: "I am comfortable speaking in front of an audience and defending my viewpoint.", options: commonOptions },
    { id: 7, text: "When solving a problem, I prefer to look up rules, precedents, or guidelines.", options: commonOptions },
    { id: 8, text: "I have a strong sense of justice and want to ensure people are treated fairly.", options: commonOptions },
    { id: 9, text: "I can remain calm and focused during a heated disagreement.", options: commonOptions },
    { id: 10, text: "I enjoy researching historical facts to back up my current opinions.", options: commonOptions },
  ],
  [Profession.PSYCHOLOGY]: [
    { id: 1, text: "I often find myself analyzing why people act the way they do.", options: commonOptions },
    { id: 2, text: "People naturally open up to me about their personal problems.", options: commonOptions },
    { id: 3, text: "I am more interested in listening to someone's story than telling my own.", options: commonOptions },
    { id: 4, text: "I can sense the 'vibe' or emotional state of a room as soon as I walk in.", options: commonOptions },
    { id: 5, text: "I am patient with people who are struggling or indecisive.", options: commonOptions },
    { id: 6, text: "I am curious about how the brain functions and processes emotions.", options: commonOptions },
    { id: 7, text: "I believe that understanding a person's childhood is key to understanding who they are now.", options: commonOptions },
    { id: 8, text: "I can keep confidential information to myself without the urge to gossip.", options: commonOptions },
    { id: 9, text: "I want a career where my primary goal is helping others improve their mental well-being.", options: commonOptions },
    { id: 10, text: "I notice subtle changes in people's body language and tone of voice.", options: commonOptions },
  ],
  [Profession.DESIGNING]: [
    { id: 1, text: "I often critique the layout of menus, apps, or posters I see in daily life.", options: commonOptions },
    { id: 2, text: "I can easily visualize how a room would look if the furniture were rearranged.", options: commonOptions },
    { id: 3, text: "I enjoy the process of making things that are both useful and beautiful.", options: commonOptions },
    { id: 4, text: "I express my ideas better through sketching or drawing than through writing.", options: commonOptions },
    { id: 5, text: "I love experimenting with color combinations, textures, and fonts.", options: commonOptions },
    { id: 6, text: "I am comfortable with the idea that my work will be judged subjectively by others.", options: commonOptions },
    { id: 7, text: "I notice when a product is hard to use and immediately think of ways to fix it.", options: commonOptions },
    { id: 8, text: "I keep up with trends in fashion, technology, or art.", options: commonOptions },
    { id: 9, text: "I believe that good design can solve real-world problems.", options: commonOptions },
    { id: 10, text: "I am willing to iterate on a project many times to get the details perfect.", options: commonOptions },
  ],
};

export const DETAILED_PROFILES: Record<Profession, DetailedProfile> = {
  [Profession.LAW]: {
    title: "Law & Legal Studies",
    summary: "A career dedicated to understanding rules, solving disputes, and fighting for justice.",
    description: "Lawyers and legal professionals spend their days reading cases, drafting documents, and arguing points to protect their clients. It involves a lot of reading, logical thinking, and communicating complex ideas clearly. You act as a shield and a voice for those who need help navigating the system.",
    keySkills: [
      "Critical Thinking & Logic",
      "Public Speaking",
      "Research and Analysis",
      "Persuasive Writing",
      "Negotiation",
      "Attention to Detail",
      "Patience and Resilience"
    ],
    personalityFit: [
      "People who love debating and proving a point.",
      "Detail-oriented thinkers who don't miss small errors.",
      "Individuals who value fairness and justice.",
      "Those who can stay calm under pressure."
    ],
    pathway: "Subjects in Class 11-12: Humanities or Commerce (Legal Studies is a bonus).\n\nDegrees needed: Integrated B.A. LL.B. (5 years) after 12th OR LL.B. (3 years) after graduation.\n\nImportant Exams: CLAT (Common Law Admission Test), AILET, LSAT-India.\n\nInternships: Essential to work with district courts, senior lawyers, or law firms during college.",
    salary: "Starting salary: ₹5,00,000 per year\nMid-level salary: ₹12,00,000 per year\nExperienced salary: ₹25,00,000+ per year",
    growth: [
      "Specializing in Corporate Law (High paying)",
      "Joining the Judiciary (Becoming a Judge)",
      "Legal Journalism or Policy Analysis",
      "Starting your own Law Firm",
      "International Human Rights Law"
    ],
    fitReason: "This career requires a blend of logic and language. If you enjoy analyzing facts and building strong arguments, this structure will feel natural to you."
  },
  [Profession.PSYCHOLOGY]: {
    title: "Psychology & Mental Health",
    summary: "Understanding the human mind to help people lead better, healthier lives.",
    description: "Psychologists study how people think, feel, and behave. They work in clinics, schools, or companies to support mental well-being. It involves a lot of listening, observing, and empathy to help others overcome challenges. It is not just about giving advice; it is about understanding the root cause of behavior.",
    keySkills: [
      "Active Listening",
      "Empathy & Compassion",
      "Analytical Thinking",
      "Verbal Communication",
      "Patience",
      "Ethics & Confidentiality",
      "Observation"
    ],
    personalityFit: [
      "Good listeners who people naturally trust.",
      "Curious minds who ask 'why' people act that way.",
      "Empathetic individuals who genuinely want to help.",
      "People who are open-minded and non-judgmental."
    ],
    pathway: "Subjects in Class 11-12: Psychology (Humanities or Science stream).\n\nDegrees needed: B.A./B.Sc. in Psychology (3-4 years) -> M.A./M.Sc. in Psychology (2 years).\n\nImportant Exams: CUET for top universities.\n\nLicensing: M.Phil (RCI approved) is required to be a Clinical Psychologist.",
    salary: "Starting salary: ₹3,50,000 per year\nMid-level salary: ₹8,00,000 per year\nExperienced salary: ₹15,00,000+ per year",
    growth: [
      "Clinical Psychologist (Private Practice)",
      "Corporate HR or Organizational Psychologist",
      "Sports Psychologist for athletes",
      "School Counselor or Child Psychologist",
      "Researcher or Professor"
    ],
    fitReason: "Your ability to connect with people and understand emotions makes this a strong fit. It requires patience and a desire to make a positive impact on individual lives."
  },
  [Profession.DESIGNING]: {
    title: "Design & Creative Arts",
    summary: "Solving problems visually to make the world functional and beautiful.",
    description: "Designers create everything from apps and logos to clothes and interiors. They combine art with purpose to improve how people use and experience products. It is a dynamic field where creativity meets technology. You aren't just making art; you are designing solutions.",
    keySkills: [
      "Visual Creativity",
      "Design Software (Adobe Suite, Figma)",
      "User Empathy",
      "Problem Solving",
      "Sketching & Drawing",
      "Color Theory",
      "Communication"
    ],
    personalityFit: [
      "Creative thinkers who doodle or imagine new things.",
      "Visual learners who appreciate aesthetics.",
      "People who like to experiment and iterate.",
      "Those who can accept feedback and improve."
    ],
    pathway: "Subjects in Class 11-12: Any stream (Art or Design electives help).\n\nDegrees needed: B.Des (Bachelor of Design) or B.F.A. (Bachelor of Fine Arts).\n\nImportant Exams: NID-DAT, UCEED (for IITs), NIFT (for Fashion).\n\nExperience: Building a strong portfolio is more important than grades.",
    salary: "Starting salary: ₹4,50,000 per year\nMid-level salary: ₹10,00,000 per year\nExperienced salary: ₹20,00,000+ per year",
    growth: [
      "User Experience (UX) Lead",
      "Creative Director in an agency",
      "Freelance Consultant or Studio Owner",
      "Game Designer or Animator",
      "Product Manager"
    ],
    fitReason: "This is ideal for those who see the world differently. If you want to bring your imaginative ideas to life and create things that people use every day, this is for you."
  }
};
