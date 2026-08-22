(() => {
  const $ = (s) => document.querySelector(s);

  // Typography / RTL polish. Keep English and Urdu visually intentional rather than
  // forcing both scripts into the same metrics.
  const style = document.createElement('style');
  style.textContent = `
    html[dir="rtl"], body.rtl { font-family: Inter, system-ui, sans-serif; }
    .rtl .screen-head h2, .rtl .screen-head h2 span,
    .rtl .form-grid label > span, .rtl .choice-card small,
    .rtl .breed-card span, .rtl .urdu-help,
    .rtl .result-table, .rtl .result-info, .rtl .result-note {
      font-family: 'Noto Nastaliq Urdu', 'Noto Naskh Arabic', serif !important;
      line-height: 2 !important;
    }
    .rtl .screen-head h2 { line-height: 1.8 !important; }
    .rtl .screen-head p, .rtl .step-label, .rtl .form-grid label,
    .rtl .primary-btn, .rtl .link-btn, .rtl .action, .rtl .history-row,
    .rtl .ghost-btn, .rtl .icon-btn { font-family: 'Noto Naskh Arabic', Inter, sans-serif !important; }
    .rtl .form-grid input { font-family: Inter, 'Noto Naskh Arabic', sans-serif !important; direction: rtl; }
    .rtl .choice-card, .rtl .breed-card { text-align: center; }
    .rtl .breed-card { direction: rtl; }
    .rtl .result-table th, .rtl .result-table td { vertical-align: middle; }
    .result-table th:first-child, .result-table td:first-child { width: 58%; }
    .result-table th:last-child, .result-table td:last-child { width: 42%; }
    .result-table td.big { white-space: nowrap; }
    .share-actions { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px; }
    .share-actions .action { width:100%; }
    @media (max-width:520px) { .share-actions { grid-template-columns:1fr; } }
    .share-status { margin-top:10px; min-height:20px; text-align:center; font:600 11px Inter,sans-serif; color:#047857; }
    .rtl .share-status { font-family:'Noto Naskh Arabic',sans-serif; }
  `;
  document.head.appendChild(style);

  const t = {
    en: {
      share: 'Share Result',
      copied: 'Result copied. You can paste it anywhere.',
      shared: 'Share sheet opened.',
      cancelled: 'Share cancelled.',
      unavailable: 'Sharing is not available on this browser. Result copied instead.',
      whatsapp: 'Share via WhatsApp / واٹس ایپ'
    },
    ur: {
      share: 'نتیجہ شیئر کریں',
      copied: 'نتیجہ کاپی ہو گیا۔ اب اسے کہیں بھی پیسٹ کر سکتے ہیں۔',
      shared: 'شیئر مینو کھول دیا گیا ہے۔',
      cancelled: 'شیئر منسوخ کر دیا گیا۔',
      unavailable: 'اس براؤزر میں شیئر دستیاب نہیں، نتیجہ کاپی کر دیا گیا ہے۔',
      whatsapp: 'واٹس ایپ پر شیئر کریں'
    }
  };

  function lang(){ return document.documentElement.lang === 'ur' ? 'ur' : 'en'; }
  function result(){ return window.__PLW_RESULT || null; }
  function resultText(){
    const r = result();
    if (!r) return '';
    return [
      '*Pakistan Livestock Weight Calculation Result*',
      '(Khyber Traders - AnimalHealth.PK)', '',
      '*Farm Details:*', `Farm Name: ${r.profile?.farm || ''}`,
      `Mobile Number: ${r.profile?.mobile || ''}`, `Owner: ${r.profile?.owner || ''}`,
      `City: ${r.profile?.city || ''}`, `Tag ID: ${r.tag || 'No Tag'}`,
      `Date: ${new Date(r.date).toLocaleString()}`, '---', '*Measurement:*',
      `Animal: ${r.animal} (${r.breed})`, `Girth (G): ${r.girth} cm`,
      `Length (L): ${r.length} cm`, '---', '*Calculated Weights:*',
      `LIVE WEIGHT: ${Number(r.weight).toFixed(2)} KG`,
      `TRADE WEIGHT: ${(r.weight/40).toFixed(2)} Maunds`,
      `MEAT ESTIMATE (50%): ~${(r.weight*.5).toFixed(2)} KG`, '',
      `Original formula: G² × L ÷ D (D=${r.density})`,
      '#LiveWeightCalculator #KhyberTraders #AnimalHealthPK'
    ].join('\n');
  }

  function status(msg){
    let el = $('.share-status');
    if (!el) {
      el = document.createElement('div'); el.className='share-status';
      $('.result-actions')?.after(el);
    }
    el.textContent = msg;
    clearTimeout(el._timer); el._timer=setTimeout(()=>{el.textContent='';},3500);
  }

  async function copyResult(){
    const text=resultText();
    if (!text) return;
    try { await navigator.clipboard.writeText(text); status(t[lang()].copied); }
    catch {
      const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0';
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); status(t[lang()].copied);
    }
  }

  async function shareResult(){
    const text=resultText(); if(!text) return;
    if (navigator.share) {
      try { await navigator.share({title:'Pakistan Livestock Weight Result', text}); status(t[lang()].shared); return; }
      catch (e) { if(e?.name==='AbortError'){status(t[lang()].cancelled);return;} }
    }
    await copyResult();
    status(t[lang()].unavailable);
  }

  function whatsapp(){
    const text=resultText(); if(!text) return;
    const url='https://wa.me/?text='+encodeURIComponent(text);
    // location is more reliable than popup windows on iOS Safari and in PWA mode.
    window.location.href=url;
  }

  function refreshResultRef(){
    // The original app keeps result in a module-scoped state. Capture it by observing
    // the rendered result card and reading its current visible values is insufficient,
    // so we patch the button flow by using a safe bridge exposed by the original app below.
  }

  // Bridge: replace the original result renderer only to expose the result object.
  // We intercept the result card update through a MutationObserver and reconstruct the
  // minimal share payload from the rendered result plus current form/context.
  const observer = new MutationObserver(() => {
    const card=$('#resultCard');
    if(!card || !card.textContent.trim()) return;
    const title=card.querySelector('.title');
    const rows=[...card.querySelectorAll('tbody tr')].map(tr=>tr.querySelectorAll('td'));
    const get=(label)=>{const row=rows.find(c=>c[0]?.textContent.includes(label));return row?.[1]?.textContent.trim()||'';};
    const live=get('Live Weight');
    if(live){
      const weight=parseFloat(live.replace(/[^0-9.]/g,''));
      const info=card.querySelector('.result-info')?.innerText||'';
      const profile=JSON.parse(localStorage.getItem('plw-profile')||'{}');
      const animal=(info.match(/Animal:\s*([^/\n]+)\s*\/\s*([^\n]+)/)||[]);
      const tag=(info.match(/Tag ID:\s*([^\n]+)/)||[])[1]||'';
      const meas=get('Girth') || '';
      const nums=meas.match(/([0-9.]+).*?([0-9.]+)/)||[];
      const density=(card.querySelector('.result-note')?.textContent.match(/D\s*=\s*([0-9]+)/)||[])[1]||'';
      if(Number.isFinite(weight)) window.__PLW_RESULT={profile,animal:animal[1]?.trim()||'',breed:animal[2]?.trim()||'',tag,girth:Number(nums[1]||0),length:Number(nums[2]||0),density:Number(density||0),weight,date:new Date().toISOString()};
    }
  });
  observer.observe(document.body,{subtree:true,childList:true});

  function install(){
    const actions=$('.result-actions');
    if(!actions || actions.dataset.uxFixed) return;
    actions.dataset.uxFixed='1';
    const native=document.createElement('button'); native.type='button'; native.id='nativeShareBtn'; native.className='action green'; native.textContent='↗ '+t[lang()].share;
    native.addEventListener('click',shareResult);
    const copy=document.createElement('button'); copy.type='button'; copy.id='copyShareBtn'; copy.className='action slate'; copy.textContent='▣ Copy Result';
    copy.addEventListener('click',copyResult);
    const wa=$('#whatsappBtn');
    if(wa){ wa.textContent='● '+t[lang()].whatsapp; wa.onclick=whatsapp; }
    actions.insertBefore(native,actions.firstChild);
    actions.insertBefore(copy,actions.children[1]);
  }

  const installObserver=new MutationObserver(install);
  installObserver.observe(document.body,{subtree:true,childList:true});
  install();

  // Make the language control actually switch the visible UI, while preserving the
  // original bilingual content. The original branch only changed dir/lang.
  const langBtn=$('#langBtn');
  if(langBtn){
    langBtn.addEventListener('click',()=>{
      requestAnimationFrame(()=>{
        document.body.classList.toggle('rtl',lang()==='ur');
        langBtn.textContent=lang()==='ur'?'English':'اردو';
        const labels={
          en:{welcome:'Welcome',animal:'Animal Selection',breed:'Select Breed Profile',measure:'Measurements',result:'Calculation Result'},
          ur:{welcome:'خوش آمدید',animal:'جانور کا انتخاب',breed:'نسل کا انتخاب',measure:'ناپ',result:'وزن کا حساب'}
        };
        const l=labels[lang()];
        $('#welcomeTitle')?.querySelector('span') && ($('#welcomeTitle').querySelector('span').textContent=lang()==='ur'?'': '/ خوش آمدید');
        if(lang()==='ur'){
          $('#welcomeTitle').firstChild.textContent=l.welcome+' ';
          $('#animalTitle').firstChild.textContent=l.animal+' ';
          $('#breedTitle').firstChild.textContent=l.breed+' ';
          $('#measureTitle').firstChild.textContent=l.measure+' ';
          $('#resultTitle').firstChild.textContent=l.result+' ';
        }
      });
    });
  }
})();
