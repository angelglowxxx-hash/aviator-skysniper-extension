// SkySniper — background.js v3.0
// 🧠 Handles hash capture, decode, AI prediction, Supabase sync

import { verifyHash } from './utils/hashVerifier.js';
import { getMultiplierPrediction } from './utils/aiPredictor.js';
import { addRound, triggerCloudSync } from './utils/dbHandler.js';
import { checkBackendStatus } from './utils/statusCheck.js';

// 🔁 Listen for messages from content, popup, or extension
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  // 🔐 Hash captured from WebSocket
  if (msg.type === "HASH_CAPTURED" && msg.hash) {
    console.log("📡 Hash received:", msg.hash);

    const decoded = await verifyHash(msg.hash);

    chrome.runtime.sendMessage({
      type: "HASH_DECODED",
      result: decoded,
      originalHash: msg.hash
    });
  }

  // 🧠 Predict next multiplier using AI
  if (msg.type === "PREDICT_NEXT" && msg.latestMultiplier) {
    const prediction = await getMultiplierPrediction(msg.latestMultiplier);

    chrome.runtime.sendMessage({
      type: "AI_PREDICTION",
      prediction
    });
  }

  // 📦 Add round to local buffer
  if (msg.type === "ROUND_CAPTURED" && msg.round) {
    addRound(msg.round);
  }

  // ☁️ Trigger Supabase sync
  if (msg.type === "TRIGGER_CLOUD_SYNC") {
    const success = await triggerCloudSync();
    chrome.runtime.sendMessage({
      type: "SYNC_STATUS",
      success
    });
  }

  // 🛡️ Backend health check
  if (msg.type === "CHECK_STATUS") {
    const status = await checkBackendStatus();
    chrome.runtime.sendMessage({
      type: "STATUS_RESULT",
      status
    });
  }
});
