export const ANIMALS = Object.freeze(['cattle', 'buffalo', 'sheep', 'goat']);
export const MEASUREMENT_LIMITS = Object.freeze({ girth: { min: 20, max: 120 }, length: { min: 20, max: 100 } });
/** Provisional UI-only estimator. It is not a verified scientific livestock formula and must be replaced only with an approved source. */
export function estimateWeight(animal, girth, length) { const factors = { cattle: 1, buffalo: 1.08, sheep: .22, goat: .20 }; return Math.max(1, (girth * girth * length / 10840) * (factors[animal] || 1)); }
export function validateMeasurements(values) { const errors = {}; for (const key of ['girth', 'length']) { const value = Number(values[key]); const limit = MEASUREMENT_LIMITS[key]; if (!String(values[key] ?? '').trim()) errors[key] = 'required'; else if (!Number.isFinite(value)) errors[key] = 'invalid'; else if (value <= 0) errors[key] = 'positive'; else if (value < limit.min || value > limit.max) errors[key] = 'range'; } return errors; }

