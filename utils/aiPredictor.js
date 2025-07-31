// SkySniper — aiPredictor.js v2.0

const MODEL_ENDPOINTS = {
  basic: "https://your-basic-model.replit.app/predict",
  advanced: "https://your-advanced-model.replit.app/predict"
};

// 🧠 Fetch prediction from selected model
export async function fetchAviatorPrediction(model = "basic") {
  const endpoint = MODEL_ENDPOINTS[model] || MODEL_ENDPOINTS.basic;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const { predicted, confidence } = await response.json();

    return {
      predicted: `${predicted}x`,
      confidence: `${confidence}%`,
      raw: { predicted, confidence },
      model,
      error: false
    };
  } catch (error) {
    console.warn(`❌ AI Predictor (${model}) failed:`, error);
    return {
      predicted: "Unavailable",
      confidence: "--%",
      raw: null,
      model,
      error: true
    };
  }
}
