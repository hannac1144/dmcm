import React, { useMemo, useState } from 'react';

const fundingSources = [
  { name: 'NIH SBIR / STTR', type: 'Non-dilutive', fit: ['technology', 'drug'], assets: ['digital', 'device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'], stages: ['research', 'prototype', 'clinical', 'regulatory', 'discovery', 'ind-enabling', 'phase-1', 'phase-2', 'phase-3'], companies: ['startup', 'established'], amounts: ['under-250k', '250k-1m', '1m-5m'], note: 'NIH small-business programs support eligible U.S. small businesses conducting health and life-science R&D. STTR is structured for small-business/research-institution collaborations.', url: 'https://seed.nih.gov/small-business-funding' },
  { name: "NSF America's Seed Fund", type: 'Non-dilutive', fit: ['technology'], assets: ['digital', 'device', 'diagnostic', 'platform', 'other'], stages: ['research', 'prototype', 'clinical'], companies: ['startup', 'established'], amounts: ['250k-1m', '1m-5m'], note: 'NSF supports early-stage R&D for high-risk technologies with commercial potential and states that its Seed Fund can provide up to $2 million with zero equity.', url: 'https://seedfund.nsf.gov/' },
  { name: 'ARPA-H', type: 'Non-dilutive', fit: ['technology', 'drug'], assets: ['digital', 'device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'], stages: ['research', 'prototype', 'clinical', 'regulatory', 'discovery', 'ind-enabling', 'phase-1', 'phase-2'], companies: ['startup', 'established'], amounts: ['250k-1m', '1m-5m'], note: 'ARPA-H currently lists program, initiative, and small-business opportunities. Its SBIR/STTR page describes awards generally up to $600,000 for Phase I and $3.5 million for Phase II, subject to the solicitation.', url: 'https://arpa-h.gov/explore-funding/open-funding-opportunities' },
  { name: 'BARDA DRIVe', type: 'Government / strategic', fit: ['technology'], assets: ['device', 'diagnostic', 'platform', 'other'], stages: ['research', 'prototype', 'clinical', 'regulatory'], companies: ['startup', 'established', 'university', 'other'], amounts: ['under-250k', '250k-1m', '1m-5m'], note: 'Relevant to early-stage technologies addressing health-security, preparedness, or medical-countermeasure needs. Funding mechanisms vary by opportunity.', url: 'https://www.drive.hhs.gov/' },
  { name: 'SBA SBIC directory', type: 'Private debt / equity', fit: ['technology', 'drug'], assets: ['digital', 'device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'], stages: ['commercial', 'approved'], companies: ['startup', 'established', 'other'], amounts: ['250k-1m', '1m-5m', '5m-10m'], note: 'The SBA directory lets applicants filter SBIC investors by state and investment strategy. SBA describes typical SBIC equity investments of $100,000–$5 million and debt financing of $250,000–$10 million; individual SBIC criteria vary.', url: 'https://www.sba.gov/funding-programs/investment-capital/sbic-directory' },
  { name: 'SBA Certified Development Companies', type: 'Growth / equipment financing', fit: ['technology', 'drug'], assets: ['device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'], stages: ['commercial', 'approved'], companies: ['startup', 'established'], amounts: ['250k-1m', '1m-5m', '5m-10m'], note: 'Useful to screen when the financing need is tied to qualifying fixed assets or facilities rather than pure R&D. The SBA directory can be filtered by state.', url: 'https://www.sba.gov/loans/504-loans/list-of-certified-development-companies/' }
];

const productionOptions = [
  ['Research / proof of concept', 'research'],
  ['Prototype / validation', 'prototype'],
  ['Clinical testing / validation', 'clinical'],
  ['Regulatory review / authorization', 'regulatory'],
  ['Pilot production / manufacturing scale-up', 'production-scale'],
  ['Commercial production / market-ready', 'commercial-production']
];

const drugProductionOptions = [
  ['Discovery / preclinical research', 'discovery'],
  ['IND-enabling / preclinical development', 'ind-enabling'],
  ['Clinical Phase 1', 'phase-1'],
  ['Clinical Phase 2', 'phase-2'],
  ['Clinical Phase 3 / registration', 'phase-3'],
  ['Commercial manufacturing / approved product', 'commercial-production']
];

const amountOptions = [
  ['Under $250,000', 'under-250k'],
  ['$250,000–$1 million', '250k-1m'],
  ['$1–$5 million', '1m-5m'],
  ['$5–$10 million', '5m-10m'],
  ['More than $10 million', '10m-plus']
];

function amountBucket(value) { return amountOptions.some(([, key]) => key === value) ? value : null; }

function formatAmount(value) {
  return ({ 'under-250k': 'under $250,000', '250k-1m': '$250,000–$1 million', '1m-5m': '$1–$5 million', '5m-10m': '$5–$10 million', '10m-plus': 'more than $10 million' })[value] || value;
}

function sourceScore(source, { pathway, answers, productionStage, financingAmount }) {
  let score = 0;
  const asset = answers.technology || answers.drugType;
  const stage = productionStage || answers.stage;
  const amount = amountBucket(financingAmount);
  const company = answers.company;
  if (source.fit.includes(pathway)) score += 2;
  if (asset && source.assets.includes(asset)) score += 3;
  if (stage && source.stages.includes(stage)) score += 3;
  if (company && source.companies.includes(company)) score += 2;
  if (amount && source.amounts.includes(amount)) score += 3;
  return score;
}

function getFundingSources(pathway, answers, productionStage, financingAmount) {
  return fundingSources.map(source => ({ ...source, score: sourceScore(source, { pathway, answers, productionStage, financingAmount }) })).filter(source => source.score >= 6).sort((a, b) => b.score - a.score).slice(0, 5);
}

function getFundingRoutes({ pathway, answers, productionStage, financingAmount }) {
  const routes = [];
  const company = answers.company;
  const need = answers.funding || answers.need;
  const asset = answers.technology || answers.drugType;
  if (company === 'university') routes.push({ title: 'Confirm institutional ownership first', body: 'Start with the technology-transfer or research office. Confirm IP ownership, institutional approval requirements, existing sponsored-research restrictions, and whether a spinout or license is needed before outside fundraising.' });
  if (['research', 'prototype', 'discovery', 'ind-enabling'].includes(productionStage) || ['rd', 'preclinical-funding'].includes(need)) routes.push({ title: 'Screen non-dilutive R&D programs', body: 'Your current stage suggests that grants or government R&D programs may be worth screening before committing to a financing structure. Match the proposed use of funds to the program’s eligible activities and milestones.' });
  if (['clinical', 'regulatory', 'phase-1', 'phase-2', 'phase-3'].includes(productionStage) || ['clinical', 'regulatory', 'trial-funding', 'regulatory-commercial'].includes(need)) routes.push({ title: 'Tie financing to the next milestone', body: 'Define exactly what the requested capital should accomplish—such as a study milestone, regulatory submission, manufacturing milestone, or validation package—and budget backward from that milestone.' });
  if (['scale', 'cmc'].includes(need) || ['production-scale', 'commercial-production'].includes(productionStage)) routes.push({ title: 'Get a production and manufacturing budget', body: 'Obtain realistic quotes and timelines for manufacturing, quality systems, facilities, equipment, supply chain, CMC, and scale-up work before setting the financing amount.' });
  if (['commercial', 'approved'].includes(answers.stage) || ['commercial', 'regulatory-commercial'].includes(need) || productionStage === 'commercial-production') routes.push({ title: 'Screen growth capital and strategic partners', body: 'At commercialization, compare growth equity, strategic investment, debt financing where appropriate, and commercial partnerships based on the amount required and the assets or rights you are willing to share.' });
  routes.push({ title: `Build a ${answers.state || 'state'}-specific funding list`, body: 'Use the SBA SBIC and Certified Development Company directories to identify financing providers serving the selected state. State and local economic-development programs should also be screened because eligibility and application windows change.' });
  if (financingAmount) routes.push({ title: `Plan around your ${formatAmount(financingAmount)} target`, body: 'Use the amount as a screening factor—not as a guarantee that a source will fund that amount. Check minimums, maximums, eligible uses, matching requirements, dilution, collateral, and milestone expectations for each opportunity.' });
  routes.push({ title: 'Have counsel review deal-readiness', body: 'Before signing a license, investment, strategic-development agreement, or other binding commitment, confirm IP ownership, entity authority, prior obligations, confidentiality arrangements, and restrictions created by earlier funding or institutional agreements.' });
  if (asset === 'device' || asset === 'diagnostic' || asset === 'platform') routes.push({ title: 'Screen health-security programs if relevant', body: 'If the technology addresses preparedness, diagnostics, medical countermeasures, or another health-security need, review BARDA DRIVe and ARPA-H opportunities for topic-specific fit.' });
  return routes;
}

export default function HowToSection({ pathway, answers, onNext, onBack, onRestart }) {
  const defaultProduction = answers.stage || '';
  const [productionStage, setProductionStage] = useState(defaultProduction);
  const [financingAmount, setFinancingAmount] = useState('');
  const productionChoices = pathway === 'drug' ? drugProductionOptions : productionOptions;
  const fundingReady = Boolean(productionStage && financingAmount);
  const effectiveAnswers = useMemo(() => ({ ...answers, productionStage, financingAmount }), [answers, productionStage, financingAmount]);
  const routes = useMemo(() => getFundingRoutes({ pathway, answers: effectiveAnswers, productionStage, financingAmount }), [pathway, effectiveAnswers, productionStage, financingAmount]);
  const matches = useMemo(() => getFundingSources(pathway, answers, productionStage, financingAmount), [pathway, answers, productionStage, financingAmount]);
  const asset = answers.technology || answers.drugType;
  const isUniversity = answers.company === 'university';
  const isHealthSecurity = ['device', 'diagnostic', 'platform'].includes(asset);

  return <section className="howto-screen">
    <div className="decision-header"><span className="eyebrow">Funding profile</span><h1>Tell us where you are in production and how much you need.</h1><p>These two answers let the tool narrow funding sources by development stage and financing size before it builds your state- and asset-specific list.</p></div>

    <div className="funding-input-panel">
      <label><strong>Where are you in production / development?</strong><span>Choose the stage that best describes the work you need to finance now.</span><select value={productionStage} onChange={event => setProductionStage(event.target.value)}><option value="">Select a stage</option>{productionChoices.map(([label, value]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label><strong>How much financing do you need?</strong><span>Use the approximate amount needed to reach the next meaningful milestone.</span><select value={financingAmount} onChange={event => setFinancingAmount(event.target.value)}><option value="">Select an amount</option>{amountOptions.map(([label, value]) => <option key={value} value={value}>{label}</option>)}</select></label>
    </div>

    {!fundingReady && <div className="funding-gate"><strong>Complete both funding questions to see dynamic matches.</strong><span>Your state, asset type, organization, production/development stage, and financing target will all be used as screening factors.</span></div>}

    {fundingReady && <>
      <div className="assessment-snapshot"><div><strong>State</strong><span>{answers.state || 'Not provided'}</span></div><div><strong>Asset</strong><span>{asset || 'Not provided'}</span></div><div><strong>Production / development</strong><span>{productionChoices.find(([, key]) => key === productionStage)?.[0] || productionStage}</span></div><div><strong>Financing target</strong><span>{formatAmount(financingAmount)}</span></div></div>

      <div className="howto-grid">{routes.map((route, index) => <article className="howto-card" key={`${route.title}-${index}`}><span className="howto-number">{String(index + 1).padStart(2, '0')}</span><h2>{route.title}</h2><p>{route.body}</p></article>)}</div>

      <div className="funding-panel"><div><span className="eyebrow">Dynamic funding matches</span><h2>Funding sources to investigate</h2><p>These matches are generated from your state, asset type, organization, production/development stage, and financing target. They are starting points—not endorsements or funding guarantees.</p></div><div className="funding-list">{matches.length ? matches.map(source => <article key={source.name}><div className="funding-meta"><span>{source.type}</span><span>Match score {source.score}</span></div><h3>{source.name}</h3><p>{source.note}</p><a href={source.url} target="_blank" rel="noreferrer">Review current program information →</a></article>) : <article><h3>No high-confidence match in the starter dataset</h3><p>Use the state-filtered SBA directories and relevant federal program pages to broaden the search. The assessment can still guide which funding categories to investigate.</p></article>}</div></div>

      <div className="investor-panel"><span className="eyebrow">State-specific search</span><h2>Use your state to find local financing providers</h2><p>The SBA maintains searchable directories for SBIC investors and Certified Development Companies. Use the selected state as a filter when researching providers; the official directories remain the source of truth for current availability.</p><div className="state-search-cards"><a href="https://www.sba.gov/funding-programs/investment-capital/sbic-directory" target="_blank" rel="noreferrer"><strong>SBIC investor directory</strong><span>Filter by state, investment strategy, and other criteria.</span></a><a href="https://www.sba.gov/loans/504-loans/list-of-certified-development-companies/" target="_blank" rel="noreferrer"><strong>Certified Development Companies</strong><span>Find state-serving 504 financing providers for qualifying fixed-asset projects.</span></a></div></div>

      <div className="talk-to-panel"><span className="eyebrow">Who to talk to</span><h2>Build the right advisory group before the next major commitment.</h2><div className="talk-list"><span>IP / licensing counsel</span><span>Corporate / transactional counsel</span><span>Regulatory counsel or consultant</span><span>Clinical-development or scientific advisor</span><span>Technology-transfer office, if institutionally owned</span><span>Manufacturing / CMC advisor, if applicable</span><span>Financing advisor familiar with healthcare or life sciences</span>{isUniversity && <span>Institutional research / sponsored-research office</span>}{isHealthSecurity && <span>Government-program / health-security business-development contact</span>}</div></div>

      <div className="next-steps"><h2>Your first five moves</h2><ol><li>Write a one-page description of the asset, target user or patient, current production/development stage, and next milestone.</li><li>Confirm IP ownership, entity authority, and existing license, investor, university, or sponsored-research restrictions.</li><li>Set a financing target based on the cost of reaching the next milestone and the amount you actually need.</li><li>Build a short list of non-dilutive programs, strategic partners, and financing providers whose criteria match your state, asset, stage, and target amount.</li><li>Have counsel and the relevant technical/regulatory advisors review the proposed structure before signing a binding agreement.</li></ol></div>
    </>}

    <div className="nav-row"><button className="text-button" onClick={onBack}>Back</button><button className="primary" onClick={onNext} disabled={!fundingReady}>See my summary</button></div><button className="text-button restart-button" onClick={onRestart}>Start a new assessment</button>
  </section>;
}
