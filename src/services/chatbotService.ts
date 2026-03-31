import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getChatbotResponse = async (userMessage: string, products: Product[]) => {
  try {
    const model = "gemini-3-flash-preview";
    
    // Create a context with product information
    const productContext = products.map(p => ({
      name: p.name,
      price: p.price,
      description: p.description,
      category: p.category,
      stock: p.stock,
      features: p.features?.map(f => `${f.name}: ${f.value}`).join(", ")
    }));

    const systemInstruction = `
      Eres un asistente virtual experto para una tienda de moda y tecnología llamada "Jeancol Professional".
      Tu objetivo es ayudar a los clientes con preguntas sobre los productos disponibles.
      
      Aquí tienes la lista de productos actuales:
      ${JSON.stringify(productContext, null, 2)}
      
      Instrucciones:
      1. Responde de manera amable, profesional y concisa.
      2. Si el usuario pregunta por un producto específico, usa la información proporcionada para responder.
      3. Si no encuentras información sobre un producto, dile amablemente que no lo tenemos en inventario por ahora pero que puede ver nuestras categorías.
      4. No inventes precios ni características que no estén en la lista.
      5. Siempre intenta guiar al usuario hacia la compra o a ver más detalles en la web.
      6. Responde en el mismo idioma que el usuario (español por defecto).
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Error in chatbot service:", error);
    return "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento. ¿Podrías intentarlo de nuevo más tarde?";
  }
};
