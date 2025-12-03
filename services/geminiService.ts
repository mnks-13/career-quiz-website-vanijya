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
    suggest 3 specific, modern, and distinct job profiles.
    
    For example, if they are a "Creative Thinker" but want to be an "Engineer", suggest "Product Design Engineer" or "UI/UX Engineer".
    If they are a "Social Communicator" who wants to be a "Doctor", suggest "Public Health Director" or "Patient Advocate".
    
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
    // Fallback if API fails
    return [
      {
        title: `${profession} - Specialization A`,
        description: "A specialized role focusing on technical mastery.",
        fitReason: `Fits your high interest in ${profession}.`
      },
      {
        title: `${profession} - Specialization B`,
        description: "A role bridging management and execution.",
        fitReason: `Good for a ${archetype}.`
      },
      {
        title: `${profession} - Consultant`,
        description: "Advisory role focusing on broad strategy.",
        fitReason: "Combines your skills effectively."
      }
    ];
  }
};