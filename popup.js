import { fetchAviatorPrediction } from "./utils/aiPredictor.js";
import { verifyGameHash } from "./utils/hashVerifier.js";
import { loadRecentRounds, storeCashoutThreshold } from "./utils/dbHandler.js";

document.addEventListener("DOMContentLoaded", async () => {
  // 🔄 Tab Switching Logic
  const tabs = document.querySelectorAll(".tab");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // 🛑 Auto Cashout Threshold
  const multInput = document.getElementById("multInput");
  const setBtn = document.getElementById("setCashout");
  const cashoutStatus = document.getElementById("cashoutStatus");

  setBtn.addEventListener("click", () => {
    const val = parseFloat(multInput.value);
    storeCashoutThreshold(val, () => {
      cashoutStatus.textContent = `✅ Set to ${val.toFixed(2)}x`;
    });
  });

  chrome.storage.local.get("cashoutThreshold", (res) => {
    if (res.cashoutThreshold) {
      multInput.value = res.cashoutThreshold;
      cashoutStatus.textContent = `Saved: ${res.cashoutThreshold}x`;
    }
  });

  // 🤖 AI Prediction
  const ai = await fetchAviatorPrediction();
  document.getElementById("ai-result").textContent = ai.predicted;
  document.getElementById("ai-confidence").textContent = ai.confidence;

  // 🔐 Hash Verifier
  document.getElementById("verifyHash").addEventListener("click", async () => {
    const raw = document.getElementById("hashInput").value.trim();
    const result = await verifyGameHash(raw);
    document.getElementById("hashStatus").textContent = result.valid ? "✅ Valid" : "❌ Invalid";
  });

  // 📊 Pattern Scanner
  const rounds = await loadRecentRounds(10);
  const formatted = rounds.map(r => `• ${r.crash_multiplier}x`).join("\n");
  document.getElementById("pattern-insights").textContent = formatted || "⚠️ No data yet.";
});
