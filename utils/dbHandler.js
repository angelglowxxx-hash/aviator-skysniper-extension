// SkySniper DB Handler — utils/dbHandler.js

const ROUND_KEY = "aviatorRounds";
const CASHOUT_KEY = "cashoutThreshold";

// 🧩 Save new round info (called from background.js)
export function saveRound(roundData) {
  chrome.storage.local.get({ [ROUND_KEY]: [] }, (res) => {
    const updated = [...res[ROUND_KEY], roundData].slice(-500);
    chrome.storage.local.set({ [ROUND_KEY]: updated });
  });
}

// 📊 Load latest N rounds
export function loadRecentRounds(limit = 10) {
  return new Promise((resolve) => {
    chrome.storage.local.get({ [ROUND_KEY]: [] }, (res) => {
      const rounds = res[ROUND_KEY].slice(-limit).reverse();
      resolve(rounds);
    });
  });
}

// 🛑 Store cashout threshold
export function storeCashoutThreshold(value, callback) {
  chrome.storage.local.set({ [CASHOUT_KEY]: value }, callback);
}

// 🔍 Load cashout threshold
export function loadCashoutThreshold() {
  return new Promise((resolve) => {
    chrome.storage.local.get([CASHOUT_KEY], (res) => {
      resolve(res[CASHOUT_KEY] || 1.45);
    });
  });
}
