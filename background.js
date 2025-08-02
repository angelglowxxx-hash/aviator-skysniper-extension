// background.js 🚀 SkySniper Edition

import { verifyHash } from './utils/hashVerifier.js';

// 🔐 Defensive import fallback
if (typeof verifyHash !== 'function') {
  console.warn("[SkySniper] hashVerifier.js failed to load or verifyHash is not a function");
  chrome.runtime.sendMessage({
    type: "ERROR",
    payload: {
      source: "background.js",
      message: "verifyHash not loaded",
      timestamp: new Date().toISOString()
    }
  });
}

// 🛠 Message Listener with sendResponse support
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  try {
    const timestamp = new Date().toISOString();

    // Example: handle a hash verification request
    if (msg.type === "VERIFY_HASH") {
      const isValid = verifyHash(msg.payload?.data, msg.payload?.hash);
      sendResponse({ status: "ok", valid: isValid, timestamp });
      return true;
    }

    // Handle other message types here...
    // e.g., LOG_EVENT, FETCH_CONFIG, etc.

    // Default response
    sendResponse({ status: "unknown_type", received: msg.type, timestamp });
    return true;

  } catch (err) {
    // 🔥 Enhanced error reporting
    chrome.runtime.sendMessage({
      type: "ERROR",
      payload: {
        source: "background.js",
        message: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString(),
        context: msg?.type || "unknown"
      }
    });

    if (sendResponse) {
      sendResponse({ status: "error", message: err.message });
    }
    return true;
  }
});        roundId,
        pattern,
        hashResult: decoded,
        safeExit: prediction.prediction,
      }
    });

    chrome.runtime.sendMessage({
      type: "AI_PREDICTION",
      payload: prediction
    });
  }

  if (msg.type === "TRIGGER_CLOUD_SYNC") {
    const success = await triggerCloudSync();
    chrome.runtime.sendMessage({ type: "SYNC_STATUS", success });
  }
});
