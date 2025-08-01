// SkySniper — dbHandler.js v3.0
// ☁️ Handles local round storage + cloud sync to Supabase

import { saveRoundsBatch } from './dbConnector.js';

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

// 🔁 Trigger cloud sync to Supabase
export async function triggerCloudSync() {
  if (localRounds.length === 0) {
    console.log("⚠️ No rounds to sync");
    return false;
  }

  const success = await saveRoundsBatch(localRounds);

  if (success) {
    console.log(`✅ Synced ${localRounds.length} rounds to Supabase`);
    localRounds = []; // Clear after sync
    return true;
  } else {
    console.warn("❌ Cloud sync failed");
    return false;
  }
}
