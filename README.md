# SkySniper — Odds96 Aviator Sniper Toolkit

[![Version](https://img.shields.io/badge/version-2.0.0-red.svg)](https://github.com/your-username/sky-sniper)  
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)  
[![Mobile Ready](https://img.shields.io/badge/mobile-ready-green.svg)](https://github.com/your-username/sky-sniper)  
[![AI Powered](https://img.shields.io/badge/AI-powered-orange.svg)](https://github.com/your-username/sky-sniper)

SkySniper is an exclusive browser extension for Odds96 Aviator, combining real-time crash analytics, AI-driven predictions, provably-fair hash verification, pattern scanning, and auto-cashout—all wrapped in a slick black-red-white UI.

---

## Features

- Real-time WebSocket interception and round logging  
- Pattern scanner with “safe”, “volatile”, and “risky” tags  
- AI prediction engine (basic & advanced models)  
- Provably fair hash verification (online & SHA-256 fallback)  
- Auto cashout HUD overlay and configurable threshold  
- CSV export and optional cloud sync of round data  
- Keyboard shortcuts for toggle and popup  

---

## Installation

1. Clone or download this repository.  
2. Open your Chrome/Edge/Firefox (with Chrome-compatible extensions) and navigate to `chrome://extensions`.  
3. Enable “Developer mode” (top right).  
4. Click “Load unpacked,” then select the project root folder.  
5. Ensure the extension icon appears in your toolbar—SkySniper is live!

---

## Usage

1. Navigate to an Odds96 Aviator game page.  
2. Click the SkySniper icon or press `Ctrl+Shift+P` to open the dashboard.  
3.  
   - In **Pattern** tab, view the last 10 crash multipliers.  
   - In **AI** tab, see next-round prediction and confidence.  
   - In **Hash** tab, paste the server seed or hash to verify fairness.  
   - In **Auto** tab, set your cashout multiplier; HUD overlay will auto-trigger.  
4. Press `Ctrl+Shift+S` to toggle the on-screen HUD overlay at any time.  

---

## Screenshots & Demo

### Dashboard (Tabbed UI)

![Dashboard Screenshot](assets/screenshots/dashboard.png)

### In-Game HUD Overlay

![HUD Overlay](assets/screenshots/hud-overlay.gif)

---

## Configuration

- API endpoints for prediction and hash verification can be customized in  
  `utils/aiPredictor.js` and `utils/hashVerifier.js`.  
- Round logging limit and export options are in `utils/dbHandler.js`.  
- Toggle optional cloud sync by uncommenting and setting your endpoint in `background.js`.

---

## Contributing

We welcome your ideas, bug reports, and improvements!

1. Fork the repository.  
2. Create a feature branch (`git checkout -b feature/YourIdea`).  
3. Commit your changes (`git commit -m "Add amazing new feature"`).  
4. Push to your branch (`git push origin feature/YourIdea`).  
5. Open a Pull Request describing your changes.  

Please ensure code follows the existing modular structure, includes documentation, and adds relevant tests or screenshots where applicable.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
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
