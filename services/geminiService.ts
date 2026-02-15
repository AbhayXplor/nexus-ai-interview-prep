
import { GoogleGenAI } from "@google/genai";

// Analyze the interview session
export const getDeepAnalysis = async (code: string, transcript: string, context: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: `Analyze this technical interview session. 
    Candidate Context (Research Data): ${context}
    
    Current Code Implementation:
    ${code}
    
    Full Interview Transcript:
    ${transcript}
    
    Provide a detailed critique of the candidate's technical skills, communication clarity, and alignment with their stated background. Specifically, mention if they demonstrated the same level of expertise seen in their public GitHub projects.`,
  });
  return response.text || "Analysis could not be generated at this time.";
};

/**
 * Research the candidate's professional profiles.
 * This function uses real-time search grounding to fetch actual repository and profile data.
 */
export const researchCandidate = async (linkedInUrl: string, githubUrl: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an elite technical headhunter. I have two links for a candidate:
      LinkedIn: ${linkedInUrl}
      GitHub: ${githubUrl}
      
      CRITICAL INSTRUCTIONS:
      1. Use Google Search to visit these specific URLs.
      2. From GitHub: List 3-5 specific repository names and the primary languages/frameworks used in each. Note any interesting architecture choices or complex logic found in the code.
      3. From LinkedIn: Identify their current role, major achievements, and any mentions of university (e.g., PES University).
      4. Synthesize a "Candidate Profile" that a senior engineer can use to grill them on their OWN work.
      
      Format your response as a structured dossier. If search results for the specific URLs are limited, find the most relevant public technical footprint for this user handle.`,
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
    
    if (error?.status === 403 || error?.message?.includes('403')) {
      return {
        text: `Search Grounding Permission Denied. I will use the provided links as the base context:
        - LinkedIn: ${linkedInUrl}
        - GitHub: ${githubUrl}
        I will assume the candidate has strong experience in the tech stacks typically associated with these profiles (e.g., MERN, ML, etc.) and is a student at PES University.`,
        sources: []
      };
    }
    
    return {
      text: "Research engine encountered a timeout. Proceeding with user-provided metadata.",
      sources: []
    };
  }
};

// Static code analysis
export const runStaticAnalysis = async (code: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Perform a senior-level code review on the following snippet. Highlight bugs, performance bottlenecks, and security concerns. Contrast this with industry-standard patterns for Junior SDE roles:
    ${code}`,
  });
  return response.text || "No analysis available.";
};

// Technical documentation search
export const searchTechnicalDocs = async (query: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Find high-quality technical documentation and implementation patterns for: ${query}`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });
  
  let result = response.text || 'No documentation found.';
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
