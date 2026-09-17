const ownershipOptions = [
  ['The company / organization owns it directly', 'company-owned'],
  ['Founder(s) or individual inventor(s) currently own it', 'founder-owned'],
  ['University / research institution owns or controls it', 'university-owned'],
  ['Licensed from a university or other third party', 'licensed-in'],
  ['Jointly owned with another company, institution, or collaborator', 'jointly-owned'],
  ['Ownership is unclear or still being documented', 'ownership-unclear'],
  ['Other ownership arrangement', 'ownership-other']
];

const ownershipLegalNotes = {
  'company-owned': 'Confirm that all founders, employees, consultants, contractors, and collaborators have executed appropriate invention-assignment documents and that the entity actually holds the relevant patent, software, data, know-how, and other IP rights.',
  'founder-owned': 'Consider whether the relevant IP should be assigned or licensed to the operating company before financing or partnering. Investors and counterparties commonly diligence chain of title and the company’s authority to grant rights.',
  'university-owned': 'Review the institution’s technology-transfer policies and any sponsored-research, government-funding, inventor, publication, or third-party obligations before assuming the company can commercialize or sublicense the technology.',
  'licensed-in': 'Review the underlying license for field, territory, exclusivity, sublicensing, diligence, payment, assignment, change-of-control, patent, improvement, and termination provisions before negotiating downstream rights.',
  'jointly-owned': 'Joint ownership can create significant commercialization and enforcement issues. Review the governing collaboration documents and applicable law to determine each owner’s ability to use, license, enforce, assign, or transfer its interest.',
  'ownership-unclear': 'Resolve chain-of-title questions early. Identify inventors and contributors, employment and consulting relationships, institutional policies, funding sources, prior agreements, and any assignments or licenses affecting the technology.',
  'ownership-other': 'Document the ownership structure and identify every person or entity whose consent, assignment, license, waiver, or approval may be required for development, financing, licensing, or a sale of the technology.'
};

function injectOwnershipQuestion() {
  const root = document.querySelector('#root');
  if (!root) return;
  const headings = [...root.querySelectorAll('h1')];
  const orgHeading = headings.find(h => h.textContent.trim() === 'Tell us about your organization');
  if (!orgHeading || document.querySelector('[data-ownership-question]')) return;

  // The React questionnaire advances immediately after a choice. This helper stores
  // an ownership answer as a separate legal diligence input without interfering with
  // the existing React answer state or navigation.
  const question = document.createElement('section');
  question.dataset.ownershipQuestion = 'true';
  question.className = 'ownership-question-panel';
  question.innerHTML = `
    <span class="eyebrow">Ownership & chain of title</span>
    <h2>Who owns the technology?</h2>
    <p>Identify who currently owns or controls the intellectual property that will be developed, licensed, financed, or commercialized. Ownership can affect whether the organization has authority to enter a transaction and what third-party approvals may be required.</p>
    <div class="ownership-options">
      ${ownershipOptions.map(([label,value]) => `<button type="button" class="ownership-option" data-value="${value}">${label}</button>`).join('')}
    </div>
    <div class="ownership-other-wrap" hidden>
      <label><strong>Please describe the ownership arrangement</strong><input type="text" class="ownership-other-input" placeholder="e.g., owned through a joint venture or subject to an option agreement" /></label>
    </div>
    <div class="ownership-legal-note" hidden></div>
  `;
  const parent = orgHeading.closest('.question');
  if (!parent) return;
  parent.appendChild(question);

  const saved = sessionStorage.getItem('healthtech-ownership') || '';
  const savedOther = sessionStorage.getItem('healthtech-ownership-other') || '';
  const note = question.querySelector('.ownership-legal-note');
  const otherWrap = question.querySelector('.ownership-other-wrap');
  const otherInput = question.querySelector('.ownership-other-input');
  otherInput.value = savedOther;

  function select(value) {
    sessionStorage.setItem('healthtech-ownership', value);
    question.querySelectorAll('.ownership-option').forEach(btn => btn.classList.toggle('selected', btn.dataset.value === value));
    otherWrap.hidden = value !== 'ownership-other';
    note.hidden = false;
    note.innerHTML = `<strong>Legal consideration:</strong> ${ownershipLegalNotes[value] || ''}`;
  }
  question.querySelectorAll('.ownership-option').forEach(btn => btn.addEventListener('click', () => select(btn.dataset.value)));
  otherInput.addEventListener('input', () => sessionStorage.setItem('healthtech-ownership-other', otherInput.value.trim()));
  if (saved) select(saved);
}

const observer = new MutationObserver(injectOwnershipQuestion);
observer.observe(document.documentElement, {subtree:true, childList:true});
injectOwnershipQuestion();
