// SkySniper — content.js v3.0
// 🎯 Scrapes round data + auto-cashout + HUD toggle

let triggered = false;
let threshold = 1.45;

// 🔧 Load threshold from storage
chrome.storage.local.get("cashoutThreshold", (r) => {
  threshold = r.cashoutThreshold || threshold;
});

// 🔁 Auto-cashout logic
const observer = new MutationObserver(() => {
  const el = document.querySelector(".crash__graph__value");
  const mult = parseFloat(el?.textContent?.replace("x", "") || 0);

  if (!triggered && mult >= threshold) {
    document.querySelector(".cashout-button")?.click();
    triggered = true;
    console.log(`🛑 Auto cashout at ${mult}x`);
  }

  // Reset trigger after round
  setTimeout(() => (triggered = false), 10000);
});

observer.observe(document.body, { childList: true, subtree: true });

// 🧩 Scrape round data every 3s
function extractRoundData() {
  try {
    const roundIdEl = document.querySelector('[data-round-id]');
    const roundId = roundIdEl?.getAttribute('data-round-id') || "unknown";

    const hashEl = document.querySelector('.hash-value');
    const hash = hashEl?.textContent?.trim() || null;

    const multiplierEl = document.querySelector('.crash__graph__value');
    const multiplierText = multiplierEl?.textContent?.trim() || "1.00x";
    const multiplier = parseFloat(multiplierText.replace("x", ""));

    const patternEls = document.querySelectorAll('.multiplier-history .multiplier');
    const pattern = Array.from(patternEls).slice(-4).map(el =>
      parseFloat(el.textContent.replace("x", ""))
    );

    chrome.runtime.sendMessage({
      type: "ROUND_DATA",
      payload: {
        roundId,
        hash,
        multiplier,
        pattern
      }
    });

    console.log("[SkySniper] Round scraped:", { roundId, hash, multiplier, pattern });
  } catch (err) {
    console.error("[SkySniper] Failed to extract round data:", err.message);
  }
}

setInterval(extractRoundData, 3000);

// 🎯 Toggle sniper HUD
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === "toggle-sniper") {
    const hud = document.getElementById("sky-sniper-hud");
    if (hud) hud.style.display = hud.style.display === "none" ? "block" : "none";
  }
});
