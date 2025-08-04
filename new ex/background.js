// background.js - The Service Worker

// Listen for when a tab is completely loaded.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // Ensure the page is fully loaded and has a URL.
  if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
    // Use the Scripting API to inject our content script into the page.
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    }).then(() => {
      console.log("SkySniper X: Injected the sniper script.");
    }).catch(err => console.error("SkySniper X: Failed to inject script:", err));
  }
});
