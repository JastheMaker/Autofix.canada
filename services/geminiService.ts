
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { ServiceType } from "../types";

// Helper for image processing
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Diagnostique un problème de voiture et recommande un ServiceType
 * Utilise gemini-3-flash-preview pour l'analyse de texte et la sortie JSON structurée.
 */
export const diagnoseCarIssue = async (description: string): Promise<{ suggestion: string, service: ServiceType | null }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Tu es un assistant expert en mécanique automobile. Analyse le problème suivant : "${description}". 
    Propose un diagnostic rapide et recommande le type de service le plus adapté parmi cette liste de valeurs exactes : ${Object.values(ServiceType).join(', ')}.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestion: {
            type: Type.STRING,
            description: "Explication concise du problème potentiel en français.",
          },
          service: {
            type: Type.STRING,
            description: "La valeur exacte du ServiceType recommandé (ex: 'Vidange', 'Freins', etc.) ou null.",
          },
        },
        required: ["suggestion", "service"],
      },
    },
  });

  try {
    const data = JSON.parse(response.text || '{}');
    // Map string value back to ServiceType enum
    const recommendedService = Object.values(ServiceType).find(s => s === data.service) || null;
    
    return {
      suggestion: data.suggestion || "Désolé, je ne parviens pas à analyser ce problème précisément.",
      service: recommendedService as ServiceType | null
    };
  } catch (error) {
    console.error("Gemini parse error:", error);
    return {
      suggestion: "Une erreur est survenue lors du diagnostic.",
      service: null
    };
  }
};

export const searchGroundingDiagnostic = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Donne des conseils mécaniques récents pour : ${query}. Si pertinent, mentionne des rappels de sécurité ou des technologies nouvelles.`,
    config: {
      tools: [{ googleSearch: {} }]
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const findNearbyGarages = async (lat: number, lng: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: "Trouve les garages spécialisés et stations services les plus proches.",
    config: {
      tools: [{ googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: { latitude: lat, longitude: lng }
        }
      }
    }
  });
  return {
    text: response.text,
    sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
  };
};

export const editCarImage = async (imageB64: string, prompt: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: imageB64, mimeType: 'image/jpeg' } },
        { text: prompt }
      ]
    }
  });
  
  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  }
  return null;
};

export const generateRepairVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9') => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio
    }
  });

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    operation = await ai.operations.getVideosOperation({ operation: operation });
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};
