
import { GoogleGenAI } from "@google/genai";

// Fix: Always use the named parameter and process.env.API_KEY directly for initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const enhancePostContent = async (content: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a professional software engineer editor. Take the following raw thought/post from a developer and format it nicely using markdown/code blocks if needed, but keep it brief. Make it sound like a hacker's field notes. Content: "${content}"`,
      config: {
        temperature: 0.7,
        // Fix: When using maxOutputTokens, you must also provide a thinkingBudget for Gemini 3 series models
        maxOutputTokens: 500,
        thinkingConfig: { thinkingBudget: 200 }
      }
    });
    // Fix: Access .text as a property, not a method call
    return response.text || content;
  } catch (error) {
    console.error("Gemini Error:", error);
    return content;
  }
};

export const getCoffeeFact = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: "Tell me one short, interesting fact about coffee history or brewing, suitable for a programmer.",
      config: { 
        temperature: 1,
        // Fix: Optionally disable thinking for simple tasks to improve response speed
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    // Fix: Access .text as a property
    return response.text || "Espresso yourself.";
  } catch {
    return "Coffee is the fuel for algorithms.";
  }
};
