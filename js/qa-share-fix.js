(() => {
  const $ = (s) => document.querySelector(s);
  const textOf = (el) => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
  const getResult = () => $('#resultCard');
  const resultText = () => {
    const card = getResult();
    if (!card || !textOf(card)) return '';
    return `Pakistan Livestock Weight Calculation Result\n${textOf(card)}`;
  };
  const notify = (msg) => {
    let n = $('#qaToast');
    if (!n) { n = document.createElement('div'); n.id = 'qaToast'; n.setAttribute('role','status'); document.body.appendChild(n); }
    n.textContent = msg; n.classList.add('show'); clearTimeout(n._t); n._t = setTimeout(() => n.classList.remove('show'), 2600);
  };
  const download = (blob, name) => {
    if (!blob) return notify('Export could not be created.');
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href=url; a.download=name; a.rel='noopener'; a.style.display='none'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  };
  const whatsapp = () => {
    const text = resultText(); if (!text) return notify('Calculate a result first.');
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    const w = window.open(url, '_blank');
    if (!w) window.location.href = url;
  };
  const nativeShare = async () => {
    const text = resultText(); if (!text) return notify('Calculate a result first.');
    if (!navigator.share) return false;
    try {
      await navigator.share({title:'Pakistan Livestock Weight Result',text});
      notify('Result shared.');
      return true;
    } catch(e) {
      if (e?.name === 'AbortError') return true;
      return false;
    }
  };
  const share = async () => {
    const text = resultText(); if (!text) return notify('Calculate a result first.');
    if (await nativeShare()) return;
    try {
      await navigator.clipboard.writeText(text);
      notify('Result copied. You can paste it into WhatsApp or any app.');
      return;
    } catch(e) {}
    whatsapp();
  };
  const csv = () => {
    const card=getResult(); if(!card) return notify('Calculate a result first.');
    const rows=[...card.querySelectorAll('tr')].map(tr=>[...tr.children].map(td=>`"${textOf(td).replace(/"/g,'""')}"`).join(','));
    download(new Blob(['"Pakistan Livestock Weight Calculation Result"\n',...rows].join('\n'),{type:'text/csv;charset=utf-8'}),'livestock-weight-result.csv'); notify('CSV exported.');
  };
  const pdf = () => { if(!getResult()) return notify('Calculate a result first.'); window.print(); };
  const image = async () => {
    const card=getResult(); if(!card) return notify('Calculate a result first.');
    /* Reliable fallback for iOS Safari: render the result as a printable SVG card without foreignObject. */
    const lines=textOf(card).match(/.{1,62}(?:\s|$)/g)||['Pakistan Livestock Weight Calculation Result'];
    const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const width=1080, lineH=42, height=Math.max(720,180+lines.length*lineH);
    const body=lines.map((l,i)=>`<text x="72" y="${170+i*lineH}" font-family="Arial,sans-serif" font-size="${i===0?34:25}" font-weight="${i===0?700:400}" fill="#12352a">${esc(l)}</text>`).join('');
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><rect width="100%" height="100%" rx="32" fill="#f7f4ec"/><rect x="40" y="40" width="1000" height="100" rx="24" fill="#0b5a43"/><text x="72" y="105" font-family="Arial,sans-serif" font-size="32" font-weight="700" fill="#fff">Pakistan Livestock Weight</text>${body}</svg>`;
    const blob=new Blob([svg],{type:'image/svg+xml;charset=utf-8'}); download(blob,'livestock-weight-result.svg'); notify('Result image exported as SVG.');
  };
  const bind = () => {
    const selectors={
      share:'#shareBtn', whatsapp:'#whatsappBtn', image:'#imageBtn', pdf:'#pdfBtn', csv:'#csvBtn'
    };
    const handlers={share,whatsapp,image,pdf,csv};
    Object.entries(selectors).forEach(([key,sel])=>{
      const b=$(sel); if(!b || b.dataset.qaBound) return;
      b.dataset.qaBound='1'; b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();handlers[key]();},true);
    });
    /* Compatibility for older markup where Share Result has no id. */
    if(!$('#shareBtn')) [...document.querySelectorAll('button')].find(b=>/share result|شیئر کریں/i.test(textOf(b)))?.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();share();},true);
  };
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind); else bind();
  new MutationObserver(bind).observe(document.body,{subtree:true,childList:true});
})();
