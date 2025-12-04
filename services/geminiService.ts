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

    The goal is to show them that careers are NOT one-dimensional.
    Based on their archetype (who they naturally are) and their interest (what they want to be),
    suggest 3 specific, modern, and distinct job profiles within or related to the field of ${profession}.
    
    For example:
    - If they are a "Creative Thinker" wanting "Law", suggest "IPR Lawyer" or "Legal Journalist".
    - If they are a "Social Communicator" wanting "Designing", suggest "Design Thinking Consultant" or "Creative Director".
    
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
              description: { type: Type.STRING },
              fitReason: { type: Type.STRING, description: "Why this fits their archetype + profession combo" },
            },
            required: ["title", "description", "fitReason"]
          }
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from AI");
    
    return JSON.parse(jsonText) as JobSuggestion[];
  } catch (error) {
    console.error("Gemini API Error:", error);
    
    // Fallback data specific to the 3 paths
    const fallbacks: Record<string, JobSuggestion[]> = {
      "Law": [
        { title: "Corporate Lawyer", description: "Handle complex business transactions, mergers, and compliance.", fitReason: `Matches your interest in Law and ${archetype} skills.` },
        { title: "Judicial Magistrate", description: "Serve as a judge in civil or criminal courts, ensuring justice.", fitReason: "Requires high integrity and logic." },
        { title: "Legal Journalist/Researcher", description: "Report on legal proceedings and analyze judgments for the public.", fitReason: "Combines legal knowledge with communication." }
      ],
      "Psychology": [
        { title: "Clinical Psychologist", description: "Diagnose and treat mental health disorders in clinical settings.", fitReason: `Fits your empathetic nature as a ${archetype}.` },
        { title: "Industrial-Organizational Psychologist", description: "Optimize workplace behavior, hiring, and productivity.", fitReason: "Applies psychology to practical business problems." },
        { title: "Sports Psychologist", description: "Help athletes improve focus, consistency, and performance.", fitReason: "High impact role for motivating others." }
      ],
      "Designing": [
        { title: "UI/UX Designer", description: "Design intuitive digital interfaces for apps and websites.", fitReason: `Perfect for a ${archetype} who loves problem solving.` },
        { title: "Sustainable Fashion Designer", description: "Create eco-friendly clothing lines focusing on responsible production.", fitReason: "Combines creativity with ethical innovation." },
        { title: "Game Designer", description: "Create mechanics, stories, and worlds for video games.", fitReason: "Immersive career for creative builders." }
      ]
    };

    return fallbacks[profession] || [
      {
        title: `${profession} Specialist`,
        description: "A specialized role focusing on technical mastery in this field.",
        fitReason: `Fits your high interest in ${profession}.`
      },
      {
        title: `${profession} Strategist`,
        description: "A role bridging management, strategy, and execution.",
        fitReason: `Good for a ${archetype}.`
      },
      {
        title: `${profession} Consultant`,
        description: "Advisory role focusing on broad industry problems.",
        fitReason: "Combines your skills effectively."
      }
    ];
  }
};