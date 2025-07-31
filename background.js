// SkySniper WebSocket Sniffer — background.js

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
    console.log("🚀 SkySniper connected to Aviator socket:", wsUrl);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);

      if (data && data.type === "game_info") {
        const { round_id, crash_multiplier, timestamp } = data;
        console.log("🎯 Round captured:", round_id, "Mult:", crash_multiplier);

        // Store in local storage
        chrome.storage.local.get({ aviatorRounds: [] }, (res) => {
          const updated = [
            ...res.aviatorRounds,
            { round_id, crash_multiplier, timestamp }
          ].slice(-500); // Keep only last 500

          chrome.storage.local.set({ aviatorRounds: updated });
        });
      }
    } catch (err) {
      console.error("🛑 Message parse failed:", err);
    }
  };

  socket.onerror = (e) => {
    console.warn("⚠️ WebSocket error:", e);
  };

  socket.onclose = () => {
    console.log("🔌 SkySniper socket closed");
  };
}
