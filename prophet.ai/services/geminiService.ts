import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FatePoint, ChartSummary, ConsultationResponse, Language, DetailedReportData } from "../types";
import { ANCIENT_WISDOM, SYSTEM_INSTRUCTION } from "../constants";

// Initialize client with API key directly from import.meta.env for Vite compatibility
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

/**
 * Generates the initial "Fate River" data and Chart Summary based on birth info.
 */
export const generateLifeChart = async (profile: UserProfile, lang: Language): Promise<{ river: FatePoint[], summary: ChartSummary }> => {
  const systemName = profile.system === 'bazi' ? 'Bazi (Four Pillars of Destiny)'
    : profile.system === 'western' ? 'Western Astrology'
      : 'Zi Wei Dou Shu';

  const prompt = `
    Role: Supreme Destiny Calculator.
    Task: Calculate and analyze the destiny for a ${profile.gender} born on ${profile.birthDate} at ${profile.birthTime} using the system: **${systemName}**.
    
    CRITICAL INSTRUCTION: 
    1. Calculate ACTUAL planetary/star positions. Accuracy is absolute.
    2. Response Language: **${lang}**.
    3. **BAZI SPECIFIC**: If the system is Bazi, you MUST calculate the Four Pillars (Year, Month, Day, Hour) based on the Solar Terms (Jie Qi).
    
    Output Requirements:
    1. 'river': Array (ages 0-80). 'luckScore' (0-100). 'event' (specific to ${systemName}).
       - **FIBONACCI RESONANCE**: Ensure that ages 13, 21, 34, 55, and 89 are treated as significant turning points if they align with the chart's flow.
    2. 'summary': 'mainStar', 'element', 'animal', 'description'.
       - **Bazi**: mainStar = Day Master (e.g. "Yang Fire 丙火"), element = Favorable Element (Useful God), animal = Year Branch Animal.
       - **Western**: mainStar = Sun Sign, element = Element of Sun, animal = Ascendant Sign.
       - **Ziwei**: mainStar = Emperor Star (Ziwei) or Major Star in Life Palace.
       - 'systemSpecifics': (Optional) Object containing key details.
          - For Bazi: { "Year Pillar": "Stem/Branch", "Month Pillar": "Stem/Branch", "Day Pillar": "Stem/Branch", "Hour Pillar": "Stem/Branch" }
          - For Western: { "Moon": "Sign", "Mercury": "Sign", "Venus": "Sign", "Mars": "Sign" }

    Return ONLY JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            river: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  age: { type: Type.INTEGER },
                  luckScore: { type: Type.INTEGER },
                  event: { type: Type.STRING },
                  type: { type: Type.STRING, enum: ['career', 'love', 'health', 'wealth'] }
                }
              }
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                mainStar: { type: Type.STRING },
                element: { type: Type.STRING },
                animal: { type: Type.STRING },
                description: { type: Type.STRING },
                systemSpecifics: {
                  type: Type.OBJECT,
                  nullable: true,
                  properties: {
                    "Year Pillar": { type: Type.STRING },
                    "Month Pillar": { type: Type.STRING },
                    "Day Pillar": { type: Type.STRING },
                    "Hour Pillar": { type: Type.STRING },
                    "Moon": { type: Type.STRING },
                    "Mercury": { type: Type.STRING },
                    "Venus": { type: Type.STRING },
                    "Mars": { type: Type.STRING }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No data generated");
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    return {
      river: Array.from({ length: 17 }, (_, i) => ({ age: i * 5, luckScore: 50 + Math.random() * 40 })),
      summary: {
        mainStar: "Unknown",
        element: "Void",
        animal: "Dragon",
        description: "The stars are clouded. Please check API Key."
      }
    };
  }
};

/**
 * Performs the "Five Elders" consultation.
 */
export const consultMasters = async (
  profile: UserProfile,
  age: number,
  luckScore: number,
  lang: Language,
  userQuestion?: string
): Promise<ConsultationResponse[]> => {

  const systemName = profile.system === 'bazi' ? 'Bazi' : profile.system === 'western' ? 'Western Astrology' : 'Zi Wei Dou Shu';
  const isFibonacciAge = [13, 21, 34, 55, 89].includes(age);

  // RAG Context Injection
  const context = JSON.stringify(ANCIENT_WISDOM.filter(w => {
    if (profile.system === 'western') return w.tags.includes('western') || w.tags.includes('general');
    if (profile.system === 'bazi') return w.tags.includes('bazi') || w.tags.includes('general') || !w.tags.includes('western');
    return !w.tags.includes('western');
  }).map(w => `${w.source}: ${w.text}`));

  let roleContext = "";
  if (profile.system === 'bazi') {
    roleContext = `
       **BAZI ROLE MAPPING**:
       1. Authority (Saturn) -> The Officer / Seven Killings (Structure, Career, Pressure).
       2. Karma (Jupiter) -> The Resource (Wisdom, Support, Upbringing).
       3. Fortune (Venus) -> The Wealth (Direct/Indirect Wealth).
       4. Desire (Mars) -> The Companion (Rob Wealth/Friend - Competition).
       5. Calamity (Mercury) -> The Output (Hurting Officer/Eating God - Expression/Rebellion).
     `;
  }

  // Determine if specific advice is needed
  const specificInstruction = userQuestion
    ? `
      *** URGENT PETITION FROM MORTAL ***
      The user has asked a specific question: "${userQuestion}".
      
      INSTRUCTION:
      The Five Elders must IGNORE generic advice. They must specifically address this question using the context of the user's Age (${age}) and Luck Score (${luckScore}).
      
      Examples:
      - If asking about Love, "Desire" (Mars) should be loud, "Authority" (Saturn) should warn of duty.
      - If asking about Money, "Fortune" (Venus) takes lead, "Calamity" (Mercury) warns of risk.
      
      The tone must remain superior and divine, but the content must directly solve the user's specific trouble.
      `
    : "Provide a general verdict on the major themes of this age (Career, Love, Health).";

  const prompt = `
    System: ${systemName}. User: ${profile.name}, Age ${age}, Luck ${luckScore}/100.
    
    ${isFibonacciAge ? "CRITICAL: This is a **FIBONACCI RESONANCE POINT** (" + age + "). This age aligns with the Golden Ratio of life." : ""}

    ${roleContext}
    
    ${specificInstruction}
    
    Using ancient wisdom context: ${context}
    
    Response Language: **${lang}**.
    
    Task: Generate 5 distinct responses from the **Five Elder Stars**.
    Tone: Arrogant, Superior, Absolute, Mystical. They speak down to the user, BUT the advice must be actionable.
    
    Roles:
    1. authority: Power/Career.
    2. karma: Justice/Ethics.
    3. fortune: Wealth/Resources.
    4. desire: Love/Ambition.
    5. calamity: Risk/Danger.

    Return JSON array.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              role: { type: Type.STRING, enum: ['authority', 'karma', 'fortune', 'desire', 'calamity'] },
              content: { type: Type.STRING },
              quote: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  text: { type: Type.STRING }
                },
                nullable: true
              }
            }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No consultation generated");
  } catch (error) {
    console.error("Consultation Error:", error);
    return [];
  }
};

/**
 * Generates a comprehensive detailed report.
 */
export const generateDetailedReport = async (
  profile: UserProfile,
  age: number,
  lang: Language
): Promise<DetailedReportData> => {

  const systemName = profile.system;

  const prompt = `
    Act as a Wise Mentor translating the Five Elders' decree.
    Generate a "Fate Verdict Dossier" for ${profile.name} (Age ${age}).
    
    OUTPUT LANGUAGE: **${lang}**.
    
    CRITICAL INSTRUCTION FOR CONTENT QUALITY:
    1. **CONVERSATIONAL & CLEAR**: The tone should be warm, wise, and approachable—like a master speaking to a student (or a modern analyst explaining data). DO NOT use the "classified government document" style for the text body. Use "You" and speak directly to the user.
    2. **SIMPLIFY TERMINOLOGY**: Explain Bazi/Astrology terms immediately (e.g., "Your Day Master is Yang Fire, which means you are passionate...").
    3. **3X RICHNESS**: Do not be brief. Each 'aspect' description must be at least 3-4 sentences long, covering:
       - The Current State (What is happening).
       - The Hidden Risk (What to watch out for).
       - The Actionable Strategy (What to do).
    4. **SPECIFICITY**: Use the data from the ${systemName} system to provide specific details.

    Structure:
    1. 'aspects': 5 aspects (Power/Career, Wealth/Resources, Desire/Love, Constitution/Health, Spirit/Mind).
       - Key: aspect identifier.
       - Label: Translated name.
       - Score: 0-100.
       - Description: Long, detailed, conversational analysis.
    2. 'lucky': 
       - Colors: 2-3 lucky colors.
       - Numbers: 2-3 lucky numbers.
       - Direction: Best direction for energy.
    3. 'advice': A final, synthesizing paragraph of guidance.
    
    Tone: **Conversational, Helpful, Deep, Analytical.**
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            aspects: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  label: { type: Type.STRING },
                  score: { type: Type.INTEGER },
                  description: { type: Type.STRING }
                }
              }
            },
            lucky: {
              type: Type.OBJECT,
              properties: {
                colors: { type: Type.ARRAY, items: { type: Type.STRING } },
                numbers: { type: Type.ARRAY, items: { type: Type.STRING } },
                direction: { type: Type.STRING }
              }
            },
            advice: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No report generated");
  } catch (error) {
    console.error("Report Generation Error:", error);
    return {
      aspects: [],
      lucky: { colors: [], numbers: [], direction: "Unknown" },
      advice: "Signal lost."
    };
  }
};