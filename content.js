// SkySniper — content.js (Upgraded)

let triggered = false;
let threshold = 1.45;
let lastTriggerTime = null;

// 🧠 Inject floating HUD
function injectHUD() {
  const hud = document.createElement('div');
  hud.id = 'sniper-hud';
  hud.style.position = 'fixed';
  hud.style.top = '10px';
  hud.style.right = '10px';
  hud.style.background = '#0d0d0d';
  hud.style.color = '#e50914';
  hud.style.padding = '8px 12px';
  hud.style.borderRadius = '6px';
  hud.style.fontFamily = 'Poppins, sans-serif';
  hud.style.zIndex = '9999';
  hud.style.boxShadow = '0 0 8px rgba(255,0,0,0.4)';
  hud.innerText = `🎯 Target: ${threshold}x`;
  document.body.appendChild(hud);
}

// 🛑 Trigger cashout
function triggerCashout(mult) {
  const btn = document.querySelector('.cashout-button, .btn-cashout');
  if (btn) {
    btn.click();
    triggered = true;
    lastTriggerTime = Date.now();
    console.log(`🛑 Auto cashout at ${mult}x`);
  }
}

// 🔄 Load threshold from storage
chrome.storage.local.get('cashoutThreshold', (res) => {
  threshold = res.cashoutThreshold || 1.45;
  injectHUD();
});

// 👀 Observe multiplier changes
const observer = new MutationObserver(() => {
  try {
    const el = document.querySelector('.crash__graph__value');
    if (el) {
      const text = el.textContent.replace('x', '');
      const currentMult = parseFloat(text);

      // Update HUD live
      const hud = document.getElementById('sniper-hud');
      if (hud) hud.innerText = `🎯 Target: ${threshold}x\n📈 Live: ${currentMult}x`;

      // Trigger logic
      if (!triggered && currentMult >= threshold) {
        triggerCashout(currentMult);
      }
    }
  } catch (err) {
    console.warn("⚠️ SkySniper DOM error:", err);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// 🔁 Reset every round
setInterval(() => {
  triggered = false;
}, 10000);
