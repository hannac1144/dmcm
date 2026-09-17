const LEGAL_INTRO_ID = 'legal-pathway-intro';

function addLegalPathwayIntro() {
  const heroCopy = document.querySelector('.hero-copy');
  if (!heroCopy || document.getElementById(LEGAL_INTRO_ID)) return;

  const pathwayChoices = heroCopy.querySelector('.pathway-choice');
  if (!pathwayChoices) return;

  const section = document.createElement('section');
  section.id = LEGAL_INTRO_ID;
  section.className = 'legal-pathway-intro';
  section.setAttribute('aria-labelledby', 'legal-pathway-intro-title');
  section.innerHTML = `
    <h2 id="legal-pathway-intro-title">Choosing a Legal Pathway for Health-Care Technology Development</h2>
    <p>Health-care technology and life-sciences companies have several ways to develop, finance, license, and commercialize intellectual property. This tool helps companies compare independent development, licensing, co-development and strategic partnerships, and assignment or acquisition based on factors including intellectual-property ownership, control, funding needs, regulatory responsibilities, commercialization capabilities, deal economics, and risk allocation.</p>
  `;

  heroCopy.insertBefore(section, pathwayChoices);
}

const style = document.createElement('style');
style.textContent = `
  .legal-pathway-intro {
    margin: 28px 0 30px;
    padding: 22px 24px;
    border: 1px solid #d7ded8;
    border-radius: 16px;
    background: rgba(255,255,255,.72);
    text-align: left;
  }
  .legal-pathway-intro h2 {
    margin: 0 0 10px;
    color: #183d30;
    font-size: clamp(1.15rem, 2vw, 1.45rem);
    line-height: 1.3;
  }
  .legal-pathway-intro p {
    margin: 0;
    color: #536159;
    line-height: 1.65;
  }
  html[dir="rtl"] .legal-pathway-intro { text-align: right; }
`;
document.head.appendChild(style);

addLegalPathwayIntro();
new MutationObserver(addLegalPathwayIntro).observe(document.getElementById('root'), { childList: true, subtree: true });
