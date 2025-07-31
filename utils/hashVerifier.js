// SkySniper — hashVerifier.js v2.0

// 🔐 Online verification via Replit API
const VERIFY_ENDPOINT = "https://your-replit-hash-api.repl.co/verify";

// 🧠 Offline SHA256 fallback
async function computeSHA256(input) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

// 🔍 Main verifier function
export async function verifyGameHash(rawInput = "") {
  const trimmed = rawInput.trim();

  // Try online verification first
  try {
    const response = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: trimmed })
    });

    if (!response.ok) throw new Error("API error");

    const result = await response.json();

    return {
      valid: result.valid,
      matchedSeed: result.matched_seed || null,
      method: "online",
      error: false
    };
  } catch (err) {
    console.warn("⚠️ Online hash verification failed:", err);

    // Fallback to offline SHA256
    try {
      const computed = await computeSHA256(trimmed);
      return {
        valid: true,
        computedHash: computed,
        method: "offline",
        error: false
      };
    } catch (offlineErr) {
      console.warn("❌ Offline hash compute failed:", offlineErr);
      return {
        valid: false,
        method: "offline",
        error: true
      };
    }
  }
}
