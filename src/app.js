/* Korean for English-track students (JeyCampus, from the Lao-speaker app PhasaKAO). Data: META (areas, sub-groups, bundle index) is inlined; bundle bodies load per area from data/K?.json. */
(function(){
"use strict";
const META = window.KO_META, AREAS = META.areas, SUBS = META.subs, IDX = META.idx;
const byCode = new Map(IDX.map((r, i) => [r[0], i]));
const $ = id => document.getElementById(id);
const AL = META.alias || {}, SAL = META.subAlias || {}, SAR = META.subArea || {}, subOf = c => SAL[c.slice(0, 4)] || c.slice(0, 4),
  areaOf = c => SAR[subOf(c)] || AL[c.slice(0, 2)] || c.slice(0, 2);   // K8 · K9 live in menu K7 어휘 (v1.8); merged subs and 조사·말끝·높임말 in 문법 (v1.10)
const T = {
  sec: {m: "How to form it", l: "Letters", x: "Table", w: "Words", f: "Useful expressions", c: "Word forms", e: "Example sentences", tp: "Tips", pr: "Pairs", dl: "Dialogue", sm: "Summary", rel: "Related lessons", qz: "Review questions"},
  repBundle: "Play lesson", repDlg: "Repeat dialogue", repWord: "Repeat", repGroup: "Repeat group", example: "Example", repLetters: "Play all", repAll: "Play all", pause: "Pause", resume: "Resume", nextCard: "Next →",
  showAns: "Show answer", hideAns: "Hide answer", again: "Try again", noCards: "This lesson has no word cards.", noQuiz: "This lesson does not have enough words for a quiz.",
  pick: "Choose the right meaning", pickKo: "Choose the right Korean word", pickHeard: "Listen and choose the word you hear", pickBlank: "Choose the word for the blank", listenBtn: "Listen", loading: "Loading…", loadFail: "Could not load the lesson. Please reload the page.",
  noHit: "No results.", searching: "Searching…", lessons: "lessons", words: "words", sents: "sentences",
  noVoice: "This device has no Korean voice. Please install a Korean voice in Settings, or use Chrome / Edge."
};
/* line icons (speaker, repeat) instead of emoji, so they take the theme colour */
const ICO = {
  play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4.5" width="4.5" height="15" rx="1"/><rect x="14" y="4.5" width="4.5" height="15" rx="1"/></svg>',
  stop: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="5.5" width="13" height="13" rx="1.5"/></svg>',
  spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H3v6h3l5 4z" fill="currentColor"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M18.5 5.5a9 9 0 0 1 0 13"/></svg>',
  rep: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>'
};
function ico(name){ const s = document.createElement("span"); s.className = "ico"; s.setAttribute("aria-hidden", "true"); s.innerHTML = ICO[name]; return s; }
function h(tag, attrs, ...kids){
  const el = document.createElement(tag);
  if (attrs) for (const k in attrs){
    const v = attrs[k];
    if (v == null || v === false) continue;
    if (k === "class") el.className = v;
    else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? "" : v);
  }
  for (const kid of kids.flat(3)){ if (kid == null || kid === false) continue; el.append(kid.nodeType ? kid : document.createTextNode(String(kid))); }
  return el;
}

/* ---------- saved state (this device only) ---------- */
const LS = "kolearn-en-v1";
let S = {code: IDX[0][0], mode: "learn", rate: "1", rep: "2", showKo: true};
try { const v = JSON.parse(localStorage.getItem(LS) || "null"); if (v && typeof v === "object") S = Object.assign(S, v); } catch (e) {}
S.showKo = true;   // Korean notes always shown; the checkbox was removed (RYU 2026-11-14)   // RYU 2026-11-14: Korean notes shown by default
if (!S.playDef){ S.rate = "1"; S.rep = "2"; S.playDef = 1; }   // RYU 2026-11-14: start at speed 1.0, 2 times
if (!byCode.has(S.code)) S.code = IDX[0][0];
function save(){ try { localStorage.setItem(LS, JSON.stringify(S)); } catch (e) {} }
/* explanation language (v1.20, RYU 2026-11-25): Korean stays Korean; meanings, tips, help and buttons in English or Tiếng Việt.
   Translations: src/i18n/<lang>/ (tools/i18n.js); the data of a language is data/<lang>/<area>.json; its audio packs audio/p/<lang>/ */
const LANGS = META.langs || {}, LG = LANGS[S.lang] ? S.lang : "en", LX = LANGS[LG] || null;
const LANG_LIST = [["en", "English", "영어"], ["zh", "中文", "중국어"], ["vi", "Tiếng Việt", "베트남어"], ["my", "မြန်မာ", "미얀마어"], ["uz", "Oʻzbekcha", "우즈베크어"], ["bn", "বাংলা", "벵골어"], ["ne", "नेपाली", "네팔어"], ["lo", "ພາສາລາວ", "라오스어"]];
document.documentElement.lang = LG;
if (LX) IDX.forEach(r => { const t = LX.t[r[0]]; if (t) r[4] = t; });

/* ---------- data ---------- */
const cache = new Map(), loading = new Map();
function loadArea(a){
  if (cache.has(a)) return Promise.resolve(cache.get(a));
  if (!loading.has(a)) loading.set(a, fetch("data/" + (LX ? LG + "/" : "") + a + ".json").then(r => { if (!r.ok) throw new Error(a); return r.json(); })
    .then(d => { cache.set(a, d); return d; }).catch(e => { loading.delete(a); throw e; }));
  return loading.get(a);
}
const bundle = code => (cache.get(areaOf(code)) || []).find(b => b.code === code);

/* ---------- speech (RYU's playback rules, same as the Lao app) ----------
   one 🔊: that line repeats until stopped · word: Korean, Lao meaning, Korean, then Korean only for the remaining N-1
   sentence: exactly N times · bundle repeat: this bundle round and round · all repeat: every bundle in app order, then back to the first */
let TIPOPEN = false;   // v1.19.19: phone tips folded until opened
let loLbl = document.getElementById("loLbl");   // taken at start: on a phone the restored last screen (v1.33) has it inside #ctlrep, which the first render empties ("null" fix)
const AP = makeAudioPack({db: "koen-audio"});   // clips come in one pack per lesson (v0.5)
/* playback = core play (src/core/play.js, 2026-11-28); this app keeps the audio pack (AP) and flipCard */
const PL = makePlay({$, h, ico, T, S, IDX, byCode, AP, lg: LG, ordParts, loadArea, areaOf, drawAll, save, snapLater, flipCard, log: (...a) => ST.log(...a)});
const {P, markMode, hasClip, speakOne, quiet, gap, mark, showPlayer, skipBy, say, sayItem, playSingle, playBundle, playWord, playDialogue, playSents, playCard, stopPlay, togglePause} = PL;
const spk = () => h("button", {class: "spk", type: "button", "aria-label": "Listen", onclick: ev => { const el = ev.currentTarget.closest("[data-say]"); if (el) playSingle(el); }}, ico("spk"));

/* ---------- chrome ---------- */
/* 내 학습 card under the search box (RYU 2026-11-25, v1.4): days in a row, lessons visited, today, the next new lesson.
   Kept on this device only (S.seen = first day each lesson was opened, S.days = days with study, S.td = today's counts). */
const dayStr = MINE.day;   // the card's sums are the shared core mine (2026-11-28)
function track(code){
  const t = dayStr(new Date()), r = IDX[byCode.get(code)]; if (!r || r[3] === "info") return;
  S.seen = S.seen || {}; if (!S.seen[code]) S.seen[code] = t;
  S.days = MINE.addDay(S.days, t);
  S.td = MINE.fresh(S.td, d => ({d: d, l: 0, q: 0}), t); S.td.s = S.td.s || {};
  if (!S.td.s[code]){ S.td.s[code] = 1; S.td.l++; }   // 오늘 공부 = different lessons today (like PhasaLAO, RYU 2026-11-28); s = today's lessons
}
const streak = () => MINE.streak(S.days);
function drawMine(){
  const box = $("mine"); if (!box) return;
  SV.offer($("svbox"), Object.keys(S.seen || {}).length, (S.days || []).length);   // satisfaction survey card (v1.11)
  const L = IDX.filter(r => r[3] !== "info"), seen = S.seen || {}, isSeen = r => seen[r[0]], {n, pct, bar} = MINE.prog(L, isSeen);
  const nx = MINE.next(L, L.findIndex(r => r[0] === S.code), isSeen);
  const td = MINE.fresh(S.td, () => ({l: 0, q: 0})), st = streak();
  box.replaceChildren(...[
    h("div", {class: "mn mn-st" + (st ? " on" : "")}, h("b", null, h("span", {class: "fire", "aria-hidden": "true"}, "🔥"), String(st)), h("span", null, st === 1 ? "day in a row" : "days in a row"), h("small", {class: "ko"}, "연속 학습")),
    h("div", {class: "mn mn-pr"}, h("b", null, pct + "%"), h("span", null, n + " / " + L.length + " lessons"), h("small", {class: "ko"}, "내 진도"), h("div", {class: "mbar"}, h("i", {style: "width:" + bar + "%"}))),
    h("div", {class: "mn mn-td"}, h("b", null, String(td.l)), h("span", null, "lessons today" + (td.q ? " · " + td.q + " quiz" + (td.q > 1 ? "zes" : "") : "")), h("small", {class: "ko"}, "오늘 공부")),
    nbRows().length ? h("button", {class: "mn mn-wb", type: "button", onclick: wbReview}, h("small", null, "Mistakes & ☆ ", h("span", {class: "ko"}, "오답·별표 복습")), h("span", null, nbRows().length + " words"), h("i", {"aria-hidden": "true"}, "→")) : null,
    nx ? h("button", {class: "mn mn-nx", type: "button", onclick: () => { go(nx[0]); scrollTo({top: 0, behavior: "smooth"}); }}, h("small", null, "Next new lesson ", h("span", {class: "ko"}, "다음 새 묶음")), h("span", {class: "ko"}, nx[1]), h("i", {"aria-hidden": "true"}, "→"), jeyPic("jey_side", "nxjey")) : null].filter(Boolean));   // replaceChildren would print a null as text
}
function drawStats(){
  const n = x => Number(x).toLocaleString("en-US");
  $("stats").replaceChildren(h("span", null, h("b", null, n(IDX.filter(r => r[3] !== "info").length)), T.lessons), h("span", null, h("b", null, n(META.nWords)), T.words), h("span", null, h("b", null, n(META.nSents)), T.sents));
}
/* areas: lesson count after the Korean name; subs: "N ບົດ · N ຄຳ" on its own line (RYU 2026-11-15) */
function drawGroups(){
  const cur = areaOf(S.code);
  $("app").setAttribute("data-g", cur);
  const HID = META.hidden || [];
  $("groups").replaceChildren(...AREAS.filter(a => !HID.includes(a[0])).map(a => {
    const rows = IDX.filter(r => areaOf(r[0]) === a[0]);
    return h("button", {class: "group" + ((META.seps || []).includes(a[0]) ? " msep" : ""), type: "button", "data-g": a[0], "aria-pressed": a[0] === cur ? "true" : "false", onclick: () => go(lastIn(S.lastA, a[0], rows))},
      h("span", {class: "gn ko"}, a[1].replace(/\s+/g, "")));   // menus in Korean, no spaces, like lao-app (RYU 2026-11-19, v2.13)
  }), ...HID.map(c => { const rows = IDX.filter(r => areaOf(r[0]) === c), a = AREAS.find(x => x[0] === c);
    return h("button", {class: "group ghelp" + ((META.seps || []).includes(c) ? " msep" : ""), type: "button", "data-g": c, "aria-pressed": c === cur ? "true" : "false", "aria-label": a[2], title: a[2] + " " + a[1], onclick: () => go(lastIn(S.lastA, c, rows))}, h("span", {class: "gn"}, "?")); }));
  const on = $("groups").querySelector('[aria-pressed="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
/* progress marks (v1.4): a thin line under each sub-group button (lessons opened / lessons), a check in the lesson list */
function subProg(rows){ const L = rows.filter(r => r[3] !== "info"); if (!L.length) return null; const n = L.filter(r => (S.seen || {})[r[0]]).length; if (!n) return null;
  return h("i", {class: "sprog" + (n === L.length ? " full" : ""), style: "--p:" + (100 * n / L.length).toFixed(0) + "%", title: n + " / " + L.length}); }
function subFr(rows){ const L = rows.filter(r => r[3] !== "info"); if (!L.length) return null; const n = L.filter(r => (S.seen || {})[r[0]]).length;
  return h("span", {class: "sfr" + (n ? " on" : ""), "aria-hidden": "true"}, n + "/" + L.length); }   // "3/8" at the right of a sub, wide left menu only (v1.31.9)
function drawSubs(){
  const a = areaOf(S.code), cur = subOf(S.code);
  const ids = [...new Set(IDX.filter(r => areaOf(r[0]) === a).map(r => subOf(r[0])))], PT = META.parts || {};
  $("subs").replaceChildren(...ids.flatMap((s, k) => {
    const pt = a === "K7" && PT[s.slice(0, 2)] && (k === 0 || ids[k - 1].slice(0, 2) !== s.slice(0, 2)) ? h("span", {class: "subpart ko"}, PT[s.slice(0, 2)]) : null;   // 어휘: 짝말 · 비슷한 말 · 단어 뿌리 labels
    const rows = IDX.filter(r => subOf(r[0]) === s), n = SUBS[s] || [s, s];
    return [pt, h("button", {class: "sub", type: "button", role: "tab", "aria-selected": s === cur ? "true" : "false", onclick: () => go(lastIn(S.lastS, s, rows))},
      h("span", {class: "code"}, String(ids.indexOf(s) + 1).padStart(2, "0")), h("span", {class: "name ko"}, n[0].replace(/\s+/g, "")), subProg(rows), subFr(rows))].filter(Boolean);
  }));
  /* line under the sub tabs, like lao-app: [1-01] name · N묶음 N단어 N문장 */
  const sr = IDX.filter(r => subOf(r[0]) === cur), ai = AREAS.findIndex(x => x[0] === a) + 1, sn = SUBS[cur] || [cur];
  $("sinfo").replaceChildren(h("b", {class: "ko"}, "[" + ai + "-" + String(ids.indexOf(cur) + 1).padStart(2, "0") + "]"), h("span", {class: "ko"}, " " + sn[0] + " · " + sr.length + "묶음" + (sr[0] && sr[0][3] === "info" ? "" : " " + sr.reduce((t, r) => t + (r[5] || 0), 0) + "단어 " + sr.reduce((t, r) => t + (r[6] || 0), 0) + "문장")));
  const on = $("subs").querySelector('[aria-selected="true"]'); if (on && on.scrollIntoView) on.scrollIntoView({block: "nearest", inline: "nearest"});
}
/* lesson order number in app order: ["7-01-", "02"] for [7-01-02] */
const ordTag = code => { const [o, l] = ordParts(code); return ["[", h("span", {class: "ord-ab"}, o), l + "]"]; };   // phones show only [01] (RYU 2026-11-19, v2.04)
function ordParts(code){
  const a = areaOf(code), sb = subOf(code), subsA = [...new Set(IDX.filter(r => areaOf(r[0]) === a).map(r => subOf(r[0])))];
  const rows = IDX.filter(r => subOf(r[0]) === sb), pad = n => String(n).padStart(2, "0");
  return [(AREAS.findIndex(x => x[0] === a) + 1) + "-" + pad(subsA.indexOf(sb) + 1) + "-", pad(rows.findIndex(r => r[0] === code) + 1)];
}
function drawControls(){
  const s = subOf(S.code), rows = IDX.filter(r => subOf(r[0]) === s);
  /* lesson picker: own list instead of the phone's native one, so each lesson stays on one line inside the box (RYU 2026-11-14) */
  const lab = (r, btn) => [h("span", {class: "ddk"}, r[1])   /* no check mark in the list either (RYU 2026-11-19, v2.06) */, r[4] ? h("span", {class: "ddo"}, r[4]) : ""];
  const curRow = rows.find(r => r[0] === S.code) || rows[0];
  /* order number [area-sub-lesson] in app order in front of the chosen lesson (RYU 2026-11-16, v1.70) */
  const [ord, last] = ordParts(curRow[0]);
  /* PC and tablet: [7-01-01]; phone: only the lesson number [01], so the name is not cut (RYU 2026-11-16, v1.72) */
  $("bselBtn").replaceChildren(h("span", {class: "ddn ko"}, "[", h("span", {class: "ddn-ab"}, ord), last + "]"), ...lab(curRow, true));   // check mark dropped (RYU 2026-11-16, v1.71)   // check in front of the chosen lesson on the main screen, not in the list (RYU 2026-11-15)
  $("bselList").replaceChildren(...rows.map(r => h("button", {type: "button", class: "ddi", role: "option", "aria-selected": r[0] === S.code ? "true" : "false", onclick: () => { ddClose(); go(r[0]); }}, h("span", {class: "ddn ko"}, "[" + ordParts(r[0])[1] + "]"), ...lab(r), (S.seen || {})[r[0]] ? h("span", {class: "ddck", "aria-label": "opened"}, "✓") : null)));   // [01] in front of each lesson in the list (RYU 2026-11-19, v2.06)
  document.querySelectorAll(".seg button").forEach(b => b.setAttribute("aria-pressed", b.dataset.mode === S.mode ? "true" : "false"));
  $("repSel").value = S.rep; $("rateSel").value = S.rate;
}
/* Lao text with Korean runs (Hangul and jamo) wrapped in the Korean font */
const koMix = t => String(t).split(/([\u3131-\u318E\uAC00-\uD7A3]+(?:[\s~\-]+[\u3131-\u318E\uAC00-\uD7A3]+)*)/).map((x, j) => j % 2 ? h("span", {class: "ko"}, x) : x);
function drawBand(b){
  const r = IDX[byCode.get(S.code)];
  const txt = [
      b && b.i ? h("p", {class: "intro"}, b.i[1] || "", b.i[1] ? " " : "", h("span", {class: "sub-ko ko"}, b.i[0])) : null,   // Lao then Korean in one run, always shown; level/type tags not shown (RYU 2026-11-14)
      /* tips under the intro, Lao text with Korean words mixed in, one bullet each, like lao-app (RYU 2026-11-16) */
      /* v1.19.19 (RYU): on phones the tips fold behind a button so the first sentence shows sooner */
      b && b.tp && b.tp.length ? h("button", {class: "tiptog", type: "button", "aria-expanded": String(TIPOPEN), onclick: ev => { TIPOPEN = !TIPOPEN; $("band").classList.toggle("tipopen", TIPOPEN); ev.currentTarget.setAttribute("aria-expanded", String(TIPOPEN)); }},
        "Tips ", h("span", {class: "ko"}, "팁 " + b.tp.length), h("i", {"aria-hidden": "true"}, "▾")) : null,
      b && b.tp && b.tp.length ? h("div", {class: "tipbox"}, b.tp.map(t => h("p", {class: "bl"}, koMix(t[1] || t[0])))) : null].filter(Boolean);
  $("band").classList.toggle("tipopen", TIPOPEN);
  /* one picture per sub-group left of the intro (RYU 2026-11-24, v2.55) */
  const sp = (window.KO_SUBPIC || {})[subOf(S.code)];
  let pic = null; if (sp && txt.length){ pic = h("div", {class: "bandpic", "aria-hidden": "true"}); pic.innerHTML = sp; }
  $("band").replaceChildren(
    /* lesson title removed; the lesson picker sits in its place (RYU 2026-11-15, v1.19) */
    h("div", {class: "bandin"}, $("bsel"), ...(pic ? [h("div", {class: "bandrow"}, pic, h("div", {class: "bandtxt"}, ...txt))] : txt)));
}

/* ---------- lesson view ---------- */
const sec = (key, ...kids) => kids.flat().filter(Boolean).length ? h("section", {class: "sec"}, h("h3", null, T.sec[key],
  key === "l" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playWord(ev.currentTarget.closest(".sec").querySelector(".letters"))}, ico("rep"), T.repLetters)
  : key === "c" || key === "e" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playWord(ev.currentTarget.closest(".sec").querySelector(".rows"))}, ico("rep"), T.repGroup)
  : key === "dl" ? h("button", {class: "wrep hrep", type: "button", onclick: ev => playDialogue(ev.currentTarget.closest(".sec").querySelector(".dlg"))}, ico("rep"), T.repDlg)
  /* words and expressions: repeat the whole section, word by word, same place and look as the dialogue repeat (RYU 2026-11-14) */
  : null), kids) : null;   // 단어 / 자주 쓰는 표현 group repeat button removed, title and line stay (RYU 2026-11-22, v2.33)
const note = pair => [h("p", {class: "note-lo"}, pair[1] || pair[0]), S.showKo && pair[1] ? h("p", {class: "note-ko ko"}, pair[0]) : null];
/* ※ key words of a sentence: [[word, Lao-script reading, Lao meaning], …] */
const gloss = g => g && g.length ? h("div", {class: "gl"}, "※ ", g.flatMap((x, j) => [j ? " · " : null, h("span", {class: "ko"}, x[0]), " ", h("span", {class: "p"}, x[1]), " (", h("span", {class: "gm"}, x[2]), ")"])) : null;
/* base form of a conjugation row ("저 ຂ້ອຍ"), shown at the bottom like the ※ notes */
const fromNote = f => { if (!f) return null; const m = f.match(/^([가-힣\s?!.~\-\/]*[가-힣?!.~])\s*(.*)$/);
  return h("div", {class: "gl"}, "※ ", h("span", {class: "ko"}, m ? m[1] : f), m && m[2] ? [" (", h("span", {class: "gm"}, m[2]), ")"] : null); };
/* speaking practice (v1.13, idea 3): 🎤 under each sentence on the Sentences tab. The browser's own speech recognition
   (Chrome, Edge, Safari; not Firefox) listens in Korean; the app shows what it heard and how close it is (letters compared,
   spaces and marks left out). Nothing is recorded or kept: only "speak, score" goes to the usage statistics. */
const SRC = window.SpeechRecognition || window.webkitSpeechRecognition;
let recNow = null;
const normKo = s => String(s || "").replace(/\(.*?\)/g, "").replace(/[^0-9A-Za-zㄱ-ㆎ가-힣]/g, "").toLowerCase();
function simKo(a, b){
  a = normKo(a); b = normKo(b); if (!a || !b) return 0;
  let prev = Array.from({length: b.length + 1}, (_, j) => j);
  for (let i = 1; i <= a.length; i++){ const cur = [i]; for (let j = 1; j <= b.length; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = cur; }
  return Math.max(0, Math.round(100 * (1 - prev[b.length] / Math.max(a.length, b.length))));
}
function sayIt(btn){
  const ln = btn.closest("[data-say]"), target = ln && ln.dataset.say, box = btn.parentNode.querySelector(".sayres") || btn.parentNode.appendChild(h("div", {class: "sayres"}));
  if (recNow){ try { recNow.abort(); } catch (e) {} recNow = null; document.querySelectorAll(".saybtn.on").forEach(b => b.classList.remove("on")); if (btn.dataset.on){ delete btn.dataset.on; return; } }
  stopPlay();
  const r = new SRC(); r.lang = "ko-KR"; r.interimResults = false; r.maxAlternatives = 3; recNow = r; btn.dataset.on = "1"; btn.classList.add("on");
  box.className = "sayres wait"; box.replaceChildren("Listening… say the sentence ", h("span", {class: "ko"}, "듣고 있어요. 말해 보세요"));
  let got = false;
  r.onresult = ev => { got = true; const alts = Array.from(ev.results[0] || []).map(x => x.transcript);
    const best = alts.map(t => [t, simKo(t, target)]).sort((x, y) => y[1] - x[1])[0] || ["", 0], p = best[1];
    box.className = "sayres " + (p >= 85 ? "good" : p >= 60 ? "mid" : "low");
    box.replaceChildren(h("b", null, (p >= 85 ? "✓ " : "") + p + "%"), " ", h("span", {class: "ko"}, best[0] || "—"), " ",
      h("small", null, p >= 85 ? "Great! 잘했어요!" : p >= 60 ? "Close. Try again. 조금 더!" : "Listen with 🔊 and try again. 다시 들어 보세요."));
    ST.log("speak", S.code, p); };
  r.onerror = ev => { got = true; box.className = "sayres low";
    const e = ev.error || "", ios = /iPhone|iPad|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1),
      app = matchMedia("(display-mode: standalone)").matches || navigator.standalone === true;
    if (e === "no-speech") box.replaceChildren("I didn't hear anything. Try again. 소리가 들리지 않았어요.");
    else if (e === "not-allowed" && !ios) box.replaceChildren("Please allow the microphone for this site. 마이크를 허용해 주세요.");
    else if (ios) box.replaceChildren(h("b", null, "iPhone: "), "speech recognition uses Apple Dictation. ", h("span", {class: "ko"}, "아이폰은 받아쓰기를 써요."),
      h("ol", {class: "sayhelp"}, h("li", null, "Settings › General › Keyboard › turn on ", h("b", null, "Enable Dictation"), ". ", h("span", {class: "ko"}, "설정 › 일반 › 키보드 › 받아쓰기 활성화")),
        h("li", null, "Settings › Safari › Microphone › ", h("b", null, "Allow"), ". ", h("span", {class: "ko"}, "설정 › Safari › 마이크 › 허용")),
        app ? h("li", null, "If it still does not work in the home-screen app, open the app in ", h("b", null, "Safari"), ": ", location.origin + location.pathname, " ", h("span", {class: "ko"}, "홈 화면 앱에서 안 되면 Safari에서 열어 주세요.")) : null),
      h("small", null, "(" + e + ")"));
    else box.replaceChildren("Speech recognition is not available now. 지금은 음성 인식을 쓸 수 없어요. ", h("small", null, "(" + e + ")")); };
  r.onend = () => { btn.classList.remove("on"); delete btn.dataset.on; if (recNow === r) recNow = null; if (!got){ box.className = "sayres low"; box.replaceChildren("I didn't hear anything. Try again. 소리가 들리지 않았어요."); } };
  try { r.start(); } catch (e) { btn.classList.remove("on"); delete btn.dataset.on; recNow = null; }
}
const SAY_ON = false;   // speaking practice paused (RYU 2026-11-25: iPhone home-screen app failed); set true to bring 🎤 back
const sayBtn = () => SAY_ON && SRC ? h("div", {class: "sayrow"}, h("button", {class: "saybtn", type: "button", onclick: ev => { ev.stopPropagation(); sayIt(ev.currentTarget); }}, "🎤 Say it ", h("span", {class: "ko"}, "말해 보기"))) : null;
const line = (ko, pr, lo, cls, from, g) => h("div", {class: "line " + (cls || ""), "data-say": ko, "data-lo": lo, "data-head": cls === "head" ? "1" : null}, spk(),
  h("div", null, h("div", {class: "k ko"}, ko), pr ? h("div", {class: "p"}, pr) : null, h("div", {class: "m"}, lo), gloss(g), fromNote(from), cls === "head" ? null : sayBtn()));
/* previous / next lesson buttons at the bottom (RYU 2026-11-19, v2.02) */
function pnRow(code){
  const i = byCode.get(code), next = IDX[i + 1], prev = i > 0 ? IDX[i - 1] : null;
  return h("div", {class: "pnrow"},
    prev ? h("button", {class: "pn pv", type: "button", onclick: () => go(prev[0])}, h("b", null, h("kbd", {class: "kc"}, "<"), "← Previous ", h("span", {class: "ko"}, "이전 묶음")), h("small", {class: "ko"}, ...ordTag(prev[0]), " " + prev[1])) : h("span"),
    next ? h("button", {class: "pn nx", type: "button", onclick: () => go(next[0])}, h("b", null, "Next ", h("span", {class: "ko"}, "다음 묶음"), " →", h("kbd", {class: "kc"}, ">")), h("small", {class: "ko"}, ...ordTag(next[0]), " " + next[1])) : h("span"));
}
/* 듣기연습: the text is blurred until the learner has listened and taps 본문 보기 (RYU 2026-11-24) */
const veilLbl = on => on ? ["Show text ", h("span", {class: "ko"}, "본문 보기")] : ["Hide text ", h("span", {class: "ko"}, "본문 가리기")];
const veilBar = () => h("div", {class: "veilbar"}, h("button", {class: "btn veilbtn", type: "button", onclick: ev => { const r = ev.currentTarget.closest(".sec").querySelector(".dlg"); ev.currentTarget.replaceChildren(...veilLbl(r.classList.toggle("veil"))); }}, ...veilLbl(true)), h("span", {class: "veilhint"}, "Listen first, then show the text.", " ", h("span", {class: "ko"}, "먼저 듣고 나서 본문을 보세요.")));
function renderLearn(b){
  const dl = b.dl || [], lis = b.type === "듣기";
  const dlSec = sec("dl", dl.length ? [
      lis ? veilBar() : null,
      h("div", {class: "rows dlg" + (lis ? " lis veil" : "")}, dl.map((d, n) => h("div", {class: "line", "data-say": d[1], "data-lo": d[2], "data-m": (b.mv || []).includes(d[0]) ? "1" : null}, h("div", {class: "exn", "aria-label": String(n + 1)}, String(n + 1)), spk(), h("div", null, h("div", {class: "k ko"}, lis && d[0] ? h("span", {class: "who"}, d[0] + ": ") : null, d[1]), d[4] ? h("div", {class: "p"}, d[4]) : null, h("div", {class: "m"}, d[2]), gloss(d[3]), lis ? null : sayBtn()))))] : null);   // d[4]: Lao-script reading, as in the example sentences (RYU 2026-11-14)
  return [
    lis ? dlSec : null,   // 듣기연습: the text comes first (v2.45)
    b.yt ? h("p", {class: "ytrow"}, h("a", {class: "btn ytbtn", href: b.yt, target: "_blank", rel: "noopener"}, "▶ Watch the MV on YouTube ", h("span", {class: "ko"}, "뮤직비디오 보기"))) : null,   // K-POP: find the official MV (no lyrics in the app) (v2.46)
    sec("m", (b.m || []).map(m => h("div", {class: "tip"}, note(m)))),
    /* letters (ຕົວອັກສອນ) section dropped from the sentence tab: the letters are studied in the word tab (RYU 2026-11-16, v1.75) */
    b.x && b.x.length > 1 ? sec("x", h("div", {class: "tablewrap"}, h("table", null,
      h("thead", null, h("tr", null, b.x[0].map(c => h("th", {class: "ko"}, c)))),
      h("tbody", null, b.x.slice(1).map(r => h("tr", null, r.map(c => h("td", null, c)))))))) : null,
    /* expression lessons show their expressions first, so 1-01-01 opens with 안녕하세요? (RYU 2026-11-18, v1.85) */
    ...(b.type === "표현" ? [sec("f", (b.f || []).map(wordBox)), sec("w", (b.w || []).map(wordBox))] : [sec("w", (b.w || []).map(wordBox)), sec("f", (b.f || []).map(wordBox))]),
    sec("c", (b.c || []).length ? h("div", {class: "rows grid2"}, b.c.map(c => line(c[1], c[2], c[3], "", c[4] ? null : c[0], c[4]))) : null),
    sec("e", (b.e || []).length ? h("div", {class: "rows grid2"}, b.e.map(e => line(e[0], e[1], e[2], "", null, e[3]))) : null),
    sec("pr", (b.pr || []).length ? h("div", {class: "pairs"}, b.pr.map(p => h("div", {class: "pair"}, p.flatMap((x, j) => j ? [h("i", null, "↔"), x] : [x])))) : null),
    lis ? null : dlSec,
    sec("sm", b.sm && b.sm.length ? h("div", {class: "tip"}, note(b.sm)) : null),
    sec("qz", (b.qz || []).map((q, n) => { const a = h("div", {class: "a", hidden: true}, q[1]);
      return h("div", {class: "qa"}, h("div", {class: "qq"}, h("div", {class: "exn", "aria-label": String(n + 1)}, String(n + 1)), h("div", {class: "ko"}, q[0])), h("div", {class: "qr"}, a, h("button", {class: "btn", type: "button", onclick: ev => { a.hidden = !a.hidden; ev.currentTarget.textContent = a.hidden ? T.showAns : T.hideAns; }}, T.showAns))); })),   // tap again hides the answer (v1.80)
    /* related lessons, like lao-app (RYU 2026-11-18, v1.80): lessons that use this lesson's words; tap to go there */
    /* related lessons box and prev / next buttons, in the shape RYU showed (2026-11-19, v2.02) */
    (() => { const rel = (META.rel && META.rel[b.code] || []).filter(k => byCode.has(k)); if (!rel.length) return null;
      return h("div", {class: "relbox"}, h("div", {class: "relhd"}, T.sec.rel, h("span", {class: "ko"}, " 관련 묶음")),
        rel.map(k => { const r = IDX[byCode.get(k)];
          return h("button", {class: "relrow", type: "button", onclick: () => go(k)}, h("span", {class: "rc ko"}, ...ordTag(k)), h("span", {class: "ko"}, r[1]), r[4] ? h("span", {class: "ddo"}, r[4]) : null); })); })(),
    pnRow(b.code)
  ];
}

/* a headword (word or expression) with its example sentences */
/* the headword inside an example sentence, underlined: the word itself, or the stem of a -다 word (가다 → 가),
   or for longer stems one syllable less (출근하다 → 출근 in 출근해요). Returns null when it is not found. */
function hlWord(sent, head){
  const base = head.replace(/\(.*?\)/g, "").replace(/[~\-]/g, "").trim(); if (!base) return null;
  const stem = base.replace(/다$/, ""), tries = [base, stem];
  if (stem.length >= 2) tries.push(stem.slice(0, -1));
  for (const t of tries){ if (!t) continue; const at = sent.indexOf(t);
    if (at >= 0) return [sent.slice(0, at), h("span", {class: "hw"}, t), sent.slice(at + t.length)]; }
  return null;
}
function wordBox(w){ const ex = w[3] || [];
  const head = line(w[0], w[1], w[2], "head");
  head.append(h("button", {class: "wrep", type: "button", title: T.repWord, onclick: ev => { ev.stopPropagation(); playWord(ev.currentTarget.closest(".word")); }}, ico("rep"), T.repWord));
  const cards = ex.map((e, n) => { const c = line(e[0], e[1], e[2], "ex", null, e[3]), body = c.children[1], k = body.querySelector(".k");
    const parts = hlWord(e[0], w[0]); if (parts) k.replaceChildren(...parts);
    c.prepend(h("div", {class: "exn", title: T.example + " " + (n + 1), "aria-label": T.example + " " + (n + 1)}, String(n + 1)));
    return c; });
  return h("div", {class: "word" + (ex.length ? "" : " solo")}, head, ex.length ? h("div", {class: "exs"}, cards) : null); }

/* ---------- cards ---------- */
function items(b){
  const out = [];
  (b.l || []).forEach((l, j) => out.push({id: b.code + "~l" + j, ko: l[0], pr: "", lo: l[1], say: l[2] || l[0]}));
  (b.w || []).forEach((w, j) => out.push({id: b.code + "~w" + j, ko: w[0], pr: w[1], lo: w[2]}));
  (b.f || []).forEach((w, j) => out.push({id: b.code + "~f" + j, ko: w[0], pr: w[1], lo: w[2]}));
  (b.c || []).forEach((c, j) => out.push({id: b.code + "~c" + j, ko: c[1], pr: c[2], lo: c[3]}));
  (b.e || []).forEach((e, j) => out.push({id: b.code + "~e" + j, ko: e[0], pr: e[1], lo: e[2]}));
  return out.filter(x => x.ko && x.lo);
}
/* word study like lao-app (RYU 2026-11-16, v1.69): every card of the lesson at once; Korean side = word and reading,
   Lao side = meaning and one example. Tap a card to repeat it (tap again to stop); the bar buttons go card by card. */
function flipCard(c, back){ if (!c || c.classList.contains("back") === !!back) return; c.classList.toggle("back", !!back); c.classList.remove("fl0", "fl1"); void c.offsetWidth; c.classList.add(back ? "fl1" : "fl0"); }   // turn animation (v1.4)
function cardItems(b){
  const ws = (b.l || []).map(l => ({ko: l[0], pr: "", hn: l[2] && l[2] !== l[0] ? l[2] : "", lo: l[1], say: l[2] || l[0]}))   // letters: sample syllables on the front, Lao letter on the back
    .concat((b.type === "표현" ? (b.f || []).concat(b.w || []) : (b.w || []).concat(b.f || [])).map(w => ({ko: w[0], pr: w[1], lo: w[2], ex: (w[3] || [])[0], hn: w[4] || ""})));
  return (ws.length ? ws : items(b)).filter(x => x.ko && x.lo);
}
function renderCards(b){
  const list = cardItems(b);
  if (!list.length) return [h("p", {class: "empty"}, T.noCards), pnRow(b.code)];
  return [h("div", {class: "wcards"}, list.map(it => h("div", {class: "wcard", role: "button", tabindex: "0", "data-say": it.say || it.ko, "data-lo": it.lo, onclick: ev => playCard(ev.currentTarget)},
    h("span", {class: "spk", "aria-hidden": "true"}, ico("spk")),
    (on => h("button", {class: "star" + (on ? " on" : ""), type: "button", "aria-pressed": on ? "true" : "false", "aria-label": "Save this word", title: "Save this word",
      onclick: ev => { ev.stopPropagation(); starToggle(b.code, it, ev.currentTarget); }}, on ? "★" : "☆"))(!!(S.star || {})[nbKey(b.code, it.ko)]),   // ☆ save a word (v1.33)
    /* front: Korean word, short note; back: Lao-script reading, Lao meaning, Korean example, its Lao meaning (RYU 2026-11-16, v1.70) */
    h("div", {class: "fr"}, h("div", {class: "k ko" + (it.ko.length > 9 ? " xl" : it.ko.length > 6 ? " long" : "")}, it.ko), it.pr ? h("div", {class: "fp"}, it.pr) : null, h("div", {class: "hn ko"}, it.hn || "")),   // Lao-script reading on the front too (RYU 2026-11-18, v1.89)
    h("div", {class: "bk"}, h("div", {class: "p"}, it.pr || ""), h("div", {class: "m"}, it.lo),
      it.ex ? [h("div", {class: "exk ko"}, it.ex[0]), h("div", {class: "exm"}, it.ex[2])] : null)))),
    pnRow(b.code)];   // prev / next lesson at the bottom, as on the sentence tab (RYU 2026-11-21, v2.26; Space on the key line v2.27)
}

/* ---------- quiz: four choices built from the bundle's own words ---------- */
/* moving to the next question (or starting again) stops whatever the previous question was playing (RYU 2026-11-14) */
let quiz = null;
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function makeQuiz(b){
  const own = items(b).filter(x => x.pr !== "" || x.ko.length > 1);
  const pool = (cache.get(areaOf(b.code)) || []).filter(o => subOf(o.code) === subOf(b.code) && o.code !== b.code).flatMap(items);
  if (own.length + pool.length < 4 || !own.length) return {code: b.code, qs: [], at: 0, right: 0};
  /* four kinds in turn, like lao-app (RYU 2026-11-18, v1.80): meaning, Korean word, listen and pick, fill the blank in an example */
  const exOf = new Map(); [].concat(b.w || [], b.f || []).forEach(w => { if ((w[3] || []).length) exOf.set(w[0], w[3]); });
  const canHear = it => !!(window.speechSynthesis || hasClip("ko", it.ko));
  const qs = shuffle(own).slice(0, 10).map((it, n) => {
    let kind = ["mean", "ko", "listen", "blank"][n % 4], blank = null;
    if (kind === "listen" && !canHear(it)) kind = "ko";
    if (kind === "blank"){ const e = shuffle(exOf.get(it.ko) || []).find(e => e[0].includes(it.ko));
      if (e){ const at = e[0].indexOf(it.ko); blank = {pre: e[0].slice(0, at), post: e[0].slice(at + it.ko.length), lo: e[2], full: e[0]}; } else kind = "mean"; }
    const toLo = kind === "mean", key = toLo ? "lo" : "ko", seen = new Set([it[key]]), wrong = [];
    for (const o of shuffle(own.concat(pool))){ if (wrong.length === 3) break; if (!seen.has(o[key])){ seen.add(o[key]); wrong.push(o[key]); } }
    return {kind, q: kind === "mean" ? it.ko : kind === "ko" ? it.lo : "", blank, say: kind === "mean" || kind === "listen" ? it.ko : blank ? blank.full : "", toLo, a: it[key], opts: shuffle([it[key]].concat(wrong)), picked: null, w: [it.ko, it.pr || "", it.lo]};   // w: the word itself, for the Mistake notebook list (v1.33)
  });
  return {code: b.code, qs, at: 0, right: 0};
}
/* mistake notebook (v1.12, idea 4): wrong quiz questions from every lesson are kept on this device (S.wb, newest first, up to 80).
   "Review my mistakes" asks them again in one quiz; a right answer there takes the question out of the list. */
/* the saved data rules: the shared part src/core/wbook.js (2026-11-28) */
const wbKey = WB.key;
function wbAdd(qz){ WB.add(S, qz); }
function wbDrop(q){ WB.drop(S, q); }
/* ☆ save a word and the Mistake notebook list, as PhasaLAO / PhasaKAO v2.99 (RYU 2026-11-28, v1.33): a ☆ on each word card keeps the word
   (S.star: "code::ko" -> [ko, romanization, meaning, lesson]); the review shows one list of the wrong words and the ☆ words, each with a ✕.
   Review quiz = the wrong questions + a meaning question per ☆ word; a right answer takes a wrong question out, a ☆ word stays until ✕ or ★.
   English labels here; ui.tsv of each language swaps them. */
const nbKey = WB.nbKey;
const wbWord = WB.word;
function nbRows(){
  const rows = WB.rows(S);
  /* meanings in the language chosen now, when that lesson is loaded (the saved one may be from another language) */
  for (const r of rows){ const b = bundle(r.code); if (!b) continue; const it = items(b).concat(cardItems(b)).find(x => x.ko === r.ko); if (it){ r.lo = it.lo || r.lo; r.pr = it.pr || r.pr; } }
  return rows;
}
function starToggle(code, it, btn){
  const on = WB.star(S, code, it); save(); drawMine();
  btn.classList.toggle("on", on); btn.textContent = on ? "★" : "☆"; btn.setAttribute("aria-pressed", on ? "true" : "false");
}
async function wbReview(stay){
  const rows = nbRows(); if (!rows.length) return;
  stopPlay(); S.mode = "quiz";
  const bank = (S.wb || []).filter(x => x && x.q), inWb = new Set(bank.map(x => nbKey(x.code, wbWord(x)[0])));
  const stars = rows.filter(r => r.star && !inWb.has(r.k) && r.lo);
  if (stars.length) await Promise.all([...new Set(stars.map(r => areaOf(r.code)))].map(a => loadArea(a).catch(() => null)));   // other meanings for the choices
  const qs = shuffle(bank).slice(0, 20).map(x => Object.assign({}, x.q, {picked: null, opts: shuffle(x.q.opts.slice())}));
  const los = nbRows().map(r => r.lo).filter(Boolean);
  for (const r0 of shuffle(stars).slice(0, Math.max(0, 30 - qs.length))){
    const r = nbRows().find(x => x.k === r0.k) || r0, b = bundle(r.code), near = b ? (cache.get(areaOf(r.code)) || []).filter(o => subOf(o.code) === subOf(r.code)).flatMap(items).map(x => x.lo) : [];
    const seen = new Set([r.lo]), wrong = [];
    for (const o of shuffle(los).concat(shuffle(near))){ if (wrong.length === 3) break; if (o && !seen.has(o)){ seen.add(o); wrong.push(o); } }
    if (wrong.length === 3) qs.push({kind: "mean", q: r.ko, say: r.ko, toLo: true, a: r.lo, opts: shuffle([r.lo].concat(wrong)), picked: null, w: [r.ko, r.pr, r.lo]});
  }
  if (!qs.length) return;
  quiz = {code: S.code, review: true, qs: shuffle(qs), at: 0, right: 0};
  save(); drawControls(); render(); const v = $("view"); if (v && stay !== true) v.scrollIntoView({behavior: "smooth", block: "start"});
}
function wbDel(k){
  WB.del(S, k);
  save(); drawMine(); if (nbRows().length) wbReview(true); else { quiz = null; render(); }
}
let WBOPEN = false;
function wbBook(){
  const rows = nbRows(); if (!rows.length) return null;
  const d = h("details", {class: "wbook"}, h("summary", null, "Mistake notebook ", h("span", {class: "ko"}, "오답 노트"), " · ", rows.length + " words"),
    h("ul", null, rows.map(r => h("li", null, h("span", {class: "wk ko"}, r.ko), r.pr ? h("span", {class: "r notr"}, r.pr) : null, h("span", {class: "m notr"}, r.lo || ""),
      h("span", {class: "src"}, r.wrong ? h("span", null, "wrong") : "", r.wrong && r.star ? " · " : "", r.star ? "★" : ""),
      byCode.has(r.code) ? h("button", {class: "wbgo ko notr", type: "button", title: IDX[byCode.get(r.code)][1], onclick: () => go(r.code)}, ...ordTag(r.code)) : null,
      h("button", {class: "wbdel", type: "button", "aria-label": "Remove from the list", title: "Remove from the list", onclick: () => wbDel(r.k)}, "✕")))),
    h("p", {class: "wbhint"}, h("span", null, "Words you got wrong in quizzes and words you starred ☆ in Words. A right answer in the review takes a word off the wrong list. Press ✕ to remove a word."),
      h("br"), h("span", {class: "ko"}, "퀴즈에서 틀린 단어와 단어에서 ☆를 누른 단어예요. 복습에서 맞히면 틀린 목록에서 빠지고, ✕로 하나씩 뺄 수 있어요.")));
  d.open = WBOPEN; d.addEventListener("toggle", () => { WBOPEN = d.open; });
  return d;
}
const revHead = () => h("p", {class: "qrev"}, "Mistakes & ☆ ", h("span", {class: "ko"}, "오답·별표 복습"), " · ", nbRows().length + " words");
/* quiz result (v1.4): a score ring, a word for the result, the questions that were wrong, and "only the wrong ones" */
/* Jeonju Univ. characters JeyJey · Byeori · Jate (files from RYU 2026-11-25, v1.7): JeyJey cheers a high score, Byeori a middle one, Jate says try again */
const jeyPic = (n, cls) => h("img", {class: cls, src: "img/jey/" + n + ".webp", alt: "", loading: "lazy"});
function quizEnd(){
  const N = quiz.qs.length, R = quiz.right, pct = N ? Math.round(100 * R / N) : 0, wrong = quiz.qs.filter(q => q.picked !== q.a);
  const C = 2 * Math.PI * 52, NS = "http://www.w3.org/2000/svg", mk = (t, at) => { const e = document.createElementNS(NS, t); for (const k in at) e.setAttribute(k, at[k]); return e; };
  const ring = mk("svg", {viewBox: "0 0 120 120", class: "qring"});
  ring.append(mk("circle", {cx: 60, cy: 60, r: 52, class: "qr0"}), mk("circle", {cx: 60, cy: 60, r: 52, class: "qr1" + (pct >= 80 ? " hi" : pct < 50 ? " lo" : ""), "stroke-dasharray": (C * pct / 100) + " " + C, transform: "rotate(-90 60 60)"}));
  const msg = pct === 100 ? ["Perfect!", "완벽해요!"] : pct >= 80 ? ["Great job!", "잘했어요!"] : pct >= 50 ? ["Good, keep going!", "좋아요, 조금 더!"] : ["Let's try again.", "다시 해 봐요."];
  const qText = q => q.kind === "blank" ? q.blank.full : q.kind === "listen" ? q.say : q.q;
  return [quiz.review ? revHead() : null, h("div", {class: "qend"}, h("div", {class: "qringw"}, ring, h("div", {class: "qrt"}, h("b", null, pct + "%"), h("span", null, R + " / " + N))),
      h("p", {class: "qmsg"}, msg[0], " ", h("span", {class: "ko"}, msg[1])), jeyPic(pct >= 80 ? "jey" : pct >= 50 ? "byeori" : "jate", "qjey")),
    wrong.length ? h("div", {class: "qwrong"}, h("h3", null, "Check these again ", h("span", {class: "ko"}, "다시 볼 문제")),
      wrong.map(q => h("div", {class: "qw"}, h("span", {class: q.toLo ? "ko" : ""}, qText(q)), h("b", {class: q.toLo ? "" : "ko"}, q.a)))) : null,
    h("div", {class: "rowbtns", style: "justify-content:center"},
      !quiz.review && nbRows().length ? h("button", {class: "btn", type: "button", onclick: wbReview}, "Mistakes & ☆ ", h("span", {class: "ko"}, "오답·별표 복습"), " · " + nbRows().length) : null,
      wrong.length && wrong.length < N ? h("button", {class: "btn primary", type: "button", onclick: () => { stopPlay(); quiz = {code: quiz.code, review: quiz.review, again: 1, qs: wrong.map(q => Object.assign({}, q, {picked: null})), at: 0, right: 0}; render(); }}, "Only the wrong ones ", h("span", {class: "ko"}, "틀린 것만")) : null,
      h("button", {class: "btn" + (wrong.length && wrong.length < N ? "" : " primary"), type: "button", onclick: () => { stopPlay(); quiz = null; render(); }}, T.again))];
}
function renderQuiz(b){ const r = quizBody(b); return quiz && quiz.review ? [wbBook(), quiz.at < quiz.qs.length ? revHead() : null].concat(r) : r; }   // Mistake notebook list above the review (v1.33)
function quizBody(b){
  if (!quiz || quiz.code !== b.code) quiz = makeQuiz(b);
  if (!quiz.qs.length) return [h("p", {class: "empty"}, T.noQuiz)];
  if (quiz.at >= quiz.qs.length) return quizEnd();
  const q = quiz.qs[quiz.at];
  const head = q.kind === "listen" ? h("div", {class: "quizq listen", "data-say": q.say}, h("button", {class: "btn primary", type: "button", onclick: ev => playSingle(ev.currentTarget.parentNode)}, ico("spk"), " " + T.listenBtn))
    : q.kind === "blank" ? h("div", {class: "quizq qblank"}, h("div", {class: "ko"}, q.blank.pre, h("span", {class: "blank"}, "?"), q.blank.post), h("div", {class: "qlo"}, q.blank.lo))
    : h("div", {class: "quizq" + (q.toLo ? " ko" : "")}, q.q);
  const lab = {mean: T.pick, ko: T.pickKo, listen: T.pickHeard, blank: T.pickBlank}[q.kind];
  return [h("div", null, head, h("p", {class: "quizp"}, lab + " · " + (quiz.at + 1) + " / " + quiz.qs.length)),
    q.say && q.kind === "mean" || q.picked != null && q.say ? h("div", {class: "rowbtns", style: "justify-content:center", "data-say": q.say}, spk()) : null,
    h("div", {class: "choices"}, q.opts.map(o => h("button", {class: "choice" + (q.toLo ? "" : " ko") + (q.picked != null ? (o === q.a ? " right" : o === q.picked ? " wrong" : "") : ""), type: "button", disabled: q.picked != null,
      onclick: () => { q.picked = o; if (o === q.a){ quiz.right++; if (quiz.review) wbDrop(q); } render(); if (!q.toLo){ stopPlay(); const tok = ++P.tok; say(tok, q.kind === "blank" ? q.blank.full : q.a); } }}, o))),
    q.picked != null ? h("div", {class: "rowbtns", style: "justify-content:flex-end"}, h("button", {class: "btn primary", type: "button", onclick: () => { stopPlay(); quiz.at++; if (quiz.at === quiz.qs.length){ if (!quiz.review){ if (!quiz.again) ST.log("quiz", quiz.code, quiz.right, quiz.qs.length); wbAdd(quiz); } else save(); S.td = MINE.quiz(S.td, d => ({d: d, l: 0, q: 0})); save(); drawMine(); } render(); const nq = quiz.qs[quiz.at], el = document.querySelector(".quizq.listen"); if (nq && nq.kind === "listen" && el) playSingle(el); }}, T.nextCard)) : null];
}

/* ---------- search ---------- */
let query = "";
function renderSearch(){
  const q = query.toLowerCase(), hits = [];
  for (const r of IDX) if (r[1].toLowerCase().includes(q) || (r[4] && r[4].toLowerCase().includes(q))) hits.push({code: r[0], ko: r[1], lo: r[4] || "", pr: ""});
  for (const a of AREAS) for (const b of cache.get(a[0]) || []){
    for (const it of items(b)) if (it.ko.toLowerCase().includes(q) || it.lo.toLowerCase().includes(q) || (it.pr || "").toLowerCase().includes(q)) hits.push({code: b.code, ko: it.ko, lo: it.lo, pr: it.pr});
    if (hits.length > 80) break;
  }
  const pending = AREAS.some(a => !cache.has(a[0]));
  if (!hits.length) return [h("p", {class: "empty"}, pending ? T.searching : T.noHit)];
  return [h("div", null, hits.slice(0, 80).map(x => h("button", {class: "hit", type: "button", onclick: () => { $("q").value = ""; query = ""; go(x.code); }},
    h("span", {class: "k ko"}, x.ko), h("span", {class: "where"}, (IDX[byCode.get(x.code)] || [])[1] || ""), h("span", null, x.lo || (SUBS[subOf(x.code)] || ["", ""])[1]))))];
}

/* ---------- render and routing ---------- */
function render(){
  const view = $("view");
  if (query){ $("band").hidden = true; $("controls").hidden = true; view.replaceChildren(...renderSearch()); return; }
  $("band").hidden = false; $("controls").hidden = false;
  const b = bundle(S.code);
  if (!b && document.documentElement.classList.contains("snap")) return;   // the last screen (restored by index.html) stays until the lesson data arrives (v1.33)
  drawBand(b);
  if (!b){ view.replaceChildren(h("p", {class: "empty"}, T.loading)); return; }
  bootDone(); snapLater();
  /* 대한민국 pages: the page itself and the prev / next buttons; no play controls (RYU 2026-11-20, v2.19) */
  if (b.info){ $("controls").hidden = true; $("ctlrep").hidden = true;
    const art = h("article", {class: "info"}); art.innerHTML = b.info;
    { const sp = art.querySelector("#statsPage"); if (sp) STP.page(sp); const sv = art.querySelector("#surveyPage"); if (sv) SV.form(sv, true); }   // 사용 통계 page (src/stats.js)
    { const tr = art.querySelector("#tpRandom"); if (tr) tprMount(tr); }
    if (b.code.startsWith("TP-") && !art.querySelector(".ib")) ibGroup(art);
    if (b.code.startsWith("HP-") && !b.code.startsWith("HP-C") && !art.querySelector(".ib")) hpBoxes(art, b.code);   // v1.21.13 (RYU): help pages in boxes, menu overview as area cards   // v1.19.18 (RYU): TOPIK guide pages, each group in a box   // TOPIK random practice (v1.17)
    const bq = !b.tq ? b : MOCK[b.code] ? mockBundle(b) : isPage(b.code) ? pageBundle(b) : b;   // mock tests: a new random sheet (v1.17)
    view.replaceChildren(art, bq.tq ? tqView(bq) : "", pnRow(b.code)); return; }
  /* the two repeat buttons sit in the control bar above its bottom line, learn tab only (RYU 2026-11-16, v1.67) */
  $("ctlrep").replaceChildren(...(S.mode !== "quiz" ? [
    h("button", {class: "wrep tbtn", type: "button", onclick: () => playBundle(true)}, ico("rep"), T.repAll, h("kbd", {class: "kc"}, "C")),
    h("button", {class: "wrep tbtn", type: "button", onclick: () => playBundle(false)}, ico("rep"), T.repBundle, h("kbd", {class: "kc"}, "G"))] : []));   // key badges, PC and pad only (v2.25)
  { const ph = matchMedia("(max-width:560px)").matches;   // phone: Lao-voice checkbox on the left of the two play buttons, one line (RYU 2026-11-22, v2.40)
    const lbl = loLbl || (loLbl = $("loLbl"));   // keep a reference: replaceChildren above detaches it, then $() finds nothing (v2.44 "null" fix)
    if (ph && S.mode !== "quiz") $("ctlrep").prepend(lbl); else $("kbinfo").append(lbl); }
  $("kbinfo").hidden = S.mode === "quiz";
  $("ctlrep").hidden = S.mode === "quiz";   // learn and word-card tabs (v1.67)
  const parts = S.mode === "cards" ? renderCards(b) : S.mode === "quiz" ? renderQuiz(b) : renderLearn(b);
  view.replaceChildren(...parts.flat().filter(Boolean));
  if (S.mode === "cards") fitWords();
}
/* TOPIK practice questions (RYU 2026-11-21, v2.24): direction (Korean, then Lao), listen button or text to read,
   four choices; a pick shows right / wrong, the script of a listening question and the Lao explanation */
const TQ = {}, NUM = "①②③④", WHO = {m: "남자: ", f: "여자: ", n: ""};
/* v2.34: a set (one script or text, two or more questions) shows the script or text once; a score line counts the answers on this page */
const tqList = b => b.tq.flatMap((q, i) => q.qs ? q.qs.map((s, j) => [b.code + "#" + i + "." + j, s]) : [[b.code + "#" + i, q]]);
function tqScore(b){ const L = tqList(b), done = L.filter(([k]) => TQ[k] != null), ok = done.filter(([k, q]) => TQ[k] === q.a).length;
  return done.length ? ok + " / " + done.length + " correct (" + L.length + " questions)" : ""; }   // v1.18.2: nothing until the first answer (RYU)
const TQB = {};
function tqDone(k){ const code = k.split("#")[0], b = TQB[code]; if (!b) return; const L = tqList(b); if (L.every(([x]) => TQ[x] != null)) ST.log("topik", code, L.filter(([x, q]) => TQ[x] === q.a).length, L.length); }   // usage statistics: TOPIK set finished
function tqView(b, bare){ TQB[b.code] = b;
  const sc = h("div", {class: "tqsc"}, tqScore(b)), again = h("div", {class: "rowbtns", style: "justify-content:center"}, h("button", {class: "btn", type: "button", onclick: () => { tqList(b).forEach(([k]) => delete TQ[k]); render(); }}, "Try these again ", h("span", {class: "ko"}, "다시 풀기")));
  const upd = () => { sc.textContent = tqScore(b); again.hidden = !sc.textContent; }; upd();
  return h("section", {class: "tq"}, bare ? null : h("h3", null, MOCK[b.code] ? "Test sheet " : "Practice questions ", h("span", {class: "ko"}, MOCK[b.code] ? "시험지" : "연습 문제"),
      MOCK[b.code] ? h("button", {class: "btn tqnew", type: "button", onclick: () => newMock(b.code)}, "New test ", h("span", {class: "ko"}, "새 시험지"))
        : isPage(b.code) ? h("button", {class: "btn tqnew", type: "button", onclick: () => newPage(b.code)}, "New questions ", h("span", {class: "ko"}, "새 문제")) : null), b.tq.map((q, i) => tqItem(b, q, i, upd)), sc, again);
}
const tqScript = au => h("div", {class: "tqs ko"}, au.map(l => h("div", null, WHO[l[0]] ? h("b", null, WHO[l[0]]) : null, l[1])));
/* picture questions (v1.18.11, RYU): the four pictures themselves are the answer buttons */
/* v1.19.18: wrap each h3 and what follows it (up to the next h3 or h2) in the .ib box used on the 대한민국 pages */
/* v1.21.13 (RYU): help pages grouped like the info pages. The menu overview table becomes area cards in the menu's groups
   (the · and | of the menu), each with its colour, lesson count and a tap to open it; other pages: one box per h3 section,
   and the table or pictures before the first h3 in a box of their own */
const HPI = {K2: "💬", K1: "ㄱ", K6: "🧩", K7: "📖", LS: "🎧", TP: "📝", K4: "🎓", K5: "💼", KR: "🇰🇷", JB: "🏯", HP: "❓"};
const HPG = ["한국어 공부 · TOPIK", "대학 생활 · 아르바이트", "대한민국 · 전주", "도움말"];
function hpBoxes(art, code){
  const tb = art.querySelector("table.facts");
  if (code === "HP-A-02" && tb){
    const D = new Map([...tb.rows].map(r => [r.cells[0].textContent.trim(), r.cells[1].innerHTML]));
    const wrap = h("div", {class: "mgrps"}); let grp = null, gi = 0;
    for (const [a, ko, en] of AREAS){
      if (!grp || (META.seps || []).includes(a)){ grp = h("div", {class: "mcards mg" + (gi % 4)}); wrap.append(h("div", {class: "ibml mg" + (gi % 4)}, HPG[gi++] || ""), grp); }
      const n = IDX.filter(r => areaOf(r[0]) === a).length, first = IDX.find(r => areaOf(r[0]) === a);
      const p = h("p"); p.innerHTML = D.get(ko) || "";
      const c = h(a === "HP" ? "div" : "button", {class: "mcard", type: a === "HP" ? null : "button", onclick: a === "HP" || !first ? null : () => { go(first[0]); setTimeout(() => scrollTo(0, 0), 80); }},
        h("span", {class: "mi"}, HPI[a] || "•"), h("span", {class: "mt"}, h("b", {class: "ko"}, ko), h("small", null, en + (a === "HP" ? "" : " · 묶음 " + n))), p);
      grp.append(c);
    }
    tb.replaceWith(wrap); return;
  }
  const sub = art.querySelector(".sub2"), lead = [];
  for (let n = (sub || art.querySelector("h2"))?.nextSibling; n && !(n.nodeType === 1 && /^H[23]$/.test(n.tagName)); n = n.nextSibling) lead.push(n);
  const els = lead.filter(n => n.nodeType === 1);
  if (els.length && !els.every(e => e.matches("figure.poster"))){ const ib = h("div", {class: "ib ib-f ib-lead"}), bb = h("div", {class: "ibb"}); lead[0].before(ib); ib.append(bb); bb.append(...lead); }
  ibGroup(art);
  [...art.querySelectorAll(":scope > .ib:not(.ib-lead)")].forEach((ib, i) => { ib.classList.add("hpb", "hc" + (i % 4)); ib.querySelector("h3")?.prepend(h("span", {class: "hn"}, String(i + 1))); });   // numbered, colours in turn (as phasaKAO v2.77)
}
function ibGroup(art){
  const box = (h3, items) => { const ib = h("div", {class: "ib"}), bb = h("div", {class: "ibb"}); h3.replaceWith(ib); ib.append(h3, bb); bb.append(...items); return ib; };
  art.querySelectorAll(".two > div").forEach(d => { const f = d.firstElementChild; if (f && f.tagName === "H3") { const rest = [...d.childNodes].filter(n => n !== f); box(f, rest); } });
  [...art.children].filter(e => e.tagName === "H3").forEach(h3 => { const items = []; let n = h3.nextSibling;
    while (n && !(n.nodeType === 1 && /^H[23]$/.test(n.tagName)) && !(n.id === "tpRandom")) { items.push(n); n = n.nextSibling; }
    box(h3, items); });
}
function tqPics(q){ if (!q.p || !q.o || q.o.join("") !== "①②③④" || !q.p.includes('class="pics"')) return null;
  const t = document.createElement("template"); t.innerHTML = q.p; const ds = [...t.content.querySelectorAll(".pics > div")];
  return ds.length === 4 ? ds.map(d => { d.querySelector("b")?.remove();
    const sp = d.querySelector("span:not(.tx)");   /* v1.18.13: Korean words in a picture (graph labels) at text size, the icon stays big */
    if (sp && /[가-힣0-9]/.test(sp.textContent)) { const m = sp.textContent.match(/^([^가-힣A-Za-z0-9]*)(.*)$/s);   /* v1.19.18: numbers too (300 → 600) */
      sp.className = "tx kt"; sp.textContent = m[2].trim(); if (m[1].trim()) { const em = document.createElement("i"); em.className = "em"; em.textContent = m[1].trim(); d.insertBefore(em, sp); } }
    return d.innerHTML; }) : null; }
function tqChoices(q, k, redo, pics){ const st = TQ[k];
  return [h("div", {class: "choices tqo" + (pics ? " picgrid" : q.o.length < 3 ? " two" : "")}, q.o.map((o, j) => h("button", {class: "choice" + (pics ? " picch" : "") + (q.lo ? "" : " ko") + (st != null ? (j === q.a ? " right" : j === st ? " wrong" : "") : ""), type: "button", disabled: st != null,
      onclick: () => { TQ[k] = j; tpMark(k, j === q.a); redo(); tqDone(k); }}, h("span", {class: "n"}, NUM[j]), ...(pics ? [(() => { const d = h("div", {class: "pic"}); d.innerHTML = pics[j]; return d; })()] : [" " + o])))),
    st != null ? h("div", {class: "tqx"}, h("div", {class: "res " + (st === q.a ? "ok" : "no")}, ...(st === q.a ? ["✓ Correct"] : ["✗ Not quite · Answer ", NUM[q.a]])), h("p", null, koMix(q.x)),
      h("button", {class: "btn", type: "button", onclick: () => { delete TQ[k]; redo(); }}, "Try again ", h("span", {class: "ko"}, "다시"))) : null]; }
function tqItem(b, q, i, upd){
  const k = b.code + "#" + i, redo = () => { el.replaceWith(tqItem(b, q, i, upd)); upd(); };
  const pics = tqPics(q);
  const answered = q.qs ? q.qs.some((s, j) => TQ[k + "." + j] != null) : TQ[k] != null;
  const el = h("div", {class: "tqi" + (q.qs ? " set" : "")},
    h("div", {class: "tqd"}, h("b", {class: "tqn"}, String(i + 1)),   // RYU v1.18.2: listen button on the right; the English line starts under the Korean
      h("div", {class: "tqdt"}, h("span", {class: "ko"}, q.d), q.dl ? h("div", {class: "tqdl"}, q.dl) : null),
      q.au ? h("button", {class: "wrep tbtn tqplay", type: "button", onclick: ev => tqPlay(q, ev.currentTarget)}, ico("spk"), "Listen ", h("span", {class: "ko"}, "듣기")) : null),
    q.p && !pics ? (() => { const d = h("div", {class: "tqp ko"}); d.innerHTML = q.p; return d; })() : null,
    q.au && answered ? h("details", {class: "tqsd"}, h("summary", null, "Script ", h("span", {class: "ko"}, "대본")), tqScript(q.au)) : null,
    q.qs ? q.qs.map((s, j) => h("div", {class: "tqsub"}, h("div", {class: "tqq ko"}, h("b", {class: "tqn"}, "(" + (j + 1) + ")"), h("span", null, s.q)), ...tqChoices(s, k + "." + j, redo))) : tqChoices(q, k, redo, pics));
  return el;
}
/* the script once, line by line (남자 in a man's voice); the same button stops it */
async function tqPlay(q, btn){
  if (P.mode === "tq" && P.box === btn) return stopPlay();
  stopPlay();
  const tok = ++P.tok; P.mode = "tq"; P.box = btn; P.paused = false; btn.classList.add("playing");
  for (const [who, line] of q.au){
    showPlayer("🔊 " + WHO[who] + line);
    if (!(await say(tok, line, false, who === "m"))) return;
    await gap(500);
  }
  if (tok === P.tok) stopPlay();
}
/* TOPIK question bank (v1.17, RYU 2026-11-25): random practice (TP-H-00) and random mock tests (TP-H-01, TP-H-02).
   A "unit" is one question of a page, or a whole set (one script, two questions). Random practice draws units of one area
   without repeats until the area is used up; the mock tests take one question of each type in the order of the real test.
   Wrong answers anywhere in TOPIK are kept in S.tpWrong (by their page key), and "My wrong ones" asks them again. */
const TPA = {all: ["TP-B", "TP-C", "TP-D", "TP-F", "TP-G"], "TP-B": ["TP-B"], "TP-C": ["TP-C"], "TP-D": ["TP-D"], "TP-F": ["TP-F"], "TP-G": ["TP-G"]};
const TPN = [["all", "All areas", "전체"], ["TP-B", "TOPIK I Listening", "Ⅰ 듣기"], ["TP-C", "TOPIK I Reading", "Ⅰ 읽기"], ["TP-D", "TOPIK II Listening", "Ⅱ 듣기"], ["TP-F", "TOPIK II Reading", "Ⅱ 읽기"], ["TP-G", "Vocabulary & Grammar", "어휘·문법"], ["wrong", "My wrong ones", "틀린 문제"]];
const MOCK = {
  "TP-H-01": ["TP-B-01", "TP-B-02", "TP-B-03", "TP-B-04", "TP-B-05", "TP-B-06", "TP-B-07", "TP-B-08", "TP-B-09", ["TP-B-10", "TP-B-11"],
              "TP-C-01", "TP-C-02", "TP-C-02", "TP-C-03", "TP-C-04", "TP-C-05", "TP-C-06", "TP-C-07", ["TP-C-08", "TP-C-09"], "TP-C-10"],
  "TP-H-02": ["TP-D-01", "TP-D-02", "TP-D-03", "TP-D-04", "TP-D-05", "TP-D-06", "TP-D-07", "TP-D-08", "TP-D-09", "TP-D-10",
              "TP-F-01", "TP-F-02", "TP-F-03", "TP-F-04", "TP-F-05", "TP-F-06", "TP-F-07", "TP-F-08", "TP-F-09", ["TP-F-10", "TP-F-11"]]};
const tpTitle = code => { const b = bundle(code), m = b && /<h2>(.*?)<\/h2>/.exec(b.info || ""); return m ? m[1] : code; };
const tpBundles = subs => (cache.get("TP") || []).filter(b => subs.includes(b.code.slice(0, 4)) && b.tq);
/* one question from a page: [code, i] = the whole unit, [code, i, j] = only question j of a set (as a single question) */
function tpQ(ref, here){ const [code, i, j] = ref, b = bundle(code), q = b && b.tq[i]; if (!q) return null;
  const c = JSON.parse(JSON.stringify(j == null ? q : {...q.qs[j], d: q.d + " " + q.qs[j].q, dl: q.dl, au: q.au, p: q.p}));
  if (ref[3] && !c.qs){ const o = c.o; c.o = ref[3].map(x => o[x]); c.a = ref[3].indexOf(c.a); }   // choices in a new order (kept with the sheet)
  const back = " → Review: " + tpTitle(code);
  if (here) return c;
  if (c.qs) c.qs.forEach(s => s.x += back); else c.x += back;
  return c; }
/* the page key a question of a random sheet stands for, so that a wrong answer is remembered under the page's own key */
const TPREF = {};
function tpSrc(k){ const [code, rest] = k.split("#"), refs = TPREF[code]; if (!refs) return k;
  const [i, j] = rest.split(".").map(Number), r = refs[i]; if (!r) return k;
  return r[0] + "#" + r[1] + (r[2] != null ? "." + r[2] : j != null && !isNaN(j) ? "." + j : ""); }
function tpMark(k, ok){ if (!k.startsWith("TP-")) return; const src = tpSrc(k); S.tpWrong = S.tpWrong || {};
  if (ok) delete S.tpWrong[src]; else S.tpWrong[src] = 1; save(); }
const tpClear = code => Object.keys(TQ).forEach(k => { if (k.startsWith(code + "#")) delete TQ[k]; });
/* a new order of the choices for a single question (not for picture choices ①②③④ or places in a text ㉠㉡㉢㉣) */
function tpPerm(ref){ const b = bundle(ref[0]), q = b.tq[ref[1]], s = ref[2] != null ? q.qs[ref[2]] : q;
  return s.qs || /^(①②③④|㉠㉡㉢㉣)$/.test(s.o.join("")) ? ref : [ref[0], ref[1], ref[2] ?? null, shuffle(s.o.map((_, i) => i))]; }
function tpSheet(code, refs){ TPREF[code] = refs;
  return {code, t: "", info: "", tq: refs.map(tpQ).filter(Boolean)}; }
/* mock test: the same sheet until "New test" (S.mock), so a reload does not change it */
function mockRefs(code){ S.mock = S.mock || {};
  if (!S.mock[code]){ S.mock[code] = MOCK[code].map(slot => { const c = Array.isArray(slot) ? slot[Math.floor(Math.random() * slot.length)] : slot, b = bundle(c);
    const all = b.tq.flatMap((q, i) => q.qs ? q.qs.map((s, j) => [c, i, j]) : [[c, i]]); return tpPerm(all[Math.floor(Math.random() * all.length)]); }); save(); }
  return S.mock[code]; }
function mockBundle(b){ const refs = mockRefs(b.code); TPREF[b.code] = refs; return {...b, tq: refs.map(tpQ).filter(Boolean)}; }
function newMock(code){ delete S.mock[code]; tpClear(code); save(); render(); }
/* lesson pages (RYU 2026-11-25, v1.18): 5 questions at a time from the page's own bank, no repeats until all were shown */
const PAGE_N = 5, isPage = code => /^TP-[BCDFG]-/.test(code);
function pageRefs(code){ S.tpPage = S.tpPage || {}; S.tpSeen = S.tpSeen || {};
  if (!S.tpPage[code]){ const b = bundle(code), units = b.tq.map((q, i) => [code, i]), size = r => b.tq[r[1]].qs ? b.tq[r[1]].qs.length : 1;
    let seen = new Set(S.tpSeen[code] || []), fresh = units.filter(r => !seen.has(r[1]));
    if (!fresh.length){ seen = new Set(); fresh = units; }
    const picked = []; let n = 0;
    for (const r of shuffle(fresh)){ if (n >= PAGE_N) break; picked.push(r); n += size(r); }
    if (n < PAGE_N) for (const r of shuffle(units.filter(x => !picked.includes(x)))){ if (n >= PAGE_N) break; picked.push(r); n += size(r); }
    picked.forEach(r => seen.add(r[1])); S.tpSeen[code] = [...seen];
    S.tpPage[code] = picked.map(tpPerm); save(); }
  return S.tpPage[code]; }
function pageBundle(b){ const refs = pageRefs(b.code); TPREF[b.code] = refs;
  return {...b, tq: refs.map(r => tpQ(r, true))}; }
function newPage(code){ delete S.tpPage[code]; tpClear(code); save(); render(); }
/* random practice page */
function tprMount(box){
  const st = S.tpr = S.tpr || {area: "all", n: 10};
  const units = a => a === "wrong" ? Object.keys(S.tpWrong || {}).map(k => { const [c, r] = k.split("#"), [i, j] = r.split(".").map(Number); return [c, i, isNaN(j) ? undefined : j]; }).filter(r => bundle(r[0]))
    : tpBundles(TPA[a]).flatMap(b => b.tq.map((q, i) => [b.code, i]));
  const size = r => { const q = bundle(r[0]).tq[r[1]]; return r[2] == null && q.qs ? q.qs.length : 1; };
  const draw = () => { const pool = units(st.area); if (!pool.length) return;
    S.tpSeen = S.tpSeen || {}; let seen = new Set(S.tpSeen[st.area] || []);
    let fresh = pool.filter(r => !seen.has(r.join(":")));
    if (fresh.length < 1){ seen = new Set(); fresh = pool; }
    const picked = []; let n = 0;
    for (const r of shuffle(fresh)){ if (n >= st.n) break; picked.push(r); n += size(r); }
    if (n < st.n) for (const r of shuffle(pool.filter(x => !picked.includes(x)))){ if (n >= st.n) break; picked.push(r); n += size(r); }
    picked.forEach(r => seen.add(r.join(":"))); S.tpSeen[st.area] = [...seen];
    st.refs = shuffle(picked).map(tpPerm); tpClear("TP-R"); save(); paint(); };
  const sheet = h("div", {class: "tprsheet"});
  const paint = () => {
    const pool = units(st.area), left = st.area === "wrong" ? pool.length : pool.filter(r => !new Set((S.tpSeen || {})[st.area] || []).has(r.join(":"))).reduce((t, r) => t + size(r), 0);
    box.replaceChildren(
      h("div", {class: "tprrow"}, ...TPN.map(([k, en, ko]) => { const c = k === "wrong" ? Object.keys(S.tpWrong || {}).length : null;
        return h("button", {class: "seg" + (st.area === k ? " on" : ""), type: "button", disabled: k === "wrong" && !c, onclick: () => { st.area = k; st.refs = null; tpClear("TP-R"); save(); paint(); }}, en + " ", h("span", {class: "ko"}, ko), c != null ? " · " + c : ""); })),
      h("div", {class: "tprrow"}, ...[10, 20].map(n => h("button", {class: "seg" + (st.n === n ? " on" : ""), type: "button", onclick: () => { st.n = n; save(); paint(); }}, n + " questions")),
        h("button", {class: "btn primary", type: "button", onclick: draw}, st.refs ? "New set " : "Start ", h("span", {class: "ko"}, st.refs ? "새 문제" : "시작"))),
      h("p", {class: "tprinfo"}, st.area === "wrong" ? pool.length + " questions you got wrong. A right answer takes a question off the list." :
        pool.reduce((s, r) => s + size(r), 0) + " questions in this area · " + left + " not seen yet in this round"),
      sheet);
    sheet.replaceChildren(st.refs && st.refs.length ? tqView(tpSheet("TP-R", st.refs), true) : ""); };
  paint();
}
/* word cards: a word that does not fit its line is shrunk until it does, so every word stays on one line at the same height */
function fitWords(){ document.querySelectorAll(".wcard .k").forEach(k => { let fs = parseFloat(getComputedStyle(k).fontSize);
  while (k.scrollWidth > k.clientWidth + 1 && fs > 11){ fs -= 1; k.style.fontSize = fs + "px"; } }); }
addEventListener("resize", () => { if (S.mode === "cards"){ document.querySelectorAll(".wcard .k").forEach(k => k.style.fontSize = ""); fitWords(); } });
/* last screen first, as PhasaLAO / PhasaKAO v2.99 (RYU 2026-11-28, v1.33): the clean screen is kept in localStorage ("jc-snap");
   index.html shows it at once on the next start, before app.js and the lesson data arrive, with a "Loading… (n s)" pill in the chosen language.
   Not kept while playing, searching or in a quiz. The first full render takes the copy away (html.snap) and the pill (#boot). */
/* now the shared part src/core/snap.js (2026-11-28); its storage key is in src/app-config.js */
SNAP.init({skip: () => !!(P.mode || query || S.mode === "quiz" || !bundle(S.code)), sig: () => [META.ver, LG, S.code, S.mode, innerWidth].join("|")});
function bootDone(){ SNAP.done(); }
function snapLater(){ SNAP.later(); }
function drawAll(){ drawStats(); drawGroups(); drawSubs(); drawControls(); render(); }
/* RYU 2026-11-14: coming back to an area or sub-group reopens the lesson last opened there */
function lastIn(m, k, rows){ const c = m && m[k]; return c && byCode.has(c) && c.startsWith(k + "-") ? c : rows[0][0]; }
function go(code){ if (!byCode.has(code)) return; if (location.hash === "#" + code) route(); else location.hash = code; }
async function route(){
  const name = decodeURIComponent(location.hash.replace(/^#/, ""));
  if (byCode.has(name)) S.code = name;
  (S.lastA = S.lastA || {})[areaOf(S.code)] = S.code; (S.lastS = S.lastS || {})[subOf(S.code)] = S.code;
  if (P.nav) P.nav = false; else stopPlay();
  quiz = null; save(); drawAll(); drawMine();
  ST.lesson(S.code, c => { track(c); save(); drawMine(); drawSubs(); });   // 10 s on screen: statistics + 내 학습 record (core stats v1.1, RYU 2026-11-28)
  { const c = S.code, i = IDX.findIndex(x => x[0] === c); AP.warm(c).then(() => { const n = IDX[i + 1]; if (n && S.code === c) AP.warm(n[0]); }); }   // this lesson's sound, then the next one's (for 연속 재생)
  const a = areaOf(S.code);
  if (!cache.has(a)){
    try { await loadArea(a); } catch (e) { if (areaOf(S.code) === a){ bootDone(); $("view").replaceChildren(h("p", {class: "empty"}, T.loadFail)); } return; }
    if (areaOf(S.code) === a) render();
  }
}
document.querySelectorAll(".seg button").forEach(b => b.addEventListener("click", () => { S.mode = b.dataset.mode; stopPlay(); save(); drawControls(); render(); }));
function ddClose(){ $("bselList").hidden = true; $("bselBtn").setAttribute("aria-expanded", "false"); }
$("bselBtn").addEventListener("click", e => {
  if (!e.isTrusted || Date.now() - (window.SWIPED_AT || 0) < 600) return;   // only a real tap opens the list, never the end of a swipe (rwanda-app fix, v2.52)
  const l = $("bselList"), open = l.hidden;
  if (!open) return ddClose();
  l.hidden = false; $("bselBtn").setAttribute("aria-expanded", "true");
  const on = l.querySelector('[aria-selected="true"]'); if (on) l.scrollTop = on.offsetTop - l.clientHeight / 2 + on.offsetHeight / 2;
});
document.addEventListener("click", ev => { if (!ev.target.closest("#bsel")) ddClose(); });
document.addEventListener("keydown", ev => { if (ev.key === "Escape") ddClose(); });
/* ---------- keyboard (same keys as lao-app v2.74, RYU 2026-11-20, v2.23) ----------
   Space pause / resume (idle: 묶음 재생) · A 연속 재생 (Play All) · L 묶음 재생 (Play Lesson, again = stop) · Esc stop · ← → previous / next line
   , . previous / next lesson · Enter this line without end (∞) · 1-5 횟수 · - = 속도 · S W Q tabs (Sentences Words Quiz) · E English voice · ? list of keys.
   Letters by meaning, RYU 2026-11-25 v1.5 (were Q W E tabs, C G play, K English).
   Keys go by e.code too, so they work with the Korean or Lao keyboard on; ↑ ↓ still scroll. */
function setSayLo(v){ S.sayLo = !!v; save(); const c = $("loChk"); if (c) c.checked = S.sayLo; }
{ const c = $("loChk"); if (c){ c.checked = S.sayLo !== false; c.addEventListener("change", () => { setSayLo(c.checked); try { c.blur(); } catch (e) {} }); } }
/* the keys themselves: the shared part src/core/keys.js (2026-11-28); help-card words in src/app-config.js */
KBD.init({busy: () => !!query, playing: () => !!P.mode, stop: stopPlay, voice: () => setSayLo(S.sayLo === false),
  lesson: d => { const i = byCode.get(S.code); go(IDX[(i + d + IDX.length) % IDX.length][0]); window.scrollTo(0, 0); },
  play: chain => playBundle(chain), pause: togglePause, hold: () => { if (P.mode === "single") return; P.hold = !P.hold; if (P.paused) togglePause(); }, skip: d => skipBy(d)});
/* phones show short Korean option text (2회, x 1.0) so tabs, count and speed fit on one line (RYU 2026-11-22, v2.31) */
  { const mq = matchMedia("(max-width:560px)"), lab = () => { for (const o of $("repSel").options) o.textContent = mq.matches ? o.value + "회" : o.value + "×";
      for (const o of $("rateSel").options) o.textContent = (mq.matches ? "x " : "×") + (+o.value).toFixed(1); };
    lab(); try { mq.addEventListener("change", lab); } catch (e) {} }
$("repSel").addEventListener("change", ev => { S.rep = ev.target.value; save(); });
$("rateSel").addEventListener("change", ev => { S.rate = ev.target.value; save(); const a = PL.aud(); if (a) try { a.playbackRate = +S.rate || 1; } catch (e) {} });
$("pstop").addEventListener("click", stopPlay);
$("ppause").addEventListener("click", togglePause);
$("view").addEventListener("click", ev => {
  /* a tap anywhere on a sentence or word box plays it on repeat; a second tap stops it */
  if (ev.target.closest("button, a, input, select, label")) return;
  const sel = window.getSelection && String(window.getSelection()); if (sel) return;
  const el = ev.target.closest(".line[data-say]"); if (!el) return;
  /* the word's own head line: same as its word-repeat button (word, then its sentences) (RYU 2026-11-16) */
  const word = el.dataset.head === "1" && el.closest(".word");
  if (word){ playWord(word); return; }
  playSingle(el);
});
let qTimer = 0;
$("q").addEventListener("input", ev => {
  clearTimeout(qTimer);
  qTimer = setTimeout(() => {
    query = ev.target.value.trim(); render();
    if (query) Promise.all(AREAS.map(a => loadArea(a[0]).catch(() => null))).then(() => { if (query) render(); });
  }, 200);
});
/* ---------- audio download ----------
   one zip of every clip, built in the browser: area / bundle folders, files numbered in playing order.
   Each fetch also passes through the service worker, so the clips stay saved in the app for offline use. */
const allKeys = () => Object.keys(window.AUDIO_INDEX || {});
let dlBusy = false;
/* RYU 2026-11-16 (v1.77): no zip file any more (phones then ask which app should open it). The button saves every clip
   inside the app, in the same IndexedDB store the service worker answers from ("ko-audio" / "c"), so the app plays offline. */
async function saveAll(ev){
  ev.preventDefault(); if (dlBusy) return; dlBusy = true; const msg = $("dlMsg");
  try {
    try { if (navigator.storage && navigator.storage.persist) await navigator.storage.persist(); } catch (e) {}
    const bad = await AP.saveAll((d, n) => { msg.textContent = Math.floor(d / n * 100) + "% (" + d + " / " + n + ")"; });   // one pack per lesson (v0.5)
    if (bad) throw new Error("missing " + bad);
    S.offline = {n: allKeys().length, sig: AP.sig(), at: new Date().toISOString().slice(0, 10)}; save();
    dlState(); $("dlNote").hidden = false;
  } catch (e) { msg.textContent = "✗ Try again · 다시 눌러 주세요"; }
  dlBusy = false;
}
$("dlAll").addEventListener("click", saveAll);
if (!allKeys().length) $("dlbox").hidden = true;
/* after the link: whether this device already has the zip (RYU 2026-11-14). The mark is kept per device; when
   the app gains clips after that download, it asks for a new download instead */
function dlState(){
  const msg = $("dlMsg"), d = S.offline;   // the zip-era mark (dlDone) is not used: the clips must be in the app itself
  if (!d){ msg.textContent = ""; msg.className = "count"; return; }
  const fresh = d.sig ? d.sig === AP.sig() : d.n === allKeys().length;
  msg.textContent = fresh ? "✓ " + d.at : "↻ New audio";
  msg.className = "count " + (fresh ? "dlok" : "dlnew");
}
dlState();
window.addEventListener("hashchange", route);
$("ver").replaceChildren(META.ver + " · ", h("span", {class: "cl", "aria-hidden": "true"}, "©"), " Copyleft · Free to share and adapt");   // RYU v1.16.3: copyleft line (a mirrored ©, since the 🄯 character is missing on older phones)
/* theme and text size (v1.4): kept on this device; "Auto" follows the phone's setting */
/* now the shared part src/core/prefs.js (2026-11-28); labels in src/app-config.js */
function applyPrefs(){ PREFS.apply(); }
PREFS.init({get: () => ({theme: S.theme, fz: S.fz}), set: (k, v) => { S[k] = v; save(); }, box: () => $("prefs")});
/* language: 🌐 button at the right of the search box, a picker on first launch, and a button under the theme row (v1.20) */
function langSheet(first){
  const old = $("langsheet"); if (old) old.remove();
  const close = () => { if (!S.lang){ S.lang = LG; save(); } box.remove(); document.documentElement.classList.remove("lsopen"); document.removeEventListener("keydown", esc); };
  const esc = e => { if (e.key === "Escape") close(); };
  const pick = c => { const was = LG; S.lang = c; save(); if (c !== was) location.reload(); else close(); };
  const box = h("div", {id: "langsheet", class: "langsheet"},
    h("div", {class: "lsbg", onclick: close}),
    h("div", {class: "lscard", role: "dialog", "aria-modal": "true", "aria-label": "Choose your language"},
      h("div", {class: "lshead"}, h("img", {src: "img/jey/jey.webp", alt: "", width: 33, height: 46}),
        h("div", null, h("div", {class: "lst"}, "Choose your language"), h("div", {class: "lss"}, h("span", {class: "ko"}, "설명 언어 선택")))),
      h("p", {class: "lsnote"}, "Korean stays Korean. Meanings, tips and help are shown in your language."),
      LANG_LIST.map(([c, name, ko]) => { const ok = c === "en" || LANGS[c], on = c === LG;
        return h("button", {type: "button", class: "lsopt" + (on ? " on" : ""), disabled: !ok, "aria-pressed": on ? "true" : "false", onclick: ok ? () => pick(c) : null},
          h("b", {class: "notr"}, c.toUpperCase()), h("span", {class: "lsn notr"}, name, " ", h("span", {class: "ko"}, ko)),
          on ? h("span", {class: "lsok", "aria-hidden": "true"}, "✓") : null, ok ? null : h("span", {class: "lssoon ko"}, "준비 중")); }),
      LX && LX.note ? h("p", {class: "lsfoot"}, LX.note) : null,
      h("p", {class: "lsfoot"}, "You can change it any time with 🌐 at the top. ", h("span", {class: "ko"}, "언제든 위의 🌐 로 바꿀 수 있어요."))));
  document.body.appendChild(box); document.documentElement.classList.add("lsopen"); document.addEventListener("keydown", esc);   /* v1.30.2: page behind does not scroll; the card scrolls */
  const b = box.querySelector(".lsopt.on") || box.querySelector(".lsopt"); if (b && !first) b.focus();
}
if (Object.keys(LANGS).length){
  const sb = document.querySelector("label.search");
  if (sb) sb.appendChild(h("button", {type: "button", class: "langbtn", "aria-label": "Language", title: "Language 언어", onclick: ev => { ev.preventDefault(); langSheet(); }}, h("span", {"aria-hidden": "true"}, "🌐"), " " + LG.toUpperCase()));
  /* v1.31.21 (RYU): footer 🌐 button removed (the 🌐 by the search box does the same) */
  if (!S.lang && location.hash.length > 1) setTimeout(() => langSheet(true), 400);   // v1.25: with no lesson link the intro (src/intro.js) asks for the language
}
/* v1.25 (RYU 2026-11-27): the intro page (src/intro.js) reads and sets these */
window.JC = {S, save, applyPrefs, setSayLo, speak: speakOne, quiet, LG, LANGS, LANG_LIST, nWords: META.nWords, nSents: META.nSents, nAreas: AREAS.length, ver: META.ver};
/* buttons and labels in the chosen language: each known English label is swapped as soon as it appears in the page (ui.tsv; "{n}" = a number) */
if (LX){
  const U = LX.u || {}, RX = [], KONAME = (LANG_LIST.find(x => x[0] === LG) || [])[2] || "";
  for (const k in U) if (k.includes("{n}")) RX.push([new RegExp("^" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/\\\{n\\\}/g, "([\\d,.%]+)") + "$"), U[k]]);
  const one = s => { const t = s.trim(); if (!t || !/[A-Za-z]/.test(t)) return null;
    let v = U[t]; if (v == null) for (const [r, w] of RX){ const m = r.exec(t); if (m){ let j = 1; v = w.replace(/\{n\}/g, () => m[j++]); break; } }
    return v == null ? null : s.replace(t, v); };
  const ATT = ["placeholder", "title", "aria-label"];
  const attrs = el => { for (const a of ATT){ const x = el.getAttribute(a); if (x){ const v = one(x); if (v != null && v !== x) el.setAttribute(a, v); } } };
  const tr = n => {
    if (n.nodeType === 3){ if (n.parentElement && n.parentElement.closest(".notr")) return; if (n.parentElement && n.parentElement.closest(".ko,script,style")){ if (n.nodeValue.includes("영어 음성")) n.nodeValue = n.nodeValue.replace("영어 음성", KONAME + " 음성"); return; } const v = one(n.nodeValue); if (v != null && v !== n.nodeValue) n.nodeValue = v; return; }   // same text: no write (a write is a new mutation, which would loop)
    if (n.nodeType !== 1 || /^(SCRIPT|STYLE)$/.test(n.tagName)) return;
    attrs(n); n.querySelectorAll("[placeholder],[title],[aria-label]").forEach(attrs);
    const w = document.createTreeWalker(n, NodeFilter.SHOW_TEXT); const list = []; let x; while ((x = w.nextNode())) list.push(x); list.forEach(tr);
  };
  tr(document.body);
  new MutationObserver(ms => { for (const m of ms){ if (m.type === "characterData") tr(m.target); else m.addedNodes.forEach(tr); } })
    .observe(document.body, {childList: true, subtree: true, characterData: true});
}
route();
if ("serviceWorker" in navigator && window.KO_SW) navigator.serviceWorker.register("sw.js" + (LX ? "?lang=" + LG : "")).catch(() => {});
/* v1.21.12 (RYU): tapping the title at the top left (or "JeyCampus" in the sticky bar) goes back to the first menu's first lesson, at the top */
/* v1.25.5 (RYU 2026-11-27): it now opens the intro page (src/intro.js); the old jump stays as the fallback */
(() => { const home = () => { if (window.JC && window.JC.intro){ window.JC.intro(); return; }
    const g = document.querySelector("#groups .group"), r = g && IDX.find(r => areaOf(r[0]) === g.dataset.g);
    if (r) go(r[0]); setTimeout(() => scrollTo(0, 0), 80); };
  for (const e of [document.querySelector(".top .brand"), document.querySelector("#stick .strow > b")]) if (e){
    e.style.cursor = "pointer"; e.setAttribute("role", "link"); e.setAttribute("tabindex", "0"); e.title = "JeyCampus";
    e.addEventListener("click", home); e.addEventListener("keydown", ev => { if (ev.key === "Enter") home(); }); } })();
})();
/* phone swipe left / right = next / previous bundle, like the 다음 묶음 / 이전 묶음 buttons (lao-app v3.23, RYU 2026-11-23, v2.49).
   Ignored: screen edges (browser back gesture), menus, pickers, tables that scroll sideways (v2.50: plain tables on 대한민국 pages swipe), the player bar, anything that scrolls sideways,
   short or slow swipes, mostly vertical moves, and text selection. */
(function(){ let sx = 0, sy = 0, st = 0, ok = false;
  const hscroll = el => { for (; el && el !== document.body; el = el.parentElement){ if (el.scrollWidth > el.clientWidth + 4){ const o = getComputedStyle(el).overflowX; if (o === "auto" || o === "scroll") return true; } } return false; };
  document.addEventListener("touchstart", e => { ok = false; if (e.touches.length !== 1) return; const t = e.touches[0], w = innerWidth;
    if (t.clientX < 24 || t.clientX > w - 24) return;
    const el = e.target; if (el.closest && el.closest("input,select,textarea,#player,.dd,#groups,#subs,#kbhelp")) return; if (hscroll(el)) return;
    sx = t.clientX; sy = t.clientY; st = Date.now(); ok = true; }, {passive: true});
  /* v2.51 (RYU 2026-11-23 "곧바로 안 넘어간다"): decide during the move, not at lift-off; looser limits (60px, 1s, 1.5× more sideways
     than down); change the bundle at once and only slide the new one in (no 150ms wait before it) */
  const fire = (dx) => { ok = false; window.SWIPED_AT = Date.now();
    try { const s = getSelection(); if (s && String(s).length) return; } catch (_) {}
    const b = document.querySelector(dx < 0 ? "#view .pn.nx" : "#view .pn.pv"); if (!b) return;
    b.click();
    const sh = document.getElementById("sheet"); if (!sh) return;
    sh.style.transition = "none"; sh.style.transform = "translateX(" + (dx < 0 ? 36 : -36) + "px)"; sh.style.opacity = ".4";
    requestAnimationFrame(() => requestAnimationFrame(() => { sh.style.transition = "transform .16s ease-out,opacity .16s"; sh.style.transform = ""; sh.style.opacity = ""; })); };
  const judge = (t, end) => { const dx = t.clientX - sx, dy = t.clientY - sy;
    if (Date.now() - st > 1000) { ok = false; return; }
    if (Math.abs(dy) > 40 && Math.abs(dy) > Math.abs(dx)) { ok = false; return; }   // a vertical scroll: leave it
    if (Math.abs(dx) >= 60 && Math.abs(dx) >= Math.abs(dy) * 1.5) fire(dx); else if (end) ok = false; };
  document.addEventListener("touchmove", e => { if (ok && e.touches.length === 1) judge(e.touches[0], false); }, {passive: true});
  document.addEventListener("touchend", e => { if (ok) judge(e.changedTouches[0], true); }, {passive: true});
  document.addEventListener("touchcancel", () => { ok = false; }, {passive: true});

})();

{ const $ = id => document.getElementById(id);
  const h = (tag, attrs) => { const el = document.createElement(tag); for (const k in attrs || {}) el.setAttribute(k, attrs[k]); return el; };
// v1.31.0 (RYU 2026-11-27 design review): the title, search, progress and menus share one <aside id="side">.
// Wide landscape screens (src/layout.css) show it as a left column that stays put; everywhere else it is display:contents, so the page looks as before.
(function(){
  const app = $("app"); if (!app || $("side")) return;
  const parts = [app.querySelector("header.top"), app.querySelector(".search"), $("mine"), $("svbox"), app.querySelector(".menubox")].filter(Boolean);
  if (!parts.length) return;
  const side = h("aside", {id: "side", "aria-label": "Menu"}); app.insertBefore(side, parts[0]); side.append(...parts);
  /* the key list under the play buttons became one ⌨ button (PC, pad); ? still opens it */
  const kb = $("kbinfo"); if (kb){ const b = h("button", {type: "button", class: "kbbtn", title: "Keyboard shortcuts 키보드 단축키 (?)", "aria-label": "Keyboard shortcuts"}); b.textContent = "⌨"; b.addEventListener("click", () => document.dispatchEvent(new KeyboardEvent("keydown", {key: "?", bubbles: true}))); kb.appendChild(b); }
})();
// v2.54 RYU: design A — sticky menu bar, PC hover glide, arrow buttons (same code as the hotel English app v1.51–v1.57)
// menu bar that stays at the top while reading down: now the shared part src/core/stick.js (2026-11-28)

// PC menu rows (glide after the mouse, arrow buttons, wheel): now the shared part src/core/menu.js (2026-11-28)
}

// 당겨서 새로고침 (RYU 2026-11-27): the shared part core/ptr.js
