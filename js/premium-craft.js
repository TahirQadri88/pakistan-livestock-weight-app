(() => {
  const q = (s) => document.querySelector(s);
  const data = {
    cattle: { en: 'Cattle', ur: 'گائے / بیل', glyph: '♜' },
    buffalo: { en: 'Buffalo', ur: 'بھینس', glyph: '♜' },
    goat: { en: 'Goat', ur: 'بکرا / بکری', glyph: '♜' },
    sheep: { en: 'Sheep', ur: 'بھیڑ', glyph: '♜' }
  };
  const isolate = (el) => {
    if (!el) return;
    el.setAttribute('dir', 'ltr');
    el.style.unicodeBidi = 'isolate';
  };
  const fixBidi = () => {
    document.querySelectorAll('#mobile,#girth,#length,#tagId').forEach(isolate);
    document.querySelectorAll('.result-table td:nth-child(2), .result-info').forEach((el) => {
      el.querySelectorAll('strong').forEach((s) => s.removeAttribute('dir'));
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      const nodes=[]; while(walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(n => { if (/\d|KG|cm|Maunds|Tag ID|G²|L|D/.test(n.nodeValue)) { const span=document.createElement('span'); span.dir='ltr'; span.style.unicodeBidi='isolate'; span.textContent=n.nodeValue; n.parentNode.replaceChild(span,n); }});
    });
  };
  const decorateAnimals = () => {
    document.querySelectorAll('#animalGrid .choice-card').forEach((card, i) => {
      const icon = card.querySelector('.animal-icon');
      if (!icon) return;
      icon.setAttribute('data-animal-index', String(i));
      icon.setAttribute('aria-hidden', 'true');
      card.querySelector('.number')?.setAttribute('aria-hidden','true');
    });
  };
  const cleanLabels = () => {
    document.querySelectorAll('#profileForm label,#measureForm label').forEach(label => {
      const ur = label.querySelector(':scope > span');
      if (!ur) return;
      ur.classList.add('label-ur');
      ur.setAttribute('lang','ur');
      ur.setAttribute('dir','rtl');
    });
    document.querySelectorAll('.urdu-help').forEach(el => {el.lang='ur';el.dir='rtl';});
  };
  const improveHeader = () => {
    const brand = q('.brand');
    if (!brand || brand.querySelector('.brand-kicker')) return;
    const title = brand.querySelector('strong');
    if (title) title.innerHTML = 'Livestock <span class="brand-kicker">WEIGHT CALCULATOR</span>';
  };
  const observe = () => {
    decorateAnimals(); cleanLabels(); improveHeader(); fixBidi();
    const mo = new MutationObserver(() => { decorateAnimals(); cleanLabels(); fixBidi(); });
    mo.observe(document.body,{subtree:true,childList:true});
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',observe,{once:true}); else observe();
})();
