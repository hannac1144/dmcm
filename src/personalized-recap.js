const labels={
 'company-owned':'Company-owned technology','founder-owned':'Founder-owned technology','university-owned':'University-controlled technology','licensed-in':'Technology licensed from a third party','jointly-owned':'Jointly owned technology','ownership-unclear':'Ownership needs clarification','ownership-other':'Other ownership arrangement',
 'in-house':'Keep regulatory responsibility in-house','shared':'Share regulatory responsibility with a partner','partner-led':'Partner leads regulatory responsibility','undetermined':'Regulatory responsibility still to be decided'
};
function textOf(el){return (el?.textContent||'').replace(/\s+/g,' ').trim()}
function findRecommendation(title){
 const hs=[...document.querySelectorAll('h1,h2,h3,h4')];const h=hs.find(x=>textOf(x).toLowerCase().includes(title.toLowerCase()));if(!h)return null;
 const scope=h.closest('section')||h.parentElement;
 const recommended=[...scope.querySelectorAll('article,.card,.option-card,.recommendation-card,.result-card')].find(x=>/recommended|best fit|strong fit|primary/i.test(textOf(x)));
 if(recommended){const rh=recommended.querySelector('h2,h3,h4,strong');return rh?textOf(rh):null}
 const cards=[...scope.querySelectorAll('article,.card,.option-card,.recommendation-card,.result-card')];for(const c of cards){const ch=c.querySelector('h2,h3,h4');if(ch&&textOf(ch)&&!textOf(ch).toLowerCase().includes('why this result'))return textOf(ch)}return null;
}
function makeRecap(){
 if(document.querySelector('[data-personalized-recap]'))return;
 const headings=[...document.querySelectorAll('h1,h2')];const summary=headings.find(h=>textOf(h).includes('You’ve mapped the key decisions'));if(!summary)return;
 const section=summary.closest('section');if(!section)return;
 const funding=findRecommendation('How should you fund and develop the program?');
 const license=findRecommendation('What type of license should you consider?');
 const terms=findRecommendation('Which contractual terms deserve your attention?');
 const ownership=sessionStorage.getItem('healthtech-ownership')||'';const reg=sessionStorage.getItem('healthtech-regulatory-responsibility')||'';
 const cards=[];
 if(funding)cards.push({n:'1',title:'Development & funding',pick:funding,why:'This option appears to fit the financing need, development stage, capabilities and priorities you entered.',next:'Use this as the starting point when deciding whether to raise capital, develop independently or approach a strategic partner.'});
 if(license)cards.push({n:'2',title:'Licensing approach',pick:license,why:'This structure appears to provide a useful balance between partner incentives and the rights and flexibility your organization may want to keep.',next:'Before agreeing to exclusivity, define exactly which products, uses, indications, territories and future rights are included.'});
 if(terms)cards.push({n:'3',title:'Contract priorities',pick:terms,why:'These terms deserve particular attention because they affect whether the deal works as intended if development succeeds, slows down or ends.',next:'Turn these issues into a short negotiation checklist and discuss them with counsel before signing a term sheet or definitive agreement.'});
 if(reg)cards.push({n:String(cards.length+1),title:'Regulatory responsibility',pick:labels[reg]||reg,why:'Your answer affects who controls regulatory strategy, bears compliance work and costs, and needs access to regulatory records and data.',next:'Make sure the same allocation appears consistently in the development agreement, license, quality/safety arrangements and termination provisions.'});
 const recap=document.createElement('section');recap.dataset.personalizedRecap='true';recap.className='personalized-recap';
 recap.innerHTML=`<span class="eyebrow">Your simplified recap</span><h2>Your likely starting points</h2><p class="recap-lead">Based on the answers you provided, these are the options and legal issues that appear most relevant to explore first. Think of this as a short action plan—not a substitute for legal or financial advice.</p>${ownership?`<div class="recap-foundation"><strong>Start with ownership:</strong> ${labels[ownership]||ownership}. Confirm that the organization has the rights it expects before financing or licensing the program.</div>`:''}<div class="recap-cards">${cards.map(c=>`<article class="recap-card"><div class="recap-number">${c.n}</div><div><span class="recap-label">${c.title}</span><h3>${c.pick}</h3><p><strong>Why it fits:</strong> ${c.why}</p><p class="recap-next"><strong>What to do next:</strong> ${c.next}</p></div></article>`).join('')}</div><div class="recap-bottom"><strong>In simple terms</strong><p>${funding?`Start by exploring <b>${funding}</b>`:'Start with the development and funding pathway identified above'}${license?`, structure any partner rights around <b>${license}</b>`:''}, and make sure the contract clearly protects ownership, regulatory access, performance expectations and what happens if the relationship ends.</p></div>`;
 const grid=section.querySelector('.summary-grid');if(grid)grid.insertAdjacentElement('beforebegin',recap);else summary.insertAdjacentElement('afterend',recap);
}
let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(makeRecap,100)}).observe(document.documentElement,{subtree:true,childList:true});makeRecap();