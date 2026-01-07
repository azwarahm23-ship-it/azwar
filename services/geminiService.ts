
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeExamResults = async (score: number, total: number, examTitle: string) => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Berikan feedback singkat dan motivasi dalam Bahasa Indonesia untuk siswa yang mendapatkan nilai ${score} dari ${total} pada ujian "${examTitle}".`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    return response.text || "Tetap semangat belajar!";
  } catch (error) {
    console.error("AI Analysis failed:", error);
    return "Analisis AI tidak tersedia saat ini. Bagus sekali sudah menyelesaikan ujian!";
  }
};
