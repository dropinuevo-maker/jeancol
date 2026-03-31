import { GoogleGenAI } from "@google/genai";

export const generateAIDescription = async (productName: string, brand: string = 'JEANCOL') => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una descripción persuasiva y profesional para un producto de moda llamado "${productName}" de la marca "${brand}". Incluye beneficios y estilo. Máximo 150 palabras.`,
    });
    return response.text || '';
  } catch (err) {
    console.error('Error generating AI description:', err);
    return '';
  }
};

export const generateAIFeatures = async (productName: string, category: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera una lista de 5 características técnicas y de estilo para un producto llamado "${productName}" en la categoría "${category}". Devuelve solo los puntos separados por saltos de línea.`,
    });
    return response.text?.split('\n').filter(line => line.trim()) || [];
  } catch (err) {
    console.error('Error generating AI features:', err);
    return [];
  }
};

export const generateVariations = (colors: string[], sizes: string[], basePrice: number) => {
  const variations = [];
  for (const color of colors) {
    for (const size of sizes) {
      variations.push({
        id: Math.random().toString(36).substr(2, 9),
        color,
        size,
        stock: 10,
        price: basePrice,
        sku: `${color.substring(0, 3).toUpperCase()}-${size}-${Math.floor(Math.random() * 1000)}`
      });
    }
  }
  return variations;
};
