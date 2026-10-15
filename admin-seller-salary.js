(()=>{'use strict';
if(sessionStorage.getItem('EKANNTO_ADMIN_DEMO_AUTH')!=='1'){location.href='admin.html';return}
const $=s=>document.querySelector(s),read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'৳'+Number(n||0).toLocaleString('en-BD',{minimumFractionDigits:2,maximumFractionDigits:2});
const norm=s=>String(s??'').toLowerCase().replace(/[_-]+/g,' ').trim();
const statusOf=(...v)=>v.map(norm).filter(Boolean).join(' ');
const isRejected=x=>/reject|declined/.test(statusOf(x?.status,x?.moderationStatus,x?.approvalStatus,x?.productStatus));
const isRefunded=(o,i)=>!!(i?.refunded||i?.refundStatus&&/refund|complete|approved/i.test(norm(i.refundStatus))||/refund/.test(statusOf(o?.status,o?.orderStatus,o?.paymentStatus,o?.refundStatus)));
const isReturned=(o,i)=>!!(i?.returned||i?.returnStatus&&/return|complete|approved/i.test(norm(i.returnStatus))||/return/.test(statusOf(o?.status,o?.orderStatus,o?.returnStatus)));
const delivered=(o,i)=>/deliver|completed|complete|fulfilled/.test(statusOf(i?.status,i?.fulfillmentStatus,o?.status,o?.orderStatus,o?.fulfillmentStatus));
const orderItems=o=>Array.isArray(o?.items)?o.items:(o?.productId||o?.sellerId?[o]:[]);
const keyFor=(o,i,n)=>`${o?.id||o?.orderId||o?.uuid||'order'}::${i?.id||i?.productId||i?.sku||i?.name||n}::${n}`;
function build(){
 const db=read('ekannto_v1',{}), sellers=Array.isArray(db.sellers)?db.sellers:read('ekannto_seller_applications_v14',read('EKANNTO_SELLER_APPLICATIONS',[]));
 const orders=Array.isArray(db.orders)?db.orders:read('EKANNTO_ORDERS',[]), products=Array.isArray(db.products)?db.products:read('EKANNTO_PRODUCTS',[]);
 const finance=read('ekannto_finance_v37',{paidItems:{},adjustments:[],withdrawals:[],commissionPct:10,history:[]}), paidItems=finance.paidItems||{}, commission=Math.max(0,Math.min(100,Number(finance.commissionPct??10)||0));
 const sellersOut=sellers.map(s=>{
   const sid=String(s.id??s.sellerId??s.seller_id??s.userId??'');
   const rows=[],seen=new Set();let sold=0,rejected=0,refunded=0,returned=0,grossEligible=0,commissionSum=0,paid=0;
   products.filter(p=>String(p.sellerId??p.seller_id??p.seller?.id??'')===sid&&isRejected(p)).forEach(p=>{rejected+=Math.max(1,Number(p.quantity||p.qty||1)||1)});
   orders.forEach(o=>orderItems(o).forEach((i,n)=>{
     const itemSid=String(i.sellerId??i.seller_id??i.seller?.id??o.sellerId??o.seller_id??'');
     if(itemSid!==sid)return;
     const k=keyFor(o,i,n);if(seen.has(k))return;seen.add(k);
     const qty=Math.max(1,Number(i.qty??i.quantity??1)||1),price=Number(i.price??i.unitPrice??i.unit_price??i.priceEach??0)||0,gross=price*qty;
     const rej=isRejected(i)||isRejected(o),ref=isRefunded(o,i),ret=isReturned(o,i);
     if(rej){rejected+=qty;rows.push({o,i,n,qty,gross,k,state:'Rejected'});return}
     if(ref){refunded+=qty;rows.push({o,i,n,qty,gross,k,state:'Refunded'});return}
     if(ret){returned+=qty;rows.push({o,i,n,qty,gross,k,state:'Returned'});return}
     const isSale=/paid|deliver|complete|success|fulfilled/.test(statusOf(o.paymentStatus,o.payment_status,o.status,o.orderStatus,i.status));
     if(isSale)sold+=qty;
     const net=gross*(1-commission/100),paidFlag=!!paidItems[k]||paidItems[k]===true;
     const canPay=delivered(o,i)&&!paidFlag;
     if(canPay){grossEligible+=gross;commissionSum+=gross*commission/100}
     if(paidFlag)paid+=net;
     rows.push({o,i,n,qty,gross,k,state:canPay?'Pending payout':(delivered(o,i)?'Paid / released':'Escrow / not yet eligible'),net,canPay,paidFlag});
   }));
   const pending=Math.max(0,grossEligible-commissionSum);
   const rejectedProducts=products.filter(p=>String(p.sellerId??p.seller_id??p.seller?.id??'')===sid&&isRejected(p)).length;
   return {s,sid,rows,sold,rejected:Math.max(rejected,rejectedProducts),refunded,returned,pending,paid,commissionSum};
 });
 return {sellersOut,orders,products};
}
function render(){
 const {sellersOut}=build(),q=norm($('#search').value);
 const filtered=sellersOut.filter(x=>[x.s.name,x.s.sellerName,x.s.shop,x.s.shopName,x.s.storeName,x.sid,x.s.email,x.s.phone,x.s.phoneNumber].some(v=>norm(v).includes(q)));
 const totalPending=filtered.reduce((n,x)=>n+x.pending,0),totalSold=filtered.reduce((n,x)=>n+x.sold,0),totalRejected=filtered.reduce((n,x)=>n+x.rejected,0),totalRefunded=filtered.reduce((n,x)=>n+x.refunded,0),totalReturned=filtered.reduce((n,x)=>n+x.returned,0);
 $('#summary').innerHTML=[['Sellers',filtered.length],['Products sold (units)',totalSold],['Rejected (units)',totalRejected],['Refunded / Returned',`${totalRefunded} / ${totalReturned}`],['Total pending salary',money(totalPending)]].map(x=>`<article class="ss-stat"><small>${esc(x[0])}</small><strong>${esc(x[1])}</strong></article>`).join('');
 $('#rows').innerHTML=filtered.map((x,idx)=>`<tr><td><b>${esc(x.s.sellerName||x.s.name||'—')}</b><div>${esc(x.s.shopName||x.s.shop||x.s.storeName||'Shop not set')}</div></td><td>${esc(x.sid||'—')}</td><td>${esc(x.s.email||'—')}</td><td>${esc(x.s.phone||x.s.phoneNumber||'—')}</td><td>${x.sold}</td><td>${x.rejected}</td><td>${x.refunded}</td><td>${x.returned}</td><td class="ss-money">${money(x.pending)}</td><td><button class="ea-admin-btn" data-details="${idx}">View details</button></td></tr>`).join('')||'<tr><td colspan="10">কোনো Seller পাওয়া যায়নি।</td></tr>';
 $('#empty').textContent='Pending Salary কেবল delivery/completion নিশ্চিত এবং আগে payout করা হয়নি—এমন item থেকে হিসাব করা হয়।';
 $('#rows').querySelectorAll('[data-details]').forEach(btn=>btn.addEventListener('click',()=>{
   const x=filtered[Number(btn.dataset.details)];if(!x)return;
   let old=$('#salaryDetails');if(old)old.remove();
   const wrap=document.createElement('section');wrap.id='salaryDetails';wrap.className='ea-admin-card ss-details';
   wrap.innerHTML=`<h2>${esc(x.s.sellerName||x.s.name||'Seller')} · ${esc(x.s.shopName||x.s.shop||'')}</h2><p>${esc(x.sid)} · ${esc(x.s.email||'')} · ${esc(x.s.phone||x.s.phoneNumber||'')}</p><p><b>Pending salary:</b> ${money(x.pending)} · <b>Commission excluded:</b> ${money(x.commissionSum)} · <b>Previously paid:</b> ${money(x.paid)}</p><div class="ss-tablewrap"><table class="ss-subtable"><thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Gross</th><th>State</th><th>Net amount</th></tr></thead><tbody>${x.rows.map(r=>`<tr><td>${esc(r.o.id||r.o.orderId||r.o.uuid||'—')}</td><td>${esc(r.i.name||r.i.title||r.i.productName||r.i.productId||'Product')}</td><td>${r.qty}</td><td>${money(r.gross)}</td><td>${esc(r.state)}</td><td>${money(r.canPay?r.net:0)}</td></tr>`).join('')||'<tr><td colspan="6">No matching order items.</td></tr>'}</tbody></table></div><button class="ea-admin-btn" id="closeDetails">Close details</button>`;
   $('#summary').parentElement.after(wrap);$('#closeDetails').onclick=()=>wrap.remove();wrap.scrollIntoView({behavior:'smooth',block:'start'});
 }));
}
$('#search').addEventListener('input',render);$('#refresh').addEventListener('click',render);
$('#logout').addEventListener('click',()=>{sessionStorage.removeItem('EKANNTO_ADMIN_DEMO_AUTH');sessionStorage.removeItem('EKANNTO_ADMIN_DEMO_MODE');location.href='admin.html'});
render();
})();