// sniperOverlay.js — SkySniper Floating HUD Overlay
// Usage: inject this as a module via content.js:
//   const s = document.createElement('script');
//   s.type = 'module';
//   s.src = chrome.runtime.getURL('sniperOverlay.js');
//   document.head.appendChild(s);

(async () => {
  // dynamic imports of utils
  const { loadCashoutThreshold } = await import(chrome.runtime.getURL('utils/dbHandler.js'));
  const { fetchAviatorPrediction } = await import(chrome.runtime.getURL('utils/aiPredictor.js'));

  // create HUD container
  const hud = document.createElement('div');
  hud.id = 'sky-sniper-hud';
  hud.innerHTML = `
    <div id="ss-header">🎯 SkySniper HUD</div>
    <div>Target: <span id="ss-target">--x</span></div>
    <div>Live: <span id="ss-live">--x</span></div>
    <div>AI: <span id="ss-ai">-- / --%</span></div>
  `;
  document.body.appendChild(hud);

  // inject styles
  const css = `
    #sky-sniper-hud {
      position: fixed;
      top: 20px; right: 20px;
      background: rgba(13,13,13,0.9);
      color: #fff;
      font-family: Poppins, sans-serif;
      padding: 8px 12px;
      border: 2px solid #e50914;
      border-radius: 6px;
      box-shadow: 0 0 8px rgba(229,9,20,0.6);
      z-index: 9999;
      cursor: move;
      user-select: none;
      width: 120px;
    }
    #sky-sniper-hud #ss-header {
      font-weight: 600;
      margin-bottom: 6px;
      color: #e50914;
    }
    #sky-sniper-hud div { font-size: 0.85em; margin: 2px 0; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // make HUD draggable
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

  // load & display target threshold
  let threshold = await loadCashoutThreshold();
  document.getElementById('ss-target').textContent = `${threshold.toFixed(2)}x`;

  // fetch & display one-time AI prediction
  const ai = await fetchAviatorPrediction('basic');
  document.getElementById('ss-ai').textContent = ai.error
    ? 'N/A'
    : `${ai.raw.predicted}x / ${ai.raw.confidence}%`;

  // observe live multiplier
  const liveEl = document.querySelector('.crash__graph__value');
  const observer = new MutationObserver(() => {
    const text = liveEl?.textContent?.replace('x','');
    const mult = parseFloat(text);
    if (!isNaN(mult)) {
      document.getElementById('ss-live').textContent = `${mult.toFixed(2)}x`;
    }
  });
  observer.observe(document.body, { subtree:true, childList:true });

})();
