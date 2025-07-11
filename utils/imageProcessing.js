import { GoogleGenAI, Type } from "@google/genai";
import { extractTextFromImage } from "expo-text-extractor";

const ai = new GoogleGenAI({ apiKey: `${process.env.EXPO_PUBLIC_GEMINI}` });

const imageProcessing = async (uri) => {
  try {
    const result = await extractTextFromImage(uri);
    console.log(result);
    const aiResponse = await geminiCall(result.join(" "));
    return aiResponse;
  } catch (error) {
    console.log(error, "Error");
  }
};

async function geminiCall(ocrText) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Take this OCR output: ${ocrText}. Recreate this food item, returning a detailed recipe with a title approximating what you think the food item is, a list of ingredients with their metric measurements, a list of steps and a one-sentence summary of 5-6 words.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: {
              type: Type.STRING,
            },
            ingredients: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
            },
            summary: {
              type: Type.STRING,
            },
          },
          propertyOrdering: ["title", "ingredients", "steps", "summary"],
        },
      },
    },
  });
  console.log(JSON.parse(response.candidates[0].content.parts[0].text));
  return response.candidates[0].content.parts[0].text;
}
export default imageProcessing;
