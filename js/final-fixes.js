/* Final QA layer. Loaded by Pages workflow after the existing app script. */
(function () {
  const $ = (s) => document.querySelector(s);
  const get = (id) => document.getElementById(id);
  const safe = (fn) => { try { fn(); } catch (e) { console.error('[final-fixes]', e); } };

  const translations = {
    en: {
      profileIntro:'Enter your farm details or continue with your saved profile.',
      animalIntro:'Select the animal type.',
      breedIntro:'Choose the closest available profile.',
      measureIntro:"Enter the animal's Tag ID and measurements in centimetres.",
      resultIntro:'Results calculated using the original G² × L ÷ D profile formula.',
      tip:'TIP', tipText:'Keep the tape level and snug. Do not pull it tight.',
      calc:'Calculate Weight', start:'Start / شروع کریں',
      image:'Export Image / تصویر', pdf:'Export PDF', whatsapp:'Share via WhatsApp / واٹس ایپ', csv:'Export CSV',
      new:'Start New Calculation / نیا حساب', history:'Calculation History', clear:'Clear',
      back:'← Back / واپس', changeAnimal:'← Change Animal Type / جانور کی قسم بدلیں',
      changeBreed:'← Back to Breed Selection / نسل کے انتخاب کی طرف واپس',
      changeMeasure:'← Back to Measurements / ناپ کی طرف واپس'
    },
    ur: {
      profileIntro:'اپنے فارم کی معلومات درج کریں یا محفوظ پروفائل کے ساتھ جاری رکھیں۔',
      animalIntro:'جانور کی قسم منتخب کریں۔',
      breedIntro:'قریب ترین نسل کا پروفائل منتخب کریں۔',
      measureIntro:'جانور کا ٹیگ ID اور ناپ سینٹی میٹر میں درج کریں۔',
      resultIntro:'اصل G² × L ÷ D پروفائل فارمولے کے مطابق حساب کیا گیا ہے۔',
      tip:'اہم بات', tipText:'ٹیپ سیدھی اور مناسب کساؤ کے ساتھ رکھیں، زیادہ نہ کھینچیں۔',
      calc:'وزن نکالیں', start:'شروع کریں',
      image:'تصویر محفوظ کریں', pdf:'PDF', whatsapp:'واٹس ایپ پر شیئر کریں', csv:'CSV برآمد کریں',
      new:'نیا حساب شروع کریں', history:'حساب کی ہسٹری', clear:'صاف کریں',
      back:'← واپس', changeAnimal:'← جانور کی قسم تبدیل کریں',
      changeBreed:'← نسل کے انتخاب کی طرف واپس', changeMeasure:'← ناپ کی طرف واپس'
    }
  };

  function setText(el, value) { if (el) el.textContent = value; }

  // Replace the original language function because the original script references
  // #newCalc while the production markup uses #newBtn, which stopped init() midway.
  window.applyLanguage = function () {
    safe(() => {
      const ur = state.lang === 'ur';
      const tr = translations[state.lang];
      document.documentElement.lang = ur ? 'ur' : 'en';
      document.documentElement.dir = ur ? 'rtl' : 'ltr';
      document.body.classList.toggle('rtl', ur);
      setText(get('langBtn'), ur ? 'English' : 'اردو');
      if (get('historyBtn')) get('historyBtn').innerHTML = ur ? 'ہسٹری / History' : 'History / ہسٹری';
      if (get('welcomeTitle')) get('welcomeTitle').innerHTML = ur ? 'خوش آمدید <span>/ Welcome</span>' : 'Welcome <span>/ خوش آمدید</span>';
      if (get('animalTitle')) get('animalTitle').innerHTML = ur ? 'جانور کا انتخاب <span>/ Animal Selection</span>' : 'Animal Selection <span>/ جانور کا انتخاب</span>';
      if (get('breedIntro')) setText(get('breedIntro'), tr.breedIntro);
      if (get('measureTitle')) get('measureTitle').innerHTML = ur ? 'ناپ <span>/ Measurements</span>' : 'Measurements <span>/ ناپ</span>';
      if (get('measureTitle')?.nextElementSibling) setText(get('measureTitle').nextElementSibling, tr.measureIntro);
      if (get('resultTitle')) get('resultTitle').innerHTML = ur ? 'وزن کا حساب <span>/ Calculation Result</span>' : 'Calculation Result <span>/ وزن کا حساب</span>';
      if (get('resultTitle')?.nextElementSibling) setText(get('resultTitle').nextElementSibling, tr.resultIntro);
      if (get('profileIntro')) setText(get('profileIntro'), tr.profileIntro);
      if (get('animalTitle')?.nextElementSibling) setText(get('animalTitle').nextElementSibling, tr.animalIntro);
      if (get('profileForm')?.querySelector('.primary-btn')) get('profileForm').querySelector('.primary-btn').innerHTML = tr.start + ' <span>→</span>';
      if (get('measureForm')?.querySelector('.tip strong')) setText(get('measureForm').querySelector('.tip strong'), tr.tip);
      if (get('measureForm')?.querySelector('.tip span')) setText(get('measureForm').querySelector('.tip span'), tr.tipText);
      if (get('measureForm')?.querySelector('.primary-btn')) get('measureForm').querySelector('.primary-btn').innerHTML = tr.calc + ' <span>→</span>';
      setText(get('imageBtn'), tr.image); setText(get('pdfBtn'), tr.pdf); setText(get('whatsappBtn'), tr.whatsapp); setText(get('csvBtn'), tr.csv); setText(get('newBtn'), tr.new);
      setText(get('clearHistory'), tr.clear);
      if (get('historyPanel')?.querySelector('.section-title h2')) setText(get('historyPanel').querySelector('.section-title h2'), tr.history);
      setText(get('backProfile'), tr.back); setText(get('backAnimal'), tr.changeAnimal); setText(get('backBreed'), tr.changeBreed); setText(get('backMeasure'), tr.changeMeasure);
      if (get('girth')?.previousElementSibling) get('girth').previousElementSibling.innerHTML = ur ? 'دل کی گھیرائی (G) سینٹی میٹر میں <span>/ Heart Girth (G) in CM</span>' : 'Heart Girth (G) in CM <span>/ سینٹی میٹر میں دل کی گھیرائی</span>';
      if (get('length')?.previousElementSibling) get('length').previousElementSibling.innerHTML = ur ? 'جسم کی لمبائی (L) سینٹی میٹر میں <span>/ Body Length (L) in CM</span>' : 'Body Length (L) in CM <span>/ جسم کی لمبائی</span>';
      if (get('tagId')?.previousElementSibling) get('tagId').previousElementSibling.innerHTML = ur ? 'جانور کا ٹیگ ID <span>/ Animal Tag ID</span>' : 'Animal Tag ID <span>/ جانور کا ٹیگ ID</span>';
      renderAnimals(); renderBreeds(); renderHistory(); if (state.result) renderResult(state.result);
    });
  };

  function resultTextForShare(r) {
    return ['*Pakistan Livestock Weight Calculation Result*','(Khyber Traders - AnimalHealth.PK)','', '*Farm Details:*',`Farm Name: ${r.profile.farm}`,`Mobile Number: ${r.profile.mobile}`,`Owner: ${r.profile.owner}`,`City: ${r.profile.city}`,`Tag ID: ${r.tag || 'No Tag'}`,`Date: ${new Date(r.date).toLocaleString()}`,'---','*Measurement:*',`Animal: ${r.animal} (${r.breed})`,`Girth (G): ${r.girth} cm`,`Length (L): ${r.length} cm`,'---','*Calculated Weights:*',`LIVE WEIGHT: ${r.weight.toFixed(2)} KG`,`TRADE WEIGHT: ${(r.weight/40).toFixed(2)} Maunds`,`MEAT ESTIMATE (50%): ~${(r.weight*.5).toFixed(2)} KG`,'',`Original formula: G² × L ÷ D (D=${r.density})`,'#LiveWeightCalculator #KhyberTraders #AnimalHealthPK'].join('\n');
  }

  async function shareWhatsApp() {
    const r = state.result; if (!r) return;
    const text = resultTextForShare(r);
    try {
      if (navigator.share) {
        await navigator.share({ title:'Pakistan Livestock Weight Calculation Result', text });
        return;
      }
    } catch (e) { if (e?.name === 'AbortError') return; }
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.location.href = url;
  }

  function wireActions() {
    const bind = (id, fn) => { const e = get(id); if (e) { e.onclick = fn; e.ontouchend = null; } };
    bind('historyBtn', showHistory);
    bind('clearHistory', () => { if (confirm(state.lang === 'ur' ? 'تمام ہسٹری حذف کریں؟' : 'Delete all calculation history?')) { remove('plw-history'); renderHistory(); } });
    bind('backProfile', () => setStep(1)); bind('backAnimal', () => setStep(2)); bind('backBreed', () => setStep(3)); bind('backMeasure', () => setStep(4));
    bind('newBtn', () => { state.animal=null; state.breed=null; state.result=null; get('measureForm')?.reset(); renderAnimals(); setStep(2); });
    bind('imageBtn', () => safe(exportImage)); bind('pdfBtn', () => safe(exportPdf)); bind('csvBtn', () => safe(exportCsv)); bind('whatsappBtn', shareWhatsApp);
    bind('langBtn', () => { state.lang = state.lang === 'en' ? 'ur' : 'en'; write('plw-lang', state.lang); applyLanguage(); });
    bind('themeBtn', () => { document.body.classList.toggle('dark'); write('plw-dark', document.body.classList.contains('dark')); });

    const form = get('measureForm');
    if (form) form.onsubmit = (e) => {
      e.preventDefault();
      const tag=get('tagId').value.trim(), g=Number(get('girth').value), l=Number(get('length').value), err=get('measureError');
      err.hidden=true;
      if (!Number.isFinite(g)||!Number.isFinite(l)||g<=0||l<=0||g<40||g>300||l<30||l>300) { err.textContent=state.lang==='ur'?'براہ کرم درست ناپ درج کریں۔ گھیرائی 40–300 سینٹی میٹر اور لمبائی 30–300 سینٹی میٹر ہونی چاہیے۔':'Please check the measurements. Girth should be 40–300 cm and length 30–300 cm.'; err.hidden=false; return; }
      const b=selectedProfile(); if (!b) { err.textContent=state.lang==='ur'?'پہلے جانور اور نسل منتخب کریں۔':'Please select an animal and breed first.'; err.hidden=false; return; }
      const weight=calculate(g,l,b[3]);
      const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:new Date().toISOString(),profile:{...state.profile},animal:profiles[state.animal].name,breed:b[1],breedUr:b[2],tag,girth:g,length:l,density:b[3],weight:Number(weight.toFixed(2))};
      state.result=item; saveHistory(item); renderResult(item); setStep(5);
    };
  }

  function injectCss() {
    if (document.querySelector('link[data-final-fixes]')) return;
    const link=document.createElement('link'); link.rel='stylesheet'; link.href='./css/final-fixes.css'; link.dataset.finalFixes='1'; document.head.appendChild(link);
  }

  window.addEventListener('error', (e) => console.error('[app runtime]', e.error || e.message));
  injectCss();
  wireActions();
  applyLanguage();
})();
