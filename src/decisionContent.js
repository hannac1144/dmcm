const decisionContent = {
  funding: {
    eyebrow: 'Decision 01',
    title: 'How should you fund and develop the program?',
    intro: 'The right path depends on the capital and capabilities you need, the development risk you are willing to retain, and the rights or economics you are prepared to share.',
    options: [
      {
        name: 'Non-dilutive funding',
        fit: ['research','rd','clinical','discovery','preclinical-funding','university'],
        pros: [
          'Preserves founder, institutional, and existing investor ownership because no new equity is issued',
          'Can fund high-risk research, validation, preclinical, clinical, or translational work before private investors are ready to participate',
          'Generally allows the company or institution to retain more control over development strategy and future partnering decisions',
          'Can strengthen later fundraising by generating technical, clinical, or regulatory evidence without immediate dilution',
          'May provide external validation and access to government, academic, or research networks that support later development'
        ],
        cons: [
          'Applications can be highly competitive and the review-to-award process may not match an urgent financing timeline',
          'Funding is often restricted to defined budgets, work plans, milestones, eligible costs, or reporting requirements',
          'Award amounts may be insufficient to finance an entire clinical, manufacturing, regulatory, or commercialization program',
          'Programs may impose eligibility, domestic-performance, intellectual-property, publication, audit, or compliance obligations',
          'Follow-on funding is not guaranteed, which can create a financing gap when the funded project or award period ends'
        ],
        consider: 'Consider whether your timeline, eligibility, development plan, permitted use of funds, compliance burden, and follow-on capital needs fit grants or other non-dilutive programs.'
      },
      {
        name: 'Equity investment',
        fit: ['startup','rd','scale','funding','preclinical-funding','trial-funding'],
        pros: [
          'Can provide substantial flexible capital without licensing away the underlying program or technology',
          'Capital can often support multiple workstreams, including hiring, clinical development, manufacturing, regulatory work, and commercialization',
          'Experienced healthcare and life-sciences investors may contribute strategic guidance, industry relationships, recruiting support, and follow-on financing access',
          'A successful financing can extend runway through a major value-creating milestone and improve negotiating leverage with future partners',
          'Equity financing does not ordinarily require scheduled principal repayment like conventional debt'
        ],
        cons: [
          'Dilutes founders, employees, universities, and existing shareholders and may reduce their share of future economic upside',
          'Investors may request board seats, protective provisions, information rights, consent rights, or influence over major strategic decisions',
          'Preferred-stock economics can affect how acquisition or liquidation proceeds are distributed among stakeholders',
          'Fundraising can consume significant management time and may require extensive diligence, valuation negotiations, and transaction documentation',
          'Future financing rounds can create additional dilution and may be more difficult if milestones are missed or valuation expectations decline'
        ],
        consider: 'Consider the amount required to reach the next value-creating milestone, expected dilution, valuation, liquidation preferences, governance rights, follow-on financing needs, and the investor expertise that would be most useful.'
      },
      {
        name: 'Strategic partnership / co-development',
        fit: ['partner','expertise','clinical','regulatory','scale','partner-drug','cmc','regulatory-commercial'],
        pros: [
          'Can add technical, clinical, regulatory, manufacturing, market-access, or commercialization capabilities that would be expensive or slow to build internally',
          'Allows development costs and execution risk to be shared between organizations',
          'May provide upfront cash, research funding, development reimbursements, equity investment, milestones, royalties, or combinations of these economics',
          'An established partner may accelerate trials, regulatory work, manufacturing scale-up, distribution, or entry into additional territories',
          'External validation from a credible strategic partner can increase the program’s visibility and may support future financing or business-development discussions'
        ],
        cons: [
          'Requires sharing control, decision-making authority, rights, data, intellectual property, or future economics to the extent negotiated',
          'Partner priorities can change because of portfolio reviews, leadership changes, competing programs, budget decisions, or corporate transactions',
          'Negotiating governance, development plans, cost sharing, exclusivity, diligence obligations, milestones, and commercialization rights can be complex and time-consuming',
          'Disagreements about development strategy, budgets, clinical design, manufacturing, regulatory positioning, or commercialization can delay execution',
          'Broad exclusivity or restrictive rights can limit future partnering, financing, indication expansion, territorial deals, or change-of-control flexibility'
        ],
        consider: 'Consider which capabilities you cannot efficiently build yourself and carefully define decision rights, development responsibilities, budgets, exclusivity, economics, diligence obligations, retained rights, termination consequences, and change-of-control treatment.'
      },
      {
        name: 'Self-development',
        fit: ['control','value','commercial','approved'],
        pros: [
          'Preserves maximum control over development strategy, sequencing, clinical or product priorities, and commercialization decisions',
          'Keeps a larger share of future licensing, product, acquisition, and commercialization economics in-house if the program succeeds',
          'Allows the organization to choose vendors, advisors, manufacturers, investigators, and commercial partners without a co-development partner’s approval rights',
          'Can build durable internal scientific, regulatory, manufacturing, product, and commercial capabilities that support additional programs',
          'Successful internal development may create stronger leverage in a later licensing, financing, collaboration, or acquisition transaction'
        ],
        cons: [
          'Requires substantial capital and may demand repeated financing rounds before the program generates meaningful revenue',
          'The organization bears a larger share of scientific, clinical, regulatory, manufacturing, commercial, and execution risk',
          'Building specialized internal capabilities can be slower and more expensive than accessing an experienced partner’s existing infrastructure',
          'Management must coordinate more vendors, employees, regulatory obligations, quality systems, budgets, and development workstreams directly',
          'Funding constraints or execution delays can reduce runway and force a financing or partnership from a weaker negotiating position'
        ],
        consider: 'Consider whether you have sufficient runway, talent, infrastructure, regulatory and manufacturing capabilities, management bandwidth, and access to follow-on capital to reach the next major milestone independently.'
      }
    ]
  },
  license: {
    eyebrow: 'Decision 02',
    title: 'What type of license should you consider?',
    intro: 'License structure determines who can develop, use, manufacture, or commercialize the asset—and where and for what purposes.',
    options: [
      {
        name: 'Non-exclusive license',
        fit: ['control','speed','digital','diagnostic','platform'],
        pros: [
          'Preserves the ability to grant similar rights to additional licensees, which can create multiple revenue streams and reduce dependence on a single commercial partner',
          'Can support broader adoption by allowing different licensees to serve separate customer groups, distribution channels, healthcare settings, applications, or geographic markets',
          'Allows the licensor to retain greater strategic flexibility if one licensee underperforms, changes priorities, or does not pursue every available market opportunity',
          'May be particularly useful for platform technologies, software, diagnostics, research tools, or enabling technologies that can support multiple products or commercial applications',
          'Can preserve future partnering opportunities because granting rights to one licensee does not necessarily prevent transactions with other qualified parties'
        ],
        cons: [
          'A licensee may be less willing to make substantial development, regulatory, manufacturing, or commercialization investments when competitors can obtain similar rights',
          'Potential partners may assign a lower economic value to the license because they do not receive exclusive protection against other licensees using the same intellectual property',
          'Multiple licensees can create additional administrative complexity involving reporting, royalties, sublicensing, compliance, quality standards, enforcement, and overlapping commercial activities',
          'The licensor may need carefully defined fields, channels, data rights, branding rules, technical support obligations, and confidentiality protections to manage multiple commercial relationships',
          'Competition among licensees can create pricing pressure or inconsistent market positioning that may affect the perceived value of the underlying technology or product'
        ],
        consider: 'Consider whether multiple licensees can realistically serve different customers, channels, applications, indications, or territories without undermining development incentives, pricing, quality, or the long-term value of the asset.'
      },
      {
        name: 'Exclusive license',
        fit: ['value','startup','device','biologic','small-molecule','cell-gene','phase-2','phase-3'],
        pros: [
          'Can give a licensee stronger incentives to invest significant capital and organizational resources in clinical development, regulatory approval, manufacturing scale-up, market access, and commercialization',
          'Provides meaningful competitive protection within the licensed scope because the licensor agrees not to grant the same rights to competing licensees',
          'May support larger upfront payments, development funding, milestone payments, royalties, equity investments, or other economics when exclusivity materially increases the value of the opportunity',
          'Can simplify development and commercialization by concentrating responsibility with one partner rather than coordinating overlapping activities across multiple licensees',
          'May be attractive for drugs, biologics, cell and gene therapies, medical devices, or other products requiring substantial investment before meaningful commercial revenue is generated'
        ],
        cons: [
          'Restricts the licensor’s ability to grant the same rights to another party even if the exclusive licensee later develops slowly, changes strategy, or underinvests in the program',
          'Broad exclusivity can surrender valuable future opportunities across additional indications, formulations, applications, territories, customer groups, or commercialization channels',
          'The licensor can become economically dependent on a single partner’s development performance, financing capacity, regulatory strategy, commercial execution, and internal prioritization decisions',
          'Exclusive arrangements require carefully negotiated diligence obligations, development milestones, minimum investment or performance expectations, termination rights, and potential reversion of rights',
          'Exclusivity may complicate future financings, collaborations, acquisitions, or change-of-control transactions if the licensed rights cover a strategically important portion of the company’s technology or pipeline'
        ],
        consider: 'Consider limiting exclusivity to the rights the partner actually needs and tying continued exclusivity to measurable development, regulatory, financing, manufacturing, or commercialization obligations so valuable rights are not indefinitely tied up without performance.'
      },
      {
        name: 'Field-of-use, indication, or territory-limited license',
        fit: ['control','value','commercial','phase-1','phase-2','approved'],
        pros: [
          'Can provide a partner meaningful exclusivity within a defined market while allowing the licensor to retain valuable rights for other indications, applications, products, patient populations, territories, or commercial channels',
          'Allows different partners with specialized capabilities to develop the same underlying technology or intellectual property for different therapeutic areas, geographic markets, customer groups, or use cases',
          'Can increase total asset value by creating multiple partnering opportunities instead of transferring every commercial opportunity to a single licensee in one transaction',
          'Enables the licensor to match rights with partner strengths—for example, granting one company rights in a particular therapeutic indication while retaining other indications for internal development or separate partnerships',
          'Can preserve strategic flexibility for future financing, licensing, co-development, geographic expansion, or commercialization transactions involving retained portions of the asset'
        ],
        cons: [
          'Requires precise drafting of the licensed field, indication, territory, product definition, patient population, channel, formulation, combination use, and other boundaries that determine which party controls each opportunity',
          'Overlapping technologies or evolving clinical uses can create disputes about whether a new product, indication, formulation, customer, or commercial opportunity falls inside or outside the licensed scope',
          'Dividing rights among multiple partners can complicate development coordination, regulatory strategy, manufacturing, pharmacovigilance, data sharing, intellectual-property enforcement, and global commercialization',
          'A narrowly defined license may be less attractive to a partner if the retained rights permit another company to compete closely with the licensee’s product or commercial strategy',
          'Future scientific discoveries, label expansions, combination products, platform improvements, or changes in clinical practice can blur boundaries that appeared clear when the agreement was originally negotiated'
        ],
        consider: 'For therapeutics, define indications, formulations, combinations, patient populations, territories, development responsibilities, regulatory rights, and retained uses. For technology, define products, customers, applications, channels, territories, data rights, improvements, and how new or overlapping uses will be allocated.'
      }
    ]
  },
  terms: {
    eyebrow: 'Decision 03',
    title: 'Which contractual terms deserve your attention?',
    intro: 'Focus negotiations on the provisions most connected to your stage, risks, and priorities.',
    options: [
      {name:'Development milestones & diligence',fit:['clinical','regulatory','prototype','speed','discovery','ind-enabling','phase-1','phase-2','phase-3','approved'],pros:['Creates measurable expectations','Can protect against a program being shelved'],cons:['Milestones can become burdensome or unrealistic','Failure may trigger loss of rights'],consider:'Consider clinical, regulatory, manufacturing, validation, product, and commercialization milestones as applicable.'},
      {name:'Economics: payments, milestones & royalties',fit:['funding','value','commercial','preclinical-funding','trial-funding','approved'],pros:['Aligns financial returns with development and commercialization','Can balance upfront and downstream value'],cons:['Complex structures can be difficult to administer','Higher payments can affect development incentives'],consider:'Consider upfront fees, milestones, royalties, minimums, payment triggers, and audit rights together.'},
      {name:'IP, improvements & sublicensing',fit:['control','expertise','university','startup','biologic','small-molecule','cell-gene'],pros:['Clarifies ownership and future rights','Reduces uncertainty as the asset evolves'],cons:['Improvement rights can be technically complex','Sublicensing can change who develops or commercializes'],consider:'Define background IP, improvements, patent rights, ownership, prosecution responsibilities, use rights, and sublicensing.'},
      {name:'Termination, reversion & rights after termination',fit:['control','value','speed','phase-1','phase-2','phase-3'],pros:['Provides an exit if obligations are not met','Can return rights for future development'],cons:['Termination can disrupt ongoing development','Post-termination obligations need careful treatment'],consider:'Consider cure periods, milestone failures, insolvency, transition obligations, ongoing trials, and treatment of rights after termination.'}
    ]
  }
};

export default decisionContent;
