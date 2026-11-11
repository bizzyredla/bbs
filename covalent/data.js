/* Sample workspace for the Covalent prototype.
   Every company, person and figure here is fictional and exists only to show the product.
   Shape mirrors the planned API resources in BLUEPRINT.md (partners, deals, touches, payouts, ...). */
window.COVALENT_DATA = {
  workspace: { name: "Fieldnote", user: { name: "Maya Okafor", initials: "MO", role: "Head of Partnerships" }, today: "2026-11-11" },

  // Lifecycle status a partner can be in (the seven program stages collapse to five partner states)
  statuses: ["Recruiting", "Onboarding", "Enabling", "Co-selling", "Growing"],

  partners: [
    { id: "p1", name: "Brightpath Consulting", initials: "BP", color: "#2f4bef", type: "Systems integrator", tier: "Silver", status: "Co-selling", health: 91, trend: [62, 64, 66, 70, 71, 74, 78, 80, 83, 86, 89, 91], sourced: 362000, influenced: 214000, owner: "Maya Okafor", region: "North America", joined: "2025-09-14", lastActivity: "Registered Ironwood Legal · 2 days ago", certified: 6, channel: "Slack Connect", contacts: [["Priya Lal", "Managing partner"], ["Tom Becker", "Practice lead"]] },
    { id: "p2", name: "Ledgerline", initials: "LL", color: "#0f8b8d", type: "Technology", tier: "Platinum", status: "Growing", health: 86, trend: [80, 81, 79, 82, 84, 83, 85, 84, 86, 85, 86, 86], sourced: 148000, influenced: 522000, owner: "Dev Patel", region: "Global", joined: "2024-03-02", lastActivity: "Joint demo with Marigold Pharmacy · today", certified: 9, channel: "Slack Connect", contacts: [["Ana Ruiz", "Head of alliances"], ["Kenji Mori", "Solutions architect"]] },
    { id: "p3", name: "Northstack", initials: "NS", color: "#3a3e4e", type: "Reseller", tier: "Gold", status: "Co-selling", health: 78, trend: [70, 72, 71, 74, 73, 75, 77, 76, 78, 77, 79, 78], sourced: 410000, influenced: 96000, owner: "Dev Patel", region: "North America", joined: "2024-11-20", lastActivity: "Registered Keystone Insurance · 1 day ago", certified: 5, channel: "HubSpot sync", contacts: [["Marcus Hill", "Channel director"]] },
    { id: "p4", name: "Meridian Cloud Partners", initials: "MC", color: "#b4532a", type: "Managed service provider", tier: "Silver", status: "Co-selling", health: 38, trend: [72, 70, 66, 63, 60, 55, 52, 49, 46, 43, 40, 38], sourced: 64000, influenced: 12000, owner: "Sam Lindqvist", region: "EMEA", joined: "2025-02-11", lastActivity: "No deal registered in 61 days", certified: 1, channel: "Email", contacts: [["Elena Novak", "Alliances manager"]] },
    { id: "p5", name: "Harbor RevOps", initials: "HR", color: "#7a4fd6", type: "Agency", tier: "Silver", status: "Co-selling", health: 74, trend: [55, 58, 60, 61, 63, 66, 65, 68, 70, 71, 73, 74], sourced: 88000, influenced: 41000, owner: "Maya Okafor", region: "North America", joined: "2025-06-03", lastActivity: "Registered Gridline Logistics from Slack · today", certified: 3, channel: "Slack Connect", contacts: [["Jules Carter", "Founder"]] },
    { id: "p6", name: "Kite Digital", initials: "KD", color: "#a8700a", type: "Agency", tier: "Registered", status: "Enabling", health: 57, trend: [66, 65, 64, 64, 62, 61, 60, 59, 59, 58, 57, 57], sourced: 18000, influenced: 22000, owner: "Sam Lindqvist", region: "EMEA", joined: "2025-12-01", lastActivity: "Certification expired · 9 days ago", certified: 0, channel: "Email", contacts: [["Noah Fischer", "Partner lead"]] },
    { id: "p7", name: "Tessellate Labs", initials: "TL", color: "#1e7f4f", type: "Technology", tier: "Gold", status: "Growing", health: 82, trend: [70, 71, 73, 74, 76, 75, 78, 79, 80, 81, 82, 82], sourced: 52000, influenced: 310000, owner: "Dev Patel", region: "Global", joined: "2024-06-18", lastActivity: "Integration v2 launched · 5 days ago", certified: 4, channel: "Slack Connect", contacts: [["Riya Shah", "Partnerships"]] },
    { id: "p8", name: "Quill & Co", initials: "QC", color: "#c2410c", type: "Referral", tier: "Registered", status: "Co-selling", health: 66, trend: [50, 52, 55, 54, 57, 59, 60, 62, 63, 64, 65, 66], sourced: 46000, influenced: 8000, owner: "Maya Okafor", region: "North America", joined: "2025-10-09", lastActivity: "Registered Juniper Foods · 3 days ago", certified: 1, channel: "Partner portal", contacts: [["Ivy Quill", "Owner"]] },
    { id: "p9", name: "Atlas Systems Integrators", initials: "AS", color: "#1d4ed8", type: "Systems integrator", tier: "Platinum", status: "Growing", health: 88, trend: [82, 83, 84, 84, 85, 86, 85, 87, 87, 88, 88, 88], sourced: 590000, influenced: 270000, owner: "Sam Lindqvist", region: "EMEA", joined: "2023-08-30", lastActivity: "QBR scheduled for Nov 19", certified: 14, channel: "Microsoft Teams", contacts: [["Oliver Grant", "VP alliances"], ["Sofia Marin", "Delivery lead"]] },
    { id: "p10", name: "Vantage MSP", initials: "VM", color: "#475569", type: "Managed service provider", tier: "Registered", status: "Onboarding", health: 61, trend: [0, 0, 0, 0, 0, 0, 0, 0, 40, 48, 55, 61], sourced: 0, influenced: 0, owner: "Sam Lindqvist", region: "APAC", joined: "2026-10-22", lastActivity: "Signed program terms · 6 days ago", certified: 0, channel: "Slack Connect", contacts: [["Hana Cho", "Director"]] },
    { id: "p11", name: "Orbitry", initials: "OR", color: "#0e7490", type: "Technology", tier: "Silver", status: "Enabling", health: 69, trend: [0, 0, 0, 0, 52, 56, 58, 61, 63, 66, 68, 69], sourced: 0, influenced: 64000, owner: "Dev Patel", region: "Global", joined: "2026-05-04", lastActivity: "Listed on Fieldnote marketplace · 2 weeks ago", certified: 2, channel: "Slack Connect", contacts: [["Leo Brandt", "BD lead"]] },
    { id: "p12", name: "Summit Revenue Group", initials: "SR", color: "#9333ea", type: "Referral", tier: "Prospect", status: "Recruiting", health: 0, trend: [], sourced: 0, influenced: 0, owner: "Maya Okafor", region: "North America", joined: "", lastActivity: "Discovery call booked for Nov 14", certified: 0, channel: "Email", contacts: [["Grace Liu", "Partner"]] },
    { id: "p13", name: "Parallax Partners", initials: "PP", color: "#be185d", type: "Reseller", tier: "Registered", status: "Onboarding", health: 64, trend: [0, 0, 0, 0, 0, 0, 0, 50, 54, 58, 62, 64], sourced: 0, influenced: 0, owner: "Dev Patel", region: "APAC", joined: "2026-09-30", lastActivity: "Onboarding checklist 6 of 9 done", certified: 1, channel: "Partner portal", contacts: [["Arjun Mehta", "CEO"]] },
    { id: "p14", name: "Fernhill Studio", initials: "FS", color: "#15803d", type: "Agency", tier: "Silver", status: "Co-selling", health: 49, trend: [68, 67, 66, 63, 61, 60, 58, 56, 54, 52, 50, 49], sourced: 31000, influenced: 18000, owner: "Maya Okafor", region: "North America", joined: "2025-04-15", lastActivity: "Last joint call 38 days ago", certified: 2, channel: "Email", contacts: [["Maeve Doyle", "Director"]] }
  ],

  // Deal registrations and partner-attached opportunities. stage = pipeline column.
  stages: [
    { id: "submitted", name: "Submitted" },
    { id: "review", name: "In review" },
    { id: "approved", name: "Approved" },
    { id: "cosell", name: "Co-selling" },
    { id: "won", name: "Closed won" }
  ],
  deals: [
    { id: "d1", account: "Gridline Logistics", amount: 60000, partner: "p5", via: "Slack", stage: "review", submitted: "2026-11-11", close: "2027-03-31", ae: "Jordan Reyes", conflict: null,
      touches: [{ p: "p5", date: "2026-11-11", kind: "Sourced", what: "Registered from Slack: VP Ops wants a 3-warehouse pilot", src: "Slack" }] },
    { id: "d2", account: "Solace Retail", amount: 42000, partner: "p6", via: "Email", stage: "review", submitted: "2026-11-09", close: "2027-01-15", ae: "Priya Shah",
      conflict: { kind: "ae", text: "Priya Shah opened this opportunity in HubSpot 12 days before the registration." },
      touches: [{ p: "p6", date: "2026-11-09", kind: "Sourced", what: "Forwarded intro email from Solace's CMO", src: "Email" }] },
    { id: "d3", account: "Keystone Insurance", amount: 128000, partner: "p3", via: "HubSpot", stage: "review", submitted: "2026-11-10", close: "2027-02-28", ae: "Jordan Reyes",
      conflict: { kind: "partner", other: "p9", text: "Atlas Systems Integrators registered the same account on Oct 28." },
      touches: [{ p: "p9", date: "2026-10-28", kind: "Sourced", what: "Registered via Teams after workshop with Keystone IT", src: "Teams" }, { p: "p3", date: "2026-11-10", kind: "Sourced", what: "Registered from Northstack's HubSpot", src: "HubSpot" }] },
    { id: "d4", account: "Juniper Foods", amount: 24000, partner: "p8", via: "Portal", stage: "submitted", submitted: "2026-11-08", close: "2027-01-31", ae: "Unassigned", conflict: null,
      touches: [{ p: "p8", date: "2026-11-08", kind: "Sourced", what: "Referral from Juniper's finance lead", src: "Portal" }] },
    { id: "d10", account: "Copperline Freight", amount: 72000, partner: "p4", via: "Email", stage: "submitted", submitted: "2026-11-07", close: "2027-04-30", ae: "Unassigned", conflict: null,
      touches: [{ p: "p4", date: "2026-11-07", kind: "Sourced", what: "Registered by email, no next step listed", src: "Email" }] },
    { id: "d7", account: "Arcadia Schools", amount: 38000, partner: "p3", via: "HubSpot", stage: "approved", submitted: "2026-10-30", close: "2027-01-20", ae: "Priya Shah", conflict: null,
      touches: [{ p: "p3", date: "2026-10-30", kind: "Sourced", what: "Existing Northstack customer expanding to new district", src: "HubSpot" }] },
    { id: "d9", account: "Bluefin Media", amount: 27000, partner: "p14", via: "Portal", stage: "approved", submitted: "2026-10-21", close: "2026-12-19", ae: "Jordan Reyes", conflict: null,
      touches: [{ p: "p14", date: "2026-10-21", kind: "Sourced", what: "Website rebuild client needs research ops tooling", src: "Portal" }] },
    { id: "d11", account: "Ironwood Legal", amount: 51000, partner: "p1", via: "Slack", stage: "approved", submitted: "2026-11-09", close: "2027-02-14", ae: "Lena Ortiz", conflict: null,
      touches: [{ p: "p1", date: "2026-11-09", kind: "Sourced", what: "Registered from Slack after legal-ops assessment", src: "Slack" }] },
    { id: "d5", account: "Peregrine Bank", amount: 94000, partner: "p1", via: "Slack", stage: "cosell", submitted: "2026-04-12", close: "2026-12-12", ae: "Lena Ortiz", conflict: null,
      touches: [{ p: "p1", date: "2026-04-12", kind: "Sourced", what: "Registered from Slack, intro to CDO", src: "Slack" }, { p: "p2", date: "2026-09-18", kind: "Influenced", what: "Ledgerline joined security review", src: "Gong" }, { p: "p1", date: "2026-10-30", kind: "Influenced", what: "Ran discovery workshop with 9 stakeholders", src: "Calendar" }] },
    { id: "d6", account: "Hollis Manufacturing", amount: 156000, partner: "p3", via: "HubSpot", stage: "cosell", submitted: "2026-08-04", close: "2026-12-20", ae: "Jordan Reyes", conflict: null,
      touches: [{ p: "p3", date: "2026-08-04", kind: "Sourced", what: "Registered from HubSpot", src: "HubSpot" }, { p: "p7", date: "2026-09-27", kind: "Influenced", what: "Tessellate showed live ERP integration", src: "Gong" }, { p: "p3", date: "2026-10-22", kind: "Assisted", what: "Drafted reseller order form", src: "Partner log" }] },
    { id: "d8", account: "Verdant Energy", amount: 210000, partner: "p9", via: "Teams", stage: "cosell", submitted: "2026-07-15", close: "2027-01-30", ae: "Lena Ortiz", conflict: null,
      touches: [{ p: "p9", date: "2026-07-15", kind: "Sourced", what: "Registered from Teams, field-ops transformation program", src: "Teams" }, { p: "p1", date: "2026-09-02", kind: "Influenced", what: "Brightpath shared reference from a similar rollout", src: "Partner log" }, { p: "p2", date: "2026-10-12", kind: "Influenced", what: "Ledgerline billing integration demo", src: "Gong" }] },
    { id: "d15", account: "Marigold Pharmacy", amount: 64000, partner: "p5", via: "Slack", stage: "cosell", submitted: "2026-09-09", close: "2026-12-05", ae: "Priya Shah", conflict: null,
      touches: [{ p: "p5", date: "2026-09-09", kind: "Sourced", what: "Registered from Slack", src: "Slack" }, { p: "p2", date: "2026-11-11", kind: "Influenced", what: "Joint demo with Ledgerline today", src: "Calendar" }] },
    { id: "d12", account: "Northwind Health", amount: 186000, partner: "p1", via: "Slack", stage: "won", submitted: "2026-03-03", close: "2026-10-16", ae: "Jordan Reyes", conflict: null,
      touches: [{ p: "p1", date: "2026-03-03", kind: "Sourced", what: "Registered from Slack, intro to CIO", src: "Slack" }, { p: "p2", date: "2026-03-21", kind: "Influenced", what: "Joint integration demo, 6 buyer attendees", src: "Gong" }, { p: "p3", date: "2026-04-30", kind: "Assisted", what: "Handled procurement through marketplace private offer", src: "HubSpot" }] },
    { id: "d13", account: "Sterling Dental Group", amount: 33000, partner: "p8", via: "Portal", stage: "won", submitted: "2026-07-01", close: "2026-10-28", ae: "Priya Shah", conflict: null,
      touches: [{ p: "p8", date: "2026-07-01", kind: "Sourced", what: "Referral from Sterling's COO", src: "Portal" }] },
    { id: "d14", account: "Cascade Hotels", amount: 119000, partner: "p9", via: "Teams", stage: "won", submitted: "2026-05-20", close: "2026-10-30", ae: "Lena Ortiz", conflict: null,
      touches: [{ p: "p9", date: "2026-05-20", kind: "Sourced", what: "Registered from Teams", src: "Teams" }, { p: "p7", date: "2026-08-14", kind: "Influenced", what: "Tessellate data connector proof of concept", src: "Partner log" }] }
  ],

  // Partner revenue by month, this year (USD thousands). Sums match partner totals above.
  months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
  sourcedByMonth: [98, 120, 135, 150, 162, 171, 189, 226, 248, 310],
  influencedByMonth: [80, 95, 112, 128, 140, 152, 170, 198, 232, 270],

  applications: [
    { id: "a1", name: "Copperfield Advisory", type: "Systems integrator", region: "North America", fit: 92, overlap: 31, source: "Website form", note: "31 shared customers, 6 in your open pipeline" },
    { id: "a2", name: "Granite Ops", type: "Agency", region: "EMEA", fit: 78, overlap: 12, source: "Referred by Atlas", note: "Strong in logistics, your fastest-growing segment" },
    { id: "a3", name: "Nimbus Stack", type: "Technology", region: "Global", fit: 74, overlap: 44, source: "Marketplace listing", note: "Integration requested by 9 customers in support tickets" },
    { id: "a4", name: "Bluebird Referrals", type: "Referral", region: "North America", fit: 41, overlap: 2, source: "Website form", note: "Low overlap, mostly consumer clients" },
    { id: "a5", name: "Tidewater IT", type: "Managed service provider", region: "APAC", fit: 66, overlap: 9, source: "Event: SaaS Connect Sydney", note: "Covers a region with no active partner" }
  ],

  courses: [
    { id: "c1", name: "Fieldnote Fundamentals", required: true, minutes: 45, enrolled: 58, completed: 51 },
    { id: "c2", name: "Selling to Operations Leaders", required: false, minutes: 60, enrolled: 37, completed: 22 },
    { id: "c3", name: "Technical Validation Lab", required: false, minutes: 120, enrolled: 24, completed: 11 },
    { id: "c4", name: "Pricing and Packaging 2026", required: true, minutes: 30, enrolled: 49, completed: 30 }
  ],
  assets: [
    { name: "Ops leader pitch deck", uses: 142, winRate: 41 },
    { name: "ROI calculator (sheet)", uses: 96, winRate: 48 },
    { name: "Security one-pager", uses: 88, winRate: 35 },
    { name: "Logistics case study", uses: 51, winRate: 52 }
  ],

  mdf: [
    { id: "m1", partner: "p9", name: "Field ops roundtable, London", amount: 12000, status: "Pending", leads: 0, expected: 40 },
    { id: "m2", partner: "p1", name: "Healthcare webinar series", amount: 6500, status: "Approved", leads: 64, expected: 50 },
    { id: "m3", partner: "p5", name: "RevOps teardown newsletter", amount: 3000, status: "Claimed", leads: 118, expected: 60 },
    { id: "m4", partner: "p14", name: "Agency showcase booth", amount: 9000, status: "Pending", leads: 0, expected: 25 }
  ],

  // Accounts in open pipeline vs what partners have in their books (hashed match)
  overlapPartners: ["p1", "p2", "p3", "p9", "p7"],
  overlap: [
    { account: "Peregrine Bank", amount: 94000, ae: "Lena Ortiz", cells: { p1: "opp", p2: "customer", p3: "", p9: "", p7: "" } },
    { account: "Hollis Manufacturing", amount: 156000, ae: "Jordan Reyes", cells: { p1: "", p2: "", p3: "opp", p9: "customer", p7: "customer" } },
    { account: "Larkspur Insurance", amount: 88000, ae: "Priya Shah", cells: { p1: "customer", p2: "", p3: "", p9: "opp", p7: "" } },
    { account: "Oakridge Clinics", amount: 47000, ae: "Lena Ortiz", cells: { p1: "customer", p2: "customer", p3: "", p9: "", p7: "" } },
    { account: "Quarry Point Mining", amount: 133000, ae: "Jordan Reyes", cells: { p1: "", p2: "", p3: "", p9: "customer", p7: "opp" } },
    { account: "Halcyon Travel", amount: 29000, ae: "Priya Shah", cells: { p1: "", p2: "opp", p3: "customer", p9: "", p7: "" } },
    { account: "Redwood Utilities", amount: 175000, ae: "Lena Ortiz", cells: { p1: "", p2: "customer", p3: "", p9: "customer", p7: "customer" } },
    { account: "Saltmarsh Foods", amount: 36000, ae: "Jordan Reyes", cells: { p1: "", p2: "", p3: "", p9: "", p7: "" } }
  ],

  // Commission rates by credit type for the default program
  rates: { Sourced: 0.2, Influenced: 0.1, Assisted: 0.1 },
  payoutsPaid: [
    { partner: "p7", what: "Q3 influence bonus", amount: 7200, date: "2026-10-01" },
    { partner: "p5", what: "Bramble Analytics (sourced)", amount: 6400, date: "2026-09-01" },
    { partner: "p9", what: "Q3 sourced revenue share", amount: 21600, date: "2026-10-01" }
  ]
};
