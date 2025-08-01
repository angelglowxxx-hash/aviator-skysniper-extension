// utils/analyticsEngine.js — SkySniper Crash Pattern Analysis

import { loadRecentRounds } from './dbHandler.js';

/**
 * Analyze recent crash multipliers.
 *
 * @param {object} opts
 * @param {number} opts.limit         Number of latest rounds to analyze
 * @param {number} opts.bins          Number of histogram bins
 * @param {number} opts.anomalyStdDev StdDev multiplier to flag anomalies
 * @returns {Promise<object>} analysis result
 */
export async function analyzeCrashPatterns({
  limit = 100,
  bins = 10,
  anomalyStdDev = 2
} = {}) {
  const rounds = await loadRecentRounds(limit);
  const arr = rounds
    .map(r => parseFloat(r.crash_multiplier))
    .filter(x => !isNaN(x));

  const n = arr.length;
  if (n === 0) {
    return {
      average: null,
      median: null,
      min: null,
      max: null,
      stdDev: null,
      volatilityIndex: null,
      histogram: [],
      anomalies: []
    };
  }

  // Basic stats
  const sum = arr.reduce((a, b) => a + b, 0);
  const average = sum / n;
  const sorted = [...arr].sort((a, b) => a - b);
  const median =
    n % 2 === 0
      ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2
      : sorted[Math.floor(n / 2)];
  const min = sorted[0];
  const max = sorted[n - 1];

  // Standard deviation
  const variance =
    arr.reduce((v, x) => v + Math.pow(x - average, 2), 0) / n;
  const stdDev = Math.sqrt(variance);
  const volatilityIndex = stdDev; // you can normalize if needed

  // Histogram
  const range = max - min || 1;
  const binSize = range / bins;
  const histogram = Array.from({ length: bins }, (_, i) => ({
    rangeStart: min + i * binSize,
    rangeEnd: min + (i + 1) * binSize,
    count: 0
  }));
  arr.forEach(x => {
    const idx = Math.min(
      bins - 1,
      Math.floor((x - min) / binSize)
    );
    histogram[idx].count++;
  });

  // Anomalies: beyond average ± anomalyStdDev * stdDev
  const anomalies = arr
    .map((x, i) => ({ multiplier: x, index: i }))
    .filter(({ multiplier }) =>
      Math.abs(multiplier - average) > anomalyStdDev * stdDev
    );

  return {
    average,
    median,
    min,
    max,
    stdDev,
    volatilityIndex,
    histogram,
    anomalies
  };
}
