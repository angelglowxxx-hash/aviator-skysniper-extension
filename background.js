// SkySniper — background.js (Upgraded)

import { saveRound, tagRoundPattern } from './utils/dbHandler.js';

let socketIntercepted = false;

chrome.webRequest.onBeforeRequest.addListener(
  function(details) {
    const url = details.url;
    if (url.includes("wss") && !socketIntercepted) {
      socketIntercepted = true;
      interceptWebSocket(url);
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);

function interceptWebSocket(wsUrl) {
  const socket = new WebSocket(wsUrl);

  socket.onopen = () => {
    console.log("🚀 SkySniper connected:", wsUrl);
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data?.type === "game_info") {
        const { round_id, crash_multiplier, timestamp } = data;

        // 🧠 Tag round pattern
        const tag = tagRoundPattern(crash_multiplier); // e.g. "safe", "volatile", "risky"

        const roundData = {
          round_id,
          crash_multiplier,
          timestamp,
          tag
        };

        // 💾 Save locally
        saveRound(roundData);

        // ☁️ Optional: Sync to cloud
        // await fetch("https://your-replit-db.repl.co/log", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(roundData)
        // });

        console.log(`🎯 Round ${round_id} logged: ${crash_multiplier}x [${tag}]`);
      }
    } catch (err) {
      console.warn("🛑 WebSocket parse error:", err);
    }
  };

  socket.onerror = (e) => {
    console.warn("⚠️ WebSocket error:", e);
  };

  socket.onclose = () => {
    console.log("🔌 SkySniper socket closed");
    socketIntercepted = false;
  };
}
