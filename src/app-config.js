/* app-config (JeyCampus): the values that differ between apps. The shared parts in src/core/ read only this.
   The shared parts come from kor-app (PhasaKAO): run  node tools/core-copy.js  there, never edit src/core here. */
window.APPCFG = {
  app: "JeyCampus",
  store: "jc-",                 /* this app's storage prefix (jc-intro …); core parts that save new things use it */
  statsPublic: true,            /* build.js: show 도움말 > 사용 통계 (RYU 2026-11-25) */
  snap: { key: "jc-snap" },     /* core snap: the last screen; build.js reads the same key in index.html */
  stats: {                      /* core stats: usage statistics, the stats page and the survey */
    url: "https://script.google.com/macros/s/AKfycbzvzWxwoiKKui7T0CPud3mNIoTLaBNLEmjZTJlgqQTCtfrT4SHWZOhJOW0H3c8B_skQeQ/exec",   // RYU 2026-11-25
    key: "kolearn-en",          /* storage: kolearn-en-stats, -id, -statspage, -survey, -svq (unchanged) */
    /* v1.31.20 (RYU): the explanation language picked in the app goes in the code column of "open" */
    openCode: function(){ try { return String(JSON.parse(localStorage.getItem("kolearn-en-v1") || "{}").lang || ""); } catch (e) { return ""; } },
    AC: {K1: "var(--k1)", K2: "var(--k2)", K4: "var(--k4)", K5: "var(--k5)", K6: "var(--k6)", K7: "var(--k7)", K8: "var(--k8)", K9: "var(--k9)", LS: "var(--k7)", TP: "var(--k3)", KR: "var(--k5)", JB: "var(--k4)", HP: "var(--muted)"},
    langs: {en: "English 영어", zh: "中文 중국어", vi: "Tiếng Việt 베트남어", my: "မြန်မာ 미얀마어", uz: "Oʻzbekcha 우즈베크어", bn: "বাংলা 벵골어", ne: "नेपाली 네팔어", lo: "ລາວ 라오스어"},
    img: { done: "img/jey/jey.webp", head: "img/jey/jey_side.webp" },
    t: { scale: "right scale, max", learners: "learners", tDevices: "Learners", tDevicesSub: "devices", tBack: "Came back", tBackSub: "2+ days",
      tLessons: "Lessons opened", tPer: "Lessons per learner", tQuiz: "Quizzes finished", tQuizAvg: "Quiz average", tTopik: "TOPIK sets", tPlays: "Audio plays",
      tSpeak: "Sentences spoken", avg: "average", daily: "Every day", monthly: "Every month", cLearners: "learners", cLessons: "lessons opened", top: "Most opened lessons",
      areas: "By area", devices: "Devices", os: "Systems", langs: "Explanation language", survey: "Satisfaction", sAnswers: "Answers", sAvg: "Average", sRec: "Would recommend",
      quizHist: "Quiz scores", hours: "Time of day (Korea)", updated: "Updated", since: "counting since", totals: "Totals only: no names and no single person's results.",
      loading: "Loading statistics…", loadFail: "The statistics could not be loaded. Please try again with the internet on.",
      thanks: "Thank you for your answer!", stars: "Stars", nStars: "stars", yes: "Yes", maybe: "Maybe", no: "No", wish: "Anything to make the app better? (optional)",
      qMenu: "Which menu helped you most?", qRec: "Would you recommend JeyCampus to a friend?", send: "Send", later: "Later", how: "How do you like JeyCampus?", howKo: "제이캠퍼스 어때요?" }
  },
  keys: { title: "Keyboard shortcuts",          /* core keys: the ? help card */
    rows: [["Space", "Pause · Resume (idle: play lesson)", "일시정지 · 재개"], ["C", "Play all lessons", "연속 재생"], ["G", "Play lesson", "묶음 재생"],
          ["Esc", "Stop", "정지"], ["← →", "Previous · next line", "이전 · 다음 문장"], ["< >  (, .)", "Previous · next lesson", "이전 · 다음 묶음"],
          ["Enter", "Loop this line · off", "지금 문장 무한 반복"], ["K", "English voice on · off", "영어 음성 켜기 · 끄기"], ["1 ~ 5", "Times", "반복 횟수"], ["-  =", "Slower · faster", "배속"],
          ["S W E", "Sentences · Words · Quiz", "예문 · 단어 · 퀴즈"], ["?", "Show · hide this list", "단축키 목록"]] },
  menu: { follow: true },       /* core menu: the row scrolls to show the pressed button */
  prefs: { theme: "Theme 화면", themes: ["Auto", "☀ Light", "☾ Dark"], fz: "Text size 글자 크기" },   /* core prefs: labels (other languages come from ui.tsv) */
  ptr: { bg: "rgba(40,44,52,.88)", go: "rgba(26,115,232,.95)" },   /* core ptr: pull-to-refresh button colour, and once far enough */
  stick: { title: function(){ var B = document.getElementById("bselBtn"), q = function(c){ return (B.querySelector(c) || {}).textContent || ""; };
            return B.querySelector(".ddk") ? (q(".ddn") + " " + q(".ddk") + (q(".ddo") ? " (" + q(".ddo") + ")" : "")).trim() : B.textContent.trim(); },
           watch: ["bselBtn"] },   /* core stick: the bar's lesson line = the lesson picker's text */
  vol: { sub: "음량" }          /* core vol: small Korean label under the volume slider's title */
};
