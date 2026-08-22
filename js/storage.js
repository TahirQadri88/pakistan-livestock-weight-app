const HISTORY_KEY = 'plw-history-v2'; export const HISTORY_LIMIT = 10;
export function storageAvailable(storage = globalThis.localStorage) { try { const key = '__plw_probe__'; storage.setItem(key, '1'); storage.removeItem(key); return true; } catch { return false; } }
export function readHistory(storage = globalThis.localStorage) { try { const value = JSON.parse(storage.getItem(HISTORY_KEY) || '[]'); return Array.isArray(value) ? value.filter(validRecord).slice(0, HISTORY_LIMIT) : []; } catch { return []; } }
export function saveHistory(record, storage = globalThis.localStorage) { if (!storageAvailable(storage)) return false; try { storage.setItem(HISTORY_KEY, JSON.stringify([record, ...readHistory(storage)].slice(0, HISTORY_LIMIT))); return true; } catch { return false; } }
export function clearHistory(storage = globalThis.localStorage) { try { storage.removeItem(HISTORY_KEY); return true; } catch { return false; } }
function validRecord(x) { return x && typeof x.animal === 'string' && Number.isFinite(x.girth) && Number.isFinite(x.length) && Number.isFinite(x.weight) && typeof x.date === 'string'; }

