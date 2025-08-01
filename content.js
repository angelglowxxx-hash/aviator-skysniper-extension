// SkySniper — content.js (v2.1)

let triggered = false;
let threshold = 1.45;

// Load threshold & inject HUD (if using sniperOverlay.js)
chrome.storage.local.get("cashoutThreshold", (r) => {
  threshold = r.cashoutThreshold || threshold;
  // If you’ve injected sniperOverlay.js, it will pick this up
});

// MutationObserver for auto-cashout
const observer = new MutationObserver(() => {
  const el = document.querySelector(".crash__graph__value");
  const mult = parseFloat(el?.textContent?.replace("x", "") || 0);

  if (!triggered && mult >= threshold) {
    document.querySelector(".cashout-button")?.click();
    triggered = true;
    console.log(`🛑 Auto cashout at ${mult}x`);
  }

  // Reset each round
  setTimeout(() => (triggered = false), 10000);
});

observer.observe(document.body, { childList: true, subtree: true });

// Listen for toggle-sniper command to show/hide overlay
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggle-sniper") {
    const hud = document.getElementById("sky-sniper-hud");
    if (hud) hud.style.display = hud.style.display === "none" ? "block" : "none";
  }
});
