// SkySniper — aiPredictor.js v4.0
// 🔮 Predicts next multiplier using pattern + AI
// 🧠 Tags bet as safe/unsafe
// 🧩 Can also assist hash decoding

import { config } from './configLoader.js';

export async function getMultiplierPrediction({ latestMultiplier = 1.45, pattern = [], hash = null } = {}) {
  const promptParts = [];

  // 🧩 Include pattern if available
  if (pattern.length > 0) {
    promptParts.push(`Recent crash pattern: ${pattern.join(", ")}.`);
  }

  // 🔐 Include hash if provided
  if (hash) {
    promptParts.push(`The hash for the last round is: ${hash}. Can you help decode or analyze it?`);
  }

  // 🔮 Always include latest multiplier
  promptParts.push(`The last round crashed at ${latestMultiplier}x. What is your prediction for the next multiplier?`);

  const prompt = promptParts.join(" ");

  try {
    const res = await fetch(config.AI_MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${config.AI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: config.AI_MODEL_NAME,
        messages: [
          {
            role: "system",
            content: "You are a crash game analyst. Predict the next multiplier based on recent rounds, patterns, and hash if available. Also tag the bet as 'safe' or 'unsafe'."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await res.json();

    const raw = data?.choices?.[0]?.message?.content?.trim() || "Prediction unavailable";

    // 🧠 Extract prediction + safety tag
    const predictionMatch = raw.match(/(\d+(\.\d+)?)[xX]/);
    const safetyMatch = raw.toLowerCase().includes("safe") ? "safe" : raw.toLowerCase().includes("unsafe") ? "unsafe" : "unknown";

    const prediction = predictionMatch ? parseFloat(predictionMatch[1]) : null;

    console.log("🔮 AI Prediction:", prediction);
    console.log("🧠 Safety Tag:", safetyMatch);

    return {
      prediction: prediction ?? "N/A",
      safety: safetyMatch,
      rawResponse: raw
    };
  } catch (err) {
    console.error("❌ AI prediction failed:", err.message);
    return {
      prediction: "Error",
      safety: "unknown",
      rawResponse: "Error contacting backend"
    };
  }
}
