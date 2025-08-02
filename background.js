// background.js 🚀 SkySniper AI-Connected Edition (Advanced, Bundled Required)

// --- Imports (these are bundled with Vite/Webpack) --- //
import { verifyHash } from './utils/hashVerifier.js';
import { triggerCloudSync } from './utils/dbHandler.js';
import { getAIPrediction } from './utils/aiPredictor.js';
import { io } from 'socket.io-client';

// --- Config --- //
const BACKEND_URL = "https://skysniper-backend.onrender.com";
const socket = io(BACKEND_URL, { transports: ["websocket"] });

// --- Utility: AI Auto-Heal via Backend --- //
async function requestAIAutoFix(errorObj, contextCode = "") {
  try {
    const res = await fetch(`${BACKEND_URL}/ai/assist`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        error: errorObj?.message || "Unknown error",
        context: contextCode || errorObj?.stack || "No context"
      }),
    });
    if (res.ok) {
      const data = await res.json();
      return data.suggestion;
    }
    return "AI assist failed";
  } catch (err) {
    return `AI assist error: ${err.message}`;
  }
}

// --- Defensive import fallback --- //
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

// --- Socket: Report Extension Events to Backend/Dashboard --- //
function emitExtensionEvent(eventType, payload) {
  socket.emit("extension_event", {
    event: eventType,
    payload,
    extension: "aviator-skysniper-extension",
    time: new Date().toISOString()
  });
}

// --- Socket: Listen for Backend/AI Commands (e.g. auto-fix) --- //
socket.on("command", async (cmd) => {
  if (cmd.action === "UPDATE_CODE") {
    // For security: ask user or admin before applying any AI patch!
    chrome.notifications?.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "AI Code Update Available",
      message: "AI has generated a code update. Review and apply in extension settings."
    });
    // Optionally, store cmd.patch for review in extension options page
  }
});

// --- Chrome Message Listener --- //
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  try {
    const timestamp = new Date().toISOString();

    // 1️⃣ Hash verification request
    if (msg.type === "VERIFY_HASH") {
      const isValid = verifyHash(msg.payload?.data, msg.payload?.hash);
      emitExtensionEvent("VERIFY_HASH", { ...msg.payload, isValid });
      sendResponse({ status: "ok", valid: isValid, timestamp });
      return true;
    }

    // 2️⃣ AI Prediction request (OpenRouter/AI keys)
    if (msg.type === "GET_AI_PREDICTION") {
      if (typeof getAIPrediction === 'function') {
        const prediction = await getAIPrediction(msg.payload);
        emitExtensionEvent("GET_AI_PREDICTION", { input: msg.payload, prediction });
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
        emitExtensionEvent("TRIGGER_CLOUD_SYNC", { success });
        sendResponse({ status: "ok", success, timestamp });
      } else {
        sendResponse({ status: "not_implemented", timestamp });
      }
      return true;
    }

    // 4️⃣ Logging events
    if (msg.type === "LOG_EVENT") {
      emitExtensionEvent("LOG_EVENT", msg.payload);
      sendResponse({ status: "logged", timestamp });
      return true;
    }

    // 5️⃣ Fetch config (never send secrets to frontend)
    if (msg.type === "FETCH_CONFIG") {
      // Never expose secrets! Only expose safe config.
      sendResponse({
        status: "ok",
        config: {
          AI_MODEL_NAME: process.env?.AI_MODEL_NAME || "OpenRouter",
          AI_MODEL_URL: process.env?.AI_MODEL_URL || "",
          SYNC_ENDPOINT: process.env?.SYNC_ENDPOINT || "",
          PREDICT_ENDPOINT: process.env?.PREDICT_ENDPOINT || "",
          VERIFY_ENDPOINT: process.env?.VERIFY_ENDPOINT || "",
          DECODE_ENDPOINT: process.env?.DECODE_ENDPOINT || "",
        },
        timestamp
      });
      return true;
    }

    // 6️⃣ Request AI auto-fix/assist for errors (NEW)
    if (msg.type === "AI_AUTO_FIX") {
      const suggestion = await requestAIAutoFix(msg.payload.error, msg.payload.contextCode);
      emitExtensionEvent("AI_AUTO_FIX", { error: msg.payload.error, suggestion });
      sendResponse({ status: "ok", suggestion, timestamp });
      return true;
    }

    // Default: Unknown message type
    emitExtensionEvent("UNKNOWN_TYPE", { msg });
    sendResponse({ status: "unknown_type", received: msg.type, timestamp });
    return true;

  } catch (err) {
    // 🔥 Enhanced error reporting + AI suggestion
    emitExtensionEvent("ERROR", { message: err.message, stack: err.stack, type: msg?.type || "unknown" });
    // Optionally, ask AI for help immediately
    const aiSuggestion = await requestAIAutoFix(err, msg?.type || "");
    chrome.runtime.sendMessage({
      type: "ERROR",
      payload: {
        source: "background.js",
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        context: msg?.type || "unknown",
        aiSuggestion
      }
    });
    if (sendResponse) {
      sendResponse({ status: "error", message: err.message, aiSuggestion });
    }
    return true;
  }
});

// --- Optional: Service worker keep-alive (for dev) --- //
setInterval(() => {
  // No-op ping to keep the service worker alive during development
}, 60_000);
