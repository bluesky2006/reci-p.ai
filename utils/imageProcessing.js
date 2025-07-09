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
    contents: `Tell me what you see: ${ocrText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            response: {
              type: Type.STRING,
            },
          },
          propertyOrdering: ["response"],
        },
      },
    },
  });

  return response.text;
}

export default imageProcessing;
