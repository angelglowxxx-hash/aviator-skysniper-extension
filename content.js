// SkySniper Auto Cashout — content.js

let cashoutTriggered = false;
let targetMultiplier = 1.45; // Default multiplier, can be modified via popup later

// MutationObserver to track multiplier updates on the game page
const observer = new MutationObserver(() => {
  try {
    const multElement = document.querySelector('.crash__graph__value'); // Odds96 Aviator class
    if (multElement) {
      const text = multElement.textContent.replace('x', '');
      const currentMult = parseFloat(text);

      // Auto Cashout Trigger
      if (!cashoutTriggered && currentMult >= targetMultiplier) {
        const btn = document.querySelector('.cashout-button, .btn-cashout'); // Target cashout button
        if (btn) {
          btn.click();
          cashoutTriggered = true;
          console.log(`🛑 Auto cashout activated at ${currentMult}x`);
        }
      }
    }
  } catch (err) {
    console.warn("⚠️ SkySniper content.js error:", err);
  }
});

// Start observing the game area
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Reset flag every round (optional enhancement)
setInterval(() => {
  cashoutTriggered = false;
}, 10000); // Reset every 10 seconds
