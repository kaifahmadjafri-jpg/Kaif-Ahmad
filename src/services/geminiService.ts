import { GoogleGenAI } from "@google/genai";
import { SolarSystemConfig, CalculationResults } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getSolarAdvice = async (config: SolarSystemConfig, results: CalculationResults) => {
  const prompt = `
    You are an expert Solar Advisor. Based on the following user details and calculated results, provide smart suggestions.
    
    User Details:
    - Name: ${config.name}
    - Monthly Bill: ₹${config.monthlyBill}
    - Available Space: ${config.availableSpace} sq ft
    - Location: ${config.location}
    
    Calculated Results:
    - Recommended Capacity: ${results.recommendedCapacity} kW
    - Estimated Panels: ${results.estimatedPanels}
    - Required Area: ${results.requiredArea} sq ft
    - Estimated Cost: ₹${results.estimatedCost}
    - Monthly Savings: ₹${results.monthlySavings}
    - ROI: ${results.roiYears.toFixed(1)} years
    
    Please provide brief, smart suggestions:
    1. Best solar panel types.
    2. Top 3 brands in India.
    3. 3 critical questions for installers.
    4. Tips to save more.
    
    Format the response in clear Markdown with headings. Use a friendly, professional tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I'm sorry, I couldn't generate personalized advice right now. Please try again later.";
  }
};
