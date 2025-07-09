import { GoogleGenAI, Type } from "@google/genai";
import TextRecognition from "react-native-text-recognition";

const ai = new GoogleGenAI({ apiKey: `${process.env.EXPO_PUBLIC_GEMINI}` });

const imageProcessing = async (uri) => {
  try {
    const result = await TextRecognition.recognize(uri);
    console.log(result);
    const aiResponse = await geminiCall(result[0]);
    return aiResponse;
  } catch (error) {
    console.log(error, "Error");
  }
};

async function geminiCall(ocrText) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Take this OCR output: ${ocrText}. Return a detailed recipe with a title, a list of ingredients, and a numbered list of steps`,
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
          },
          propertyOrdering: ["title", "ingredients", "steps"],
        },
      },
    },
  });
  console.log(JSON.parse(response.candidates[0].content.parts[0].text));
  return JSON.parse(response.candidates[0].content.parts[0].text);
}
export default imageProcessing;
