import { fetchAviatorPrediction } from "./utils/aiPredictor.js";
import { verifyGameHash } from "./utils/hashVerifier.js";
import { loadRecentRounds, storeCashoutThreshold } from "./utils/dbHandler.js";
import { analyzeCrashPatterns } from "./utils/analyticsEngine.js";
import { downloadRounds } from "./utils/exporter.js";

document.addEventListener("DOMContentLoaded", async () => {
  // Tab switching
  const tabs = document.querySelectorAll(".tab");
  const panes = document.querySelectorAll(".tab-content");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      panes.forEach(p => p.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // Pattern Scanner
  const patternEl = document.getElementById("pattern-insights");
  const rounds = await loadRecentRounds(10);
  patternEl.textContent = rounds.length
    ? rounds.map(r => `• ${r.crash_multiplier}x`).join("\n")
    : "⚠️ No data yet.";

  // AI Prediction
  const ai = await fetchAviatorPrediction("advanced");
  document.getElementById("ai-result").textContent = ai.predicted;
  document.getElementById("ai-confidence").textContent = ai.confidence;

  // Hash Verifier
  document.getElementById("verifyHash").addEventListener("click", async () => {
    const raw = document.getElementById("hashInput").value.trim();
    const res = await verifyGameHash(raw);
    document.getElementById("hashStatus").textContent = res.valid ? "✅ Valid" : "❌ Invalid";
  });

  // Auto Cashout
  const multInput = document.getElementById("multInput");
  const setBtn = document.getElementById("setCashout");
  const statusEl = document.getElementById("cashoutStatus");
  setBtn.addEventListener("click", async () => {
    const val = parseFloat(multInput.value);
    await storeCashoutThreshold(val);
    statusEl.textContent = `✅ Set to ${val.toFixed(2)}x`;
  });
  chrome.storage.local.get("cashoutThreshold", (r) => {
    if (r.cashoutThreshold) {
      multInput.value = r.cashoutThreshold;
      statusEl.textContent = `Saved: ${r.cashoutThreshold}x`;
    }
  });

  // Crash Analytics
  const stats = await analyzeCrashPatterns({ limit: 100, bins: 10 });
  document.getElementById("stat-avg").textContent = stats.average?.toFixed(2) || "--";
  document.getElementById("stat-med").textContent = stats.median?.toFixed(2) || "--";
  document.getElementById("stat-std").textContent = stats.stdDev?.toFixed(2) || "--";
  document.getElementById("stat-vol").textContent = stats.volatilityIndex?.toFixed(2) || "--";
  document.getElementById("stat-anom").textContent = stats.anomalies.length;

  // Draw simple histogram
  (function drawHistogram() {
    const canvas = document.getElementById("histogram");
    const ctx = canvas.getContext("2d");
    const { histogram } = stats;
    const w = canvas.width, h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    const maxCount = Math.max(...histogram.map(b => b.count), 1);
    const barW = w / histogram.length;
    histogram.forEach((b, i) => {
      const barH = (b.count / maxCount) * (h - 10);
      ctx.fillStyle = "#e50914";
      ctx.fillRect(i * barW + 2, h - barH - 2, barW - 4, barH);
    });
  })();

  // Data Export
  document.getElementById("exportCsvBtn").addEventListener("click", () => downloadRounds("csv", 500));
  document.getElementById("exportJsonBtn").addEventListener("click", () => downloadRounds("json", 500));
});
