// lib/research-data.ts
// ── Jurisdiction Activity Levels ─────────────────────────
export type ActivityLevel = "hottest" | "high" | "standard";

export interface JurisdictionData {
  abbr: string;
  name: string;
  level: ActivityLevel;
  tooltipLines?: string[];
  note: string;
}

export const US_JURISDICTIONS: JurisdictionData[] = [
  
  {
    abbr: "AL",
    name: "Alabama",
    level: "high",
    note: "Manufacturing, filing codes, leasing, and reconciliation work",
    tooltipLines: [
      "Manufacturing & farm tax rule development",
      "Filing code design for auto, farming, food, and medical categories",
      "Leasing and local tax issue resolution",
      "Monthly reconciliation & Alteryx automation tooling",
    ],
  },
  { abbr: "AK", name: "Alaska", level: "standard", note: "Municipal tax structures and exemptions" },

  {
    abbr: "AZ",
    name: "Arizona",
    level: "high",
    note: "Local tax staging and Native American exemption research",
    tooltipLines: [
      "Native American exemption and reason code research",
      "Tucson and local jurisdiction tax staging",
      "Heavy equipment and property tax analysis",
      "County + reservation rule validation",
    ],
  },

  { abbr: "AR", name: "Arkansas", level: "standard", note: "Exemption rules and ID card validation" },

  { abbr: "CA", name: "California", level: "hottest", note: "Streaming tax, credits, and major legislative tracking" },

  {
    abbr: "CO",
    name: "Colorado",
    level: "hottest",
    note: "Home-rule city research and exemption mapping",
    tooltipLines: [
      "15+ home-rule city tax rule validation",
      "State vs local exemption certificate mapping",
      "Municipality outreach for rule confirmation",
      "Local tax configuration + testing",
    ],
  },

  {
    abbr: "CT",
    name: "Connecticut",
    level: "high",
    note: "Certificate validation and taxability support",
    tooltipLines: [
      "Certificate format change (10 → 12 digits)",
      "Taxability rule validation and support",
      "Customer escalation investigation",
    ],
  },

  {
    abbr: "FL",
    name: "Florida",
    level: "high",
    note: "Lodging, tourism, and local tax rate research",
    tooltipLines: [
      "Walton County and Franklin County tourism taxes",
      "Transient accommodation tax research",
      "Defuniak Springs and Tampa tax issues",
      "Local rate validation and missing tax fixes",
    ],
  },

  { abbr: "GA", name: "Georgia", level: "standard", note: "Conformity and legislative tracking" },

  {
    abbr: "IL",
    name: "Illinois",
    level: "hottest",
    note: "Leasing law changes and accommodations tax",
    tooltipLines: [
      "Leasing tax law changes (2025)",
      "Accommodation and hospitality tax work",
      "Gross receipts handling and rule definition",
    ],
  },

  {
    abbr: "LA",
    name: "Louisiana",
    level: "hottest",
    note: "Remote seller and software tax analysis",
    tooltipLines: [
      "Remote seller rule interpretation",
      "Software taxability (§47:301)",
      "Local jurisdiction reporting complexity",
    ],
  },

  {
    abbr: "MO",
    name: "Missouri",
    level: "high",
    note: "Lodging, filing categories, and rate validation",
    tooltipLines: [
      "Lodging tax filing category gaps",
      "Wentzville and Liberty rate updates",
      "Local tax issue investigation",
    ],
  },

  {
    abbr: "NY",
    name: "New York",
    level: "high",
    note: "Digital products, occupancy, and franchise tax",
    tooltipLines: [
      "Digital goods taxability research",
      "Occupancy and lodging rules",
      "Franchise and special category taxes",
    ],
  },

  {
    abbr: "OH",
    name: "Ohio",
    level: "high",
    note: "Fuel tax and taxability matrix interpretation",
    tooltipLines: [
      "Excise vs sales tax clarification",
      "Taxability matrix troubleshooting",
      "Customer-facing documentation",
    ],
  },

  {
    abbr: "PA",
    name: "Pennsylvania",
    level: "high",
    note: "Property tax, returns, and HQ-state research",
    tooltipLines: [
      "Property tax and rebate analysis",
      "Philadelphia returns processing",
      "HQ state research and validation",
    ],
  },

  {
    abbr: "TN",
    name: "Tennessee",
    level: "high",
    note: "Lodging, occupancy, and lease tier taxation",
    tooltipLines: [
      "County lodging and occupancy taxes",
      "Lease tier tax structures",
      "Single article tax research",
      "Local jurisdiction issue resolution",
    ],
  },

  {
    abbr: "TX",
    name: "Texas",
    level: "high",
    note: "Remote seller rules and local tax complexity",
    tooltipLines: [
      "Remote seller tax line analysis",
      "Local jurisdiction coverage",
      "Category-level tax interpretation",
    ],
  },

  {
    abbr: "UT",
    name: "Utah",
    level: "high",
    note: "Hospitality tax and rule implementation",
    tooltipLines: [
      "CVMA hospitality tax implementation",
      "Qualifying condition design",
      "Rule deployment into production",
    ],
  },

  {
    abbr: "VA",
    name: "Virginia",
    level: "high",
    note: "Short-term rental and locality rules",
    tooltipLines: [
      "Short-term rental tax modeling",
      "Local jurisdiction research",
      "Template-driven rollout",
    ],
  },

  {
    abbr: "WA",
    name: "Washington",
    level: "hottest",
    note: "Recurring work across locals, categories, and filings",
    tooltipLines: [
      "Reason codes and filing category design",
      "Spirits and local utility taxes",
      "Frequent local jurisdiction support",
      "Waste removal tax research across 15+ locals",
    ],
  },

  // --- keep remaining states unchanged (no tooltipLines yet) ---




  { abbr:"DE", name:"Delaware",             level:"standard", note:"Hazardous substance cleanup tax" },
  { abbr:"HI", name:"Hawaii",               level:"high",     note:"GET research, 0.5% import/use tax, wholesale resale certs" },
  { abbr:"ID", name:"Idaho",                level:"standard", note:"Rate updates & nexus research" },
  { abbr:"IN", name:"Indiana",              level:"standard", note:"Cigarette/tobacco tax increases, amnesty programs" },
  { abbr:"IA", name:"Iowa",                 level:"standard", note:"Rate change tracking" },
  { abbr:"KS", name:"Kansas",               level:"standard", note:"Privilege tax research, IRC conformity" },
  { abbr:"KY", name:"Kentucky",             level:"high",     note:"DME taxability, braces/supports determination" },
  { abbr:"ME", name:"Maine",                level:"standard", note:"Sales tax exemption research" },
  { abbr:"MD", name:"Maryland",             level:"standard", note:"Digital advertising tax litigation monitoring" },
  { abbr:"MA", name:"Massachusetts",        level:"high",     note:"Discounts >50% rule, parking tax, promotional items" },
  { abbr:"MI", name:"Michigan",             level:"standard", note:"Corporate tax rate changes, fuel prepaid rates" },
  { abbr:"MN", name:"Minnesota",            level:"standard", note:"Cannabis tax, prepaid fuel rates, property tax changes" },
  { abbr:"MS", name:"Mississippi",          level:"standard", note:"Seller permit research, MTC certificate" },
  { abbr:"MT", name:"Montana",              level:"standard", note:"Local parallel testing, parent category determination fixes" },
  { abbr:"NE", name:"Nebraska",             level:"high",     note:"New district CJs, GLD testing, remote seller lines" },
  { abbr:"NV", name:"Nevada",               level:"standard", note:"Commerce tax & gaming tax research" },
  { abbr:"NH", name:"New Hampshire",        level:"standard", note:"No general sales tax – business tax research" },
  { abbr:"NJ", name:"New Jersey",           level:"high",     note:"ECM form resubmissions, convenience of employer rules" },
  { abbr:"NM", name:"New Mexico",           level:"standard", note:"GRT research, Easy Enrollment program" },
  { abbr:"NC", name:"North Carolina",       level:"standard", note:"Rate research & exemptions" },
  { abbr:"ND", name:"North Dakota",         level:"standard", note:"Rate change monitoring" },
  { abbr:"OK", name:"Oklahoma",             level:"standard", note:"Grocery exemption amendments" },
  { abbr:"OR", name:"Oregon",               level:"standard", note:"CAT research, cross-border situs" },
  { abbr:"RI", name:"Rhode Island",         level:"standard", note:"Rate monitoring" },
  { abbr:"SC", name:"South Carolina",       level:"standard", note:"Rate monitoring" },
  { abbr:"SD", name:"South Dakota",         level:"standard", note:"Wayfair nexus, rate monitoring" },
  { abbr:"VT", name:"Vermont",              level:"standard", note:"Taxability determinations" },
  { abbr:"WV", name:"West Virginia",        level:"standard", note:"District testing – Charles Point district situs" },
  { abbr:"WI", name:"Wisconsin",            level:"standard", note:"Rate updates & exemption research" },
  { abbr:"WY", name:"Wyoming",              level:"standard", note:"Rate updates & mineral tax" },
  { abbr:"DC", name:"District of Columbia",  level:"standard", note:"Federal nexus & rate monitoring" },
];

export const US_TERRITORIES: JurisdictionData[] = [
  { abbr:"PR", name:"Puerto Rico",           level:"hottest",  note:"4% reduced B2B SUT rate, Form AS 2916.1, special conditions" },
  { abbr:"GU", name:"Guam",                  level:"high",     note:"Activated 11 exemption reason codes for ECW/ECM mapping" },
  { abbr:"VI", name:"U.S. Virgin Islands",   level:"high",     note:"Exemption support activation (agricultural, govt, charitable)" },
  { abbr:"AS", name:"American Samoa",         level:"standard", note:"Exemption framework research" },
];

export const CA_JURISDICTIONS: JurisdictionData[] = [
  { abbr:"BC", name:"British Columbia",      level:"high",     note:"PST Native American exemptions, parallel testing, cert logic fix" },
  { abbr:"AB", name:"Alberta",               level:"standard", note:"No PST – GST-only research" },
  { abbr:"SK", name:"Saskatchewan",          level:"high",     note:"PST exemption research, reverse charge testing" },
  { abbr:"MB", name:"Manitoba",              level:"high",     note:"PST exemption cert, Native American tax research" },
  { abbr:"ON", name:"Ontario",               level:"high",     note:"HST provincial exemptions, Canada cert processing" },
  { abbr:"QC", name:"Quebec",                level:"high",     note:"QST reverse charge, PST research, cert troubleshooting" },
  { abbr:"NB", name:"New Brunswick",         level:"standard", note:"HST rate research" },
  { abbr:"NS", name:"Nova Scotia",           level:"standard", note:"HST research" },
  { abbr:"PE", name:"Prince Edward Island",  level:"standard", note:"HST monitoring" },
  { abbr:"NL", name:"Newfoundland and Labrador", level:"standard", note:"HST monitoring" },
  { abbr:"YT", name:"Yukon",                 level:"standard", note:"GST-only research" },
  { abbr:"NT", name:"Northwest Territories", level:"standard", note:"GST-only research" },
  { abbr:"NU", name:"Nunavut",               level:"standard", note:"GST-only research" },
];

// ── Resolution Stories ───────────────────────────────────
export interface ResolutionStory {
  id: number;
  industry: string;
  icon: string;
  jurisdictions: string[];
  issueSummary: string;
  whatIDid: string;
  outcome: string;
  year: string;
}

export const RESOLUTION_STORIES: ResolutionStory[] = [
  {
    id: 1,
    industry: "Global Technology",
    icon: "\uD83D\uDCBB",
    jurisdictions: ["PR", "HI"],
    issueSummary:
      "Customer expected a reduced 4% B2B tax rate in Puerto Rico for transactions with valid exemption certificates, but full exemption was being applied. Separately, Hawaii\u2019s 0.5% import/use tax on tangible goods needed to be distinguished from the General Excise Tax for resellers.",
    whatIDid:
      "Researched PR Form AS 2916.1 requirements and the legal basis for the B2B reduced rate under PR SUT law. For Hawaii, analyzed the .5% import/use tax mechanics and confirmed it is separate from GET. Documented special condition setup needed at the customer master level and coordinated with the account team.",
    outcome:
      "Clarified the proper special condition and qualifying category configuration, enabling the customer to correctly apply the 4% reduced rate in PR and properly handle the HI import/use tax for resellers.",
    year: "2025\u20132026",
  },
  {
    id: 2,
    industry: "Global Equipment Manufacturer",
    icon: "\uD83C\uDFED",
    jurisdictions: ["CAN"],
    issueSummary:
      "Customer\u2019s exemption certificate for Canada was incorrectly exempting all fees and levies, not just the provincial sales tax. Testing was blocked and the go-live deadline was approaching \u2014 this became an account escalation.",
    whatIDid:
      "Provided detailed resolution steps to the support team, then joined a cross-functional meeting with the consultant and customer success manager to troubleshoot the certificate processing logic. Identified the scope of the exemption cert was too broad in the system configuration.",
    outcome:
      "Resolved the account-level escalation, unblocked customer testing, and ensured certificates correctly exempted only the applicable provincial tax.",
    year: "2023",
  },
  {
    id: 3,
    industry: "Industrial Distribution",
    icon: "\uD83D\uDCE6",
    jurisdictions: ["CT"],
    issueSummary:
      "A certificate for a Connecticut manufacturer was flagged as invalid because the system only accepted 10-digit registration numbers, but CT had quietly changed to a 12-digit format.",
    whatIDid:
      "Researched the CT Department of Revenue Services format change, confirmed the new 12-digit number is legitimate, and coordinated with the compliance team to update the validation rules in the Exemption Certificate Manager.",
    outcome:
      "Certificate validation process updated to accept the new CT format. Customer\u2019s certificate re-validated and processing resumed without interruption.",
    year: "2024",
  },
  {
    id: 4,
    industry: "Retail Pharmacy",
    icon: "\uD83D\uDC8A",
    jurisdictions: ["KY", "TN"],
    issueSummary:
      "Customer needed taxability determinations for braces and supports (e.g., Futuro products) not made for a specific person \u2014 a gray area across states with different DME definitions.",
    whatIDid:
      "Reviewed the DMO category definitions for Miscellaneous Equipment/Devices Sold Without Prescription. Analyzed KY \u00A7 139.472 and TN statutes. Determined that KY required DOR outreach for a definitive ruling, while recommending an interim mapping to Mobility Enhancing Equipment Sold Without Prescription.",
    outcome:
      "Documented the taxability analysis for both states, provided interim guidance for product mapping, and initiated DOR outreach for a binding determination.",
    year: "2022",
  },
  {
    id: 5,
    industry: "Hospitality & Lodging",
    icon: "\uD83C\uDFE8",
    jurisdictions: ["UT"],
    issueSummary:
      "Customer reported that two Park City hotels were missing a 2% CVMA (Canyons Village Management Association) tax on hotel reservations. The tax was not present in the Vertex 200-series tax data.",
    whatIDid:
      "Researched whether the CVMA assessment is a government-imposed tax eligible for inclusion in the product data. Presented findings to leadership, received approval to support the tax, then built the rules and created a new Qualifying Condition called \u2018Resort Property Member\u2019 under Lodging Drivers.",
    outcome:
      "New CVMA rules passed testing and released in MDU 202. Customer activated the rules by mapping to the new Qualifying Condition.",
    year: "2020",
  },
  {
    id: 6,
    industry: "Equipment Rental",
    icon: "\uD83D\uDE9C",
    jurisdictions: ["OH", "Multi-state"],
    issueSummary:
      "Customer questioned whether their Fuels taxability category was reflecting sales tax or excise tax, specifically noting Ohio\u2019s taxability matrix showed \u2018T\u2019 (taxable) when they believed only excise tax should apply.",
    whatIDid:
      "Reproduced the customer\u2019s scenario and confirmed both general sales/use tax and excise tax were returned. Researched Ohio fuel tax statutes and clarified how the taxability matrix report reflects the combined determination. Provided a clear explanation of what \u2018T\u2019 represents in context.",
    outcome:
      "Customer received authoritative clarification on the taxability matrix interpretation. Documented the finding for future inquiries on the same category.",
    year: "2026",
  },
  {
    id: 7,
    industry: "Global Technology",
    icon: "\uD83D\uDCBB",
    jurisdictions: ["CO"],
    issueSummary:
      "Certificate uploads were failing for 15 Colorado home-rule jurisdictions with the error: \u2018The jurisdiction and reason type combination provided is not valid.\u2019 Customer could not apply state-level resale exemptions to local jurisdictions.",
    whatIDid:
      "Conducted primary research across all 15 home-rule cities to determine if each accepted the state resale certificate. Contacted municipalities directly when responses were unavailable online. Confirmed 13 of 15 accept the state form; 2 did not respond.",
    outcome:
      "Confirmed the state certificate transfers to locals for the verified jurisdictions. Resolved the upload errors by aligning ECW/ECM mapping to accept the state form at the local level.",
    year: "2024\u20132025",
  },
  {
    id: 8,
    industry: "Multinational Financial Services",
    icon: "\uD83C\uDFE6",
    jurisdictions: ["BC", "MB", "QC", "SK"],
    issueSummary:
      "Native American / First Nations tax exemptions in Canadian PST provinces were not being applied correctly through the Certificate Center. British Columbia\u2019s PST exemption logic had a specific processing error.",
    whatIDid:
      "Reviewed all four PST provinces (BC, MB, QC, SK) for their First Nations exemption requirements. Identified a logic error in the Certificate Center for BC where the exemption scope was incorrectly configured. Coordinated with the development team to correct the certificate processing.",
    outcome:
      "Certificate Center logic corrected for BC. All four PST provinces verified for proper First Nations exemption handling.",
    year: "2023",
  },
];

// ── Stats ────────────────────────────────────────────────
export const STATS = [
  { value: "50 States + DC", label: "U.S. Jurisdictions" },
  { value: "4 Territories", label: "PR \u00B7 GU \u00B7 VI \u00B7 AS" },
  { value: "13 Provinces", label: "Canadian Coverage" },
  { value: "2,000+", label: "Taxability Categories" },
  { value: "5+ Years", label: "Daily Tax Law Monitoring" },
  { value: "Fortune 500", label: "Industries Served" },
];
