import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const pathways = {
  technology: {
    label: 'Healthcare technology',
    description: 'Software, devices, diagnostics, platforms, and other healthcare technologies.',
    questions: [
      { id: 'technology', title: 'What are you building?', prompt: 'Choose the description that best fits your healthcare technology.', options: [['Digital health / software', 'digital'], ['Medical device', 'device'], ['Diagnostic / laboratory technology', 'diagnostic'], ['Connected / data-enabled platform', 'platform'], ['Other healthcare technology', 'other']] },
      { id: 'company', title: 'Tell us about your organization', prompt: 'Where are you in the company-building journey?', options: [['University / research institution', 'university'], ['Startup / early-stage company', 'startup'], ['Established company', 'established'], ['Hospital / health system', 'health-system'], ['Other organization', 'other']] },
      { id: 'stage', title: 'What stage is the technology in?', prompt: 'Select the stage that best describes its current development.', options: [['Research / proof of concept', 'research'], ['Prototype / validation', 'prototype'], ['Clinical testing / validation', 'clinical'], ['Regulatory review / authorization', 'regulatory'], ['Commercial / market-ready', 'commercial']] },
      { id: 'funding', title: 'What do you need next?', prompt: 'Choose the primary funding or development need.', options: [['Research and development capital', 'rd'], ['Clinical or regulatory funding', 'clinical'], ['Manufacturing / scale-up capital', 'scale'], ['Commercialization resources', 'commercial'], ['Partner capabilities more than capital', 'partner']] },
      { id: 'priority', title: 'What matters most to you?', prompt: 'Pick the priority you want to protect in negotiations.', options: [['Maintaining control and flexibility', 'control'], ['Speed to market', 'speed'], ['Access to expertise and resources', 'expertise'], ['Maximizing near-term funding', 'funding'], ['Long-term commercialization value', 'value']] }
    ]
  },
  drug: {
    label: 'Drug / therapeutic',
    description: 'Small molecules, biologics, therapeutics, and other drug-development programs.',
    questions: [
      { id: 'drugType', title: 'What are you developing?', prompt: 'Choose the description that best fits the drug or therapeutic program.', options: [['Small-molecule drug', 'small-molecule'], ['Biologic / antibody', 'biologic'], ['Cell or gene therapy', 'cell-gene'], ['Other therapeutic', 'other-drug']] },
      { id: 'company', title: 'Tell us about your organization', prompt: 'Where are you in the development journey?', options: [['University / research institution', 'university'], ['Startup / biotech company', 'startup'], ['Established pharmaceutical / biotech company', 'established'], ['Hospital / health system', 'health-system'], ['Other organization', 'other']] },
      { id: 'stage', title: 'What stage is the drug in?', prompt: 'Select the stage that best describes its current development.', options: [['Discovery / preclinical research', 'discovery'], ['IND-enabling / preclinical development', 'ind-enabling'], ['Clinical Phase 1', 'phase-1'], ['Clinical Phase 2', 'phase-2'], ['Clinical Phase 3 / registration', 'phase-3'], ['Approved / commercial', 'approved']] },
      { id: 'need', title: 'What does the program need next?', prompt: 'Choose the primary development or commercialization need.', options: [['Preclinical / IND-enabling capital', 'preclinical-funding'], ['Clinical trial funding', 'trial-funding'], ['Manufacturing / CMC capabilities', 'cmc'], ['Regulatory / commercialization capabilities', 'regulatory-commercial'], ['Partner capabilities and development expertise', 'partner-drug']] },
      { id: 'priority', title: 'What matters most to you?', prompt: 'Pick the priority you want to protect in a development or licensing deal.', options: [['Maintaining control and flexibility', 'control'], ['Accelerating clinical development', 'speed'], ['Access to development expertise and infrastructure', 'expertise'], ['Maximizing near-term funding', 'funding'], ['Long-term value across indications and markets', 'value']] }
    ]
  }
};

const decisionContent = {
  funding: {
    eyebrow: 'Decision 01', title: 'How should you fund and develop the program?',
    intro: 'The right path depends on the capital and capabilities you need, the development risk you are willing to retain, and the rights or economics you are prepared to share.',
    options: [
      { name: 'Non-dilutive funding', fit: ['research','rd','clinical','discovery','preclinical-funding','university'], pros: ['Preserves ownership and equity','Can support high-risk research or development'], cons: ['Competitive and often slower to obtain','Funding may be restricted to defined uses or milestones'], consider: 'Consider whether your timeline, eligibility, and development plan fit grants or other non-dilutive programs.' },
      { name: 'Equity investment', fit: ['startup','rd','scale','funding','preclinical-funding','trial-funding'], pros: ['Provides growth capital without licensing away the program','May bring strategic expertise and networks'], cons: ['Dilutes existing ownership','Investors may have governance or return expectations'], consider: 'Consider how much capital is needed to reach the next value-creating milestone and what governance rights you are prepared to share.' },
      { name: 'Strategic partnership / co-development', fit: ['partner','expertise','clinical','regulatory','scale','partner-drug','cmc','regulatory-commercial'], pros: ['Adds technical, clinical, regulatory, manufacturing, or commercial capabilities','Can share development risk and cost'], cons: ['Requires alignment on control and economics','Partner incentives and development priorities may differ from yours'], consider: 'Consider which capabilities you cannot efficiently build yourself and whether a partner can provide them at the right stage.' },
      { name: 'Self-development', fit: ['control','value','commercial','approved'], pros: ['Maximum control over strategy and program','Keeps more future economics in-house'], cons: ['Requires substantial capital and capabilities','You bear more development and execution risk'], consider: 'Consider whether you have the runway, talent, infrastructure, and regulatory capabilities needed for the next milestone.' }
    ]
  },
  license: {
    eyebrow: 'Decision 02', title: 'What type of license should you consider?',
    intro: 'For both healthcare technologies and drug programs, license structure determines who can develop, use, manufacture, or commercialize the asset—and where and for what purposes.',
    options: [
      { name: 'Non-exclusive license', fit: ['control','speed','digital','diagnostic','platform'], pros: ['Retains ability to license to others','Can support broader dissemination or multiple commercial channels'], cons: ['May be less attractive to a partner seeking market protection','Licensee may have fewer incentives to invest heavily'], consider: 'Consider whether multiple licensees could serve different customers, territories, applications, or indications.' },
      { name: 'Exclusive license', fit: ['value','startup','therapeutic','device','biologic','small-molecule','cell-gene','phase-2','phase-3'], pros: ['May create stronger development and commercialization incentives','Can provide a partner with meaningful market protection'], cons: ['Limits your ability to license the same rights elsewhere','Requires careful performance, diligence, and scope provisions'], consider: 'Consider tying exclusivity to a defined field, territory, indication, product, or measurable development commitments.' },
      { name: 'Field-of-use, indication, or territory-limited license', fit: ['control','value','commercial','phase-1','phase-2','approved'], pros: ['Balances exclusivity with retained rights','Can divide indications, markets, or territories among capable partners'], cons: ['Requires precise drafting','May create disputes about scope, overlapping indications, or development rights'], consider: 'For drugs, consider indications, formulations, territories, and development responsibilities; for technology, consider products, customers, applications, territories, and channels.' }
    ]
  },
  terms: {
    eyebrow: 'Decision 03', title: 'Which contractual terms deserve your attention?',
    intro: 'The most important terms can differ between a technology deal and a drug-development deal. Focus negotiations on the provisions most connected to your stage, risks, and priorities.',
    options: [
      { name: 'Development milestones & diligence', fit: ['clinical','regulatory','prototype','speed','discovery','ind-enabling','phase-1','phase-2','phase-3','approved'], pros: ['Creates measurable expectations','Can protect against a technology or drug program being shelved'], cons: ['Milestones can become burdensome or unrealistic','Failure may trigger loss of rights'], consider: 'For drugs, consider clinical, regulatory, enrollment, manufacturing, and filing milestones. For technology, consider validation, regulatory, product, and commercialization milestones.' },
      { name: 'Economics: payments, milestones & royalties', fit: ['funding','value','commercial','preclinical-funding','trial-funding','approved'], pros: ['Aligns financial returns with development and commercialization','Can balance upfront and downstream value'], cons: ['Complex structures can be difficult to administer','Higher payments can affect development or commercialization incentives'], consider: 'Consider upfront fees, development and regulatory milestones, sales milestones, royalties, minimums, payment triggers, and audit rights together.' },
      { name: 'IP, improvements & sublicensing', fit: ['control','expertise','university','startup','biologic','small-molecule','cell-gene'], pros: ['Clarifies ownership and future rights','Reduces uncertainty as the asset, platform, or technology evolves'], cons: ['Improvement rights can be technically complex','Sublicensing can change who actually develops or commercializes'], consider: 'Define background IP, new improvements, patent rights, ownership, prosecution responsibilities, use rights, and circumstances for sublicensing.' },
      { name: 'Termination, reversion & rights after termination', fit: ['control','value','speed','phase-1','phase-2','phase-3'], pros: ['Provides an exit if obligations are not met','Can return rights for future development'], cons: ['Termination can disrupt ongoing development or commercialization','Post-termination obligations need careful treatment'], consider: 'Consider cure periods, milestone failures, insolvency, patent issues, transition obligations, inventory, ongoing trials, and treatment of rights after termination.' }
    ]
  }
};

function scoreOption(option, answers) {
  return option.fit.reduce((score, value) => score + (Object.values(answers).includes(value) ? 1 : 0), 0);
}

function ResultsSection({ type, answers, onNext, nextLabel, onBack }) {
  const data = decisionContent[type];
  const ranked = useMemo(() => [...data.options].sort((a, b) => scoreOption(b, answers) - scoreOption(a, answers)), [answers, data]);
  return <section className="decision-screen">
    <div className="decision-header"><span className="eyebrow">{data.eyebrow}</span><h1>{data.title}</h1><p>{data.intro}</p></div>
    <div className="option-list">{ranked.map((option, index) => <article className="option-card" key={option.name}>
      {index === 0 && <span className="fit-badge">Strong fit with your answers</span>}
      <h2>{option.name}</h2>
      <div className="columns"><div><h3>Potential advantages</h3><ul>{option.pros.map(x => <li key={x}>{x}</li>)}</ul></div><div><h3>Potential drawbacks</h3><ul>{option.cons.map(x => <li key={x}>{x}</li>)}</ul></div></div>
      <div className="consider"><strong>Consider:</strong> {option.consider}</div>
    </article>)}</div>
    <div className="nav-row"><button className="text-button" onClick={onBack}>Back</button><button className="primary" onClick={onNext}>{nextLabel}</button></div>
  </section>
}

function App() {
  const [screen, setScreen] = useState('intro');
  const [pathway, setPathway] = useState(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const currentQuestions = pathway ? pathways[pathway].questions : [];
  const current = currentQuestions[step];

  const choosePathway = value => { setPathway(value); setAnswers({}); setStep(0); setScreen('questions'); };
  const choose = value => { setAnswers(prev => ({ ...prev, [current.id]: value })); setStep(s => s + 1); setScreen(step === currentQuestions.length - 1 ? 'funding' : 'questions'); };
  const backQuestion = () => { if (step === 0) setScreen('intro'); else setStep(s => s - 1); };
  const start = () => { setPathway(null); setAnswers({}); setStep(0); setScreen('intro'); };

  return <div className="app-shell">
    <header><div className="brand">HealthTech <span>Pathways</span></div><div className="header-note">Decision support for healthcare development</div></header>
    <main>
      {screen === 'intro' && <section className="hero"><div className="hero-copy"><span className="eyebrow">A guided decision tool</span><h1>Choose your pathway, then map the decisions ahead.</h1><p>Tell us whether you are developing a healthcare technology or a drug/therapeutic program. We’ll tailor the questions and decision guidance to the type of asset you are developing.</p><div className="pathway-choice"><button className="pathway-card" onClick={() => choosePathway('technology')}><span className="pathway-number">01</span><strong>Healthcare technology</strong><em>Software, devices, diagnostics, platforms, and more</em><b>Start technology assessment →</b></button><button className="pathway-card" onClick={() => choosePathway('drug')}><span className="pathway-number">02</span><strong>Drug / therapeutic</strong><em>Small molecules, biologics, cell & gene therapies, and more</em><b>Start drug assessment →</b></button></div><p className="small">Educational decision support—not legal, medical, or financial advice.</p></div><div className="hero-panel"><div className="panel-line"><span>01</span><strong>Fund & develop</strong><em>Explore pathways</em></div><div className="panel-line"><span>02</span><strong>License</strong><em>Compare structures</em></div><div className="panel-line"><span>03</span><strong>Contract</strong><em>Focus negotiations</em></div></div></section>}
      {screen === 'questions' && <section className="question-screen"><div className="progress"><span>{pathways[pathway].label} · Question {step + 1} of {currentQuestions.length}</span><div><i style={{width: `${((step) / currentQuestions.length) * 100}%`}} /></div></div><div className="question"><span className="eyebrow">About your situation</span><h1>{current.title}</h1><p>{current.prompt}</p><div className="choices">{current.options.map(([label, value]) => <button className="choice" key={value} onClick={() => choose(value)}><span>{label}</span><b>→</b></button>)}</div><button className="text-button" onClick={backQuestion}>← Back</button></div></section>}
      {screen === 'funding' && <ResultsSection type="funding" answers={answers} onNext={() => setScreen('license')} nextLabel="Continue to licensing" onBack={() => { setScreen('questions'); setStep(currentQuestions.length - 1); }} />}
      {screen === 'license' && <ResultsSection type="license" answers={answers} onNext={() => setScreen('terms')} nextLabel="Continue to contract terms" onBack={() => setScreen('funding')} />}
      {screen === 'terms' && <ResultsSection type="terms" answers={answers} onNext={() => setScreen('complete')} nextLabel="See my summary" onBack={() => setScreen('license')} />}
      {screen === 'complete' && <section className="complete"><span className="eyebrow">Your {pathway === 'drug' ? 'drug' : 'technology'} pathway</span><h1>You’ve mapped the key decisions.</h1><p>Your results are designed to help you structure conversations with investors, development partners, licensors, counsel, and other advisors. They are not a substitute for professional advice.</p><div className="summary-grid"><div><span>01</span><h2>Fund & develop</h2><p>Compare sources of capital and capabilities against your development stage and priorities.</p></div><div><span>02</span><h2>License</h2><p>Think through exclusivity, field, territory, indication, and retained flexibility.</p></div><div><span>03</span><h2>Contract</h2><p>Focus on milestones, economics, IP, sublicensing, and termination.</p></div></div><button className="primary" onClick={start}>Start a new assessment</button></section>}
    </main>
    <footer><span>HealthTech Pathways</span><span>Educational use only · © 2026</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
