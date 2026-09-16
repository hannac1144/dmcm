import React, { useMemo } from 'react';

const investorGuides = {
  technology: [
    {
      name: 'HealthQuest Capital',
      fit: ['digital', 'diagnostic', 'device', 'platform'],
      note: 'Healthcare-focused investor with a portfolio spanning healthcare technology, diagnostics, medical devices, and healthcare services. Its current strategy emphasizes companies ready to scale, so later-stage or commercial opportunities are more relevant.'
    },
    {
      name: 'SV Health Investors',
      fit: ['digital', 'diagnostic', 'device', 'platform', 'commercial'],
      note: 'Healthcare-focused investment platform with dedicated medtech and healthcare-growth strategies. Review the applicable strategy and stage before reaching out.'
    }
  ],
  drug: [
    {
      name: 'SV Health Investors',
      fit: ['small-molecule', 'biologic', 'cell-gene', 'other-drug'],
      note: 'Healthcare-focused investor with a dedicated therapeutics strategy covering biotechnology and drug-development opportunities.'
    },
    {
      name: 'HealthQuest Capital',
      fit: ['approved', 'phase-3'],
      note: 'Healthcare investor whose portfolio includes life-sciences and healthcare companies. Its stated focus is primarily commercial-stage companies ready to scale, so it is more relevant once a therapeutic or related business is approaching commercialization.'
    }
  ]
};

function getFundingRoutes({ pathway, answers }) {
  const routes = [];
  const company = answers.company;
  const stage = answers.stage;
  const need = answers.funding || answers.need;
  const asset = answers.technology || answers.drugType;

  if (company === 'university') {
    routes.push({
      title: 'Start with your technology-transfer / research office',
      body: 'Confirm who owns the IP, whether the institution permits outside commercialization, and whether an institutional license or spinout is needed before approaching outside capital.'
    });
  }

  if (['research', 'prototype', 'discovery', 'ind-enabling'].includes(stage) || ['rd', 'preclinical-funding'].includes(need)) {
    routes.push({
      title: 'Investigate non-dilutive R&D funding first',
      body: 'NIH SBIR/STTR is designed for health and life-science small-business R&D. NSF America’s Seed Fund is another route for eligible deep-technology startups and small businesses. Confirm current eligibility and solicitation fit before investing in an application.'
    });
  }

  if (answers.company === 'startup' && ['digital', 'device', 'diagnostic', 'platform'].includes(asset)) {
    routes.push({
      title: 'Build a targeted healthcare investor list',
      body: 'Prioritize investors whose stated sector, stage, and check-size focus matches the asset. Start with healthcare-focused funds rather than sending a general pitch to a broad VC list.'
    });
  }

  if (answers.company === 'startup' && ['small-molecule', 'biologic', 'cell-gene', 'other-drug'].includes(asset)) {
    routes.push({
      title: 'Build a therapeutics investor and strategic-partner list',
      body: 'Match the list to modality, indication, development stage, and capital required to reach the next clinical or regulatory milestone. Include both specialist life-sciences investors and potential strategic partners.'
    });
  }

  if (['clinical', 'regulatory', 'phase-1', 'phase-2', 'phase-3', 'approved'].includes(stage) || ['clinical', 'regulatory', 'trial-funding', 'regulatory-commercial'].includes(need)) {
    routes.push({
      title: 'Talk with regulatory and clinical-development advisors before fundraising',
      body: 'Make sure the next financing milestone is tied to a credible regulatory, clinical, validation, manufacturing, or commercialization milestone. Investors will generally need a clear explanation of what the capital is intended to accomplish.'
    });
  }

  if (['cmc', 'scale'].includes(need)) {
    routes.push({
      title: 'Add a manufacturing / CMC conversation early',
      body: 'Identify the manufacturing, quality, supply-chain, and scale-up work required for the next milestone and obtain realistic cost and timing estimates before setting the fundraising target.'
    });
  }

  routes.push({
    title: 'Have counsel review ownership and deal-readiness',
    body: 'Before signing a license, investment, or strategic-development agreement, confirm IP ownership, existing obligations, entity authority, material contracts, confidentiality arrangements, and any restrictions created by prior funding or institutional agreements.'
  });

  return routes;
}

function getInvestorList(pathway, answers) {
  const candidates = investorGuides[pathway] || [];
  const matches = candidates.filter(candidate => candidate.fit.some(value => Object.values(answers).includes(value)));
  return matches.length ? matches : candidates;
}

export default function HowToSection({ pathway, answers, onNext, onBack, onRestart }) {
  const routes = useMemo(() => getFundingRoutes({ pathway, answers }), [pathway, answers]);
  const investors = useMemo(() => getInvestorList(pathway, answers), [pathway, answers]);
  const isUniversity = answers.company === 'university';
  const isHealthSecurity = ['device', 'diagnostic', 'platform'].includes(answers.technology);

  return <section className="howto-screen">
    <div className="decision-header">
      <span className="eyebrow">How to move forward</span>
      <h1>Turn your assessment into an action plan.</h1>
      <p>Use these next steps to organize the people, funding sources, and diligence work that should come next for your particular pathway.</p>
    </div>

    <div className="howto-grid">
      {routes.map((route, index) => <article className="howto-card" key={route.title}>
        <span className="howto-number">{String(index + 1).padStart(2, '0')}</span>
        <h2>{route.title}</h2>
        <p>{route.body}</p>
      </article>)}
    </div>

    <div className="funding-panel">
      <div>
        <span className="eyebrow">Funding starting points</span>
        <h2>Organizations to investigate</h2>
        <p>These are starting points, not endorsements. Eligibility, stage, sector, geography, solicitation timing, and investment criteria should be checked before contacting any funder.</p>
      </div>
      <div className="funding-list">
        <article>
          <h3>NIH SBIR / STTR</h3>
          <p>For eligible small businesses pursuing health, life-science, biomedical, diagnostic, digital-health, device, and drug-development R&D. STTR can be particularly relevant where a small business is collaborating with a research institution.</p>
        </article>
        <article>
          <h3>NSF America’s Seed Fund</h3>
          <p>For eligible startups and small businesses developing high-risk technologies with commercial potential. It can be relevant to healthcare technology with a strong underlying science or engineering component.</p>
        </article>
        <article>
          <h3>BARDA DRIVe</h3>
          <p>Worth investigating when the technology addresses health-security or preparedness needs, particularly innovative devices and related capabilities.</p>
        </article>
        <article>
          <h3>ARPA-H</h3>
          <p>Worth screening for unusually ambitious health problems that align with an open ARPA-H program, initiative, or Mission Office opportunity.</p>
        </article>
      </div>
    </div>

    <div className="investor-panel">
      <div>
        <span className="eyebrow">Private capital</span>
        <h2>Healthcare investors to research</h2>
        <p>These firms are included as examples of healthcare-focused investors whose stated strategies may overlap with particular assets or stages. The tool does not rank them or predict whether they will invest.</p>
      </div>
      <div className="funding-list">
        {investors.map(investor => <article key={investor.name}>
          <h3>{investor.name}</h3>
          <p>{investor.note}</p>
        </article>)}
      </div>
    </div>

    <div className="talk-to-panel">
      <span className="eyebrow">Who to talk to</span>
      <h2>Build the right advisory group before the next major commitment.</h2>
      <div className="talk-list">
        <span>IP / licensing counsel</span>
        <span>Corporate / transactional counsel</span>
        <span>Regulatory counsel or regulatory consultant</span>
        <span>Clinical-development or scientific advisor</span>
        <span>Technology-transfer office, if institutionally owned</span>
        <span>Manufacturing / CMC advisor, if applicable</span>
        <span>Healthcare-focused investor or financing advisor</span>
        {isUniversity && <span>Institutional research / sponsored-research office</span>}
        {isHealthSecurity && <span>Government-program / health-security business-development contact</span>}
      </div>
    </div>

    <div className="next-steps">
      <h2>Your first five moves</h2>
      <ol>
        <li>Write a one-page description of the asset, target user or patient, current stage, and next value-creating milestone.</li>
        <li>Confirm IP ownership, entity authority, and any existing license, university, investor, or sponsored-research restrictions.</li>
        <li>Set a financing target based on the cost of reaching the next milestone—not an arbitrary round size.</li>
        <li>Build a short list of non-dilutive programs, strategic partners, and investors whose stated criteria match the asset.</li>
        <li>Have counsel and the relevant technical/regulatory advisors review the proposed structure before signing a binding agreement.</li>
      </ol>
    </div>

    <div className="nav-row"><button className="text-button" onClick={onBack}>Back</button><button className="primary" onClick={onNext}>See my summary</button></div>
    <button className="text-button restart-button" onClick={onRestart}>Start a new assessment</button>
  </section>;
}
