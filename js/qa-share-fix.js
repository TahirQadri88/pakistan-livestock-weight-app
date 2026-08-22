(() => {
  const $ = s => document.querySelector(s);
  const historyKeys = ['plw-history-v2', 'plw-history'];
  const getHistory = () => {
    for (const key of historyKeys) {
      try {
        const value = JSON.parse(localStorage.getItem(key) || '[]');
        if (Array.isArray(value) && value.length) return value;
      } catch {}
    }
    return [];
  };
  const getResult = () => getHistory()[0] || null;
  const resultText = () => {
    const r = getResult();
    if (!r) return '';
    const date = r.date ? new Date(r.date).toLocaleString('en-GB', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}) : '';
    return [
      'Pakistan Livestock Weight Calculation Result',
      '(Khyber Traders - AnimalHealth.PK)', '',
      'Farm Details:',
      `Farm Name: ${r.profile?.farm || ''}`,
      `Mobile Number: ${r.profile?.mobile || ''}`,
      `Owner: ${r.profile?.owner || ''}`,
      `City: ${r.profile?.city || ''}`,
      `Tag ID: ${r.tag || 'No Tag'}`,
      `Date: ${date}`, '---',
      'Measurement:',
      `Animal: ${r.animal || ''} (${r.breed || ''})`,
      `Girth (G): ${r.girth} cm`,
      `Length (L): ${r.length} cm`, '---',
      'Calculated Weights:',
      `LIVE WEIGHT: ${Number(r.weight).toFixed(2)} KG`,
      `TRADE WEIGHT: ${(Number(r.weight) / 40).toFixed(2)} Maunds`,
      `MEAT ESTIMATE (50%): ~${(Number(r.weight) * 0.5).toFixed(2)} KG`, '',
      `Confidence Note: Calculated using ${r.breed || 'selected'} density profile (D=${r.density}).`, '',
      '#LiveWeightCalculator #KhyberTraders #AnimalHealthPK'
    ].join('\n');
  };
  const toast = msg => {
    let n = $('#qaToast');
    if (!n) { n = document.createElement('div'); n.id='qaToast'; document.body.append(n); }
    n.textContent = msg; n.classList.add('show'); clearTimeout(n._t);
    n._t = setTimeout(() => n.classList.remove('show'), 2600);
  };
  const whatsapp = () => {
    const t = resultText(); if (!t) return toast('Calculate a result first.');
    const u = 'https://wa.me/?text=' + encodeURIComponent(t);
    const w = window.open(u, '_blank', 'noopener,noreferrer');
    if (!w) window.location.href = u;
  };
  const share = async () => {
    const t = resultText(); if (!t) return toast('Calculate a result first.');
    if (navigator.share) {
      try { await navigator.share({title:'Pakistan Livestock Weight Calculation Result', text:t}); return; }
      catch (e) { if (e?.name === 'AbortError') return; }
    }
    try { await navigator.clipboard.writeText(t); toast('Result copied. Paste it into WhatsApp or any app.'); }
    catch { whatsapp(); }
  };
  const csv = () => {
    const r = getResult(); if (!r) return toast('Calculate a result first.');
    const rows = [['Field','Value'],['Farm',r.profile?.farm||''],['Mobile',r.profile?.mobile||''],['Owner',r.profile?.owner||''],['City',r.profile?.city||''],['Tag ID',r.tag||'No Tag'],['Date',r.date||''],['Animal',r.animal||''],['Breed',r.breed||''],['Divisor',r.density||''],['Girth CM',r.girth||''],['Length CM',r.length||''],['Live Weight KG',Number(r.weight).toFixed(2)],['Trade Weight Maunds',(Number(r.weight)/40).toFixed(2)],['Meat Estimate KG',(Number(r.weight)*.5).toFixed(2)]];
    const body = rows.map(row => row.map(v => '"' + String(v).replaceAll('"','""') + '"').join(',')).join('\n');
    const a = document.createElement('a'), u = URL.createObjectURL(new Blob([body],{type:'text/csv;charset=utf-8'}));
    a.href=u; a.download='livestock-weight-result.csv'; document.body.append(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(u),1000); toast('CSV exported.');
  };
  const pdf = () => { if (!getResult()) return toast('Calculate a result first.'); window.print(); };

  // A real PNG is rendered directly to Canvas. No SVG is downloaded or shared.
  const buildPng = async () => {
    const r = getResult(); if (!r) throw new Error('NO_RESULT');
    const W = 1080, H = 1350, dpr = 2;
    const canvas = document.createElement('canvas'); canvas.width=W*dpr; canvas.height=H*dpr;
    const c = canvas.getContext('2d'); c.scale(dpr,dpr);
    const green='#087f5b', dark='#12352a', cream='#f7f5ef', pale='#eaf8f1', gold='#f4c542', blue='#2563eb';
    c.fillStyle=cream; c.fillRect(0,0,W,H);
    c.fillStyle=green; c.beginPath(); c.roundRect(36,36,W-72,180,28); c.fill();
    c.fillStyle='#fff'; c.font='700 38px Arial, sans-serif'; c.fillText('Pakistan Livestock Weight Calculator',72,92);
    c.font='500 22px Arial, sans-serif'; c.fillText('G² × L ÷ D · Original calculation profile',72,130);
    c.font='600 20px Arial, sans-serif'; c.fillText(`Farm: ${r.profile?.farm||''}`,72,172);
    c.fillStyle='#fff'; c.font='500 19px Arial, sans-serif'; c.fillText(`${r.animal||''} · ${r.breed||''} · Tag ${r.tag||'No Tag'}`,72,200);
    c.fillStyle='#fff'; c.font='700 34px Arial, sans-serif'; c.fillText('LIVE WEIGHT',72,284);
    c.fillStyle=green; c.font='800 72px Arial, sans-serif'; c.fillText(`${Number(r.weight).toFixed(2)} KG`,72,365);
    const rows=[
      ['Farm',r.profile?.farm||''],['Mobile',r.profile?.mobile||''],['Owner',r.profile?.owner||''],['City',r.profile?.city||''],['Animal',`${r.animal||''} / ${r.breed||''}`],['Tag ID',r.tag||'No Tag'],['Girth (G)',`${r.girth} cm`],['Length (L)',`${r.length} cm`],['Trade Weight',`${(Number(r.weight)/40).toFixed(2)} Maunds`],['Meat Estimate (~50%)',`~${(Number(r.weight)*.5).toFixed(2)} KG`]
    ];
    let y=430;
    rows.forEach(([k,v],i)=>{c.fillStyle=i%2?pale:'#fff';c.fillRect(58,y-31,W-116,62);c.fillStyle=dark;c.font='600 22px Arial, sans-serif';c.fillText(k,82,y+7);c.font='500 22px Arial, sans-serif';c.fillText(String(v),500,y+7);y+=62;});
    c.fillStyle='#eff6ff'; c.beginPath(); c.roundRect(58,y+8,W-116,112,18); c.fill();
    c.strokeStyle='#93c5fd'; c.lineWidth=3; c.stroke();
    c.fillStyle=blue; c.font='700 20px Arial, sans-serif'; c.fillText(`Original ${r.breed||'selected'} density profile · D = ${r.density}`,82,y+52);
    c.font='500 18px Arial, sans-serif'; c.fillText('For estimation purposes only.',82,y+84);
    c.fillStyle='#5b6b63'; c.font='500 18px Arial, sans-serif'; c.fillText('Khyber Traders · AnimalHealth.PK',72,H-55);
    return await new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('PNG_FAILED')),'image/png',1));
  };
  const image = async () => {
    try {
      const blob = await buildPng();
      const file = new File([blob], 'pakistan-livestock-weight-result.png', {type:'image/png'});
      const text = resultText();
      if (navigator.share && navigator.canShare && navigator.canShare({files:[file]})) {
        try { await navigator.share({title:'Pakistan Livestock Weight Result',text,files:[file]}); toast('Result image shared.'); return; }
        catch (e) { if (e?.name === 'AbortError') return; }
      }
      const url=URL.createObjectURL(blob), a=document.createElement('a');
      a.href=url; a.download=file.name; document.body.append(a); a.click(); a.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1500);
      toast('PNG image saved. You can share it from Photos/Files.');
    } catch { toast('Image export failed. Please try Share Result or PDF.'); }
  };

  // Clean, standard-style livestock pictograms: consistent stroke, silhouette cues and no cartoon faces.
  const art = {
    cattle:`<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M12 31c0-9 8-16 20-16h8c7 0 12 4 14 10l5 2c2 1 2 4 0 5l-6 4c-3 2-7 3-11 3H27c-9 0-15-3-15-8Z" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M45 20l6-7 3 9M19 20l-7-6-1 9M48 30h.1M55 31c3 1 5 3 4 6M23 45v8M39 45v8M49 43v9" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 38c3 2 5 3 8 2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    buffalo:`<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M11 32c0-10 8-17 21-17h7c8 0 13 5 15 11l6 2c2 1 2 4 0 5l-6 5c-4 3-8 4-14 4H27c-10 0-16-4-16-10Z" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M20 20C14 12 8 10 4 15c6-1 11 2 15 8M44 20c6-8 12-10 16-5-6-1-11 2-15 8M48 31h.1M54 33c3 1 5 3 5 6M22 45v9M38 45v9M49 44v10" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M50 39c3 2 6 3 9 1" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    sheep:`<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M17 39c-5-2-6-8-2-11-2-6 5-10 10-7 3-6 12-5 14 1 6-2 11 4 8 9 5 4 1 11-5 10-3 6-12 6-15 1-5 3-10 1-10-3Z" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M47 31c5-2 10 0 11 5-2 4-6 5-10 4M20 43v10M38 43v10M49 43v10" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    goat:`<svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M16 31c0-10 8-16 19-16h6c7 0 12 4 14 10l4 2c3 1 3 5 0 6l-5 3c-3 3-7 4-12 4H29c-9 0-13-4-13-9Z" stroke="currentColor" stroke-width="2.8" stroke-linejoin="round"/><path d="M23 19c-5-7-5-12-1-15 0 6 3 10 8 13M42 18c4-7 4-12 0-15 0 6-3 10-7 13M49 30h.1M55 32c3 1 4 3 4 5M26 44v10M41 44v10M50 43v10" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/><path d="M51 39c3 2 5 2 8 0" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`
  };
  const applyAnimalArt=()=>document.querySelectorAll('#animalGrid .choice-card').forEach(b=>{const label=(b.getAttribute('aria-label')||'').toLowerCase();const k=Object.keys(art).find(x=>label.includes(x));const box=b.querySelector('.animal-icon');if(box&&k&&box.dataset.polished!=='1'){box.innerHTML=art[k];box.dataset.polished='1';}});
  const bind=()=>{const map={shareResultBtn:share,whatsappBtn:whatsapp,csvBtn:csv,pdfBtn:pdf,imageBtn:image};Object.entries(map).forEach(([id,fn])=>{const b=$('#'+id);if(!b||b.dataset.qaBound)return;b.dataset.qaBound='1';b.onclick=e=>{e.preventDefault();e.stopImmediatePropagation();Promise.resolve(fn()).catch(()=>toast('Action failed. Please try again.'));};});applyAnimalArt();};
  const addShareButton=()=>{const actions=$('.result-actions'),wa=$('#whatsappBtn');if(actions&&wa&&!$('#shareResultBtn')){const b=document.createElement('button');b.id='shareResultBtn';b.className='action blue';b.type='button';b.textContent='↗ Share Result';actions.insertBefore(b,wa);}bind();};
  document.addEventListener('DOMContentLoaded',()=>{addShareButton();new MutationObserver(addShareButton).observe(document.body,{subtree:true,childList:true});});
})();
