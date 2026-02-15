
import { GoogleGenAI } from "@google/genai";

// Analyze the interview session
export const getDeepAnalysis = async (code: string, transcript: string, context: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this technical interview session. 
    Candidate Context (Research Data): ${context}
    
    Current Code Implementation:
    ${code}
    
    Full Interview Transcript:
    ${transcript}
    
    Provide a detailed critique of the candidate's technical skills, communication clarity, and alignment with their stated background.`,
  });
  return response.text;
};

/**
 * Research the candidate's professional profiles.
 * If search grounding fails (e.g., 403 Permission Denied), fallback to a generic summary 
 * to ensure the app flow isn't broken.
 */
export const researchCandidate = async (linkedInUrl: string, githubUrl: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform professional research for this candidate using public data.
      LinkedIn: ${linkedInUrl}
      GitHub: ${githubUrl}
      
      Summarize:
      1. Career highlights and current role.
      2. Notable GitHub repositories and tech stacks.
      3. Potential deep-dive project questions.
      
      Format as a concise dossier for a lead interviewer.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Summary unavailable.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    return {
      text,
      sources: chunks
        .filter((c: any) => c.web)
        .map((c: any) => ({
          title: c.web.title || c.web.uri,
          uri: c.web.uri
        }))
    };
  } catch (error: any) {
    console.warn("Search grounding failed, proceeding with restricted context.", error);
    
    // Check for specific permission issues
    if (error?.status === 403 || error?.message?.includes('403')) {
      return {
        text: `Search Grounding Permission Denied. Proceeding with user-provided links:
        - LinkedIn: ${linkedInUrl}
        - GitHub: ${githubUrl}
        Note: Deep profile synthesis was bypassed due to API restrictions.`,
        sources: []
      };
    }
    
    throw error; // Re-throw if it's a different kind of error
  }
};

// Static code analysis
export const runStaticAnalysis = async (code: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a senior-level code review on the following snippet. Highlight bugs, performance bottlenecks, and security concerns:
    ${code}`,
  });
  return response.text;
};

// Technical documentation search
export const searchTechnicalDocs = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find high-quality technical documentation and implementation patterns for: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  let result = response.text || '';
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (chunks && chunks.length > 0) {
    result += '\n\nSources:';
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri) {
        result += `\n- ${chunk.web.title || chunk.web.uri}: ${chunk.web.uri}`;
      }
    });
  }
  
  return result;
};
