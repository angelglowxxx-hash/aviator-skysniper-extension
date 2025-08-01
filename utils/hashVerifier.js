// SkySniper — hashVerifier.js v3.0
// 🔐 Sends hash to backend /decode endpoint and returns decoded result

import { config } from './configLoader.js';

export async function verifyHash(hash) {
  if (!hash || typeof hash !== "string") {
    console.warn("⚠️ Invalid hash input");
    return "Invalid hash";
  }

  try {
    const res = await fetch(config.DECODE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ hash })
    });

    const data = await res.json();

    if (data?.decoded !== undefined) {
      console.log("🔓 Hash decoded:", data.decoded);
      return data.decoded;
    } else {
      console.warn("⚠️ No decoded value returned:", data);
      return "Decode failed";
    }
  } catch (err) {
    console.error("❌ Hash verification error:", err.message);
    return "Error contacting backend";
  }
}
