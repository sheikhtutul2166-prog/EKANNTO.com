(()=>{'use strict';
/* Local-preview workflow only: pending applications are approved after 5 minutes unless an admin rejects/bans them first. */
const KEY='ekannto_seller_applications_v14',DB='ekannto_v1',WAIT=5*60*1000;
const read=(k,d)=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
const write=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}};
function run(){const apps=read(KEY,[]);if(!Array.isArray(apps)||!apps.length)return;const db=read(DB,{});db.sellers=Array.isArray(db.sellers)?db.sellers:[];let appsChanged=false,dbChanged=false;const now=Date.now();
 for(const a of apps){if(!a||String(a.status||'PENDING_REVIEW').toUpperCase()!=='PENDING_REVIEW')continue;const submitted=Number(a.created)||Date.parse(a.timestamp)||now;if(now-submitted<WAIT)continue;
  /* Explicitly rejected/banned seller records must never be auto-approved. */
  const existing=db.sellers.find(s=>String(s.applicationId||'')===String(a.uuid||'')||String(s.id||'')===String(a.sellerId||''));
  if(existing&&['REJECTED','BANNED','SUSPENDED'].includes(String(existing.status||'').toUpperCase())){a.status=String(existing.status).toUpperCase();a.reviewReason=a.reviewReason||'Seller account was restricted by admin.';appsChanged=true;continue;}
  a.status='APPROVED';a.autoApproved=true;a.reviewedAt=new Date(now).toISOString();a.reviewedBy='AUTO_APPROVE_AFTER_5_MINUTES';a.reviewReason=a.reviewReason||'Automatically approved after 5 minutes without an admin decision.';appsChanged=true;
  if(existing){Object.assign(existing,{status:'ACTIVE',applicationId:a.uuid,userId:a.userId,name:a.name||existing.name,shop:a.shop||existing.shop,email:a.email||existing.email,phone:a.phone||existing.phone,category:a.category||existing.category,nidNumber:a.nidNumber||existing.nidNumber,nidName:a.nidName||existing.nidName,nidEnglishName:a.nidEnglishName||existing.nidEnglishName,nidFatherName:a.nidFatherName||existing.nidFatherName,nidMotherName:a.nidMotherName||existing.nidMotherName,nidDob:a.nidDob||existing.nidDob,nidBloodGroup:a.nidBloodGroup||existing.nidBloodGroup,nidAddress:a.nidAddress||existing.nidAddress});}
  else{db.sellers.push({id:a.sellerId||('SELLER-'+String(a.uuid||now)),sellerId:a.sellerId,userId:a.userId,applicationId:a.uuid,name:a.name||'Seller',shop:a.shop||'My Shop',email:a.email||'',phone:a.phone||'',category:a.category||'',payoutAccount:a.payoutAccount||'',nidNumber:a.nidNumber||'',nidName:a.nidName||'',nidEnglishName:a.nidEnglishName||'',nidFatherName:a.nidFatherName||'',nidMotherName:a.nidMotherName||'',nidDob:a.nidDob||'',nidBloodGroup:a.nidBloodGroup||'',nidAddress:a.nidAddress||'',logo:a.logo||'',status:'ACTIVE',created:now});}
  dbChanged=true;
 }
 if(appsChanged)write(KEY,apps);if(dbChanged)write(DB,db);
}
run();setInterval(run,2000);
})();
