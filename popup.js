import { fetchAviatorPrediction } from './utils/aiPredictor.js';
import { verifyGameHash } from './utils/hashVerifier.js';
import { loadRecentRounds, storeCashoutThreshold } from './utils/dbHandler.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const multInput = document.getElementById('multInput');
  const setBtn = document.getElementById('setCashout');
  const cashoutStatus = document.getElementById('cashoutStatus');
  const aiResult = document.getElementById('ai-result');
  const aiConfidence = document.getElementById('ai-confidence');
  const hashInput = document.getElementById('hashInput');
  const hashBtn = document.getElementById('verifyHash');
  const hashStatus = document.getElementById('hashStatus');
  const patternInsights = document.getElementById('pattern-insights');

  // 🛑 Apply Cashout Threshold
  setBtn.addEventListener('click', () => {
    const value = parseFloat(multInput.value);
    storeCashoutThreshold(value, () => {
      cashoutStatus.textContent = `✅ Set to ${value.toFixed(2)}x`;
    });
  });

  // 🧠 Load Saved Threshold
  chrome.storage.local.get('cashoutThreshold', (res) => {
    if (res.cashoutThreshold) {
      multInput.value = res.cashoutThreshold;
      cashoutStatus.textContent = `Saved: ${res.cashoutThreshold}x`;
    }
  });

  // 🤖 Get AI Prediction
  const ai = await fetchAviatorPrediction();
  aiResult.textContent = ai.predicted;
  aiConfidence.textContent = ai.confidence;

  // 🔐 Hash Verifier
  hashBtn.addEventListener('click', async () => {
    const raw = hashInput.value.trim();
    const result = await verifyGameHash(raw);
    hashStatus.textContent = result.valid ? "✅ Valid" : "❌ Invalid";
  });

  // 📊 Pattern Scanner
  const rounds = await loadRecentRounds(10);
  const formatted = rounds.map(r => `• ${r.crash_multiplier}x`).join('\n');
  patternInsights.textContent = formatted || "⚠️ No data yet.";
});    const hash = document.getElementById('hashInput').value;
    fetch('https://your-replit-hash-endpoint.com/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hash: hash })
    })
      .then(res => res.json())
      .then(result => {
        document.getElementById('hashStatus').textContent = result.valid ? "✅ Valid" : "❌ Invalid";
      })
      .catch(() => {
        document.getElementById('hashStatus').textContent = "⚠️ Error checking hash";
      });
  });

  // 📊 Pattern Insights from storage
  chrome.storage.local.get({ aviatorRounds: [] }, (res) => {
    const rounds = res.aviatorRounds.slice(-10).reverse();
    let text = rounds.map(r => `• ${r.crash_multiplier}x`).join('\n');
    document.getElementById('pattern-insights').textContent = text || "No rounds logged yet.";
  });
});
