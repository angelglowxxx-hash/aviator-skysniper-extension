// SkySniper — background.js v4.0
// 🧠 Handles round data, AI prediction, backend status, and sync

import { verifyHash } from './utils/hashVerifier.js';
import { getMultiplierPrediction } from './utils/aiPredictor.js';
import { triggerCloudSync, getLocalRounds } from './utils/dbHandler.js';
import { checkBackendStatus } from './utils/statusCheck.js';

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === "CHECK_STATUS") {
    const status = await checkBackendStatus();
    chrome.runtime.sendMessage({ type: "STATUS_RESULT", status });
  }

  if (msg.type === "PREDICT_NEXT") {
    const result = await getMultiplierPrediction({
      latestMultiplier: msg.latestMultiplier,
      pattern: msg.pattern || [],
      hash: msg.hash || null
    });

    chrome.runtime.sendMessage({ type: "AI_PREDICTION", payload: result });
  }

  if (msg.type === "FETCH_LATEST_ROUND") {
    // Example round data (replace with actual game scraping logic)
    const roundId = "RD-" + Date.now().toString().slice(-6);
    const pattern = [1.01, 1.45, 2.00, 1.03];
    const hash = "abc123hashvalue";

    const decoded = await verifyHash(hash);
    const prediction = await getMultiplierPrediction({ latestMultiplier: pattern.at(-1), pattern, hash });

    chrome.runtime.sendMessage({
      type: "ROUND_DATA",
      payload: {
        roundId,
        pattern,
        hashResult: decoded,
        safeExit: prediction.prediction,
      }
    });

    chrome.runtime.sendMessage({
      type: "AI_PREDICTION",
      payload: prediction
    });
  }

  if (msg.type === "TRIGGER_CLOUD_SYNC") {
    const success = await triggerCloudSync();
    chrome.runtime.sendMessage({ type: "SYNC_STATUS", success });
  }
});
