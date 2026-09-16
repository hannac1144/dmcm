import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const questions = [
  { id: 'technology', title: 'What are you building?', prompt: 'Choose the description that best fits your healthcare technology.', options: [
    ['Digital health / software', 'digital'], ['Medical device', 'device'], ['Diagnostic / laboratory technology', 'diagnostic'], ['Therapeutic / life-science technology', 'therapeutic'], ['Other healthcare technology', 'other']
  ]},
  { id: 'company', title: 'Tell us about your organization', prompt: 'Where are you in the company-building journey?', options: [
    ['University / research institution', 'university'], ['Startup / early-stage company', 'startup'], ['Established company', 'established'], ['Hospital / health system', 'health-system'], ['Other organization', 'other']
  ]},
  { id: 'stage', title: 'What stage is the technology in?', prompt: 'Select the stage that best describes its current development.', options: [
    ['Research / proof of concept', 'research'], ['Prototype / preclinical', 'prototype'], ['Clinical development / testing', 'clinical'], ['Regulatory review / authorization', 'regulatory'], ['Commercial / market-ready', 'commercial']
  ]},
  { id: 'funding', title: 'What do you need next?', prompt: 'Choose the primary funding or development need.', options: [
    ['Research and development capital', 'rd'], ['Clinical or regulatory funding', 'clinical'], ['Manufacturing / scale-up capital', 'scale'], ['Commercialization resources', 'commercial'], ['Partner capabilities more than capital', 'partner']
  ]},
  { id: 'priority', title: 'What matters most to you?', prompt: 'Pick the priority you want to protect in negotiations.', options: [
    ['Maintaining control and flexibility', 'control'], ['Speed to market', 'speed'], ['Access to expertise and resources', 'expertise'], ['Maximizing near-term funding', 'funding'], ['Long-term commercialization value', 'value']
  ]}
];

const decisionContent = {
  funding: {
    eyebrow: 'Decision 01', title: 'How should you fund and develop the technology?',
    intro: 'There is rarely one universally correct path. The right questions are who can supply capital, capabilities, market access, and development risk—and what you give up in return.',
    options: [
      { name: 'Non-dilutive funding', fit: ['research','rd','clinical'], pros: ['Preserves ownership and equity','Can support high-risk development'], cons: ['Competitive and often slower to obtain','Funding may be restricted to defined uses'], consider: 'Consider whether your timeline and eligibility fit grant or other non-dilutive programs.' },
      { name: 'Equity investment', fit: ['startup','rd','scale','funding'], pros: ['Provides flexible growth capital','Can bring strategic expertise and networks'], cons: ['Dilutes existing ownership','Investors may have governance or return expectations'], consider: 'Consider how much capital you need, your valuation, and what governance rights you are prepared to share.' },
      { name: 'Strategic partnership / co-development', fit: ['partner','expertise','clinical','regulatory','scale'], pros: ['Adds technical, regulatory, manufacturing, or commercial capabilities','Can share development risk'], cons: ['Requires alignment on control and economics','Partner incentives may differ from yours'], consider: 'Consider which capabilities you cannot efficiently build yourself and whether a partner can provide them.' },
      { name: 'Self-development', fit: ['control','value','commercial'], pros: ['Maximum control over strategy and IP','Keeps more future economics in-house'], cons: ['Requires internal capital and capabilities','You bear more development risk'], consider: 'Consider whether you have enough runway, talent, and infrastructure for the next development milestone.' }
    ]
  },
  license: {
    eyebrow: 'Decision 02', title: 'What type of license should you consider?',
    intro: 'License structure determines who can use the technology, in what market or field, and how much flexibility each party retains.',
    options: [
      { name: 'Non-exclusive license', fit: ['control','speed','digital','diagnostic'], pros: ['Retains ability to license to others','Can support broad dissemination'], cons: ['May be less attractive to a partner seeking market protection','Licensee may have fewer incentives to invest heavily'], consider: 'Consider whether multiple licensees could serve different markets or accelerate adoption.' },
      { name: 'Exclusive license', fit: ['value','startup','therapeutic','device'], pros: ['May create stronger commercialization incentives','Can provide a partner with meaningful market protection'], cons: ['Limits your ability to license the same rights elsewhere','Requires careful performance and diligence provisions'], consider: 'Consider tying exclusivity to a defined field, territory, or measurable development commitments.' },
      { name: 'Field-of-use or territory-limited license', fit: ['control','value','commercial'], pros: ['Balances exclusivity with retained rights','Can divide markets among capable partners'], cons: ['Requires precise drafting','May create disputes about scope or overlap'], consider: 'Consider exactly which products, indications, customers, territories, and channels the license covers.' }
    ]
  },
  terms: {
    eyebrow: 'Decision 03', title: 'Which contractual terms deserve your attention?',
    intro: 'Once the basic structure is chosen, the practical outcome often turns on the details. Focus negotiations on the terms most connected to your priorities and development stage.',
    options: [
      { name: 'Development milestones & diligence', fit: ['clinical','regulatory','prototype','speed'], pros: ['Creates measurable expectations','Can protect against technology being shelved'], cons: ['Milestones can become burdensome or unrealistic','Failure may trigger loss of rights'], consider: 'Make milestones objectively measurable and account for regulatory, technical, and supply-chain uncertainty.' },
      { name: 'Economics: payments & royalties', fit: ['funding','value','commercial'], pros: ['Aligns financial returns with commercialization','Can balance upfront and downstream value'], cons: ['Complex structures can be difficult to administer','Higher payments can affect commercialization incentives'], consider: 'Consider upfront fees, milestones, royalties, minimums, payment triggers, and audit rights together.' },
      { name: 'IP, improvements & sublicensing', fit: ['control','expertise','university','startup'], pros: ['Clarifies ownership and future rights','Reduces uncertainty as the technology evolves'], cons: ['Improvement rights can be technically complex','Sublicensing can change who actually develops or commercializes'], consider: 'Define background IP, new improvements, ownership, use rights, and the circumstances for sublicensing.' },
      { name: 'Termination & reversion rights', fit: ['control','value','speed'], pros: ['Provides an exit if obligations are not met','Can return rights for future development'], cons: ['Termination can disrupt ongoing commercialization','Post-termination obligations need careful treatment'], consider: 'Consider cure periods, milestone failures, insolvency, post-termination rights, and treatment of existing products.' }
    ]
  }
};

function scoreOption(option, answers) {
  return option.fit.reduce((score, value) => score + Object.values(answers).includes(value), 0);
}

function ResultsSection({ type, answers, onNext, nextLabel, onBack }) {
  const data = decisionContent[type];
  const ranked = useMemo(() => [...data.options].sort((a,b) => scoreOption(b, answers) - scoreOption(a, answers)), [answers, data]);
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
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const current = questions[step];
  const choose = value => { setAnswers(prev => ({ ...prev, [current.id]: value })); setStep(s => s + 1); setScreen(step === questions.length - 1 ? 'funding' : 'questions'); };
  const backQuestion = () => { if (step === 0) setScreen('intro'); else setStep(s => s - 1); };
  const start = () => { setAnswers({}); setStep(0); setScreen('questions'); };
  return <div className="app-shell">
    <header><div className="brand">HealthTech <span>Pathways</span></div><div className="header-note">Decision support for healthcare technology</div></header>
    <main>
      {screen === 'intro' && <section className="hero"><div className="hero-copy"><span className="eyebrow">A guided decision tool</span><h1>Turn your healthcare technology into a clearer path forward.</h1><p>Answer a few questions about your technology, company, development stage, and priorities. We’ll walk you through funding, licensing, and contract decisions—without pretending there is one right answer.</p><button className="primary large" onClick={start}>Start the assessment <span>→</span></button><p className="small">Educational decision support—not legal, medical, or financial advice.</p></div><div className="hero-panel"><div className="panel-line"><span>01</span><strong>Fund & develop</strong><em>Explore pathways</em></div><div className="panel-line"><span>02</span><strong>License</strong><em>Compare structures</em></div><div className="panel-line"><span>03</span><strong>Contract</strong><em>Focus negotiations</em></div></div></section>}
      {screen === 'questions' && <section className="question-screen"><div className="progress"><span>Question {step + 1} of {questions.length}</span><div><i style={{width: `${((step)/questions.length)*100}%`}} /></div></div><div className="question"><span className="eyebrow">About your situation</span><h1>{current.title}</h1><p>{current.prompt}</p><div className="choices">{current.options.map(([label,value]) => <button className="choice" key={value} onClick={() => choose(value)}><span>{label}</span><b>→</b></button>)}</div><button className="text-button" onClick={backQuestion}>← Back</button></div></section>}
      {screen === 'funding' && <ResultsSection type="funding" answers={answers} onNext={() => setScreen('license')} nextLabel="Continue to licensing" onBack={() => { setScreen('questions'); setStep(questions.length - 1); }} />}
      {screen === 'license' && <ResultsSection type="license" answers={answers} onNext={() => setScreen('terms')} nextLabel="Continue to contract terms" onBack={() => setScreen('funding')} />}
      {screen === 'terms' && <ResultsSection type="terms" answers={answers} onNext={() => setScreen('complete')} nextLabel="See my summary" onBack={() => setScreen('license')} />}
      {screen === 'complete' && <section className="complete"><span className="eyebrow">Your pathway</span><h1>You’ve mapped the key decisions.</h1><p>Your results are designed to help you structure conversations with investors, partners, licensors, counsel, and other advisors. They are not a substitute for professional advice.</p><div className="summary-grid"><div><span>01</span><h2>Fund & develop</h2><p>Compare sources of capital and capabilities against your stage and priorities.</p></div><div><span>02</span><h2>License</h2><p>Think through exclusivity, field, territory, and retained flexibility.</p></div><div><span>03</span><h2>Contract</h2><p>Focus on milestones, economics, IP, sublicensing, and termination.</p></div></div><button className="primary" onClick={start}>Start over</button></section>}
    </main>
    <footer><span>HealthTech Pathways</span><span>Educational use only · © 2026</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
