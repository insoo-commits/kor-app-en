const SHELL="koen-shell-2026-11-28-v1.33.1";
const FILES=["./","index.html","app.js","audio/index.js","audio/index-en.js","audio/index-bn.js","audio/index-lo.js","audio/index-my.js","audio/index-ne.js","audio/index-uz.js","audio/index-vi.js","audio/index-zh.js","manifest.webmanifest","icon.svg","data/K2.json","data/K1.json","data/K6.json","data/K7.json","data/LS.json","data/TP.json","data/K4.json","data/K5.json","data/KR.json","data/JB.json","data/HP.json"];
/* v1.30.7: the app registers sw.js?lang=<code>, so the lessons of the student's own language are kept for offline use too, not only the English ones */
const LG=new URL(location).searchParams.get("lang");if(["bn","lo","my","ne","uz","vi","zh"].includes(LG))FILES.push(["K2","K1","K6","K7","LS","TP","K4","K5","KR","JB","HP"].map(a=>"data/"+LG+"/"+a+".json"));
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
