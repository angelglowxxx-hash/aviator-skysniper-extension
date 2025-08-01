// SkySniper — aiPredictor.js v3.0
// 🔮 Predicts next multiplier using OpenRouter AI

import { config } from './configLoader.js';

export async function getMultiplierPrediction(latestMultiplier = 1.45) {
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
            content: "You are a crash game analyst. Predict the next multiplier based on recent round."
          },
          {
            role: "user",
            content: `The last round crashed at ${latestMultiplier}x. What is your prediction for the next multiplier?`
          }
        ]
      })
    });

    const data = await res.json();

    if (data?.choices?.[0]?.message?.content) {
      const prediction = data.choices[0].message.content.trim();
      console.log("🔮 AI Prediction:", prediction);
      return prediction;
    } else {
      console.warn("⚠️ No prediction returned
