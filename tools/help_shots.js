const {chromium}=require("playwright");
const OUT="/home/user/kor-app-en/img/help/";
const badge=(p,list)=>p.evaluate(list=>{document.querySelectorAll(".hsb").forEach(e=>e.remove());
  list.forEach(([sel,n,dx,dy])=>{const e=typeof sel==="string"?document.querySelector(sel):null;if(!e)return;const r=e.getBoundingClientRect();
   const d=document.createElement("div");d.className="hsb";d.textContent=n;
   Object.assign(d.style,{position:"absolute",left:(r.left+scrollX+(dx||-8))+"px",top:(r.top+scrollY+(dy||-9))+"px",width:"22px",height:"22px",borderRadius:"50%",background:"#E0312B",color:"#fff",font:"700 13px/22px system-ui,sans-serif",textAlign:"center",border:"2px solid #fff",boxShadow:"0 1px 3px rgba(0,0,0,.35)",zIndex:99999,boxSizing:"content-box"});document.body.appendChild(d)})},list);
const rect=(p,sel)=>p.evaluate(s=>{const e=document.querySelector(s);const r=e.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height}},sel);
async function shot(p,name,clip){await p.waitForTimeout(400);await p.screenshot({path:OUT+name,type:"jpeg",quality:82,clip,fullPage:true});}
async function run(b,theme){
  const sfx=theme==="dark"?"-d.jpg":".jpg";
  const mk=async(opts)=>{const c=await b.newContext(Object.assign({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true,colorScheme:theme},opts||{}));
    await c.addInitScript(t=>{localStorage.setItem("kolearn-en-v1",JSON.stringify({lang:"en",theme:t}))},theme);return c};
  let c=await mk(),p=await c.newPage();await c.addInitScript(()=>{document.addEventListener("DOMContentLoaded",()=>{const st=document.createElement("style");st.textContent="#kbinfo,kbd.kc{display:none!important}";document.head.appendChild(st)})});
  await p.goto("http://localhost:8765/#K2-A-01");await p.waitForTimeout(2500);
  // menu
  let g=await rect(p,"#groups"),bs=await rect(p,"#bselBtn");
  await badge(p,[["#groups",1,-6,-10],["#subs",2,-6,-8],["#bselBtn",3,-6,-9]]);
  await shot(p,"menu"+sfx,{x:0,y:g.y-22,width:390,height:190.5});
  // lessons list
  await badge(p,[]);await p.click("#bselBtn");await p.waitForTimeout(500);
  await badge(p,[["#bselBtn",3,-6,-9]]);
  await shot(p,"lessons"+sfx,{x:0,y:bs.y-12,width:390,height:262});
  await p.click("#bselBtn");await badge(p,[]);
  // sentences
  let ct=await rect(p,"#controls");
  await badge(p,[["#m-learn",1,-8,-10],["#m-cards",2,-8,-10],["#m-quiz",3,-8,-10]]);
  await shot(p,"sentences"+sfx,{x:0,y:ct.y-14,width:390,height:470});
  // controls
  await badge(p,[["#repSel",1,-10,-12],["#rateSel",2,-10,-12],["#loLbl",3,-32,-3],["button.wrep.tbtn",4,-16,4]]);
  await p.evaluate(()=>{const bs=[...document.querySelectorAll("#ctlrep button.tbtn")];const e=bs[1];if(!e)return;const r=e.getBoundingClientRect();const d=document.createElement("div");d.className="hsb";d.textContent="5";Object.assign(d.style,{position:"absolute",left:(r.left+scrollX-16)+"px",top:(r.top+scrollY+4)+"px",width:"22px",height:"22px",borderRadius:"50%",background:"#E0312B",color:"#fff",font:"700 13px/22px system-ui,sans-serif",textAlign:"center",border:"2px solid #fff",zIndex:99999,boxSizing:"content-box"});document.body.appendChild(d)});
  ct=await rect(p,"#controls");
  await shot(p,"controls"+sfx,{x:0,y:ct.y-12,width:390,height:96});
  await badge(p,[]);
  // cards
  await p.click("#m-cards");await p.waitForTimeout(800);ct=await rect(p,"#controls");
  await shot(p,"cards"+sfx,{x:0,y:ct.y-2,width:390,height:420});
  // quiz
  await p.click("#m-quiz");await p.waitForTimeout(800);ct=await rect(p,"#controls");
  await shot(p,"quiz"+sfx,{x:0,y:ct.y-2,width:390,height:560});
  // player bar
  await p.click("#m-learn");await p.waitForTimeout(800);
  await p.evaluate(()=>{const bs=[...document.querySelectorAll("#ctlrep button.tbtn")];bs[1]&&bs[1].click()});
  await p.waitForTimeout(3500);
  await p.evaluate(()=>{const b=document.getElementById("ppause");b&&b.click()});await p.waitForTimeout(800);
  await p.screenshot({path:"/tmp/claude-0/s/hs/player_full"+theme+".png"});
  await p.evaluate(()=>{const b=document.getElementById("pstop");b&&b.click()});
  // save footer
  await p.evaluate(()=>scrollTo(0,document.body.scrollHeight));await p.waitForTimeout(600);
  const fr=await p.evaluate(()=>{const e=[...document.querySelectorAll("button,a,p,div")].filter(e=>/Save audio in the app/.test(e.textContent)&&e.children.length<6).pop();const r=e.getBoundingClientRect();return {y:r.top+scrollY}});
  const H=await p.evaluate(()=>document.documentElement.scrollHeight);console.log("save",fr.y,H);await shot(p,"save"+sfx,{x:0,y:Math.min(fr.y-20,H-166),width:390,height:166});
  await c.close();
  // listening
  c=await mk();await c.addInitScript(()=>{document.addEventListener("DOMContentLoaded",()=>{const st=document.createElement("style");st.textContent="#kbinfo,kbd.kc{display:none!important}";document.head.appendChild(st)})});p=await c.newPage();await p.goto("http://localhost:8765/#LS-A-01");await p.waitForTimeout(2500);
  ct=await rect(p,"#controls");await shot(p,"listening"+sfx,{x:0,y:ct.y-2,width:390,height:560});await c.close();
  // keyboard (desktop)
  c=await mk({viewport:{width:1000,height:900},deviceScaleFactor:1,isMobile:false,hasTouch:false});p=await c.newPage();
  await p.goto("http://localhost:8765/#K2-A-01");await p.waitForTimeout(2500);
  ct=await rect(p,"#controls");await shot(p,"keyboard"+sfx,{x:ct.x,y:ct.y,width:ct.w,height:ct.w*0.125});
  console.log("keyboard rect",JSON.stringify(ct));await c.close();
}
(async()=>{const b=await chromium.launch();for(const t of ["light","dark"])await run(b,t);await b.close();console.log("done")})();
