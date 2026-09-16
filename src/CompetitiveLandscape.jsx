import React, { useState } from 'react';

const clean = value => String(value || '').trim();
const quote = value => `\"${clean(value).replace(/\"/g, '')}\"`;
const unique = values => [...new Set(values.filter(Boolean))];

async function getJSON(url) {
  const response = await fetch(url);
  if (!response.ok) {
    const error = new Error(`Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

async function searchDevices(term) {
  const q = quote(term);
  const endpoints = [
    `https://api.fda.gov/device/510k.json?search=${encodeURIComponent(`device_name:${q} OR statement_or_summary:${q}`)}&limit=12`,
    `https://api.fda.gov/device/udi.json?search=${encodeURIComponent(`brand_name:${q} OR version_or_model_number:${q}`)}&limit=12`
  ];
  const settled = await Promise.allSettled(endpoints.map(getJSON));
  const items = [];
  const k = settled[0].status === 'fulfilled' ? settled[0].value.results || [] : [];
  k.forEach(r => items.push({
    name: r.device_name || r.openfda?.device_name || 'FDA-cleared device',
    company: r.applicant || 'Applicant not listed',
    status: r.decision_description || '510(k) record',
    detail: [r.product_code && `Product code ${r.product_code}`, r.k_number && `510(k) ${r.k_number}`, r.decision_date && `Decision ${r.decision_date}`].filter(Boolean).join(' · '),
    source: 'FDA 510(k)',
    key: r.k_number || `${r.applicant}-${r.device_name}`
  }));
  const udi = settled[1].status === 'fulfilled' ? settled[1].value.results || [] : [];
  udi.forEach(r => items.push({
    name: r.brand_name || r.version_or_model_number || r.device_description || 'Listed device',
    company: r.company_name || r.labeler_duns || 'Company not listed',
    status: 'FDA UDI listing',
    detail: [r.version_or_model_number, r.device_description].filter(Boolean).join(' · ').slice(0, 240),
    source: 'FDA GUDID / UDI',
    key: r.public_device_record_key || `${r.company_name}-${r.brand_name}`
  }));
  return unique(items.map(x => JSON.stringify(x))).map(x => JSON.parse(x)).slice(0, 15);
}

async function searchDrugs(term) {
  const q = quote(term);
  const endpoints = [
    `https://api.fda.gov/drug/drugsfda.json?search=${encodeURIComponent(`openfda.brand_name:${q} OR openfda.generic_name:${q} OR products.active_ingredients.name:${q}`)}&limit=12`,
    `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(`indications_and_usage:${q}`)}&limit=12`
  ];
  const settled = await Promise.allSettled(endpoints.map(getJSON));
  const items = [];
  const approved = settled[0].status === 'fulfilled' ? settled[0].value.results || [] : [];
  approved.forEach(r => {
    const product = r.products?.[0] || {};
    items.push({
      name: product.brand_name || r.openfda?.brand_name?.[0] || product.active_ingredients?.[0]?.name || r.openfda?.generic_name?.[0] || 'FDA drug product',
      company: r.sponsor_name || r.openfda?.manufacturer_name?.[0] || 'Sponsor not listed',
      status: product.marketing_status || 'Drugs@FDA record',
      detail: [r.application_number, product.dosage_form, product.route].filter(Boolean).join(' · '),
      source: 'Drugs@FDA',
      key: `${r.application_number}-${product.product_number || product.brand_name || ''}`
    });
  });
  const labels = settled[1].status === 'fulfilled' ? settled[1].value.results || [] : [];
  labels.forEach(r => items.push({
    name: r.openfda?.brand_name?.[0] || r.openfda?.generic_name?.[0] || 'Labeled drug product',
    company: r.openfda?.manufacturer_name?.[0] || 'Manufacturer not listed',
    status: r.openfda?.product_type?.[0] || 'FDA labeling record',
    detail: clean(r.indications_and_usage?.[0]).replace(/\s+/g, ' ').slice(0, 240),
    source: 'FDA drug labeling',
    key: r.id || r.set_id || `${r.openfda?.brand_name?.[0]}-${r.openfda?.manufacturer_name?.[0]}`
  }));
  return unique(items.map(x => JSON.stringify(x))).map(x => JSON.parse(x)).slice(0, 15);
}

export default function CompetitiveLandscape({ pathway, answers }) {
  const customAsset = answers.technologyOther || answers.drugTypeOther || '';
  const [product, setProduct] = useState(customAsset);
  const [useCase, setUseCase] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const runSearch = async () => {
    const terms = unique([product, useCase].map(clean));
    if (!terms.length) { setMessage('Describe the product or its intended use before searching.'); return; }
    setLoading(true); setMessage(''); setResults([]);
    try {
      const searches = await Promise.allSettled(terms.map(term => pathway === 'drug' ? searchDrugs(term) : searchDevices(term)));
      const merged = searches.flatMap(r => r.status === 'fulfilled' ? r.value : []);
      const seen = new Set();
      const deduped = merged.filter(item => { const key = `${item.source}|${item.key}|${item.name}`; if (seen.has(key)) return false; seen.add(key); return true; }).slice(0, 18);
      setResults(deduped);
      if (!deduped.length) setMessage('No close FDA database matches were returned. Try a shorter generic product term, active ingredient, device type, condition, or indication. A zero-result search does not mean there are no competitors.');
    } catch (error) {
      setMessage('The live FDA search could not be completed right now. You can retry or use the official FDA databases linked below.');
    } finally { setLoading(false); }
  };

  return <section className="competitive-panel">
    <div className="decision-header"><span className="eyebrow">Market & competitive landscape</span><h1>Search for potentially similar products already in the U.S. market.</h1><p>Enter a concise generic description of what you are developing and its intended use. The tool searches current FDA public data and returns possible comparators for further review.</p></div>
    <div className="funding-input-panel">
      <label><strong>What exactly are you developing?</strong><span>Examples: continuous glucose monitor, AI radiology triage software, anti-CD20 antibody.</span><input value={product} onChange={e=>setProduct(e.target.value)} placeholder="Product, device type, active ingredient, or mechanism" /></label>
      <label><strong>What condition, indication, or use case does it address?</strong><span>Use a short clinical or market phrase for broader comparator discovery.</span><input value={useCase} onChange={e=>setUseCase(e.target.value)} placeholder="Condition, indication, patient group, or intended use" /></label>
    </div>
    <button className="primary" onClick={runSearch} disabled={loading}>{loading ? 'Searching FDA data…' : 'Find similar products'}</button>
    {message && <div className="funding-gate"><span>{message}</span></div>}
    {results.length > 0 && <div className="funding-panel"><div><span className="eyebrow">Live database matches</span><h2>Products to investigate as possible competitors or comparators</h2><p>These are keyword-based research leads, not a determination that a product is clinically, commercially, legally, or technologically equivalent to yours.</p></div><div className="funding-list">{results.map((item,index)=><article key={`${item.key}-${index}`}><div className="funding-meta"><span>{item.source}</span><span>Research lead</span></div><h3>{item.name}</h3><p><strong>{item.company}</strong></p><p>{item.status}{item.detail ? ` · ${item.detail}` : ''}</p></article>)}</div></div>}
    <div className="investor-panel"><span className="eyebrow">How to use these results</span><h2>Validate before treating a match as a competitor.</h2><p>Compare intended use or indication, patient population, mechanism or technical approach, regulatory status, route or form factor, pricing/reimbursement where available, IP/exclusivity, and commercial positioning. Also search pipeline products and clinical trials because FDA market databases do not capture every future rival.</p><div className="state-search-cards">{pathway === 'drug' ? <><a href="https://www.accessdata.fda.gov/scripts/cder/daf/" target="_blank" rel="noreferrer"><strong>Drugs@FDA</strong><span>Confirm approved drug products and application information.</span></a><a href="https://clinicaltrials.gov/" target="_blank" rel="noreferrer"><strong>ClinicalTrials.gov</strong><span>Investigate pipeline products and active clinical studies.</span></a></> : <><a href="https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpmn/pmn.cfm" target="_blank" rel="noreferrer"><strong>FDA 510(k) database</strong><span>Confirm device clearances and predicate/comparator information.</span></a><a href="https://www.accessdata.fda.gov/scripts/cdrh/cfdocs/cfpma/pma.cfm" target="_blank" rel="noreferrer"><strong>FDA PMA database</strong><span>Review approved higher-risk medical devices.</span></a></>}</div></div>
    <p className="small">FDA/openFDA data are useful research sources but are not a complete market-share, patent, reimbursement, clinical-equivalence, or freedom-to-operate analysis. Results should be validated with current regulatory records and qualified market, regulatory, and IP professionals.</p>
  </section>;
}
