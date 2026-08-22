(() => {
  const $ = (s) => document.querySelector(s);
  const textOf = (el) => (el?.innerText || el?.textContent || '').replace(/\s+/g, ' ').trim();
  const resultText = () => {
    const card = $('#resultCard');
    if (card && textOf(card)) return `Pakistan Livestock Weight Calculation Result\n${textOf(card)}`;
    return 'Pakistan Livestock Weight Calculation Result';
  };
  const download = (blob, name) => {
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href = url; a.download = name; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };
  const notify = (msg) => {
    let n = $('#qaToast');
    if (!n) { n = document.createElement('div'); n.id = 'qaToast'; n.setAttribute('role','status'); document.body.appendChild(n); }
    n.textContent = msg; n.classList.add('show'); clearTimeout(n._t); n._t = setTimeout(() => n.classList.remove('show'), 2600);
  };
  const csv = () => {
    const card = $('#resultCard'); if (!card) return notify('Calculate a result first.');
    const rows = [...card.querySelectorAll('tr')].map(tr => [...tr.children].map(td => `"${textOf(td).replace(/"/g,'""')}"`).join(','));
    const csv = ['"Pakistan Livestock Weight Calculation Result"', ...rows].join('\n');
    download(new Blob([csv], {type:'text/csv;charset=utf-8'}), 'livestock-weight-result.csv'); notify('CSV exported.');
  };
  const printPdf = () => { if (!$('#resultCard')) return notify('Calculate a result first.'); window.print(); };
  const whatsapp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(resultText())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  const share = async () => {
    const data = {title:'Pakistan Livestock Weight Calculator', text:resultText(), url:location.href};
    try {
      if (navigator.share) { await navigator.share(data); notify('Share sheet opened.'); return; }
    } catch (e) { if (e?.name === 'AbortError') return; }
    try { await navigator.clipboard.writeText(resultText()); notify('Result copied. Paste it anywhere to share.'); }
    catch { whatsapp(); }
  };
  const svgImage = () => {
    const card = $('#resultCard'); if (!card) return notify('Calculate a result first.');
    const clone = card.cloneNode(true); clone.querySelectorAll('script').forEach(x=>x.remove());
    const html = new XMLSerializer().serializeToString(clone);
    const w = 900, h = Math.max(1200, Math.ceil(card.getBoundingClientRect().height * 1.6));
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Arial,sans-serif;padding:30px;background:#f3f1ea;box-sizing:border-box;min-height:100%;">${html}</div></foreignObject></svg>`;
    const img = new Image(); img.onload = () => { const c=document.createElement('canvas'); c.width=w*2;c.height=h*2; const x=c.getContext('2d'); x.fillStyle='#f3f1ea';x.fillRect(0,0,c.width,c.height);x.scale(2,2);x.drawImage(img,0,0,w,h); c.toBlob(b=>download(b,'livestock-weight-result.png'),'image/png'); }; img.onerror=()=>notify('Image export is not supported in this browser. Use Print/PDF instead.'); img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  };
  const bind = () => {
    const byText = (words) => [...document.querySelectorAll('button')].find(b => words.some(w => textOf(b).toLowerCase().includes(w)));
    const bindings = [
      [['share result','share'], share],
      [['whatsapp','واٹس ایپ'], whatsapp],
      [['export image','تصویر'], svgImage],
      [['export pdf','pdf'], printPdf],
      [['export csv','csv'], csv]
    ];
    bindings.forEach(([words, fn]) => { const b=byText(words); if(!b || b.dataset.qaBound) return; b.dataset.qaBound='1'; b.addEventListener('click', e=>{e.preventDefault();e.stopImmediatePropagation();fn();}, true); });
  };
  document.addEventListener('DOMContentLoaded', () => { bind(); new MutationObserver(bind).observe(document.body,{subtree:true,childList:true}); });
})();
