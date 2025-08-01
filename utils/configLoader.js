// SkySniper — configLoader.js v2.0
// 🧩 Loads config from .env or fallback defaults

import dotenv from 'dotenv';
dotenv.config();

export const config = {
  // 🔮 AI Prediction (OpenRouter)
  AI_API_KEY: process.env.AI_API_KEY || "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",
  AI_MODEL_URL: process.env.AI_MODEL_URL || "https://openrouter.ai/api/v1/chat/completions",
  AI_MODEL_NAME: process.env.AI_MODEL_NAME || "mistral-7b",

  // ☁️ Supabase Config
  SUPABASE_URL: process.env.SUPABASE_URL || "https://eipwtuojyimfisucaxnv.supabase.co",
  SUPABASE_KEY: process.env.SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcHd0dW9qeWltZmlzdWNheG52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNTgwNDAsImV4cCI6MjA2OTYzNDA0MH0.xEWYZ7MKpOsTfGUpSZqItqZaylJWqFF1NWk-g8XLkpg",
  SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpcHd0dW9qeWltZmlzdWNheG52Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDA1ODA0MCwiZXhwIjoyMDY5NjM0MDQwfQ.t-N84NZMbhfYuRkDgLyg1snaIZJex_hv0P_5qFtxYRE",

  // 🔗 Backend Endpoints (Render)
  DECODE_ENDPOINT: process.env.DECODE_ENDPOINT || "https://skysniper-backend.onrender.com/decode",
  SYNC_ENDPOINT: process.env.SYNC_ENDPOINT || "https://skysniper-backend.onrender.com/syncRound",
  STATUS_ENDPOINT: process.env.STATUS_ENDPOINT || "https://skysniper-backend.onrender.com/status",
  PREDICT_ENDPOINT: process.env.PREDICT_ENDPOINT || "https://skysniper-backend.onrender.com/predict",
  VERIFY_ENDPOINT: process.env.VERIFY_ENDPOINT || "https://skysniper-backend.onrender.com/verify"
};
