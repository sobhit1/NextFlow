import { task } from "@trigger.dev/sdk/v3";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const runLlmTask = task({
  id: "llm-execution",
  run: async (payload: {
    systemPrompt?: string;
    userMessage: string;
    images?: { mimeType: string; data: string }[];
    model: string;
  }) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY is not set");

    const genAI = new GoogleGenerativeAI(apiKey);
    const useModel = payload.model || "gemini-2.5-flash";
    const model = genAI.getGenerativeModel({ model: useModel });

    let contents: any[] = [];
    
    // Add images if provided
    if (payload.images && payload.images.length > 0) {
      const parts = payload.images.map(img => ({
        inlineData: {
          data: img.data, // Should be base64
          mimeType: img.mimeType,
        }
      }));
      contents.push({ text: payload.userMessage }, ...parts);
    } else {
      contents.push({ text: payload.userMessage });
    }

    const generateContentReq: any = {
      contents: [{ role: "user", parts: contents }],
    };

    if (payload.systemPrompt) {
      generateContentReq.systemInstruction = {
        parts: [{ text: payload.systemPrompt }],
        role: "system",
      };
    }

    const result = await model.generateContent(generateContentReq);
    const text = result.response.text();

    return { success: true, text };
  },
});
