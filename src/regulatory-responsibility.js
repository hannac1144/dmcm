const ownershipOptions=[['Company / organization','company-owned'],['Founder or inventor','founder-owned'],['University / research institution','university-owned'],['Licensed from another party','licensed-in'],['Joint ownership','jointly-owned'],['Unclear / still being documented','ownership-unclear'],['Other','ownership-other']];
const ownershipNotes={
'company-owned':'Check signed invention and work-product assignments from founders, employees, contractors and collaborators; verify the company owns the relevant patents, code, data and know-how.',
'founder-owned':'Consider assignment or a company license before financing or partnering. Investors and licensees will want proof the company can grant the rights in the deal.',
'university-owned':'Review technology-transfer rules, sponsored research, grants, publication rights and any government or third-party obligations before commercializing.',
'licensed-in':'Read the upstream license for field, territory, exclusivity, sublicensing, diligence, payment, improvements, assignment, change of control and termination.',
'jointly-owned':'Review the collaboration agreement and applicable law to understand each owner’s use, licensing, enforcement, assignment and consent rights.',
'ownership-unclear':'Identify inventors/contributors, employers, institutions, funding sources, prior agreements and missing assignments. Resolve title before granting rights.',
'ownership-other':'Identify every owner or rights-holder and determine which assignments, licenses, consents or approvals are needed.'};
const regulatoryOptions=[['Keep regulatory lead in-house','in-house'],['Share with a development / commercial partner','shared'],['Partner or licensee leads','partner-led'],['Not decided yet','undetermined']];
const regulatoryNotes={
'in-house':'You retain strategy and direct oversight, but need sufficient staff, systems and budget. Confirm the applicant/sponsor/authorization-holder role; submission and agency-contact control; quality and safety systems; records; vendors; costs; and post-market duties.',
'shared':'Partner resources may fill capability gaps, but split tasks and decision rights explicitly. Name who handles submissions, agency meetings, safety reporting, quality, costs, data access, disputes and ongoing obligations.',
'partner-led':'This can reduce your operational burden but increases dependence on the partner. Preserve appropriate visibility, access to filings/data/correspondence, performance milestones, consultation rights and transfer/reversion rights if the deal ends.',
'undetermined':'Map the pathway and available capabilities before signing. Decide who leads regulator contact, submissions, safety/quality, costs, data/records, major decisions and transition if the collaboration terminates.'};
const ownershipMap={
'company-owned':["The company should be able to prove it owns the technology before sharing or selling rights.","Check that founders, employees and collaborators signed paperwork giving the company those rights."],
'founder-owned':["The company may not be free to use or license technology owned by a founder.","Consider whether the founder should assign it to the company or give the company a clear license."],
'university-owned':["The university may control whether and how the technology can be commercialized.","Check the university’s license process and any grant or research promises."],
'licensed-in':["Your company can only use the technology within the rights it received.","Review allowed uses, sublicensing and what happens if the license ends."],
'jointly-owned':["More than one owner may need to agree on important decisions.","Check who can use, license or sell the technology and whether consent is needed."],
'ownership-unclear':["Unclear ownership can delay funding, partnerships or a sale.","Identify contributors and find missing assignments or agreements."],
'ownership-other':["The company needs to know who has rights and who must approve a deal.","Write down the arrangement and any permissions or paperwork still needed."]};
const regulatoryMap={
'in-house':["You keep control, but your team is responsible for doing the regulatory work.","Make sure you have the right people, time and budget to manage submissions, safety and records."],
'shared':["A partner can help, but unclear roles can lead to missed tasks or disagreements.","Agree who handles regulator contact, paperwork, safety issues, costs and decisions."],
'partner-led':["The partner does more of the work, but you may have less control or visibility.","Ask for updates and access to key files, and decide how you get them back if the deal ends."],
'undetermined':["The choice affects control, cost and who must do the work.","Before signing, decide who leads, who pays, who keeps records and what happens if the partnership ends."]};
let priorityWasChosen=false;
document.addEventListener('click',e=>{const btn=e.target.closest('button.choice');if(!btn)return;const h=[...document.querySelectorAll('h1,h2')].find(x=>x.textContent.trim().toLowerCase().includes('what matters most to you'));if(h&&h.closest('.question-screen')){priorityWasChosen=true;try{sessionStorage.removeItem('healthtech-regulatory-page-complete')}catch{}}},true);
function buildPage(){
 const page=document.createElement('section');page.dataset.regulatoryFactor='true';page.className='decision-screen regulatory-standalone-page';
 page.innerHTML=`<div class="regulatory-page-inner">
 <div class="nav-row regulatory-top-nav"><button type="button" class="text-button regulatory-back">← Back</button></div>
 <div class="decision-header"><span class="eyebrow">Legal & regulatory planning</span><h1>Ownership & regulatory responsibility</h1><p>Two quick checks before comparing funding and development routes: confirm who controls the technology and who should lead regulatory work.</p></div>
 <div class="regulatory-simple-card"><h2>Who owns or controls the technology?</h2><p>Choose the closest answer. Ownership can affect whether the organization has authority to license, raise money or transfer the asset.</p>
 <div class="regulatory-factor-options ownership-options">${ownershipOptions.map(([label,value])=>`<button type="button" class="regulatory-factor-option ownership-factor-option" data-value="${value}">${label}</button>`).join('')}</div>
 <div class="ownership-other-wrap" hidden><label><strong>Describe the arrangement</strong><input class="ownership-other-input" placeholder="Briefly describe who owns it or what is unresolved"/></label></div><div class="ownership-note"><strong>Why it matters:</strong> The company needs to know who has the rights before it can use, license or sell the technology.<br><strong>Consider:</strong> Check ownership paperwork and whether anyone else must approve a deal.</div></div>
 <div class="regulatory-simple-card"><h2>Who should lead regulatory responsibility?</h2><p>This affects regulatory control, workload, cost, records and what happens if a partnership ends.</p>
 <div class="regulatory-factor-options">${regulatoryOptions.map(([label,value])=>`<button type="button" class="regulatory-factor-option responsibility-option" data-value="${value}">${label}</button>`).join('')}</div><div class="responsibility-note"><strong>Why it matters:</strong> This choice affects who manages regulatory work, pays for it and controls important decisions.<br><strong>Consider:</strong> Agree who handles submissions, regulator contact, safety and quality tasks, costs, records and handoff if the deal ends.</div></div>
 <div class="regulatory-simple-card"><h2>Before moving on</h2><ul><li>List patents, software, data, know-how and improvements—and confirm assignments and third-party rights.</li><li>Check university, grant, sponsored-research or existing license restrictions.</li><li>Write down who controls submissions, regulator contact, safety/quality duties, costs and records.</li><li>Agree on access and transfer of files, data and materials if the deal ends.</li></ul></div>
 <div class="nav-row"><button type="button" class="text-button regulatory-back">← Back</button><button type="button" class="primary regulatory-continue" disabled>Continue to funding & development →</button></div>
 <p class="regulatory-disclaimer">This is an issue-spotting prompt. Applicable ownership and regulatory duties depend on the technology, agreements, product pathway and state law.</p>`;
 return page;
}
function showStandalonePage(){
 if(document.querySelector('[data-regulatory-factor]'))return;
 let complete=false;try{complete=sessionStorage.getItem('healthtech-regulatory-page-complete')==='yes'}catch{}
 if(!priorityWasChosen||complete)return;
 const funding=[...document.querySelectorAll('h1')].find(h=>h.textContent.includes('How should you fund and develop the program?'));
 if(!funding)return;
 const fundingScreen=funding.closest('.decision-screen')||funding.closest('section'),main=funding.closest('main');if(!fundingScreen||!main)return;
 fundingScreen.style.display='none';const page=buildPage();main.insertBefore(page,fundingScreen);
 const ownNote=page.querySelector('.ownership-note'),ownOther=page.querySelector('.ownership-other-wrap'),ownInput=page.querySelector('.ownership-other-input'),regNote=page.querySelector('.responsibility-note'),continueBtn=page.querySelector('.regulatory-continue');
 let ownership='',responsibility='';
 try{ownership=sessionStorage.getItem('healthtech-ownership')||'';responsibility=sessionStorage.getItem('healthtech-regulatory-responsibility')||'';ownInput.value=sessionStorage.getItem('healthtech-ownership-other')||'';}catch{}
 function chooseOwnership(value){ownership=value;try{sessionStorage.setItem('healthtech-ownership',value)}catch{}
 page.querySelectorAll('.ownership-factor-option').forEach(b=>b.classList.toggle('selected',b.dataset.value===value));ownOther.hidden=value!=='ownership-other';ownNote.hidden=false;const note=ownershipMap[value]||["This affects who can use or share the technology.","Confirm the arrangement and any approvals needed."];ownNote.innerHTML=`<strong>Why it matters:</strong> ${note[0]}<br><strong>Consider:</strong> ${note[1]}`;validate();}
 function chooseResponsibility(value){responsibility=value;try{sessionStorage.setItem('healthtech-regulatory-responsibility',value)}catch{}
 page.querySelectorAll('.responsibility-option').forEach(b=>b.classList.toggle('selected',b.dataset.value===value));regNote.hidden=false;const note=regulatoryMap[value]||["This affects who manages regulatory work.","Agree on roles, costs and access to records."];regNote.innerHTML=`<strong>Why it matters:</strong> ${note[0]}<br><strong>Consider:</strong> ${note[1]}`;validate();}
 function validate(){continueBtn.disabled=!ownership||!responsibility||(ownership==='ownership-other'&&!ownInput.value.trim());}
 page.querySelectorAll('.ownership-factor-option').forEach(b=>b.addEventListener('click',()=>chooseOwnership(b.dataset.value)));
 page.querySelectorAll('.responsibility-option').forEach(b=>b.addEventListener('click',()=>chooseResponsibility(b.dataset.value)));
 ownInput.addEventListener('input',()=>{try{sessionStorage.setItem('healthtech-ownership-other',ownInput.value.trim())}catch{}validate();});
 if(ownership)chooseOwnership(ownership);if(responsibility)chooseResponsibility(responsibility);validate();
 const goBack=()=>{priorityWasChosen=false;page.remove();fundingScreen.style.display='';const back=fundingScreen.querySelector('.text-button');if(back)back.click();window.scrollTo({top:0,behavior:'smooth'});};
 page.querySelectorAll('.regulatory-back').forEach(btn=>btn.addEventListener('click',goBack));
 continueBtn.addEventListener('click',()=>{try{sessionStorage.setItem('healthtech-regulatory-page-complete','yes')}catch{}priorityWasChosen=false;page.remove();fundingScreen.style.display='';window.scrollTo({top:0,behavior:'smooth'});});
 window.scrollTo({top:0,behavior:'smooth'});
}
new MutationObserver(showStandalonePage).observe(document.documentElement,{subtree:true,childList:true});showStandalonePage();