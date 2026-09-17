const regulatoryOptions=[['Keep primary regulatory responsibility in-house','in-house'],['Share regulatory responsibility with a development or commercial partner','shared'],['Transfer primary regulatory responsibility to a licensee / strategic partner','partner-led'],['Regulatory responsibility has not been determined yet','undetermined']];
const notes={'in-house':'Keeping regulatory responsibility can preserve control over agency strategy, submissions, regulatory data, labeling and development sequencing, but the company should confirm it has the personnel, quality systems, budget and vendor oversight needed to perform those obligations.','shared':'Shared responsibility requires precise allocation of who prepares and owns submissions, communicates with regulators, maintains regulatory files, handles safety reporting, controls labeling, pays regulatory costs and resolves disagreements about regulatory strategy.','partner-led':'If a partner will lead regulatory work, define access to regulatory data and correspondence, consultation or consent rights, diligence standards, ownership or control of applications, transition obligations and what happens to regulatory materials after termination or reversion.','undetermined':'Regulatory responsibility should be addressed before a transaction is finalized because it can materially affect development cost, control, diligence obligations, data rights, governance, indemnification and the practical ability to continue the program after termination.'};
function renderRegulatoryFactor(){
 if(document.querySelector('[data-regulatory-factor]'))return;
 const headings=[...document.querySelectorAll('h1,h2')];
 const priorities=headings.find(h=>h.textContent.trim().toLowerCase().includes('what matters most to you'));
 if(!priorities)return;
 const question=priorities.closest('.question')||priorities.closest('section')||priorities.parentElement;
 if(!question)return;
 const panel=document.createElement('section');panel.dataset.regulatoryFactor='true';panel.className='regulatory-factor-panel';
 panel.innerHTML=`<span class="eyebrow">Next decision factor</span><h2>Who should hold regulatory responsibility?</h2><p>Before moving into the recommended development pathways, consider who should control regulatory strategy, agency interactions, submissions, safety obligations, regulatory data and ongoing compliance.</p><div class="regulatory-factor-options">${regulatoryOptions.map(([label,value])=>`<button type="button" class="regulatory-factor-option" data-value="${value}">${label}</button>`).join('')}</div><div class="regulatory-factor-note" hidden></div>`;
 question.appendChild(panel);
 const note=panel.querySelector('.regulatory-factor-note');
 function choose(value){try{sessionStorage.setItem('healthtech-regulatory-responsibility',value)}catch{}panel.querySelectorAll('.regulatory-factor-option').forEach(b=>b.classList.toggle('selected',b.dataset.value===value));note.hidden=false;note.innerHTML=`<strong>Legal & regulatory consideration:</strong> ${notes[value]}`;}
 panel.querySelectorAll('.regulatory-factor-option').forEach(b=>b.addEventListener('click',()=>choose(b.dataset.value)));
 let saved='';try{saved=sessionStorage.getItem('healthtech-regulatory-responsibility')||''}catch{}if(saved)choose(saved);
}
new MutationObserver(renderRegulatoryFactor).observe(document.documentElement,{subtree:true,childList:true});renderRegulatoryFactor();
