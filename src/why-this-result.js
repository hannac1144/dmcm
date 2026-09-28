const sectionReasons={
 'How should you fund and develop the program?':'This recommendation is driven by the program’s development stage, financing need, capabilities, priorities, desired control, who is responsible for regulatory work, and the risks or economics the organization may be prepared to share.',
 'What type of license should you consider?':'This recommendation reflects the need to balance exclusive rights with rights you keep, development incentives, ability to bring the product to market, responsibility for FDA or other regulatory work, future partnering flexibility, and the organization’s stated priorities.',
 'Which contractual terms deserve your attention?':'These terms are highlighted because the questionnaire identifies legal and execution risks that should be allocated expressly in the deal, including development performance, economics, IP and data rights, regulatory obligations, termination, and return of rights.'
};
const optionReasons={
 'Funding that does not require giving up ownership':'This pathway becomes more relevant when preserving ownership and control is important and the program may qualify for research or development funding that does not require giving investors part of the company or granting broad commercial rights.',
 'Equity investment':'This pathway becomes more relevant when the organization needs flexible capital while retaining the underlying technology, and is willing to accept giving up a percentage of company ownership and potential investor rights to participate in major company decisions in exchange for financing.',
 'Strategic partnership / co-development':'This pathway becomes more relevant when the program needs both capital and capabilities—such as clinical, regulatory, manufacturing, or commercialization support—and the organization is willing to share control, rights, costs, or future financial value.',
 'Self-development':'This pathway becomes more relevant when maintaining operational and IP control is a high priority and the organization appears positioned to carry more of the financing, regulatory, development, and execution burden itself.',
 'Non-license giving one partner exclusive rights':'This structure becomes more relevant when the technology can support multiple partners, markets, channels, applications, or territories and the owner wants to preserve the ability to grant additional rights.',
 'License giving one partner exclusive rights':'This structure becomes more relevant when a partner may need protected rights to justify substantial clinical, regulatory, manufacturing, or commercialization investment, particularly for capital-intensive products.',
 'License limited by use, indication, or location':'This structure becomes more relevant when a partner needs meaningful exclusive rights but the owner can preserve value by retaining other indications, applications, products, patient populations, territories, or channels.',
 'Development agreed development goals & diligence':'This term is emphasized when continued development matters to the value of the deal. Agreed development goals and diligence standards can reduce the risk that licensed or partnered rights are shelved or underdeveloped.',
 'Economics: payments, agreed development goals & payments based on sales':'This term is emphasized when funding needs and future value are important. The economic structure determines how present and contingent value, development costs, commercial upside, and payment risk are allocated.',
 'IP, improvements & allowing a partner to give rights to another company':'This term is emphasized because ownership and control can change as the technology evolves. Clear rules for background IP, new inventions, data, patent control, improvements, and downstream licensing help preserve the intended allocation of rights.',
 'Termination, return of rights & rights after termination':'This term is emphasized because the practical value of an exit depends on what happens to IP rights, FDA or other regulatory submissions, data, rights a partner gives to another company, manufacturing information, inventory, ongoing studies, and transition obligations if the relationship ends.'
};
function addWhy(){
 document.querySelectorAll('[data-why-result]').forEach(n=>n.remove());
 const headings=[...document.querySelectorAll('h1,h2,h3,h4')];
 headings.forEach(h=>{
   const title=h.textContent.trim();const reason=optionReasons[title];if(!reason)return;
   const card=h.closest('article,.card,.option-card,.recommendation-card,.result-card')||h.parentElement;if(!card||card.querySelector('[data-why-result]'))return;
   const box=document.createElement('div');box.dataset.whyResult='true';box.className='why-result';
   const sectionTitle=Object.keys(sectionReasons).find(s=>document.body.innerText.includes(s));
   box.innerHTML=`<strong>Why this result?</strong><p>${reason}</p>${sessionStorage.getItem('healthtech-regulatory-responsibility')?'<span class="why-signal">Your regulatory-responsibility answer is also treated as a legal decision factor.</span>':''}`;
   const consider=[...card.querySelectorAll('strong,h4')].find(x=>x.textContent.toLowerCase().includes('consider'));
   if(consider&&consider.parentElement)consider.parentElement.insertAdjacentElement('beforebegin',box);else card.appendChild(box);
 });
}
let timer;new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(addWhy,80)}).observe(document.documentElement,{subtree:true,childList:true});addWhy();
