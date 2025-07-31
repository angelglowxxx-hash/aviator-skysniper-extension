// SkySniper — popup.js

document.addEventListener('DOMContentLoaded', () => {
  // 🛑 Auto Cashout Threshold
  const multInput = document.getElementById('multInput');
  const setBtn = document.getElementById('setCashout');
  const cashoutStatus = document.getElementById('cashoutStatus');

  setBtn.addEventListener('click', () => {
    const val = parseFloat(multInput.value);
    chrome.storage.local.set({ cashoutThreshold: val }, () => {
      cashoutStatus.textContent = `Set to ${val}x`;
    });
  });

  // 🧠 Load Previous Cashout Threshold (if any)
  chrome.storage.local.get('cashoutThreshold', (res) => {
    if (res.cashoutThreshold) {
      multInput.value = res.cashoutThreshold;
      cashoutStatus.textContent = `Set to ${res.cashoutThreshold}x`;
    }
  });

  // 🤖 AI Predictor — Replit API fetch
  fetch('https://your-replit-ai-endpoint.com/predict')
    .then(res => res.json())
    .then(data => {
      document.getElementById('ai-result').textContent = `${data.predicted}x`;
      document.getElementById('ai-confidence').textContent = `${data.confidence}%`;
    })
    .catch(() => {
      document.getElementById('ai-result').textContent = 'Unavailable';
    });

  // 🔐 Hash Verifier Button
  document.getElementById('verifyHash').addEventListener('click', () => {
    const hash = document.getElementById('hashInput').value;
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
