// sniperOverlay.js — SkySniper Floating HUD Overlay v4.0
// Inject via content.js as a module

(async () => {
  const { loadCashoutThreshold } = await import(chrome.runtime.getURL('utils/dbHandler.js'));
  const { getMultiplierPrediction } = await import(chrome.runtime.getURL('utils/aiPredictor.js'));

  // Create HUD container
  const hud = document.createElement('div');
  hud.id = 'sky-sniper-hud';
  hud.innerHTML = `
    <div id="ss-header">🎯 SkySniper HUD</div>
    <div>Target: <span id="ss-target">--x</span></div>
    <div>Live: <span id="ss-live">--x</span></div>
    <div>AI: <span id="ss-ai">--x</span></div>
    <div>Safety: <span id="ss-safe">--</span></div>
  `;
  document.body.appendChild(hud);

  // Inject styles
  const style = document.createElement('style');
  style.textContent = `
    #sky-sniper-hud {
      position: fixed;
      top: 20px; right: 20px;
      background: rgba(13,13,13,0.95);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      padding: 10px 14px;
      border: 2px solid #e50914;
      border-radius: 8px;
      box-shadow: 0 0 10px rgba(229,9,20,0.6);
      z-index: 9999;
      cursor: move;
      user-select: none;
      width: 160px;
    }
    #sky-sniper-hud #ss-header {
      font-weight: 600;
      margin-bottom: 8px;
      color: #e50914;
      font-size: 14px;
    }
    #sky-sniper-hud div {
      font-size: 13px;
      margin: 4px 0;
    }
    #ss-safe.safe { color: #00ff88; }
    #ss-safe.unsafe { color: #ff4444; }
  `;
  document.head.appendChild(style);

  // Make HUD draggable
  (function makeDraggable(el) {
    let offsetX, offsetY, isDown = false;
    el.addEventListener('mousedown', e => {
      isDown = true;
      offsetX = e.clientX - el.getBoundingClientRect().left;
      offsetY = e.clientY - el.getBoundingClientRect().top;
    });
    document.addEventListener('mousemove', e => {
      if (!isDown) return;
      el.style.left = e.clientX - offsetX + 'px';
      el.style.top  = e.clientY - offsetY + 'px';
    });
    document.addEventListener('mouseup', () => isDown = false);
  })(hud);

  // Load threshold
  const threshold = await loadCashoutThreshold();
  document.getElementById('ss-target').textContent = `${threshold.toFixed(2)}x`;

  // Observe live multiplier
  const liveEl = document.querySelector('.crash__graph__value');
  const observer = new MutationObserver(() => {
    const text = liveEl?.textContent?.replace('x','');
    const mult = parseFloat(text);
    if (!isNaN(mult)) {
      document.getElementById('ss-live').textContent = `${mult.toFixed(2)}x`;
    }
  });
  observer.observe(document.body, { subtree:true, childList:true });

  // Fetch AI prediction every round
  async function refreshPrediction() {
    const patternEls = document.querySelectorAll('.multiplier-history .multiplier');
    const pattern = Array.from(patternEls).slice(-4).map(el =>
      parseFloat(el.textContent.replace("x", ""))
    );
    const latest = pattern.at(-1) || 1.00;

    const result = await getMultiplierPrediction({ latestMultiplier: latest, pattern });

    document.getElementById('ss-ai').textContent = `${result.prediction}x`;
    const safetyEl = document.getElementById('ss-safe');
    safetyEl.textContent = result.safety;
    safetyEl.className = result.safety === "safe" ? "safe" : "unsafe";
  }

  refreshPrediction();
  setInterval(refreshPrediction, 10000); // refresh every 10s

  // Toggle HUD visibility
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg.type === "toggle-sniper") {
      hud.style.display = hud.style.display === "none" ? "block" : "none";
    }
  });
})();
