(function () {
  'use strict';
  const cfg = window.EKANNTO_ADMIN_MODULE;
  if (!cfg) return;
  if (sessionStorage.getItem('EKANNTO_ADMIN_DEMO_AUTH') !== '1') {
    location.replace('admin.html'); return;
  }
  const $ = (s) => document.querySelector(s);
  const read = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); } catch (_) { return d; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  $('#menu').onclick = () => $('#drawer').classList.add('open');
  $('#close').onclick = () => $('#drawer').classList.remove('open');
  $('#drawer').onclick = (e) => { if (e.target.id === 'drawer') $('#drawer').classList.remove('open'); };
  $('#logout').onclick = () => { sessionStorage.removeItem('EKANNTO_ADMIN_DEMO_AUTH'); sessionStorage.removeItem('EKANNTO_ADMIN_DEMO_MODE'); location.href = 'admin.html'; };
  const defaults = {
    user: [], orders: [], products: [],
    plans: [{uuid: String(Date.now()), name:'Seller Starter', price:499, durationDays:30, enabled:true}],
    promos: [], payments:{methods:{cod:true,bkash:false,nagad:false,bank:false},instructions:''},
    ai:{endpoint:'',model:'@cf/cloudflare/clef-flash'},
    website:{siteName:'EKANNTO',currency:'BDT',language:'bn'}, audit:[]
  };
  let data = read(cfg.key, defaults[cfg.kind] || []);
  function audit(action) {
    const logs = read('EKANNTO_AUDIT_LOG', []);
    logs.unshift({uuid:String(Date.now()), timestamp:new Date().toISOString(), tenant_id:'local-tenant', action});
    write('EKANNTO_AUDIT_LOG', logs.slice(0,500));
  }
  function save() { write(cfg.key, data); audit(cfg.kind + '-updated'); $('#msg').textContent = 'এই ব্রাউজারে সংরক্ষণ হয়েছে।'; render(); }
  function render() {
    const area = $('#formArea'), records = $('#records');
    if (['user','orders','products'].includes(cfg.kind)) {
      area.innerHTML = '<form id="recordForm"><label>Record ID</label><input name="id" required><label>Name / Order / Product</label><input name="name" required><label>Status</label><select name="status"><option>pending</option><option>approved</option><option>rejected</option><option>paid</option><option>unpaid</option><option>refunded</option><option>active</option><option>disabled</option></select><label>Notes / Reject or refund reason</label><textarea name="notes" rows="2"></textarea><button class="ea-admin-btn primary">Save record</button></form>';
      records.innerHTML = (Array.isArray(data) ? data : []).map((x,i) => '<article class="ea-admin-card"><b>'+esc(x.name || x.id)+'</b> · '+esc(x.status)+'<p>'+esc(x.notes || '')+'</p><button class="ea-admin-btn" data-remove="'+i+'">Delete local record</button></article>').join('') || '<p>No local records. Website records are not automatically imported.</p>';
      $('#recordForm').onsubmit = (e) => { e.preventDefault(); const f=e.currentTarget; data=Array.isArray(data)?data:[]; data.push({uuid:String(Date.now()),id:f.elements.id.value,name:f.elements.name.value,status:f.elements.status.value,notes:f.elements.notes.value,timestamp:new Date().toISOString(),tenant_id:'local-tenant'}); save(); };
      records.querySelectorAll('[data-remove]').forEach((b) => b.onclick = () => { data.splice(Number(b.dataset.remove),1); save(); }); return;
    }
    if (cfg.kind === 'plans') {
      area.innerHTML='<form id="f"><label>Plan name</label><input name="name" required><label>Price (BDT)</label><input name="price" type="number" min="0" required><label>Duration (days)</label><input name="duration" type="number" min="1" value="30" required><label><input name="enabled" type="checkbox" checked> Enabled</label><button class="ea-admin-btn primary">Add plan</button></form>';
      records.innerHTML=(Array.isArray(data)?data:[]).map((x,i)=>'<article class="ea-admin-card"><b>'+esc(x.name)+'</b> · ৳'+x.price+' · '+x.durationDays+' days · '+(x.enabled?'Enabled':'Disabled')+' <button class="ea-admin-btn" data-toggle="'+i+'">Toggle</button> <button class="ea-admin-btn" data-del="'+i+'">Delete</button></article>').join('');
      $('#f').onsubmit=(e)=>{e.preventDefault();const f=e.currentTarget;data.push({uuid:String(Date.now()),name:f.elements.name.value,price:Number(f.elements.price.value),durationDays:Number(f.elements.duration.value),enabled:f.elements.enabled.checked,timestamp:new Date().toISOString(),tenant_id:'local-tenant'});save();};
      records.querySelectorAll('[data-toggle]').forEach(b=>b.onclick=()=>{data[Number(b.dataset.toggle)].enabled=!data[Number(b.dataset.toggle)].enabled;save();});
      records.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{data.splice(Number(b.dataset.del),1);save();}); return;
    }
    if (cfg.kind === 'promos') {
      area.innerHTML='<form id="f"><label>Code</label><input name="code" required><label>Discount type</label><select name="type"><option value="percent">Percentage</option><option value="fixed">Fixed amount</option></select><label>Amount</label><input name="amount" type="number" min="0" required><label>Eligible for</label><select name="eligible"><option value="premium">Premium plan only</option><option value="shopping">General shopping</option></select><button class="ea-admin-btn primary">Create promo</button></form>';
      records.innerHTML=(Array.isArray(data)?data:[]).map((x,i)=>'<article class="ea-admin-card"><b>'+esc(x.code)+'</b> · '+esc(x.type)+' '+x.amount+' · '+esc(x.eligible)+' <button class="ea-admin-btn" data-del="'+i+'">Delete</button></article>').join('');
      $('#f').onsubmit=(e)=>{e.preventDefault();const f=e.currentTarget;data.push({uuid:String(Date.now()),code:f.elements.code.value.trim().toUpperCase(),type:f.elements.type.value,amount:Number(f.elements.amount.value),eligible:f.elements.eligible.value,usage:0,status:'enabled',timestamp:new Date().toISOString(),tenant_id:'local-tenant'});save();};
      records.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{data.splice(Number(b.dataset.del),1);save();}); return;
    }
    if (['payments','ai','website'].includes(cfg.kind)) {
      let fields='';
      if(cfg.kind==='payments') fields='<label><input type="checkbox" name="cod"> Cash on delivery</label><label><input type="checkbox" name="bkash"> bKash</label><label><input type="checkbox" name="nagad"> Nagad</label><label><input type="checkbox" name="bank"> Bank transfer</label><label>Instructions</label><textarea name="instructions"></textarea>';
      if(cfg.kind==='ai') fields='<label>Cloudflare Worker endpoint</label><input name="endpoint" type="url" placeholder="https://...workers.dev"><label>Default model</label><select name="model">'+['@cf/cloudflare/clef-flash','anthropic/claude-haiku-5.5','openai/gpt-6.1-sol','anthropic/claude-opus-5.5','bria/fibo-generate-1.5','bria/remove-background','google/gemini-3.8-flash-tts'].map(x=>'<option>'+x+'</option>').join('')+'</select>';
      if(cfg.kind==='website') fields='<label>Website name</label><input name="siteName"><label>Currency</label><select name="currency"><option>BDT</option><option>USD</option></select><label>Default language</label><select name="language"><option value="bn">বাংলা</option><option value="en">English</option><option value="both">বাংলা + English</option></select>';
      area.innerHTML='<form id="f">'+fields+'<button class="ea-admin-btn primary">Save settings</button></form>';
      const f=$('#f'); Object.entries(data||{}).forEach(([k,v])=>{if(f.elements[k]){if(f.elements[k].type==='checkbox')f.elements[k].checked=!!v;else f.elements[k].value=v;}});
      f.onsubmit=(e)=>{e.preventDefault();const next={};Array.from(f.elements).forEach(el=>{if(el.name)next[el.name]=el.type==='checkbox'?el.checked:el.value;});if(cfg.kind==='payments')next.methods={cod:next.cod,bkash:next.bkash,nagad:next.nagad,bank:next.bank};data=next;save();};
      records.innerHTML='<p>Settings are local-only until backend integration.</p>'; return;
    }
    if(cfg.kind==='audit'){data=read('EKANNTO_AUDIT_LOG',[]);records.innerHTML=data.map(x=>'<article class="ea-admin-card"><b>'+esc(x.action)+'</b><p>'+esc(x.timestamp)+' · '+esc(x.tenant_id)+'</p></article>').join('')||'<p>No audit entries yet.</p>';}
  }
  $('#export').onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=cfg.kind+'-backup.json';a.click();URL.revokeObjectURL(a.href);};
  $('#refresh').onclick=()=>{data=read(cfg.key,defaults[cfg.kind]||[]);render();};
  render();
})();
