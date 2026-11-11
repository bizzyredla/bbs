/* Covalent marketing site interactions: lifecycle stages, vendor/partner toggle, ROI estimate, waitlist. */
(function () {
  "use strict";

  /* ---------- Lifecycle ---------- */
  var STAGES = [
    {
      name: "Recruit",
      title: "Find partners who already share your customers.",
      body: "Score every applicant against your ideal partner profile using real account overlap, not a gut feeling. The best-fit partners go straight to the right partner manager.",
      auto: ["Embeddable application form with fit scoring", "Overlap check against your closed-won customers", "Auto-routing by region, type and segment"],
      metric: "71", unit: "fit score", delta: "Top 10% of applicants", who: "Signal tracked: applicant fit score",
      series: [22, 30, 28, 41, 46, 52, 58, 61, 66, 71]
    },
    {
      name: "Onboard",
      title: "Agreement signed and first call booked in days.",
      body: "Partners pick a program, sign terms and get a workspace with their own Slack Connect channel. Every partner follows the same checklist with owners and due dates.",
      auto: ["E-signature for program terms and tier rates", "Onboarding checklist with nudges on both sides", "Workspace and shared channel created automatically"],
      metric: "9 days", unit: "", delta: "−23 days vs. last quarter", who: "Signal tracked: time to first registered deal",
      series: [38, 34, 31, 27, 22, 19, 16, 13, 11, 9]
    },
    {
      name: "Enable",
      title: "Certify partners on what actually sells.",
      body: "Short courses, quizzes and certifications built from your own battlecards and demos. Covalent shows which assets appear in deals that close.",
      auto: ["Course builder with certifications by role", "Sales assets with usage and win-rate tracking", "Battlecards synced from your CRM and wiki"],
      metric: "4.2", unit: "certified sellers", delta: "per active partner", who: "Signal tracked: certified sellers per partner",
      series: [1.1, 1.4, 1.8, 2.0, 2.6, 2.9, 3.3, 3.6, 3.9, 4.2]
    },
    {
      name: "Co-market",
      title: "Run joint campaigns and see the leads they create.",
      body: "Partners request market development funds, launch co-branded pages from templates and get credit for every lead those campaigns create.",
      auto: ["MDF requests, approvals and claims with proof", "Co-branded landing pages from templates", "Campaign leads attributed in the Ledger"],
      metric: "312", unit: "partner MQLs", delta: "+41% quarter over quarter", who: "Signal tracked: partner-generated MQLs",
      series: [120, 140, 150, 180, 175, 210, 240, 260, 290, 312]
    },
    {
      name: "Co-sell",
      title: "Register, map and close deals together.",
      body: "Partners register from wherever they work. Covalent checks for conflicts, shows AEs which partners know the buyer and logs every joint touch to the Ledger.",
      auto: ["Anywhere Registration from Slack, Teams, email or CRM", "Conflict detection against open opportunities", "Overlap Radar intros on every opportunity"],
      metric: "$4.8M", unit: "partner-attached pipeline", delta: "+$1.1M this quarter", who: "Signal tracked: partner-attached pipeline",
      series: [1.6, 1.9, 2.3, 2.4, 2.9, 3.2, 3.6, 3.9, 4.3, 4.8]
    },
    {
      name: "Reward",
      title: "Pay partners accurately and on time.",
      body: "Commission rules live with each program and tier. Closed deals become statements automatically, finance approves in one batch, and partners see exactly how each number was built.",
      auto: ["Rules by tier, product and attribution model", "Statements generated from closed-won deals", "Payment through Stripe Connect or export to your AP tool"],
      metric: "3 days", unit: "", delta: "from close to payout", who: "Signal tracked: days from close to payout",
      series: [41, 38, 33, 30, 24, 18, 12, 8, 5, 3]
    },
    {
      name: "Grow",
      title: "Turn good partners into great ones.",
      body: "Tiers update from real performance. Pulse flags partners who are slipping. Copilot drafts quarterly business reviews with the numbers both sides already agree on.",
      auto: ["Automatic tier progression and reviews", "Partner Pulse health scores and playbooks", "QBR decks drafted by Copilot from the Ledger"],
      metric: "128%", unit: "partner NRR", delta: "Expansion on partner-sourced customers", who: "Signal tracked: net revenue retention of partner-sourced customers",
      series: [104, 107, 109, 112, 114, 117, 119, 122, 125, 128]
    }
  ];

  var rail = document.getElementById("rail");
  var panel = document.getElementById("stage-panel");
  var current = 4;

  function spark(series) {
    var w = 300, h = 72, pad = 6;
    var min = Math.min.apply(null, series), max = Math.max.apply(null, series);
    var span = max - min || 1;
    var pts = series.map(function (v, i) {
      var x = pad + (i * (w - pad * 2)) / (series.length - 1);
      var y = h - pad - ((v - min) / span) * (h - pad * 2);
      return [x, y];
    });
    var line = pts.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ");
    var area = "M" + pts[0][0] + "," + (h - pad) + " L" + line.split(" ").join(" L") + " L" + pts[pts.length - 1][0] + "," + (h - pad) + " Z";
    var last = pts[pts.length - 1];
    return '<svg viewBox="0 0 ' + w + " " + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<line x1="0" x2="' + w + '" y1="' + (h - pad) + '" y2="' + (h - pad) + '" stroke="var(--rule)" stroke-width="1"/>' +
      '<path d="' + area + '" fill="var(--cobalt-soft)"/>' +
      '<polyline points="' + line + '" fill="none" stroke="var(--cobalt)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round" vector-effect="non-scaling-stroke"/>' +
      '<circle cx="' + last[0] + '" cy="' + last[1] + '" r="4" fill="var(--cobalt)" stroke="var(--sheet)" stroke-width="2"/></svg>';
  }

  function renderRail() {
    rail.innerHTML = STAGES.map(function (s, i) {
      var cls = "stage-btn" + (i < current ? " done" : "");
      return '<button type="button" role="tab" class="' + cls + '" id="stage-' + i + '" aria-controls="stage-panel" aria-selected="' + (i === current) + '" tabindex="' + (i === current ? 0 : -1) + '">' +
        '<span class="n">' + String(i + 1).padStart(2, "0") + '</span><span class="t">' + s.name + "</span></button>";
    }).join("");
  }

  function renderPanel() {
    var s = STAGES[current];
    panel.setAttribute("aria-labelledby", "stage-" + current);
    panel.innerHTML =
      '<div><span class="eyebrow">Stage ' + (current + 1) + " of 7 · " + s.name + "</span><h3>" + s.title + "</h3><p>" + s.body + "</p><ul>" +
      s.auto.map(function (a) { return "<li><span>" + a + "</span></li>"; }).join("") + "</ul></div>" +
      '<div class="signal"><span class="eyebrow">' + s.who + '</span><div class="metric"><span class="num">' + s.metric + "</span>" +
      (s.unit ? '<span style="color:var(--muted)">' + s.unit + "</span>" : "") + '</div><span class="delta" style="font-size:13px;font-weight:600;color:var(--good)">' + s.delta + "</span>" +
      spark(s.series) + '<span class="who">Example program, last 10 weeks</span></div>';
  }

  function select(i, focus) {
    current = (i + STAGES.length) % STAGES.length;
    renderRail();
    renderPanel();
    if (focus) document.getElementById("stage-" + current).focus();
  }

  if (rail && panel) {
    rail.addEventListener("click", function (e) {
      var b = e.target.closest(".stage-btn");
      if (b) select(Number(b.id.split("-")[1]));
    });
    rail.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); select(current + 1, true); }
      if (e.key === "ArrowLeft") { e.preventDefault(); select(current - 1, true); }
    });
    select(current);
  }

  /* ---------- Vendor / partner toggle ---------- */
  var bv = document.getElementById("side-vendor");
  var bp = document.getElementById("side-partner");
  var vv = document.getElementById("view-vendor");
  var vp = document.getElementById("view-partner");
  function side(partner) {
    bv.setAttribute("aria-pressed", String(!partner));
    bp.setAttribute("aria-pressed", String(partner));
    vv.hidden = partner;
    vp.hidden = !partner;
  }
  if (bv && bp) {
    bv.addEventListener("click", function () { side(false); });
    bp.addEventListener("click", function () { side(true); });
  }

  /* ---------- ROI ---------- */
  var money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  var whole = new Intl.NumberFormat("en-US");
  function compact(n) {
    if (n >= 1e6) return "$" + (n / 1e6).toFixed(n >= 1e7 ? 0 : 1) + "M";
    if (n >= 1e3) return "$" + Math.round(n / 1e3) + "k";
    return money.format(n);
  }
  function val(id) { return Number(document.getElementById(id).value); }
  function roi() {
    var partners = val("roi-partners"), acv = val("roi-acv"), deals = val("roi-deals"), hours = val("roi-hours");
    document.getElementById("o-partners").textContent = whole.format(partners);
    document.getElementById("o-acv").textContent = compact(acv);
    document.getElementById("o-deals").textContent = whole.format(deals);
    document.getElementById("o-hours").textContent = hours + " hrs";
    var influence = deals * 4 * 0.22 * acv;
    var hrs = Math.round(hours * 48 * 0.6);
    var dormant = Math.round(partners * 0.35);
    document.getElementById("r-influence").textContent = compact(influence);
    document.getElementById("r-hours").textContent = whole.format(hrs) + " hrs";
    document.getElementById("r-dormant").textContent = whole.format(dormant);
  }
  var form = document.getElementById("roi-form");
  if (form) { form.addEventListener("input", roi); roi(); }

  /* ---------- Waitlist (concept: nothing is sent) ---------- */
  var wl = document.getElementById("waitlist-form");
  if (wl) {
    wl.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = document.getElementById("w-name");
      var email = document.getElementById("w-email");
      var done = document.getElementById("waitlist-done");
      if (!name.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
        done.hidden = false;
        done.textContent = "Add your name and a work email to request access.";
        (name.value.trim() ? email : name).focus();
        return;
      }
      done.hidden = false;
      done.textContent = "Thanks, " + name.value.trim().split(" ")[0] + ". This is a concept preview, so nothing was sent yet. The live site will add you to the design partner list.";
    });
  }
})();
