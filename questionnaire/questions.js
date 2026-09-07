// Question bank for the AI Acceptable Use Policy comprehension check.
// Each item: question, four options, index of the correct option, and a short
// explanation shown as feedback after the person answers.

const QUESTIONS = [
  {
    q: "If a piece of information hasn't been explicitly classified, how should it be treated by default?",
    options: [
      "As Confidential",
      "As Internal",
      "As Public/Open",
      "It doesn't need a classification"
    ],
    correct: 1,
    explanation: "Most information falls here by default. Anything not explicitly classified should be treated as Internal, not Public."
  },
  {
    q: "Can Confidential information ever be entered into a free, unlicensed AI tool?",
    options: [
      "Yes, as long as it's summarized first",
      "No — never, under any circumstances",
      "Yes, with a manager's verbal approval",
      "Yes, if it's fewer than 100 words"
    ],
    correct: 1,
    explanation: "Confidential information must never go into a free or unapproved AI tool. It may only be processed by a service approved for an approved business purpose."
  },
  {
    q: "Which of these must never be entered into any AI tool, under any circumstances?",
    options: [
      "Draft marketing copy",
      "A public press release",
      "Passwords, API keys, PINs, or tokens",
      "A general meeting agenda"
    ],
    correct: 2,
    explanation: "Credentials of any kind — passwords, PINs, VPN tokens, API keys — are off-limits for every AI tool, no exceptions."
  },
  {
    q: "For free or unlicensed use, what form must an AI tool take?",
    options: [
      "A browser-based (web) application only — no installs, plugins, or integrations",
      "Any tool that accepts a work email address",
      "A desktop application is fine if it's from a known vendor",
      "A mobile app downloaded from an official app store"
    ],
    correct: 0,
    explanation: "Free/unlicensed AI use must be strictly web-based. Installing standalone software or adding plugins/integrations isn't permitted outside the approved procurement process."
  },
  {
    q: "Who is responsible for checking AI-generated content for accuracy, bias, and appropriateness before it's used?",
    options: [
      "The AI vendor",
      "IT, automatically",
      "The employee who generated or is using the content",
      "No one — AI output can be trusted as-is"
    ],
    correct: 2,
    explanation: "Employees must review and validate AI output themselves, including checking that it doesn't itself leak confidential or personal data."
  },
  {
    q: "Before running AI-generated code or commands against internal infrastructure, what must happen first?",
    options: [
      "Nothing — it can be run directly if it looks correct",
      "It must be tested in a non-production environment first",
      "It must be rewritten in a different programming language",
      "It only needs a comment explaining what it does"
    ],
    correct: 1,
    explanation: "AI-generated code or commands must be reviewed and tested in non-production before ever touching production systems."
  },
  {
    q: "Can an employee personally purchase or expense an AI tool for work purposes?",
    options: [
      "Yes, as long as it's under a certain budget",
      "No — all paid AI tools must go through Orbyt's procurement and governance process",
      "Yes, but only for a one-time trial",
      "Yes, if it's later reported to a manager"
    ],
    correct: 1,
    explanation: "Employees must not independently buy, subscribe to, or expense AI tools. Access has to be provisioned through the approved procurement process."
  },
  {
    q: "What must an approved paid AI service NOT do with company data?",
    options: [
      "Store it in an EU/EEA data center",
      "Use it to train or fine-tune the provider's underlying models",
      "Process it for the approved business purpose",
      "Offer configurable retention settings"
    ],
    correct: 1,
    explanation: "Approved services must not use company data to train or improve their models — a verified opt-out or equivalent contractual guarantee is required."
  },
  {
    q: "Who must be consulted before an AI service is approved to process personal data?",
    options: [
      "Only the employee requesting it",
      "The InfoSec Department and the Data Protection Officer (DPO)",
      "The marketing team",
      "No one — approval isn't required for personal data"
    ],
    correct: 1,
    explanation: "InfoSec/DPO must be consulted before approval, and a Data Protection Impact Assessment (DPIA) completed where GDPR requires one."
  },
  {
    q: "Under GDPR, a personal data breach may need to be reported to the supervisory authority within how many hours?",
    options: [
      "24 hours",
      "72 hours",
      "96 hours",
      "30 days"
    ],
    correct: 1,
    explanation: "Article 33 GDPR sets a 72-hour window for assessing and, where required, notifying the supervisory authority."
  },
  {
    q: "What should happen to an employee's AI tool access when they change roles or leave the company?",
    options: [
      "It stays active for 90 days as a grace period",
      "It must be revoked as part of standard offboarding",
      "It automatically transfers to their replacement",
      "Nothing — access isn't centrally tracked"
    ],
    correct: 1,
    explanation: "Access must be revoked on offboarding, and any licenses or seats reassigned or deactivated."
  },
  {
    q: "How long should company data be retained by an approved AI service?",
    options: [
      "Indefinitely, for audit purposes",
      "No longer than necessary for the approved business purpose",
      "Exactly one year, regardless of use case",
      "As long as the vendor's default settings allow"
    ],
    correct: 1,
    explanation: "Data shouldn't be kept longer than the business purpose requires — retention, chat history, and memory features should be minimized or disabled where possible."
  },
  {
    q: "If you're unsure whether an AI tool or use case is approved, what should you do?",
    options: [
      "Use it and ask forgiveness later if it's an issue",
      "Contact Procurement or the InfoSec Department before proceeding",
      "Ask a colleague what they usually do",
      "Assume it's fine if it's a well-known tool"
    ],
    correct: 1,
    explanation: "Employees who are uncertain must check with Procurement or InfoSec before proceeding — not proceed and self-assess."
  },
  {
    q: "What could happen to an employee found to have violated this policy?",
    options: [
      "Nothing — it's a non-binding guideline",
      "Disciplinary or legal action",
      "A one-time automated email reminder",
      "Loss of parking privileges only"
    ],
    correct: 1,
    explanation: "Violations can lead to disciplinary or legal action, and for vendors/contractors, sanctions up to termination of contract."
  },
  {
    q: "Which of the following are named in the policy as examples of 'reputable' AI tools?",
    options: [
      "Gemini, Grok, ChatGPT, Claude, and Copilot",
      "Any tool found through a general web search",
      "Only tools built internally by the company",
      "Any browser extension with good reviews"
    ],
    correct: 0,
    explanation: "The policy names these as widely recognized, reputable tools — with preference given to the tool included in the company's Microsoft 365 subscription."
  }
];
