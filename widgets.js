(() => {
 'use strict';
 const status = document.querySelector('#inat-status');
 const grid = document.querySelector('#inat-grid');
 const snapshot = JSON.parse(document.querySelector('#inat-snapshot').textContent);
 const savedDate = new Date(snapshot.retrievedAt).toLocaleDateString('en-GB', {day:'numeric',month:'short',year:'numeric'});
 const safePhoto = value => {
  try {const u=new URL(value);return u.protocol==='https:'&&['inaturalist-open-data.s3.amazonaws.com','static.inaturalist.org'].includes(u.hostname)?u.href:null;}catch{return null;}
 };
 const formatDate=value=>{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value||''))return 'Date not recorded';
  const date=new Date(value+'T12:00:00Z');
  return Number.isNaN(date.getTime())?'Date not recorded':date.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'});
 };
 function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;}
 function makeCard(o){
  const link=element('a','observation-card');link.href=o.url;link.target='_blank';link.rel='noopener noreferrer';
  const frame=element('div','observation-photo');
  const img=element('img');img.src=o.photo;img.alt=o.common||o.name;img.loading='lazy';img.width=600;img.height=450;
  img.addEventListener('error',()=>{
   const old=snapshot.observations.find(p=>p.id===o.id);
   if(old&&!img.dataset.retried){img.dataset.retried='true';img.src=old.localPhoto;}
   else{img.remove();frame.append(element('span','photo-unavailable','View photo on iNaturalist'));}
  });
  frame.append(img,element('span','observation-grade',({research:'Research grade',needs_id:'Needs ID',casual:'Casual'})[o.grade]||'Observation'));
  const info=element('div','observation-info');const scientific=element('p','scientific-name');scientific.append(element('i','',o.name));
  info.append(element('h3','',o.common||o.name),scientific,element('span','observation-date',formatDate(o.date)+' ↗'),element('small','observation-credit',o.attribution));
  link.append(frame,info);return link;
 }
 async function update(){
  const controller=new AbortController();const timeout=setTimeout(()=>controller.abort(),10000);
  const base='https://api.inaturalist.org/v1/observations';const query='user_id=farhan_adyn&verifiable=any';
  try {
   const payloads=await Promise.all([
    `${base}?${query}&photos=true&per_page=6&order_by=created_at&order=desc`,
    `${base}?${query}&per_page=0`,`${base}/species_counts?${query}&per_page=0`
   ].map(async url=>{const r=await fetch(url,{signal:controller.signal,credentials:'omit'});if(!r.ok)throw new Error('iNaturalist unavailable');return r.json();}));
   const [observations,total,species]=payloads;
   if(!Array.isArray(observations.results)||!Number.isInteger(total.total_results)||!Number.isInteger(species.total_results))throw new Error('Unexpected response');
   const valid=observations.results.filter(r=>r.user?.login==='farhan_adyn'&&Number.isSafeInteger(r.id)&&r.photos?.some(p=>!p.hidden&&safePhoto(p.url))).map(r=>{
    const p=r.photos.find(p=>!p.hidden&&safePhoto(p.url));
    return {id:r.id,url:`https://www.inaturalist.org/observations/${r.id}`,date:r.observed_on,name:r.taxon?.name||'Unidentified organism',common:r.taxon?.preferred_common_name,grade:r.quality_grade,photo:safePhoto(p.url.replace('/square.','/medium.')),attribution:p.attribution||'Photo via iNaturalist'};
   });
   if(observations.results.length&&!valid.length)throw new Error('No valid observations');
   grid.replaceChildren(...valid.map(makeCard));
   if(!valid.length)grid.append(element('p','empty','No public photo observations are available right now. Explore the full collection on iNaturalist.'));
   document.querySelector('#inat-total').textContent=total.total_results.toLocaleString('en-US');
   document.querySelector('#inat-species').textContent=species.total_results.toLocaleString('en-US');
   status.textContent='Updated from iNaturalist · '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
  }catch{
   status.textContent=`Showing the saved snapshot from ${savedDate}. Live updates are temporarily unavailable.`;
  }finally{clearTimeout(timeout);}
 }
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();update();}},{rootMargin:'350px'});observer.observe(grid);}else{update();}
 document.querySelectorAll('.featured-image img').forEach(img=>img.addEventListener('error',()=>{img.hidden=true;img.parentElement.classList.add('image-unavailable');}));
})();
