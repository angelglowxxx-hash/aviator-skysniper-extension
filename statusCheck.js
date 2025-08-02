// SkySniper — statusCheck.js v2.0
// 🔍 Checks backend health and sync status

import { config } from './configLoader.js';

export async function checkBackendStatus() {
  try {
    const response = await fetch(config.STATUS_ENDPOINT, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) throw new Error("Backend not responding");

    const data = await response.json();

    return {
      online: true,
      syncedRounds: data.syncedRounds ?? 0,
      timestamp: data.timestamp ?? "N/A"
    };
  } catch (err) {
    console.warn("❌ Backend health check failed:", err.message);
    return {
      online: false,
      syncedRounds: 0,
      timestamp: "offline"
    };
  }
}
