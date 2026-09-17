const trees = {
  funding: {
    title: 'Funding & development decision tree',
    root: 'What does the program need most?',
    branches: [
      ['Preserve ownership / early R&D', 'Screen non-dilutive funding', 'Check eligibility, IP, reporting & funding restrictions'],
      ['Flexible growth capital', 'Evaluate equity financing', 'Review dilution, governance & investor consent rights'],
      ['Capital + specialized capabilities', 'Evaluate co-development / strategic partnership', 'Define control, IP, diligence, economics & exit rights'],
      ['Maximum operational control', 'Consider self-development', 'Confirm runway, regulatory capacity & execution risk']
    ]
  },
  license: {
    title: 'License-structure decision tree',
    root: 'How much of the opportunity should one partner control?',
    branches: [
      ['Multiple partners should be possible', 'Non-exclusive license', 'Define channels, sublicensing, data rights & quality controls'],
      ['One partner needs protected rights', 'Exclusive license', 'Limit scope and tie exclusivity to diligence / milestones'],
      ['Divide rights by market or use', 'Field / indication / territory license', 'Draft boundaries, retained rights & overlapping-use rules']
    ]
  },
  terms: {
    title: 'Contract-priority decision tree',
    root: 'Where is the transaction’s biggest legal risk?',
    branches: [
      ['Program could stall', 'Milestones & diligence', 'Set objective duties, cure periods & reversion consequences'],
      ['Value depends on future success', 'Economics', 'Define milestones, royalties, net sales, audits & payment triggers'],
      ['Technology will evolve', 'IP / improvements / sublicensing', 'Allocate inventions, data, patent control & downstream rights'],
      ['Relationship may end', 'Termination & reversion', 'Plan data, regulatory, manufacturing & transition rights']
    ]
  },
  ownership: {
    title: 'Ownership & chain-of-title decision tree',
    root: 'Who currently controls the technology?',
    branches: [
      ['Company owns it', 'Verify chain of title', 'Confirm founder, employee & contractor assignments'],
      ['Founder / inventor owns it', 'Assignment or license may be needed', 'Document company authority before financing or partnering'],
      ['University / third party controls it', 'Review underlying rights', 'Check sublicensing, diligence, assignment & change-of-control limits'],
      ['Joint / unclear ownership', 'Resolve ownership before a deal', 'Map contributors, agreements, funding & required consents']
    ]
  }
};

function treeMarkup(tree, key) {
  return `<section class="decision-tree" data-tree="${key}" aria-label="${tree.title}">
    <div class="decision-tree-heading"><span class="eyebrow">Decision map</span><h2>${tree.title}</h2><p>Use this as an issue-spotting map. The branches identify questions to investigate; they are not legal conclusions.</p></div>
    <div class="tree-root">${tree.root}</div>
    <div class="tree-trunk" aria-hidden="true"></div>
    <div class="tree-branches">${tree.branches.map(([question,path,legal])=>`<article class="tree-branch"><div class="tree-question">${question}</div><div class="tree-arrow" aria-hidden="true">↓</div><div class="tree-path">${path}</div><div class="tree-legal"><strong>Legal focus</strong><span>${legal}</span></div></article>`).join('')}</div>
  </section>`;
}

function insertBeforeCards(heading, tree, key) {
  if (!heading || document.querySelector(`[data-tree="${key}"]`)) return;
  const scope = heading.closest('section') || heading.parentElement;
  if (!scope) return;
  const cards = scope.querySelector('.option-grid, .options, .decision-grid, .recommendation-grid, .columns');
  const wrapper = document.createElement('div');
  wrapper.innerHTML = treeMarkup(tree, key);
  const node = wrapper.firstElementChild;
  if (cards) cards.parentNode.insertBefore(node, cards);
  else heading.parentElement.insertBefore(node, heading.nextSibling);
}

function injectTrees() {
  const headings = [...document.querySelectorAll('h1,h2')];
  insertBeforeCards(headings.find(h=>h.textContent.includes('How should you fund and develop the program?')), trees.funding, 'funding');
  insertBeforeCards(headings.find(h=>h.textContent.includes('What type of license should you consider?')), trees.license, 'license');
  insertBeforeCards(headings.find(h=>h.textContent.includes('Which contractual terms deserve your attention?')), trees.terms, 'terms');
  const ownership = document.querySelector('[data-ownership-question]');
  if (ownership && !document.querySelector('[data-tree="ownership"]')) {
    const wrapper=document.createElement('div'); wrapper.innerHTML=treeMarkup(trees.ownership,'ownership'); ownership.appendChild(wrapper.firstElementChild);
  }
}

new MutationObserver(injectTrees).observe(document.documentElement,{subtree:true,childList:true});
injectTrees();
