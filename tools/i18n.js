/* Other explanation languages (Vietnamese first, RYU 2026-11-25). Korean, romanisation and menu names stay; the English meanings,
   explanations, tips and help pages are replaced by the chosen language.
   src/i18n/<lang>/strings.tsv   "English<TAB>translation", one line each (a reviewer can read and correct it)
   src/i18n/<lang>/info/<code>.html   a whole info page (도움말, TOPIK, 대한민국, 전주) in that language
   src/i18n/<lang>/titles.txt   "code | lesson title"   ·   src/i18n/<lang>/ui.tsv   app buttons and labels
   A text with no translation stays English, so a half-done language still works.
     node tools/i18n.js todo vi K2 K1 HP     → /tmp/i18n-todo.tsv: numbered texts still missing (Korean beside them)
     node tools/i18n.js add vi answer.tsv    → "number<TAB>translation" lines from the todo list go into strings.tsv
     node tools/i18n.js stat vi              → how much of each menu is done
   build.js calls apply() and writes data/<lang>/<area>.json. */
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, ".."), HANGUL = /[가-힣ㄱ-ㅣ]/, LATIN = /[A-Za-z]/;
const isEn = s => typeof s === "string" && LATIN.test(s) && !/^https?:/.test(s);
const enOnly = s => isEn(s) && !HANGUL.test(s);

/* every English text of a bundle that is shown as a meaning or explanation: f(text, korean beside it) returns the new text or null */
function walk(b, f){
  const at = (arr, i, ko) => { if (arr && isEn(arr[i])){ const v = f(arr[i], ko); if (v != null) arr[i] = v; } };
  const gl = list => (list || []).forEach(g => Array.isArray(g) && at(g, 2, g[0]));
  const ex = e => { at(e, 2, e[0]); gl(e[3]); };
  // "개 dog", "학생 student": Korean, then its meaning (romanisation such as "어 eo" is kept: only known meanings are replaced)
  const tail = (s, strict) => { const m = /^(.*[가-힣)]\S*)\s+([A-Za-z][^가-힣]*)$/.exec(s); if (!m) return s; const v = f(m[2].trim(), m[1], strict); return v != null ? m[1] + " " + v : s; };
  if (b.i) at(b.i, 1, b.i[0]);
  if (b.sm) at(b.sm, 1, b.sm[0]);
  (b.m || []).forEach(m => at(m, 1, m[0]));
  (b.tp || []).forEach(t => at(t, t.length > 1 ? 1 : 0, t.length > 1 ? t[0] : ""));
  [].concat(b.w || [], b.f || []).forEach(w => { at(w, 2, w[0]); (w[3] || []).forEach(ex); });
  (b.e || []).forEach(ex);
  (b.c || []).forEach(c => { at(c, 3, c[1]); gl(c[4]); if (typeof c[0] === "string") c[0] = tail(c[0], true); });
  (b.dl || []).forEach(d => { at(d, 2, d[1]); gl(d[3]); });
  (b.pr || []).forEach((p, i) => { b.pr[i] = p.map(s => typeof s === "string" ? tail(s, true) : s); });
  /* tables: "가다 = to go", an English cell, or "규칙을 지키다 to follow the rules" (v1.30.7: the last kind and one-word cells too;
     a romanisation cell such as "jigwon" stays, because only texts found in strings.tsv are replaced) */
  (b.x || []).forEach((r, j) => { if (j) r.forEach((c, i) => { if (typeof c !== "string") return;
    const m = /^(.*?=\s*)(.+)$/.exec(c); if (m && HANGUL.test(m[1]) && enOnly(m[2])){ const v = f(m[2].trim(), m[1].replace(/\s*=\s*$/, "")); if (v != null) r[i] = m[1] + v; }
    else if (enOnly(c)){ const v = f(c.trim(), r[i ? 0 : 1] || "", !/\s/.test(c.trim())); if (v != null) r[i] = v; }
    else if (HANGUL.test(c) && LATIN.test(c)) r[i] = tail(c, true); }); });
  (b.qz || []).forEach(q => {
    const whole = typeof q[0] === "string" ? f(q[0].trim(), q[1], true) : null;   // an all-English question (pronunciation checks) is translated as a whole
    if (whole != null) q[0] = whole;
    else if (typeof q[0] === "string") q[0] = q[0].replace(/"([^"가-힣]*[A-Za-z][^"가-힣]*)"/g, (all, e) => { const v = f(e, q[1], true); return v != null ? '"' + v + '"' : all; })
      .replace(/(\?\s+)([^가-힣?]+)$/, (all, a, list) => !LATIN.test(list) ? all : a + list.split(" / ").map(o => { const v = f(o.trim(), "", true); return v != null ? v : o; }).join(" / "));
    if (enOnly(q[1])){ const v = f(q[1], q[0], true); if (v != null) q[1] = v; }
  });
  const tq = q => { for (const k of ["dl", "x"]) if (isEn(q[k])){ const v = f(q[k], q.d || ""); if (v != null) q[k] = v; }
    if (q.lo && Array.isArray(q.o)) q.o = q.o.map(o => { const v = enOnly(o) ? f(o.trim(), q.d || "", true) : null; return v != null ? v : o; });   // English answer choices (v1.30.7)
    (q.qs || []).forEach(tq); };
  (b.tq || []).forEach(tq);
}
function load(lang){
  const dir = path.join(root, "src/i18n", lang), S = new Map();
  const tsv = path.join(dir, "strings.tsv");
  if (fs.existsSync(tsv)) for (const l of fs.readFileSync(tsv, "utf8").split("\n")){ const i = l.indexOf("\t"); if (i > 0 && !l.startsWith("#")) S.set(l.slice(0, i), l.slice(i + 1)); }
  const T = new Map(), tt = path.join(dir, "titles.txt");
  if (fs.existsSync(tt)) for (const l of fs.readFileSync(tt, "utf8").split("\n")){ const m = /^(\S+) \| (.+)$/.exec(l.trim()); if (m) T.set(m[1], m[2]); }
  const U = new Map(), ut = path.join(dir, "ui.tsv");
  if (fs.existsSync(ut)) for (const l of fs.readFileSync(ut, "utf8").split("\n")){ const i = l.indexOf("\t"); if (i > 0 && !l.startsWith("#")) U.set(l.slice(0, i), l.slice(i + 1)); }
  const infoDir = path.join(dir, "info");
  return {dir, S, T, U, info: code => { const f = path.join(infoDir, code + ".html"); return fs.existsSync(f) ? fs.readFileSync(f, "utf8").trim() : null; }};
}
/* a bundle in another language (a copy; the English one is not changed) */
function apply(b, L){
  const c = JSON.parse(JSON.stringify(b));
  walk(c, s => L.S.has(s) ? L.S.get(s) : L.S.has(s.trim()) ? L.S.get(s.trim()) : null);
  /* a table column headed 영어 now holds the student's language (v1.30.7) */
  const KN = {zh: "중국어", vi: "베트남어", uz: "우즈베크어", my: "미얀마어", ne: "네팔어", lo: "라오스어"}[path.basename(L.dir)];
  if (KN && c.x && c.x[0]) c.x[0] = c.x[0].map(h => h === "영어" ? KN : h);
  if (c.info){ const v = L.info(c.code); if (v) c.info = v; }
  return c;
}
module.exports = {walk, load, apply};

if (require.main === module){
  const [cmd, lang, ...rest] = process.argv.slice(2), L = load(lang), M = require(path.join(root, "src/meta.js"));
  const areas = rest.length ? rest : M.areas.map(a => a[0]);
  if (cmd === "todo" || cmd === "stat"){
    const need = new Map(), stat = [];
    for (const a of (cmd === "stat" ? M.areas.map(x => x[0]) : areas)){
      let n = 0, done = 0, inf = 0, infDone = 0;
      for (const b of JSON.parse(fs.readFileSync(path.join(root, "data", a + ".json"), "utf8"))){
        walk(JSON.parse(JSON.stringify(b)), (s, ko, strict) => { s = s.trim(); n++; if (L.S.has(s)) done++; else if (!strict && !need.has(s)) need.set(s, ko || ""); return null; });
        if (b.info){ inf++; if (L.info(b.code)) infDone++; }
      }
      stat.push(a + "  texts " + done + "/" + n + (inf ? "  pages " + infDone + "/" + inf : ""));
    }
    if (cmd === "stat"){ console.log(stat.join("\n")); return; }
    // strict texts (quiz words, "개 dog") are only replaced when the same text is translated somewhere else
    const out = [...need].map(([en, ko], i) => (i + 1) + "\t" + ko.replace(/\s+/g, " ").slice(0, 80) + "\t" + en);
    fs.writeFileSync(process.env.TODO || "/tmp/i18n-todo.tsv", out.join("\n") + "\n");
    console.log(out.length + " texts to translate → " + (process.env.TODO || "/tmp/i18n-todo.tsv"));
  } else if (cmd === "add"){
    const todo = new Map(fs.readFileSync(process.env.TODO || "/tmp/i18n-todo.tsv", "utf8").split("\n").filter(Boolean).map(l => { const p = l.split("\t"); return [p[0], p[2]]; }));
    const tsv = path.join(L.dir, "strings.tsv"); fs.mkdirSync(L.dir, {recursive: true});
    let n = 0, bad = [];
    for (const f of rest) for (const l of fs.readFileSync(f, "utf8").split("\n")){
      const m = /^(\d+)\t(.+)$/.exec(l); if (!m) continue;
      const en = todo.get(m[1]); if (!en){ bad.push(m[1]); continue; }
      L.S.set(en, m[2].trim()); n++;
    }
    const head = "# English\tTiếng Việt (" + lang + "). Machine-made by Claude: please have a native speaker check it.\n";
    fs.writeFileSync(tsv, head + [...L.S].map(([e, v]) => e + "\t" + v).join("\n") + "\n");
    console.log("added " + n + (bad.length ? ", unknown numbers " + bad.join(",") : "") + "; strings.tsv has " + L.S.size);
  }
}
