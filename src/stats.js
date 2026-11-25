/* ---------- anonymous usage statistics (RYU 2026-11-25, v1.3) ----------
   For the university AI contest: how many devices use the app, which lessons they open, quiz scores.
   No names, no e-mail: each device gets a random id. Events wait in this device's storage and are sent in small
   batches to a Google Sheet (tools/stats/Code.gs, an Apps Script web app); offline they are sent later.
   STATS_URL empty = nothing is recorded. */
const STATS_URL = "https://script.google.com/macros/s/AKfycbzvzWxwoiKKui7T0CPud3mNIoTLaBNLEmjZTJlgqQTCtfrT4SHWZOhJOW0H3c8B_skQeQ/exec";   // RYU 2026-11-25
const ST = (() => {
  const QK = "kolearn-en-stats", IK = "kolearn-en-id", MAX = 400;
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} };
  let id = get(IK);
  if (!id){ id = (crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2)).replace(/-/g, "").slice(0, 16); put(IK, id); }
  const ua = navigator.userAgent;
  const os = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1) ? "iOS" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS/.test(ua) ? "Mac" : /CrOS/.test(ua) ? "ChromeOS" : /Linux/.test(ua) ? "Linux" : "other";
  const dev = /iPad/.test(ua) || (os === "iOS" && !/iPhone|iPod/.test(ua)) || (os === "Android" && !/Mobile/.test(ua)) ? "tablet" : /iPhone|iPod|Mobile/.test(ua) ? "phone" : "computer";
  const pwa = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
  const load = () => { try { const q = JSON.parse(get(QK) || "[]"); return Array.isArray(q) ? q : []; } catch (e) { return []; } };
  const stamp = () => { const d = new Date(), z = -d.getTimezoneOffset(), p = n => String(Math.abs(n)).padStart(2, "0");
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " + p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds()) + (z < 0 ? "-" : "+") + p(z / 60 | 0) + ":" + p(z % 60); };
  let busy = false;
  function log(ev, code, a, b){
    if (!STATS_URL) return;
    const q = load(); q.push([stamp(), ev, code || "", a == null ? "" : a, b == null ? "" : b]);
    put(QK, JSON.stringify(q.slice(-MAX)));
  }
  function send(beacon){
    if (!STATS_URL || busy || !navigator.onLine) return;
    const q = load(); if (!q.length) return;
    const n = Math.min(q.length, 100), body = JSON.stringify({id, v: (window.KO_META || {}).ver || "", dev, os, pwa, lang: navigator.language || "", ev: q.slice(0, n)});
    const done = () => { const r = load(); put(QK, JSON.stringify(r.slice(n))); };
    if (beacon && navigator.sendBeacon){ if (navigator.sendBeacon(STATS_URL, new Blob([body], {type: "text/plain"}))) done(); return; }
    busy = true;   // text/plain + no-cors: no preflight; the answer cannot be read, a network error rejects
    fetch(STATS_URL, {method: "POST", mode: "no-cors", body, keepalive: body.length < 60000}).then(() => { done(); busy = false; if (load().length) setTimeout(send, 2000); }, () => { busy = false; });
  }
  if (STATS_URL){
    log("open", "", dev, pwa ? "installed" : "browser");
    setTimeout(send, 4000); setInterval(send, 60000);
    addEventListener("online", () => send());
    document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") send(true); });
  }
  let last = "";
  return {log, send, lesson(code){ if (code && code !== last){ last = code; log("lesson", code); } }};
})();

/* ---------- public statistics page (도움말 > 사용 통계, RYU 2026-11-25, v1.3) ----------
   Only totals that the sheet's Apps Script adds up (doGet ?stats=1): no device ids, no single person's scores.
   STATS_PUBLIC false = build.js leaves the page out of the menu. Charts are drawn here as SVG (works offline,
   follows the light / dark colors). The last numbers are kept on the device so the page also opens offline. */
const STATS_PUBLIC = true;   // RYU 2026-11-25: show the stats page (도움말 > 사용 통계)
const STP = (() => {
  const CK = "kolearn-en-statspage", NS = "http://www.w3.org/2000/svg";
  const AC = {K1: "var(--k1)", K2: "var(--k2)", K4: "var(--k4)", K5: "var(--k5)", K6: "var(--k6)", K7: "var(--k7)", K8: "var(--k8)", K9: "var(--k9)", LS: "var(--k7)", TP: "var(--k3)", KR: "var(--k5)", HP: "var(--muted)"};
  const PAL = ["var(--k1)", "var(--k2)", "var(--k3)", "var(--k4)", "var(--k6)", "var(--k7)", "var(--k5)", "var(--k8)"];
  const fmt = n => n == null || n === "" ? "–" : Number(n).toLocaleString("en-US");
  function el(tag, at, ...k){ const e = document.createElement(tag);   // own small builder: app.js keeps its h() inside its own scope
    for (const n in at || {}) e.setAttribute(n, at[n]);
    for (const c of k.flat(9)) if (c != null && c !== false) e.append(c.nodeType ? c : String(c));
    return e; }
  function svg(w, hgt, kids){ const s = document.createElementNS(NS, "svg"); s.setAttribute("viewBox", "0 0 " + w + " " + hgt); s.setAttribute("class", "stsvg"); s.setAttribute("role", "img");
    for (const k of kids.flat()) if (k) s.appendChild(k); return s; }
  function sv(tag, at, text){ const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (text != null) e.textContent = text; return e; }
  const card = (title, ko, body, wide) => el("section", {class: "stcard" + (wide ? " wide" : "")}, el("h3", null, title, " ", el("span", {class: "ko"}, ko)), body);
  /* bars over time + a line (two series), labels every few columns */
  function timeChart(rows, aName, bName){
    const W = CW, H = Math.round(Math.min(260, Math.max(200, CW * .3))), L = 34, B = 26, T = 12, n = rows.length || 1, bw = (W - L - 8) / n;
    const maxA = Math.max(1, ...rows.map(r => r[1])), maxB = Math.max(1, ...rows.map(r => r[2]));
    const y = (v, m) => T + (H - T - B) * (1 - v / m), k = [];
    for (let g = 0; g <= 4; g++){ const v = Math.round(maxA * g / 4), yy = y(v, maxA); k.push(sv("line", {x1: L, x2: W - 4, y1: yy, y2: yy, class: "stgrid"}), sv("text", {x: L - 6, y: yy + 4, class: "stax", "text-anchor": "end"}, fmt(v))); }
    rows.forEach((r, i) => { const x = L + i * bw, hh = H - B - y(r[1], maxA);
      k.push(sv("rect", {x: x + bw * .15, y: y(r[1], maxA), width: Math.max(1, bw * .7), height: Math.max(0, hh), rx: 2, style: "fill:var(--k1)"}, null));
      k[k.length - 1].appendChild(sv("title", {}, r[0] + " · " + aName + " " + r[1] + " · " + bName + " " + r[2]));
      const step = Math.ceil(n / Math.max(3, Math.floor(CW / 70))); if (i % step === 0 || i === n - 1) k.push(sv("text", {x: x + bw / 2, y: H - 8, class: "stax", "text-anchor": "middle"}, r[0].length > 7 ? r[0].slice(5) : r[0])); });
    const pts = rows.map((r, i) => (L + i * bw + bw / 2) + "," + y(r[2], maxB)).join(" ");
    if (rows.length > 1) k.push(sv("polyline", {points: pts, class: "stline"}));
    rows.forEach((r, i) => k.push(sv("circle", {cx: L + i * bw + bw / 2, cy: y(r[2], maxB), r: rows.length > 40 ? 1.5 : 3, class: "stdot"})));
    return el("div", null, svg(W, H, k), el("div", {class: "stleg"}, el("span", {class: "sw", style: "background:var(--k1)"}), aName, el("span", {class: "sw ln"}), bName + " (right scale, max " + fmt(maxB) + ")"));
  }
  /* horizontal bars: [label, value, color?, sub-label?] */
  function hbars(rows, unit){
    const max = Math.max(1, ...rows.map(r => r[1]));
    return el("div", {class: "sthb"}, rows.map((r, i) => el("div", {class: "sthr"},
      el("div", {class: "sthl"}, el("span", {class: "ko"}, r[0]), r[3] ? el("small", null, r[3]) : null),
      el("div", {class: "stht"}, el("i", {style: "width:" + (100 * r[1] / max).toFixed(1) + "%;background:" + (r[2] || PAL[i % PAL.length])})),
      el("b", null, fmt(r[1]) + (unit || "")))));
  }
  function donut(rows){
    const tot = rows.reduce((s, r) => s + r[1], 0) || 1, R = 70, C = 2 * Math.PI * R, k = []; let off = 0;
    rows.forEach((r, i) => { const len = C * r[1] / tot; k.push(sv("circle", {cx: 100, cy: 100, r: R, class: "stdn", style: "stroke:" + PAL[i % PAL.length], "stroke-dasharray": len + " " + (C - len), "stroke-dashoffset": -off, transform: "rotate(-90 100 100)"})); off += len; });
    k.push(sv("text", {x: 100, y: 98, class: "stdc", "text-anchor": "middle"}, fmt(tot)), sv("text", {x: 100, y: 118, class: "stax", "text-anchor": "middle"}, "learners"));
    return el("div", {class: "stdnw"}, svg(200, 200, k), el("ul", {class: "stdl"}, rows.map((r, i) => el("li", null, el("span", {class: "sw", style: "background:" + PAL[i % PAL.length]}), r[0] + " ", el("b", null, Math.round(100 * r[1] / tot) + "%"), " (" + fmt(r[1]) + ")"))));
  }
  function vbars(rows, color){
    const W = CW, H = 170, B = 24, T = 16, n = rows.length, bw = (W - 8) / n, max = Math.max(1, ...rows.map(r => r[1])), k = [];
    rows.forEach((r, i) => { const hh = (H - B - T) * r[1] / max, x = 4 + i * bw;
      k.push(sv("rect", {x: x + bw * .12, y: H - B - hh, width: bw * .76, height: hh, rx: 3, style: "fill:" + (color || "var(--k2)")}));
      if (r[1] && n <= 12) k.push(sv("text", {x: x + bw / 2, y: H - B - hh - 4, class: "stax", "text-anchor": "middle"}, fmt(r[1])));
      if (n <= 12 || i % 3 === 0) k.push(sv("text", {x: x + bw / 2, y: H - 7, class: "stax", "text-anchor": "middle"}, r[0])); });
    return svg(W, H, k);
  }
  let CW = 640;   // chart width in px = the card width, so text keeps its size on a computer
  function draw(box, d){
    CW = Math.max(300, Math.min(1100, (box.clientWidth || 640) - 30));
    const t = d.totals || {}, KM = window.KO_META, titles = new Map(KM.idx.map(r => [r[0], [r[1], r[4]]])), areaName = new Map(KM.areas.map(a => [a[0], a[1]]));
    const tile = (v, en, ko, sub) => el("div", {class: "sttile"}, el("b", null, v), el("span", null, en), el("span", {class: "ko"}, ko), sub ? el("small", null, sub) : null);
    const kids = [
      el("div", {class: "sttiles"},
        tile(fmt(t.devices), "Learners", "학습자", "devices"), tile(fmt(t.returning), "Came back", "다시 온 학습자", "2+ days"),
        tile(fmt(t.lessons), "Lessons opened", "묶음 열람"), tile(t.perLearner == null ? "–" : t.perLearner, "Lessons per learner", "1인당 묶음"),
        tile(fmt(t.quizzes), "Quizzes finished", "퀴즈 완료"), tile(t.quizAvg == null ? "–" : t.quizAvg + "%", "Quiz average", "퀴즈 평균"),
        tile(fmt(t.topik), "TOPIK sets", "TOPIK 연습"), tile(fmt(t.plays), "Audio plays", "음성 재생")),
      d.daily && d.daily.length ? card("Every day", "날마다", timeChart(d.daily, "learners", "lessons opened"), true) : null,
      d.monthly && d.monthly.length > 1 ? card("Every month", "달마다", timeChart(d.monthly, "learners", "lessons opened"), true) : null,
      d.top && d.top.length ? card("Most opened lessons", "많이 본 묶음", hbars(d.top.slice(0, 10).map(r => { const ti = titles.get(r[0]); return [ti ? ti[0] : r[0], r[1], AC[r[0].split("-")[0]], (ti && ti[1] ? ti[1] + " · " : "") + r[0]]; })), true) : null,
      d.areas && d.areas.length ? card("By area", "영역별 열람", hbars(d.areas.map(r => [areaName.get(r[0]) || r[0], r[1], AC[r[0]]]))) : null,
      d.devices && d.devices.length ? card("Devices", "기기", donut(d.devices)) : null,
      d.os && d.os.length ? card("Systems", "운영체제", hbars(d.os)) : null,
      d.quizHist && d.quizHist.some(Boolean) ? card("Quiz scores", "퀴즈 점수 분포", vbars(["0–19%", "20–39%", "40–59%", "60–79%", "80–100%"].map((l, i) => [l, d.quizHist[i] || 0]), "var(--good)")) : null,
      d.hours && d.hours.some(Boolean) ? card("Time of day (Korea)", "공부하는 시간", vbars(d.hours.map((v, i) => [String(i), v]), "var(--k6)"), true) : null,
      el("p", {class: "stnote"}, "Updated " + (d.updated || "–") + (d.first ? " · counting since " + d.first : "") + ". Totals only: no names and no single person's results. ", el("span", {class: "ko"}, "이름 없이 모은 전체 합계입니다."))];
    box.replaceChildren(el("div", {class: "stwrap"}, kids));
  }
  function page(box){ requestAnimationFrame(() => page2(box)); }   // after the page is on screen, so the cards have their width
  function page2(box){
    let old = null; try { old = JSON.parse(localStorage.getItem(CK) || "null"); } catch (e) {}
    if (window.__STATS_DEMO){ draw(box, window.__STATS_DEMO); return; }   // screenshots and tests only
    if (old) draw(box, old); else box.replaceChildren(el("p", {class: "empty"}, "Loading statistics…"));
    if (!STATS_URL) return;
    fetch(STATS_URL + "?stats=1", {cache: "no-store"}).then(r => r.json()).then(d => { if (!d || !d.totals) throw 0; try { localStorage.setItem(CK, JSON.stringify(d)); } catch (e) {} if (box.isConnected) draw(box, d); })
      .catch(() => { if (!old && box.isConnected) box.replaceChildren(el("p", {class: "empty"}, "The statistics could not be loaded. Please try again with the internet on.")); });
  }
  return {page};
})();
