// SkySniper — hashVerifier.js v4.0
// 🔐 Sends hash to backend /decode endpoint and returns decoded multiplier

import { config } from './configLoader.js';

export async function verifyHash(hash) {
  if (!hash || typeof hash !== "string") {
    console.warn("⚠️ Invalid hash input:", hash);
    return "Invalid hash";
  }

  try {
    const response = await fetch(config.DECODE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ hash })
    });

    const result = await response.json();

    if (result?.decoded !== undefined) {
      console.log("🔓 Hash decoded:", result.decoded);
      return result.decoded;
    } else {
      console.warn("⚠️ Unexpected response from backend:", result);
      return "Decode failed";
    }
  } catch (error) {
    console.error("❌ Backend decode error:", error.message);
    return "Error contacting backend";
  }
}
