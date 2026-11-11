/* Covalent workspace prototype. Vanilla JS, hash-routed, no build step.
   All data comes from data.js (fictional). State changes live in memory only. */
(function () {
  "use strict";

  var D = window.COVALENT_DATA;
  var ME = "p1"; // the partner shown in Partner view (Brightpath Consulting)
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var view = $("#view");

  /* ---------------- Helpers ---------------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function P(id) { return D.partners.find(function (p) { return p.id === id; }); }
  function deal(id) { return D.deals.find(function (d) { return d.id === id; }); }
  var usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  function money(n) { return usd.format(Math.round(n)); }
  function short(n) {
    if (Math.abs(n) >= 1e6) return "$" + (n / 1e6).toFixed(2).replace(/0$/, "") + "M";
    if (Math.abs(n) >= 1e3) return "$" + Math.round(n / 1e3) + "k";
    return money(n);
  }
  var MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function day(iso) {
    if (!iso) return "—";
    var p = iso.split("-");
    var s = MON[Number(p[1]) - 1] + " " + p[2];
    return p[0] === "2026" ? s : s + ", " + p[0];
  }
  function sum(a) { return a.reduce(function (x, y) { return x + y; }, 0); }
  function avatar(p, size) { return '<span class="avatar' + (size ? " " + size : "") + '" style="background:' + p.color + '" aria-hidden="true">' + esc(p.initials) + "</span>"; }
  function healthBand(h) { return h >= 70 ? ["good", "Strong"] : h >= 50 ? ["warn", "Watch"] : ["crit", "Risk"]; }
  function stagePill(st) {
    var map = { submitted: ["", "Submitted"], review: ["warn", "In review"], approved: ["cobalt", "Approved"], cosell: ["tangerine", "Co-selling"], won: ["good", "Closed won"] };
    var m = map[st]; return '<span class="pill ' + m[0] + '">' + m[1] + "</span>";
  }
  function statusPill(s) {
    var map = { Recruiting: "", Onboarding: "warn", Enabling: "cobalt", "Co-selling": "tangerine", Growing: "good" };
    return '<span class="pill ' + map[s] + '">' + s + "</span>";
  }
  function kindPill(k) { return '<span class="pill plain ' + (k === "Sourced" ? "cobalt" : k === "Influenced" ? "tangerine" : "") + '">' + k + "</span>"; }
  function kindColor(k) { return k === "Sourced" ? "var(--cobalt)" : k === "Influenced" ? "var(--tangerine)" : "var(--ink-2)"; }
  function spark(arr, color, w, h) {
    w = w || 64; h = h || 20;
    var pts = arr.filter(function (v) { return v > 0; });
    if (pts.length < 2) return '<svg viewBox="0 0 ' + w + " " + h + '" aria-hidden="true"></svg>';
    var min = Math.min.apply(null, pts) - 2, max = Math.max.apply(null, pts) + 2;
    var xy = pts.map(function (v, i) { return [2 + (i * (w - 4)) / (pts.length - 1), h - 2 - ((v - min) / (max - min)) * (h - 4)]; });
    var last = xy[xy.length - 1];
    return '<svg viewBox="0 0 ' + w + " " + h + '" aria-hidden="true"><polyline fill="none" stroke="' + color + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" points="' +
      xy.map(function (p) { return p[0].toFixed(1) + "," + p[1].toFixed(1); }).join(" ") + '"/><circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="2.6" fill="' + color + '"/></svg>';
  }
  function healthCell(p) {
    if (!p.health) return '<span class="hint">Not scored yet</span>';
    var b = healthBand(p.health);
    return '<span class="health">' + spark(p.trend, "var(--" + b[0] + ")") + p.health + "</span>";
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast"; t.textContent = msg;
    $("#toasts").appendChild(t);
    setTimeout(function () { t.remove(); }, 3600);
  }

  var ICON = {
    home: "M3 9l7-6 7 6v8a1 1 0 0 1-1 1h-4v-5H8v5H4a1 1 0 0 1-1-1z",
    inbox: "M3 11l2-7h10l2 7v5H3z M3 11h4l1 2h4l1-2h4",
    users: "M7 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M1.5 17c.5-3 3-4.5 5.5-4.5s5 1.5 5.5 4.5 M13.5 9a2.5 2.5 0 1 0 0-5 M14.5 12.5c2 .3 3.6 1.7 4 4.5",
    book: "M3 4h5a2 2 0 0 1 2 2v11a2 2 0 0 0-2-2H3z M17 4h-5a2 2 0 0 0-2 2v11a2 2 0 0 1 2-2h5z",
    mega: "M3 8v4h3l6 4V4L6 8z M15 7.5a3 3 0 0 1 0 5",
    board: "M3 3h4v14H3z M8.5 3h4v9h-4z M14 3h3v6h-3z",
    overlap: "M12 10a5 5 0 1 1-10 0 5 5 0 0 1 10 0z M18 10a5 5 0 1 1-10 0 5 5 0 0 1 10 0z",
    ledger: "M5 2h10v16H5z M8 6h4 M8 10h4 M8 14h2",
    coin: "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14z M12.5 7.5c-.5-.8-1.4-1.2-2.5-1.2-1.4 0-2.5.7-2.5 1.8 0 2.6 5 1.4 5 4 0 1.1-1.1 1.8-2.5 1.8-1.1 0-2-.4-2.5-1.2 M10 5v1.3 M10 13.7V15",
    plus: "M10 4v12 M4 10h12"
  };
  function icon(n) { return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="' + ICON[n] + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; }

  /* ---------------- Domain logic ---------------- */
  var WEIGHT = { Sourced: 50, Influenced: 30, Assisted: 20 };
  // Share of credit per partner on a deal under an attribution model. Returns { partnerId: share }.
  function credit(d, model) {
    var t = d.touches, out = {};
    if (!t.length || model === "sourced") { out[d.partner] = 1; return out; }
    if (model === "first") {
      var first = t.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; })[0];
      out[first.p] = 1; return out;
    }
    if (model === "even") {
      var ids = Array.from(new Set(t.map(function (x) { return x.p; })));
      ids.forEach(function (id) { out[id] = 1 / ids.length; }); return out;
    }
    var total = 0;
    t.forEach(function (x) { out[x.p] = (out[x.p] || 0) + WEIGHT[x.kind]; total += WEIGHT[x.kind]; });
    Object.keys(out).forEach(function (k) { out[k] = out[k] / total; });
    return out;
  }
  // Strongest credit type a partner earned on a deal (decides the commission rate)
  function bestKind(d, pid) {
    var kinds = d.touches.filter(function (x) { return x.p === pid; }).map(function (x) { return x.kind; });
    return kinds.indexOf("Sourced") > -1 ? "Sourced" : kinds.indexOf("Influenced") > -1 ? "Influenced" : "Assisted";
  }
  var payoutStatus = {}; // statement id -> "Approved"
  function statements() {
    var out = [];
    D.deals.filter(function (d) { return d.stage === "won"; }).forEach(function (d) {
      var c = credit(d, "weighted");
      Object.keys(c).forEach(function (pid) {
        var kind = bestKind(d, pid), rate = D.rates[kind];
        var id = d.id + "-" + pid;
        out.push({ id: id, deal: d, partner: P(pid), share: c[pid], kind: kind, rate: rate, amount: d.amount * c[pid] * rate, status: payoutStatus[id] || "Ready for approval" });
      });
    });
    return out.sort(function (a, b) { return b.amount - a.amount; });
  }
  function dealsFor(pid) { return D.deals.filter(function (d) { return d.partner === pid || d.touches.some(function (t) { return t.p === pid; }); }); }

  /* ---------------- Navigation ---------------- */
  var NAV_VENDOR = [
    { items: [{ id: "home", label: "Home", icon: "home" }] },
    { group: "Recruit and onboard", items: [{ id: "recruit", label: "Applications", icon: "inbox", count: function () { return D.applications.length; } }, { id: "partners", label: "Partners", icon: "users", count: function () { return D.partners.length; } }] },
    { group: "Enable and market", items: [{ id: "enablement", label: "Enablement", icon: "book" }, { id: "comarketing", label: "Co-marketing", icon: "mega", count: function () { return D.mdf.filter(function (m) { return m.status === "Pending"; }).length; } }] },
    { group: "Co-sell", items: [{ id: "pipeline", label: "Deal registrations", icon: "board", hot: true, count: function () { return D.deals.filter(function (d) { return d.stage === "submitted" || d.stage === "review"; }).length; } }, { id: "overlap", label: "Overlap Radar", icon: "overlap" }] },
    { group: "Reward and grow", items: [{ id: "ledger", label: "Partner Ledger", icon: "ledger" }, { id: "payouts", label: "Payouts", icon: "coin", count: function () { return statements().filter(function (s) { return s.status !== "Approved"; }).length; } }] }
  ];
  var NAV_PARTNER = [
    { group: "Brightpath × Fieldnote", items: [{ id: "p-home", label: "Home", icon: "home" }, { id: "p-register", label: "Register a deal", icon: "plus" }, { id: "p-deals", label: "My deals", icon: "board" }, { id: "p-earnings", label: "Earnings", icon: "coin" }, { id: "p-learn", label: "Learn", icon: "book" }] }
  ];

  function renderNav(route) {
    var partner = route.indexOf("p-") === 0;
    document.body.classList.toggle("partner-mode", partner);
    $("#mode-vendor").setAttribute("aria-pressed", String(!partner));
    $("#mode-partner").setAttribute("aria-pressed", String(partner));
    var groups = partner ? NAV_PARTNER : NAV_VENDOR;
    $("#side-nav").innerHTML = groups.map(function (g) {
      return (g.group ? '<div class="nav-group">' + g.group + "</div>" : "") + g.items.map(function (it) {
        var c = it.count ? it.count() : null;
        return '<a class="nav-item" href="#' + it.id + '"' + (it.id === route ? ' aria-current="page"' : "") + ">" + icon(it.icon) + "<span>" + it.label + "</span>" +
          (c ? '<span class="count' + (it.hot ? " hot" : "") + '">' + c + "</span>" : "") + "</a>";
      }).join("");
    }).join("");
    var me = P(ME);
    $("#side-foot").innerHTML = partner
      ? avatar(me) + "<div><b>" + esc(me.contacts[0][0]) + "</b><small>" + esc(me.name) + "</small></div>"
      : '<span class="avatar" style="background:var(--ink)">' + D.workspace.user.initials + "</span><div><b>" + D.workspace.user.name + "</b><small>" + D.workspace.user.role + "</small></div>";
  }

  /* ---------------- Views: vendor ---------------- */
  var VIEWS = {};

  VIEWS.home = function () {
    var srcY = sum(D.sourcedByMonth) * 1000, infY = sum(D.influencedByMonth) * 1000;
    var n = D.sourcedByMonth.length;
    var srcD = Math.round((D.sourcedByMonth[n - 1] / D.sourcedByMonth[n - 2] - 1) * 100);
    var infD = Math.round((D.influencedByMonth[n - 1] / D.influencedByMonth[n - 2] - 1) * 100);
    var pending = D.deals.filter(function (d) { return d.stage === "submitted" || d.stage === "review"; });
    var conflicts = D.deals.filter(function (d) { return d.conflict; });
    var active = D.partners.filter(function (p) { return p.status === "Co-selling" || p.status === "Growing"; });
    var risk = D.partners.filter(function (p) { return p.health && p.health < 50; });

    var attention = [];
    conflicts.forEach(function (d) {
      attention.push({ sev: "crit", title: d.account + ": " + (d.conflict.kind === "partner" ? "two partners registered" : "AE already owns this account"), sub: d.conflict.text, open: "deal:" + d.id });
    });
    risk.forEach(function (p) { attention.push({ sev: "warn", title: p.name + " health is " + p.health, sub: p.lastActivity, open: "partner:" + p.id }); });
    var st = statements().filter(function (s) { return s.status !== "Approved"; });
    if (st.length) attention.push({ sev: "info", title: st.length + " payout statements ready (" + money(sum(st.map(function (s) { return s.amount; }))) + ")", sub: "Calculated from deals closed in October", open: "#payouts" });
    var hi = D.applications.filter(function (a) { return a.fit >= 75; });
    if (hi.length) attention.push({ sev: "good", title: hi.length + " high-fit partner applications", sub: hi.map(function (a) { return a.name; }).join(", "), open: "#recruit" });
    var mdf = D.mdf.filter(function (m) { return m.status === "Pending"; });
    if (mdf.length) attention.push({ sev: "info", title: mdf.length + " MDF requests waiting (" + money(sum(mdf.map(function (m) { return m.amount; }))) + ")", sub: mdf.map(function (m) { return P(m.partner).name; }).join(", "), open: "#comarketing" });

    var counts = D.statuses.map(function (s) { return D.partners.filter(function (p) { return p.status === s; }).length; });
    var maxC = Math.max.apply(null, counts);
    var top = D.partners.slice().sort(function (a, b) { return (b.sourced + b.influenced) - (a.sourced + a.influenced); }).slice(0, 5);
    var touches = [];
    D.deals.forEach(function (d) { d.touches.forEach(function (t) { touches.push({ t: t, d: d }); }); });
    touches.sort(function (a, b) { return a.t.date < b.t.date ? 1 : -1; });

    return '<div class="page-head"><div><h1>Good morning, Maya</h1><p>Here is the Fieldnote partner program on Wednesday, November 11.</p></div>' +
      '<div class="actions"><button class="btn sm" data-act="invite">Invite a partner</button><button class="btn sm primary" data-ask="Summarize partner revenue this quarter">Summarize with Copilot</button></div></div>' +
      '<div class="grid g-4">' +
      kpi("Partner-sourced ARR, this year", short(srcY), '<span class="swatch" style="background:var(--cobalt)"></span><span class="up">+' + srcD + "%</span> October vs September") +
      kpi("Partner-influenced ARR, this year", short(infY), '<span class="swatch" style="background:var(--tangerine)"></span><span class="up">+' + infD + "%</span> October vs September") +
      kpi("Registrations to review", String(pending.length), '<span class="down">' + conflicts.length + " with conflicts</span> · median review 6 hrs") +
      kpi("Active partners", active.length + " of " + D.partners.length, '<span class="down">' + risk.length + " at risk</span> · " + D.partners.filter(function (p) { return p.status === "Onboarding"; }).length + " onboarding") +
      "</div>" +
      '<div class="grid g-main" style="margin-top:16px">' +
      '<section class="card chart-card"><div class="card-head"><div><h2>Partner revenue by month</h2><div class="sub">Closed-won ARR credited to partners, 2026</div></div>' +
      '<div class="legend"><span><i style="background:var(--cobalt)"></i>Sourced</span><span><i style="background:var(--tangerine)"></i>Influenced</span></div></div>' +
      '<div class="chart" id="rev-chart"></div>' +
      '<div class="chart-foot"><div><span>Best month</span><b>' + D.months[n - 1] + " · $" + (D.sourcedByMonth[n - 1] + D.influencedByMonth[n - 1]) + "k</b></div>" +
      "<div><span>Sourced share of partner ARR</span><b>" + Math.round((srcY / (srcY + infY)) * 100) + "%</b></div>" +
      "<div><span>Growth, " + D.months[0] + " to " + D.months[n - 1] + "</span><b>" + ((D.sourcedByMonth[n - 1] + D.influencedByMonth[n - 1]) / (D.sourcedByMonth[0] + D.influencedByMonth[0])).toFixed(1) + "×</b></div></div></section>" +
      '<section class="card"><div class="card-head"><h2>Needs your attention</h2><span class="sub">' + attention.length + " items</span></div><div class=\"list\">" +
      attention.map(function (a) {
        return '<div class="row clickable" role="button" tabindex="0" data-open="' + a.open + '"><span class="sev ' + a.sev + '"></span><div class="grow"><b>' + esc(a.title) + "</b><small>" + esc(a.sub) + "</small></div></div>";
      }).join("") + "</div></section></div>" +
      '<div class="grid g-3" style="margin-top:16px">' +
      '<section class="card"><div class="card-head"><h2>Partners by lifecycle stage</h2><a class="sub" href="#partners">View all</a></div><div class="funnel">' +
      D.statuses.map(function (s, i) {
        return '<div class="funnel-row"><span>' + s + '</span><div class="track"><div class="fill" style="width:' + (counts[i] / maxC) * 100 + '%"></div></div><span class="n">' + counts[i] + "</span></div>";
      }).join("") + '</div><p class="hint" style="margin-top:12px">Plus ' + D.applications.length + " applications waiting in Recruit.</p></section>" +
      '<section class="card"><div class="card-head"><h2>Top partners</h2><span class="sub">Sourced + influenced ARR</span></div><div class="list">' +
      top.map(function (p) {
        return '<div class="row clickable" role="button" tabindex="0" data-open="partner:' + p.id + '">' + avatar(p) + '<div class="grow"><b>' + esc(p.name) + "</b><small>" + p.type + " · " + p.tier + '</small></div><span class="num">' + short(p.sourced + p.influenced) + "</span></div>";
      }).join("") + "</div></section>" +
      '<section class="card"><div class="card-head"><h2>Latest in the Ledger</h2><a class="sub" href="#ledger">Open Ledger</a></div><div class="list">' +
      touches.slice(0, 5).map(function (x) {
        var p = P(x.t.p);
        return '<div class="row clickable" role="button" tabindex="0" data-open="deal:' + x.d.id + '">' + avatar(p, "sm") + '<div class="grow"><b>' + esc(p.name) + " · " + esc(x.d.account) + "</b><small>" + esc(x.t.what) + "</small></div>" + kindPill(x.t.kind) + "</div>";
      }).join("") + "</div></section></div>";
  };
  function kpi(label, value, foot) { return '<section class="card kpi"><span class="label">' + label + '</span><span class="value">' + value + '</span><span class="foot">' + foot + "</span></section>"; }

  function drawRevenueChart() {
    var el = $("#rev-chart"); if (!el) return;
    var W = 640, H = 250, L = 46, R = 10, T = 18, B = 26;
    var s = D.sourcedByMonth, inf = D.influencedByMonth, n = s.length;
    var max = Math.max.apply(null, s.map(function (v, i) { return v + inf[i]; }));
    var yMax = Math.ceil(max / 200) * 200;
    var y = function (v) { return T + (H - T - B) * (1 - v / yMax); };
    var band = (W - L - R) / n, bw = band * 0.56;
    var g = "";
    for (var t = 0; t <= yMax; t += 200) {
      g += '<line class="grid-line" x1="' + L + '" x2="' + (W - R) + '" y1="' + y(t) + '" y2="' + y(t) + '"/>' +
        '<text class="axis" x="' + (L - 8) + '" y="' + (y(t) + 4) + '" text-anchor="end">' + (t ? "$" + t + "k" : "$0") + "</text>";
    }
    function topRound(x, y0, w, h, r) {
      r = Math.min(r, h, w / 2);
      return "M" + x + "," + (y0 + h) + " V" + (y0 + r) + " Q" + x + "," + y0 + " " + (x + r) + "," + y0 + " H" + (x + w - r) + " Q" + (x + w) + "," + y0 + " " + (x + w) + "," + (y0 + r) + " V" + (y0 + h) + " Z";
    }
    var bars = "";
    for (var i = 0; i < n; i++) {
      var x = L + band * i + (band - bw) / 2;
      var ys = y(s[i]), yi = y(s[i] + inf[i]);
      var base = y(0);
      bars += '<g class="bar" data-i="' + i + '">' +
        '<rect x="' + x + '" y="' + ys + '" width="' + bw + '" height="' + (base - ys) + '" fill="var(--cobalt)"/>' +
        '<path d="' + topRound(x, yi, bw, Math.max(0, ys - yi - 2), 4) + '" fill="var(--tangerine)"/>' +
        '<rect class="hit" x="' + (L + band * i) + '" y="' + T + '" width="' + band + '" height="' + (H - T - B) + '"/></g>' +
        '<text class="axis" x="' + (x + bw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">' + D.months[i] + "</text>";
    }
    var lx = L + band * (n - 1) + band / 2, ly = y(s[n - 1] + inf[n - 1]) - 6;
    var label = '<text x="' + lx + '" y="' + ly + '" text-anchor="middle" style="fill:var(--ink);font:600 11px var(--mono)">$' + (s[n - 1] + inf[n - 1]) + "k</text>";
    el.innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" style="height:auto" role="img" aria-label="Stacked bars of partner-sourced and partner-influenced ARR from January to October. October is the highest month at $' + (s[n - 1] + inf[n - 1]) + 'k.">' + g + bars + label + "</svg>";
    var tip = document.createElement("div"); tip.className = "tip"; tip.hidden = true; el.appendChild(tip);
    el.querySelectorAll("g.bar").forEach(function (b) {
      b.addEventListener("mouseenter", function () {
        var i = Number(b.getAttribute("data-i"));
        var box = el.getBoundingClientRect(), svgBox = el.querySelector("svg").getBoundingClientRect();
        var k = svgBox.width / W;
        tip.innerHTML = "<b>" + D.months[i] + " 2026</b><br>Sourced <b>$" + s[i] + "k</b><br>Influenced <b>$" + inf[i] + "k</b><br>Total <b>$" + (s[i] + inf[i]) + "k</b>";
        tip.style.left = (svgBox.left - box.left + (L + band * i + band / 2) * k) + "px";
        tip.style.top = (svgBox.top - box.top + y(s[i] + inf[i]) * k - 8) + "px";
        tip.hidden = false;
      });
      b.addEventListener("mouseleave", function () { tip.hidden = true; });
    });
  }

  var partnerFilter = "All";
  VIEWS.partners = function () {
    var list = D.partners.filter(function (p) { return partnerFilter === "All" || (partnerFilter === "At risk" ? p.health && p.health < 50 : p.status === partnerFilter); });
    var chips = ["All"].concat(D.statuses).concat(["At risk"]).map(function (s) {
      var c = s === "All" ? D.partners.length : s === "At risk" ? D.partners.filter(function (p) { return p.health && p.health < 50; }).length : D.partners.filter(function (p) { return p.status === s; }).length;
      return '<button class="chip" data-filter="' + s + '" aria-pressed="' + (s === partnerFilter) + '">' + s + '<span class="c">' + c + "</span></button>";
    }).join("");
    return '<div class="page-head"><div><h1>Partners</h1><p>Every partner, where they are in the lifecycle, and how healthy the relationship is.</p></div>' +
      '<div class="actions"><button class="btn sm" data-act="import">Import CSV</button><button class="btn sm primary" data-act="invite">Invite a partner</button></div></div>' +
      '<div class="chips" role="group" aria-label="Filter by lifecycle stage">' + chips + "</div>" +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Partner</th><th>Tier</th><th>Stage</th><th>Pulse health</th><th class="num">Sourced ARR</th><th class="num">Influenced ARR</th><th class="num">Certified</th><th>Owner</th><th>Last activity</th></tr></thead><tbody>' +
      list.map(function (p) {
        return '<tr data-open="partner:' + p.id + '" tabindex="0"><td><span class="cell-name">' + avatar(p) + "<span>" + esc(p.name) + "<small>" + p.type + " · " + p.region + "</small></span></span></td><td>" + p.tier + "</td><td>" + statusPill(p.status) + "</td><td>" + healthCell(p) +
          '</td><td class="num">' + (p.sourced ? money(p.sourced) : "—") + '</td><td class="num">' + (p.influenced ? money(p.influenced) : "—") + '</td><td class="num">' + p.certified + "</td><td>" + p.owner + '</td><td style="color:var(--muted)">' + esc(p.lastActivity) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      (list.length ? "" : '<div class="empty-state">No partners in this stage yet.</div>');
  };

  VIEWS.recruit = function () {
    return '<div class="page-head"><div><h1>Applications</h1><p>Applicants are scored against your ideal partner profile, using real customer overlap instead of a form answer.</p></div>' +
      '<div class="actions"><button class="btn sm" data-act="form">Copy application form link</button></div></div>' +
      '<div class="grid g-main"><section class="card"><div class="card-head"><h2>Waiting for a decision</h2><span class="sub">Sorted by fit</span></div><div class="list">' +
      (D.applications.length ? D.applications.slice().sort(function (a, b) { return b.fit - a.fit; }).map(function (a) {
        var b = a.fit >= 75 ? "good" : a.fit >= 55 ? "warn" : "crit";
        return '<div class="row" style="flex-wrap:wrap"><span class="sev ' + b + '"></span><div class="grow"><b>' + esc(a.name) + "</b><small>" + a.type + " · " + a.region + " · " + esc(a.source) + '</small><small style="color:var(--ink-2);white-space:normal">' + esc(a.note) + "</small></div>" +
          '<div style="display:grid;gap:4px;justify-items:end"><span class="num" style="font-weight:600">' + a.fit + '<span class="hint"> fit</span></span><span class="hint">' + a.overlap + " shared customers</span></div>" +
          '<div style="display:flex;gap:6px"><button class="btn sm" data-decline="' + a.id + '">Decline</button><button class="btn sm cobalt" data-accept="' + a.id + '">Accept</button></div></div>';
      }).join("") : '<div class="empty-state">No applications waiting. Share your application form to recruit more partners.</div>') +
      "</div></section>" +
      '<section class="card"><div class="card-head"><h2>Ideal partner profile</h2><button class="btn sm ghost" data-act="icp">Edit</button></div>' +
      '<dl class="kv"><dt>Shared customers</dt><dd>10 or more (weight 35%)</dd><dt>Segments</dt><dd>Logistics, healthcare, financial services</dd><dt>Regions</dt><dd>Gaps in APAC and DACH get a boost</dd><dt>Partner types</dt><dd>Systems integrators, agencies, technology</dd><dt>Practice size</dt><dd>5+ client-facing consultants</dd></dl>' +
      '<div class="callout info" style="margin-top:14px">Accepted partners move to Onboarding. Covalent sends the program agreement for e-signature and opens a shared Slack channel.</div></section></div>';
  };

  var dragId = null;
  VIEWS.pipeline = function () {
    var week = D.deals.filter(function (d) { return d.submitted >= "2026-11-04"; });
    var byVia = {};
    week.forEach(function (d) { byVia[d.via] = (byVia[d.via] || 0) + 1; });
    var viaText = Object.keys(byVia).sort(function (a, b) { return byVia[b] - byVia[a]; }).map(function (k) { return byVia[k] + " from " + k; }).join(", ");
    return '<div class="page-head"><div><h1>Deal registrations</h1><p>Partners registered ' + week.length + " deals this week: " + viaText + ". Drag cards between stages or open one to review.</p></div>" +
      '<div class="actions"><button class="btn sm" data-act="rules">Approval rules</button><button class="btn sm primary" data-act="newreg">Register on behalf of a partner</button></div></div>' +
      '<div class="board">' + D.stages.map(function (s) {
        var ds = D.deals.filter(function (d) { return d.stage === s.id; });
        return '<section class="col" data-col="' + s.id + '"><div class="col-head"><span>' + s.name + " · " + ds.length + '</span><span class="sum">' + short(sum(ds.map(function (d) { return d.amount; }))) + "</span></div>" +
          ds.map(dealCard).join("") + "</section>";
      }).join("") + "</div>";
  };
  function dealCard(d) {
    var p = P(d.partner);
    var conflict = d.conflict ? '<span class="pill crit">' + (d.conflict.kind === "partner" ? "2 partners" : "AE owns") + "</span>" : (d.stage === "review" || d.stage === "submitted") ? '<span class="pill good">No conflict</span>' : "";
    var others = Array.from(new Set(d.touches.map(function (t) { return t.p; }))).filter(function (x) { return x !== d.partner; }).length;
    var acts = (d.stage === "submitted" || d.stage === "review") ? '<div class="acts"><button class="btn sm cobalt" data-approve="' + d.id + '">Approve</button><button class="btn sm" data-open="deal:' + d.id + '">Review</button></div>' : "";
    return '<article class="deal" draggable="true" data-deal="' + d.id + '" tabindex="0"><div class="t"><b>' + esc(d.account) + '</b><span class="amt">' + short(d.amount) + "</span></div>" +
      '<div class="meta">' + avatar(p, "sm") + "<span>" + esc(p.name) + "</span>" + (others ? '<span class="pill plain">+' + others + " partner" + (others > 1 ? "s" : "") + "</span>" : "") + "</div>" +
      '<div class="meta"><span class="pill plain">via ' + d.via + "</span>" + conflict + "<span>" + (d.stage === "won" ? "Closed " + day(d.close) : "Close " + day(d.close)) + "</span></div>" + acts + "</article>";
  }

  var ledgerModel = "weighted", ledgerScope = "won", touchFilter = "All";
  var MODEL_TEXT = {
    weighted: "Each touch carries weight by type: sourced 50, influenced 30, assisted 20. A partner's share is its weight over the deal total.",
    first: "All credit goes to the partner with the earliest recorded touch. Simple, but it ignores everyone who helped close.",
    even: "Credit is split evenly across every partner that touched the deal.",
    sourced: "All credit goes to the registering partner. This is what a single CRM field gives you today."
  };
  VIEWS.ledger = function () {
    var scope = D.deals.filter(function (d) { return ledgerScope === "won" ? d.stage === "won" : ledgerScope === "open" ? d.stage === "cosell" || d.stage === "approved" : d.stage === "won" || d.stage === "cosell" || d.stage === "approved"; });
    var credited = {};
    scope.forEach(function (d) { var c = credit(d, ledgerModel); Object.keys(c).forEach(function (k) { credited[k] = (credited[k] || 0) + c[k] * d.amount; }); });
    var rows = Object.keys(credited).map(function (k) { return { p: P(k), v: credited[k] }; }).sort(function (a, b) { return b.v - a.v; });
    var max = rows.length ? rows[0].v : 1;
    var all = [];
    D.deals.forEach(function (d) { d.touches.forEach(function (t) { all.push({ t: t, d: d }); }); });
    all.sort(function (a, b) { return a.t.date < b.t.date ? 1 : -1; });
    var multi = D.deals.filter(function (d) { return new Set(d.touches.map(function (t) { return t.p; })).size > 1; }).length;
    var shown = all.filter(function (x) { return touchFilter === "All" || x.t.kind === touchFilter; });
    function seg(name, val, cur, label) { return '<button data-' + name + '="' + val + '" aria-pressed="' + (val === cur) + '">' + label + "</button>"; }
    return '<div class="page-head"><div><h1>Partner Ledger</h1><p>Every partner touch on every deal, with the evidence. Change the model and see how credit moves.</p></div>' +
      '<div class="actions"><button class="btn sm" data-act="export">Export for finance</button></div></div>' +
      '<div class="grid g-3">' + kpi("Touches recorded", String(all.length), "from Slack, Gong, HubSpot, calendars and partner logs") +
      kpi("Deals with more than one partner", multi + " of " + D.deals.length, "credit a single CRM field would miss") +
      kpi("Partners with credit in view", String(rows.length), MODEL_TEXT[ledgerModel].split(".")[0] + ".") + "</div>" +
      '<section class="card" style="margin-top:16px"><div class="card-head"><div><h2>Credited ARR by partner</h2><div class="sub">' + MODEL_TEXT[ledgerModel] + "</div></div>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><div class="seg" role="group" aria-label="Attribution model">' + seg("model", "weighted", ledgerModel, "Weighted") + seg("model", "first", ledgerModel, "First touch") + seg("model", "even", ledgerModel, "Even split") + seg("model", "sourced", ledgerModel, "Sourced only") + "</div>" +
      '<div class="seg" role="group" aria-label="Deals in scope">' + seg("scope", "won", ledgerScope, "Closed won") + seg("scope", "open", ledgerScope, "Open pipeline") + seg("scope", "all", ledgerScope, "Both") + "</div></div></div>" +
      '<div class="bars">' + rows.map(function (r) {
        return '<div class="bar-row"><span class="nm">' + avatar(r.p, "sm") + "<span>" + esc(r.p.name) + '</span></span><div class="track"><div class="fill" style="width:' + (r.v / max) * 100 + '%"></div></div><span class="v">' + short(r.v) + "</span></div>";
      }).join("") + "</div></section>" +
      '<section class="card" style="margin-top:16px"><div class="card-head"><h2>All touches</h2><div class="chips" style="margin:0">' +
      ["All", "Sourced", "Influenced", "Assisted"].map(function (k) { return '<button class="chip" data-touch="' + k + '" aria-pressed="' + (k === touchFilter) + '">' + k + "</button>"; }).join("") + "</div></div>" +
      '<div class="table-wrap" style="border:0"><table class="data" style="min-width:760px"><thead><tr><th>Date</th><th>Partner</th><th>Deal</th><th>Type</th><th>Evidence</th><th>What happened</th></tr></thead><tbody>' +
      shown.map(function (x) {
        var p = P(x.t.p);
        return '<tr data-open="deal:' + x.d.id + '" tabindex="0"><td class="mono">' + day(x.t.date) + '</td><td><span class="cell-name">' + avatar(p, "sm") + esc(p.name) + "</span></td><td>" + esc(x.d.account) + "</td><td>" + kindPill(x.t.kind) + '</td><td><span class="pill plain">' + x.t.src + '</span></td><td style="white-space:normal;min-width:240px">' + esc(x.t.what) + "</td></tr>";
      }).join("") + "</tbody></table></div></section>";
  };

  var introAsked = {};
  VIEWS.overlap = function () {
    var cols = D.overlapPartners.map(P);
    var withOverlap = D.overlap.filter(function (o) { return cols.some(function (p) { return o.cells[p.id]; }); });
    var value = sum(withOverlap.map(function (o) { return o.amount; }));
    return '<div class="page-head"><div><h1>Overlap Radar</h1><p>Your open opportunities compared with each partner\'s customers and pipeline. Matching uses hashed company domains, so neither side sees the other\'s full list.</p></div>' +
      '<div class="actions"><button class="btn sm" data-act="sharing">Sharing settings</button></div></div>' +
      '<div class="grid g-3">' + kpi("Open opportunities with partner overlap", withOverlap.length + " of " + D.overlap.length, "partners already know these buyers") +
      kpi("Pipeline value with a warm path", short(value), "across " + cols.length + " connected partners") +
      kpi("Intro requests sent", String(Object.keys(introAsked).length), "requests go to the partner's shared channel") + "</div>" +
      '<section class="card" style="margin-top:16px"><div class="card-head"><h2>Open pipeline × partner books</h2><div class="legend"><span><i style="background:var(--cobalt)"></i>Partner customer</span><span><i style="background:var(--cobalt-soft);outline:1px solid var(--rule-strong)"></i>Partner open opp</span><span><i style="background:var(--sunk)"></i>No match</span></div></div>' +
      '<div style="overflow-x:auto"><div class="ov"><div class="ov-row"><span class="ov-h" style="text-align:left">Account · AE</span>' + cols.map(function (p) { return '<span class="ov-h" title="' + esc(p.name) + '">' + esc(p.name.split(" ")[0]) + "</span>"; }).join("") + '<span class="ov-h">Best path</span></div>' +
      D.overlap.map(function (o) {
        var best = cols.find(function (p) { return o.cells[p.id] === "customer"; }) || cols.find(function (p) { return o.cells[p.id] === "opp"; });
        return '<div class="ov-row"><span class="ov-acct"><b>' + esc(o.account) + "</b><small>" + short(o.amount) + " · " + o.ae + "</small></span>" +
          cols.map(function (p) {
            var c = o.cells[p.id] || "none", key = o.account + "|" + p.id;
            if (c === "none") return '<span class="ov-cell none" aria-label="No match">·</span>';
            return '<button class="ov-cell ' + c + '" data-intro="' + esc(key) + '" title="Ask ' + esc(p.name) + ' for an intro">' + (introAsked[key] ? "Asked ✓" : c === "customer" ? "Customer" : "Open opp") + "</button>";
          }).join("") +
          '<span class="hint" style="text-align:center">' + (best ? esc(best.name.split(" ")[0]) : "No warm path") + "</span></div>";
      }).join("") + '</div></div><p class="hint" style="margin-top:12px">Select a match to ask that partner for an introduction.</p></section>';
  };

  VIEWS.enablement = function () {
    var cert = sum(D.partners.map(function (p) { return p.certified; }));
    var enrolled = sum(D.courses.map(function (c) { return c.enrolled; })), done = sum(D.courses.map(function (c) { return c.completed; }));
    var ranked = D.partners.filter(function (p) { return p.status !== "Recruiting"; }).sort(function (a, b) { return b.certified - a.certified; });
    return '<div class="page-head"><div><h1>Enablement</h1><p>Courses and certifications built from what actually wins deals.</p></div><div class="actions"><button class="btn sm primary" data-act="course">New course</button></div></div>' +
      '<div class="grid g-3">' + kpi("Certified partner sellers", String(cert), "across " + D.partners.filter(function (p) { return p.certified; }).length + " partners") +
      kpi("Course completion", Math.round((done / enrolled) * 100) + "%", done + " of " + enrolled + " enrollments") +
      kpi("Win rate, certified vs. not", "38% vs 19%", "on partner-sourced deals this year") + "</div>" +
      '<div class="grid g-main" style="margin-top:16px"><section class="card"><div class="card-head"><h2>Courses</h2></div><div class="list">' +
      D.courses.map(function (c) {
        var pct = Math.round((c.completed / c.enrolled) * 100);
        return '<div class="row" style="flex-wrap:wrap"><div class="grow"><b>' + esc(c.name) + (c.required ? ' <span class="pill plain cobalt">Required</span>' : "") + "</b><small>" + c.minutes + " min · " + c.enrolled + " enrolled</small></div>" +
          '<div style="width:min(220px,100%);display:grid;gap:4px"><div class="prog"><div style="width:' + pct + '%"></div></div><span class="hint">' + c.completed + " completed · " + pct + "%</span></div></div>";
      }).join("") + "</div></section>" +
      '<section class="card"><div class="card-head"><h2>Assets that win</h2><span class="sub">Win rate when used in a deal</span></div><div class="bars">' +
      D.assets.map(function (a) { return '<div class="bar-row" style="grid-template-columns:minmax(0,1.3fr) minmax(0,1fr) 44px"><span class="nm"><span>' + esc(a.name) + '</span></span><div class="track"><div class="fill" style="width:' + a.winRate * 1.6 + '%"></div></div><span class="v">' + a.winRate + "%</span></div>"; }).join("") +
      '</div><p class="hint" style="margin-top:12px">Usage counted from partner downloads and shares in deal rooms.</p></section></div>' +
      '<section class="card" style="margin-top:16px"><div class="card-head"><h2>Certified sellers by partner</h2></div><div class="bars">' +
      ranked.map(function (p) { return '<div class="bar-row"><span class="nm">' + avatar(p, "sm") + "<span>" + esc(p.name) + '</span></span><div class="track"><div class="fill" style="width:' + (p.certified / ranked[0].certified) * 100 + '%"></div></div><span class="v">' + p.certified + "</span></div>"; }).join("") + "</div></section>";
  };

  VIEWS.comarketing = function () {
    var budget = 120000;
    var committed = sum(D.mdf.filter(function (m) { return m.status !== "Pending"; }).map(function (m) { return m.amount; }));
    var leads = sum(D.mdf.map(function (m) { return m.leads; }));
    return '<div class="page-head"><div><h1>Co-marketing</h1><p>Market development funds, joint campaigns and the leads they create, all attributed in the Ledger.</p></div><div class="actions"><button class="btn sm primary" data-act="campaign">New campaign kit</button></div></div>' +
      '<div class="grid g-3">' + kpi("MDF committed this half", money(committed), "of " + money(budget) + " budget") + kpi("Leads from partner campaigns", String(leads), "attributed to partners automatically") + kpi("Cost per partner lead", money(committed / Math.max(leads, 1)), "vs $212 for paid social") + "</div>" +
      '<div class="table-wrap" style="margin-top:16px"><table class="data"><thead><tr><th>Partner</th><th>Campaign</th><th class="num">Amount</th><th>Status</th><th class="num">Leads / expected</th><th></th></tr></thead><tbody>' +
      D.mdf.map(function (m) {
        var p = P(m.partner);
        var pill = m.status === "Pending" ? "warn" : m.status === "Approved" ? "cobalt" : "good";
        return '<tr data-open="partner:' + p.id + '"><td><span class="cell-name">' + avatar(p, "sm") + esc(p.name) + "</span></td><td>" + esc(m.name) + '</td><td class="num">' + money(m.amount) + '</td><td><span class="pill ' + pill + '">' + m.status + '</span></td><td class="num">' + m.leads + " / " + m.expected + "</td><td>" +
          (m.status === "Pending" ? '<button class="btn sm cobalt" data-mdf="' + m.id + '">Approve</button>' : "") + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  };

  VIEWS.payouts = function () {
    var st = statements();
    var ready = st.filter(function (s) { return s.status !== "Approved"; });
    var paid = sum(D.payoutsPaid.map(function (x) { return x.amount; }));
    return '<div class="page-head"><div><h1>Payouts</h1><p>Statements are built from closed-won deals and the Partner Ledger. Partners see the same math.</p></div>' +
      '<div class="actions">' + (ready.length ? '<button class="btn sm primary" data-act="approve-all">Approve ' + ready.length + " statements</button>" : '<span class="pill good">All statements approved</span>') + "</div></div>" +
      '<div class="grid g-3">' + kpi("Ready for approval", money(sum(ready.map(function (s) { return s.amount; }))), ready.length + " statements from October closes") + kpi("Paid this quarter", money(paid), D.payoutsPaid.length + " payments via Stripe Connect") + kpi("Close to payout", "3 days", "median, down from 41 days in January") + "</div>" +
      '<div class="table-wrap" style="margin-top:16px"><table class="data"><thead><tr><th>Partner</th><th>Deal</th><th class="num">ARR</th><th>Credit</th><th class="num">Rate</th><th class="num">Payout</th><th>Status</th></tr></thead><tbody>' +
      st.map(function (s) {
        return '<tr data-open="deal:' + s.deal.id + '"><td><span class="cell-name">' + avatar(s.partner, "sm") + esc(s.partner.name) + "</span></td><td>" + esc(s.deal.account) + '</td><td class="num">' + money(s.deal.amount) + "</td><td>" + kindPill(s.kind) + ' <span class="mono">' + Math.round(s.share * 100) + '%</span></td><td class="num">' + Math.round(s.rate * 100) + '%</td><td class="num"><b>' + money(s.amount) + '</b></td><td><span class="pill ' + (s.status === "Approved" ? "good" : "warn") + '">' + s.status + "</span></td></tr>";
      }).join("") + "</tbody></table></div>" +
      '<section class="card" style="margin-top:16px"><div class="card-head"><h2>Recently paid</h2></div><div class="list">' +
      D.payoutsPaid.map(function (x) { var p = P(x.partner); return '<div class="row">' + avatar(p, "sm") + '<div class="grow"><b>' + esc(p.name) + "</b><small>" + esc(x.what) + " · paid " + day(x.date) + '</small></div><span class="num">' + money(x.amount) + "</span></div>"; }).join("") + "</div></section>";
  };

  /* ---------------- Views: partner portal (Brightpath) ---------------- */
  VIEWS["p-home"] = function () {
    var me = P(ME);
    var mine = dealsFor(ME);
    var open = mine.filter(function (d) { return d.stage !== "won"; });
    var earned = sum(statements().filter(function (s) { return s.partner.id === ME; }).map(function (s) { return s.amount; }));
    var intro = D.overlap.filter(function (o) { return o.cells[ME] === "customer"; });
    return '<div class="page-head"><div><h1>Welcome back, ' + esc(me.contacts[0][0].split(" ")[0]) + "</h1><p>Your partnership with Fieldnote. Everything here matches what the Fieldnote team sees.</p></div>" +
      '<div class="actions"><a class="btn sm primary" href="#p-register">Register a deal</a></div></div>' +
      '<div class="grid g-3">' + kpi("Earned this quarter", money(earned), "Next payout Dec 1 via Stripe") + kpi("Open deals", String(open.length), short(sum(open.map(function (d) { return d.amount; }))) + " in pipeline") + kpi("Certified sellers", String(me.certified), "2 more needed for Gold") + "</div>" +
      '<div class="grid g-2" style="margin-top:16px">' +
      '<section class="card"><div class="card-head"><h2>Progress to Gold</h2><span class="pill tangerine plain">Silver partner</span></div>' +
      '<div style="display:grid;gap:14px"><div><div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:6px"><span>Sourced ARR, trailing 12 months</span><span class="mono">' + short(me.sourced) + ' of $500k</span></div><div class="prog"><div style="width:' + Math.round((me.sourced / 500000) * 100) + '%"></div></div></div>' +
      '<div><div style="display:flex;justify-content:space-between;gap:8px;margin-bottom:6px"><span>Certified sellers</span><span class="mono">' + me.certified + ' of 8</span></div><div class="prog"><div style="width:' + Math.round((me.certified / 8) * 100) + '%"></div></div></div>' +
      '<p class="hint">Gold raises your sourced rate from 20% to 25% and unlocks market development funds.</p></div></section>' +
      '<section class="card"><div class="card-head"><h2>Suggested for you</h2></div><div class="list">' +
      intro.map(function (o) { return '<div class="row"><span class="sev info"></span><div class="grow"><b>Fieldnote is selling to ' + esc(o.account) + "</b><small>They are your customer. An intro could earn you influence credit.</small></div><button class=\"btn sm\" data-act=\"offer-intro\">Offer intro</button></div>"; }).join("") +
      '<div class="row"><span class="sev good"></span><div class="grow"><b>Technical Validation Lab</b><small>Two more certified sellers gets you to Gold.</small></div><a class="btn sm" href="#p-learn">Start</a></div></div></section></div>' +
      '<section class="card" style="margin-top:16px"><div class="card-head"><h2>Latest on your deals</h2><a class="sub" href="#p-deals">All deals</a></div><ol class="tl">' +
      mine.slice().sort(function (a, b) { return a.submitted < b.submitted ? 1 : -1; }).slice(0, 4).map(function (d) {
        return '<li><span class="when">' + day(d.submitted) + '</span><span class="dot" style="background:var(--tangerine)"></span><span><b>' + esc(d.account) + "</b><small>" + short(d.amount) + " · AE " + d.ae + "</small></span>" + stagePill(d.stage) + "</li>";
      }).join("") + "</ol></section>";
  };

  var regResult = null;
  VIEWS["p-register"] = function () {
    return '<div class="page-head"><div><h1>Register a deal</h1><p>Fieldnote checks for conflicts the moment you submit, and you hear back within one business day.</p></div></div>' +
      '<div class="grid g-main"><section class="card"><form class="form" id="reg-form">' +
      '<div class="two"><label for="r-account">Company<input id="r-account" required placeholder="e.g. Saltmarsh Foods"></label><label for="r-domain">Website<input id="r-domain" placeholder="saltmarshfoods.com"></label></div>' +
      '<div class="two"><label for="r-contact">Main contact<input id="r-contact" placeholder="Name and title"></label><label for="r-arr">Estimated ARR (USD)<input id="r-arr" type="number" min="0" step="1000" placeholder="45000"></label></div>' +
      '<div class="two"><label for="r-close">Expected close<input id="r-close" type="date" value="2027-03-31"></label><label for="r-role">Your role<select id="r-role"><option>Sourced: I brought the opportunity</option><option>Influenced: I am helping win it</option><option>Assisted: delivery or procurement</option></select></label></div>' +
      '<label for="r-notes">What happened so far<textarea id="r-notes" placeholder="Pain, stakeholders, next step"></textarea></label>' +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn cobalt" type="submit">Submit registration</button><span class="hint" style="align-self:center">Try “Peregrine Bank” to see a conflict check.</span></div>' +
      '</form><div id="reg-result" style="margin-top:14px">' + (regResult || "") + "</div></section>" +
      '<section class="card"><div class="card-head"><h2>Or skip the form</h2></div><div style="display:grid;gap:12px">' +
      '<p>Register from wherever you work. Covalent reads the message and fills in the details.</p>' +
      '<div><span class="eyebrow">Slack or Teams</span><div class="code" style="margin-top:6px">/covalent register Saltmarsh Foods, ~$36k, COO wants a pilot in Q1</div></div>' +
      '<div><span class="eyebrow">Email</span><div class="code" style="margin-top:6px">Forward any thread to deals@fieldnote.covalent.app</div></div>' +
      '<div><span class="eyebrow">Your CRM</span><div class="code" style="margin-top:6px">Tag an opportunity “Fieldnote” in HubSpot or Salesforce</div></div></div></section></div>';
  };

  VIEWS["p-deals"] = function () {
    var mine = dealsFor(ME);
    return '<div class="page-head"><div><h1>My deals</h1><p>Every deal you registered or helped on, with your credit under Fieldnote\'s weighted model.</p></div><div class="actions"><a class="btn sm primary" href="#p-register">Register a deal</a></div></div>' +
      '<div class="table-wrap"><table class="data"><thead><tr><th>Company</th><th>Stage</th><th class="num">ARR</th><th>Your role</th><th class="num">Your credit</th><th class="num">Est. earnings</th><th>Fieldnote AE</th></tr></thead><tbody>' +
      mine.map(function (d) {
        var share = credit(d, "weighted")[ME] || 0, kind = bestKind(d, ME);
        return '<tr data-open="deal:' + d.id + '"><td><b>' + esc(d.account) + "</b></td><td>" + stagePill(d.stage) + '</td><td class="num">' + money(d.amount) + "</td><td>" + kindPill(kind) + '</td><td class="num">' + Math.round(share * 100) + '%</td><td class="num">' + money(d.amount * share * D.rates[kind]) + "</td><td>" + d.ae + "</td></tr>";
      }).join("") + "</tbody></table></div>";
  };

  VIEWS["p-earnings"] = function () {
    var st = statements().filter(function (s) { return s.partner.id === ME; });
    return '<div class="page-head"><div><h1>Earnings</h1><p>How every number is calculated: ARR × your credit share × your rate.</p></div></div>' +
      '<div class="grid g-3">' + kpi("Pending payout", money(sum(st.map(function (s) { return s.amount; }))), "Paid Dec 1 to your Stripe account") + kpi("Your rates (Silver)", "20% / 10%", "sourced / influenced") + kpi("Paid to date", money(41250), "since joining in September 2025") + "</div>" +
      '<section class="card" style="margin-top:16px"><div class="card-head"><h2>Statements</h2></div><div class="list">' +
      st.map(function (s) {
        return '<div class="row" style="flex-wrap:wrap"><div class="grow"><b>' + esc(s.deal.account) + "</b><small>Closed " + day(s.deal.close) + "</small></div>" +
          '<span class="mono">' + money(s.deal.amount) + " × " + Math.round(s.share * 100) + "% × " + Math.round(s.rate * 100) + '%</span><b class="num" style="min-width:90px;text-align:right">' + money(s.amount) + '</b><span class="pill ' + (s.status === "Approved" ? "good" : "warn") + '">' + (s.status === "Approved" ? "Approved" : "Awaiting Fieldnote approval") + "</span></div>";
      }).join("") + '</div><p class="hint" style="margin-top:12px">Questions about a statement? Reply in your shared Slack channel and it is attached to the record.</p></section>';
  };

  VIEWS["p-learn"] = function () {
    var progress = { c1: 100, c2: 80, c3: 25, c4: 100 };
    return '<div class="page-head"><div><h1>Learn</h1><p>Short courses that earn certifications and move you up a tier.</p></div></div><div class="grid g-2">' +
      D.courses.map(function (c) {
        var pct = progress[c.id];
        return '<section class="card" style="display:grid;gap:10px"><div class="card-head" style="margin:0"><h2>' + esc(c.name) + "</h2>" + (pct === 100 ? '<span class="pill good">Certified</span>' : c.required ? '<span class="pill plain cobalt">Required</span>' : "") + "</div>" +
          '<span class="hint">' + c.minutes + ' minutes · counts toward Gold</span><div class="prog"><div style="width:' + pct + '%"></div></div><div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><span class="mono">' + pct + '%</span><button class="btn sm" data-act="course-open">' + (pct === 100 ? "Review" : pct ? "Continue" : "Start") + "</button></div></section>";
      }).join("") + "</div>";
  };

  /* ---------------- Drawers ---------------- */
  function openDrawer(html) {
    var d = $("#drawer");
    d.innerHTML = html; d.hidden = false; $("#scrim").hidden = false;
    var x = d.querySelector(".x"); if (x) x.focus();
  }
  function closeDrawer() { $("#drawer").hidden = true; $("#scrim").hidden = true; }

  function partnerDrawer(id) {
    var p = P(id); if (!p) return;
    var idx = D.statuses.indexOf(p.status);
    var b = p.health ? healthBand(p.health) : ["", "Not scored"];
    var deals = dealsFor(id);
    var f = p.health ? [
      ["Deal flow", Math.max(5, Math.min(100, p.health + (p.sourced > 100000 ? 6 : -8)))],
      ["Enablement", Math.min(100, 20 + p.certified * 9)],
      ["Engagement", Math.max(5, Math.min(100, p.health - 4))],
      ["Payout trust", p.health < 50 ? 72 : 96]
    ] : [];
    var pulse = p.health && p.health < 60
      ? '<div class="callout ' + b[0] + '"><b>Pulse: ' + esc(p.name) + " is slipping.</b><span>" + esc(p.lastActivity) + ". Health fell " + (p.trend[0] - p.health) + " points in 12 weeks.</span><span>Suggested play: book a pipeline review, share the two newest case studies, and offer a co-marketing kit.</span>" +
        '<div class="acts"><button class="btn sm primary" data-act="play">Start re-engagement play</button><button class="btn sm" data-ask="Which partners are going quiet?">Ask Copilot why</button></div></div>'
      : "";
    openDrawer('<div class="drawer-head">' + avatar(p, "lg") + '<div><h2>' + esc(p.name) + '</h2><div class="meta">' + statusPill(p.status) + '<span class="pill plain">' + p.tier + '</span><span class="pill plain">' + p.type + '</span></div></div><button class="btn sm ghost x" data-close>Close</button></div>' +
      '<section class="card"><div class="card-head" style="margin-bottom:10px"><h2>Lifecycle</h2><span class="sub">' + (p.joined ? "Partner since " + day(p.joined) : "Not yet signed") + '</span></div><div class="stepper">' +
      D.statuses.map(function (s, i) { return '<div class="' + (i <= idx ? "on" : "") + (i === idx ? " cur" : "") + '">' + s + "</div>"; }).join("") + "</div></section>" +
      pulse +
      '<div class="grid g-3">' + kpi("Sourced ARR", p.sourced ? short(p.sourced) : "—", "this year") + kpi("Influenced ARR", p.influenced ? short(p.influenced) : "—", "this year") + kpi("Pulse health", p.health || "—", b[1]) + "</div>" +
      (f.length ? '<section class="card"><div class="card-head"><h2>What drives the health score</h2>' + '<span class="health">' + spark(p.trend, "var(--" + b[0] + ")", 90, 24) + "</span></div><div class=\"factors\">" +
        f.map(function (x) { return '<div class="factor"><span>' + x[0] + '</span><div class="prog"><div style="width:' + x[1] + '%"></div></div><span class="v">' + x[1] + "</span></div>"; }).join("") + "</div></section>" : "") +
      '<section class="card"><div class="card-head"><h2>Deals</h2><span class="sub">' + deals.length + "</span></div><div class=\"list\">" +
      (deals.length ? deals.map(function (d) { return '<div class="row clickable" role="button" tabindex="0" data-open="deal:' + d.id + '"><div class="grow"><b>' + esc(d.account) + "</b><small>" + short(d.amount) + " · " + bestKind(d, id) + "</small></div>" + stagePill(d.stage) + "</div>"; }).join("") : '<p class="hint">No deals yet.</p>') + "</div></section>" +
      '<section class="card"><div class="card-head"><h2>Relationship</h2></div><dl class="kv"><dt>Partner manager</dt><dd>' + p.owner + "</dd><dt>Region</dt><dd>" + p.region + "</dd><dt>Works with you via</dt><dd>" + p.channel + "</dd><dt>Contacts</dt><dd>" + p.contacts.map(function (c) { return esc(c[0]) + " (" + esc(c[1]) + ")"; }).join(", ") + "</dd><dt>Last activity</dt><dd>" + esc(p.lastActivity) + "</dd></dl></section>" +
      '<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-act="channel">Open shared channel</button><button class="btn sm" data-act="touch">Log a touch</button><button class="btn sm primary" data-ask="Draft a QBR outline for ' + esc(p.name) + '">Draft QBR with Copilot</button></div>');
  }

  function dealDrawer(id) {
    var d = deal(id); if (!d) return;
    var p = P(d.partner);
    var c = credit(d, "weighted");
    var parts = Object.keys(c).map(function (k) { return { p: P(k), s: c[k], kind: bestKind(d, k) }; }).sort(function (a, b) { return b.s - a.s; });
    var conflict = "";
    if (d.conflict) {
      var other = d.conflict.other ? P(d.conflict.other) : null;
      conflict = '<div class="callout crit"><b>' + (other ? "Two partners registered this account" : "Your AE already owns this opportunity") + "</b><span>" + esc(d.conflict.text) + "</span>" +
        '<div class="acts">' + (other
          ? '<button class="btn sm primary" data-resolve="' + d.id + ':split">Split credit</button><button class="btn sm" data-resolve="' + d.id + ':first">Award to ' + esc(other.name.split(" ")[0]) + " (first)</button>"
          : '<button class="btn sm primary" data-resolve="' + d.id + ':assist">Approve as influence</button><button class="btn sm" data-resolve="' + d.id + ':reject">Decline with note</button>') + "</div></div>";
    } else if (d.stage === "submitted" || d.stage === "review") {
      conflict = '<div class="callout good"><b>No conflict found</b><span>No open opportunity or other registration for this account in HubSpot.</span><div class="acts"><button class="btn sm primary" data-approve="' + d.id + '">Approve registration</button></div></div>';
    }
    var next = { submitted: "review", review: "approved", approved: "cosell", cosell: "won" }[d.stage];
    var payout = d.stage === "won" ? '<section class="card"><div class="card-head"><h2>Payouts from this deal</h2></div><div class="list">' + parts.map(function (x) {
      var r = D.rates[x.kind]; return '<div class="row">' + avatar(x.p, "sm") + '<div class="grow"><b>' + esc(x.p.name) + '</b><small class="mono">' + money(d.amount) + " × " + Math.round(x.s * 100) + "% × " + Math.round(r * 100) + '%</small></div><span class="num">' + money(d.amount * x.s * r) + "</span></div>";
    }).join("") + "</div></section>" : "";
    openDrawer('<div class="drawer-head"><div><span class="eyebrow">Deal · registered via ' + d.via + "</span><h2>" + esc(d.account) + '</h2><div class="meta">' + stagePill(d.stage) + '<span class="pill plain">' + money(d.amount) + " ARR</span></div></div><button class=\"btn sm ghost x\" data-close>Close</button></div>" +
      conflict +
      '<section class="card"><dl class="kv"><dt>Registering partner</dt><dd>' + esc(p.name) + "</dd><dt>Submitted</dt><dd>" + day(d.submitted) + "</dd><dt>" + (d.stage === "won" ? "Closed" : "Expected close") + "</dt><dd>" + day(d.close) + "</dd><dt>Fieldnote AE</dt><dd>" + d.ae + "</dd></dl></section>" +
      '<section class="card"><div class="card-head"><h2>Partner credit</h2><span class="sub">Weighted model</span></div>' +
      '<div style="display:flex;gap:2px;height:12px;border-radius:6px;overflow:hidden;margin-bottom:10px">' + parts.map(function (x) { return '<div style="width:' + x.s * 100 + "%;background:" + kindColor(x.kind) + '"></div>'; }).join("") + "</div>" +
      '<div class="legend">' + parts.map(function (x) { return '<span><i style="background:' + kindColor(x.kind) + '"></i>' + esc(x.p.name) + " · " + x.kind.toLowerCase() + " · " + Math.round(x.s * 100) + "%</span>"; }).join("") + "</div></section>" +
      '<section class="card"><div class="card-head"><h2>Ledger</h2><span class="sub">' + d.touches.length + ' touches</span></div><ol class="tl">' +
      d.touches.slice().sort(function (a, b) { return a.date < b.date ? -1 : 1; }).map(function (t) {
        var tp = P(t.p); return '<li><span class="when">' + day(t.date) + '</span><span class="dot" style="background:' + kindColor(t.kind) + '"></span><span><b>' + esc(tp.name) + "</b><small>" + esc(t.what) + " · " + t.src + "</small></span>" + kindPill(t.kind) + "</li>";
      }).join("") + "</ol></section>" + payout +
      '<div style="display:flex;gap:8px;flex-wrap:wrap">' + (next && !d.conflict ? '<button class="btn sm primary" data-advance="' + d.id + '">Move to ' + D.stages.find(function (s) { return s.id === next; }).name + "</button>" : "") + '<button class="btn sm" data-act="touch">Log a touch</button></div>');
  }

  /* ---------------- Copilot ---------------- */
  var CHIPS = ["Which partners are going quiet?", "Who can help us win Hollis Manufacturing?", "Draft a QBR outline for Brightpath Consulting", "Summarize partner revenue this quarter"];
  function answer(q) {
    var ql = q.toLowerCase();
    if (/quiet|dormant|risk|slipping/.test(ql)) {
      var r = D.partners.filter(function (p) { return p.health && p.health < 60; }).sort(function (a, b) { return a.health - b.health; });
      return "<b>" + r.length + " partners are trending down.</b><ul>" + r.map(function (p) { return "<li><b>" + esc(p.name) + "</b> (" + p.health + "): " + esc(p.lastActivity) + "</li>"; }).join("") + "</ul><p style=\"margin-top:8px\">Start with Meridian Cloud: their health fell 34 points and they still hold 3 Fieldnote customers up for renewal. I drafted a check-in for Sam Lindqvist.</p><div class=\"src\">Sources: Pulse scores, Ledger, enablement records</div>";
    }
    var acct = D.overlap.find(function (o) { return ql.indexOf(o.account.toLowerCase().split(" ")[0]) > -1; });
    if (acct || /win|help|intro/.test(ql)) {
      acct = acct || D.overlap[1];
      var ps = D.overlapPartners.filter(function (id) { return acct.cells[id]; }).map(P);
      return "<b>" + ps.length + " partners have a path into " + esc(acct.account) + ".</b><ul>" + ps.map(function (p) { return "<li><b>" + esc(p.name) + "</b>: " + (acct.cells[p.id] === "customer" ? "current customer relationship" : "working an open opportunity there") + "</li>"; }).join("") +
        "</ul><p style=\"margin-top:8px\">Recommended: ask " + esc(ps[0] ? ps[0].name : "a partner") + " for a reference call before the technical review. Their customers in manufacturing closed 31% faster with a partner reference.</p><div class=\"src\">Sources: Overlap Radar, Ledger history</div>";
    }
    var p = D.partners.find(function (x) { return ql.indexOf(x.name.toLowerCase().split(" ")[0]) > -1; });
    if (p && /qbr|review|outline/.test(ql)) {
      var ds = dealsFor(p.id);
      return "<b>QBR outline: " + esc(p.name) + " × Fieldnote</b><ol><li>Results: " + short(p.sourced) + " sourced, " + short(p.influenced) + " influenced ARR this year</li><li>Pipeline: " + ds.filter(function (d) { return d.stage !== "won"; }).length + " open deals worth " + short(sum(ds.filter(function (d) { return d.stage !== "won"; }).map(function (d) { return d.amount; }))) + "</li><li>Wins: " + (ds.filter(function (d) { return d.stage === "won"; }).map(function (d) { return esc(d.account); }).join(", ") || "none yet") + "</li><li>Enablement: " + p.certified + " certified sellers</li><li>Asks for next quarter: joint campaign, 2 more certifications, intros from Overlap Radar</li></ol><div class=\"src\">Draft saved to the partner record. Both sides can edit it.</div>";
    }
    if (p) {
      return "<b>" + esc(p.name) + "</b> is a " + p.tier + " " + p.type.toLowerCase() + " in " + p.status.toLowerCase() + ". Health " + (p.health || "not scored") + ", " + short(p.sourced) + " sourced and " + short(p.influenced) + " influenced this year. Latest: " + esc(p.lastActivity) + ".";
    }
    if (/payout|pay|commission/.test(ql)) {
      var st = statements().filter(function (s) { return s.status !== "Approved"; });
      return "<b>" + st.length + " statements are ready</b> for " + money(sum(st.map(function (s) { return s.amount; }))) + ". The largest is " + esc(st[0].partner.name) + " for " + esc(st[0].deal.account) + " (" + money(st[0].amount) + "). Nothing is disputed.";
    }
    if (/revenue|quarter|summar/.test(ql)) {
      var q3s = sum(D.sourcedByMonth.slice(6, 9)), q3i = sum(D.influencedByMonth.slice(6, 9));
      return "<b>Partners are having their best stretch of the year.</b><ul><li>Q3: $" + q3s + "k sourced and $" + q3i + "k influenced ARR</li><li>October alone: $" + D.sourcedByMonth[9] + "k sourced and $" + D.influencedByMonth[9] + "k influenced, both monthly highs</li><li>Atlas and Brightpath drove 53% of sourced ARR</li><li>Risk: two partners in Pulse decline hold $99k of open pipeline</li></ul><div class=\"src\">Sources: Ledger, HubSpot closed-won</div>";
    }
    return "In the full product I answer from your Ledger, CRM and partner conversations. In this preview, try asking about quiet partners, a specific account, a QBR, payouts or this quarter's revenue.";
  }
  function ask(q) {
    openCopilot();
    var log = $("#copilot-log");
    log.insertAdjacentHTML("beforeend", '<div class="bubble me">' + esc(q) + "</div>");
    var b = document.createElement("div"); b.className = "bubble ai"; b.textContent = "Reading the Ledger…"; log.appendChild(b);
    log.scrollTop = log.scrollHeight;
    setTimeout(function () { b.innerHTML = answer(q); log.scrollTop = log.scrollHeight; }, 450);
  }
  function openCopilot() {
    var c = $("#copilot");
    if (!c.hidden) return;
    c.hidden = false;
    if (!$("#copilot-log").children.length) {
      $("#copilot-log").innerHTML = '<div class="bubble ai">Hi Maya. I can see every partner, deal, touch and payout in this workspace. What do you need?</div>';
    }
    $("#copilot-chips").innerHTML = CHIPS.map(function (q) { return '<button type="button" data-ask="' + esc(q) + '">' + esc(q) + "</button>"; }).join("");
  }

  /* ---------------- Router ---------------- */
  var current = "home";
  function render() {
    var h = (location.hash || "#home").slice(1);
    if (!VIEWS[h]) h = "home";
    current = h;
    renderNav(h);
    view.innerHTML = VIEWS[h]();
    if (h === "home") drawRevenueChart();
    document.title = "Covalent Workspace";
  }
  function rerender() { var y = view.scrollTop; render(); view.scrollTop = y; }
  window.addEventListener("hashchange", function () { closeDrawer(); render(); view.scrollTop = 0; view.focus({ preventScroll: true }); });

  /* ---------------- Events ---------------- */
  var ACT = {
    invite: "Invite link copied. Partners join through Slack Connect or the portal.",
    import: "Import from CSV maps columns to partner fields and flags duplicates.",
    form: "Application form link copied. Embed it on your partners page.",
    icp: "The ideal partner profile editor is planned for the first release.",
    rules: "Approval rules: auto-approve when there is no conflict and ARR is under $50k.",
    newreg: "Register on behalf opens the same form partners use, with the partner picked first.",
    export: "Export for finance creates a CSV of credited ARR under the selected model.",
    sharing: "Sharing settings control which segments each partner can match against.",
    course: "The course builder turns a deck or recording into lessons and a quiz.",
    campaign: "Campaign kits give partners co-branded pages, emails and tracking links.",
    channel: "Opens the shared Slack Connect channel for this partner.",
    touch: "Log a touch: pick the partner, the type and attach evidence such as a call or email.",
    play: "Re-engagement play started. Sam Lindqvist has a drafted check-in to review.",
    "offer-intro": "Intro offered. Fieldnote's AE gets a note in the shared channel.",
    "course-open": "Courses open in a focused player with progress saved per seller."
  };
  document.addEventListener("click", function (e) {
    var t = e.target.closest("[data-open],[data-act],[data-ask],[data-filter],[data-model],[data-scope],[data-touch],[data-approve],[data-resolve],[data-advance],[data-accept],[data-decline],[data-intro],[data-mdf],[data-close]");
    if (!t) return;
    if (t.hasAttribute("data-close")) return closeDrawer();
    if (t.dataset.approve) {
      e.stopPropagation();
      var d = deal(t.dataset.approve);
      if (d.conflict) return dealDrawer(d.id);
      d.stage = "approved"; closeDrawer(); rerender();
      return toast(d.account + " approved. " + P(d.partner).name + " was notified in " + (d.via === "Portal" ? "the portal" : d.via) + ".");
    }
    if (t.dataset.resolve) {
      var parts = t.dataset.resolve.split(":"), dd = deal(parts[0]), how = parts[1];
      var msg = { split: "Credit split between both partners. Each is notified with the reason.", first: "Awarded to " + (dd.conflict.other ? P(dd.conflict.other).name : "first registrant") + ". The other partner gets influence credit if they stay involved.", assist: "Approved as influence. The AE keeps ownership and the partner earns influence credit.", reject: "Registration declined. The partner sees your note in their channel." }[how];
      if (how === "first" && dd.conflict.other) { dd.partner = dd.conflict.other; }
      if (how === "assist") { dd.touches.forEach(function (x) { x.kind = "Influenced"; }); }
      dd.conflict = null;
      if (how === "reject") { D.deals.splice(D.deals.indexOf(dd), 1); } else { dd.stage = "approved"; }
      closeDrawer(); rerender(); return toast(msg);
    }
    if (t.dataset.advance) {
      var da = deal(t.dataset.advance);
      da.stage = { submitted: "review", review: "approved", approved: "cosell", cosell: "won" }[da.stage];
      if (da.stage === "won") da.close = D.workspace.today;
      rerender(); dealDrawer(da.id);
      return toast(da.account + " moved to " + D.stages.find(function (s) { return s.id === da.stage; }).name + (da.stage === "won" ? ". Payout statements were created." : "."));
    }
    if (t.dataset.accept || t.dataset.decline) {
      var aid = t.dataset.accept || t.dataset.decline;
      var a = D.applications.find(function (x) { return x.id === aid; });
      D.applications = D.applications.filter(function (x) { return x.id !== aid; });
      if (t.dataset.accept) {
        D.partners.push({ id: "n" + aid, name: a.name, initials: a.name.split(" ").map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase(), color: "#475569", type: a.type, tier: "Registered", status: "Onboarding", health: 0, trend: [], sourced: 0, influenced: 0, owner: "Maya Okafor", region: a.region, joined: D.workspace.today, lastActivity: "Agreement sent for e-signature · just now", certified: 0, channel: "Slack Connect", contacts: [["Primary contact", "Partner lead"]] });
        toast(a.name + " moved to Onboarding. The agreement is out for e-signature.");
      } else { toast(a.name + " declined with a polite note."); }
      return rerender();
    }
    if (t.dataset.intro) {
      var k = t.dataset.intro, pp = P(k.split("|")[1]);
      introAsked[k] = true; rerender();
      return toast("Intro request for " + k.split("|")[0] + " sent to " + pp.name + " in your shared channel.");
    }
    if (t.dataset.mdf) {
      var m = D.mdf.find(function (x) { return x.id === t.dataset.mdf; });
      m.status = "Approved"; e.stopPropagation(); rerender();
      return toast(money(m.amount) + " approved for " + P(m.partner).name + ". Claims need proof of execution.");
    }
    if (t.dataset.filter) { partnerFilter = t.dataset.filter; return rerender(); }
    if (t.dataset.model) { ledgerModel = t.dataset.model; return rerender(); }
    if (t.dataset.scope) { ledgerScope = t.dataset.scope; return rerender(); }
    if (t.dataset.touch) { touchFilter = t.dataset.touch; return rerender(); }
    if (t.dataset.ask) { e.preventDefault(); return ask(t.dataset.ask); }
    if (t.dataset.act === "approve-all") {
      statements().forEach(function (s) { payoutStatus[s.id] = "Approved"; });
      rerender(); return toast("Statements approved. Payments go out on Dec 1 via Stripe Connect.");
    }
    if (t.dataset.act) return toast(ACT[t.dataset.act] || "Coming in a later release.");
    if (t.dataset.open) {
      var o = t.dataset.open;
      if (o.charAt(0) === "#") { location.hash = o; return; }
      var bits = o.split(":");
      return bits[0] === "partner" ? partnerDrawer(bits[1]) : dealDrawer(bits[1]);
    }
  });
  // Keyboard activation for rows and cards
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeDrawer(); $("#copilot").hidden = true; $("#search-results").hidden = true; return; }
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") { e.preventDefault(); $("#q").focus(); return; }
    if (e.key === "Enter" && (e.target.matches("[data-open][tabindex]") || e.target.matches(".deal"))) {
      e.preventDefault();
      if (e.target.matches(".deal")) dealDrawer(e.target.dataset.deal); else e.target.click();
    }
  });
  // Card click opens deal unless a button was hit
  view.addEventListener("click", function (e) {
    var card = e.target.closest(".deal");
    if (card && !e.target.closest("button")) dealDrawer(card.dataset.deal);
  });
  $("#scrim").addEventListener("click", closeDrawer);

  // Drag and drop on the pipeline board
  view.addEventListener("dragstart", function (e) {
    var c = e.target.closest && e.target.closest(".deal"); if (!c) return;
    dragId = c.dataset.deal; c.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", dragId); } catch (err) { /* some browsers restrict */ }
  });
  view.addEventListener("dragend", function () { dragId = null; view.querySelectorAll(".dragging,.drop").forEach(function (n) { n.classList.remove("dragging", "drop"); }); });
  view.addEventListener("dragover", function (e) {
    var col = e.target.closest && e.target.closest(".col"); if (!col || !dragId) return;
    e.preventDefault();
    view.querySelectorAll(".col.drop").forEach(function (n) { if (n !== col) n.classList.remove("drop"); });
    col.classList.add("drop");
  });
  view.addEventListener("drop", function (e) {
    var col = e.target.closest && e.target.closest(".col"); if (!col || !dragId) return;
    e.preventDefault();
    var d = deal(dragId), to = col.dataset.col;
    if (d.conflict && (to === "approved" || to === "cosell" || to === "won")) { dragId = null; dealDrawer(d.id); return toast("Resolve the conflict on " + d.account + " before approving."); }
    if (d.stage !== to) { d.stage = to; if (to === "won") d.close = D.workspace.today; toast(d.account + " moved to " + D.stages.find(function (s) { return s.id === to; }).name + "."); }
    dragId = null; rerender();
  });

  // Partner registration form
  view.addEventListener("submit", function (e) {
    if (e.target.id !== "reg-form") return;
    e.preventDefault();
    var name = $("#r-account").value.trim();
    if (!name) { $("#r-account").focus(); regResult = '<div class="callout warn">Add the company name to register a deal.</div>'; $("#reg-result").innerHTML = regResult; return; }
    var lc = name.toLowerCase();
    var existing = D.deals.find(function (d) { return d.account.toLowerCase() === lc; });
    var aeOwned = D.overlap.find(function (o) { return o.account.toLowerCase() === lc; });
    var arr = Number($("#r-arr").value) || 0;
    if (existing) {
      regResult = '<div class="callout crit"><b>Possible conflict</b><span>' + esc(existing.account) + " is already registered (" + stagePill(existing.stage) + '). The Fieldnote team will review and reply in your shared channel. If you are helping on this deal, your touches still count as influence.</span></div>';
    } else if (aeOwned) {
      regResult = '<div class="callout warn"><b>Fieldnote is already talking to ' + esc(aeOwned.account) + "</b><span>Your registration was sent as influence so " + esc(aeOwned.ae) + " can bring you in.</span></div>";
      D.deals.push({ id: "n" + Date.now(), account: name, amount: arr || aeOwned.amount, partner: ME, via: "Portal", stage: "review", submitted: D.workspace.today, close: $("#r-close").value || "2027-03-31", ae: aeOwned.ae, conflict: { kind: "ae", text: aeOwned.ae + " already owns an open opportunity for this account." }, touches: [{ p: ME, date: D.workspace.today, kind: "Influenced", what: $("#r-notes").value || "Registered from the partner portal", src: "Portal" }] });
    } else {
      D.deals.push({ id: "n" + Date.now(), account: name, amount: arr || 30000, partner: ME, via: "Portal", stage: "submitted", submitted: D.workspace.today, close: $("#r-close").value || "2027-03-31", ae: "Unassigned", conflict: null, touches: [{ p: ME, date: D.workspace.today, kind: "Sourced", what: $("#r-notes").value || "Registered from the partner portal", src: "Portal" }] });
      regResult = '<div class="callout good"><b>Registered. No conflict found.</b><span>' + esc(name) + " is protected for 90 days while Fieldnote reviews it. Switch to the Fieldnote team view to see it arrive in Deal registrations.</span></div>";
    }
    rerender();
  });

  // Search
  var q = $("#q"), res = $("#search-results");
  q.addEventListener("input", function () {
    var s = q.value.trim().toLowerCase();
    if (!s) { res.hidden = true; return; }
    var ps = D.partners.filter(function (p) { return p.name.toLowerCase().indexOf(s) > -1; }).slice(0, 5);
    var ds = D.deals.filter(function (d) { return d.account.toLowerCase().indexOf(s) > -1; }).slice(0, 5);
    res.innerHTML = ps.map(function (p) { return '<button type="button" data-open="partner:' + p.id + '">' + avatar(p, "sm") + esc(p.name) + "<small>Partner</small></button>"; }).join("") +
      ds.map(function (d) { return '<button type="button" data-open="deal:' + d.id + '"><span class="avatar sm" style="background:var(--ink-2)">$</span>' + esc(d.account) + "<small>Deal · " + short(d.amount) + "</small></button>"; }).join("") ||
      '<div class="empty">No partners or deals match “' + esc(q.value) + "”.</div>";
    res.hidden = false;
  });
  res.addEventListener("click", function () { res.hidden = true; q.value = ""; });
  document.addEventListener("click", function (e) { if (!e.target.closest(".search")) res.hidden = true; });

  // Mode switch
  $("#mode-vendor").addEventListener("click", function () { location.hash = "home"; });
  $("#mode-partner").addEventListener("click", function () { location.hash = "p-home"; });

  // Copilot
  $("#copilot-btn").addEventListener("click", function () { var c = $("#copilot"); if (c.hidden) openCopilot(); else c.hidden = true; });
  $("#copilot-close").addEventListener("click", function () { $("#copilot").hidden = true; });
  $("#copilot-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#copilot-input").value.trim(); if (!v) return;
    $("#copilot-input").value = ""; ask(v);
  });

  // Theme toggle (remembered per browser when storage is available)
  var root = document.documentElement;
  try { var saved = localStorage.getItem("covalent-theme"); if (saved) root.setAttribute("data-theme", saved); } catch (err) { /* storage unavailable */ }
  $("#theme-btn").addEventListener("click", function () {
    var cur = root.getAttribute("data-theme") || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    var nextTheme = cur === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    try { localStorage.setItem("covalent-theme", nextTheme); } catch (err) { /* storage unavailable */ }
    if (current === "home") drawRevenueChart();
  });

  render();
})();
