# ✈️ SkySniper Extension — Odds96 Aviator Toolkit

The ultimate **Chrome/Kiwi browser extension** designed for crash-style games like Aviator on Odds96. This plug-and-play sniper toolkit tracks patterns, predicts rounds, audits fairness, and helps automate smart exits — all inside a clean popup dashboard.

---

## 🚀 Features

🟢 **Live WebSocket Sniffer**  
Captures real-time multiplier, round ID & crash signals from the Aviator game engine.

🤖 **AI-Powered Predictor**  
Uses last 500+ rounds to forecast upcoming crash risks via Replit-hosted TensorFlow model.

📊 **Pattern Scanner**  
Generates heatmap & streak analytics from historical round data (local IndexedDB).

🔐 **Provably Fair Audit**  
SHA256 hash verification module to check tamper-proof game integrity (via server seed & nonce).

🛑 **Auto Cashout Hook**  
DOM-level script that auto-clicks the cashout button at your configured multiplier.

🧠 **Popup Control Center**  
A sleek dashboard UI with toggle switches, prediction cards, live tracker, and round insights.

---

## 📲 Mobile Compatibility

🛠️ Works seamlessly in:

- ✅ **Kiwi Browser** (Android) – Load extension via ZIP
- ✅ **Yandex Browser** – Supports Chrome extensions

Just unzip → Load via `chrome://extensions` → Enable → Sniper ready 💥

---

## 🧱 Installation

1. Clone this repo or [Download ZIP](https://github.com/yourname/aviator-skysniper-extension)
2. Open Chrome or Kiwi → `chrome://extensions`
3. Enable **Developer Mode**
4. Click “Load unpacked” → Select folder
5. Start Aviator game on [Odds96](https://odds96.in/en/casino/game/3838-aviator)
6. Click extension icon → Access SkySniper popup

---

## 🌐 API Setup (Optional)

This extension optionally connects to:

- 🧠 **AI Model API** → hosted on Replit (edit `utils/aiPredictor.js`)
- 🔐 **Hash Audit API** → NodeJS backend (edit `utils/hashVerifier.js`)

You can host these yourself or use default endpoints.

---
---

## 🧪 Developer Tips

- Use DevTools → Network → WebSocket tab to manually inspect message streams.
- Debug IndexedDB via `Application → Storage → IndexedDB`
- Customize UI inside `popup.css` and add new panels in `popup.html`

---

## 🧙‍♂️ Credits & Ownership

Created by **Honey** 💻  
Game target: [Odds96 Aviator](https://odds96.in/en/casino/game/3838-aviator)  
Tools inspired by open-source intelligence + zero-day imagination 🔥

---

## 📜 License

MIT License — use, fork, remix, but always respect the builder 👑
