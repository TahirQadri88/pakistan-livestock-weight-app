(()=>{
'use strict';
const $=s=>document.querySelector(s);
const qsa=s=>[...document.querySelectorAll(s)];
const urduMap={
'Farm Name':'فارم کا نام','Mobile Number':'موبائل نمبر','Owner Name':'فارم مالک کا نام','City':'شہر','Animal Tag ID':'جانور کا ٹیگ ID','Heart Girth (G) in CM':'دل کی گھیرائی (G) سینٹی میٹر میں','Body Length (L) in CM':'جسم کی لمبائی (L) سینٹی میٹر میں','Welcome':'خوش آمدید','Animal Selection':'جانور کا انتخاب','Select Breed Profile':'نسل کا انتخاب','Measurements':'ناپ','Calculation Result':'وزن کا حساب','History':'ہسٹری','Profile':'پروفائل','Start':'شروع کریں','Calculate Weight':'وزن نکالیں'};
function isolate(el){if(!el)return;el.dir='ltr';el.classList.add('bidi-ltr');el.style.unicodeBidi='isolate'}
function splitBilingual(){
 qsa('label').forEach(label=>{const text=[...label.childNodes].find(n=>n.nodeType===3&&n.textContent.trim());const span=label.querySelector(':scope>span');if(text&&span){text.textContent=text.textContent.trim();span.setAttribute('lang','ur');span.dir='rtl';span.style.unicodeBidi='isolate'}});
 qsa('input[type=number],#mobile,#tagId').forEach(isolate);
 qsa('.result-table td,.result-table th').forEach(cell=>{if(/\d|KG|Maund|cm|×|G²|D\s*=/.test(cell.textContent))cell.dir='ltr'});
}
function enhanceAnimalIcons(){qsa('.animal-icon svg').forEach(svg=>{svg.setAttribute('aria-hidden','true');svg.setAttribute('focusable','false')})}
function patchButtons(){
 const ids={imageBtn:'Export Image',pdfBtn:'Export PDF',whatsappBtn:'Share Result',csvBtn:'Export CSV',newBtn:'New Calculation'};
 Object.entries(ids).forEach(([id,label])=>{const b=$('#'+id);if(!b)return;b.dataset.label=label;b.setAttribute('aria-label',label)});
}
function resultText(){
 const card=$('#resultCard');return card?card.innerText.trim():'';
}
async function shareResult(){
 const text=resultText(); if(!text)return;
 if(navigator.share){try{await navigator.share({title:'Pakistan Livestock Weight Calculation Result',text});return}catch(e){if(e?.name==='AbortError')return}}
 const url='https://wa.me/?text='+encodeURIComponent(text);
 const w=window.open(url,'_blank','noopener,noreferrer');
 if(!w) {try{await navigator.clipboard.writeText(text);alert('Result copied. Open WhatsApp and paste it.')}catch{alert('Unable to open sharing. Please copy the result text manually.')}}
}
function wireShare(){const b=$('#whatsappBtn');if(!b)return;b.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();shareResult() },true)}
function repairText(){
 const root=document.documentElement;
 const isUr=root.lang==='ur'||document.body.classList.contains('rtl');
 qsa('.screen-head h2 span,.form-grid label>span,.urdu-help,.choice-card small,.breed-card span').forEach(e=>{e.lang='ur';e.dir='rtl';e.style.unicodeBidi='isolate'});
 qsa('.context-chip').forEach(e=>{e.dir='ltr';e.style.unicodeBidi='isolate'});
 if(isUr) qsa('.screen-head h2').forEach(e=>e.style.lineHeight='1.55');
 splitBilingual();enhanceAnimalIcons();patchButtons();
}
function observer(){const mo=new MutationObserver(()=>{repairText()});mo.observe(document.body,{subtree:true,childList:true});}
function addMissingNativeShare(){const old=$('#whatsappBtn');if(!old)return;wireShare();}
function init(){repairText();addMissingNativeShare();observer();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
