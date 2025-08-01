// SkySniper — popup.js v3.0
// 🎯 Displays decoded hash, AI prediction, sync status, and backend health

document.addEventListener("DOMContentLoaded", () => {
  const hashResultEl = document.getElementById("hashResult");
  const predictionEl = document.getElementById("predictionResult");
  const syncStatusEl = document.getElementById("syncStatus");
  const backendStatusEl = document.getElementById("backendStatus");

  // 🔁 Request backend health check
  chrome.runtime.sendMessage({ type: "CHECK_STATUS" });

  // 🔁 Trigger AI prediction (example: last multiplier = 1.87)
  chrome.runtime.sendMessage({ type: "PREDICT_NEXT", latestMultiplier: 1.87 });

  // ☁️ Trigger Supabase sync
  document.getElementById("syncBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ type: "TRIGGER_CLOUD_SYNC" });
  });

  // 🔁 Listen for messages from background
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "HASH_DECODED") {
      hashResultEl.textContent = `Decoded Multiplier: ${msg.result}`;
    }

    if (msg.type === "AI_PREDICTION") {
      predictionEl.textContent = `AI Prediction: ${msg.prediction}`;
    }

    if (msg.type === "SYNC_STATUS") {
      syncStatusEl.textContent = msg.success ? "✅ Synced to Supabase" : "❌ Sync Failed";
    }

    if (msg.type === "STATUS_RESULT") {
      const status = msg.status;
      backendStatusEl.textContent = status.online
        ? `🟢 Backend Online — ${status.syncedRounds} rounds`
        : "🔴 Backend Offline";
    }
  });
});
