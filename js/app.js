const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const profiles = {
  cattle: {name:'Cattle',ur:'گائے / بیل',breeds:[['general','General / Desi','جنرل / دیسی',10840],['sahiwal','Sahiwal','ساہیوال',10840],['cholistani','Cholistani','چولستانی',10840],['red-sindhi','Red Sindhi','ریڈ سندھی',10840],['crossbred','Crossbred','کراس بریڈ',10840]]},
  buffalo: {name:'Buffalo',ur:'بھینس',breeds:[['nili-ravi','Nili-Ravi / Kundi','نیلی راوی / کنڈی (بھاری نسل)',10400],['general','General / Desi','جنرل / دیسی (معیاری)',10840]]},
  sheep: {name:'Sheep',ur:'بھیڑ',breeds:[['kajli','Kajli','کاجلی',10840],['lohi','Lohi','لوہی',10840],['thalli','Thalli','تھلی',10840],['general','General / Desi','جنرل / دیسی',10840]]},
  goat: {name:'Goat',ur:'بکری',breeds:[['beetal','Beetal','بیٹل',10840],['kamori','Kamori','کاموری',10840],['teddy','Teddy','ٹیڈی',10840],['general','General / Desi','جنرل / دیسی',10840]]}
};
const animalSvgs = {
  cattle:'<svg viewBox="0 0 48 48"><path d="M11 20c0-6 5-10 13-10s13 4 13 10v8c0 7-5 11-13 11s-13-4-13-11v-8Z"/><path d="M14 18 9 12M34 18l5-6M18 24h.1M30 24h.1M21 30c2 1.6 4 1.6 6 0M15 39v4M33 39v4"/></svg>',
  buffalo:'<svg viewBox="0 0 48 48"><path d="M13 19c-5-7-7-7-9-6M35 19c5-7 7-7 9-6M11 20c1-6 6-10 13-10s12 4 13 10v8c0 7-5 11-13 11s-13-4-13-11v-8Z"/><path d="M18 24h.1M30 24h.1M21 30c2 1.6 4 1.6 6 0M15 39v4M33 39v4"/></svg>',
  sheep:'<svg viewBox="0 0 48 48"><path d="M10 31c-4-2-3-8 1-10-2-5 5-8 9-5 3-5 11-2 11 3 5-2 9 4 5 8 3 5-3 9-7 7-3 5-11 3-12-1-4 2-8 0-7-2Z"/><path d="M14 34v7M33 34v7M36 30h5"/></svg>',
  goat:'<svg viewBox="0 0 48 48"><path d="M14 18 10 9l8 5M34 18l4-9-8 5M12 19c1-6 6-10 12-10s11 4 12 10v9c0 7-5 11-12 11s-12-4-12-11v-9Z"/><path d="M18 24h.1M30 24h.1M21 30c2 1.6 4 1.6 6 0M16 39v4M32 39v4"/></svg>'
};

const state = {step:1, animal:null, breed:null, profile:read('plw-profile')||null, result:null, lang:read('plw-lang')||'en'};
function read(k){try{return JSON.parse(localStorage.getItem(k));}catch{return null;}}
function write(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch{}}
function remove(k){try{localStorage.removeItem(k);}catch{}}
function history(){return read('plw-history')||[];}
function saveHistory(item){const list=history().filter(x=>x.id!==item.id);list.unshift(item);write('plw-history',list.slice(0,30));}
function setStep(n){state.step=n;['step1','step2','breedStep','step3','step4'].forEach((id,i)=>{const el=$('#'+id);if(el)el.hidden=i!==n-1;});window.scrollTo({top:0,behavior:'smooth'});}
function animalName(key){const p=profiles[key];return p?`${p.name} / ${p.ur}`:key;}
function selectedProfile(){return profiles[state.animal]?.breeds.find(b=>b[0]===state.breed);}

function renderAnimals(){
  const grid=$('#animalGrid');grid.replaceChildren();Object.entries(profiles).forEach(([key,p],i)=>{
    const card=document.createElement('button');card.type='button';card.className='choice-card'+(state.animal===key?' selected':'');card.innerHTML=`<span class="animal-icon" aria-hidden="true">${animalSvgs[key]}</span><strong>${p.name}</strong><small>${p.ur}</small><span class="number">0${i+1}</span>`;card.addEventListener('click',()=>{state.animal=key;state.breed=null;renderAnimals();renderBreeds();setStep(3);});grid.append(card);
  });
}
function renderBreeds(){
  const grid=$('#breedGrid');grid.replaceChildren();if(!state.animal)return;
  const p=profiles[state.animal];$('#breedTitle').innerHTML=`Select Breed Profile <span>/ ${p.ur}</span>`;$('#breedIntro').textContent='Choose the closest available profile for better estimation.';
  p.breeds.forEach(b=>{const card=document.createElement('button');card.type='button';card.className='breed-card'+(state.breed===b[0]?' selected':'');card.innerHTML=`<strong>${b[1]}</strong><span>${b[2]}</span>`;card.addEventListener('click',()=>{state.breed=b[0];updateContext();setStep(4);});grid.append(card);});
}
function updateContext(){const p=profiles[state.animal],b=selectedProfile();$('#contextStrip').innerHTML=`<span class="context-chip">${p.name}</span><span class="context-chip">${b?b[1]:''}</span><span class="context-chip">G² × L ÷ D</span>`;}
function profileForm(){if(state.profile){$('#farmName').value=state.profile.farm||'';$('#mobile').value=state.profile.mobile||'';$('#owner').value=state.profile.owner||'';$('#city').value=state.profile.city||'';}}
function showHistory(){const panel=$('#historyPanel');panel.hidden=!panel.hidden;renderHistory();if(!panel.hidden)panel.scrollIntoView({behavior:'smooth'});}
function renderHistory(){const list=$('#historyList');list.replaceChildren();const items=history();if(!items.length){const e=document.createElement('div');e.className='empty-history';e.textContent='No calculations saved yet. Your recent estimates will appear here.';list.append(e);return;}items.forEach(item=>{const row=document.createElement('div');row.className='history-row';const main=document.createElement('div');const title=document.createElement('strong');title.textContent=`${item.animal} · ${item.breed}`;const meta=document.createElement('small');meta.textContent=`${item.tag||'No Tag'} · G ${item.girth} cm × L ${item.length} cm · ${new Date(item.date).toLocaleString()}`;main.append(title,meta);const w=document.createElement('span');w.className='weight';w.textContent=`${item.weight.toFixed(2)} KG`;row.append(main,w);row.addEventListener('click',()=>{state.result=item;renderResult(item);setStep(5);});list.append(row);});}
function calculate(g,l,d){return (g*g*l)/d;}
function renderResult(r){
  const meat=r.weight*.5, maund=r.weight/40;
  $('#resultCard').innerHTML=`<div class="result-top"><div class="title">Pakistan Livestock Weight Calculator</div><small>Results calculated using the G² × L ÷ D formula.</small></div><div class="result-info"><strong>Farm:</strong> ${esc(r.profile.farm)} &nbsp; | &nbsp; <strong>Mobile:</strong> ${esc(r.profile.mobile)}<br><strong>Owner:</strong> ${esc(r.profile.owner)} &nbsp; | &nbsp; <strong>City:</strong> ${esc(r.profile.city)}<br><strong>Animal:</strong> ${esc(r.animal)} / ${esc(r.breed)} &nbsp; | &nbsp; <strong>Tag ID:</strong> ${esc(r.tag||'No Tag')}<br><strong>Date:</strong> ${new Date(r.date).toLocaleString()}</div><table class="result-table"><thead><tr><th>Parameter</th><th>Result</th></tr></thead><tbody><tr><td>Breed Profile</td><td>${esc(r.breed)}</td></tr><tr><td>Girth (G) × Length (L)</td><td>${r.girth} cm × ${r.length} cm</td></tr><tr><td>Live Weight</td><td class="big">${r.weight.toFixed(2)} KG</td></tr><tr><td>Trade Weight</td><td>${maund.toFixed(2)} Maunds</td></tr><tr><td>Meat Estimate (~50%)</td><td>~${meat.toFixed(2)} KG</td></tr></tbody></table><div class="result-note">Calculated using the selected ${esc(r.breed)} density profile (D = ${r.density}).</div><div class="result-credit">Khyber Traders · AnimalHealth.PK · For estimation purposes only</div>`;
}
function esc(v){const d=document.createElement('div');d.textContent=v??'';return d.innerHTML;}
function resultText(r){return `*Pakistan Livestock Weight Calculation Result*\n(Khyber Traders - AnimalHealth.PK)\n\n*Farm Details:*\nFarm Name: ${r.profile.farm}\nMobile Number: ${r.profile.mobile}\nOwner: ${r.profile.owner}\nCity: ${r.profile.city}\nTag ID: ${r.tag||'No Tag'}\nDate: ${new Date(r.date).toLocaleString()}\n---\n*Measurement:*\nAnimal: ${r.animal}\nBreed Profile: ${r.breed}\nGirth (G): ${r.girth} cm\nLength (L): ${r.length} cm\n---\n*Calculated Weights:*\nLIVE WEIGHT: ${r.weight.toFixed(2)} KG\nTRADE WEIGHT: ${(r.weight/40).toFixed(2)} Maunds\nMEAT ESTIMATE (50%): ~${(r.weight*.5).toFixed(2)} KG\n\nCalculated using the selected density profile (D=${r.density}).\n#LiveWeightCalculator #KhyberTraders #AnimalHealthPK`;}
function download(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}
function exportCsv(){const r=state.result;const rows=[['Field','Value'],['Farm',r.profile.farm],['Mobile',r.profile.mobile],['Owner',r.profile.owner],['City',r.profile.city],['Animal',r.animal],['Breed',r.breed],['Tag ID',r.tag||'No Tag'],['Girth CM',r.girth],['Length CM',r.length],['Live Weight KG',r.weight.toFixed(2)],['Trade Weight Maunds',(r.weight/40).toFixed(2)],['Meat Estimate KG',(r.weight*.5).toFixed(2)]];download('livestock-weight-result.csv',rows.map(x=>x.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(',')).join('\n'),'text/csv');}
function exportPdf(){window.print();}
function exportImage(){const r=state.result;const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><rect width="1080" height="1350" fill="#ffffff"/><rect x="30" y="30" width="1020" height="170" rx="28" fill="#087a5a"/><text x="70" y="90" fill="white" font-size="36" font-family="Arial" font-weight="700">Pakistan Livestock Weight Calculator</text><text x="70" y="135" fill="#dcece5" font-size="20" font-family="Arial">Khyber Traders · AnimalHealth.PK</text><rect x="50" y="235" width="980" height="820" rx="24" fill="#f7faf8" stroke="#dfe8e2"/><text x="80" y="300" font-size="28" font-family="Arial" font-weight="700">CALCULATION RESULT</text><text x="80" y="370" font-size="22" font-family="Arial">Farm: ${esc(r.profile.farm)}</text><text x="80" y="410" font-size="22" font-family="Arial">Animal: ${esc(r.animal)} · ${esc(r.breed)}</text><text x="80" y="450" font-size="22" font-family="Arial">Tag ID: ${esc(r.tag||'No Tag')}</text><text x="80" y="520" font-size="22" font-family="Arial">Girth: ${r.girth} cm</text><text x="80" y="560" font-size="22" font-family="Arial">Length: ${r.length} cm</text><text x="80" y="680" font-size="30" font-family="Arial" font-weight="700">LIVE WEIGHT</text><text x="80" y="755" fill="#087a5a" font-size="70" font-family="Arial" font-weight="800">${r.weight.toFixed(2)} KG</text><text x="80" y="825" font-size="24" font-family="Arial">Trade Weight: ${(r.weight/40).toFixed(2)} Maunds</text><text x="80" y="865" font-size="24" font-family="Arial">Meat Estimate (~50%): ~${(r.weight*.5).toFixed(2)} KG</text><text x="80" y="990" fill="#4d6fe8" font-size="19" font-family="Arial">Calculated using G² × L ÷ D profile formula.</text><text x="80" y="1025" fill="#63716b" font-size="16" font-family="Arial">For estimation purposes only.</text></svg>`;const blob=new Blob([svg],{type:'image/svg+xml'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='livestock-weight-result.svg';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

function escProfileInputs(){return {farm:$('#farmName').value.trim(),mobile:$('#mobile').value.trim(),owner:$('#owner').value.trim(),city:$('#city').value.trim()};}
$('#profileForm').addEventListener('submit',e=>{e.preventDefault();const p=escProfileInputs();if(Object.values(p).some(v=>!v)){alert('Please complete all farm details. / براہ کرم تمام معلومات مکمل کریں۔');return;}state.profile=p;write('plw-profile',p);renderAnimals();setStep(2);});
$('#clearProfile').addEventListener('click',()=>{if(confirm('Clear saved profile and history? / تمام محفوظ ڈیٹا صاف کریں؟')){remove('plw-profile');remove('plw-history');state.profile=null;renderHistory();profileForm();}});
$('#backProfile').addEventListener('click',()=>setStep(1));
$('#backAnimal').addEventListener('click',()=>setStep(2));
$('#backBreed').addEventListener('click',()=>setStep(3));
$('#backMeasure').addEventListener('click',()=>setStep(4));
$('#newCalc').addEventListener('click',()=>{state.animal=null;state.breed=null;state.result=null;$('#measureForm').reset();renderAnimals();setStep(2);});
$('#historyBtn').addEventListener('click',showHistory);
$('#clearHistory').addEventListener('click',()=>{remove('plw-history');renderHistory();});
$('#langBtn').addEventListener('click',()=>{state.lang=state.lang==='en'?'ur':'en';write('plw-lang',state.lang);document.body.classList.toggle('rtl',state.lang==='ur');document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ur'?'rtl':'ltr';$('#langBtn').textContent=state.lang==='ur'?'English':'اردو';});
$('#themeBtn').addEventListener('click',()=>{document.body.classList.toggle('dark');write('plw-theme',document.body.classList.contains('dark')?'dark':'light');});
$('#measureForm').addEventListener('submit',e=>{e.preventDefault();const g=Number($('#girth').value),l=Number($('#length').value),p=selectedProfile();const err=[];if(!Number.isFinite(g)||g<40||g>300)err.push('Heart Girth must be between 40 and 300 cm.');if(!Number.isFinite(l)||l<30||l>300)err.push('Body Length must be between 30 and 300 cm.');$('#measureError').hidden=!err.length;$('#measureError').textContent=err.join(' ');if(err.length)return;const weight=calculate(g,l,p[3]);state.result={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),profile:state.profile,animal:profiles[state.animal].name,breed:p[1],density:p[3],tag:$('#tagId').value.trim(),girth:g,length:l,weight,date:new Date().toISOString()};saveHistory(state.result);renderResult(state.result);setStep(5);});
$('#whatsappBtn').addEventListener('click',()=>{if(!state.result)return;window.open('https://wa.me/?text='+encodeURIComponent(resultText(state.result)),'_blank','noopener');});
$('#csvBtn').addEventListener('click',exportCsv);$('#pdfBtn').addEventListener('click',exportPdf);$('#imageBtn').addEventListener('click',exportImage);

if(read('plw-theme')==='dark')document.body.classList.add('dark');document.body.classList.toggle('rtl',state.lang==='ur');document.documentElement.lang=state.lang;document.documentElement.dir=state.lang==='ur'?'rtl':'ltr';$('#langBtn').textContent=state.lang==='ur'?'English':'اردو';profileForm();renderAnimals();renderHistory();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
