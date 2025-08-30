
import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    predictions: {
      type: Type.ARRAY,
      description: "An array of possible classifications, sorted by confidence from high to low.",
      items: {
        type: Type.OBJECT,
        properties: {
          class: { type: Type.STRING, description: "The predicted medical condition (e.g., 'Pneumonia', 'Normal', 'Cardiomegaly')." },
          confidence: { type: Type.NUMBER, description: "The model's confidence score from 0.0 to 1.0." }
        }
      }
    },
    gradCam: {
      type: Type.OBJECT,
      description: "Details for visualizing the model's attention.",
      properties: {
        explanation: { type: Type.STRING, description: "A brief, user-friendly explanation of what the model focused on in the image." },
        focusArea: {
          type: Type.OBJECT,
          description: "A bounding box for the primary area of interest as percentages of image dimensions (e.g., top: 25, left: 40, width: 30, height: 30).",
          properties: {
            top: { type: Type.NUMBER },
            left: { type: Type.NUMBER },
            width: { type: Type.NUMBER },
            height: { type: Type.NUMBER }
          }
        }
      }
    }
  }
};

export const generateClassification = async (base64Image: string): Promise<PredictionResult> => {
    const prompt = `
        You are a sophisticated medical imaging AI. Analyze this medical scan (e.g., X-ray, MRI) and provide a multi-class classification. 
        Your primary goal is to identify potential abnormalities.
        1.  Provide a list of the top 3 most likely conditions, with confidence scores. The highest confidence should be first.
        2.  Generate a Grad-CAM explanation, including a textual summary and a bounding box for the most relevant region that influenced your top prediction.
        3.  The bounding box coordinates (top, left, width, height) must be percentages of the image's dimensions.
        4.  Ensure the output is a valid JSON object matching the provided schema.
    `;
    
    const imagePart = {
        inlineData: {
            mimeType: 'image/jpeg',
            data: base64Image,
        },
    };

    const textPart = { text: prompt };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        });

        const jsonString = response.text.trim();
        const parsedResult = JSON.parse(jsonString);
        
        // Basic validation
        if (!parsedResult.predictions || !parsedResult.gradCam) {
            throw new Error("Invalid response structure from AI.");
        }
        
        return parsedResult as PredictionResult;
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to generate classification from the AI model.");
    }
};
