import { ANIMALS, MEASUREMENT_LIMITS, estimateWeight, validateMeasurements } from './estimator.js';
import { clearHistory, readHistory, saveHistory, storageAvailable } from './storage.js';
import { applyLanguage, translations } from './i18n.js';

const $ = selector => document.querySelector(selector);
const state = { lang: safelyRead('plw-lang') || 'en', lastResult: null };

function safelyRead(key) { try { return localStorage.getItem(key); } catch { return null; } }
function safelyWrite(key, value) { try { localStorage.setItem(key, value); return true; } catch { return false; } }
function text(key, values = {}) { return Object.entries(values).reduce((value, [name, replacement]) => value.replace(`{${name}}`, replacement), translations[state.lang][key]); }
function updateLanguage() { applyLanguage(state.lang); $('#languageToggle').textContent = state.lang === 'en' ? 'ط§ط±ط¯ظˆ' : 'English'; renderHistory(); }
function formatDate(date) { try { return new Intl.DateTimeFormat(state.lang === 'ur' ? 'ur-PK' : 'en-PK', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(date)); } catch { return date; } }
function selectedAnimal() { return $('input[name="animal"]:checked').value; }

function showErrors(errors) {
  for (const field of ['girth', 'length']) {
    const input = $(`#${field}`), error = $(`#${field}Error`), code = errors[field];
    const message = code ? text(code, MEASUREMENT_LIMITS[field]) : '';
    error.textContent = message; input.setAttribute('aria-invalid', String(Boolean(code))); input.closest('.input-wrap').classList.toggle('has-error', Boolean(code));
  }
  const notice = $('#validation'); notice.textContent = Object.keys(errors).length ? text('formError') : ''; notice.hidden = !Object.keys(errors).length;
}

function createHistoryItem(item) {
  const row = document.createElement('div'); row.className = 'history-item';
  const main = document.createElement('div'); main.className = 'history-main';
  const name = document.createElement('strong'); name.textContent = translations[state.lang][item.animal] || item.animal;
  const details = document.createElement('small'); details.textContent = `${item.girth} أ— ${item.length} in آ· ${formatDate(item.date)}`;
  const weight = document.createElement('span'); weight.className = 'history-weight'; weight.textContent = `${item.weight} kg`;
  main.append(name, details); row.append(main, weight); return row;
}
function renderHistory() {
  const list = $('#historyList'); list.replaceChildren(); const items = readHistory();
  if (!items.length) { const empty = document.createElement('div'); empty.className = 'empty-state'; empty.textContent = text('noHistory'); list.append(empty); return; }
  items.forEach(item => list.append(createHistoryItem(item)));
}
function showShareStatus(message) { const el = $('#shareStatus'); el.textContent = message; }
function renderResult(result) {
  state.lastResult = result; $('#weightValue').textContent = result.weight; $('#animalLabel').textContent = translations[state.lang][result.animal]; $('#measurementLabel').textContent = `${result.girth} أ— ${result.length} in`;
  const section = $('#resultSection'); section.hidden = false; section.focus({ preventScroll: true }); section.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
}

$('#calculatorForm').addEventListener('submit', event => {
  event.preventDefault(); const values = { girth: $('#girth').value, length: $('#length').value }; const errors = validateMeasurements(values); showErrors(errors); if (Object.keys(errors).length) return;
  const animal = selectedAnimal(), girth = Number(values.girth), length = Number(values.length), weight = Number(estimateWeight(animal, girth, length).toFixed(1));
  const result = { animal, girth, length, weight, date: new Date().toISOString() }; renderResult(result); saveHistory(result); renderHistory();
});
['girth', 'length'].forEach(field => $(`#${field}`).addEventListener('input', () => showErrors(validateMeasurements({ girth: $('#girth').value, length: $('#length').value }))));
document.querySelectorAll('.animal-option input').forEach(input => input.addEventListener('change', () => document.querySelectorAll('.animal-option').forEach(option => option.classList.toggle('selected', option.querySelector('input').checked))));
$('#clearHistory').addEventListener('click', () => { clearHistory(); renderHistory(); showShareStatus(text('cleared')); });
$('#themeToggle').addEventListener('click', () => { const dark = document.body.classList.toggle('dark'); safelyWrite('plw-theme', dark ? 'dark' : 'light'); });
$('#languageToggle').addEventListener('click', () => { state.lang = state.lang === 'en' ? 'ur' : 'en'; safelyWrite('plw-lang', state.lang); updateLanguage(); if (state.lastResult) renderResult(state.lastResult); });
$('#shareButton').addEventListener('click', async () => {
  if (!state.lastResult) return; const r = state.lastResult; const shared = `Pakistan Livestock Weight\n${translations[state.lang][r.animal]}: ${r.weight} kg\n${r.girth} أ— ${r.length} in\n${text('formulaNote')}`;
  try { if (navigator.share) { await navigator.share({ title: 'Pakistan Livestock Weight', text: shared }); showShareStatus(text('shared')); return; } if (navigator.clipboard?.writeText) { await navigator.clipboard.writeText(shared); showShareStatus(text('shared')); return; } throw new Error('No share method'); } catch { showShareStatus(text('shareFailed')); }
});
if (safelyRead('plw-theme') === 'dark') document.body.classList.add('dark');
if (!['en', 'ur'].includes(state.lang)) state.lang = 'en'; updateLanguage();
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
if (!storageAvailable()) console.warn('Local storage is unavailable; history and preferences will not persist.');
export { renderResult, showErrors };

