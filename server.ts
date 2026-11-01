import express from "express";
import http from "http";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, Modality, ThinkingLevel, LiveServerMessage } from "@google/genai";
import { WebSocketServer, WebSocket } from "ws";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function runWithRetries(operation: () => Promise<any>, maxRetries = 4) {
  let retries = maxRetries;
  while (retries > 0) {
    try {
      return await operation();
    } catch (err: any) {
      console.error(`Gemini API Error (retries left: ${retries - 1}):`, err?.message || err);
      retries--;
      if (retries === 0) throw err;

      let delayMs = 4000;
      const retryMatch = err?.message?.match(/retry in (\d+(?:\.\d+)?)s/);
      if (retryMatch && retryMatch[1]) {
        delayMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1500;
      } else if (err?.message?.includes("503") || err?.status === "UNAVAILABLE") {
        delayMs = (maxRetries - retries) * 4000 + 3000;
      }
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
}

interface ExtractedGroundingLink {
  uri: string;
  title: string;
  type: "web" | "maps";
  snippets?: string[];
}

function extractGroundingLinks(response: any): ExtractedGroundingLink[] {
  const chunks = response?.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const links: ExtractedGroundingLink[] = [];
  const seen = new Set<string>();

  for (const chunk of chunks) {
    if (chunk?.web?.uri && !seen.has(chunk.web.uri)) {
      seen.add(chunk.web.uri);
      links.push({
        uri: chunk.web.uri,
        title: chunk.web.title || chunk.web.uri,
        type: "web",
      });
    }
    if (chunk?.maps?.uri && !seen.has(chunk.maps.uri)) {
      seen.add(chunk.maps.uri);
      const reviewSnippets: string[] = [];
      const answerSources = chunk.maps.placeAnswerSources;
      if (answerSources?.reviewSnippets && Array.isArray(answerSources.reviewSnippets)) {
        for (const snippet of answerSources.reviewSnippets) {
          const text = snippet?.text || snippet?.reviewText || snippet?.snippet;
          if (text && typeof text === "string") {
            reviewSnippets.push(text);
          }
        }
      }
      links.push({
        uri: chunk.maps.uri,
        title: chunk.maps.title || "View on Google Maps",
        type: "maps",
        snippets: reviewSnippets.length > 0 ? reviewSnippets : undefined,
      });
    }
  }

  return links;
}

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: "50mb" }));

  // API Route: Analyze FIR
  app.post("/api/analyze-fir", async (req, res) => {
    try {
      const { firText, inlineData, language } = req.body;
      const targetLang = language || "English";

      if (!firText && !inlineData) {
        return res.status(400).json({ error: "Invalid or missing firText or inlineData" });
      }

      const ai = getAIClient();

      const parts: any[] = [];
      if (firText) {
        parts.push({
          text: `Analyze the following sanitized FIR text or document.\n\nExtract severe stress words into relevant categories (e.g., Violence, Weapons, Medical Emergency, Vulnerable Person). Provide a brief, 1-sentence objective summary of the incident. Determine the overall threat level (LOW, MEDIUM, HIGH, or CRITICAL). Also extract the chronological timeline of events and the Indian jurisdiction location details (State, District, Police Station, and approximate latitude/longitude coordinates in India for geographic crime mapping).\n\nFIR Text/Context:\n${firText}`,
        });
      } else {
        parts.push({
          text: `Analyze the attached FIR document.\n\nExtract severe stress words into relevant categories (e.g., Violence, Weapons, Medical Emergency, Vulnerable Person). Provide a brief, 1-sentence objective summary of the incident. Determine the overall threat level (LOW, MEDIUM, HIGH, or CRITICAL). Also extract the chronological timeline of events and the Indian jurisdiction location details (State, District, Police Station, and approximate latitude/longitude coordinates in India for geographic crime mapping).`,
        });
      }

      if (inlineData) {
        parts.push({ inlineData });
      }

      const response = await runWithRetries(() =>
        ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: { parts },
          config: {
            systemInstruction: `You are an expert law enforcement forensic text analyzer built for the Indian Judiciary system. Your sole purpose is to analyze First Information Reports (FIRs) and extract explicit indicators of danger, violence, or medical emergencies, and provide investigative predictions and recommended acts based on the Bharatiya Nyaya Sanhita (BNS).\n\nStrict Rules:\n1. Be entirely objective.\n2. Do not infer context not written, except when estimating standard Indian city/district latitude & longitude coordinates for the identified jurisdiction.\n3. Recommend exact BNS Acts clearly.\n4. Output the readable text fields in ${targetLang}.`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                stressWords: {
                  type: Type.ARRAY,
                  description: "Exact words or short phrases from the text indicating distress, violence, or danger.",
                  items: { type: Type.STRING },
                },
                threatLevel: {
                  type: Type.STRING,
                  description: "The assessed priority level of the FIR.",
                  enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"],
                },
                confidenceScore: {
                  type: Type.INTEGER,
                  description: "Confidence in the threat level assessment (0-100).",
                },
                investigativeSteps: {
                  type: Type.ARRAY,
                  description: "Recommended immediate steps for investigation based on the FIR context.",
                  items: { type: Type.STRING },
                },
                expectedOutcomes: {
                  type: Type.ARRAY,
                  description: "Potential expected outcomes or actionable follow-ups.",
                  items: { type: Type.STRING },
                },
                recommendedActs: {
                  type: Type.ARRAY,
                  description: "Recommended charges/acts under the Bharatiya Nyaya Sanhita (BNS) or other relevant Indian laws.",
                  items: { type: Type.STRING },
                },
                categories: {
                  type: Type.ARRAY,
                  description: "The types of emergencies identified (e.g., Medical, Violence, Threat).",
                  items: { type: Type.STRING },
                },
                categoryScores: {
                  type: Type.ARRAY,
                  description: "Relevance score (0-100) for standard crime categories to use in radar chart visualization.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      score: { type: Type.INTEGER },
                    },
                    required: ["category", "score"],
                  },
                },
                summary: {
                  type: Type.STRING,
                  description: "A single, highly objective sentence summarizing the incident.",
                },
                timeline: {
                  type: Type.ARRAY,
                  description: "Chronological sequence of events extracted from the FIR text.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timestamp: { type: Type.STRING, description: "Approximate time/date of the event" },
                      description: { type: Type.STRING, description: "Description of the event" },
                    },
                    required: ["timestamp", "description"],
                  },
                },
                locationDetails: {
                  type: Type.OBJECT,
                  description: "Location where the incident occurred and is being handled in India.",
                  properties: {
                    state: { type: Type.STRING, description: "State in India" },
                    district: { type: Type.STRING, description: "District in the State" },
                    policeStation: { type: Type.STRING, description: "Police station handling the case" },
                    lat: { type: Type.NUMBER, description: "Approximate latitude in India (between 8.0 and 37.0)" },
                    lng: { type: Type.NUMBER, description: "Approximate longitude in India (between 68.0 and 97.5)" },
                  },
                  required: ["state", "district", "policeStation", "lat", "lng"],
                },
                evidenceItems: {
                  type: Type.ARRAY,
                  description: "Evidence items extracted from the FIR and auto-classified into standard forensic evidence categories.",
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING, description: "Unique short ID (e.g., EV-01)" },
                      item: { type: Type.STRING, description: "Concise name/description of the extracted evidence item" },
                      category: {
                        type: Type.STRING,
                        description: "Auto-tagged evidence classification category",
                        enum: [
                          "Digital Evidence",
                          "Physical Weaponry",
                          "Witness Statements",
                          "Financial Records",
                          "Forensic & Medical",
                          "Vehicle & Property",
                        ],
                      },
                      confidence: { type: Type.INTEGER, description: "ML classification confidence score (0-100)" },
                      sourceExcerpt: { type: Type.STRING, description: "Short quote or context from the FIR mentioning this evidence" },
                      chainOfCustodyStatus: {
                        type: Type.STRING,
                        enum: ["Pending Collection", "Logged & Sealed", "Sent to FSL"],
                      },
                      bnsRelevance: { type: Type.STRING, description: "Relevant BNS/BNSS/BSA statutory admissibility note (e.g., Sec 63 BSA)" },
                    },
                    required: ["id", "item", "category", "confidence"],
                  },
                },
              },
              required: [
                "stressWords",
                "threatLevel",
                "confidenceScore",
                "investigativeSteps",
                "expectedOutcomes",
                "recommendedActs",
                "categories",
                "categoryScores",
                "summary",
                "evidenceItems",
              ],
            },
          },
        })
      );

      const jsonStr = response?.text?.trim() || "{}";
      const parsedData = JSON.parse(jsonStr);

      res.status(200).json(parsedData);
    } catch (error) {
      console.error("Gemini API Error:", error);
      res.status(500).json({
        error: "Failed to analyze FIR text",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API Route: Multi-turn FIR Chatbot with Model Selection + Search & Maps Grounding
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history, firContext, modelMode, groundingMode, latLng } = req.body;

      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Invalid or missing message" });
      }

      const ai = getAIClient();

      // Determine target model based on mode & grounding constraints
      let selectedModel = "gemini-3.8-flash";
      if (groundingMode === "search" || groundingMode === "maps") {
        selectedModel = "gemini-3.8-flash";
      } else if (modelMode === "fast") {
        selectedModel = "gemini-3.1-flash-lite";
      } else if (modelMode === "complex") {
        selectedModel = "gemini-4-argon";
      }

      const formattedContents: any[] = [];
      if (Array.isArray(history)) {
        for (const msg of history) {
          if (msg && typeof msg.content === "string" && msg.content.trim()) {
            formattedContents.push({
              role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
              parts: [{ text: msg.content }],
            });
          }
        }
      }

      formattedContents.push({
        role: "user",
        parts: [{ text: message }],
      });

      const systemInstruction = `You are LEIU Copilot, an AI forensic & legal assistant designed to help Indian law enforcement officers query and understand First Information Reports (FIRs), investigative procedures, and the Bharatiya Nyaya Sanhita (BNS) / Bharatiya Nagarik Suraksha Sanhita (BNSS). Be concise, objective, and reference the active FIR context directly when applicable. Support all Indian languages.\n\nActive FIR Context:\n${firContext || "No specific FIR selected. Answer general questions about FIR processing and BNS statutes."}`;

      const buildConfig = (useModel: string) => {
        const config: any = {
          systemInstruction,
        };

        if (groundingMode === "search") {
          config.tools = [{ googleSearch: {} }];
        } else if (groundingMode === "maps") {
          config.tools = [{ googleMaps: {} }];
          if (latLng && typeof latLng.latitude === "number" && typeof latLng.longitude === "number") {
            config.toolConfig = {
              retrievalConfig: {
                latLng: {
                  latitude: latLng.latitude,
                  longitude: latLng.longitude,
                },
              },
            };
          }
        } else if (useModel === "gemini-3.8-flash" && modelMode === "complex") {
          config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        }

        return config;
      };

      let response: any;
      try {
        response = await runWithRetries(
          () =>
            ai.models.generateContent({
              model: selectedModel,
              contents: formattedContents,
              config: buildConfig(selectedModel),
            }),
          selectedModel === "gemini-4-argon" ? 1 : 3
        );
      } catch (err: any) {
        // Fallback to gemini-3.8-flash with HIGH thinking if gemini-4-argon requires a paid key not configured
        if (selectedModel === "gemini-4-argon") {
          console.warn("Falling back from gemini-4-argon to gemini-3.8-flash (ThinkingLevel.HIGH):", err?.message);
          selectedModel = "gemini-3.8-flash";
          response = await runWithRetries(() =>
            ai.models.generateContent({
              model: selectedModel,
              contents: formattedContents,
              config: buildConfig(selectedModel),
            })
          );
        } else {
          throw err;
        }
      }

      const groundingLinks = extractGroundingLinks(response);

      res.status(200).json({
        reply: response?.text || "",
        groundingLinks,
        modelUsed: selectedModel,
      });
    } catch (error) {
      console.error("Gemini Chat API Error:", error);
      res.status(500).json({
        error: "Failed to communicate with AI",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API Route: Search Grounding & Maps Grounding Intelligence for AnalysisView
  app.post("/api/grounding-intel", async (req, res) => {
    try {
      const { mode, query, latLng } = req.body;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ error: "Missing query" });
      }

      const ai = getAIClient();
      const config: any = {
        systemInstruction:
          mode === "maps"
            ? "You are a law enforcement tactical dispatch assistant. Provide accurate details on nearby police stations, trauma/emergency hospitals, forensic labs, and district courts relevant to the location query."
            : "You are an Indian legal and forensic research assistant. Use Google Search to provide accurate, up-to-date legal precedents, BNS section interpretations, official advisories, and relevant news context.",
      };

      if (mode === "maps") {
        config.tools = [{ googleMaps: {} }];
        if (latLng && typeof latLng.latitude === "number" && typeof latLng.longitude === "number") {
          config.toolConfig = {
            retrievalConfig: {
              latLng: {
                latitude: latLng.latitude,
                longitude: latLng.longitude,
              },
            },
          };
        }
      } else {
        config.tools = [{ googleSearch: {} }];
      }

      const response = await runWithRetries(() =>
        ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: query,
          config,
        })
      );

      const groundingLinks = extractGroundingLinks(response);

      res.status(200).json({
        text: response?.text || "No intelligence summary generated.",
        groundingLinks,
      });
    } catch (error) {
      console.error("Gemini Grounding Intel Error:", error);
      res.status(500).json({
        error: "Failed to fetch grounded intelligence",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API Route: Audio Transcription via gemini-3.5-transcribe
  app.post("/api/transcribe", async (req, res) => {
    try {
      const { audioData, mimeType, languageHint } = req.body;
      if (!audioData) {
        return res.status(400).json({ error: "Missing audioData" });
      }

      const ai = getAIClient();
      const response = await runWithRetries(() =>
        ai.models.generateContent({
          model: "gemini-3.5-transcribe",
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType: mimeType || "audio/webm",
                  data: audioData,
                },
              },
              {
                text: `Transcribe the spoken audio accurately${languageHint ? ` (Language context: ${languageHint})` : ""}. Return only the clean transcription text without extra commentary.`,
              },
            ],
          },
        })
      );

      res.status(200).json({
        transcript: response?.text?.trim() || "",
      });
    } catch (error) {
      console.error("Gemini Transcription Error:", error);
      res.status(500).json({
        error: "Failed to transcribe audio",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API Route: FIR Translation
  app.post("/api/translate", async (req, res) => {
    try {
      const { result, language } = req.body;

      if (!result || !language) {
        return res.status(400).json({ error: "Missing result or language" });
      }

      if (language === "English") {
        return res.status(200).json(result);
      }

      const ai = getAIClient();

      const response = await runWithRetries(() =>
        ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `Translate the following JSON object's string and array text values into ${language}, keeping the EXACT SAME JSON structure, keys, and numeric values. Only translate the human readable text into ${language}. Keep the threatLevel value unchanged as it's an enum (CRITICAL, HIGH, MEDIUM, LOW), and keep lat/lng numeric coordinates unchanged.\n\nHere is the JSON: ${JSON.stringify(result)}`,
                },
              ],
            },
          ],
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                stressWords: { type: Type.ARRAY, items: { type: Type.STRING } },
                threatLevel: { type: Type.STRING },
                confidenceScore: { type: Type.NUMBER },
                investigativeSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                expectedOutcomes: { type: Type.ARRAY, items: { type: Type.STRING } },
                recommendedActs: { type: Type.ARRAY, items: { type: Type.STRING } },
                categories: { type: Type.ARRAY, items: { type: Type.STRING } },
                categoryScores: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      category: { type: Type.STRING },
                      score: { type: Type.INTEGER },
                    },
                    required: ["category", "score"],
                  },
                },
                summary: { type: Type.STRING },
                timeline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      timestamp: { type: Type.STRING },
                      description: { type: Type.STRING },
                    },
                    required: ["timestamp", "description"],
                  },
                },
                locationDetails: {
                  type: Type.OBJECT,
                  properties: {
                    state: { type: Type.STRING },
                    district: { type: Type.STRING },
                    policeStation: { type: Type.STRING },
                    lat: { type: Type.NUMBER },
                    lng: { type: Type.NUMBER },
                  },
                  required: ["state", "district", "policeStation"],
                },
                evidenceItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      item: { type: Type.STRING },
                      category: { type: Type.STRING },
                      confidence: { type: Type.INTEGER },
                      sourceExcerpt: { type: Type.STRING },
                      chainOfCustodyStatus: { type: Type.STRING },
                      bnsRelevance: { type: Type.STRING },
                    },
                    required: ["id", "item", "category", "confidence"],
                  },
                },
              },
              required: [
                "stressWords",
                "threatLevel",
                "confidenceScore",
                "investigativeSteps",
                "expectedOutcomes",
                "recommendedActs",
                "categories",
                "categoryScores",
                "summary",
              ],
            },
          },
        })
      );

      const jsonStr = response?.text?.trim() || "{}";
      const parsedData = JSON.parse(jsonStr);

      res.status(200).json(parsedData);
    } catch (error) {
      console.error("Gemini Translate API Error:", error);
      res.status(500).json({
        error: "Failed to translate",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // API Route: Dedicated ML Evidence Auto-Tagging & Classification
  app.post("/api/classify-evidence", async (req, res) => {
    try {
      const { firText, customItemText } = req.body;
      if (!firText && !customItemText) {
        return res.status(400).json({ error: "Missing firText or customItemText" });
      }

      const ai = getAIClient();
      const prompt = customItemText
        ? `Classify the following single evidence item into one of the standard forensic evidence categories ('Digital Evidence', 'Physical Weaponry', 'Witness Statements', 'Financial Records', 'Forensic & Medical', 'Vehicle & Property') with a confidence score (0-100) and Bharatiya Sakshya Adhiniyam (BSA) / BNSS relevance.\n\nEvidence Item: ${customItemText}\nFIR Context: ${firText || "N/A"}`
        : `Extract all distinct evidentiary items from the following FIR text and investigative context, and classify each item into 'Digital Evidence', 'Physical Weaponry', 'Witness Statements', 'Financial Records', 'Forensic & Medical', or 'Vehicle & Property' with ML confidence scores (0-100), source excerpts, and BSA/BNSS admissibility notes.\n\nFIR Text:\n${firText}`;

      const response = await runWithRetries(() =>
        ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                evidenceItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      item: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        enum: [
                          "Digital Evidence",
                          "Physical Weaponry",
                          "Witness Statements",
                          "Financial Records",
                          "Forensic & Medical",
                          "Vehicle & Property",
                        ],
                      },
                      confidence: { type: Type.INTEGER },
                      sourceExcerpt: { type: Type.STRING },
                      chainOfCustodyStatus: {
                        type: Type.STRING,
                        enum: ["Pending Collection", "Logged & Sealed", "Sent to FSL"],
                      },
                      bnsRelevance: { type: Type.STRING },
                    },
                    required: ["id", "item", "category", "confidence"],
                  },
                },
              },
              required: ["evidenceItems"],
            },
          },
        })
      );

      const parsed = JSON.parse(response?.text?.trim() || '{"evidenceItems":[]}');
      res.status(200).json(parsed);
    } catch (error) {
      console.error("Evidence Classification Error:", error);
      res.status(500).json({
        error: "Failed to classify evidence items",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // WebSocket Server for Real-time Voice Conversations (Gemini Live API: gemini-3.8-live)
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", async (ws: WebSocket) => {
    let session: any = null;

    try {
      const ai = getAIClient();
      session = await ai.live.connect({
        model: "gemini-3.8-live",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: "Zephyr" },
            },
          },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: {
            parts: [
              {
                text: "You are LEIU Live Voice Copilot, a real-time tactical and forensic assistant for Indian law enforcement officers. Speak clearly, concisely, and authoritatively about FIR analysis, Bharatiya Nyaya Sanhita (BNS) sections, crime scene protocol, and emergency response.",
              },
            ],
          },
        },
        callbacks: {
          onopen: () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "status", status: "connected" }));
            }
          },
          onmessage: (message: LiveServerMessage) => {
            if (ws.readyState !== WebSocket.OPEN) return;

            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  ws.send(
                    JSON.stringify({
                      type: "audio",
                      data: part.inlineData.data,
                    })
                  );
                }
              }
            }

            if (message.serverContent?.inputTranscription?.text) {
              ws.send(
                JSON.stringify({
                  type: "input_transcription",
                  text: message.serverContent.inputTranscription.text,
                })
              );
            }

            if (message.serverContent?.outputTranscription?.text) {
              ws.send(
                JSON.stringify({
                  type: "output_transcription",
                  text: message.serverContent.outputTranscription.text,
                })
              );
            }

            if (message.serverContent?.interrupted) {
              ws.send(JSON.stringify({ type: "interrupted" }));
            }
          },
          onerror: (err: any) => {
            console.error("Live API Error:", err);
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(
                JSON.stringify({
                  type: "error",
                  message: err?.message || "Live voice session error",
                })
              );
            }
          },
          onclose: () => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.close();
            }
          },
        },
      });
    } catch (err: any) {
      console.error("Failed to initialize Gemini Live session:", err);
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            type: "error",
            message: err?.message || "Failed to connect to Gemini Live API",
          })
        );
        ws.close();
      }
      return;
    }

    ws.on("message", (raw: string) => {
      try {
        const msg = JSON.parse(raw.toString());
        if (msg.type === "audio" && msg.data && session) {
          session.sendRealtimeInput({
            audio: {
              data: msg.data,
              mimeType: "audio/pcm;rate=16000",
            },
          });
        } else if (msg.type === "context" && msg.text && session) {
          session.sendClientContent({
            turns: [
              {
                role: "user",
                parts: [{ text: `Active FIR Context update:\n${msg.text}` }],
              },
            ],
            turnComplete: false,
          });
        }
      } catch (e) {
        console.error("Error processing live ws message:", e);
      }
    });

    ws.on("close", () => {
      try {
        session?.close();
      } catch {}
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(console.error);
