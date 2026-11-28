/* app-config (JeyCampus): the values that differ between apps. The shared parts in src/core/ read only this.
   The shared parts come from kor-app (PhasaKAO): run  node tools/core-copy.js  there, never edit src/core here. */
window.APPCFG = {
  app: "JeyCampus",
  store: "jc-",                 /* this app's storage prefix (jc-intro …); core parts that save new things use it */
  ptr: { bg: "rgba(40,44,52,.88)", go: "rgba(26,115,232,.95)" },   /* core ptr: pull-to-refresh button colour, and once far enough */
  vol: { sub: "음량" }          /* core vol: small Korean label under the volume slider's title */
};
