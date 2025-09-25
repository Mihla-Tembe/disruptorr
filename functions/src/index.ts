import * as functions from "firebase-functions/v2";
import { genkit } from "genkit";
import { vertexAI } from "@genkit-ai/vertexai";
import { enableFirebaseTelemetry } from "@genkit-ai/firebase";
import express, { Request, Response } from "express";
import cors from "cors";

enableFirebaseTelemetry();

// Initialize Genkit
const ai = genkit({
  plugins: [vertexAI({ location: "us-central1" })],
});

// Create Express app
const app = express();
app.use(express.json());

const allowedOrigins = "https://disruptorr.vercel.app/";

// Apply CORS middleware globally
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ error: "Missing query" });
    }

    const response = await ai.generate({
      model: vertexAI.model("gemini-2.5-flash"),
      prompt: query,
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error("Genkit Gemini error:", err);
    res.status(500).json({ error: "Genkit Gemini call failed" });
  }
});

// Export function
export const chat = functions.https.onRequest(app);
