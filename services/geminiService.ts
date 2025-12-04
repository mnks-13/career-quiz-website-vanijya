
import { GoogleGenAI, Type } from "@google/genai";
import { Archetype, Profession, JobSuggestion } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getCareerInsights = async (
  archetype: Archetype,
  profession: Profession,
  matchScore: number
): Promise<JobSuggestion[]> => {
  const model = "gemini-2.5-flash";

  const prompt = `
    The user is a student exploring careers.
    
    Their General Skill Archetype is: ${archetype}.
    Their Interest Profession is: ${profession}.
    Their Aptitude Match Score for that profession is: ${matchScore}%.

    Create 3 specific, modern, and distinct job profiles within or related to the field of ${profession} for this student.
    
    For each job profile, return a JSON object adhering strictly to the following content template:

    1. Job Title (JSON key: title)
    Write the name of the profession clearly.

    2. One-Sentence Summary (JSON key: summary)
    Explain what this job is in 1–2 simple sentences.

    3. What This Career Involves (Detailed Description) (JSON key: description)
    Write a short paragraph explaining what people in this career do on a daily basis.
    Keep it simple and interesting. Avoid long or technical sentences.

    4. Key Skills Required (JSON key: keySkills)
    Provide 5–7 bullet points (as an array of strings) of the most important skills needed for this career.

    5. Personality Fit (Who Will Enjoy This Career?) (JSON key: personalityFit)
    Provide 3–5 bullet points (as an array of strings) describing the type of person who naturally enjoys or fits well in this career.

    6. Pathway to Enter This Career (Especially in India) (JSON key: pathway)
    Explain the entry path in clear steps: Subjects to study in classes 11–12, Degrees needed, Important entrance exams (if any), Internships or experience recommended. Return as a single string with newlines.

    7. Average Salary in India (JSON key: salary)
    Give realistic salary ranges in this exact format (return as a single string with newlines):
    Starting salary: ₹____ per year
    Mid-level salary: ₹____ per year
    Experienced salary: ₹____ per year

    8. Growth Opportunities (JSON key: growth)
    Provide 4–6 bullet points (as an array of strings) explaining how a person can grow in this career (specializations, senior roles, freelance, etc.)

    9. Why This Career Might Fit You (JSON key: fitReason)
    Write a short, friendly paragraph explaining why a student might be a good fit, based on their archetype (${archetype}). Do not force or pressure the reader.

    Use simple, clear English (8th–10th grade level).
    Keep paragraphs short.
    Make the content encouraging and easy to understand.
    Do not exaggerate salaries.
    
    Return EXACTLY 3 suggestions.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
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
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as JobSuggestion[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback data structure updated to match new interface
    const fallbacks: Record<string, JobSuggestion[]> = {
      "Law": [
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
      "Psychology": [
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
      "Designing": [
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
      ]
    };

    return fallbacks[profession] || fallbacks["Designing"];
  }
};
