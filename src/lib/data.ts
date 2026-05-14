// ─── Navigation ───
export const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Toolkit", href: "#toolkit" },
  { label: "Impact", href: "#impact" },
  { label: "Beyond Work", href: "#beyond" },
  { label: "Contact", href: "#contact" },
] as const;

// ─── Hero Stats ───
export interface Stat {
  display: string;
  label: string;
  numericValue: number;
  prefix?: string;
  suffix?: string;
}

export const STATS: Stat[] = [
  { display: "10+", label: "Years in Tax Tech", numericValue: 10, suffix: "+" },
  {
    display: "$330K+",
    label: "Tax Recovered via Automation",
    numericValue: 330,
    prefix: "$",
    suffix: "K+",
  },
  {
    display: "2,000+",
    label: "Categories Maintained",
    numericValue: 2000,
    suffix: "+",
  },
  { display: "60+", label: "Docs \u2192 1 AI Agent", numericValue: 60, suffix: "+" },
  {
    display: "$1M+",
    label: "Community Refunds (VITA)",
    numericValue: 1,
    prefix: "$",
    suffix: "M+",
  },
];

// ─── Experience / Timeline ───
export interface Experience {
  infusionNumber: number;
  infusionTitle: string;
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
  tags: string[];
}

export const EXPERIENCE: Experience[] = [
  {
    infusionNumber: 6,
    infusionTitle: "The Deepest Brew",
    title: "Senior Lead Tax Solutions Analyst",
    company: "Vertex Inc.",
    period: "July 2019 \u2013 Present",
    location: "King of Prussia, PA (Remote)",
    description:
      "This is where everything converges \u2014 accounting knowledge, data science, automation craft, and AI vision.",
    highlights: [
      "Architected Alteryx workflows for XML test creation, reconciliations, and AI data provisioning",
      "Built Power BI dashboards for content management, issue tracking, and strategic planning",
      "Developed Power Automate workflows to streamline data ingestion and reduce manual input",
      "Web scraped government PDFs with Python to reconcile internal rules and monitor regulatory changes",
      "Led cross-functional teams across Leasing, Food, Lodging, Manufacturing, Environmental Fees, Returns",
      "Audited and maintained 2,000+ taxability categories and exemption certificate content (US & Canada)",
      "Collaborated with international teams to document workflows and release solutions",
      "Delivered curated insights and impact measurement for executive reviews and business rhythms",
    ],
    tags: [
      "Alteryx",
      "Python",
      "SQL",
      "Power BI",
      "Power Automate",
      "Copilot Studio",
      "Jira",
      "AI Agents",
    ],
  },
  {
    infusionNumber: 5,
    infusionTitle: "The First Automation",
    title: "Tax Technology Analyst",
    company: "DLL, De Lage Landen Financial Services",
    period: "December 2016 \u2013 June 2019",
    location: "Wayne, PA",
    description:
      "This is where Mervyn discovered the power of building systems, not just using them.",
    highlights: [
      "Led automated solution using Vertex\u2019s Batch Client Interface to reverse $330,000+ in erroneous tax",
      "Supported 20+ UAT events with script creation and tax department collaboration",
      "Partnered with Finance and IT to plan, test, and deploy solutions to production",
      "Mentored and cross-trained incoming team members and project teams",
    ],
    tags: ["Vertex O Series", "Batch Automation", "UAT", "Mentoring"],
  },
  {
    infusionNumber: 4,
    infusionTitle: "Growing Roots",
    title: "Sales Tax Accountant",
    company: "DLL, De Lage Landen Financial Services",
    period: "March 2015 \u2013 May 2016",
    location: "Greater Philadelphia Area",
    description:
      "Deepening tax knowledge, seeing the full lifecycle of sales tax operations.",
    highlights: [
      "Managed sales tax compliance and reporting processes",
      "Developed deeper understanding of indirect tax workflows and regulations",
    ],
    tags: ["Sales Tax", "Compliance", "Reporting"],
  },
  {
    infusionNumber: 3,
    infusionTitle: "The Entry Point",
    title: "Tax Administrator",
    company: "DLL (via Randstad)",
    period: "December 2014 \u2013 March 2015",
    location: "Greater Philadelphia Area",
    description: "Contract role that opened the door to a career in tax technology.",
    highlights: [
      "Administered tax operations for a global financial services company",
      "Gained foundational exposure to enterprise tax systems and processes",
    ],
    tags: ["Tax Administration", "Financial Services"],
  },
  {
    infusionNumber: 2,
    infusionTitle: "The Global Lens",
    title: "Staff Accountant",
    company: "Citco Fund Services",
    period: "September 2014 \u2013 October 2014",
    location: "Malvern, PA",
    description:
      "Exposure to worldwide hedge funds under GAAP and IFRS. Monthly financial highlights, share rolls, and regulatory reporting.",
    highlights: [
      "Exposed to worldwide hedge funds following GAAP and IFRS accounting practices",
      "Completed monthly financial highlights and share roll for multiple funds",
      "Worked on monthly regulatory reporting Private Fund Forms for domestic and offshore funds",
      "Analyzed raw data within Excel and manipulated data into core financial statements",
    ],
    tags: ["GAAP", "IFRS", "Hedge Funds", "Financial Reporting"],
  },
  {
    infusionNumber: 1,
    infusionTitle: "The First Leaves",
    title: "Student Manager \u00b7 Director of Tea House Operations \u00b7 VITA Tax Preparer",
    company: "Penn State University",
    period: "2010 \u2013 2014",
    location: "University Park, PA",
    description:
      "Where it all began \u2014 managing dining for 2,000 guests, directing tea house operations, and preparing taxes for the community.",
    highlights: [
      "Managed dining operations for up to 2,000 guests at Findlay Dining Commons",
      "Directed Tea House Operations \u2014 redesigned accounting system, built inventory tracking, grew Gong Fu Cha Club",
      "VITA Tax Preparer: contributed $1,001,189 in federal, state, and local refunds to the local community",
      "IRS VITA/TCE certified in advanced, basic, and ethical conduct",
      "Trained student employees and coordinated with senior managers across hospitality operations",
    ],
    tags: [
      "Leadership",
      "Gong Fu Cha",
      "VITA",
      "Accounting",
      "Hospitality",
    ],
  },
];

// ─── Projects ───
export interface Project {
  title: string;
  emoji: string;
  problem: string;
  approach: string;
  impact: string;
  stack: string[];
  category: string;
  pdfUrl?: string;
  link?: string;
  caseStudyUrl?: string;
}

export const PROJECTS: Project[] = [
  {
    title: "AI-Enabled Content Testing Automation",
    emoji: "\uD83E\uDD16",
    problem:
      "Tax Research content testing relied on manual test data creation and validation. Testers identified rules from spreadsheets, interpreted rule features individually, and manually entered data into Vertex O Series. This approach created high dependency on individual SMEs, limited scalability, inconsistent execution, and resulted in as little as ~1% of content being tested.",
    approach:
      "Designed AI-assisted automation to generate and validate test transactions at scale. Migrated legacy, manual workflows into standardized tooling using Alteryx Designer, Copilot-assisted Python and SQL, and structured rule inputs. The solution analyzes rule features, applies special categories, and programmatically generates Vertex-ready XML based on configurable grouping strategies (Country, State, Jurisdiction, or Rule ID).",
    impact:
      "Reduced single-person dependency and transformed content testing from selective, manual validation into a scalable, coverage-driven model. Test coverage increased significantly beyond prior ~1% levels, enabling validation of hundreds of rules per execution, while saving approximately 40 hours per month in test design effort. The solution materially improved consistency, maintainability, and reduced both technology and operational risk.",
    stack: ["Alteryx Designer", "Python", "SQL", "Copilot"],
    category: "Automation · AI · Tax Research",
    link: "/projects/ai-content-testing",
    caseStudyUrl: "/case-study/ai-content-testing",
  },

  {
    title: "VVC International Compliance Test Case Automation",
    emoji: "\uD83C\uDF0D",
    problem:
      "International VAT compliance (VVC) requires scalable validation across multiple jurisdictions with frequent regulatory change.",
    approach:
      "Led automation of international compliance test case creation and verification. Designed scalable workflows across priority jurisdictions. Integrated AI-assisted logic and structured validation.",
    impact:
      "Reduced manual effort for international compliance validation. Enabled faster iteration and expansion of VVC coverage. Supported enterprise shift toward AI-led compliance.",
    stack: ["Alteryx", "Python", "SQL", "AI-Assisted Validation"],
    category: "International Compliance · Automation",
  },
  {
    title: "Power BI Dashboards for Tax Research Leadership",
    emoji: "\uD83D\uDCCA",
    problem:
      "Leadership lacked consolidated visibility into automation adoption, workflow health, productivity gains, and modernization progress.",
    approach:
      "Designed and maintained Power BI dashboards providing operational and executive-level visibility. Tracked automation coverage, productivity improvements, and portfolio progress. Includes the Executive Summary Scorecard tracking delivery metrics, financial impact, and ROI.",
    impact:
      "Improved prioritization and decision-making. Established shared, data-driven understanding. Created transparency across tools, projects, and teams.",
    stack: ["Power BI", "Power Query", "Alteryx", "SharePoint"],
    category: "BI \u00b7 Executive Reporting",
  },
  {
    title: "Copilot & AI Agent Enablement",
    emoji: "\uD83E\uDDE0",
    problem:
      "Tax Research teams spent excessive time on repetitive document searching and jurisdictional lookups across 60+ documents.",
    approach:
      "Developed an AI agent consolidating jurisdictional contact information into a single queryable experience. Advocated for human-in-the-loop design for accuracy and governance.",
    impact:
      "Significantly reduced time on repetitive research. Improved consistency and accessibility of institutional knowledge. Accelerated AI adoption across Tax Research teams.",
    stack: ["Copilot Studio", "Power Automate", "SharePoint", "Microsoft 365"],
    category: "AI Agents \u00b7 Knowledge Management",
  },
  {
    title: "Jira Jurisdiction Data Transformation for Power BI",
    emoji: "\uD83D\uDCC8",
    problem:
      "Tax Research Directors needed visibility into jurisdiction maintenance activity tracked in Jira, but raw data was unstructured and not analytics-ready.",
    approach:
      "Built an Alteryx workflow to transform Jira data, enrich it with jurisdiction metadata, and deliver to Power BI for interactive reporting. Fully documented with workflow standards.",
    impact:
      "Delivered metrics dashboard to Tax Research Directors. Enabled data-driven jurisdiction maintenance decisions.",
    stack: ["Alteryx Designer", "Jira API", "Power BI", "Python"],
    category: "Data Engineering \u00b7 Reporting",
  },
  {
    title: "$330K Tax Reversal Automation",
    emoji: "\uD83D\uDCB0",
    problem:
      "DLL had accumulated $330,000+ in incorrect tax assessments due to systematic posting errors. Manual review and reversal were time-intensive, error-prone, and not scalable, creating ongoing financial leakage and audit risk.",
    approach:
      "Designed and led an automated tax reversal solution using Vertex O Series Batch Client Interface. Programmatically identified invalid tax entries across historical transactions. Executed bulk reversals with validation controls to ensure accuracy and auditability.",
    impact:
      "Recovered $330,000+ in erroneous tax charges. Reduced manual intervention and cycle time for tax corrections. Influenced future tax automation initiatives leveraging Vertex Batch Client Interface (BCI) and Alteryx. Demonstrated the strategic value of tax automation to leadership and stakeholders.",
    stack: ["Vertex O Series", "Batch Client Interface", "Tax Automation"],
    category: "Tax Automation · Financial Recovery · Process Engineering",
    pdfUrl: "/Case_Study_330K_Tax_Reversal.pdf",
    caseStudyUrl: "/case-study/330k-tax-reversal",
  },
];

// ─── Toolkit (v2: Python 3, SQL 3, Power Query 3, +Qlik, +Tableau) ───
export interface Tool {
  name: string;
  proficiency: number;
  context: string;
}

export interface ToolCategory {
  label: string;
  emoji: string;
  tools: Tool[];
}

export const TOOLKIT: ToolCategory[] = [
  {
    label: "Automation & Data Engineering",
    emoji: "\u2699\uFE0F",
    tools: [
      {
        name: "Alteryx Designer",
        proficiency: 5,
        context: "Primary workflow engine \u2014 XML automation, reconciliations, data provisioning",
      },
      {
        name: "Python",
        proficiency: 3,
        context: "Web scraping, data extraction, Copilot-assisted scripting",
      },
      {
        name: "SQL",
        proficiency: 3,
        context: "Data querying, transformation, validation",
      },
      {
        name: "Power Automate",
        proficiency: 4,
        context: "Data ingestion workflows, notifications, SharePoint integration",
      },
    ],
  },
  {
    label: "BI & Reporting",
    emoji: "\uD83D\uDCCA",
    tools: [
      {
        name: "Power BI",
        proficiency: 5,
        context: "Executive dashboards, automation scorecards, jurisdiction tracking",
      },
      {
        name: "Power Query",
        proficiency: 3,
        context: "Data transformation layer within Power BI",
      },
      {
        name: "Qlik",
        proficiency: 3,
        context: "Data visualization and interactive analytics",
      },
      {
        name: "Tableau",
        proficiency: 3,
        context: "Visual analytics and dashboard design",
      },
    ],
  },
  {
    label: "AI & Enablement",
    emoji: "\uD83E\uDD16",
    tools: [
      {
        name: "Microsoft Copilot",
        proficiency: 4,
        context: "Daily productivity, code assistance, research",
      },
      {
        name: "Copilot Studio",
        proficiency: 4,
        context: "Agent design \u2014 jurisdictional lookup, research archive",
      },
    ],
  },
  {
    label: "Collaboration & Project Management",
    emoji: "\uD83E\uDD1D",
    tools: [
      {
        name: "Jira",
        proficiency: 5,
        context: "Agile Coach, sprint management, intake tracking",
      },
      {
        name: "SharePoint",
        proficiency: 4,
        context: "Document management, data source",
      },
      {
        name: "Microsoft 365",
        proficiency: 5,
        context: "Full suite integration",
      },
    ],
  },
];

// ─── Certifications ───
export interface Certification {
  name: string;
  issuer: string;
  year?: string;
}

export const CERTIFICATIONS: Certification[] = [
  { name: "Project Management Professional (PMP)", issuer: "PMI", year: "2022" },
  { name: "Lean Six Sigma Black Belt", issuer: "\u2014", year: "2023" },
  { name: "Alteryx Designer Advanced Certification", issuer: "Alteryx", year: "2020" },
  {
    name: "Vertex Certified Indirect Tax O Series 9.x Functional Implementer",
    issuer: "Vertex",
  },
  {
    name: "Machine Learning with Python: Foundations",
    issuer: "LinkedIn Learning",
  },
  {
    name: "Corporate Control & Financial Management Certificate",
    issuer: "\u2014",
  },
  { name: "Becoming an Agile Coach", issuer: "\u2014" },
];

// ─── Education ───
export interface Education {
  degree: string;
  institution: string;
  year: string;
  detail?: string;
}

export const EDUCATION: Education[] = [
  {
    degree: "Master\u2019s in Data Science",
    institution: "Eastern University, St. David\u2019s, PA",
    year: "2022",
  },
  {
    degree: "Certificate in Sustainability Leadership",
    institution: "Thomas Jefferson University, Philadelphia",
    year: "2020",
  },
  {
    degree: "B.S. in Accounting",
    institution: "Penn State University, University Park",
    year: "2014",
    detail: "Minor in Information Science & Technology",
  },
];

// ─── Beyond Work (v2: no Languages, +Tang Soo Do, +Reading, +RPG, +Natural Building) ───
export interface BeyondItem {
  emoji: string;
  title: string;
  body: string;
}

export const BEYOND_WORK: BeyondItem[] = [
  {
    emoji: "\uD83D\uDC68\u200D\uD83D\uDC66\u200D\uD83D\uDC66",
    title: "Father First",
    body: "\u201CProud Father First\u201D \u2014 that\u2019s the first line on my LinkedIn, and it\u2019s intentional. I have three boys under six, and everything I build, every skill I develop, every late night learning a new tool \u2014 it\u2019s for them. The discipline I bring to my work comes from the same place as the patience I bring to raising three young boys who never stop moving.",
  },
  {
    emoji: "\uD83C\uDF75",
    title: "The Tea Practice",
    body: "In college, I didn\u2019t just drink tea \u2014 I ran the tea house. As Director of Tea House Operations at Penn State\u2019s Gong Fu Cha Club, I redesigned their accounting system, tracked inventory, and grew the community. Gong Fu Cha taught me that the best results come from patience, precision, and paying attention to what most people overlook. That lesson shows up in every workflow I build.",
  },
  {
    emoji: "\u267B\uFE0F",
    title: "Sustainability & Natural Building",
    body: "I earned a Certificate in Sustainability Leadership from Thomas Jefferson University because I believe the systems we build should serve the long term \u2014 not just the next quarter. I\u2019m also drawn to natural building \u2014 earthen construction, cob, timber frame \u2014 the idea that you can build something lasting and beautiful with what the earth provides. Sustainability isn\u2019t just environmental for me; it\u2019s about building processes, homes, teams, and tools that endure.",
  },
  {
    emoji: "\uD83C\uDF3B",
    title: "The Garden",
    body: "When I\u2019m not at a keyboard, I\u2019m probably in the garden. There\u2019s something about working with your hands, watching something grow from nothing, that resets the mind. It\u2019s the same satisfaction as watching a dashboard populate with clean data for the first time.",
  },
  {
    emoji: "\uD83D\uDCD6",
    title: "The Reader",
    body: "I\u2019m always working through a book. Right now it\u2019s the Dungeon Crawler Carl series \u2014 a wild ride through a sci-fi litRPG apocalypse that somehow makes you think about systems, strategy, and survival. I gravitate toward stories that blend world-building with problem-solving, which probably says a lot about how I approach my day job.",
  },
  {
    emoji: "\uD83C\uDFAE",
    title: "The RPG Mindset",
    body: "I love RPG video games \u2014 the progression systems, the skill trees, the sense of building something over time. That mindset bleeds into how I work. I gamify my learning, track my progress like XP, and treat every new tool or certification like a skill unlock. It keeps things fun and keeps me moving forward.",
  },
  {
    emoji: "\uD83E\uDD4B",
    title: "Movement & Game Day",
    body: "I\u2019m an active Tang Soo Do practitioner \u2014 it keeps me sharp, helps me age gracefully, and gives me something to share with my boys as they grow. Beyond the dojang, you\u2019ll find me locked into basketball and football. Competition and discipline go hand in hand.",
  },
];

// ─── Three Cups (Hero) — v2: updated Human subtitle ───
export const THREE_CUPS = [
  {
    emoji: "\uD83E\uDDD1\u200D\uD83D\uDCBC",
    title: "The Analyst",
    subtitle: "10+ years in tax technology",
    detail:
      "From reversing $330K in erroneous tax to architecting AI-enabled compliance",
  },
  {
    emoji: "\uD83E\uDD16",
    title: "The Builder",
    subtitle: "Alteryx \u00b7 Python \u00b7 Power BI \u00b7 AI Agents",
    detail:
      "Turning legacy processes into governed, repeatable automation",
  },
  {
    emoji: "\uD83C\uDF75",
    title: "The Human",
    subtitle: "Father of Three \u00b7 Tea Lover \u00b7 Gardener \u00b7 Nittany Lion",
    detail: "\u201CAlways happy to answer questions\u201D",
  },
] as const;
