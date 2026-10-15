(()=>{'use strict';
const page=document.body.dataset.page,root=document.getElementById('app');
if(!root||!['seller-account-settings','seller-access','seller-dashboard'].includes(page))return;
const DBK='ekannto_v1',FK='ekannto_finance_v37';
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const db=read(DBK,{});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>'৳'+Number(n||0).toLocaleString('en-BD',{minimumFractionDigits:2,maximumFractionDigits:2});
const currentSeller=()=>{const id=db.sellerSession;return (db.sellers||[]).find(s=>String(s.id)===String(id))};
const currentUser=()=> (db.users||[]).find(u=>String(u.id)===String(db.session));
const save=()=>{try{localStorage.setItem(DBK,JSON.stringify(db))}catch{}};
function finance(s){
 // Keep the dashboard calculation identical to Seller Wallet & Payouts (seller-finance-v39.js).
 const f=read(FK,{paidItems:{},adjustments:[],withdrawals:[],commissionPct:10});
 const sid=String(s?.id||'');
 const orders=(db.orders||[]).filter(o=>(o.items||[]).some(i=>String(i.sellerId)===sid));
 let paid=0;
 for(const o of orders)(o.items||[]).forEach((i,n)=>{
   if(String(i.sellerId)!==sid)return;
   const key=`${o.id}::${i.id||i.productId||i.name||n}::${n}`;
   const refunded=/refund/i.test(String(o.status||''))||!!i.refunded;
   if(f.paidItems?.[key]&&!refunded){const gross=(Number(i.price)||0)*(Number(i.qty)||1);paid+=gross*(1-Number(f.commissionPct??10)/100)}
 });
 const allAdj=Array.isArray(f.adjustments)?f.adjustments:[];
 const exactAdj=allAdj.filter(a=>String(a.sellerId)===sid);
 const adj=(exactAdj.length?exactAdj:allAdj.filter(a=>String(a.sellerId)===String(s?.sellerId||s?.userId||'')))
   .filter(a=>Number.isFinite(Number(a?.amount))&&Math.abs(Number(a.amount))<=1000000000);
 const adjustmentTotal=adj.reduce((n,a)=>n+(a.type==='add'?1:-1)*Number(a.amount||0),0);
 const values=[s?.availableBalance,s?.wallet?.availableBalance,s?.wallet?.balance,s?.walletBalance,s?.balance]
   .map(v=>(v===null||v===undefined||v===''?NaN:Number(v))).filter(Number.isFinite);
 const explicit=values.find(v=>v!==0)??values[0];
 // If an explicit positive balance exists, treat it as the current wallet snapshot;
 // otherwise rebuild from paid earnings plus every adjustment (including migrated admin adjustments).
 let total=(Number.isFinite(explicit)&&explicit>0)?explicit:(paid+adjustmentTotal);
 const reserved=(Array.isArray(f.withdrawals)?f.withdrawals:[])
   .filter(w=>String(w.sellerId)===sid&&w.balanceDeducted!==true&&['pending','approved','processing','completed','paid'].includes(String(w.status||'').toLowerCase()))
   .reduce((n,w)=>n+Math.max(0,Number(w.amount||0)),0);
 return Math.max(0,total-reserved);
}
function logoMarkup(s,cls=''){
 const logo=s?.logo||s?.logoUrl||s?.avatar||s?.profilePhoto||'';
 return logo?`<img class="${cls}" src="${esc(logo)}" alt="${esc(s?.shop||'Shop')} logo">`:`<img class="${cls}" src="assets/icons/ekannto-mark-tight.png" alt="Ekannto logo">`;
}
function professionalAccount(){
 const s=currentSeller(),u=currentUser();
 if(!s||!u||String(s.userId)!==String(u.id)){location.href='seller-access.html';return}
  root.innerHTML=`
 <section class="v47-account-hero">
   <div class="v47-brand-lockup"><img src="assets/icons/ekannto-brand.png" alt="Ekannto Bangladesh Business OS"><span>SELLER ACCOUNT</span></div>
   <a class="v47-back-btn" href="seller-dashboard.html">← Seller Dashboard</a>
 </section>
 <section class="v47-profile-card">
   <div class="v47-profile-top">
     <div class="v47-shop-logo">${logoMarkup(s,'')}</div>
     <div class="v47-profile-title"><span>SHOP PROFILE</span><h1>${esc(s.shop||s.shopName||'My Shop')}</h1><p>${esc(s.name||'Seller')}</p></div>
     <span class="v47-active">● ACTIVE</span>
   </div>
   <div class="v47-divider"></div>
   <form id="v47SellerAccount" class="v47-form">
     <label><span>Shop Logo</span><div class="v47-file"><input id="v47Logo" type="file" accept="image/png,image/jpeg,image/webp"><b>Choose logo</b><small>PNG/JPG/WebP · max 900 KB</small></div></label>
     <label><span>Shop Name</span><input name="shop" value="${esc(s.shop||s.shopName||'')}" required maxlength="100"></label>
     <label><span>Seller Name</span><input name="name" value="${esc(s.name||s.sellerName||'')}" required maxlength="100"></label>
     <label><span>Email</span><input name="email" type="email" value="${esc(s.email||u.email||'')}" required></label>
     <label><span>Phone</span><input name="phone" type="tel" value="${esc(s.phone||u.phone||'')}" required placeholder="01XXXXXXXXX"></label>
     <label><span>New Password</span><input name="password" type="password" autocomplete="new-password" minlength="6" placeholder="Leave blank to keep current password"></label>
     <button class="v47-save" type="submit">Save Seller Account</button>
   </form><a href="seller-information.html" class="v47-secondary" style="display:flex;margin-top:12px;justify-content:center">Seller Information · Registration & Verification Details</a>
 </section>
 <section class="v47-logout-card"><div><b>Seller Account</b><span>Manage only your seller account information from this page.</span></div><button id="v47Logout" type="button">Logout</button></section>`;
 document.getElementById('v47SellerAccount').onsubmit=async e=>{
   e.preventDefault();const f=new FormData(e.currentTarget),email=String(f.get('email')).trim().toLowerCase();
   if((db.users||[]).some(x=>String(x.id)!==String(u.id)&&String(x.email||'').toLowerCase()===email))return typeof toast==='function'&&toast('Email already used');
   s.shop=String(f.get('shop')).trim();s.name=String(f.get('name')).trim();s.email=email;s.phone=String(f.get('phone')).trim();
   if(String(f.get('password')||''))s.password=String(f.get('password'));
   const file=document.getElementById('v47Logo').files?.[0];
   if(file){if(file.size>900000)return toast('Logo must be under 900 KB');s.logo=await new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)})}
   u.email=s.email;u.phone=s.phone;save();if(typeof toast==='function')toast('Seller account saved');professionalAccount();
 };
 document.getElementById('v47Logout').onclick=()=>{db.sellerSession=null;save();location.href='login.html?seller=1'};
}
function professionalAccess(){
 const u=currentUser();if(!u){location.href='login.html';return}
 let apps=read('ekannto_seller_applications_v14',[]),sellers=Array.isArray(db.sellers)?db.sellers:[];
 const userEmail=String(u.email||'').trim().toLowerCase(),userPhone=String(u.phone||'').replace(/\D/g,'');
 const linkedUsers=new Set([String(u.id)]);(db.users||[]).forEach(other=>{const em=String(other.email||'').trim().toLowerCase(),ph=String(other.phone||'').replace(/\D/g,'');if((userEmail&&em===userEmail)||(userPhone&&ph===userPhone))linkedUsers.add(String(other.id));});
 const userSellers=sellers.filter(x=>{const ownerIds=[x.userId,x.ownerUserId,x.accountUserId,x.customerId,x.user_id,x.owner_id].filter(v=>v!==null&&v!==undefined&&v!=='').map(String);const ownerEmails=[x.email,x.ownerEmail,x.accountEmail].filter(Boolean).map(v=>String(v).trim().toLowerCase());const ownerPhones=[x.phone,x.ownerPhone,x.accountPhone].filter(Boolean).map(v=>String(v).replace(/\D/g,''));return ownerIds.some(id=>linkedUsers.has(id))||(userEmail&&ownerEmails.includes(userEmail))||(userPhone&&ownerPhones.includes(userPhone));});
 const userApps=apps.filter(x=>{const em=String(x.email||'').trim().toLowerCase(),ph=String(x.phone||'').replace(/\D/g,'');return (linkedUsers.has(String(x.userId))||(userEmail&&em===userEmail)||(userPhone&&ph===userPhone))&&String(x.status||'PENDING_REVIEW').toUpperCase()==='APPROVED';});
 for(const a of userApps){let s=userSellers.find(x=>String(x.id)===String(a.sellerId||'')||String(x.applicationId||'')===String(a.uuid||''));if(!s){s={id:a.sellerId||'SELLER-'+Date.now().toString(36).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase(),sellerId:a.sellerId,userId:a.userId||u.id,name:a.name||u.name||'Seller',shop:a.shop||'My Shop',email:a.email||u.email,phone:a.phone||u.phone,password:a.password||'',logo:a.logo||'',status:'ACTIVE',created:a.created||Date.now(),applicationId:a.uuid};db.sellers.push(s);userSellers.push(s);a.sellerId=s.id;}}
 if(userSellers.length){save();localStorage.setItem('ekannto_seller_applications_v14',JSON.stringify(apps));}
 if(!userSellers.length){root.innerHTML='<section class="v47-access-card"><h1>Seller Accounts</h1><p>এই লগইন-এর অধীনে কোনো অনুমোদিত Seller Account পাওয়া যায়নি।</p><a class="v47-primary" href="seller-onboarding.html?new=1">Apply for Seller Account</a></section>';return}
 const uniqueSellers=[...new Map(userSellers.map(s=>[String(s.id||s.sellerId||s.applicationId),s])).values()];
 const cards=uniqueSellers.map((s,i)=>`<button type="button" class="v47-account-choice" data-seller-id="${esc(s.id)}"><span class="v47-choice-logo">${logoMarkup(s,'')}</span><span class="v47-choice-info"><b>${esc(s.shop||s.shopName||'My Shop')}</b><small>${esc(s.name||s.sellerName||'Seller')}</small><small>ID: ${esc(s.sellerId||s.id||s.uuid)}</small></span><span class="v47-choice-open">Open →</span></button>`).join('');
 root.innerHTML=`<section class="v47-access-card v47-account-picker"><div class="v47-access-logo"><img src="assets/icons/ekannto-mark-tight.png" alt="Ekannto"></div><div class="v47-access-kicker">EKANNTO · SELLER</div><h1>Choose Seller Account</h1><p class="v47-picker-help">তোমার সব Seller Account এখানে দেখানো হয়েছে। একই নামের Shop হলে Seller ID দেখে সঠিক Account খুলবে।</p><div class="v47-account-choices">${cards}</div><a class="v47-secondary" href="seller-onboarding.html?new=1">+ Add another Seller Account</a></section>`;
 root.querySelectorAll('[data-seller-id]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.sellerId,chosen=uniqueSellers.find(x=>String(x.id)===String(id));if(!chosen)return;db.sellerSession=chosen.id;save();location.href='seller-dashboard.html'}));
}
function addStyles(){const st=document.createElement('style');st.textContent=`
.v47-account-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:18px;margin:4px 0 18px}.v47-brand-lockup img{display:block;width:min(390px,84vw);height:auto;max-height:110px;object-fit:contain;object-position:left center}.v47-brand-lockup span{display:block;margin-top:8px;font-size:.7rem;letter-spacing:.16em;font-weight:900;color:var(--coffee)}.v47-back-btn{display:inline-flex;align-items:center;padding:11px 15px;border:1px solid var(--line);border-radius:13px;background:#fff;color:var(--coffee);font-weight:800;text-decoration:none;white-space:nowrap}.v47-account-banner{display:flex;align-items:center;gap:13px;background:linear-gradient(135deg,#6F4E37,#835d43);color:#fff;border-radius:22px;padding:15px 17px;margin-bottom:18px;box-shadow:0 10px 28px #6f4e3722}.v47-banner-icon{width:50px;height:50px;flex:0 0 50px;border-radius:15px;background:#F5F0E9;display:grid;place-items:center}.v47-wallet-svg{width:26px;height:26px;object-fit:contain;filter:none}.v47-account-banner div{display:flex;flex-direction:column}.v47-account-banner small{font-size:.65rem;letter-spacing:.14em;font-weight:900;opacity:.8}.v47-account-banner b{font-size:.95rem;margin-top:2px}.v47-account-banner strong{margin-left:auto;background:#fff;color:#3a2920;padding:10px 14px;border-radius:14px;font-size:1.15rem;white-space:nowrap}.v47-account-banner>a{color:#fff;text-decoration:none;font-size:1.65rem;font-weight:900}.v47-profile-card{background:#fff;border:1px solid var(--line);border-radius:24px;padding:22px;box-shadow:0 8px 26px #4a2f2010;max-width:850px;margin:0 auto 16px}.v47-profile-top{display:flex;align-items:center;gap:16px}.v47-shop-logo{width:86px;height:86px;flex:0 0 86px;border-radius:22px;overflow:hidden;background:#F5F0E9;border:1px solid #e6ddd4;display:grid;place-items:center}.v47-shop-logo img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;padding:7px}.v47-profile-title{min-width:0}.v47-profile-title>span{font-size:.67rem;letter-spacing:.14em;font-weight:900;color:var(--coffee)}.v47-profile-title h1{font-size:1.75rem;margin:4px 0 1px;overflow-wrap:anywhere}.v47-profile-title p{margin:0;color:var(--muted)}.v47-active{margin-left:auto;padding:8px 11px;border-radius:999px;background:#edf7ef;color:#28733b;font-size:.72rem;font-weight:900;white-space:nowrap}.v47-divider{height:1px;background:var(--line);margin:20px 0}.v47-form{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:15px}.v47-form label{display:grid;gap:7px;font-weight:800;font-size:.86rem;color:#4c4039}.v47-form label:first-child,.v47-save{grid-column:1/-1}.v47-form input{box-sizing:border-box;width:100%;padding:13px 14px;border:1px solid #ded5cc;border-radius:13px;background:#fff;color:inherit;font:inherit;outline:none}.v47-form input:focus{border-color:var(--coffee);box-shadow:0 0 0 3px #6f4e3712}.v47-file{border:1px dashed #cbbcae;border-radius:15px;padding:14px;display:grid;grid-template-columns:auto 1fr;column-gap:12px;align-items:center;background:#faf8f5;position:relative}.v47-file input{grid-row:1/3;width:auto;padding:0;border:0}.v47-file b{color:var(--coffee)}.v47-file small{color:var(--muted);font-weight:600}.v47-save{border:0;border-radius:14px;background:#6F4E37;color:#fff;padding:14px 18px;font:inherit;font-weight:900;cursor:pointer}.v47-logout-card{max-width:850px;margin:0 auto 20px;border:1px solid #eadfd6;border-radius:20px;padding:17px 19px;display:flex;align-items:center;justify-content:space-between;gap:14px;background:#fff}.v47-logout-card div{display:flex;flex-direction:column;gap:4px}.v47-logout-card span{font-size:.82rem;color:var(--muted)}.v47-logout-card button{border:1px solid #e4bcbc;background:#fff7f7;color:#b63131;border-radius:12px;padding:10px 16px;font-weight:900;cursor:pointer}.v47-access-card{max-width:720px;margin:20px auto;background:#fff;border:1px solid var(--line);border-radius:28px;padding:30px;box-shadow:0 14px 38px #4a2f2012}.v47-access-logo{width:112px;height:112px;border-radius:28px;overflow:hidden;background:#F5F0E9;border:1px solid #e4d9cf;display:grid;place-items:center;margin-bottom:18px}.v47-access-logo img{width:100%;height:100%;object-fit:contain;object-position:center;display:block;padding:7px}.v47-access-kicker{font-size:.68rem;letter-spacing:.16em;color:var(--coffee);font-weight:900}.v47-access-card h1{font-size:clamp(2rem,7vw,3rem);line-height:1.03;margin:8px 0 18px}.v47-access-card h1 span{color:var(--coffee)}.v47-approved{background:#f5f0e9;color:#6f4e37;border-radius:999px;padding:10px 14px;font-weight:900;margin-bottom:20px}.v47-access-info{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.v47-access-info div{border:1px solid var(--line);border-radius:15px;padding:14px}.v47-access-info small{display:block;color:var(--muted);font-size:.65rem;letter-spacing:.1em;font-weight:900;margin-bottom:5px}.v47-access-info b{overflow-wrap:anywhere}.v47-access-card p{color:var(--muted);line-height:1.6}.v47-access-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:22px}.v47-primary,.v47-secondary{display:inline-flex;align-items:center;justify-content:center;text-decoration:none;border-radius:14px;padding:13px 17px;font-weight:900}.v47-primary{background:#6F4E37;color:#fff}.v47-secondary{border:1px solid var(--line);color:var(--coffee);background:#fff}.v47-account-hero,.v47-profile-card,.v47-logout-card,.v47-access-card{max-width:100%;min-width:0;overflow:hidden}.v47-form,.v47-form label,.v47-file{min-width:0}.v47-form input{min-width:0;max-width:100%;overflow:hidden;text-overflow:ellipsis}.v47-shop-logo{background:#fff}.v47-access-logo{background:#fff}.v47-account-hero{padding-bottom:2px}body[data-page="seller-account-settings"] .main,body[data-page="seller-access"] .main,body[data-page="seller-dashboard"] .main{padding-bottom:max(150px,calc(110px + env(safe-area-inset-bottom)))}body[data-page="seller-account-settings"],body[data-page="seller-access"],body[data-page="seller-dashboard"]{overflow-x:hidden}
@media(max-width:600px){.v47-account-hero{align-items:stretch;flex-direction:column}.v47-brand-lockup img{width:min(320px,92vw);max-height:90px}.v47-back-btn{width:100%;justify-content:center}.v47-account-banner{padding:13px}.v47-banner-icon{width:44px;height:44px;flex-basis:44px}.v47-account-banner strong{font-size:1rem;padding:9px 10px}.v47-profile-card{padding:17px;border-radius:20px}.v47-profile-top{align-items:flex-start;flex-wrap:wrap}.v47-shop-logo{width:76px;height:76px;flex-basis:76px}.v47-profile-title{flex:1}.v47-profile-title h1{font-size:1.4rem}.v47-active{width:100%;margin-left:0;text-align:center}.v47-form{grid-template-columns:1fr}.v47-form label:first-child,.v47-save{grid-column:auto}.v47-logout-card{align-items:stretch;flex-direction:column}.v47-logout-card button{width:100%}.v47-access-card{margin:10px auto;padding:21px;border-radius:22px}.v47-access-logo{width:88px;height:88px;border-radius:22px}.v47-access-info{grid-template-columns:1fr}.v47-access-actions>*{width:100%}.v47-account-picker{max-width:760px}.v47-picker-help{color:var(--muted);line-height:1.5}.v47-account-choices{display:grid;gap:9px;margin:16px 0}.v47-account-choice{display:flex;align-items:center;gap:11px;width:100%;padding:10px 12px;border:1px solid #e6ddd4;border-radius:15px;background:#fff;text-align:left;color:inherit;cursor:pointer;min-width:0}.v47-choice-logo{width:48px;height:48px;flex:0 0 48px;border-radius:12px;background:#f5f0e9;overflow:hidden;display:grid;place-items:center}.v47-choice-logo img{width:100%;height:100%;object-fit:contain;padding:4px;box-sizing:border-box}.v47-choice-info{display:grid;gap:2px;min-width:0;flex:1}.v47-choice-info b{font-size:.96rem;overflow-wrap:anywhere}.v47-choice-info small{font-size:.72rem;color:var(--muted);overflow-wrap:anywhere}.v47-choice-open{font-size:.78rem;font-weight:800;color:var(--coffee);white-space:nowrap}.v47-account-choice:active{transform:scale(.99)}}
`;document.head.appendChild(st)}
addStyles();
if(page==='seller-account-settings')professionalAccount();
if(page==='seller-access')professionalAccess();
if(page==='seller-dashboard'){
 const s=currentSeller();if(s){const balanceText=money(finance(s));document.querySelectorAll('.v46-money-banner strong,.v47-account-banner strong,[data-seller-available-balance],#sellerAvailableBalance').forEach(el=>{el.textContent=balanceText;});}
}
})();
