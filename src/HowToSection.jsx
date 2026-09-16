import React, { useMemo } from 'react';

const fundingSources = [
  {
    name: 'NIH SBIR / STTR',
    type: 'Non-dilutive',
    fit: ['technology', 'drug'],
    assets: ['digital', 'device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'],
    stages: ['research', 'prototype', 'clinical', 'regulatory', 'discovery', 'ind-enabling', 'phase-1', 'phase-2', 'phase-3'],
    companies: ['startup', 'established'],
    amounts: ['under-250k', '250k-1m', '1m-5m'],
    states: 'all',
    note: 'NIH small-business programs support eligible U.S. small businesses conducting health and life-science R&D. STTR is structured for small-business/research-institution collaborations.',
    url: 'https://seed.nih.gov/small-business-funding'
  },
  {
    name: "NSF America's Seed Fund",
    type: 'Non-dilutive',
    fit: ['technology'],
    assets: ['digital', 'device', 'diagnostic', 'platform', 'other'],
    stages: ['research', 'prototype', 'clinical'],
    companies: ['startup', 'established'],
    amounts: ['250k-1m', '1m-5m'],
    states: 'all',
    note: 'NSF supports early-stage R&D for high-risk technologies with commercial potential and states that its Seed Fund can provide up to $2 million with zero equity.',
    url: 'https://seedfund.nsf.gov/'
  },
  {
    name: 'ARPA-H',
    type: 'Non-dilutive',
    fit: ['technology', 'drug'],
    assets: ['digital', 'device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'],
    stages: ['research', 'prototype', 'clinical', 'regulatory', 'discovery', 'ind-enabling', 'phase-1', 'phase-2'],
    companies: ['startup', 'established'],
    amounts: ['250k-1m', '1m-5m'],
    states: 'all',
    note: 'ARPA-H currently lists program, initiative, and small-business opportunities. Its SBIR/STTR page describes awards generally up to $600,000 for Phase I and $3.5 million for Phase II, subject to the solicitation.',
    url: 'https://arpa-h.gov/explore-funding/open-funding-opportunities'
  },
  {
    name: 'BARDA DRIVe',
    type: 'Government / strategic',
    fit: ['technology'],
    assets: ['device', 'diagnostic', 'platform', 'other'],
    stages: ['research', 'prototype', 'clinical', 'regulatory'],
    companies: ['startup', 'established', 'university', 'other'],
    amounts: ['under-250k', '250k-1m', '1m-5m'],
    states: 'all',
    note: 'Relevant to early-stage technologies addressing health-security, preparedness, or medical-countermeasure needs. Funding mechanisms vary by opportunity.',
    url: 'https://www.drive.hhs.gov/'
  },
  {
    name: 'SBA SBIC directory',
    type: 'Private debt / equity',
    fit: ['technology', 'drug'],
    assets: ['digital', 'device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'],
    stages: ['commercial', 'approved'],
    companies: ['startup', 'established', 'other'],
    amounts: ['250k-1m', '1m-5m', '5m-10m'],
    states: 'all',
    note: 'The SBA directory lets applicants filter SBIC investors by state and investment strategy. SBA describes typical SBIC equity investments of $100,000–$5 million and debt financing of $250,000–$10 million; individual SBIC criteria vary.',
    url: 'https://www.sba.gov/funding-programs/investment-capital/sbic-directory'
  },
  {
    name: 'SBA Certified Development Companies',
    type: 'Growth / equipment financing',
    fit: ['technology', 'drug'],
    assets: ['device', 'diagnostic', 'platform', 'other', 'small-molecule', 'biologic', 'cell-gene', 'other-drug'],
    stages: ['commercial', 'approved'],
    companies: ['startup', 'established'],
    amounts: ['250k-1m', '1m-5m', '5m-10m'],
    states: 'all',
    note: 'Useful to screen when the financing need is tied to qualifying fixed assets or facilities rather than pure R&D. The SBA directory can be filtered by state.',
    url: 'https://www.sba.gov/loans/504-loans/list-of-certified-development-companies/'
  }
];

const stateNotes = {
  'District of Columbia': 'Use the SBA directories plus the District of Columbia small-business/economic-development resources for local programs; confirm current eligibility and open application windows.',
  default: 'Use the SBA SBIC and Certified Development Company directories to filter financing providers serving this state. State and local economic-development programs should be screened separately because eligibility and funding windows change.'
};

function amountBucket(value) {
  if (!value) return null;
  if (value === 'under-250k') return 'under-250k';
  if (value === '250k-1m') return '250k-1m';
  if (value === '1m-5m') return '1m-5m';
  if (value === '5m-10m') return '5m-10m';
  if (value === '10m-plus') return '10m-plus';
  return null;
}

function sourceScore(source, { pathway, answers }) {
  let score = 0;
  const asset = answers.technology || answers.drugType;
  const stage = answers.productionStage || answers.stage;
  const amount = amountBucket(answers.financingAmount);
  const company = answers.company;

  if (source.fit.includes(pathway)) score += 2;
  if (asset && source.assets.includes(asset)) score += 3;
  if (stage && source.stages.includes(stage)) score += 3;
  if (company && source.companies.includes(company)) score += 2;
  if (amount && source.amounts.includes(amount)) score += 3;
  if (source.states === 'all') score += 1;
  return score;
}

function getFundingSources(pathway, answers) {
  return fundingSources
    .map(source => ({ ...source, score: sourceScore(source, { pathway, answers }) }))
    .filter(source => source.score >= 6)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function getFundingRoutes({ pathway, answers }) {
  const routes = [];
  const company = answers.company;
  const production = answers.productionStage || answers.stage;
  const need = answers.funding || answers.need;
  const asset = answers.technology || answers.drugType;
  const amount = answers.financingAmount;

  if (company === 'university') {
    routes.push({ title: 'Confirm institutional ownership first', body: 'Start with the technology-transfer or research office. Confirm IP ownership, institutional approval requirements, existing sponsored-research restrictions, and whether a spinout or license is needed before outside fundraising.' });
  }

  if (['research', 'prototype', 'discovery', 'ind-enabling'].includes(production) || ['rd', 'preclinical-funding'].includes(need)) {
    routes.push({ title: 'Screen non-dilutive R&D programs', body: 'Your current stage suggests that grants or government R&D programs may be worth screening before committing to a financing structure. Match the proposed use of funds to the program’s eligible activities and milestones.' });
  }

  if (['clinical', 'regulatory', 'phase-1', 'phase-2', 'phase-3'].includes(production) || ['clinical', 'regulatory', 'trial-funding', 'regulatory-commercial'].includes(need)) {
    routes.push({ title: 'Tie the financing target to the next milestone', body: 'For clinical or regulatory work, define exactly what the requested capital should accomplish—such as a study milestone, regulatory submission, manufacturing milestone, or validation package—and budget backward from that milestone.' });
  }

  if (['scale', 'cmc'].includes(need) || ['production-scale', 'commercial-production'].includes(production)) {
    routes.push({ title: 'Get a production and manufacturing budget', body: 'Obtain realistic quotes and timelines for manufacturing, quality systems, facilities, equipment, supply chain, CMC, and scale-up work before setting the financing amount.' });
  }

  if (['commercial', 'approved'].includes(production) || ['commercial', 'regulatory-commercial'].includes(need)) {
    routes.push({ title: 'Screen growth capital and strategic partners', body: 'At commercialization, compare growth equity, strategic investment, revenue-based or debt financing where appropriate, and commercial partnerships based on the amount required and the assets or rights you are willing to share.' });
  }

  routes.push({ title: `Build a ${answers.state || 'state'}-specific funding list`, body: stateNotes[answers.state] || stateNotes.default });

  if (amount) {
    routes.push({ title: `Plan around your ${formatAmount(amount)} financing target`, body: 'Use the amount as a screening tool—not as a guarantee that a source will fund that amount. Check minimums, maximums, eligible uses, matching requirements, dilution, collateral, and milestone expectations for each opportunity.' });
  }

  routes.push({ title: 'Have counsel review deal-readiness', body: 'Before signing a license, investment, strategic-development agreement, or other binding commitment, confirm IP ownership, entity authority, prior obligations, confidentiality arrangements, and restrictions created by earlier funding or institutional agreements.' });
  return routes;
}

function formatAmount(value) {
  return ({
    'under-250k': 'under $250,000',
    '250k-1m': '$250,000–$1 million',
    '1m-5m': '$1–$5 million',
    '5m-10m': '$5–$10 million',
    '10m-plus': 'more than $10 million'
  })[value] || value;
}

export default function HowToSection({ pathway, answers, onNext, onBack, onRestart }) {
  const routes = useMemo(() => getFundingRoutes({ pathway, answers }), [pathway, answers]);
  const matches = useMemo(() => getFundingSources(pathway, answers), [pathway, answers]);
  const production = answers.productionStage || answers.stage;
  const asset = answers.technology || answers.drugType;
  const amount = answers.financingAmount;
  const isUniversity = answers.company === 'university';
  const isHealthSecurity = ['device', 'diagnostic', 'platform'].includes(asset);

  return <section className="howto-screen">
    <div className="decision-header">
      <span className="eyebrow">How to move forward</span>
      <h1>Turn your assessment into an action plan.</h1>
      <p>Funding matches below use your state, asset type, production/development stage, organization, and financing target as screening factors. They are starting points, not endorsements or funding guarantees.</p>
    </div>

    <div className="assessment-snapshot">
      <div><strong>State</strong><span>{answers.state || 'Not provided'}</span></div>
      <div><strong>Asset</strong><span>{asset || 'Not provided'}</span></div>
      <div><strong>Production / development</strong><span>{production || 'Not provided'}</span></div>
      <div><strong>Financing target</strong><span>{formatAmount(amount) || 'Not provided'}</span></div>
    </div>

    <div className="howto-grid">
      {routes.map((route, index) => <article className="howto-card" key={`${route.title}-${index}`}><span className="howto-number">{String(index + 1).padStart(2, '0')}</span><h2>{route.title}</h2><p>{route.body}</p></article>)}
    </div>

    <div className="funding-panel">
      <div><span className="eyebrow">Dynamic funding matches</span><h2>Funding sources to investigate</h2><p>These matches are generated from the answers above. Always verify the current solicitation, eligibility, geography, stage, amount, and use-of-funds rules before applying.</p></div>
      <div className="funding-list">
        {matches.length ? matches.map(source => <article key={source.name}><div className="funding-meta"><span>{source.type}</span><span>Match score {source.score}</span></div><h3>{source.name}</h3><p>{source.note}</p><a href={source.url} target="_blank" rel="noreferrer">Review current program information →</a></article>) : <article><h3>No high-confidence match in the current starter dataset</h3><p>Use the SBA state-filtered directories and the relevant federal program pages to broaden the search. The assessment can still guide which categories to investigate.</p></article>}
      </div>
    </div>

    <div className="investor-panel">
      <span className="eyebrow">State-specific search</span>
      <h2>Use state filters for local financing providers</h2>
      <p>The SBA maintains searchable directories for SBIC investors and Certified Development Companies. The tool uses your selected state to tell you when to apply those filters; the directories remain the source of truth for current providers.</p>
      <div className="state-search-cards"><a href="https://www.sba.gov/funding-programs/investment-capital/sbic-directory" target="_blank" rel="noreferrer"><strong>SBIC investor directory</strong><span>Filter by state, investment strategy, and other criteria.</span></a><a href="https://www.sba.gov/loans/504-loans/list-of-certified-development-companies/" target="_blank" rel="noreferrer"><strong>Certified Development Companies</strong><span>Find state-serving 504 financing providers for qualifying fixed-asset projects.</span></a></div>
    </div>

    <div className="talk-to-panel"><span className="eyebrow">Who to talk to</span><h2>Build the right advisory group before the next major commitment.</h2><div className="talk-list"><span>IP / licensing counsel</span><span>Corporate / transactional counsel</span><span>Regulatory counsel or consultant</span><span>Clinical-development or scientific advisor</span><span>Technology-transfer office, if institutionally owned</span><span>Manufacturing / CMC advisor, if applicable</span><span>Financing advisor familiar with healthcare or life sciences</span>{isUniversity && <span>Institutional research / sponsored-research office</span>}{isHealthSecurity && <span>Government-program / health-security business-development contact</span>}</div></div>

    <div className="next-steps"><h2>Your first five moves</h2><ol><li>Write a one-page description of the asset, target user or patient, current production/development stage, and next milestone.</li><li>Confirm IP ownership, entity authority, and existing license, investor, university, or sponsored-research restrictions.</li><li>Set a financing target based on the cost of reaching the next milestone and the amount you actually need.</li><li>Build a short list of non-dilutive programs, strategic partners, and financing providers whose criteria match your state, asset, stage, and target amount.</li><li>Have counsel and the relevant technical/regulatory advisors review the proposed structure before signing a binding agreement.</li></ol></div>

    <div className="nav-row"><button className="text-button" onClick={onBack}>Back</button><button className="primary" onClick={onNext}>See my summary</button></div><button className="text-button restart-button" onClick={onRestart}>Start a new assessment</button>
  </section>;
}
