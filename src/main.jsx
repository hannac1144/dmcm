import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { jsPDF } from 'jspdf';
import './styles.css';

const states = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const pathways = {
  technology: {
    label: 'Healthcare technology',
    description: 'Software, devices, diagnostics, platforms, and other healthcare technologies.',
    questions: [
      { id: 'technology', title: 'What are you building?', prompt: 'Choose the description that best fits your healthcare technology.', options: [['Digital health / software', 'digital'], ['Medical device', 'device'], ['Diagnostic / laboratory technology', 'diagnostic'], ['Connected / data-enabled platform', 'platform'], ['Other healthcare technology', 'other']] },
      { id: 'company', title: 'Tell us about your organization', prompt: 'Where are you in the company-building journey?', options: [['University / research institution', 'university'], ['Startup / early-stage company', 'startup'], ['Established company', 'established'], ['Hospital / health system', 'health-system'], ['Other organization', 'other']] },
      { id: 'legalStructure', title: 'What is your legal structure?', prompt: 'Select the entity structure that will own, license, develop, or commercialize the technology. If more than one entity is involved, choose the primary entity for this assessment.', options: [['LLC — Limited Liability Company', 'llc'], ['LLP — Limited Liability Partnership', 'llp'], ['LP — Limited Partnership', 'lp'], ['General partnership', 'general-partnership'], ['C corporation', 'c-corp'], ['S corporation', 's-corp'], ['Professional corporation (PC)', 'pc'], ['Professional limited liability company (PLLC)', 'pllc'], ['Nonprofit corporation', 'nonprofit'], ['Sole proprietorship', 'sole-proprietorship'], ['Benefit / public benefit corporation', 'benefit-corp'], ['University / research institution', 'university-entity'], ['Hospital / health system', 'hospital-entity'], ['Public / governmental entity', 'government-entity'], ['Other legal structure', 'other-legal']] },
      { id: 'state', title: 'Which state are you operating in?', prompt: 'Select the state whose licensing and healthcare-regulatory rules should be included in your issue-spotting review.', options: states.map(state => [state, state]) },
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
      { id: 'legalStructure', title: 'What is your legal structure?', prompt: 'Select the entity structure that will own, license, develop, or commercialize the drug or therapeutic. If more than one entity is involved, choose the primary entity for this assessment.', options: [['LLC — Limited Liability Company', 'llc'], ['LLP — Limited Liability Partnership', 'llp'], ['LP — Limited Partnership', 'lp'], ['General partnership', 'general-partnership'], ['C corporation', 'c-corp'], ['S corporation', 's-corp'], ['Professional corporation (PC)', 'pc'], ['Professional limited liability company (PLLC)', 'pllc'], ['Nonprofit corporation', 'nonprofit'], ['Sole proprietorship', 'sole-proprietorship'], ['Benefit / public benefit corporation', 'benefit-corp'], ['University / research institution', 'university-entity'], ['Hospital / health system', 'hospital-entity'], ['Public / governmental entity', 'government-entity'], ['Other legal structure', 'other-legal']] },
      { id: 'state', title: 'Which state are you operating in?', prompt: 'Select the state whose licensing and healthcare-regulatory rules should be included in your issue-spotting review.', options: states.map(state => [state, state]) },
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
      { name: 'Non-dilutive funding', fit: ['research','rd','clinical','discovery','preclinical-funding','university','nonprofit','university-entity','government-entity'], pros: ['Preserves ownership and equity','Can support high-risk research or development'], cons: ['Competitive and often slower to obtain','Funding may be restricted to defined uses or milestones'], consider: 'Consider whether your timeline, eligibility, and development plan fit grants or other non-dilutive programs.' },
      { name: 'Equity investment', fit: ['startup','rd','scale','funding','preclinical-funding','trial-funding','llc','c-corp','s-corp'], pros: ['Provides growth capital without licensing away the program','May bring strategic expertise and networks'], cons: ['Dilutes existing ownership','Investors may have governance or return expectations'], consider: 'Consider how much capital is needed to reach the next value-creating milestone and what governance rights you are prepared to share.' },
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
      { name: 'IP, improvements & sublicensing', fit: ['control','expertise','university','startup','biologic','small-molecule','cell-gene','university-entity','nonprofit'], pros: ['Clarifies ownership and future rights','Reduces uncertainty as the asset, platform, or technology evolves'], cons: ['Improvement rights can be technically complex','Sublicensing can change who actually develops or commercializes'], consider: 'Define background IP, new improvements, patent rights, ownership, prosecution responsibilities, use rights, and circumstances for sublicensing.' },
      { name: 'Termination, reversion & rights after termination', fit: ['control','value','speed','phase-1','phase-2','phase-3'], pros: ['Provides an exit if obligations are not met','Can return rights for future development'], cons: ['Termination can disrupt ongoing development or commercialization','Post-termination obligations need careful treatment'], consider: 'Consider cure periods, milestone failures, insolvency, patent issues, transition obligations, inventory, ongoing trials, and treatment of rights after termination.' }
    ]
  }
};

const stateReview = {
  technology: [
    'Professional licensing and scope-of-practice rules may matter if the product supports or performs regulated clinical services.',
    'Telehealth and remote-care requirements may matter for software or platforms used in clinical care.',
    'Corporate-practice-of-medicine and healthcare-entity ownership rules may affect how services are structured in some states.',
    'Facility, laboratory, durable medical equipment, pharmacy, or other sector-specific licensing may apply depending on the product and business model.',
    'State consumer-protection, privacy, data, and health-information requirements should be checked alongside licensing rules.'
  ],
  drug: [
    'State pharmacy and drug-distribution licensing may matter for manufacturing, wholesale distribution, dispensing, or commercialization activities.',
    'State controlled-substance requirements may apply if the product falls within a controlled-substance category.',
    'State professional and facility licensing may matter for dispensing, administration, or clinical services.',
    'State-specific requirements for manufacturers, wholesalers, pharmacies, or other entities should be reviewed based on the planned commercial model.',
    'Federal drug requirements do not replace potentially applicable state licensing and professional-practice requirements.'
  ]
};

const structureLabels = {
  llc: 'LLC — Limited Liability Company',
  llp: 'LLP — Limited Liability Partnership',
  lp: 'LP — Limited Partnership',
  'general-partnership': 'General partnership',
  'c-corp': 'C corporation',
  's-corp': 'S corporation',
  pc: 'Professional corporation (PC)',
  pllc: 'Professional limited liability company (PLLC)',
  nonprofit: 'Nonprofit corporation',
  'sole-proprietorship': 'Sole proprietorship',
  'benefit-corp': 'Benefit / public benefit corporation',
  'university-entity': 'University / research institution',
  'hospital-entity': 'Hospital / health system',
  'government-entity': 'Public / governmental entity',
  'other-legal': 'Other legal structure'
};

function getTailoredConsiderations(pathway, answers) {
  const items = [];
  const { state, company, legalStructure, stage, technology, drugType, funding, need, priority } = answers;
  const structure = structureLabels[legalStructure] || legalStructure;

  if (state) items.push({ title: `${state} + entity structure`, text: `Confirm whether the selected entity can lawfully perform the contemplated healthcare activities in ${state}, whether it must register or qualify there, and whether the entity form creates ownership, professional-entity, or contracting constraints. The exact rules depend on the activity and current state law.` });

  if (legalStructure === 'llp' || legalStructure === 'lp' || legalStructure === 'general-partnership') items.push({ title: 'Partnership structure', text: `Because the primary entity is a ${structure}, review authority to grant licenses, allocation of IP and development obligations, partner consent requirements, and how liability, fiduciary duties, and exits are handled under the governing agreement and applicable state law.` });

  if (legalStructure === 'llc' || legalStructure === 'c-corp' || legalStructure === 's-corp' || legalStructure === 'benefit-corp') items.push({ title: 'Company financing & governance', text: `For a ${structure}, align the licensing strategy with capitalization, investor rights, board or member approvals, reserved matters, and any restrictions on transferring or encumbering the technology or therapeutic program.` });

  if (legalStructure === 'pc' || legalStructure === 'pllc' || company === 'health-system') items.push({ title: 'Professional / healthcare entity issues', text: 'Because the organization may involve a professional or healthcare-focused entity, determine whether clinical services, prescribing, dispensing, diagnosis, treatment, or other regulated activities must be conducted through a particular entity or by appropriately licensed professionals.' });

  if (legalStructure === 'university-entity' || company === 'university') items.push({ title: 'Research institution ownership & IP', text: 'Confirm who owns the background IP, inventions, data, materials, and improvements; whether institutional policies or funding obligations apply; and who has authority to approve a license, sublicense, publication restriction, or commercialization commitment.' });

  if (legalStructure === 'nonprofit') items.push({ title: 'Nonprofit constraints', text: 'Review the organization’s governing documents, tax-exempt requirements, mission constraints, and approval processes when evaluating equity, licensing economics, related-party transactions, and commercialization arrangements.' });

  if (pathway === 'technology') {
    if (technology === 'digital' || technology === 'platform') items.push({ title: 'Software / data layer', text: `At the ${stageLabel(stage)} stage, identify who owns the software, datasets, models, documentation, and improvements; then map privacy, security, data-use, interoperability, and clinical-workflow obligations to the states and customers involved.` });
    if (technology === 'device') items.push({ title: 'Device commercialization', text: `At the ${stageLabel(stage)} stage, align IP and license scope with regulatory status, manufacturing responsibilities, quality systems, product liability allocation, field restrictions, and post-market obligations.` });
    if (technology === 'diagnostic') items.push({ title: 'Diagnostic / laboratory model', text: `At the ${stageLabel(stage)} stage, determine whether the business model involves laboratory services, testing, reporting, specimen handling, or other regulated activities, and identify which entity will hold the relevant licenses or contracts.` });
    if (stage === 'clinical' || stage === 'regulatory') items.push({ title: 'Clinical / regulatory transition', text: 'The asset is entering or undergoing a regulated validation or authorization phase, so licensing and development agreements should clearly allocate regulatory submissions, testing responsibilities, quality obligations, adverse-event or incident handling, and ownership of resulting data.' });
    if (stage === 'commercial') items.push({ title: 'Commercial model', text: `Because the technology is market-ready, define exactly which entity will sell, license, support, host, manufacture, or deliver the product and make sure the license scope matches the intended customers, channels, territories, and services.` });
  }

  if (pathway === 'drug') {
    if (drugType === 'biologic') items.push({ title: 'Biologic program', text: `At the ${stageLabel(stage)} stage, pay particular attention to manufacturing and CMC responsibilities, regulatory submissions, clinical data rights, biologic-specific IP, and control of process or formulation improvements.` });
    if (drugType === 'cell-gene') items.push({ title: 'Cell / gene therapy program', text: `At the ${stageLabel(stage)} stage, agreements should carefully allocate manufacturing, chain-of-identity or chain-of-custody responsibilities where applicable, clinical supply, regulatory obligations, specialized know-how, and rights to platform improvements.` });
    if (drugType === 'small-molecule') items.push({ title: 'Small-molecule program', text: `At the ${stageLabel(stage)} stage, map compound, formulation, manufacturing, patent, regulatory, and commercialization rights so the license covers the intended development plan without unintentionally giving away unrelated programs or indications.` });
    if (stage === 'phase-1' || stage === 'phase-2' || stage === 'phase-3') items.push({ title: 'Clinical-stage allocation', text: 'A clinical-stage program benefits from clear allocation of trial funding, CRO and investigator responsibilities, regulatory submissions, safety reporting, data ownership, publication rights, manufacturing supply, milestone definitions, and termination consequences.' });
    if (stage === 'approved') items.push({ title: 'Approved-product commercialization', text: 'For an approved product, focus on commercial supply, pharmacovigilance, regulatory maintenance, pricing and market-access responsibilities, sales and royalty reporting, territory and indication scope, and transition obligations if the relationship ends.' });
  }

  if (funding === 'clinical' || need === 'trial-funding' || stage === 'phase-1' || stage === 'phase-2' || stage === 'phase-3') items.push({ title: 'Capital tied to milestones', text: `Because the program requires substantial development funding at the ${stageLabel(stage)} stage, compare financing and licensing structures by the amount of capital available, dilution or economic sharing, milestone risk, and who controls decisions when additional funding is needed.` });

  if (priority === 'control') items.push({ title: 'Control priority', text: 'Preserve flexibility by defining reserved rights, approval thresholds, retained fields or territories, development decision rights, sublicensing limits, and reversion triggers rather than relying only on a broad exclusivity label.' });
  if (priority === 'speed') items.push({ title: 'Speed priority', text: 'If speed is the priority, identify which approvals, resources, regulatory steps, and operational capabilities are actually slowing development and make those responsibilities measurable in the agreement.' });
  if (priority === 'value') items.push({ title: 'Long-term value priority', text: 'If long-term value is the priority, pay particular attention to field and territory scope, indications, improvements, sublicensing economics, milestones, diligence obligations, and rights that return if the partner stops developing the asset.' });

  return items.slice(0, 8);
}

function stageLabel(stage) {
  return ({
    research: 'research / proof-of-concept', prototype: 'prototype / validation', clinical: 'clinical testing / validation', regulatory: 'regulatory review / authorization', commercial: 'commercial / market-ready',
    discovery: 'discovery / preclinical', 'ind-enabling': 'IND-enabling / preclinical development', 'phase-1': 'Phase 1', 'phase-2': 'Phase 2', 'phase-3': 'Phase 3 / registration', approved: 'approved / commercial'
  })[stage] || 'current';
}

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

function downloadPDF({ pathway, answers }) {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 48;
  const width = 612 - margin * 2;
  let y = 54;
  const addText = (text, size = 10, bold = false, gap = 7) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(String(text), width);
    if (y + lines.length * (size + 4) > 740) { doc.addPage(); y = 54; }
    doc.text(lines, margin, y);
    y += lines.length * (size + 4) + gap;
  };
  const addHeading = (text) => { if (y > 700) { doc.addPage(); y = 54; } doc.setFont('helvetica','bold'); doc.setFontSize(15); doc.text(text, margin, y); y += 24; };

  addText('HealthTech Pathways', 20, true, 5);
  addText('Assessment results and issue-spotting summary', 11, false, 16);
  addText(`Pathway: ${pathways[pathway].label}`, 11, true);
  addText(`State selected: ${answers.state || 'Not provided'}`, 11, true, 14);

  addHeading('Assessment answers');
  pathways[pathway].questions.forEach(question => {
    const value = answers[question.id];
    if (value) {
      const option = question.options.find(([, optionValue]) => optionValue === value);
      addText(`${question.title}: ${option ? option[0] : value}`, 10, false, 4);
    }
  });

  ['funding','license','terms'].forEach(type => {
    addHeading(decisionContent[type].title);
    const ranked = [...decisionContent[type].options].sort((a, b) => scoreOption(b, answers) - scoreOption(a, answers));
    ranked.forEach((option, index) => {
      addText(`${index + 1}. ${option.name}${index === 0 ? ' — strongest match based on the selected inputs' : ''}`, 11, true, 4);
      addText(`Advantages: ${option.pros.join('; ')}`, 9, false, 3);
      addText(`Drawbacks: ${option.cons.join('; ')}`, 9, false, 3);
      addText(`Consider: ${option.consider}`, 9, false, 9);
    });
  });

  addHeading('Tailored legal & business considerations');
  getTailoredConsiderations(pathway, answers).forEach(item => {
    addText(item.title, 10, true, 2);
    addText(item.text, 9, false, 6);
  });

  addHeading(`State licensing & regulatory issue-spotting: ${answers.state || 'State not selected'}`);
  addText('The items below are issue-spotting prompts, not a statement that a particular state law applies. Confirm the current law and business model with qualified counsel or the appropriate state regulator.', 9, false, 7);
  stateReview[pathway].forEach(item => addText(`• ${item}`, 9, false, 4));

  addHeading('Important limitation');
  addText('This tool provides educational decision support. It is not legal, medical, regulatory, tax, investment, or financial advice, and the state-law section is not a substitute for current state-specific legal research. Licensing requirements can depend on the exact product, services, entity structure, activities, and business model.', 9, false, 8);
  addText(`Generated ${new Date().toLocaleDateString()}`, 8, false, 0);

  doc.save(`healthtech-pathways-${pathway}-${(answers.state || 'assessment').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`);
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
  const tailored = pathway ? getTailoredConsiderations(pathway, answers) : [];

  return <div className="app-shell">
    <header><div className="brand">HealthTech <span>Pathways</span></div><div className="header-note">Decision support for healthcare development</div></header>
    <main>
      {screen === 'intro' && <section className="hero"><div className="hero-copy"><span className="eyebrow">A guided decision tool</span><h1>Choose your pathway, then map the decisions ahead.</h1><p>Tell us whether you are developing a healthcare technology or a drug/therapeutic program. We’ll tailor the questions and decision guidance to the type of asset you are developing.</p><div className="pathway-choice"><button className="pathway-card" onClick={() => choosePathway('technology')}><span className="pathway-number">01</span><strong>Healthcare technology</strong><em>Software, devices, diagnostics, platforms, and more</em><b>Start technology assessment →</b></button><button className="pathway-card" onClick={() => choosePathway('drug')}><span className="pathway-number">02</span><strong>Drug / therapeutic</strong><em>Small molecules, biologics, cell & gene therapies, and more</em><b>Start drug assessment →</b></button></div><p className="small">Educational decision support—not legal, medical, or financial advice.</p></div><div className="hero-panel"><div className="panel-line"><span>01</span><strong>Fund & develop</strong><em>Explore pathways</em></div><div className="panel-line"><span>02</span><strong>License</strong><em>Compare structures</em></div><div className="panel-line"><span>03</span><strong>Contract</strong><em>Focus negotiations</em></div></div></section>}
      {screen === 'questions' && <section className="question-screen"><div className="progress"><span>{pathways[pathway].label} · Question {step + 1} of {currentQuestions.length}</span><div><i style={{width: `${((step + 1) / currentQuestions.length) * 100}%`}} /></div></div><div className="question"><span className="eyebrow">About your situation</span><h1>{current.title}</h1><p>{current.prompt}</p>{current.id === 'state' ? <select className="state-select" value={answers.state || ''} onChange={e => e.target.value && choose(e.target.value)}><option value="">Select a state…</option>{states.map(state => <option key={state} value={state}>{state}</option>)}</select> : <div className="choices">{current.options.map(([label, value]) => <button className="choice" key={value} onClick={() => choose(value)}><span>{label}</span><b>→</b></button>)}</div>}<button className="text-button" onClick={backQuestion}>← Back</button></div></section>}
      {screen === 'funding' && <ResultsSection type="funding" answers={answers} onNext={() => setScreen('license')} nextLabel="Continue to licensing" onBack={() => { setScreen('questions'); setStep(currentQuestions.length - 1); }} />}
      {screen === 'license' && <ResultsSection type="license" answers={answers} onNext={() => setScreen('terms')} nextLabel="Continue to contract terms" onBack={() => setScreen('funding')} />}
      {screen === 'terms' && <ResultsSection type="terms" answers={answers} onNext={() => setScreen('complete')} nextLabel="See my summary" onBack={() => setScreen('license')} />}
      {screen === 'complete' && <section className="complete"><span className="eyebrow">Your {pathway === 'drug' ? 'drug' : 'technology'} pathway</span><h1>You’ve mapped the key decisions.</h1><p>Your results are designed to help you structure conversations with investors, development partners, licensors, counsel, and other advisors. They are not a substitute for professional advice.</p><div className="summary-grid"><div><span>01</span><h2>Fund & develop</h2><p>Compare sources of capital and capabilities against your development stage and priorities.</p></div><div><span>02</span><h2>License</h2><p>Think through exclusivity, field, territory, indication, and retained flexibility.</p></div><div><span>03</span><h2>Contract</h2><p>Focus on milestones, economics, IP, sublicensing, and termination.</p></div></div><div className="state-summary"><span className="eyebrow">Tailored legal & business considerations</span><h2>{answers.state || 'State not selected'} · {structureLabels[answers.legalStructure] || 'Entity structure not selected'}</h2><p>These issue-spotting prompts combine the selected state, entity structure, asset type, and development stage. They are designed to identify questions for further diligence—not to determine whether a law applies.</p><ul>{tailored.map(item => <li key={item.title}><strong>{item.title}:</strong> {item.text}</li>)}</ul><p className="small">Confirm current state and federal requirements with qualified counsel or the appropriate regulator. Exact obligations can depend on the entity, activities, contracts, customers, and business model.</p></div><div className="state-summary"><span className="eyebrow">State-law issue spotting</span><h2>{answers.state || 'State not selected'}</h2><p>We’ve carried your selected state into the results so the licensing and healthcare-regulatory issues can be reviewed in the context of that jurisdiction.</p><ul>{stateReview[pathway].map(item => <li key={item}>{item}</li>)}</ul><p className="small">These are issue-spotting categories, not a determination that a specific state law applies. Exact requirements should be verified against current state law and your business model.</p></div><div className="download-panel"><div><span className="eyebrow">Save your work</span><h2>Download your complete assessment</h2><p>Get a PDF containing your answers, decision guidance, tailored entity/state/asset/stage considerations, state-law issue-spotting prompts, and the professional-advice limitation.</p></div><button className="primary large" onClick={() => downloadPDF({ pathway, answers })}>Download PDF <span>↓</span></button></div><button className="primary" onClick={start}>Start a new assessment</button></section>}
    </main>
    <footer><span>HealthTech Pathways</span><span>Educational use only · © 2026</span></footer>
  </div>
}

createRoot(document.getElementById('root')).render(<App />);
