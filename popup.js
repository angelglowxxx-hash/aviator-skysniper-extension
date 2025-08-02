// SkySniper — popup.js v4.0
// 🎯 Displays decoded hash, AI prediction, pattern, safety, and backend health

import { checkBackendStatus } from './utils/statusCheck.js';

document.addEventListener("DOMContentLoaded", async () => {
  const roundIdEl = document.getElementById("roundId");
  const predictionEl = document.getElementById("predictionResult");
  const patternEl = document.getElementById("patternResult");
  const hashResultEl = document.getElementById("hashResult");
  const safetyEl = document.getElementById("betSafety");
  const safeExitEl = document.getElementById("safeExit");
  const backendStatusEl = document.getElementById("backendStatus");

  // ❌ Close button
  document.getElementById("closeBtn").addEventListener("click", () => {
    window.close();
  });

  // 🛰️ Check backend status
  const status = await checkBackendStatus();
  backendStatusEl.textContent = status.online
    ? `🟢 Online — ${status.syncedRounds} rounds`
    : "🔴 Offline";

  // 🔁 Listen for messages from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "ROUND_DATA") {
      roundIdEl.textContent = msg.payload.roundId || "--";
      patternEl.textContent = msg.payload.pattern?.join(", ") || "--";
      hashResultEl.textContent = msg.payload.hashResult || "--";
      safeExitEl.textContent = msg.payload.safeExit || "--";
    }

    if (msg.type === "AI_PREDICTION") {
      predictionEl.textContent = `${msg.payload.prediction}x`;
      safetyEl.textContent = msg.payload.safety === "safe" ? "🟢 Safe" : "🔴 Risky";
    }
  });

  // 🔁 Request latest round + prediction from background
  chrome.runtime.sendMessage({ type: "FETCH_LATEST_ROUND" });
});
