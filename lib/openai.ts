import OpenAI from "openai";

// Always use the environment variable at runtime, supporting both Node.js and Edge.
export const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o-mini";

// Return a new OpenAI client - for API route and server usage only.
export function getOpenAIClient() {
  // "Edge" API routes don't have process.env, so fallback to globalThis where needed
  const apiKey =
    typeof process !== "undefined" && process?.env && process.env.OPENAI_API_KEY
      ? process.env.OPENAI_API_KEY
      : (typeof globalThis !== "undefined" && (globalThis as any).OPENAI_API_KEY)
        ? (globalThis as any).OPENAI_API_KEY
        : undefined;

  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY. Add it to .env.local (see env.example).");
  }

  return new OpenAI({ apiKey });
}