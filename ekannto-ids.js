/* EKANNTO ID generator: local prototype fallback. Production must use a transactional D1 sequence. */
(()=>{'use strict';
const specs={FOUNDER:'EK-FD-',OWNER:'EK-OW-',ADMIN:'EK-AD-',SELLER:'EK-SELL-',CUSTOMER:'EK-CM-',ORDER:'EK-OR-',PREMIUM_ORDER:'EK-PRO-OR-'};
function next(type,records=[]){const prefix=specs[String(type||'').toUpperCase()];if(!prefix)throw new Error('Unknown EKANNTO ID type');
 const key='EKANNTO_SEQ_'+type.toUpperCase();let n=Math.max(0,Number(localStorage.getItem(key)||0));
 const used=new Set((records||[]).map(x=>String(x?.id||x?.userId||x?.orderId||'')));
 // Recover the sequence from existing matching IDs and avoid collisions.
 for(const id of used){if(id.startsWith(prefix)){const m=id.slice(prefix.length).match(/^(\d+)/);if(m)n=Math.max(n,Number(m[1]));}}
 do{n++;}while(used.has(prefix+String(n).padStart(2,'0')));
 localStorage.setItem(key,String(n));return prefix+String(n).padStart(2,'0');
}
window.EKANNTO_IDS={next,specs};
})();
