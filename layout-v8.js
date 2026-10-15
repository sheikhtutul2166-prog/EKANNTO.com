/* EKANNTO V8: layout-only improvements; preserves previous modules and local data. */
(()=>{'use strict';
const p=document.body.dataset.page, root=document.getElementById('app');if(!root)return;
const links=[['wishlist.html','♡','Wishlist'],['notifications.html','♧','Notifications'],['help.html','?','Help Center'],['compare.html','⇄','Compare'],['followed-shops.html','♧','Following'],['rewards.html','✦','Rewards'],['settings.html','⚙','Settings'],['ai-shopping.html','✦','Smart Shopping'],['ai-image-search.html','▧','Image Search'],['ai-recommendations.html','♡','For You'],['ai-support.html','◉','Support Assistant']];
const removeExtras=()=>{root.querySelectorAll('.v5-feature-links,.v3-quick,.ai-links').forEach(e=>e.remove());root.querySelectorAll('.feature-links').forEach(e=>{if([...e.querySelectorAll('a')].some(a=>['Wishlist','Notifications','Help Center'].some(s=>a.textContent.includes(s))))e.remove()});};
if(p==='home'){
 removeExtras();
 const extras=[...root.querySelectorAll('.extra-section')];let deals=extras.find(e=>e.querySelector('h2')?.textContent.includes('Today’s Deals'));if(deals)deals.remove();
 // Replace the original Top Ranked grid with a horizontal product rail.
 const headings=[...root.querySelectorAll('.sectionhead')];const rank=headings.find(h=>h.querySelector('h2')?.textContent.trim()==='Top Ranked');
 if(rank){const old=rank.nextElementSibling;if(old?.classList.contains('grid'))old.remove();const products=[...db.products].sort((a,b)=>(b.sold||0)-(a.sold||0)).slice(0,12);const rail=document.createElement('div');rail.className='ek-rail';rail.setAttribute('aria-label','Top Ranked products');rail.innerHTML=products.map(productCard).join('');rank.after(rail);}
 const hero=root.querySelector('.hero');const today=document.createElement('section');today.className='ek-deals';today.innerHTML=`${title('Today’s Deals','<a href="flash-sale.html">View all →</a>')}<div class="ek-rail" aria-label="Today’s Deals products">${db.products.filter(x=>x.oldPrice>x.price).slice(0,12).map(productCard).join('')||'<p class="muted">No deals available.</p>'}</div>`;if(hero)hero.after(today);else root.prepend(today);
}
if(p==='shop')removeExtras();
if(p==='product'){
 // Reviews before You May Also Like, while retaining the existing review form handlers.
 const heads=[...root.querySelectorAll('.sectionhead')];const like=heads.find(h=>h.querySelector('h2')?.textContent.trim()==='You May Also Like');const review=heads.find(h=>h.querySelector('h2')?.textContent.trim()==='Customer Reviews');if(like&&review){const section=review.closest('.extra-section');if(section)like.before(section);}
 root.querySelectorAll('.v3-quick,.ai-links').forEach(e=>e.remove());
 root.querySelectorAll('a,button').forEach(e=>{const t=e.textContent.trim().toLowerCase();if(['compare products','report listing','find similar products'].includes(t))e.remove()});
}
if(p==='profile'){
 root.querySelectorAll('.feature-links,.v3-links,.v3-quick,.ai-links').forEach(e=>e.remove());
 const panel=document.createElement('section');panel.className='ek-profile-tools';panel.innerHTML=`${title('My Tools & Services')}<div class="ek-profile-links">${links.map(([url,symbol,label])=>`<a href="${url}" class="ek-tool"><span aria-hidden="true">${symbol}</span><span>${label}</span><span aria-hidden="true">›</span></a>`).join('')}</div>`;root.append(panel);
}
})();