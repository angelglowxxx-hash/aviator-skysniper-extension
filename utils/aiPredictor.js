// SkySniper — aiPredictor.js v2.0

const MODEL_ENDPOINT = "https://343c884c-eb55-4d6f-99e6-e2a6f98a076c-00-1luyexkeoryzl.pike.replit.dev/predict";

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
