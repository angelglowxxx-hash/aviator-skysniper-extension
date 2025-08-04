// content.js - The Sniper Script that runs on the page.

// --- CONFIGURATION ---
const BACKEND_URL = "https://skysniper-app.onrender.com";
let gameConfig = null;
let siteUrl = window.location.hostname;

// --- UI ELEMENTS ---
let dashboard = null;
let predictionElement = null;
let statusElement = null;

/**
 * The main function to initialize the sniper.
 */
async function init() {
  console.log(`SkySniper X: Initializing on ${siteUrl}`);

  // TODO:
  // 1. Try to load config from local storage.
  // 2. If not found, fetch config from the backend.
  // 3. If backend has no config, trigger the discovery process.
  // 4. Once we have a config, render the dashboard and start observing.

  renderDashboard(); // For now, let's just render the dashboard.
  setStatus("Ready to Snipe.", "GREEN");
}

/**
 * Creates and injects the floating dashboard UI into the page.
 * This is done with pure JS to be stealthy.
 */
function renderDashboard() {
  if (document.getElementById('skysniper-dashboard')) return; // Already exists

  dashboard = document.createElement('div');
  dashboard.id = 'skysniper-dashboard';
  dashboard.innerHTML = `
    <div class="ss-header">SkySniper X</div>
    <div class="ss-content">
      <div class="ss-item">
        <strong>Status:</strong>
        <span id="ss-status-text" class="ss-status-text">Initializing...</span>
      </div>
      <div class="ss-item">
        <strong>Prediction:</strong>
        <span id="ss-prediction-text" class="ss-prediction-text">--</span>
      </div>
    </div>
  `;

  // Apply stealthy CSS
  dashboard.style.cssText = `
    position: fixed; top: 20px; right: 20px; width: 250px;
    background: rgba(17, 24, 39, 0.9);
    border: 1px solid #374151;
    border-radius: 8px;
    color: #F9FAFB;
    font-family: sans-serif;
    z-index: 9999999;
    backdrop-filter: blur(10px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  `;

  // Inject into the page
  document.body.appendChild(dashboard);

  // Add styles for the inner elements
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = `
    .ss-header { background: #1F2937; padding: 8px 12px; font-weight: bold; border-bottom: 1px solid #374151; }
    .ss-content { padding: 12px; display: flex; flex-direction: column; gap: 8px; }
    .ss-item { display: flex; justify-content: space-between; align-items: center; }
    .ss-status-text { font-weight: bold; }
    .ss-prediction-text { font-weight: bold; font-size: 1.2em; color: #FBBF24; }
  `;
  document.head.appendChild(styleSheet);

  // Store references to the elements we will update
  predictionElement = document.getElementById('ss-prediction-text');
  statusElement = document.getElementById('ss-status-text');
}

/**
 * Updates the status message on the dashboard.
 * @param {string} text The message to display.
 * @param {'GREEN' | 'YELLOW' | 'RED'} color The status color.
 */
function setStatus(text, color) {
  if (statusElement) {
    statusElement.textContent = text;
    statusElement.style.color = color === 'GREEN' ? '#22C55E' : color === 'YELLOW' ? '#F59E0B' : '#EF4444';
  }
}

// --- INITIALIZE ---
init();
