// SkySniper — hashCapture.js v1.0
// 🧠 Listens to WebSocket messages and extracts hash values

export function initHashSniffer(wsUrl) {
  try {
    const socket = new WebSocket(wsUrl);

    socket.addEventListener("open", () => {
      console.log("🟢 WebSocket connected:", wsUrl);
    });

    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        // 🎯 Check if hash exists in payload
        if (data && data.hash && typeof data.hash === "string") {
          console.log("🔍 Hash captured:", data.hash);

          // Send to background script for decoding
          chrome.runtime.sendMessage({
            type: "HASH_CAPTURED",
            hash: data.hash
          });
        }
      } catch (err) {
        console.warn("⚠️ Failed to parse WebSocket message:", err);
      }
    });

    socket.addEventListener("error", (err) => {
      console.warn("❌ WebSocket error:", err);
    });

    socket.addEventListener("close", () => {
      console.log("🔴 WebSocket disconnected");
    });
  } catch (err) {
    console.error("❌ Failed to initialize WebSocket:", err);
  }
}
