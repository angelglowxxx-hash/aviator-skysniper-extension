// SkySniper AI Predictor — Fetch crash prediction from Replit API

export async function fetchAviatorPrediction() {
  const endpoint = 'https://your-replit-app-name.replit.app/predict'; // replace with your actual Replit URL

  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const { predicted, confidence } = await response.json();
    return {
      predicted: `${predicted}x`,
      confidence: `${confidence}%`,
      raw: { predicted, confidence }
    };
  } catch (error) {
    console.warn("❌ AI Predictor failed:", error);
    return {
      predicted: "Unavailable",
      confidence: "--%",
      error: true
    };
  }
}
