// Builds the app from src/ and the bundle JSON.
//   node build.js [bundlesDir]     (bundlesDir defaults to ./data, which holds K1.json … K9.json)
// Output, in the repository root (served by GitHub Pages): index.html, app.js, sw.js, manifest.webmanifest, icon.svg, data/
//         preview/korean-app.html: the same app as one page, for a preview (not committed).
// Edit src/ and run this; do not edit the generated files. To release, change VER below (small change: bump the decimal).
const fs = require("fs"), path = require("path");
const root = __dirname, src = path.join(root, "src");
const bundles = process.argv[2] || path.join(root, "data");
const M = require(path.join(src, "meta.js"));
const STATS_PUBLIC = /const STATS_PUBLIC = true;/.test(fs.readFileSync(path.join(src, "stats.js"), "utf8"));
const VER = "2026-11-28 v1.33.6";
const read = f => fs.readFileSync(path.join(src, f), "utf8");
fs.mkdirSync(path.join(root, "data"), {recursive: true});
fs.mkdirSync(path.join(root, "preview"), {recursive: true});

// English names of the bundle titles (src/titles-en.txt: "code | English"), shown in brackets in the lesson list
const tlo = new Map(fs.readFileSync(path.join(root, "src/titles-en.txt"), "utf8").split("\n").filter(l => l.trim() && !l.startsWith("#")).map(l => l.split(" | ").map(x => x.trim())));
const idx = [], ALL = [], BY = {};
// totals shown at the top (RYU 2026-11-15): lessons, distinct words (w+f headwords), distinct Korean sentences
const wordSet = new Set(), sentSet = new Set();
for (const [a] of M.areas){
  const list = JSON.parse(fs.readFileSync(path.join(bundles, a + ".json"), "utf8"));
  for (let i = list.length - 1; i >= 0; i--) if (list[i].code === "HP-C-01") list.splice(i, 1);
  if (a === "HP" && STATS_PUBLIC) list.push(JSON.parse(read("statspage.json")));   // 사용 통계 page (src/statspage.json) only when src/stats.js says STATS_PUBLIC = true
  for (const b of list){
    idx.push([b.code, b.t, b.lv, b.info ? "info" : b.type, tlo.get(b.code) || "", (b.w || []).length + (b.f || []).length, [].concat(b.w || [], b.f || []).reduce((t, w) => t + ((w[3] || []).length), 0) + (b.dl || []).length + (b.e || []).length]);
    for (const k of ["w", "f"]) for (const w of b[k] || []){ wordSet.add(w[0]); for (const e of w[3] || []) sentSet.add(e[0]); }
    for (const d of b.dl || []) sentSet.add(d[1]);
    for (const k of ["c", "e", "x"]) for (const r of b[k] || []) if (typeof r[0] === "string") sentSet.add(r[0]);
    if (!tlo.get(b.code)) console.warn("no English title for " + b.code);
    if (!M.subs[b.code.slice(0, 4)]) throw new Error("no sub-group name for " + b.code);
  }
  fs.writeFileSync(path.join(root, "data", a + ".json"), JSON.stringify(list));
  ALL.push(...list); BY[a] = list;
}
/* related lessons (like lao-app's 관련 묶음, RYU 2026-11-18): lessons that share this lesson's words, rarer words count more;
   a word that is a headword there counts double. Up to 5, best first. */
const REL = {};
{
  const heads = b => [...new Set([].concat(b.w || [], b.f || []).map(w => w[0].replace(/\(.*?\)|[①-⑩]/g, "").trim()).filter(w => w.length >= 2))];
  const H = new Map(ALL.filter(b => !b.info).map(b => [b.code, new Set(heads(b))]));
  const TX = new Map(ALL.filter(b => !b.info).map(b => [b.code, JSON.stringify([[].concat(b.w || [], b.f || []).map(w => [w[0], (w[3] || []).map(e => e[0])]), b.dl && b.dl.map(d => d[1]), b.e && b.e.map(e => e[0])])]));
  const N = TX.size, DF = new Map();
  const df = w => { if (!DF.has(w)){ let n = 0; for (const t of TX.values()) if (t.includes(w)) n++; DF.set(w, n); } return DF.get(w); };
  const idf = w => { const d = df(w); return d > 40 ? 0 : Math.log(N / d); };
  for (const b of ALL){
    if (b.code.startsWith("K1-") || b.info) continue;   // info pages (대한민국) get no related lessons   // letters and sounds: shared words there are only samples
    const A = H.get(b.code), TA = TX.get(b.code), sc = {};
    A.forEach(w => { const f = idf(w); if (!f) return; for (const [k, t] of TX){ if (k === b.code || k.startsWith("K1-") || !t.includes(w)) continue; sc[k] = (sc[k] || 0) + f * (H.get(k).has(w) ? 2 : 1); } });
    for (const [k, hs] of H){ if (k === b.code || k.startsWith("K1-")) continue; hs.forEach(w => { if (A.has(w) || !TA.includes(w)) return; const f = idf(w); if (f) sc[k] = (sc[k] || 0) + f * 0.7; }); }
    const top = Object.keys(sc).filter(k => sc[k] >= 3).sort((x, y) => sc[y] - sc[x]).slice(0, 5);
    if (top.length) REL[b.code] = top;
  }
}
/* other explanation languages (src/i18n/<lang>/, tools/i18n.js, v1.20): data/<lang>/<area>.json, lesson titles and button labels in KO_META.langs */
const I18N = require(path.join(root, "tools/i18n.js")), LANGS = {}, LDATA = {};
const idir = path.join(src, "i18n");
for (const lg of fs.existsSync(idir) ? fs.readdirSync(idir).filter(d => fs.statSync(path.join(idir, d)).isDirectory()).sort() : []){
  const L = I18N.load(lg); fs.mkdirSync(path.join(root, "data", lg), {recursive: true}); LDATA[lg] = {};
  for (const [a] of M.areas){ const list = BY[a].map(b => I18N.apply(b, L)); LDATA[lg][a] = list; fs.writeFileSync(path.join(root, "data", lg, a + ".json"), JSON.stringify(list)); }
  const note = fs.existsSync(path.join(L.dir, "note.txt")) ? fs.readFileSync(path.join(L.dir, "note.txt"), "utf8").trim() : "";
  LANGS[lg] = {t: Object.fromEntries(L.T), u: Object.fromEntries(L.U), note};
  console.log("language " + lg + ": " + L.S.size + " texts, " + L.T.size + " titles, " + L.U.size + " labels");
}
const SUBPIC = fs.existsSync(path.join(__dirname, "data", "subpics.json")) ? fs.readFileSync(path.join(__dirname, "data", "subpics.json"), "utf8") : "{}";   // one picture per sub-group (tools/pics/subpics.py, RYU 2026-11-24)
const meta = "window.KO_SUBPIC=" + SUBPIC + ";\n" + "window.KO_META=" + JSON.stringify({areas: M.areas, alias: M.alias || {}, hidden: M.hidden || [], seps: M.seps || [], subAlias: M.subAlias || {}, subArea: M.subArea || {}, parts: M.parts || {}, subs: M.subs, idx, rel: REL, langs: LANGS, ver: VER, nWords: wordSet.size, nSents: sentSet.size}) + ";";
// iPad / large touch screens (html.tab, set by the same check as the Lao app): text bigger, layout width unchanged.
// Every px font-size in app.css gets an html.tab copy scaled by TAB_K, inside the same @media block (RYU 2026-11-14, v0.96).
const TAB_K = 1.2;
function tabCss(src){
  const s = src.replace(/\/\*[\s\S]*?\*\//g, ""), out = [];
  const pre = sel => sel.split(",").map(x => x.trim()).filter(Boolean).map(x => /^(html|:root)\b/.test(x) ? x.replace(/^(html|:root)/, "html.tab") : "html.tab " + x).join(",");
  const rule = (sel, decl) => { const m = [...decl.matchAll(/font-size:\s*([\d.]+)px/g)].pop(); return m ? pre(sel) + "{font-size:" + (+(m[1] * TAB_K).toFixed(2)) + "px}" : ""; };
  let i = 0;
  const block = (end) => { const r = []; while (i < s.length){ while (/\s/.test(s[i] || "")) i++; if (i >= s.length || s[i] === "}"){ i++; break; }
      const o = s.indexOf("{", i); if (o < 0){ i = s.length; break; } const head = s.slice(i, o).trim(); i = o + 1;
      if (head.startsWith("@media")){ const inner = block(); if (inner.length) r.push(head + "{" + inner.join("") + "}"); }
      else if (head.startsWith("@")){ let d = 1; while (i < s.length && d){ if (s[i] === "{") d++; else if (s[i] === "}") d--; i++; } }
      else { const c = s.indexOf("}", i); const x = rule(head, s.slice(i, c)); if (x) r.push(x); i = c + 1; } }
    return r; };
  while (i < s.length){ const r = block(); out.push(...r); }
  return "\n/* tablet text (generated) */\nhtml.tab{zoom:1}\n" + out.join("\n");
}
const css = read("app.css") + tabCss(read("app.css")) + "\n" + read("tab.css") + "\n" + read("skin.css") + "\n" + read("layout.css") + "\n" + read("intro.css"), body = read("body.html"), clip = read("clip.js"), js = read("app-config.js") + "\n" + fs.readdirSync(path.join(src, "core")).filter(f => f.endsWith(".js")).sort().map(f => read("core/" + f)).join("\n") + "\n" + clip + "\n" + read("audiopack.js") + "\n" + read("stats.js") + "\n" + read("app.js") + "\n" + read("intro.js");

// audio: audio/list.json = every clip the app can use; audio/index.js = the clips that exist as mp3 in audio/
const {cleanKo, cleanLo, clipKey} = new Function(clip + "; return {cleanKo, cleanLo, clipKey};")();
/* packs (v1.20): audio/p/<code>.bin = the Korean of a lesson; audio/p/<lang>/<code>.bin = its meanings in one language,
   so a student downloads Korean plus only the language they chose */
const clips = new Map(), lessons = [], mlessons = {}; let cur = null, curM = null, ML = "en", KO = true;   // lessons: the clips of each lesson, for the audio packs
function want(lang, raw){
  const lo = lang === "lo", text = lo ? cleanLo(raw) : cleanKo(raw); lang = lo ? ML : lang;   // meanings: clips "en…" / "vi…"
  if (!text || (!lo && !KO)) return;
  const key = clipKey(lang, text), had = clips.get(key);
  if (had && had.text !== text) throw new Error("clip name clash: " + had.text + " / " + text);
  clips.set(key, {key, lang, text}); (lo ? curM : cur).push(key);
}
for (const lg of ["en", ...Object.keys(LANGS)]) for (const [a] of M.areas) for (const b of lg === "en" ? BY[a] : LDATA[lg][a]){
  ML = lg; KO = lg === "en"; (mlessons[lg] = mlessons[lg] || []).push([lg + "/" + b.code, curM = []]);
  if (KO) lessons.push([b.code, cur = []]); else cur = [];
  (b.l || []).forEach(l => want("ko", l[2] || l[0]));
  [].concat(b.w || [], b.f || []).forEach(w => { want("ko", w[0]); want("lo", w[2]); (w[3] || []).forEach(e => { want("ko", e[0]); want("lo", e[2]); }); });   // example Lao too: played once after the Korean (RYU 2026-11-16)
  (b.c || []).forEach(c => { want("ko", c[1]); want("lo", c[3]); });
  (b.e || []).forEach(e => { want("ko", e[0]); want("lo", e[2]); });
  (b.dl || []).forEach(d => { want((b.mv || []).includes(d[0]) ? "km" : "ko", d[1]); if (b.type === "듣기") want("lo", d[2]); });   // 듣기연습: second speaker in a man's voice, Lao meaning voiced too (v2.45)
  (b.tq || []).forEach(q => (q.au || []).forEach(l => want(l[0] === "m" ? "km" : "ko", l[1])));   // TOPIK listening: 남자 lines in a man's voice
}
fs.mkdirSync(path.join(root, "audio"), {recursive: true});
fs.writeFileSync(path.join(root, "audio/list.json"), JSON.stringify([...clips.values()], null, 0).replace(/\},\{/g, "},\n{"));
const have = fs.readdirSync(path.join(root, "audio")).filter(f => f.endsWith(".mp3")).map(f => f.slice(0, -4)).filter(k => clips.has(k)).sort();
/* audio/p/<code>.bin: one pack per lesson (tools/audiopack.js, v0.5). AUDIO_INDEX = clip -> its home pack, AUDIO_PACKS = [code, hash] */
const {writePacks} = require(path.join(root, "tools/audiopack.js"));
const AP = writePacks(path.join(root, "audio"), lessons, "");
fs.writeFileSync(path.join(root, "audio/index.js"), "window.AUDIO_INDEX=" + (have.length ? JSON.stringify(AP.index) : "null") + ";\nwindow.AUDIO_PACKS=" + JSON.stringify(AP.packs) + ";\n");
console.log("audio packs ko", AP.packs.length, "clips", Object.keys(AP.index).length, "of", have.length);
for (const lg in mlessons){ const L = writePacks(path.join(root, "audio"), mlessons[lg], lg);
  fs.writeFileSync(path.join(root, "audio/index-" + lg + ".js"), "window.AUDIO_LANG=" + JSON.stringify({index: L.index, packs: L.packs}) + ";\n");
  console.log("audio packs " + lg, L.packs.length, "clips", Object.keys(L.index).length); }
const fonts = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans+KR:wght@400;500;600&family=Noto+Sans:wght@400;600&family=Noto+Sans+Devanagari:wght@400;600&family=Noto+Sans+Myanmar:wght@400;600&family=Noto+Sans+Bengali:wght@400;600&family=Noto+Sans+Lao:wght@400;600&family=Noto+Sans+SC:wght@400;600&display=swap">';

// standalone site
fs.writeFileSync(path.join(root, "app.js"), meta + "\nwindow.KO_SW=true;\n" + js);
fs.writeFileSync(path.join(root, "index.html"), `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>JeyCampus</title>
<meta name="description" content="Learn Korean: an app for English-track students at Jeonju University">
<link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#005595"><meta name="apple-mobile-web-app-title" content="JeyCampus"><meta name="application-name" content="JeyCampus">
<link rel="icon" href="icon-192.png" type="image/png">
<!-- link preview in KakaoTalk, Facebook, LINE… (RYU 2026-11-28: was picking the Jeonju University logo from the page) -->
<meta property="og:type" content="website"><meta property="og:site_name" content="JeyCampus"><meta property="og:url" content="https://jeycampus.pages.dev/">
<meta property="og:title" content="JeyCampus · 캠퍼스라이프 한국어"><meta property="og:description" content="Korean for JJ Campus Life · 제이와 함께하는 한국어와 대학생활">
<meta property="og:image" content="https://jeycampus.pages.dev/og.jpg?v=1"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="https://jeycampus.pages.dev/og.jpg?v=1"><link rel="apple-touch-icon" href="icon-180.png">
<link rel="preconnect" href="https://fonts.googleapis.com">${fonts}
<script>/* v1.25.1 (RYU): the old address kor4et.pages.dev moves to jeycampus.pages.dev, taking this device's progress along */(function(){var K="kolearn-en-v1",h=location.hostname;try{if(h==="kor4et.pages.dev"){var d=localStorage.getItem(K)||"";location.replace("https://jeycampus.pages.dev/"+(d?"?jcm="+encodeURIComponent(d):"")+location.hash);return}var m=/[?&]jcm=([^&]*)/.exec(location.search);if(m){if(!localStorage.getItem(K)){var v=JSON.parse(decodeURIComponent(m[1]));delete v.offline;localStorage.setItem(K,JSON.stringify(v))}history.replaceState(null,"",location.pathname+location.hash)}}catch(e){}})()</script>
<script>(function(){var n=navigator,t=n.maxTouchPoints>0||"ontouchstart" in window;if((/iPad/.test(n.userAgent)||(/Macintosh/.test(n.userAgent)&&t))||(t&&Math.min(screen.width,screen.height)>=700))document.documentElement.classList.add("tab")})()</script>
<style>body{margin:0}
${css}</style></head>
<body>
${body}
<div id="boot" style="position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:9999;display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:999px;background:#005595;color:#fff;font:600 14px 'Noto Sans','Noto Sans Lao','Noto Sans Myanmar','Noto Sans Bengali','Noto Sans Devanagari','Noto Sans SC','IBM Plex Sans KR',system-ui,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.25);white-space:nowrap;max-width:calc(100vw - 32px);box-sizing:border-box"><div style="flex:none;width:16px;height:16px;border:3px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:bootspin .9s linear infinite"></div><span style="overflow:hidden;text-overflow:ellipsis"><span id="boott">Loading… please wait</span> <span style="font-family:'IBM Plex Sans KR',sans-serif">불러오는 중</span> <span id="bootsec"></span></span><style>@keyframes bootspin{to{transform:rotate(360deg)}}</style></div>
<script>/* v1.33 (RYU 2026-11-28, as PhasaLAO / PhasaKAO v2.99): settings and the last screen at once from this device, before app.js (1 MB) and the lesson data arrive.
   app.js keeps the copy ("jc-snap") and takes it away with the pill at its first full render. The scripts load after this first paint, in order. */
(function(){var t=Date.now(),iv=setInterval(function(){var b=document.getElementById("bootsec");if(!b){clearInterval(iv);return}var s=Math.floor((Date.now()-t)/1000);if(s>=2)b.textContent="("+s+"s · "+s+"초)"},500);
var S={},L="en",r=document.documentElement;try{S=JSON.parse(localStorage.getItem("kolearn-en-v1")||"null")||{}}catch(e){}L=S.lang||"en";if(!/^(${["en", ...Object.keys(LANGS)].join("|")})$/.test(L))L="en";
try{var BT=${JSON.stringify(Object.fromEntries(Object.keys(LANGS).map(lg => [lg, (LANGS[lg].u || {})["Loading… please wait"] || ""]).filter(x => x[1])))};if(BT[L])document.getElementById("boott").textContent=BT[L];
if(S.theme==="light"||S.theme==="dark")r.setAttribute("data-theme",S.theme);if(S.fz)r.style.setProperty("--fz",String(S.fz));
var h=decodeURIComponent(location.hash.replace(/^#/,""))||S.code,sn=JSON.parse(localStorage.getItem("jc-snap")||"null");
if(sn&&sn.h&&sn.sig===[${JSON.stringify(VER)},L,h,S.mode||"learn",innerWidth].join("|")){sn.h.forEach(function(x){var e=document.getElementById(x[0]);if(e){e.innerHTML=x[1];e.hidden=(sn.hid||[]).indexOf(x[0])>=0}});document.getElementById("app").setAttribute("data-g",sn.g);r.classList.add("snap")}}catch(e){}
var done=0;function go(){if(done)return;done=1;["audio/index.js?v=${encodeURIComponent(VER)}","audio/index-"+L+".js?v=${encodeURIComponent(VER)}","app.js?v=${encodeURIComponent(VER)}"].forEach(function(u){var s=document.createElement("script");s.src=u;s.async=false;document.body.appendChild(s)})}
requestAnimationFrame(function(){setTimeout(go,60)});setTimeout(go,400)})()</script>
<script>/* v1.31.30: if the app has not started after 12 s (a file did not arrive), reload once by itself, then offer a button */(function(){setTimeout(function(){if(window.JC)return;var k="jc-reload",n=0;try{n=+sessionStorage.getItem(k)||0}catch(e){}if(n<1){try{sessionStorage.setItem(k,n+1)}catch(e){}location.reload();return}var bt=document.getElementById("boot");if(bt)bt.remove();document.documentElement.classList.remove("snap");var v=document.getElementById("view");if(v)v.innerHTML='<p class="empty">Could not load. Check the internet connection. · 불러오지 못했어요.<br><br><button type="button" onclick="try{sessionStorage.removeItem(&quot;jc-reload&quot;)}catch(e){}location.reload()" style="font:inherit;padding:10px 22px;border-radius:999px;border:0;background:#005595;color:#fff">Try again · 다시 시도</button></p>'},12000);window.addEventListener("load",function(){setTimeout(function(){if(window.JC)try{sessionStorage.removeItem("jc-reload")}catch(e){}},1000)})})()</script>
</body></html>
`);
fs.writeFileSync(path.join(root, "manifest.webmanifest"), JSON.stringify({
  name: "JeyCampus", short_name: "JeyCampus", start_url: "./", display: "standalone", background_color: "#F3F4F2", theme_color: "#005595",
  icons: [{src: "icon-192.png", sizes: "192x192", type: "image/png"}, {src: "icon-512.png", sizes: "512x512", type: "image/png"}]   // JeyJey icon (v1.14, PNG from the official character file; background recolored green → JJ blue v1.24.3)
}, null, 1));
fs.writeFileSync(path.join(root, "icon.svg"), `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#005595"/><text x="256" y="340" text-anchor="middle" font-family="'Apple SD Gothic Neo','Malgun Gothic','Noto Sans KR',sans-serif" font-weight="700" font-size="280" fill="#fff">한</text></svg>`);
fs.writeFileSync(path.join(root, ".nojekyll"), "");
fs.writeFileSync(path.join(root, "sw.js"), `const SHELL="koen-shell-${VER.replace(/\s+/g, "-")}";
const FILES=["./","index.html","app.js","audio/index.js",${["en", ...Object.keys(LANGS)].map(l => '"audio/index-' + l + '.js"').join(",")},"manifest.webmanifest","icon.svg",${M.areas.map(a => '"data/' + a[0] + '.json"').join(",")}];
/* v1.30.7: the app registers sw.js?lang=<code>, so the lessons of the student's own language are kept for offline use too, not only the English ones */
const LG=new URL(location).searchParams.get("lang");if(${JSON.stringify(Object.keys(LANGS))}.includes(LG))FILES.push(${JSON.stringify(M.areas.map(a => a[0]))}.map(a=>"data/"+LG+"/"+a+".json"));
self.addEventListener("install",e=>{e.waitUntil(caches.open(SHELL).then(c=>Promise.all(FILES.map(f=>fetch(new Request(f,{cache:"reload"})).then(r=>{if(r.ok)return c.put(f,r)}).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("koen-shell-")&&k!==SHELL).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
/* Audio clips are kept in IndexedDB ("koen-audio" / store "c", key = clip name), not CacheStorage: with thousands of entries iPhone is slow to open CacheStorage (lesson from the Lao app). */
let _db;const ADB=()=>_db||(_db=new Promise((res,rej)=>{const r=indexedDB.open("koen-audio",1);r.onupgradeneeded=()=>r.result.createObjectStore("c");r.onsuccess=()=>res(r.result);r.onerror=()=>{_db=null;rej(r.error)}}));
const aget=k=>ADB().then(db=>new Promise(res=>{const q=db.transaction("c").objectStore("c").get(k);q.onsuccess=()=>res(q.result||null);q.onerror=()=>res(null)})).catch(()=>null);
const aput=(k,v)=>ADB().then(db=>new Promise(res=>{const tx=db.transaction("c","readwrite");tx.objectStore("c").put(v,k);tx.oncomplete=()=>res(true);tx.onerror=tx.onabort=()=>res(false)})).catch(()=>false);
const mp3=b=>new Response(b,{headers:{"Content-Type":"audio/mpeg","Content-Length":String(b.byteLength)}});
/* app files: network first so updates show right away; when offline, answer from the cache */
self.addEventListener("fetch",e=>{const u=new URL(e.request.url);if(e.request.method!=="GET"||u.origin!==location.origin)return;
  if(u.pathname.includes("/audio/p/"))return;   /* lesson packs: the app keeps them in IndexedDB itself (v0.5) */
  if(u.pathname.includes("/audio/")&&u.pathname.endsWith(".mp3")){const k=u.pathname.split("/").pop().slice(0,-4);
    e.respondWith(aget(k).then(b=>b?mp3(b):fetch(e.request.url).then(r=>{if(r.ok){const cl=r.clone();e.waitUntil(cl.arrayBuffer().then(b=>aput(k,b)).catch(()=>{}))}return r})));return}
  /* v1.31.30 (RYU 2026-11-28: the app sometimes froze on "Loading…"): a slow network no longer holds the page; after 5 s the saved copy
     is used, and a script or data file is never answered with the page itself (that stopped app.js from running) */
  const nav=e.request.mode==="navigate",key=nav?"index.html":e.request;
  const saved=()=>caches.match(key,{ignoreSearch:true}).then(m=>m||(nav?caches.match("index.html",{ignoreSearch:true}):null));
  const net=fetch(e.request,{cache:"no-cache"}).then(r=>{if(r.ok){const cl=r.clone();e.waitUntil(caches.open(SHELL).then(c=>c.put(key,cl)).catch(()=>{}))}return r});
  e.respondWith(new Promise(res=>{let done=false;const give=r=>{if(!done&&r){done=true;res(r)}};
    net.then(give,()=>saved().then(m=>{if(m)give(m);else if(!done){done=true;res(Response.error())}}));
    setTimeout(()=>{if(!done)saved().then(give)},5000)}))});
`);

// preview page (same app, one file plus data/)
fs.writeFileSync(path.join(root, "preview/korean-app.html"), `<title>JeyCampus</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
<style>
${css}</style>
${body}
<script>${meta}window.AUDIO_INDEX=null;</script>
<script>
${js}</script>
`);
console.log("bundles", idx.length, "site and preview written");
