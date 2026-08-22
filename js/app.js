const $ = (s) => document.querySelector(s);

// AUTHORITATIVE CALCULATION PROFILES
// These values are preserved from the original application source.
const profiles = {
  cattle: {
    name: 'Cattle', ur: 'گائے / بیل',
    breeds: [
      ['sahiwal', 'Sahiwal / Cholistani (Zebu)', 'ساہیوال / چولستانی (کوہان والی)', 10840],
      ['crossbred', 'Friesian / Crossbred', 'فریزین / کراس بریڈ (فلیٹ بیک)', 10900],
      ['general', 'General / Desi', 'جنرل / دیسی (معیاری)', 10840]
    ]
  },
  buffalo: {
    name: 'Buffalo', ur: 'بھینس',
    breeds: [
      ['nili-ravi', 'Nili-Ravi / Kundi', 'نیلی راوی / کُنڈی (بھاری نسل)', 10400],
      ['general', 'General / Desi', 'جنرل / دیسی (معیاری)', 10480]
    ]
  },
  sheep: {
    name: 'Sheep', ur: 'بھیڑ',
    breeds: [
      ['lohi-kajli', 'Lohi / Kajli', 'لوہی / کاجلی (بڑا فریم)', 10840],
      ['dumba', 'Dumba (Fat Tailed)', 'دنبہ (چربی دار دُم)', 10600],
      ['general', 'General / Desi', 'جنرل / دیسی (معیاری)', 10840]
    ]
  },
  goat: {
    name: 'Goat', ur: 'بکرا / بکری',
    breeds: [
      ['teddy', 'Teddy', 'ٹیڈی (چھوٹا / ٹھوس)', 10500],
      ['beetal-rajanpuri', 'Beetal / Rajanpuri', 'بیٹل / راجن پوری (لمبا قد)', 10840],
      ['general', 'General / Desi', 'جنرل / دیسی (معیاری)', 10840]
    ]
  }
};

const animalSvgs = {
  cattle:'<svg viewBox="0 0 48 48"><path d="M11 20c0-6 5-10 13-10s13 4 13 10v8c0 7-5 11-13 11s-13-4-13-11v-8Z"/><path d="M14 18 9 12M34 18l5-6M18 24h.1M30 24h.1M21 30c2 1.6 4 1.6 6 0M15 39v4M33 39v4"/></svg>',
  buffalo:'<svg viewBox="0 0 48 48"><path d="M13 19c-5-7-7-7-9-6M35 19c5-7 7-7 9-6M11 20c1-6 6-10 13-10s12 4 13 10v8c0 7-5 11-13 11s-13-4-13-11v-8Z"/><path d="M18 24h.1M30 24h.1M21 30c2 1.6 4 1.6 6 0M15 39v4M33 39v4"/></svg>',
  sheep:'<svg viewBox="0 0 48 48"><path d="M10 31c-4-2-3-8 1-10-2-5 5-8 9-5 3-5 11-2 11 3 5-2 9 4 5 8 3 5-3 9-7 7-3 5-11 3-12-1-4 2-8 0-7-2Z"/><path d="M14 34v7M33 34v7M36 30h5"/></svg>',
  goat:'<svg viewBox="0 0 48 48"><path d="M14 18 10 9l8 5M34 18l4-9-8 5M12 19c1-6 6-10 12-10s11 4 12 10v9c0 7-5 11-12 11s-12-4-12-11v-9Z"/><path d="M18 24h.1M30 24h.1M21 30c2 1.6 4 1.6 6 0M16 39v4M32 39v4"/></svg>'
};

const state = {
  step: 1,
  animal: null,
  breed: null,
  profile: read('plw-profile') || null,
  result: null,
  lang: read('plw-lang') || 'en'
};

function read(key){ try { return JSON.parse(localStorage.getItem(key)); } catch { return null; } }
function write(key,value){ try { localStorage.setItem(key,JSON.stringify(value)); } catch {} }
function remove(key){ try { localStorage.removeItem(key); } catch {} }
function history(){ return read('plw-history') || []; }
function saveHistory(item){ const list = history().filter(x => x.id !== item.id); list.unshift(item); write('plw-history', list.slice(0,30)); }
function esc(value){ const d=document.createElement('div'); d.textContent=value ?? ''; return d.innerHTML; }
function selectedProfile(){ return profiles[state.animal]?.breeds.find(b => b[0] === state.breed); }
function calculate(girth,length,divisor){ return (length * girth * girth) / divisor; }

function setStep(step){
  state.step = step;
  const ids=['step1','step2','breedStep','step3','step4'];
  ids.forEach((id,index)=>{ const el=$('#'+id); if(el) el.hidden = index !== step-1; });
  if(step !== 6) $('#historyPanel').hidden = true;
  window.scrollTo({top:0,behavior:'smooth'});
}

function renderAnimals(){
  const grid=$('#animalGrid'); grid.replaceChildren();
  Object.entries(profiles).forEach(([key,p],i)=>{
    const card=document.createElement('button');
    card.type='button';
    card.className='choice-card'+(state.animal===key?' selected':'');
    card.setAttribute('aria-label',`${p.name} / ${p.ur}`);
    card.innerHTML=`<span class="animal-icon" aria-hidden="true">${animalSvgs[key]}</span><strong>${p.name}</strong><small>${p.ur}</small><span class="number">0${i+1}</span>`;
    card.addEventListener('click',()=>{ state.animal=key; state.breed=null; renderAnimals(); renderBreeds(); setStep(3); });
    grid.append(card);
  });
}

function renderBreeds(){
  const grid=$('#breedGrid'); grid.replaceChildren();
  if(!state.animal) return;
  const p=profiles[state.animal];
  $('#breedTitle').innerHTML=`Select Breed Profile <span>/ ${p.ur}</span>`;
  $('#breedIntro').textContent='Choose the closest available profile. The original divisor is preserved exactly.';
  p.breeds.forEach(b=>{
    const card=document.createElement('button');
    card.type='button'; card.className='breed-card'+(state.breed===b[0]?' selected':'');
    card.innerHTML=`<strong>${b[1]}</strong><span>${b[2]}</span><small>D = ${b[3]}</small>`;
    card.addEventListener('click',()=>{ state.breed=b[0]; updateContext(); setStep(4); });
    grid.append(card);
  });
}

function updateContext(){
  const p=profiles[state.animal], b=selectedProfile();
  $('#contextStrip').innerHTML=`<span class="context-chip">${p.name}</span><span class="context-chip">${b?.[1] || ''}</span><span class="context-chip">G² × L ÷ D</span><span class="context-chip">D = ${b?.[3] || ''}</span>`;
}

function profileInputs(){ return {farm:$('#farmName').value.trim(),mobile:$('#mobile').value.trim(),owner:$('#owner').value.trim(),city:$('#city').value.trim()}; }
function loadProfile(){
  const p=state.profile||{};
  $('#farmName').value=p.farm||''; $('#mobile').value=p.mobile||''; $('#owner').value=p.owner||''; $('#city').value=p.city||'';
  $('#headerMeta').textContent=`Farm: ${p.farm||'N/A'} · User ID: ${p.mobile||'N/A'}`;
}

function renderHistory(){
  const list=$('#historyList'); list.replaceChildren(); const items=history();
  if(!items.length){ const e=document.createElement('div'); e.className='empty-history'; e.textContent='No calculations saved yet. Your recent estimates will appear here.'; list.append(e); return; }
  items.forEach(item=>{
    const row=document.createElement('div'); row.className='history-row'; row.tabIndex=0;
    const main=document.createElement('div'); const title=document.createElement('strong');
    title.textContent=`${item.animal} · ${item.breed}`;
    const meta=document.createElement('small'); meta.textContent=`${item.tag||'No Tag'} · G ${item.girth} cm × L ${item.length} cm · ${new Date(item.date).toLocaleString()}`;
    main.append(title,meta); const w=document.createElement('span'); w.className='weight'; w.textContent=`${item.weight.toFixed(2)} KG`;
    row.append(main,w);
    const open=()=>{state.result=item; renderResult(item); setStep(5);}; row.addEventListener('click',open); row.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' ')open();});
    list.append(row);
  });
}

function showHistory(){
  const panel=$('#historyPanel'); panel.hidden=false; renderHistory(); panel.scrollIntoView({behavior:'smooth'});
}

function renderResult(r){
  const meat=r.weight*0.5, maund=r.weight/40;
  $('#resultCard').innerHTML=`
    <div class="result-top"><div class="title">Pakistan Livestock Weight Calculator</div><small>G² × L ÷ D · Original calculation profile</small></div>
    <div class="result-info"><strong>Farm:</strong> ${esc(r.profile.farm)} &nbsp; | &nbsp; <strong>Mobile:</strong> ${esc(r.profile.mobile)}<br><strong>Owner:</strong> ${esc(r.profile.owner)} &nbsp; | &nbsp; <strong>City:</strong> ${esc(r.profile.city)}<br><strong>Animal:</strong> ${esc(r.animal)} / ${esc(r.breed)} &nbsp; | &nbsp; <strong>Tag ID:</strong> ${esc(r.tag||'No Tag')}<br><strong>Date:</strong> ${new Date(r.date).toLocaleString()}</div>
    <table class="result-table"><thead><tr><th>Parameter / پیرامیٹر</th><th>Result / نتیجہ</th></tr></thead><tbody>
      <tr><td>Breed Profile / نسل</td><td>${esc(r.breed)}</td></tr>
      <tr><td>Girth (G) × Length (L)</td><td>${r.girth} cm × ${r.length} cm</td></tr>
      <tr><td>Live Weight / زندہ وزن</td><td class="big">${r.weight.toFixed(2)} KG</td></tr>
      <tr><td>Trade Weight / تجارتی وزن</td><td>${maund.toFixed(2)} Maunds</td></tr>
      <tr><td>Meat Estimate (~50%) / گوشت کا تخمینہ</td><td>~${meat.toFixed(2)} KG</td></tr>
    </tbody></table>
    <div class="result-note">Calculated using the original ${esc(r.breed)} density profile · D = ${r.density}<br><small>For estimation purposes only.</small></div>
    <div class="result-credit">Khyber Traders · AnimalHealth.PK</div>`;
}

function resultText(r){
  return ['*Pakistan Livestock Weight Calculation Result*','(Khyber Traders - AnimalHealth.PK)','', '*Farm Details:*',`Farm Name: ${r.profile.farm}`,`Mobile Number: ${r.profile.mobile}`,`Owner: ${r.profile.owner}`,`City: ${r.profile.city}`,`Tag ID: ${r.tag||'No Tag'}`,`Date: ${new Date(r.date).toLocaleString()}`,'---','*Measurement:*',`Animal: ${r.animal} (${r.breed})`,`Girth (G): ${r.girth} cm`,`Length (L): ${r.length} cm`,'---','*Calculated Weights:*',`LIVE WEIGHT: ${r.weight.toFixed(2)} KG`,`TRADE WEIGHT: ${(r.weight/40).toFixed(2)} Maunds`,`MEAT ESTIMATE (50%): ~${(r.weight*.5).toFixed(2)} KG`,'',`Original formula: G² × L ÷ D (D=${r.density})`,'#LiveWeightCalculator #KhyberTraders #AnimalHealthPK'].join('\n');
}

function download(name,content,type){ const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([content],{type})); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
function exportCsv(){
  const r=state.result; const rows=[['Field','Value'],['Farm',r.profile.farm],['Mobile',r.profile.mobile],['Owner',r.profile.owner],['City',r.profile.city],['Animal',r.animal],['Breed',r.breed],['Divisor',r.density],['Tag ID',r.tag||'No Tag'],['Girth CM',r.girth],['Length CM',r.length],['Live Weight KG',r.weight.toFixed(2)],['Trade Weight Maunds',(r.weight/40).toFixed(2)],['Meat Estimate KG',(r.weight*.5).toFixed(2)]];
  download('livestock-weight-result.csv',rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n'),'text/csv;charset=utf-8');
}
function exportPdf(){ window.print(); }
function exportImage(){
  const r=state.result;
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><rect width="1080" height="1350" fill="#f7faf8"/><rect x="32" y="32" width="1016" height="185" rx="30" fill="#0f4d3f"/><text x="70" y="100" fill="#fff" font-size="40" font-family="Arial" font-weight="700">Pakistan Livestock Weight Calculator</text><text x="70" y="148" fill="#d8ebe3" font-size="22" font-family="Arial">Khyber Traders · AnimalHealth.PK</text><rect x="55" y="250" width="970" height="820" rx="28" fill="#fff" stroke="#dce7e1"/><text x="85" y="315" fill="#0f4d3f" font-size="30" font-family="Arial" font-weight="700">CALCULATION RESULT</text><text x="85" y="380" font-size="22" font-family="Arial">Farm: ${esc(r.profile.farm)}</text><text x="85" y="420" font-size="22" font-family="Arial">Animal: ${esc(r.animal)} · ${esc(r.breed)}</text><text x="85" y="460" font-size="22" font-family="Arial">Tag ID: ${esc(r.tag||'No Tag')}</text><text x="85" y="530" font-size="22" font-family="Arial">Girth: ${r.girth} cm</text><text x="85" y="570" font-size="22" font-family="Arial">Length: ${r.length} cm</text><text x="85" y="680" fill="#64756d" font-size="20" font-family="Arial">LIVE WEIGHT</text><text x="85" y="760" fill="#0f4d3f" font-size="70" font-family="Arial" font-weight="800">${r.weight.toFixed(2)} KG</text><text x="85" y="830" font-size="24" font-family="Arial">Trade Weight: ${(r.weight/40).toFixed(2)} Maunds</text><text x="85" y="870" font-size="24" font-family="Arial">Meat Estimate (~50%): ~${(r.weight*.5).toFixed(2)} KG</text><text x="85" y="980" fill="#4d6fe8" font-size="19" font-family="Arial">Original formula: G² × L ÷ D · Divisor ${r.density}</text><text x="85" y="1020" fill="#63716b" font-size="16" font-family="Arial">For estimation purposes only.</text></svg>`;
  download('livestock-weight-result.svg',svg,'image/svg+xml');
}

$('#profileForm').addEventListener('submit',e=>{
  e.preventDefault(); const p=profileInputs();
  if(Object.values(p).some(v=>!v)){ alert('Please complete all farm details. / براہ کرم تمام معلومات مکمل کریں۔'); return; }
  state.profile=p; write('plw-profile',p); loadProfile(); renderAnimals(); setStep(2);
});

$('#clearProfile').addEventListener('click',()=>{
  if(!confirm('Clear saved profile and history? / تمام محفوظ ڈیٹا صاف کریں؟')) return;
  remove('plw-profile'); remove('plw-history'); state.profile=null; state.result=null; state.animal=null; state.breed=null; loadProfile(); renderHistory(); setStep(1);
});

$('#backProfile').addEventListener('click',()=>setStep(1));
$('#backAnimal').addEventListener('click',()=>setStep(2));
$('#backBreed').addEventListener('click',()=>setStep(3));
$('#backMeasure').addEventListener('click',()=>setStep(4));
$('#newCalc').addEventListener('click',()=>{state.animal=null;state.breed=null;state.result=null;$('#measureForm').reset();renderAnimals();setStep(2);});
$('#historyBtn').addEventListener('click',showHistory);
$('#clearHistory').addEventListener('click',()=>{if(confirm('Delete all calculation history? / تمام ہسٹری حذف کریں؟')){remove('plw-history');renderHistory();}});

$('#measureForm').addEventListener('submit',e=>{
  e.preventDefault();
  const tag=$('#tagId').value.trim(); const girth=Number($('#girth').value); const length=Number($('#length').value); const error=$('#measureError');
  error.hidden=true;
  if(!Number.isFinite(girth)||!Number.isFinite(length)||girth<=0||length<=0){error.textContent='Enter valid positive measurements. / براہ کرم درست اور مثبت ناپ درج کریں۔';error.hidden=false;return;}
  if(girth<40||girth>300||length<30||length>300){error.textContent='Please check the measurements. Girth should be 40–300 cm and length 30–300 cm. / براہ کرم ناپ دوبارہ چیک کریں۔';error.hidden=false;return;}
  const b=selectedProfile(); if(!b) return;
  const weight=calculate(girth,length,b[3]);
  const item={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),date:new Date().toISOString(),profile:{...state.profile},animal:profiles[state.animal].name,breed:b[1],breedUr:b[2],tag,girth,length,density:b[3],weight:Number(weight.toFixed(2))};
  state.result=item; saveHistory(item); renderResult(item); setStep(5);
});

$('#imageBtn').addEventListener('click',exportImage);
$('#pdfBtn').addEventListener('click',exportPdf);
$('#csvBtn').addEventListener('click',exportCsv);
$('#whatsappBtn').addEventListener('click',()=>{if(state.result)window.open('https://wa.me/?text='+encodeURIComponent(resultText(state.result)),'_blank','noopener,noreferrer');});

$('#langBtn').addEventListener('click',()=>{
  state.lang=state.lang==='en'?'ur':'en'; write('plw-lang',state.lang);
  document.documentElement.lang=state.lang; document.documentElement.dir=state.lang==='ur'?'rtl':'ltr'; document.body.classList.toggle('rtl',state.lang==='ur');
  $('#langBtn').textContent=state.lang==='ur'?'English':'اردو';
});
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');write('plw-dark',document.body.classList.contains('dark'));});

function init(){
  loadProfile(); renderAnimals(); renderBreeds(); renderHistory();
  if(read('plw-dark')) document.body.classList.add('dark');
  document.documentElement.lang=state.lang; document.documentElement.dir=state.lang==='ur'?'rtl':'ltr'; document.body.classList.toggle('rtl',state.lang==='ur'); $('#langBtn').textContent=state.lang==='ur'?'English':'اردو';
  setStep(1);
}
init();