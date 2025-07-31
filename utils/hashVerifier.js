// SkySniper Hash Verifier — utils/hashVerifier.js

export async function verifyGameHash(rawHashInput = "") {
  const endpoint = 'https://your-replit-hash-api.replit.app/verify'; // Replace with your real hosted endpoint

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash: rawHashInput })
    });

    if (!response.ok) throw new Error("Bad response from hash verifier API");

    const result = await response.json();

    return {
      valid: result.valid,
      matchedSeed: result.matched_seed || null,
      error: false
    };
  } catch (error) {
    console.warn("❌ Hash verifier failed:", error);
    return {
      valid: false,
      matchedSeed: null,
      error: true
    };
  }
}
