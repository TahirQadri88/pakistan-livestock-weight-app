export const translations = {
  en: {
    skip: 'Skip to calculator', homeLabel: 'Pakistan Livestock Weight home', brand: 'Pakistan Livestock', brandSub: 'Weight Estimator',
    languageLabel: 'Switch to Urdu', themeLabel: 'Toggle dark mode', eyebrow: 'FIELD TOOL · PAKISTAN',
    headline: 'Know the animal.<br><em>Know the weight.</em>', intro: 'A refined field calculator for estimating livestock live weight from body measurements.',
    fieldNote: 'FIELD NOTE', noteTitle: 'Measure once.<br>Estimate with care.', noteCopy: 'Designed for quick use in farms, markets and livestock yards across Pakistan.',
    species: '04 species', measurements: '02 measurements', offline: 'Offline ready', calculatorLabel: 'Weight calculator', progressLabel: 'Calculator progress',
    stepAnimal: 'Animal', stepMeasure: 'Measure', stepResult: 'Result', estimate: 'LIVE WEIGHT ESTIMATE', measureAnimal: 'Measure your animal',
    animalType: 'Animal type', cattle: 'Cattle', buffalo: 'Buffalo', sheep: 'Sheep', goat: 'Goat', heartGirth: 'Heart girth', bodyLength: 'Body length',
    girthHelp: 'Measure around the chest, just behind the front legs.', lengthHelp: 'Shoulder point to the base of the tail.', calculate: 'Calculate estimated weight',
    resultKicker: 'ESTIMATED LIVE WEIGHT', share: 'Share result', formulaNote: 'Provisional estimate — formula pending verification. Actual live weight can vary with breed, condition and measurement accuracy.',
    recent: 'RECENT', history: 'Calculation history', clear: 'Clear', noHistory: 'Your recent calculations will appear here.', footerNote: 'For estimation purposes only',
    required: 'Enter a measurement.', invalid: 'Enter a valid number.', positive: 'Measurement must be greater than zero.', range: 'Enter a value between {min} and {max} in.',
    formError: 'Correct the highlighted measurements.', shared: 'Result copied for sharing.', shareFailed: 'Sharing is not available on this device.', cleared: 'History cleared.'
  },
  ur: {
    skip: 'کیلکولیٹر پر جائیں', homeLabel: 'پاکستان لائیو اسٹاک ویٹ ہوم', brand: 'پاکستان لائیو اسٹاک', brandSub: 'وزن کا تخمینہ',
    languageLabel: 'انگریزی میں تبدیل کریں', themeLabel: 'ڈارک موڈ تبدیل کریں', eyebrow: 'فیلڈ ٹول · پاکستان',
    headline: 'جانور کو سمجھیں۔<br><em>وزن کا اندازہ لگائیں۔</em>', intro: 'جسمانی پیمائش کے ذریعے مویشی کے زندہ وزن کا تخمینہ لگانے کے لیے جدید فیلڈ کیلکولیٹر۔',
    fieldNote: 'فیلڈ نوٹ', noteTitle: 'ایک بار پیمائش کریں۔<br>احتیاط سے تخمینہ لگائیں۔', noteCopy: 'پاکستان کے فارمز، منڈیوں اور مویشی یارڈز میں تیز استعمال کے لیے ڈیزائن کیا گیا ہے۔',
    species: '04 اقسام', measurements: '02 پیمائشیں', offline: 'آف لائن تیار', calculatorLabel: 'وزن کیلکولیٹر', progressLabel: 'کیلکولیٹر کی پیش رفت',
    stepAnimal: 'جانور', stepMeasure: 'پیمائش', stepResult: 'نتیجہ', estimate: 'زندہ وزن کا تخمینہ', measureAnimal: 'اپنے جانور کی پیمائش کریں',
    animalType: 'جانور کی قسم', cattle: 'گائے', buffalo: 'بھینس', sheep: 'بھیڑ', goat: 'بکری', heartGirth: 'سینے کا گھیر', bodyLength: 'جسم کی لمبائی',
    girthHelp: 'اگلی ٹانگوں کے پیچھے سینے کے گرد پیمائش کریں۔', lengthHelp: 'کندھے کے مقام سے دم کے شروع تک پیمائش کریں۔', calculate: 'وزن کا تخمینہ لگائیں',
    resultKicker: 'زندہ وزن کا تخمینہ', share: 'نتیجہ شیئر کریں', formulaNote: 'یہ عارضی تخمینہ ہے — فارمولے کی تصدیق باقی ہے۔ نسل، جسمانی حالت اور پیمائش کی درستگی کے باعث اصل وزن مختلف ہو سکتا ہے۔',
    recent: 'حالیہ', history: 'حساب کی تاریخ', clear: 'صاف کریں', noHistory: 'آپ کے حالیہ حساب یہاں نظر آئیں گے۔', footerNote: 'صرف تخمینہ کے لیے',
    required: 'پیمائش درج کریں۔', invalid: 'درست عدد درج کریں۔', positive: 'پیمائش صفر سے زیادہ ہونی چاہیے۔', range: '{min} اور {max} انچ کے درمیان قدر درج کریں۔',
    formError: 'نمایاں کی گئی پیمائشیں درست کریں۔', shared: 'نتیجہ شیئر کرنے کے لیے کاپی ہو گیا۔', shareFailed: 'اس ڈیوائس پر شیئرنگ دستیاب نہیں۔', cleared: 'تاریخ صاف کر دی گئی۔'
  }
};

export function applyLanguage(lang, root = document) {
  const t = translations[lang];
  root.documentElement.lang = lang;
  root.documentElement.dir = lang === 'ur' ? 'rtl' : 'ltr';
  root.body.classList.toggle('rtl', lang === 'ur');
  root.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t[el.dataset.i18n] || ''; });
  root.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t[el.dataset.i18nHtml] || ''; });
  root.querySelectorAll('[data-i18n-aria-label]').forEach(el => { el.setAttribute('aria-label', t[el.dataset.i18nAriaLabel] || ''); });
  return t;
}
