const ROUND_KEY = "aviatorRounds";
const CASHOUT_KEY = "cashoutThreshold";

// 🔗 Default Replit Sync Endpoint
const SYNC_ENDPOINT = "https://343c884c-eb55-4d6f-99e6-e2a6f98a076c-00-1luyexkeoryzl.pike.replit.dev/sync";

// 🧩 Save a new round with tagging and size limit
export async function saveRound(roundData) {
  return new Promise(resolve => {
    chrome.storage.local.get({ [ROUND_KEY]: [] }, res => {
      const tag = tagRoundPattern(roundData.crash_multiplier);
      const entry = { ...roundData, tag };
      const updated = [...res[ROUND_KEY], entry].slice(-500);
      chrome.storage.local.set({ [ROUND_KEY]: updated }, async () => {
        await triggerCloudSync(); // 🔥 Auto sync after save
        resolve();
      });
    });
  });
}

// 📊 Load the latest N rounds (reverse order: newest first)
export async function loadRecentRounds(limit = 10) {
  return new Promise(resolve => {
    chrome.storage.local.get({ [ROUND_KEY]: [] }, res => {
      const rounds = res[ROUND_KEY].slice(-limit).reverse();
      resolve(rounds);
    });
  });
}

// 🛑 Store cashout threshold
export async function storeCashoutThreshold(value) {
  return new Promise(resolve => {
    chrome.storage.local.set({ [CASHOUT_KEY]: value }, () => resolve());
  });
}

// 🔍 Load cashout threshold (default 1.45x)
export async function loadCashoutThreshold() {
  return new Promise(resolve => {
    chrome.storage.local.get({ [CASHOUT_KEY]: 1.45 }, res => {
      resolve(res[CASHOUT_KEY]);
    });
  });
}

// 🏷️ Tag a round based on multiplier
export function tagRoundPattern(mult) {
  if (mult >= 2.0) return "safe";
  if (mult >= 1.4) return "volatile";
  return "risky";
}

// 📁 Export all rounds to CSV string
export async function exportRoundsToCSV() {
  const rounds = await loadRecentRounds(500);
  const header = "round_id,crash_multiplier,timestamp,tag\n";
  const rows = rounds
    .map(r => `${r.round_id},${r.crash_multiplier},${r.timestamp},${r.tag}`)
    .join("\n");
  return header + rows;
}

// ☁️ Sync rounds to cloud (Replit)
export async function syncRoundsToCloud(endpointUrl) {
  const rounds = await loadRecentRounds(500);
  try {
    const res = await fetch(endpointUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rounds })
    });
    return res.ok;
  } catch (err) {
    console.warn("⚠️ Cloud sync failed:", err);
    return false;
  }
}

// 🚀 Trigger sync using default Replit endpoint
export async function triggerCloudSync() {
  const success = await syncRoundsToCloud(SYNC_ENDPOINT);
  if (success) {
    console.log("✅ Rounds synced to cloud");
  } else {
    console.warn("❌ Sync failed");
  }
}
