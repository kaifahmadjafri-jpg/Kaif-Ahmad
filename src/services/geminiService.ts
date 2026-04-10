import { GoogleGenAI } from "@google/genai";
import { SolarSystemConfig, CalculationResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getSolarAdvice = async (config: SolarSystemConfig, results: CalculationResults) => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined");
    return "AI Advisor is currently unavailable (API Key missing). Please try again later.";
  }

  const prompt = `
    You are an expert Solar Advisor. Based on the following user details and calculated results, provide smart suggestions.
    
    User Details:
    - Name: ${config?.name ?? 'Unknown'}
    - Monthly Bill: ₹${config?.monthlyBill ?? 0}
    - Available Space: ${config?.availableSpace ?? 0} sq ft
    - Location: ${config?.location ?? 'Unknown'}
    
    Calculated Results:
    - Recommended Capacity: ${results?.recommendedCapacity ?? 0} kW
    - Estimated Panels: ${results?.estimatedPanels ?? 0}
    - Required Area: ${results?.requiredArea ?? 0} sq ft
    - Estimated Cost: ₹${results?.estimatedCost ?? 0}
    - Monthly Savings: ₹${results?.monthlySavings ?? 0}
    - ROI: ${results?.roiYears?.toFixed(1) ?? 0} years
    
    Please provide brief, smart suggestions in exactly 4 sections:
    1. **Panel Types**: Best tech for this specific capacity.
    2. **Top Brands**: 3 reliable brands in India.
    3. **Installer Checklist**: 3 critical questions.
    4. **Savings Tips**: How to maximize ROI.
    
    Keep it extremely concise and punchy. Use bullet points.
    
    Format the response in clear Markdown with headings. Use a friendly, professional tone.
  `;

  try {
    const responsePromise = ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Timeout")), 60000)
    );

    const response = await Promise.race([responsePromise, timeoutPromise]) as any;
    
    if (!response || !response.text) {
      throw new Error("Empty response from Gemini");
    }
    
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (error instanceof Error && error.message === "Timeout") {
      return "The AI Advisor is taking too long to respond. Please check your connection and try again.";
    }
    return "I'm sorry, I couldn't generate personalized advice right now. Please try again later.";
  }
};
