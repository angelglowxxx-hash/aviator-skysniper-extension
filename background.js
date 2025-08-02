// background.js 🚀 SkySniper Edition

import { verifyHash } from './utils/hashVerifier.js';
import { triggerCloudSync } from './utils/dbHandler.js';
import { getAIPrediction } from './utils/aiPredictor.js';

// 🔐 Defensive import fallback
if (typeof verifyHash !== 'function') {
  console.warn("[SkySniper] hashVerifier.js failed to load or verifyHash is not a function");
  chrome.runtime.sendMessage({
    type: "ERROR",
    payload: {
      source: "background.js",
      message: "verifyHash not loaded",
      timestamp: new Date().toISOString()
    }
  });
}

// 🛠 Message Listener with sendResponse support
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  try {
    const timestamp = new Date().toISOString();

    // 1️⃣ Hash verification request
    if (msg.type === "VERIFY_HASH") {
      const isValid = verifyHash(msg.payload?.data, msg.payload?.hash);
      sendResponse({ status: "ok", valid: isValid, timestamp });
      return true;
    }

    // 2️⃣ AI Prediction request (OpenRouter/AI keys)
    if (msg.type === "GET_AI_PREDICTION") {
      if (typeof getAIPrediction === 'function') {
        const prediction = await getAIPrediction(msg.payload);
        sendResponse({ status: "ok", prediction, timestamp });
      } else {
        sendResponse({ status: "not_implemented", timestamp });
      }
      return true;
    }

    // 3️⃣ Supabase Cloud Sync
    if (msg.type === "TRIGGER_CLOUD_SYNC") {
      if (typeof triggerCloudSync === 'function') {
        const success = await triggerCloudSync();
        sendResponse({ status: "ok", success, timestamp });
      } else {
        sendResponse({ status: "not_implemented", timestamp });
      }
      return true;
    }

    // 4️⃣ Logging events (optional)
    if (msg.type === "LOG_EVENT") {
      console.log("[SkySniper LOG]", msg.payload);
      sendResponse({ status: "logged", timestamp });
      return true;
    }

    // 5️⃣ Fetch config (never send secrets to frontend)
    if (msg.type === "FETCH_CONFIG") {
      sendResponse({
        status: "ok",
        config: {
          AI_MODEL_NAME: process.env.AI_MODEL_NAME,
          AI_MODEL_URL: process.env.AI_MODEL_URL,
          SYNC_ENDPOINT: process.env.SYNC_ENDPOINT,
          PREDICT_ENDPOINT: process.env.PREDICT_ENDPOINT,
          VERIFY_ENDPOINT: process.env.VERIFY_ENDPOINT,
          DECODE_ENDPOINT: process.env.DECODE_ENDPOINT,
        },
        timestamp
      });
      return true;
    }

    // Default: Unknown message type
    sendResponse({ status: "unknown_type", received: msg.type, timestamp });
    return true;

  } catch (err) {
    // 🔥 Enhanced error reporting
    chrome.runtime.sendMessage({
      type: "ERROR",
      payload: {
        source: "background.js",
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        context: msg?.type || "unknown"
      }
    });

    if (sendResponse) {
      sendResponse({ status: "error", message: err.message });
    }
    return true;
  }
});
