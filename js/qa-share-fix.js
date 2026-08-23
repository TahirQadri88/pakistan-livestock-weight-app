(() => {
  const $ = s => document.querySelector(s);
  const getHistory = () => {
    for (const key of ['plw-history-v2','plw-history']) {
      try { const v=JSON.parse(localStorage.getItem(key)||'[]'); if(Array.isArray(v)&&v.length)return v; } catch {}
    }
    return [];
  };
  const getResult = () => window.state?.result || getHistory()[0] || null;
  const toast = msg => { let n=$('#qaToast'); if(!n){n=document.createElement('div');n.id='qaToast';document.body.append(n);} n.textContent=msg;n.classList.add('show');clearTimeout(n._t);n._t=setTimeout(()=>n.classList.remove('show'),2600); };
  const text = r => ['*Pakistan Livestock Weight Calculation Result*','(Khyber Traders - AnimalHealth.PK)','', '*Farm Details:*',`Farm Name: ${r.profile?.farm||''}`,`Mobile Number: ${r.profile?.mobile||''}`,`Owner: ${r.profile?.owner||''}`,`City: ${r.profile?.city||''}`,`Tag ID: ${r.tag||'No Tag'}`,`Date: ${r.date?new Date(r.date).toLocaleString():''}`,'---','*Measurement:*',`Animal: ${r.animal||''} (${r.breed||''})`,`Girth (G): ${r.girth} cm`,`Length (L): ${r.length} cm`,'---','*Calculated Weights:*',`LIVE WEIGHT: ${Number(r.weight).toFixed(2)} KG`,`TRADE WEIGHT: ${(Number(r.weight)/40).toFixed(2)} Maunds`,`MEAT ESTIMATE (50%): ~${(Number(r.weight)*.5).toFixed(2)} KG`,'',`Original formula: G² × L ÷ D (D=${r.density})`,'#LiveWeightCalculator #KhyberTraders #AnimalHealthPK'].join('\n');
  const share = async () => { const r=getResult(); if(!r)return toast('Calculate a result first.'); const t=text(r); try{if(navigator.share){await navigator.share({title:'Pakistan Livestock Weight Calculation Result',text:t});return;}}catch(e){if(e?.name==='AbortError')return;} try{await navigator.clipboard.writeText(t);toast('Result copied to clipboard.');}catch{window.location.href='https://wa.me/?text='+encodeURIComponent(t);} };
  const whatsapp = () => { const r=getResult();if(!r)return toast('Calculate a result first.');window.location.href='https://wa.me/?text='+encodeURIComponent(text(r)); };
  const csv = () => {
    const r=getResult(); if(!r)return toast('Calculate a result first.');
    const rows=[['Field','Value'],['Farm Name',r.profile?.farm||''],['Mobile Number',r.profile?.mobile||''],['Owner',r.profile?.owner||''],['City',r.profile?.city||''],['Tag ID',r.tag||'No Tag'],['Date',r.date||''],['Animal',r.animal||''],['Breed',r.breed||''],['Density D',r.density||''],['Girth (cm)',r.girth||''],['Length (cm)',r.length||''],['Live Weight (kg)',Number(r.weight).toFixed(2)],['Trade Weight (Maunds)',(Number(r.weight)/40).toFixed(2)],['Meat Estimate (kg)',(Number(r.weight)*.5).toFixed(2)]];
    const body='\uFEFF'+rows.map(row=>row.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const blob=new Blob([body],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='pakistan-livestock-weight-result.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);toast('CSV exported successfully.');
  };
  const pdf = () => {
    const r=getResult(); if(!r)return toast('Calculate a result first.');
    const w=window.open('','_blank','noopener,noreferrer');
    if(!w){toast('Please allow pop-ups for PDF export.');return;}
    const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>Pakistan Livestock Weight Result</title><style>@page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#17352b;margin:0}.head{background:#087f5b;color:#fff;padding:24px;border-radius:14px}.head h1{margin:0 0 8px;font-size:25px}.head p{margin:0;font-size:14px}.hero{font-size:36px;font-weight:800;margin:24px 0;color:#087f5b}.grid{display:grid;grid-template-columns:1fr 1fr;border:1px solid #d9e4de;border-radius:10px;overflow:hidden}.row{display:contents}.k,.v{padding:11px 14px;border-bottom:1px solid #e6ece8}.k{font-weight:700;background:#f3f8f5}.note{margin-top:18px;padding:14px;background:#eef6ff;border-left:4px solid #2563eb}.foot{margin-top:30px;font-size:12px;color:#64746c}@media print{.no-print{display:none}}</style></head><body><div class="head"><h1>Pakistan Livestock Weight Calculation Result</h1><p>Khyber Traders · AnimalHealth.PK</p></div><div class="hero">LIVE WEIGHT: ${Number(r.weight).toFixed(2)} KG</div><div class="grid">${[['Farm Name',r.profile?.farm],['Mobile Number',r.profile?.mobile],['Owner',r.profile?.owner],['City',r.profile?.city],['Animal',`${r.animal||''} / ${r.breed||''}`],['Tag ID',r.tag||'No Tag'],['Girth (G)',`${r.girth} cm`],['Length (L)',`${r.length} cm`],['Trade Weight',`${(Number(r.weight)/40).toFixed(2)} Maunds`],['Meat Estimate (50%)',`~${(Number(r.weight)*.5).toFixed(2)} KG`]].map(x=>`<div class="k">${esc(x[0])}</div><div class="v">${esc(x[1])}</div>`).join('')}</div><div class="note">Original formula: G² × L ÷ D &nbsp;·&nbsp; D = ${esc(r.density)}<br>For estimation purposes only.</div><div class="foot">Khyber Traders · AnimalHealth.PK</div><script>window.onload=()=>setTimeout(()=>window.print(),250);</script></body></html>`);w.document.close();
  };
  const icons={cattle:'assets/animals/cattle-realistic.svg',buffalo:'assets/animals/buffalo-realistic.svg',sheep:'assets/animals/sheep-realistic.svg',goat:'assets/animals/goat-realistic.svg'};
  const applyIcons=()=>document.querySelectorAll('#animalGrid .choice-card').forEach(card=>{const key=(card.getAttribute('aria-label')||'').toLowerCase().split(/\s|\//)[0];const k=Object.keys(icons).find(x=>key.includes(x));const box=card.querySelector('.animal-icon');if(box&&k){box.innerHTML=`<img class="realistic-animal-icon" src="${icons[k]}?v=2" alt="${k}" loading="eager">`;box.dataset.realistic='true';}});
  const bind=()=>{applyIcons(); const actions={shareResultBtn:share,whatsappBtn:whatsapp,csvBtn:csv,pdfBtn:pdf}; Object.entries(actions).forEach(([id,fn])=>{const b=$('#'+id);if(b){b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();fn();};b.dataset.qaFinal='1';}}); document.querySelectorAll('#shareResultBtn').forEach((b,i)=>{if(i>0)b.remove();});};
  const boot=()=>{applyIcons();bind();};
  document.addEventListener('DOMContentLoaded',boot); new MutationObserver(()=>{applyIcons();bind();}).observe(document.body,{subtree:true,childList:true});
})();
