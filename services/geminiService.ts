
import { GoogleGenAI, Type } from "@google/genai";
import { Archetype, Profession, CareerInsights } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCareerInsights = async (
  archetype: Archetype,
  profession: Profession,
  matchScore: number
): Promise<CareerInsights> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    The user is a student exploring careers.
    
    Their General Skill Archetype is: ${archetype}.
    Their Interest Profession is: ${profession}.
    Their Aptitude Match Score for that profession is: ${matchScore}%.

    Please generate two things:
    1. A list of 3 specific, modern job profiles within ${profession}.
    2. A list of 4-6 "workspace simulated tasks" for ${profession}.

    --- 
    PART 1: JOB PROFILES
    Create 3 specific, modern, and distinct job profiles.
    For each job profile, use the following structure:
    - Job Title (title)
    - One-Sentence Summary (summary)
    - Detailed Description (description): Short paragraph, simple English.
    - Key Skills Required (keySkills): 5-7 bullet points.
    - Personality Fit (personalityFit): 3-5 bullet points.
    - Pathway to Enter (pathway): Clear steps (Subjects, Degrees, Exams, Internships).
    - Average Salary in India (salary): Format: Starting, Mid-level, Experienced.
    - Growth Opportunities (growth): 4-6 bullet points.
    - Why This Fits You (fitReason): Friendly paragraph linking to ${archetype}.

    ---
    PART 2: WORKSPACE SIMULATED TASKS
    Generate 4-6 tasks for the selected career. These tasks will be displayed on a separate Tasks Page.
    Follow these rules strictly:
    - Each task must simulate real work done in that career.
    - Write tasks as simple, short, scenario-based activities.
    - Tasks must NOT be a quiz.
    - Tasks must NOT require advanced knowledge.
    - Use simple, student-friendly English.
    - Make tasks feel like small real-world assignments a beginner can imagine doing.
    - Do NOT add explanations, introductions, summaries, or extra sections.
    - Output should be a list of strings only.

    Response must be a valid JSON object with keys "jobs" (array) and "simulatedTasks" (array of strings).
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            jobs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  summary: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keySkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                  personalityFit: { type: Type.ARRAY, items: { type: Type.STRING } },
                  pathway: { type: Type.STRING },
                  salary: { type: Type.STRING },
                  growth: { type: Type.ARRAY, items: { type: Type.STRING } },
                  fitReason: { type: Type.STRING },
                },
                required: ["title", "summary", "description", "keySkills", "personalityFit", "pathway", "salary", "growth", "fitReason"]
              }
            },
            simulatedTasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["jobs", "simulatedTasks"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as CareerInsights;
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback data
    const fallbacks: Record<string, CareerInsights> = {
      "Law": {
        jobs: [
          { 
            title: "Corporate Lawyer", 
            summary: "A lawyer who helps companies handle legal rules and business deals.",
            description: "Corporate lawyers work in offices advising businesses on their legal rights. They read contracts, help with mergers (when companies join), and make sure the company follows government laws.", 
            keySkills: ["Negotiation", "Contract Drafting", "Attention to Detail", "Commercial Awareness", "Teamwork"],
            personalityFit: ["People who love strategy", "Those who can work under pressure", "Logical thinkers"],
            pathway: "Class 11-12: Any stream (Commerce/Humanities preferred)\nDegree: 5-year LLB (after 12th) or 3-year LLB (after graduation)\nExams: CLAT, AILET\nInternships: Law firms",
            salary: "Starting salary: ₹5,00,000 per year\nMid-level salary: ₹12,00,000 per year\nExperienced salary: ₹25,00,000+ per year",
            growth: ["Senior Associate", "Partner in a Law Firm", "General Counsel", "Start your own firm"],
            fitReason: `As a ${archetype}, your analytical skills fit well with the structured world of corporate law.`
          },
          { 
            title: "Legal Journalist", 
            summary: "A writer who reports on court cases and legal news for the public.",
            description: "Legal journalists attend court hearings, read judgments, and write news stories. They explain complex legal laws in simple language so ordinary people can understand them.", 
            keySkills: ["Writing", "Research", "Communication", "Curiosity", "Critical Thinking"],
            personalityFit: ["Storytellers", "People who love current affairs", "Those who question everything"],
            pathway: "Class 11-12: Humanities\nDegree: Law degree (LLB) + Journalism diploma or Mass Comm\nInternships: News channels, Legal blogs",
            salary: "Starting salary: ₹3,50,000 per year\nMid-level salary: ₹8,00,000 per year\nExperienced salary: ₹15,00,000 per year",
            growth: ["Senior Editor", "Legal Correspondent", "Author", "Policy Analyst"],
            fitReason: "Combines your legal interest with creativity."
          },
          { 
            title: "Judicial Magistrate", 
            summary: "A judge who hears cases and decides outcomes in lower courts.",
            description: "Magistrates listen to arguments from lawyers, look at evidence, and decide who is right or wrong. They play a huge role in the justice system.", 
            keySkills: ["Impartiality", "Listening", "Patience", "Decision Making", "Integrity"],
            personalityFit: ["People with a strong moral compass", "Good listeners", "Patient individuals"],
            pathway: "Degree: LLB\nExam: Judicial Services Examination (PCS-J) conducted by states\nExperience: Not always required for lower judiciary",
            salary: "Starting salary: ₹8,00,000 per year\nMid-level salary: ₹15,00,000 per year\nExperienced salary: ₹24,00,000+ per year (Government scale)",
            growth: ["District Judge", "High Court Judge", "Supreme Court Judge"],
            fitReason: "Perfect for someone who values structure and fairness."
          }
        ],
        simulatedTasks: [
          "Read a 5-page document and find three contradictions in the statements.",
          "Write a convincing 2-minute opening statement for a debate on a topic you disagree with.",
          "Summarize a complex news story about a new law into three simple bullet points.",
          "Role-play a negotiation where you must reach a compromise without giving up your main demand.",
          "Identify the legal issue in a fictional neighbor dispute scenario."
        ]
      },
      "Psychology": {
        jobs: [
          { 
            title: "Clinical Psychologist", 
            summary: "A mental health expert who diagnoses and treats emotional problems.",
            description: "They work in hospitals or clinics, talking to patients to help them understand their feelings. They use therapy to treat anxiety, depression, and other conditions.", 
            keySkills: ["Empathy", "Active Listening", "Patience", "Analysis", "Ethics"],
            personalityFit: ["Good listeners", "Empathetic souls", "People who want to help others"],
            pathway: "Class 11-12: Psychology/Science\nDegree: BA/B.Sc Psychology -> MA/M.Sc Psychology\nLicence: M.Phil in Clinical Psychology (RCI approved)",
            salary: "Starting salary: ₹4,00,000 per year\nMid-level salary: ₹10,00,000 per year\nExperienced salary: ₹20,00,000+ per year",
            growth: ["Private Practice", "Head of Department", "Consultant", "Researcher"],
            fitReason: `Your ${archetype} nature helps you connect deeply with others.`
          },
          { 
            title: "Industrial-Organizational Psychologist", 
            summary: "An expert who improves work life and productivity in companies.",
            description: "They apply psychology to the workplace. They help companies hire the right people, train employees, and ensure everyone is motivated and happy at work.", 
            keySkills: ["Data Analysis", "Communication", "Problem Solving", "HR Knowledge"],
            personalityFit: ["Analytical thinkers", "Business-minded people", "Organizers"],
            pathway: "Degree: BA Psychology -> MA in I/O Psychology\nInternships: HR departments, Consulting firms",
            salary: "Starting salary: ₹6,00,000 per year\nMid-level salary: ₹15,00,000 per year\nExperienced salary: ₹30,00,000+ per year",
            growth: ["HR Director", "Management Consultant", "Talent Acquisition Head"],
            fitReason: "Applies your understanding of people to systems."
          },
          { 
            title: "Sports Psychologist", 
            summary: "A coach for the mind who helps athletes perform better.",
            description: "They work with players to build confidence, focus, and handle pressure. They are crucial for athletes to win games mentally before they win physically.", 
            keySkills: ["Motivation", "Observation", "Stress Management", "Communication"],
            personalityFit: ["Sports lovers", "Motivators", "Energetic individuals"],
            pathway: "Degree: BA Psychology -> MA in Sports Psychology\nExperience: Working with sports academies",
            salary: "Starting salary: ₹5,00,000 per year\nMid-level salary: ₹12,00,000 per year\nExperienced salary: ₹25,00,000+ per year",
            growth: ["Team Psychologist", "Performance Coach", "Consultant for Leagues"],
            fitReason: "Great for action-oriented helpers."
          }
        ],
        simulatedTasks: [
          "Listen to a friend describe a problem for 5 minutes without interrupting or giving advice, just understanding.",
          "Observe a group of people in a public place and write down three non-verbal cues you noticed.",
          "Create a plan to help a student who is stressed about exams manage their time better.",
          "Write a journal entry from the perspective of someone completely different from you.",
          "Draft a list of 3 questions to ask someone to understand their career motivation."
        ]
      },
      "Designing": {
        jobs: [
          { 
            title: "UI/UX Designer", 
            summary: "A designer who makes apps and websites easy and fun to use.",
            description: "UX designers research how people use apps. UI designers draw the buttons and screens. Together, they make sure your favorite apps look good and work smoothly.", 
            keySkills: ["Creativity", "Empathy (User Research)", "Visual Design", "Prototyping tools (Figma)", "Logic"],
            personalityFit: ["Tech enthusiasts", "Problem solvers", "Visual thinkers"],
            pathway: "Degree: B.Des (Interaction Design) or B.Tech (CS) + Certification\nExams: UCEED, NID DAT\nPortfolio: Crucial",
            salary: "Starting salary: ₹6,00,000 per year\nMid-level salary: ₹15,00,000 per year\nExperienced salary: ₹30,00,000+ per year",
            growth: ["Product Designer", "Lead Designer", "Product Manager"],
            fitReason: `Perfect for a ${archetype} who loves building digital things.`
          },
          { 
            title: "Sustainable Fashion Designer", 
            summary: "A creator who designs eco-friendly clothes.",
            description: "They design stylish clothes but focus on using natural materials and fair labor. They try to solve the pollution problem in the fashion industry.", 
            keySkills: ["Sketching", "Textile Knowledge", "Creativity", "Sustainability awareness"],
            personalityFit: ["Nature lovers", "Artists", "Innovators"],
            pathway: "Degree: B.Des (Fashion Design)\nExams: NIFT, NID DAT\nFocus: Specialization in sustainable textiles",
            salary: "Starting salary: ₹4,00,000 per year\nMid-level salary: ₹10,00,000 per year\nExperienced salary: ₹20,00,000+ per year",
            growth: ["Brand Owner", "Creative Director", "Sustainability Consultant"],
            fitReason: "Combines creativity with a cause."
          },
          { 
            title: "Game Artist/Designer", 
            summary: "A creative pro who designs the look and rules of video games.",
            description: "Game designers invent the rules and story. Game artists draw the characters and worlds. They work together to create immersive virtual experiences.", 
            keySkills: ["Digital Art", "Storytelling", "3D Modeling", "Imagination"],
            personalityFit: ["Gamers", "Daydreamers", "Storytellers"],
            pathway: "Degree: B.Des (Game Design) or B.Sc Animation\nPortfolio: Concepts and drawings",
            salary: "Starting salary: ₹4,50,000 per year\nMid-level salary: ₹12,00,000 per year\nExperienced salary: ₹25,00,000+ per year",
            growth: ["Lead Level Designer", "Art Director", "Game Producer"],
            fitReason: "The ultimate playground for a creative mind."
          }
        ],
        simulatedTasks: [
          "Sketch three different layout ideas for a poster advertising a school event.",
          "Look at a popular app and list three things that make it frustrating to use.",
          "Pick a household object and redesign it to be easier for an elderly person to hold.",
          "Create a color palette (5 colors) that represents the feeling of 'calmness' or 'energy'.",
          "Draw a storyboard of 3 frames showing a character opening a magic box."
        ]
      }
    };

    return fallbacks[profession] || fallbacks["Designing"];
  }
};

export const evaluateTaskResponses = async (
  profession: string,
  qaPairs: { question: string; answer: string }[]
): Promise<string[]> => {
  const model = "gemini-2.5-flash";
  
  // If no text answers, return empty feedback
  if (qaPairs.length === 0) return [];

  const prompt = `
    Context: A student is simulating tasks for the profession: ${profession}.
    They have provided answers to the following tasks.
    
    Please provide a ONE-LINE constructive and encouraging feedback for each answer.
    If the answer is very short or generic, encourage them to go deeper.
    If the answer is good, praise a specific aspect.
    Keep the tone professional yet friendly (mentor-like).
    
    Tasks and Answers:
    ${JSON.stringify(qaPairs)}

    Response Format:
    Return a JSON object with a key "feedbacks" containing an array of strings. 
    The order must match the input array.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            feedbacks: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    const json = JSON.parse(response.text || "{}");
    return json.feedbacks || Array(qaPairs.length).fill("Good effort! Keep exploring.");
  } catch (e) {
    console.error("Gemini API Error:", e);
    return Array(qaPairs.length).fill("Thanks for submitting! Good attempt.");
  }
};
