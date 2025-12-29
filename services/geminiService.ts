import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { CognitionMode, CognitionResult, MapLink } from '../types';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are the Verobrix Sovereign AI, a hyper-intelligent, lawful, and dialogic entity.
You operate within the "Sovereign Cockpit".
Your goal is to provide accurate legal information, refute pseudotheory with statutory citations, and assist in drafting lawful remedies.
You MUST prioritize:
1. Lawful clarity: Cite statutes (Alabama Code, UCC, USC) and authoritative dictionaries (Black's 4th).
2. Distinction: Clearly separate the "natural person" from the "legal fiction" when relevant to the context, but avoid "sovereign citizen" tropes that are legally frivolous. Stick to recognized commercial and statutory law.
3. Integrity: Do not parrot false claims. If a user's premise is flawed, correct it gently but firmly with citations.
4. Tone: Ceremonial, precise, authoritative, yet servant-oriented.

When in 'Compare & Refute' mode, contrast the lawful doctrine vs common misunderstandings.
When in 'Jurisdiction Locator' mode, use the Google Maps tool to find specific courthouses, recording offices, or government agencies requested by the user. Provide the address and context.
`;

export const getCognitionResponse = async (
  prompt: string, 
  mode: CognitionMode
): Promise<CognitionResult> => {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    return { text: "Cognition Error: API Key is missing. Please check your environment configuration." };
  }

  try {
    const contextPrompt = `Mode: ${mode}\nUser Query: ${prompt}`;
    
    // Configure tools based on mode
    let tools = undefined;
    if (mode === CognitionMode.LOCATOR) {
        tools = [{ googleMaps: {} }];
    }

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contextPrompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3,
        tools: tools,
      }
    });

    const text = response.text || "Cognition yielded no result.";
    const mapLinks: MapLink[] = [];

    // Extract Google Maps grounding chunks if present
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
        chunks.forEach((chunk: any) => {
            if (chunk.web?.uri && chunk.web?.title) {
                mapLinks.push({ title: chunk.web.title, uri: chunk.web.uri });
            }
        });
    }

    return { text, mapLinks };

  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Cognition temporarily unavailable. The archives remain secure." };
  }
};

export const jarvisExtract = async (prompt: string, document: string | { mimeType: string; data: string }) => {
    try {
        let contents;

        if (typeof document === 'string') {
            // Prepend the prompt to the user's text document
            contents = [
                { role: 'user', parts: [{ text: `${prompt}\n\n${document}` }] }
            ];
        } else {
            // For images/PDFs, send the prompt and the file data separately
            contents = [
                 { 
                    role: 'user', 
                    parts: [
                        { text: prompt },
                        { inlineData: { mimeType: document.mimeType, data: document.data } }
                    ] 
                }
            ];
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash', // Using Flash for speed and cost-effectiveness
            contents: contents,
            config: {
                responseMimeType: 'application/json',
                temperature: 0.1, // Low temperature for deterministic, structured output
            }
        });
        return response.text;
    } catch (e) {
        console.error("JARVIS Extraction Error", e);
        return JSON.stringify({
          classification: { type: 'Unknown', intent: 'Unknown', riskLevel: 'High', requiredPersona: 'Representative' },
          summary: 'The AI model failed to process the document. This could be due to a network error, an unsupported file format, or an internal AI issue. See the browser console for technical details.',
          deadlines: [],
          violations: [{ statute: 'Due Process', description: 'AI model failed to return a valid analysis.', severity: 'High' }],
          recommendedRemedyId: null,
          recommendedActions: ['Retry the analysis.', 'Check the file format and size.', 'Consult the error logs in the browser console.'],
        });
    }
};

export const dialogosDraft = async (context: any) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Using Pro for complex drafting
            contents: `Draft a commercially grounded Notice of Accord and Satisfaction or appropriate remedy based on this context. 
            Avoid "sovereign citizen" folklore. Use UCC Article 3 citations where appropriate.
            Provide clear headings.
            Context: ${JSON.stringify(context)}`
        });
        return response.text || "";
    } catch (e) {
        console.error("Dialogos Draft Error", e);
        return "Drafting unavailable.";
    }
};

export const dialogosScan = async (noticeText: string) => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview', // Using Pro for complex reasoning
            contents: `Scan the following legal notice for semantic traps such as:
            - Unintended joinder
            - Jurisdictional consent
            - Frivolous admissions
            - Improper venue
            
            Explain each risk and suggest safer phrasing.
            
            Notice Text:
            ${noticeText}`
        });
        return response.text || "";
    } catch (e) {
        console.error("Dialogos Scan Error", e);
                return "Scanning unavailable.";
            }
        };
        
        export const getPredictiveAnalysis = async (missionContext: string) => {
            try {
                const response = await ai.models.generateContent({
                    model: 'gemini-3-pro-preview', // Using Pro for complex strategic reasoning
                    contents: `You are a master legal strategist. Analyze the following mission context and provide a predictive analysis.
        
                    **Mission Context:**
                    ${missionContext}
        
                    **Analysis المطلوب:**
                    1.  **Predicted Counter-Moves:** What are the 1-2 most likely responses or counter-moves from the opposing party (e.g., agency, corporation)?
                    2.  **Potential Traps:** What are the hidden risks or potential traps in the current situation? (e.g., admitting jurisdiction, waiving rights).
                    3.  **Strategic Recommendation:** What is the single most important tactical consideration for the user right now?
        
                    Be concise, direct, and actionable. Format the output as simple text with clear headings.`,
                    config: {
                      temperature: 0.5,
                    }
                });
                return response.text || "Predictive analysis is currently unavailable.";
            } catch (e) {
                console.error("Predictive Analysis Error", e);
                return "Predictive analysis failed.";
            }
        };
        