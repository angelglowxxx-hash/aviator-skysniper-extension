// SkySniper — dbHandler.js v4.0
// ☁️ Handles local round storage + cloud sync via backend API

import { config } from './configLoader.js';

let localRounds = [];

// 🧩 Add round locally
export function addRound(round) {
  if (!round || !round.round_id) return;
  localRounds.push(round);
  console.log("📦 Round added locally:", round);
}

// 📦 Get all locally stored rounds
export function getLocalRounds() {
  return [...localRounds];
}

// 🔁 Trigger cloud sync to backend
export async function triggerCloudSync() {
  if (localRounds.length === 0) {
    console.log("⚠️ No rounds to sync");
    return false;
  }

  try {
    const response = await fetch(config.SYNC_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(localRounds)
    });

    const result = await response.json();

    if (result.success) {
      console.log(`✅ Synced ${localRounds.length} rounds to backend`);
      localRounds = []; // Clear after sync
      return true;
    } else {
      console.warn("❌ Backend sync failed:", result.error);
      return false;
    }
  } catch (err) {
    console.error("❌ Sync error:", err.message);
    return false;
  }
}
