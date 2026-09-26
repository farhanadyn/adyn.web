const projects = [
 {title:'RSPO compensation programme',region:'Kalimantan',location:'Katingan',year:2022,area:400,transects:2,records:28,species:14,kind:'Biodiversity assessment',description:'Mammal survey work in the Telaga Village Forest within an RSPO compensation programme. Field experience included line transects and mist-netting, alongside collaboration with the biodiversity team and local communities.'},
 {title:'Community carbon survey',region:'Sulawesi',location:'Sulawesi',year:2023,area:1200,transects:6,records:72,species:26,kind:'Carbon project',description:'Mammal survey contribution to the Community carbon survey project. The survey recap records six transects across a reported sampling area of 1,200 hectares.'},
 {title:'SERCOVA',region:'Maluku',location:'East Seram',year:2024,area:1200,transects:6,records:145,species:16,kind:'Biodiversity survey',description:'Mammal survey work in East Seram. Six transects generated 145 encounter records in the survey recap, with 16 species reported for the project.'},
 {title:'RSPO compensation programme',region:'Kalimantan',location:'Ketapang',year:2024,area:400,transects:2,records:94,species:40,kind:'Biodiversity assessment',description:'Mammal survey contribution to an RSPO compensation programme in Ketapang. The project recap records two transects and a sampling area of 400 hectares.'},
 {title:'Carbon biodiversity survey A',region:'Papua',location:'Papua',year:2024,area:600,transects:3,records:106,species:24,kind:'Carbon project',description:'Mammal survey contribution to the Carbon biodiversity survey A in Papua. The recap reports three transects, 106 encounter records and 24 species at project level.'},
 {title:'Carbon biodiversity survey B',region:'Papua',location:'Papua',year:2024,area:200,transects:1,records:29,species:8,kind:'Carbon project',description:'Mammal survey contribution to the Carbon biodiversity survey B in Papua. Survey effort is reported as one transect and 200 hectares of sampling area.'},
 {title:'HCV–HCS partnership survey',region:'Sumatra',location:'Siak',year:2025,area:200,transects:1,records:12,species:7,kind:'HCV–HCS assessment',description:'Mammal survey contribution to an HCV–HCS assessment in Siak. The project recap reports 12 encounter records and seven species from one transect.'},
 {title:'Schwanner–Muller Project',region:'Kalimantan',location:'Ketapang & Melawi',year:2025,area:400,transects:2,records:69,species:34,kind:'Biodiversity survey',description:'Mammal survey work in the Ketapang and Melawi landscapes. The survey recap reports 69 encounter records and 34 species at project level.'},
 {title:'M4CR Blue Carbon',region:'Kalimantan',location:'Nunukan, Bulungan & Tana Tidung',year:2026,area:1200,transects:6,records:102,species:19,kind:'Blue carbon project',description:'Mammal survey contribution to M4CR Blue Carbon in North Kalimantan. The January 2026 recap records six transects and a sampling area of 1,200 hectares.'},
 {title:'HCV–HCS partnership survey',region:'Sumatra',location:'Kampar, Kepulauan Meranti & Siak',year:2026,area:1000,transects:5,records:43,species:16,kind:'HCV–HCS assessment',description:'Mammal survey contribution to an HCV–HCS assessment across three Riau landscapes. The June 2026 recap reports five transects, 43 encounter records and 16 species at project level.'}
];
let region='All';
const number=n=>n.toLocaleString('en-US');
const dialog=document.querySelector('#project-dialog');
function render(){
 const year=document.querySelector('#year').value;
 const selected=projects.filter(p=>(region==='All'||p.region===region)&&(year==='All'||String(p.year)===year));
 document.querySelector('#stat-projects').textContent=selected.length;
 for(const [id,key] of [['area','area'],['transects','transects'],['records','records']])document.querySelector('#stat-'+id).textContent=number(selected.reduce((a,p)=>a+p[key],0));
 document.querySelector('#result-count').textContent=`${selected.length} ${selected.length===1?'project':'projects'}`;
 const grid=document.querySelector('#projects');grid.replaceChildren();
 for(const p of [...selected].reverse()){
  const button=document.createElement('button');button.className='project-card';
  button.innerHTML=`<span class="card-top"><span>${p.region}</span><span>${p.year}</span></span><h3>${p.title}</h3><span class="location">${p.location}</span><span class="card-bottom"><span>${p.kind}</span><span class="card-arrow" aria-hidden="true">↗</span></span>`;
  button.setAttribute('aria-haspopup','dialog');button.addEventListener('click',()=>openProject(p));grid.append(button);
 }
 if(!selected.length){const empty=document.createElement('p');empty.className='empty';empty.textContent='No projects in this selection. Try another year or choose all regions.';grid.append(empty);}
}
function openProject(p){
 document.querySelector('#dialog-region').textContent=`${p.region} / ${p.year}`;
 document.querySelector('#dialog-title').textContent=p.title;
 document.querySelector('#dialog-location').textContent=p.location;
 document.querySelector('#dialog-description').textContent=p.description;
 document.querySelector('#dialog-stats').innerHTML=[['Sampling area (ha)',p.area],['Transects',p.transects],['Encounter records',p.records],['Species reported in project',p.species]].map(([k,v])=>`<div><dt>${k}</dt><dd>${number(v)}</dd></div>`).join('');
 dialog.showModal();document.body.classList.add('dialog-open');
}
document.querySelectorAll('[data-region]').forEach(button=>button.addEventListener('click',()=>{region=button.dataset.region;document.querySelectorAll('[data-region]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',active);});render();}));
document.querySelector('#year').addEventListener('change',render);
document.querySelectorAll('.close-dialog,.close-bottom').forEach(b=>b.addEventListener('click',()=>dialog.close()));
dialog.addEventListener('close',()=>document.body.classList.remove('dialog-open'));
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
render();

