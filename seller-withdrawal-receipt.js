(()=>{'use strict';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'৳'+Number(n||0).toLocaleString('en-BD',{minimumFractionDigits:2,maximumFractionDigits:2});
const mask=s=>{s=String(s||'');if(!s)return '—';if(s.length<=4)return '*'.repeat(s.length);return '*'.repeat(Math.max(4,s.length-4))+s.slice(-4)};
const p=new URLSearchParams(location.search),id=p.get('id');
const f=read('ekannto_finance_v37',{withdrawals:[],withdrawFeePct:2}),db=read('ekannto_v1',{});
const stores=[f,read('ekannto_finance_v39',{}),read('ekannto_finance',{}),db];
let w=null;for(const store of stores){const arr=Array.isArray(store?.withdrawals)?store.withdrawals:[];const hit=id?arr.find(x=>String(x.id)===String(id)):null;if(hit){w=hit;break}}
if(!w){for(const store of stores){const arr=Array.isArray(store?.withdrawals)?store.withdrawals:[];const hit=arr.filter(x=>['approved','completed','paid'].includes(String(x.status||'').toLowerCase())).sort((a,b)=>Number(b.completedAt||b.reviewedAt||b.created||0)-Number(a.completedAt||a.reviewedAt||a.created||0))[0];if(hit){w=hit;break}}}
if(!w){document.getElementById('receipt').innerHTML='<div class="receipt-missing"><h1>Receipt not found</h1><p>The requested withdrawal receipt could not be found on this device.</p><a class="btn" href="seller-earnings.html">Back to Wallet & Payouts</a></div>';return}
const s=(db.sellers||[]).find(x=>String(x.id)===String(w.sellerId))||(String(db.sellerSession||'')?((db.sellers||[]).find(x=>String(x.id)===String(db.sellerSession))||{}):{});
const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
const logo=document.getElementById('shopLogo');
const logoSrc=s.logo||s.logoUrl||s.profilePhoto||s.avatar||'';
if(logoSrc){logo.innerHTML=`<img src="${esc(logoSrc)}" alt="Shop logo">`}else logo.textContent=String(s.shop||s.shopName||s.name||'E').slice(0,1).toUpperCase();
set('shopName',s.shop||s.shopName||'Ekannto Seller');
set('sellerMeta',[s.category||'Marketplace',s.location||'Seller'].filter(Boolean).join(' · '));
set('sellerName',s.name||s.sellerName||'Seller');
set('sellerId','EK-SELL-01');
set('receiptId',w.receiptId||'—');
set('withdrawalId',w.id||'—');
const when=new Date(w.completedAt||w.reviewedAt||w.created||Date.now());
set('dateTime',when.toLocaleString('en-BD',{dateStyle:'medium',timeStyle:'short'}));
set('paymentMethod',w.method||'—');set('account',mask(w.account));
set('transactionId',w.transactionId||w.reference||'—');
set('withdrawalAmount',money(w.amount));
const rate=Number(w.feeRate??(Number(w.amount)?Number(w.fee||0)/Number(w.amount)*100:f.withdrawFeePct??2));
set('feeLabel',`Website Fee (${rate.toFixed(2)}%)`);set('feeAmount','− '+money(w.fee));set('netAmount',money(w.net));
set('balanceBefore',money(w.balanceBefore));set('balanceAfter',money(w.balanceAfter));set('policyFee',rate.toFixed(2)+'% (locked for this withdrawal)');

document.getElementById('printBtn').onclick=()=>window.print();
const pdfText=v=>String(v??'').replace(/[^\x20-\x7E]/g,' ');
const fallbackPdf=()=>{const lines=['EKANNTO - SELLER WITHDRAWAL RECEIPT','',`Receipt ID: ${pdfText(w.receiptId||'—')}`,`Withdrawal ID: ${pdfText(w.id||'—')}`,`Date & Time: ${pdfText(when.toLocaleString('en-BD'))}`,'',`Shop: ${pdfText(s.shop||s.shopName||'Ekannto Seller')}`,`Seller: ${pdfText(s.name||s.sellerName||'Seller')}`,`Seller ID: EK-SELL-01`,'',`Payment Method: ${pdfText(w.method||'—')}`,`Account: ${pdfText(mask(w.account))}`,`Transaction ID: ${pdfText(w.transactionId||w.reference||'—')}`,'',`Withdrawal Amount: ${pdfText(money(w.amount))}`,`Website Fee: - ${pdfText(money(w.fee))}`,`Net Amount Paid: ${pdfText(money(w.net))}`,'',`Balance Before: ${pdfText(money(w.balanceBefore))}`,`Balance After: ${pdfText(money(w.balanceAfter))}`,'','System-generated receipt.'];
const escPdf=t=>pdfText(t).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
const content=['BT','/F1 18 Tf','50 800 Td',`(${escPdf(lines[0])}) Tj`,'/F1 10 Tf','0 -28 Td',...lines.slice(2).flatMap(line=>[`(${escPdf(line)}) Tj`,'0 -16 Td']),'ET'].join('\n');
const objs=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>','<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',`<< /Length ${content.length} >>\nstream\n${content}\nendstream`];let pdf='%PDF-1.4\n',offsets=[0];for(let i=0;i<objs.length;i++){offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${objs[i]}\nendobj\n`}const xref=pdf.length;pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n`;for(let i=1;i<offsets.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \n';pdf+=`trailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;const blob=new Blob([pdf],{type:'application/pdf'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=(w.receiptId||w.id||'Ekannto-Withdrawal-Receipt')+'.pdf';a.rel='noopener';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1200)};

document.getElementById('downloadBtn').onclick=async()=>{const btn=document.getElementById('downloadBtn');btn.disabled=true;btn.textContent='Creating PDF…';try{if(!window.html2pdf){fallbackPdf();return}await new Promise(r=>setTimeout(r,100));const element=document.getElementById('receipt');const filename=(w.receiptId||w.id||'Ekannto-Withdrawal-Receipt')+'.pdf';await window.html2pdf().set({margin:0,filename,image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',scrollX:0,scrollY:0},pagebreak:{mode:['css','legacy'],avoid:['.seller-card','.panel','.amount-box','.receipt-heading','.meta-grid','.receipt-footer']},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'}}).from(element).save()}catch(err){try{fallbackPdf()}catch(e){window.print()}}finally{btn.disabled=false;btn.textContent='Download PDF'}};
if(p.get('download')==='1')setTimeout(()=>document.getElementById('downloadBtn').click(),1200);
})();
