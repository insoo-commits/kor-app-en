// 전주(전북) area (JB, RYU 2026-11-25): info pages that make students want to study in Jeonju, at Jeonju University.
// Writes data/JB.json and the JB lines of src/titles-en.txt. Run: node tools/jeonbuk.js && node build.js
// Same page layout as 대한민국 (KR): no audio, no quiz. English explanations, Korean in .ko with a romanized reading in .r.
// Photos: img/jb/*.jpg with img/jb/credits.json ([width, height, author, licence, file page]); a page without a photo shows its facts only.
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");

const K = (ko, r) => `<span class="ko">${ko}</span>${r ? ` <span class="r">${r}</span>` : ""}`;
const hd = (en, ko) => `<h3>${en}${ko ? ` <small class="ko">${ko}</small>` : ""}</h3>`;
const box = (cls, head, inner) => `<section class="ib${cls ? " " + cls : ""}">${head}<div class="ibb">${inner}</div></section>`;
const PH = {};
try { Object.assign(PH, JSON.parse(fs.readFileSync(path.join(root, "img/jb/credits.json"), "utf8"))); } catch (e) {}
const KRPH = {}; try { Object.assign(KRPH, JSON.parse(fs.readFileSync(path.join(root, "img/kr/credits.json"), "utf8"))); } catch (e) {}
const photo = (file, cap) => { const dir = PH[file] ? "jb" : KRPH[file] ? "kr" : "", p = PH[file] || KRPH[file]; if (!p) return "";   // a photo of the 대한민국 pages can be reused
  return `<figure class="ph"><img src="img/${dir}/${file}" width="${p[0]}" height="${p[1]}" loading="lazy" alt=""><figcaption>${cap}<small>Photo: ${p[2]}${p[3] ? ` · ${p[3]} · Wikimedia Commons` : ""}</small></figcaption></figure>`; };
const facts = rows => `<table class="facts">${rows.map(([th, td]) => `<tr><th>${th}</th><td>${td}</td></tr>`).join("")}</table>`;

const P = [], TITLES = [];
/* one page: {code, t (Korean title), en, sub (Korean subtitle line), pic: [file, caption], facts, secs: [[head, ...paragraphs]], jj (Jeonju University box),
   tip, say: [[ko, en]], know: [[head, ko head, text]], when: [[situation, ko, en]], terms: [[ko, reading, meaning]]} */
function page(x){
  const fig = x.pic ? photo(x.pic[0], x.pic[1]) : "";
  let s = `<h2>${x.en}</h2><div class="sub2 ko">${x.t}</div>`;
  if (x.lead) s += `<p class="jblead">${x.lead}</p>`;
  s += box("ib-f", hd("Quick facts", "기본 정보"), fig ? `<div class="top2"><div>${fig}</div><div>${facts(x.facts)}</div></div>` : facts(x.facts));
  s += `<div class="ibs">` + x.secs.map(([h, ...ps]) => box("", hd(...[].concat(h)), ps.map(p => p.startsWith("<figure") ? p : `<p>${p}</p>`).join(""))).join("")
     + (x.jj ? box("ib-j", hd("★ For JJ University students", "전주대 유학생에게"), `<p>${x.jj}</p>`) : "")
     + (x.tip ? box("ib-k", hd("Good to know", "알아 두면 좋아요"), `<p>${x.tip}</p>`) : "") + `</div>`;
  if (x.say) s += box("ib-s", hd("Useful sentences", "이렇게 말해요"), `<div class="says">${x.say.map(([ko, en]) => `<div><div class="ko">${ko}</div><div class="m">${en}</div></div>`).join("")}</div>`);
  if (x.know) s += `<div class="ibml">Learn more<span class="ko">더 알아보기</span></div><div class="ibs ibm">${x.know.map(([en, ko, t]) => box("ib-m", hd(en, ko), `<p>${t}</p>`)).join("")}</div>`;
  if (x.when) s += box("ib-w", hd("Say it like this", "이럴 때 이렇게 말해요"), `<table class="when">${x.when.map(([sit, ko, en]) => `<tr><th>${sit}</th><td><div class="ko">${ko}</div><div class="m">${en}</div></td></tr>`).join("")}</table>`);
  if (x.terms) s += box("ib-t", hd("Words", "낱말"), `<div class="terms">${x.terms.map(([ko, r, m]) => `<div><span class="ko">${ko}</span> <span class="r">${r}</span><span class="m">${m}</span></div>`).join("")}</div>`);
  P.push({code: x.code, t: x.t, lv: 0, type: "정보", info: s});
  TITLES.push(x.code + " | " + x.en);
}

/* ================= A 전주·전북 알아보기 ================= */
page({code: "JB-A-01", t: "전주에서 공부하면 좋은 점", en: "Why Study in Jeonju?", pic: ["jju_aerial.jpg", `${K("전주대학교", "jeonjudaehakgyo")}: the JJ University campus`],
  lead: `Seoul is exciting, but many students say the best years of their life were in Jeonju. ${K("전주에서 공부해요!")} Here is why.`,
  facts: [["Where", `the center of ${K("전북특별자치도", "jeonbuk teukbyeoljachido")}, in the southwest of Korea`],
    ["Your school", `${K("전주대학교", "jeonjudaehakgyo")}, JJ University, “the place for superstars”`],
    ["Known for", "food, the Hanok Village, hanji paper, pansori, the film festival"],
    ["Size", "about 640,000 people: a real city, but never too crowded"],
    ["To Seoul", "about 1 hour 40 minutes by KTX"]],
  secs: [["Real Korea, every day", `In Jeonju, old Korea is not in a museum. You walk past tiled roofs, eat in 60-year-old soup restaurants and hear ${K("판소리", "pansori")} at a festival.`, "You learn Korean culture just by living here."],
    ["Learn Korean faster", "In Seoul it is easy to live in English. In Jeonju people speak Korean with you every day: at the market, on the bus, at the café.", `Shop owners are patient and kind. When you try Korean, they smile and say ${K("한국말 잘하네!", "hangungmal jalhane")}`],
    ["Easy on your wallet", "Rent, food and transport cost less than in Seoul. A full Korean meal with many side dishes costs about the same as a fast-food set in Seoul.", "You can save money and still eat the best food in Korea."],
    ["Safe and comfortable", "Jeonju is calm and safe, day and night. Buses go everywhere in the city, and the mountains and the sea are close for weekend trips."]],
  jj: `At JJ University you are not one student in a crowd. Professors know your name, the English track gives you classes in English, and the International Office helps you from your first day. The Hanok Village is about 20 minutes away by taxi.`,
  say: [["저는 전주대학교 유학생이에요.", "I am an international student at Jeonju University."], ["전주가 정말 좋아요.", "I really like Jeonju."]],
  know: [["Study and travel", "공부하면서 여행하기", `From Jeonju you can reach Seoul, Busan, the West Sea and big mountains in 1 to 3 hours. Many students travel every month.`],
    ["Make Korean friends", "한국 친구 사귀기", `Join a club ${K("동아리", "dongari")}, a language exchange or a buddy program at school. Jeonju people are known as warm and friendly.`]],
  when: [["Telling someone where you study", "전주에서 공부하고 있어요.", "I'm studying in Jeonju."], ["When someone asks if you like it", "네, 음식도 맛있고 사람들도 친절해요.", "Yes, the food is good and the people are kind."]],
  terms: [["유학생", "yuhaksaeng", "international student"], ["유학", "yuhak", "studying abroad"], ["생활", "saenghwal", "life, daily living"], ["친절하다", "chinjeolhada", "kind"], ["안전하다", "anjeonhada", "safe"], ["물가", "mulga", "prices, cost of living"]]});

page({code: "JB-A-02", t: "전북특별자치도", en: "Jeonbuk State", pic: ["plain.jpg", `${K("호남평야", "honampyeongya")}: the wide rice fields of Jeonbuk`],
  facts: [["Full name", `${K("전북특별자치도", "jeonbuk teukbyeoljachido")}<br>Jeonbuk State (since January 2024)`],
    ["Short name", `${K("전북", "jeonbuk")}: “north ${K("전라도", "jeollado")}”`],
    ["Main city", `${K("전주", "jeonju")}: the province office is here`],
    ["Cities and counties", "14: 6 cities and 8 counties"],
    ["People", "about 1.7 million"]],
  secs: [["A special province", `In 2024 ${K("전라북도", "jeollabukdo")} became ${K("전북특별자치도", "jeonbuk teukbyeoljachido")}, a “special self-governing province”. It can make more of its own plans for farming, culture and new industry.`],
    ["6 cities", `${K("전주", "jeonju")}, ${K("군산", "gunsan")} (port), ${K("익산", "iksan")} (KTX station, Baekje history), ${K("정읍", "jeongeup")}, ${K("남원", "namwon")}, ${K("김제", "gimje")} (rice fields).`],
    ["8 counties", `${K("완주", "wanju")}, ${K("진안", "jinan")}, ${K("무주", "muju")}, ${K("장수", "jangsu")}, ${K("임실", "imsil")} (cheese), ${K("순창", "sunchang")} (gochujang), ${K("고창", "gochang")}, ${K("부안", "buan")}.`, "Each one has its own famous food and festival."],
    ["The land of taste", `The ${K("전라도", "jeollado")} area is famous all over Korea for food. Koreans say: “In Jeolla, even a small restaurant is good.”`]],
  jj: `Jeonju is the heart of Jeonbuk, so from JJ University every place in the province is an easy day trip.`,
  say: [["전북은 음식이 맛있기로 유명해요.", "Jeonbuk is famous for its delicious food."], ["임실은 치즈가 유명해요.", "Imsil is famous for cheese."]],
  know: [["Local products", "지역 특산물", `${K("임실 치즈", "imsil chijeu")}, ${K("순창 고추장", "sunchang gochujang")}, ${K("고창 복분자", "gochang bokbunja")} (black raspberry), ${K("무주 반딧불 사과", "muju bandeutbul sagwa")}.`],
    ["Do not mix up", "헷갈리지 마세요", `${K("전북", "jeonbuk")} (north) and ${K("전남", "jeonnam")} (south) are two different provinces. ${K("전라도", "jeollado")} means both.`]],
  when: [["Saying where you live", "저는 전북 전주에 살아요.", "I live in Jeonju, Jeonbuk."]],
  terms: [["도", "do", "province"], ["시", "si", "city"], ["군", "gun", "county"], ["지역", "jiyeok", "region, area"], ["특산물", "teuksanmul", "local specialty"], ["농업", "nongeop", "farming"]]});

page({code: "JB-A-03", t: "전주라는 도시", en: "The City of Jeonju", pic: ["pungnammun.jpg", `${K("풍남문", "pungnammun")}: the old south gate`],
  facts: [["Name", `${K("全州", "")} “the complete, whole town”: ${K("온전한 고을", "onjeonhan goeul")}`],
    ["People", "about 640,000"],
    ["Districts", `${K("완산구", "wansangu")} and ${K("덕진구", "deokjingu")}`],
    ["History", "more than 1,000 years as a main city"],
    ["Nickname", `${K("맛의 도시", "maseui dosi")} “city of taste”, ${K("한옥의 도시", "hanogui dosi")}`]],
  secs: [["An old capital", `Around the year 900, Jeonju was the capital of ${K("후백제", "hubaekje")} (Later Baekje).`, `Later the family of ${K("조선", "joseon")}'s kings came from Jeonju, so the city was called the hometown of the royal family.`],
    ["Old and new together", "Downtown you find the old gate, the Hanok Village and markets. A few minutes away there are new apartments, cafés, cinemas and a big department store."],
    ["A city of culture", "Jeonju has the film festival, a sound festival, hanji paper, and many small galleries. UNESCO named it a City of Gastronomy."]],
  jj: `JJ University is part of this city: city buses run between campus and downtown, and students go out to eat, shop and see movies all the time.`,
  say: [["전주는 천 년이 넘은 도시예요.", "Jeonju is a city more than 1,000 years old."], ["전주 사람들은 친절해요.", "People in Jeonju are kind."]],
  know: [["What does 고을 mean?", "고을", `${K("고을", "goeul")} is an old word for a town. You will see it in names like ${K("전주 고을", "jeonju goeul")} and in festival posters.`],
    ["Jeonju's symbols", "전주의 상징", `The ginkgo tree ${K("은행나무", "eunhaengnamu")} and the hanok roof are symbols of the city.`]],
  when: [["Recommending Jeonju", "전주에 꼭 한번 와 보세요.", "You should come to Jeonju once."]],
  terms: [["도시", "dosi", "city"], ["시내", "sinae", "downtown"], ["역사", "yeoksa", "history"], ["수도", "sudo", "capital city"], ["오래되다", "oraedoeda", "old (long time)"], ["고향", "gohyang", "hometown"]]});

page({code: "JB-A-04", t: "전북의 자연과 사계절", en: "Nature and Seasons of Jeonbuk", pic: ["maisan.jpg", `${K("마이산", "maisan")}: “horse-ear mountain” in Jinan`],
  facts: [["Plains", `${K("호남평야", "honampyeongya")}: the biggest plain in Korea, full of rice fields`],
    ["Mountains", `${K("덕유산", "deogyusan")}, ${K("내장산", "naejangsan")}, ${K("마이산", "maisan")}, part of ${K("지리산", "jirisan")}`],
    ["Sea", `the West Sea ${K("서해", "seohae")}: islands, sunsets and wide mud flats`],
    ["World heritage", `${K("고창 갯벌", "gochang gaetbeol")}: the Gochang tidal flats (UNESCO)`],
    ["Big project", `${K("새만금 방조제", "saemangeum bangjoje")}: a 33.9 km sea wall, one of the longest in the world`]],
  secs: [["Spring 봄", `Cherry blossoms ${K("벚꽃", "beotkkot")} cover the streets in early April. ${K("마이산", "maisan")} and many riversides turn pink.`],
    ["Summer 여름", `Hot and wet, with the rainy season ${K("장마", "jangma")} in July. The lotus pond in ${K("덕진공원", "deokjingongwon")} blooms, and the beaches open.`],
    ["Autumn 가을", `The best season. ${K("내장산", "naejangsan")} is one of the most famous places for red leaves ${K("단풍", "danpung")} in Korea. The rice fields turn gold.`],
    ["Winter 겨울", `Cold but bright. The west side gets snow, and you can ski at ${K("무주", "muju")} on ${K("덕유산", "deogyusan")}.`]],
  jj: `Every season gives you a new weekend trip. Many students go to see the autumn leaves at Naejangsan with friends from class.`,
  say: [["단풍 보러 내장산에 가요.", "I'm going to Naejangsan to see the autumn leaves."], ["전주는 봄에 벚꽃이 예뻐요.", "Jeonju has beautiful cherry blossoms in spring."]],
  know: [["Mud flat fun", "갯벌 체험", `At the seaside you can try ${K("갯벌 체험", "gaetbeol cheheom")}: digging for clams in the mud. Bring clothes that can get dirty!`],
    ["Weather app", "날씨 앱", `Check fine dust ${K("미세먼지", "misemeonji")} in spring. On bad days, wear a mask.`]],
  when: [["Planning a trip", "이번 주말에 단풍 구경 갈래요?", "Shall we go see autumn leaves this weekend?"]],
  terms: [["자연", "jayeon", "nature"], ["산", "san", "mountain"], ["바다", "bada", "sea"], ["평야", "pyeongya", "plain"], ["단풍", "danpung", "autumn leaves"], ["갯벌", "gaetbeol", "tidal mud flat"]]});

/* ================= B 전주대 캠퍼스 (RYU 2026-11-25) ================= */
page({code: "JB-B-01", t: "스타센터", en: "The Star Center", pic: ["jju_starcenter.jpg", `${K("스타센터", "seuta senteo")} at night`],
  lead: `The heart of JJ University's campus, and the place where many English-track classes meet.`,
  facts: [["Opened", "2011"],
    ["Size", "4 floors above ground and 2 below, about 34,600 m² inside"],
    ["Designed by", "Hong Kong architect Aaron Tan, with a Korean design team"],
    ["Inside", "library, lecture rooms, student service center, career center, food court, sports facilities"],
    [K("온누리홀", "onnuri hol"), "a big hall for ceremonies, concerts and events"]],
  secs: [["A building for everything", photo("jju_spring.jpg", "Cherry blossoms by the Star Center"), "You can take a class, study in the library, get help with student papers, eat lunch in the food court and work out, all without leaving the Star Center."],
    ["Library 도서관", photo("jju_library.jpg", `The general reading room ${K("일반자료실", "ilban jaryosil")}`), "The library sits in the middle of campus, so it is easy to come between classes. Find a quiet seat, borrow books or meet your study group."],
    ["Lydia Center 루디아선교센터", photo("jju_lydia.jpg", `${K("루디아선교센터", "rudia seongyosenteo")} in the Star Center library`), `Inside the library is the ${K("루디아선교센터", "rudia seongyosenteo")}, a bright room with big windows, sofas, long tables and walls of books. It is a place for sharing, fellowship and faith activities, and also a lounge where library users can rest.`, "Many students come here to read, meet friends or take a break between study sessions."],
    ["Events 행사", `Ceremonies, special lectures and concerts happen in ${K("온누리홀", "onnuri hol")}. Watch for posters: international student events are held here too.`]],
  jj: `On your first day, find your classroom in the Star Center and walk around once. It will be your second home on campus.`,
  say: [["스타센터에서 수업이 있어요.", "I have a class in the Star Center."], ["푸드코트에서 점심 먹을까요?", "Shall we have lunch at the food court?"]],
  know: [["Finding rooms", "강의실 찾기", `Room numbers show the floor first: ${K("301호", "sambaegilho")} is on the 3rd floor.`],
    ["Star everywhere", "스타", "JJ University calls itself “the place for superstars”. The Star Center, Star Tower and Star Home all carry the star."]],
  when: [["Asking the way", "스타센터가 어디예요?", "Where is the Star Center?"], ["Meeting a friend", "스타센터 앞에서 만나요.", "Let's meet in front of the Star Center."]],
  terms: [["건물", "geonmul", "building"], ["강의실", "gangeuisil", "lecture room"], ["도서관", "doseogwan", "library"], ["푸드코트", "pudeukoteu", "food court"], ["층", "cheung", "floor"], ["행사", "haengsa", "event"]]});

page({code: "JB-B-02", t: "스타정원과 철쭉꽃밭", en: "Star Garden and the Azaleas", pic: ["jju_stargarden.jpg", `${K("스타정원", "seuta jeongwon")} from the sky`],
  lead: `Jeonju people come to JJ University just to see the flowers. You can see them every day.`,
  facts: [[K("스타정원", "seuta jeongwon"), "an eco-friendly garden on campus, made for the university's 55th anniversary"],
    ["Flowers", `moss phlox ${K("꽃잔디", "kkotjandi")}, azaleas ${K("진달래", "jindallae")} and ${K("철쭉", "cheoljjuk")}, daisies, rapeseed flowers`],
    ["Best time", "April and May"],
    ["Night", "lights at night, so you can walk there after class"],
    ["Open to", "students and local people: walking paths, benches and tables"]],
  secs: [["A garden for everyone", photo("jju_jey_rapeseed.jpg", `A ${K("제이제이", "jeijei")} doll in the yellow rapeseed flowers`), "Star Garden turned empty land into a garden full of flowers and walking paths. On spring weekends, hundreds of local families and students come to walk and take photos."],
    ["Azaleas 철쭉꽃밭", photo("jju_azalea.jpg", `The azalea field below ${K("대학본관", "daehak bongwan")}`), `In late April, the whole slope below the main building ${K("대학본관", "daehak bongwan")} turns bright red with ${K("철쭉", "cheoljjuk")}, right next to the sports field. It is the most famous photo spot at JJ University.`],
    ["Cherry blossom roads 벚꽃길", photo("jju_blossom_jey.jpg", `${K("제이트", "jeiteu")}, ${K("제이제이", "jeijei")} and ${K("별이", "byeori")} under the cherry blossoms, for JJ University's 60th anniversary`), `Before the azaleas, cherry blossoms ${K("벚꽃", "beotkkot")} line the roads around ${K("진리관", "jinrigwan")}, ${K("자유관", "jayugwan")} and ${K("평화관", "pyeonghwagwan")}.`]],
  jj: `Between classes, take your lunch or coffee to Star Garden. Many international students say this is when they first fell in love with Korean spring.`,
  tip: "Flowers come and go fast: cherry blossoms last about a week, so don't wait for the weekend!",
  say: [["철쭉이 활짝 피었어요.", "The azaleas are in full bloom."], ["스타정원에서 사진 찍자!", "Let's take pictures at Star Garden!"]],
  know: [["Flower names", "꽃 이름", `${K("개나리", "gaenari")} (yellow, March) → ${K("벚꽃", "beotkkot")} (white-pink, early April) → ${K("철쭉", "cheoljjuk")} (pink-red, late April–May).`],
    ["Photo manners", "사진 예절", "Don't step into the flower beds for photos, and keep the garden clean."]],
  when: [["Inviting a friend", "수업 끝나고 꽃 보러 갈래요?", "Want to go see the flowers after class?"]],
  terms: [["정원", "jeongwon", "garden"], ["꽃", "kkot", "flower"], ["철쭉", "cheoljjuk", "royal azalea"], ["벚꽃", "beotkkot", "cherry blossom"], ["피다", "pida", "to bloom"], ["산책로", "sanchaengno", "walking path"]]});

page({code: "JB-B-03", t: "드라마 속 캠퍼스", en: "The Campus in Dramas", pic: ["jju_main.jpg", `${K("대학본관", "daehak bongwan")} in spring`],
  lead: `Have you seen JJ University on Netflix without knowing it? Korean dramas love this campus.`,
  facts: [["그해 우리는 (Our Beloved Summer)", "campus scenes and the tree-lined road from the back gate"],
    ["소년심판 (Juvenile Justice)", "the university's main office building was used as the court"],
    ["우리 사랑했을까 (Was It Love?)", "cherry blossom roads by 진리관, 자유관 and 평화관"],
    ["선산 (The Bequeathed)", "scenes at the art building and student union building"]],
  secs: [["Why film here?", "The campus has everything: modern buildings like the Star Center, classic buildings on a hill, long tree-lined roads and seasons full of flowers."],
    ["The main building 대학본관", "It stands on the highest point of campus, with white columns that look grand in photos. It was the old central library; today the president's office and the main university offices are here.", "In spring it is surrounded by azaleas, and many students take graduation photos in front of it.", photo("jju_christmas.jpg", `Christmas lights on ${K("대학본관", "daehak bongwan")}`), "In winter the building is covered in Christmas lights, and local families come at night to take pictures."],
    ["Back-gate road 후문 가로수길", "The road of tall trees near the back gate became famous from a romantic drama. It is beautiful in every season, especially in autumn."]],
  jj: `Watch one of these dramas with your Korean friends, then find the same spots on campus. It is great listening practice, and a fun walk!`,
  say: [["이 드라마를 우리 학교에서 찍었대요.", "They say this drama was filmed at our school."], ["여기가 드라마에 나온 곳이에요.", "This is the place from the drama."]],
  know: [["Drama Korean", "드라마로 공부하기", "Watch with Korean subtitles. Pause, repeat a line out loud and write down 3 new words each episode."],
    ["Filming on campus", "촬영", `If you see ${K("촬영 중", "chwaryeong jung")} (filming in progress), stay quiet and don't take photos of the actors without permission.`]],
  when: [["Recommending a drama", "이 드라마 꼭 보세요!", "You have to watch this drama!"]],
  terms: [["드라마", "deurama", "TV drama"], ["촬영", "chwaryeong", "filming"], ["장면", "jangmyeon", "scene"], ["배우", "baeu", "actor"], ["가로수길", "garosugil", "tree-lined road"], ["본관", "bongwan", "main building"]]});

page({code: "JB-B-04", t: "숲속 초막 셋", en: "Three Huts in the Forest", pic: ["jju_chomak.jpg", `${K("숲속 초막 셋", "supsok chomak set")}`],
  lead: `A tiny chapel that won an architecture prize, hidden on the forest path between Star Garden and the main building.`,
  facts: [["Name", `${K("숲속 초막 셋", "supsok chomak set")} “three huts in the forest”, also called ${K("초막교회", "chomakgyohoe")}`],
    ["What is it?", "a very small chapel (about 20 m²) made of three joined huts"],
    ["Where", `on the path from ${K("스타정원", "seuta jeongwon")} up to ${K("대학본관", "daehak bongwan")}`],
    ["Built", "2020, designed by Professor Kim Jun-young of JJ University's architecture department"],
    ["Prize", "Gold Prize, Jeonbuk Architecture Culture Awards"],
    ["Open to", "students and local people, at any time"]],
  secs: [["Three huts, three doors", photo("jju_chomak2.jpg", "The huts in spring, among rapeseed flowers in Star Garden"), `The idea comes from a Bible story (Matthew 17:4) about three shelters. The three pointed roofs stand for Jesus, Moses and Elijah.`, "Each of the three doors is both an entrance and a path: you can walk right through the chapel on your way across campus."],
    ["Materials 재료", `Outside, the walls are rust-colored steel ${K("코르텐 강판", "koreuten gangpan")}, which grows darker and richer with time. Inside, the concrete walls show the pattern of wood grain.`],
    ["A quiet place", "JJ University is a Christian university, but the chapel is open to everyone. Sit for a few minutes, rest from busy classes and listen to the forest."]],
  jj: `On a spring walk through Star Garden, follow the path up to the three huts. It is one of the calmest places on campus, and a favorite photo spot for architecture lovers.`,
  say: [["작은 교회가 정말 예뻐요.", "The little church is really pretty."], ["여기서 잠깐 쉬어 가요.", "Let's rest here for a moment."]],
  know: [["Architecture tour", "건축 산책", `Star Center (2011) and the three huts (2020) are two very different landmarks on one campus. Compare the big modern building and the tiny chapel!`],
    ["Manners", "예절", "People may be praying inside. Speak quietly and don't block the doors with photos."]],
  when: [["Asking the way", "초막교회가 어디에 있어요?", "Where is the hut chapel?"]],
  terms: [["교회", "gyohoe", "church"], ["예배당", "yebaedang", "chapel"], ["초막", "chomak", "hut, shelter"], ["건축", "geonchuk", "architecture"], ["숲", "sup", "forest"], ["조용하다", "joyonghada", "quiet"]]});

page({code: "JB-B-05", t: "공부하고 쉬는 곳", en: "Places to Study and Rest", pic: ["jju_hatch.jpg", `${K("해치라운지", "haechi raunji")} in ${K("진리관", "jinrigwan")}`],
  lead: `Between classes, where do you go? JJ University has comfortable corners all over campus.`,
  facts: [[K("해치라운지", "haechi raunji"), `a student lounge in ${K("진리관", "jinrigwan")} with sofas, round tables and bookshelves`],
    [K("도서관", "doseogwan"), `the library in the ${K("스타센터", "seuta senteo")}: reading rooms and quiet seats`],
    [K("해동학술정보실", "haedong haksul jeongbosil"), `a study room in the engineering building ${K("공학관", "gonghakgwan")}`],
    [K("루디아선교센터", "rudia seongyosenteo"), "a bright lounge with books, inside the library"],
    [K("스타정원", "seuta jeongwon"), "benches and tables outdoors, in the garden"]],
  secs: [["Hatch Lounge 해치라운지", photo("jju_hatch2.jpg", "Friends together in the Hatch Lounge"), "Soft armchairs, round tables, long desks and a wall of books. Students come here to do homework on a tablet, read, or wait for the next class with friends."],
    ["Haedong study room 해동학술정보실", photo("jju_haedong.jpg", `${K("해동학술정보실", "haedong haksul jeongbosil")} in ${K("공학관", "gonghakgwan")}`), `In the engineering building ${K("공학관", "gonghakgwan")}, this study room has long wooden tables, glass-walled rooms for groups and a warm wooden ceiling. A calm place to focus before exams.`],
    ["Student union building 학생회관", photo("jju_studenthall.jpg", `${K("제이제이", "jeijei")} at a campus event in front of ${K("학생회관", "haksaenghoegwan")}`), `The square in front of the student union building ${K("학생회관", "haksaenghoegwan")} is where clubs set up booths and campus events happen. Sometimes ${K("제이제이", "jeijei")} comes out to meet students!`],
    ["Free period 공강", `A gap between two classes is called ${K("공강", "gonggang")}. Use it to review your Korean, eat a snack or take a short rest in a lounge.`],
    ["Group work 조별 과제", `For team projects ${K("조별 과제", "jobyeol gwaje")}, the big tables in lounges and in the library are perfect for meeting your group.`]],
  jj: `Find your favorite spot in your first week: one quiet place to study and one place to relax with friends.`,
  say: [["공강 시간에 라운지에서 쉬어요.", "I rest in the lounge during my free period."], ["여기 자리 있어요?", "Is this seat taken?"]],
  know: [["Lounge manners", "라운지 예절", "Talk quietly, take your trash with you, and don't keep seats with your bag for a long time."],
    ["Charging", "충전", `Look for power outlets ${K("콘센트", "konsenteu")} near the tables to charge your laptop or phone.`]],
  when: [["Meeting your group", "해치라운지에서 만나요.", "Let's meet at the Hatch Lounge."], ["Asking for a seat", "여기 앉아도 돼요?", "May I sit here?"]],
  terms: [["라운지", "raunji", "lounge"], ["공강", "gonggang", "free period between classes"], ["쉬다", "swida", "to rest"], ["자리", "jari", "seat"], ["조별 과제", "jobyeol gwaje", "group project"], ["콘센트", "konsenteu", "power outlet"]]});

/* ================= C 전주 둘러보기 ================= */
page({code: "JB-C-01", t: "전주 한옥마을", en: "Jeonju Hanok Village", pic: ["jeonju.jpg", `${K("전주 한옥마을", "jeonju hanongmaeul")}`],
  facts: [["What is it?", "a village of more than 700 traditional Korean houses, right in the city center"],
    ["Where", `${K("풍남동", "pungnamdong")} and ${K("교동", "gyodong")}, next to the old south gate`],
    ["Visitors", "about 10 million a year, one of the most visited places in Korea"],
    ["Inside", "cafés, restaurants, craft shops, museums and hanok guesthouses"],
    ["Price", "free to walk around"]],
  secs: [["Walk in hanbok", `Rent a ${K("한복", "hanbok")} for a few hours and walk the stone alleys ${K("골목", "golmok")}. People in hanbok get free entry to some palaces and sites in Korea, including ${K("경기전", "gyeonggijeon")}.`],
    ["Sleep in a hanok", `In a hanok guesthouse ${K("한옥 스테이", "hanok seutei")} you sleep on a thick mattress on a warm floor ${K("온돌", "ondol")}. It is a favorite experience for visiting family and friends.`],
    ["Taste and make", "Try street food, make your own hanji fan or try traditional tea. Many workshops welcome foreigners."],
    ["Best views", `Climb up to ${K("오목대", "omokdae")} at sunset to see a sea of black tile roofs. At night the lanterns come on.`]],
  jj: `About 20 minutes from campus by taxi, and also by city bus. When friends or family visit you in Korea, this is the first place to take them.`,
  tip: "Go early in the morning on weekdays: the village is quiet and the light is beautiful for photos.",
  say: [["한복 빌리는 데 얼마예요?", "How much is it to rent a hanbok?"], ["한옥에서 하룻밤 자 보고 싶어요.", "I want to try sleeping one night in a hanok."]],
  know: [["Hanok guide", "한옥 구조", `Look for ${K("기와", "giwa")} (roof tiles), ${K("마루", "maru")} (wooden floor hall), ${K("마당", "madang")} (yard) and ${K("담", "dam")} (wall).`],
    ["Free museums", "무료 박물관", "Several small museums in the village, like the wine and craft museums, are free or very cheap."]],
  when: [["At a hanbok shop", "두 시간 빌릴게요.", "I'll rent it for two hours."], ["Asking for a photo", "사진 좀 찍어 주시겠어요?", "Could you take a photo for me?"]],
  terms: [["한옥", "hanok", "traditional house"], ["기와", "giwa", "roof tile"], ["골목", "golmok", "alley"], ["온돌", "ondol", "heated floor"], ["빌리다", "billida", "to rent, borrow"], ["구경하다", "gugyeonghada", "to look around"]]});

page({code: "JB-C-02", t: "경기전·전동성당·풍남문", en: "Gyeonggijeon, Jeondong Cathedral, Pungnammun", pic: ["jeondong.jpg", `${K("전동성당", "jeondongseongdang")}`],
  facts: [[K("경기전", "gyeonggijeon"), "built in 1410 to keep the portrait of King Taejo, the first Joseon king"],
    [K("전동성당", "jeondongseongdang"), "a red-brick Catholic cathedral finished in 1914"],
    [K("풍남문", "pungnammun"), "the south gate of the old city wall"],
    ["Distance", "all three are within a 5-minute walk of each other"]],
  secs: [["경기전 Gyeonggijeon", `A quiet royal shrine with a bamboo forest and old trees. Inside is the portrait ${K("어진", "eojin")} of King ${K("태조", "taejo")} 이성계, a National Treasure.`, "There is a small entrance fee; it is free if you wear hanbok."],
    ["전동성당 Jeondong Cathedral", "One of the most beautiful churches in Korea, built on a place where early Korean Catholics died for their faith.", "Many Korean movies and dramas were filmed here. Please be quiet inside: it is a church people use every day."],
    ["풍남문 Pungnammun", "The only gate left from the old Jeonju city wall. At night it is lit up in gold. The traditional market starts right behind it."]],
  jj: `A perfect first trip for a new student: walk the gate, the cathedral and Gyeonggijeon in one afternoon, then eat bibimbap nearby.`,
  say: [["경기전 입장료가 얼마예요?", "How much is the entrance fee for Gyeonggijeon?"], ["전동성당 앞에서 사진 찍었어요.", "I took a picture in front of Jeondong Cathedral."]],
  know: [["King Taejo", "태조 이성계", `${K("이성계", "iseonggye")} founded the ${K("조선", "joseon")} dynasty in 1392. His family came from Jeonju, so this city was very important to the kings.`],
    ["Night walk", "야경", "In the evening, the cathedral, the gate and the village lights make a lovely walk."]],
  when: [["Asking the way", "전동성당이 어디예요?", "Where is Jeondong Cathedral?"], ["Inside a sacred place", "여기서 사진 찍어도 돼요?", "Can I take pictures here?"]],
  terms: [["성당", "seongdang", "Catholic church"], ["문", "mun", "gate, door"], ["왕", "wang", "king"], ["초상화", "chosanghwa", "portrait"], ["입장료", "ipjangnyo", "entrance fee"], ["보물", "bomul", "treasure"]]});

page({code: "JB-C-03", t: "오목대·벽화마을·남부시장", en: "Omokdae, Mural Village, Nambu Market", pic: ["nambu.jpg", `${K("남부시장", "nambusijang")}`],
  facts: [[K("오목대", "omokdae"), "a small hill pavilion with the best view of the Hanok Village"],
    [K("자만벽화마을", "jaman byeokhwamaeul"), "a hillside village with colorful wall paintings"],
    [K("남부시장", "nambusijang"), "Jeonju's biggest traditional market"],
    [K("청년몰", "cheongnyeonmol"), "shops and cafés of young owners on the market's 2nd floor"],
    [K("야시장", "yasijang"), "night market on Friday and Saturday evenings"]],
  secs: [["오목대 Omokdae", `In 1380 the future king ${K("이성계", "iseonggye")} stopped here to celebrate a victory. Today it is a short, easy climb with a great view.`],
    ["자만벽화마을 Jaman Mural Village", "Across a bridge from Omokdae, small houses are painted with cartoons, flowers and fairy tales. Every corner is a photo spot. People live here, so speak softly."],
    ["남부시장 Nambu Market", `Fresh vegetables, fish, rice cakes, side dishes and the famous ${K("콩나물국밥", "kongnamulgukbap")} restaurants.`, `Upstairs, the ${K("청년몰", "cheongnyeonmol")} has tiny shops with crafts, cocktails and cafés. Its slogan: “Do it moderately”.`]],
  jj: `The Friday night market is a classic JJ student evening: go with classmates, try 10 snacks, and practice your Korean with the sellers.`,
  say: [["이거 하나에 얼마예요?", "How much is one of these?"], ["야시장은 몇 시에 열어요?", "What time does the night market open?"]],
  know: [["Market Korean", "시장 한국어", `Sellers may say ${K("이거 서비스예요", "igeo seobiseuyeyo")}: “this one is free”. Say ${K("감사합니다!", "gamsahamnida")} with a big smile.`],
    ["Cash", "현금", "Most stalls take cards, but some small ones like cash or bank transfer. Carry a little cash."]],
  when: [["Asking for a discount", "조금만 깎아 주세요.", "Please give me a little discount."], ["Ordering at a stall", "떡볶이 일 인분 주세요.", "One serving of tteokbokki, please."]],
  terms: [["시장", "sijang", "market"], ["벽화", "byeokhwa", "wall painting, mural"], ["언덕", "eondeok", "hill"], ["전망", "jeonmang", "view"], ["상인", "sangin", "seller, merchant"], ["깎다", "kkakda", "to cut (the price)"]]});

page({code: "JB-C-04", t: "덕진공원과 수목원", en: "Deokjin Park and the Arboretum", pic: ["deokjin.jpg", `Lotus flowers at ${K("덕진공원", "deokjingongwon")}`],
  facts: [[K("덕진공원", "deokjingongwon"), "a big city park with a lotus pond and a long bridge"],
    ["Best time", "July and August, when the lotus flowers bloom"],
    [K("전주수목원", "jeonju sumogwon"), "a large garden of trees and flowers"],
    [K("아중호수", "ajunghosu"), "a lake with a walking path, lit up at night"],
    ["Price", "free"]],
  secs: [["Lotus pond 연못", `In summer, the pond in ${K("덕진공원", "deokjingongwon")} is covered with big green leaves and pink flowers ${K("연꽃", "yeonkkot")}. Walk across the bridge in the middle of the flowers.`],
    ["Arboretum 수목원", "Thousands of kinds of plants, a rose garden, a bamboo forest and quiet paths. Great for a picnic or for studying on a bench."],
    ["Lake walk 호수 산책", `${K("아중호수", "ajunghosu")} has a wooden path over the water. Locals jog here in the evening.`]],
  jj: `When exams make you tired, a walk in green parks is the best break. Jeonju has many of them, and they are free.`,
  say: [["연꽃이 정말 예뻐요.", "The lotus flowers are really pretty."], ["공원에서 산책할래요?", "Do you want to take a walk in the park?"]],
  know: [["Picnic culture", "돗자리 문화", `Koreans bring a picnic mat ${K("돗자리", "dotjari")} and order chicken delivery to the park!`],
    ["Exercise machines", "운동 기구", "Most parks have free outdoor exercise machines. You will see older people using them in the morning."]],
  when: [["Inviting a friend", "주말에 덕진공원 가자!", "Let's go to Deokjin Park on the weekend!"]],
  terms: [["공원", "gongwon", "park"], ["연꽃", "yeonkkot", "lotus flower"], ["호수", "hosu", "lake"], ["산책", "sanchaek", "walk, stroll"], ["나무", "namu", "tree"], ["피다", "pida", "to bloom"]]});

/* ================= D 맛의 도시 전주 ================= */
page({code: "JB-D-01", t: "전주비빔밥", en: "Jeonju Bibimbap", pic: ["bibimbap.jpg", `${K("전주비빔밥", "jeonjubibimbap")}`],
  facts: [["What is it?", "rice mixed with many vegetables, meat, egg and red pepper paste"],
    ["Why Jeonju?", "Jeonju bibimbap is the most famous in Korea"],
    ["Special point", "rice cooked in beef bone broth, mung bean jelly and fresh bean sprouts"],
    ["Ingredients", "often more than 20 kinds"],
    ["City title", "UNESCO City of Gastronomy (2012)"]],
  secs: [["Colors on a plate", `The colors follow the five traditional colors ${K("오방색", "obangsaek")}: white, black, red, yellow and blue-green. It looks like a painting before you mix it.`],
    ["How to eat it", `Put in ${K("고추장", "gochujang")}, then mix ${K("비비다", "bibida")} everything well with a spoon. Not chopsticks: a spoon!`, "Eat it with the soup and side dishes that come with it."],
    ["Many styles", `Try ${K("돌솥비빔밥", "dolsot bibimbap")} (in a hot stone bowl, with crispy rice at the bottom) or a brass bowl ${K("놋그릇", "notgeureut")} version.`]],
  jj: `Many international students say: “I did not know bibimbap until I came to Jeonju.” Now you live in the bibimbap capital of the world.`,
  say: [["비빔밥 하나 주세요.", "One bibimbap, please."], ["고추장은 조금만 넣어 주세요.", "Just a little gochujang, please."]],
  know: [["Vegetarian?", "채식", `Ask for ${K("고기 빼고", "gogi ppaego")} “without meat”. Many places can make it.`],
    ["At home", "집에서", "Bibimbap is also how Koreans use up leftover side dishes: rice + vegetables + gochujang + sesame oil."]],
  when: [["Not too spicy", "안 맵게 해 주세요.", "Not spicy, please."], ["After eating", "정말 맛있게 먹었습니다.", "I really enjoyed the meal."]],
  terms: [["비비다", "bibida", "to mix"], ["밥", "bap", "rice, meal"], ["나물", "namul", "seasoned vegetables"], ["고추장", "gochujang", "red pepper paste"], ["숟가락", "sutgarak", "spoon"], ["재료", "jaeryo", "ingredient"]]});

page({code: "JB-D-02", t: "콩나물국밥과 모주", en: "Bean Sprout Soup and Moju", pic: ["kongnamul.jpg", `${K("콩나물국밥", "kongnamulgukbap")}`],
  facts: [[K("콩나물국밥", "kongnamulgukbap"), "hot soup with bean sprouts and rice, Jeonju's breakfast"],
    ["Price", "cheap: one of the best meals for students"],
    [K("모주", "moju"), "a sweet, warm-tasting drink made by boiling makgeolli with herbs and cinnamon"],
    ["Alcohol", "very low, but still a drink for adults"]],
  secs: [["The Jeonju breakfast", "Jeonju's water and bean sprouts are said to be special. Locals eat this soup early in the morning, especially after a late night.", "It is light, hot and clean-tasting."],
    ["Two styles", `Market style ${K("남부시장식", "nambusijangsik")}: the soup is not boiled too much, and a soft egg comes in a separate bowl.`, "Boiled style: the egg is cooked inside the hot pot. Try both and pick your favorite!"],
    ["Moju 모주", "Many soup restaurants sell a small cup of moju. It tastes like cinnamon and ginger."]],
  jj: `Before an early class or after an all-night study session, a hot bowl of kongnamulgukbap is the Jeonju way to wake up.`,
  tip: "Put the soft egg in a little soup, add seaweed flakes, and drink it first. That is how locals start.",
  say: [["콩나물국밥 하나랑 모주 한 잔 주세요.", "One bean sprout soup and a cup of moju, please."], ["아침으로 콩나물국밥을 먹었어요.", "I had bean sprout soup for breakfast."]],
  know: [["Spice level", "맵기", `Say ${K("안 맵게요", "an maepgeyo")} for not spicy or ${K("맵게요", "maepgeyo")} for spicy.`],
    ["Open early", "일찍 열어요", "Many soup restaurants open very early in the morning, some 24 hours."]],
  when: [["Ordering", "여기 국밥 두 그릇이요.", "Two bowls of gukbap here, please."]],
  terms: [["콩나물", "kongnamul", "bean sprouts"], ["국밥", "gukbap", "soup with rice"], ["아침", "achim", "morning, breakfast"], ["달걀", "dalgyal", "egg"], ["뜨겁다", "tteugeopda", "hot"], ["시원하다", "siwonhada", "refreshing (hot soup)"]]});

page({code: "JB-D-03", t: "한정식·가맥·막걸리 골목", en: "Hanjeongsik, Gamaek and Makgeolli Alleys", pic: ["hanjeongsik.jpg", `${K("한정식", "hanjeongsik")}: a full Korean table`],
  facts: [[K("한정식", "hanjeongsik"), "a full-course Korean meal with many dishes on one table"],
    [K("가맥", "gamaek"), "“shop beer”: beer at a small store, with dried fish and snacks"],
    [K("막걸리 골목", "makgeolli golmok"), "streets of makgeolli bars where each kettle comes with many dishes"],
    ["Who", "adults only for drinks (19+ in Korea)"]],
  secs: [["Hanjeongsik 한정식", "In Jeonju, a hanjeongsik table can have 20 or 30 small dishes. It is the food you choose for a special day, like a birthday or when your family visits."],
    ["Gamaek 가맥", `A Jeonju-only culture: small shops put out tables and sell cold beer with grilled dried fish ${K("황태", "hwangtae")} and a special sauce. Simple and fun.`],
    ["Makgeolli alleys 막걸리 골목", `Order a kettle ${K("주전자", "jujeonja")} of makgeolli and side dishes keep coming. Each new kettle brings new dishes!`]],
  jj: `Celebrate the end of the semester with your class at a hanjeongsik restaurant, or invite your parents there when they visit Jeonju.`,
  tip: "In Korea you must be 19 (by year of birth) to drink alcohol. You don't have to drink: say 저는 음료수 마실게요 (I'll have a soft drink).",
  say: [["반찬이 정말 많아요!", "There are so many side dishes!"], ["저는 술을 못 마셔요.", "I can't drink alcohol."]],
  know: [["Refills", "리필", `Side dishes ${K("반찬", "banchan")} are free to refill in most Korean restaurants. Just ask.`],
    ["Drinking manners", "술자리 예절", "Pour for others with two hands, and turn your head a little when an older person pours for you."]],
  when: [["Asking for more side dishes", "반찬 좀 더 주세요.", "More side dishes, please."], ["Saying no to a drink", "괜찮아요, 저는 물 마실게요.", "It's OK, I'll have water."]],
  terms: [["반찬", "banchan", "side dish"], ["한 상", "han sang", "a full table (of food)"], ["맥주", "maekju", "beer"], ["막걸리", "makgeolli", "rice wine"], ["주전자", "jujeonja", "kettle"], ["건배", "geonbae", "cheers"]]});

page({code: "JB-D-04", t: "길거리 간식과 야시장", en: "Street Snacks and the Night Market", pic: ["nightmarket.jpg", `${K("야시장", "yasijang")}: night market food`],
  facts: [["Where", "the Hanok Village streets and the Nambu Market night market"],
    ["Famous souvenir", `Jeonju ${K("초코파이", "chokopai")}: a big handmade chocolate pie from a famous local bakery`],
    ["Popular snacks", "skewers, grilled cheese, dumplings, crispy fried snacks, sweet rice cakes"],
    [K("물짜장", "muljjajang"), "a soupy, spicy black-bean noodle that Jeonju is known for"]],
  secs: [["Snack walk 먹방 산책", "In the Hanok Village you can walk and eat: skewers, egg bread, ice cream in fish-shaped cones and more."],
    ["Night market 야시장", "On Friday and Saturday evenings, stalls fill Nambu Market with food from Korea and the world. Some stalls are run by people from other countries."],
    ["Take some home", "The Jeonju chocopie is the city's most famous gift. Students bring boxes home for their families during vacation."]],
  jj: `A Jeonju chocopie is the perfect thank-you gift for your Korean buddy or a professor who helped you.`,
  say: [["이거 맛있어 보여요.", "This looks delicious."], ["초코파이 한 상자 주세요.", "One box of chocopie, please."]],
  know: [["Trash", "쓰레기", "There are few trash cans on the street. Keep your trash until you find a bin, or ask the shop."],
    ["Lines", "줄 서기", "Popular snacks have lines. Wait your turn: Koreans line up carefully."]],
  when: [["Asking what's popular", "뭐가 제일 잘 나가요?", "What sells the best?"], ["Taking it to go", "포장해 주세요.", "To go, please."]],
  terms: [["간식", "gansik", "snack"], ["길거리", "gilgeori", "street"], ["야시장", "yasijang", "night market"], ["선물", "seonmul", "gift"], ["줄", "jul", "line, queue"], ["포장", "pojang", "wrapping, take-out"]]});

/* ================= E 전통과 문화 ================= */
page({code: "JB-E-01", t: "한지", en: "Hanji: Korean Paper", pic: ["hanji.jpg", `${K("한지", "hanji")}: traditional Korean paper`],
  facts: [["What is it?", "traditional Korean paper made by hand"],
    ["Made from", `the bark of the paper mulberry tree ${K("닥나무", "dangnamu")}`],
    ["Strong", `an old saying: “paper lasts 1,000 years, silk 500” ${K("지천년 견오백", "jicheonnyeon gyeonobaek")}`],
    ["Jeonju", "one of the most famous places for hanji since the Joseon Dynasty"],
    ["Uses", "books, windows, lamps, fans, boxes, even clothes"]],
  secs: [["Paper that breathes", "Hanji lets air pass but keeps the wind out. In old hanok houses, the doors and windows are covered with it, and the light comes through softly."],
    ["Jeonju hanji", "In the Joseon Dynasty, the best paper for the king's office came from Jeonju. Today, hanji from Jeonju is used to repair old books and art around the world."],
    ["Try it yourself", "In the Hanok Village you can make hanji, or make a fan, a lamp or a card from it. It takes about an hour."]],
  jj: `Make a hanji lamp or fan in a class or workshop: it is a beautiful, light souvenir to bring home in your suitcase.`,
  say: [["한지로 부채를 만들었어요.", "I made a fan from hanji."], ["한지 체험을 하고 싶어요.", "I want to try a hanji activity."]],
  know: [["Hanji museum", "한지 박물관", "Jeonju has a hanji museum where you can see how paper is made, step by step."],
    ["Five colors", "오방색 한지", "Colored hanji in the five traditional colors is used for gift wrapping and crafts."]],
  when: [["Booking a class", "한지 체험 예약할 수 있어요?", "Can I book a hanji class?"]],
  terms: [["종이", "jongi", "paper"], ["전통", "jeontong", "tradition"], ["만들다", "mandeulda", "to make"], ["부채", "buchae", "hand fan"], ["등", "deung", "lamp"], ["체험", "cheheom", "hands-on experience"]]});

page({code: "JB-E-02", t: "판소리와 전주대사습놀이", en: "Pansori and the Daesaseup Contest", pic: ["pansori.jpg", `${K("판소리", "pansori")} performance`],
  facts: [[K("판소리", "pansori"), "one singer and one drummer tell a long story in song"],
    ["UNESCO", "Intangible Cultural Heritage of Humanity (2003)"],
    [K("전주대사습놀이", "jeonju daesaseupnori"), "a famous contest for traditional music, from the Joseon Dynasty"],
    [K("전주세계소리축제", "jeonju segye sori chukje"), "Jeonju International Sori Festival, every autumn"],
    ["Region", `${K("전라도", "jeollado")} is called the home of pansori`]],
  secs: [["One voice, a whole story", `A singer ${K("소리꾼", "sorikkun")} sings, talks and acts with only a fan. A drummer ${K("고수", "gosu")} keeps the beat and shouts to encourage the singer.`],
    ["Shout along!", `The audience joins in with shouts like ${K("얼쑤!", "eolssu")} and ${K("잘한다!", "jalhanda")}. That's called ${K("추임새", "chuimsae")}, and it is welcome.`],
    ["Jeonju's big contest", "Since the Joseon Dynasty, singers have come to Jeonju to compete. Winning here is one of the highest honors in Korean traditional music."]],
  jj: `During the Sori Festival, Jeonju is full of music from Korea and the world. Many shows are free and outdoors: great for a night out with friends.`,
  say: [["판소리를 처음 들어 봤어요.", "I heard pansori for the first time."], ["얼쑤!", "Eolssu! (a shout of encouragement)"]],
  know: [["Famous stories", "판소리 다섯 마당", `The five classic pansori include ${K("춘향가", "chunhyangga")} (a love story from Namwon) and ${K("흥보가", "heungboga")} (two brothers and a swallow).`],
    ["Long!", "길어요", "A full pansori can last many hours. Concerts usually sing just one famous part."]],
  when: [["Cheering at a concert", "잘한다!", "Great job!"]],
  terms: [["소리", "sori", "sound, voice, song"], ["노래", "norae", "song"], ["북", "buk", "drum"], ["공연", "gongyeon", "performance"], ["대회", "daehoe", "contest"], ["관객", "gwangaek", "audience"]]});

page({code: "JB-E-03", t: "조선 왕조의 뿌리", en: "Roots of the Joseon Dynasty", pic: ["gyeonggijeon.jpg", `${K("경기전", "gyeonggijeon")}`],
  facts: [["Joseon Dynasty", "1392 to 1897 (then the Korean Empire to 1910)"],
    ["Royal family", `the ${K("전주 이씨", "jeonju issi")} Lee family from Jeonju`],
    [K("어진", "eojin"), "the royal portrait of King Taejo, kept at Gyeonggijeon"],
    [K("조선왕조실록", "joseon wangjo sillok"), "the Annals of the Joseon Dynasty, a UNESCO Memory of the World"],
    [K("전주사고", "jeonju sago"), "the history archive in Jeonju that saved the Annals"]],
  secs: [["Hometown of kings", "Jeonju was the hometown of the royal family. That is why the city has a royal shrine and a special name in Korean history."],
    ["How Jeonju saved history", "In 1592 a war burned the other copies of the Annals. Only the Jeonju copy survived: two local scholars carried the books into the mountains of Naejangsan and protected them.", "Thanks to Jeonju, we can still read 500 years of Joseon history."],
    ["See it today", "At Gyeonggijeon you can visit the Royal Portrait Museum and the rebuilt archive building."]],
  jj: `Studying Korean history or culture? Jeonju is a living textbook, and you can visit it on a free afternoon.`,
  say: [["전주는 조선 왕실의 고향이에요.", "Jeonju is the hometown of the Joseon royal family."], ["실록을 지킨 이야기가 감동적이에요.", "The story of protecting the Annals is moving."]],
  know: [["Dramas", "사극", `Korean historical dramas ${K("사극", "sageuk")} often show King Taejo and the start of Joseon. Now you know where his family came from!`],
    ["UNESCO list", "유네스코", "The Annals of the Joseon Dynasty were added to UNESCO's Memory of the World in 1997."]],
  when: [["Asking a guide", "이 그림은 누구예요?", "Who is in this painting?"]],
  terms: [["왕조", "wangjo", "dynasty"], ["역사", "yeoksa", "history"], ["기록", "girok", "record"], ["지키다", "jikida", "to protect"], ["박물관", "bangmulgwan", "museum"], ["유산", "yusan", "heritage"]]});

/* ================= F 축제와 행사 ================= */
page({code: "JB-F-01", t: "전주국제영화제", en: "Jeonju International Film Festival", pic: ["jiff.jpg", `${K("전주국제영화제", "jeonju gukje yeonghwaje")} (JIFF)`],
  facts: [["Started", "2000"],
    ["When", "every spring (around late April to May), about 10 days"],
    ["Known for", "independent, new and creative films from around the world"],
    ["Where", `${K("영화의 거리", "yeonghwaui geori")} “Film Street” in downtown Jeonju`],
    ["Tickets", "cheap, and many outdoor events are free"]],
  secs: [["A festival for real film fans", "JIFF shows hundreds of films from dozens of countries, many with English subtitles. You might find a film from your own country!"],
    ["The whole city joins", "Film Street fills with pop-up stages, food trucks, music and talks with directors. It feels like a big party in spring."],
    ["Volunteer!", `The festival looks for volunteers ${K("자원봉사자", "jawonbongsaja")} every year. It is a great way to use English and Korean and to make friends.`]],
  jj: `JIFF is in the middle of the spring semester. Book tickets online early, and go with classmates after class.`,
  say: [["영화 표 두 장 주세요.", "Two movie tickets, please."], ["영어 자막 있어요?", "Does it have English subtitles?"]],
  know: [["Reading the schedule", "상영 시간표", `${K("상영", "sangyeong")} means screening. ${K("GV", "")} means a talk with the director after the movie.`],
    ["Cinema town", "영화의 거리", "Even outside the festival, Film Street has cinemas, cafés and cheap restaurants for students."]],
  when: [["Buying a ticket", "이 영화 아직 자리 있어요?", "Are there still seats for this movie?"]],
  terms: [["영화", "yeonghwa", "movie, film"], ["영화제", "yeonghwaje", "film festival"], ["감독", "gamdok", "director"], ["자막", "jamak", "subtitles"], ["표", "pyo", "ticket"], ["예매", "yemae", "advance booking"]]});

page({code: "JB-F-02", t: "전주의 축제들", en: "Jeonju Festivals Through the Year", pic: ["festival.jpg", "A festival in Jeonju"],
  facts: [["Spring", "Jeonju International Film Festival, Hanji Culture Festival"],
    ["Autumn", `Jeonju International Sori Festival, Bibimbap Festival`],
    ["Year round", "street performances and events in the Hanok Village"],
    ["Price", "many events are free"]],
  secs: [["Hanji Culture Festival 한지문화축제", "A hanji fashion show (yes, clothes made of paper!), workshops and craft markets."],
    ["Sori Festival 세계소리축제", "Traditional Korean music meets world music. Concerts in the Hanok Village, in parks and at the cultural center."],
    ["Bibimbap Festival 비빔밥축제", "Watch a giant bibimbap being mixed for hundreds of people, then share it. Free tasting is part of the fun."],
    ["Hanok Village nights", "On weekends and holidays there are often traditional games, music and lantern events."]],
  jj: `A semester in Jeonju always has a festival. Follow the city's social media and check the posters on campus.`,
  say: [["이번 주말에 축제가 있어요.", "There's a festival this weekend."], ["같이 축제 보러 갈래요?", "Do you want to go see the festival together?"]],
  know: [["Festival food", "축제 음식", "Festivals always have food stalls: try local food you haven't tried yet."],
    ["Free events", "무료 행사", `Look for ${K("무료", "muryo")} (free) and ${K("선착순", "seonchaksun")} (first come, first served) on posters.`]],
  when: [["Asking about a festival", "축제는 언제까지 해요?", "Until when is the festival?"]],
  terms: [["축제", "chukje", "festival"], ["행사", "haengsa", "event"], ["무료", "muryo", "free (of charge)"], ["공연", "gongyeon", "show, performance"], ["포스터", "poseuteo", "poster"], ["참가하다", "chamgahada", "to take part"]]});

page({code: "JB-F-03", t: "전북의 축제", en: "Festivals Around Jeonbuk", pic: ["gimje.jpg", `Golden rice fields in ${K("김제", "gimje")}`],
  facts: [[K("김제지평선축제", "gimje jipyeongseon chukje"), "Gimje Horizon Festival: rice farming culture, in autumn"],
    [K("남원 춘향제", "namwon chunhyangje"), "a spring festival for Korea's most famous love story"],
    [K("무주 반딧불축제", "muju bandeutbul chukje"), "Muju Firefly Festival, in late summer"],
    ["Other", "many town festivals for local food, like cheese, berries and gochujang"]],
  secs: [["Gimje Horizon Festival", `Gimje is the only place in Korea where you can see the horizon ${K("지평선", "jipyeongseon")} over land. Try rice farming, ride an ox cart and fly kites near an ancient reservoir ${K("벽골제", "byeokgolje")}.`],
    ["Namwon Chunhyang Festival", "Celebrate the love story of Chunhyang and Mongnyong with performances, a beauty pageant, swings and traditional games."],
    ["Muju Firefly Festival", "Muju's clean nature still has fireflies. Join a night walk to see them glowing in the dark."]],
  jj: `These festivals are 1 or 2 hours from Jeonju by bus. Plan a day trip with friends; it's a great way to see the real countryside.`,
  say: [["반딧불이를 처음 봤어요.", "I saw fireflies for the first time."], ["지평선이 정말 넓어요.", "The horizon is really wide."]],
  know: [["Festival buses", "축제 셔틀버스", `Big festivals often have free shuttle buses ${K("셔틀버스", "syeoteulbeoseu")} from the bus terminal.`],
    ["Country manners", "시골 예절", "In small towns, greet older people with 안녕하세요: they will be very happy to meet you."]],
  when: [["Asking for directions", "축제장에 어떻게 가요?", "How do I get to the festival grounds?"]],
  terms: [["지평선", "jipyeongseon", "horizon"], ["농사", "nongsa", "farming"], ["반딧불이", "bandeutburi", "firefly"], ["시골", "sigol", "countryside"], ["사랑", "sarang", "love"], ["전통 놀이", "jeontong nori", "traditional games"]]});

/* ================= G 전북 여행지 ================= */
page({code: "JB-G-01", t: "군산", en: "Gunsan", pic: ["gunsan.jpg", `Old buildings in ${K("군산", "gunsan")}`],
  facts: [["Where", "a port city on the West Sea, about 1 hour from Jeonju"],
    ["Known for", "modern history streets, old bakeries, islands"],
    [K("근대문화유산 거리", "geundae munhwa yusan geori"), "streets with buildings from about 100 years ago"],
    [K("선유도", "seonyudo"), "a beautiful island you can reach by car or bus over bridges"]],
  secs: [["Walk back in time", "In the early 1900s, rice from the plains was shipped from Gunsan to Japan. Old banks, houses and a temple from that time still stand. The city tells this sad history honestly."],
    ["Movie places", "A small photo studio from a famous Korean movie and many old streets make Gunsan a favorite place for photos."],
    ["Islands", `${K("고군산군도", "gogunsangundo")} is a group of islands. On ${K("선유도", "seonyudo")} you can ride a bike, walk on the beach and watch the sunset.`]],
  jj: `A Gunsan day trip is easy and cheap by intercity bus. Don't leave without trying the bread from its famous old bakery!`,
  say: [["군산에 당일치기로 다녀왔어요.", "I took a day trip to Gunsan."], ["바다가 정말 예뻐요.", "The sea is really beautiful."]],
  know: [["Bakery town", "빵의 도시", "Gunsan has one of the oldest bakeries in Korea. People line up for its red-bean and vegetable breads."],
    ["Sunset", "노을", `The West Sea is famous for sunsets ${K("노을", "noeul")}. Check the sunset time before you go.`]],
  when: [["At the bus terminal", "군산 가는 표 한 장 주세요.", "One ticket to Gunsan, please."]],
  terms: [["항구", "hanggu", "port"], ["섬", "seom", "island"], ["다리", "dari", "bridge"], ["당일치기", "dangilchigi", "day trip"], ["근대", "geundae", "modern (era)"], ["빵", "ppang", "bread"]]});

page({code: "JB-G-02", t: "남원", en: "Namwon", pic: ["gwanghallu.jpg", `${K("광한루원", "gwanghallu-won")} garden`],
  facts: [["Where", "southeast of Jeonju, about 1 hour by bus"],
    ["Known for", `the love story ${K("춘향전", "chunhyangjeon")}`],
    [K("광한루원", "gwanghallu-won"), "a beautiful garden with a pavilion, ponds and a stone bridge"],
    ["Nature", `the gate to ${K("지리산", "jirisan")}, one of Korea's great mountains`]],
  secs: [["Korea's Romeo and Juliet", `${K("춘향", "chunhyang")}, a young woman from Namwon, and ${K("이몽룡", "imongnyong")}, a nobleman's son, fall in love at Gwanghallu. They are separated, but Chunhyang stays faithful, and in the end love wins.`],
    ["Gwanghallu garden", `Cross the ${K("오작교", "ojakgyo")} bridge with someone special. A legend says couples who cross it together stay together.`],
    ["Mountains", "Namwon is an entrance to Jirisan National Park. Easy valley walks and hard hikes are both possible."]],
  jj: `A perfect spring trip: go during the Chunhyang Festival, try the swing in hanbok and eat Namwon's famous loach soup.`,
  say: [["춘향전은 사랑 이야기예요.", "Chunhyangjeon is a love story."], ["오작교를 같이 건너요.", "Let's cross the Ojakgyo bridge together."]],
  know: [["Local food", "추어탕", `Namwon ${K("추어탕", "chueotang")} is a thick soup made from loach, a small river fish. Healthy and warm.`],
    ["Pansori", "춘향가", "The story is also a famous pansori song: Chunhyangga."]],
  when: [["Asking for a recommendation", "남원에서 뭐 먹어야 돼요?", "What should I eat in Namwon?"]],
  terms: [["이야기", "iyagi", "story"], ["정원", "jeongwon", "garden"], ["다리", "dari", "bridge"], ["연인", "yeonin", "lovers, couple"], ["전설", "jeonseol", "legend"], ["등산", "deungsan", "hiking"]]});

page({code: "JB-G-03", t: "무주", en: "Muju", pic: ["deogyusan.jpg", `${K("덕유산", "deogyusan")} in winter`],
  facts: [["Where", "in the mountains, east of Jeonju, about 1 hour 30 minutes"],
    [K("덕유산", "deogyusan"), "a high mountain; the top, Hyangjeokbong, is 1,614 m"],
    ["Ski resort", "one of Korea's big ski resorts, with a gondola"],
    [K("태권도원", "taekwondowon"), "a huge center for taekwondo, Korea's martial art"],
    ["Clean nature", "so clean that fireflies still live here"]],
  secs: [["Snow mountain", "In winter, ride the gondola almost to the top of Deogyusan and walk through trees white with frost. In summer it is cool and green."],
    ["Ski and snowboard", `Many students learn to ski for the first time in Muju. Rent everything there; lessons ${K("강습", "gangseup")} are available.`],
    ["Taekwondowon", "Watch exciting taekwondo shows, try kicking and breaking a board, and learn about the sport that Korea gave the world."]],
  jj: `Ski trips with friends in the winter vacation are a classic memory. Muju is close enough to go and come back in one day.`,
  say: [["스키를 처음 타 봤어요.", "I tried skiing for the first time."], ["곤돌라 타고 정상에 갔어요.", "I took the gondola to the top."]],
  know: [["Warm clothes", "따뜻한 옷", "It is much colder on the mountain than in Jeonju. Bring gloves, a hat and layers."],
    ["Muju apples", "무주 사과", "Muju is also famous for sweet apples in the autumn."]],
  when: [["Renting skis", "스키 장비 빌리고 싶어요.", "I'd like to rent ski equipment."]],
  terms: [["스키", "seuki", "ski, skiing"], ["눈", "nun", "snow"], ["정상", "jeongsang", "top, peak"], ["태권도", "taegwondo", "taekwondo"], ["춥다", "chupda", "cold"], ["장비", "jangbi", "equipment"]]});

page({code: "JB-G-04", t: "부안과 고창", en: "Buan and Gochang", pic: ["chaeseokgang.jpg", `${K("채석강", "chaeseokgang")} in Buan`],
  facts: [[K("변산반도", "byeonsanbando"), "a national park where the mountains meet the sea"],
    [K("채석강", "chaeseokgang"), "cliffs that look like thousands of stacked books"],
    [K("내소사", "naesosa"), "an old temple at the end of a fir tree path"],
    [K("고창 고인돌", "gochang goindol"), "ancient stone tombs, a UNESCO World Heritage site (2000)"],
    [K("선운사", "seonunsa"), "a temple famous for red camellia flowers and autumn leaves"]],
  secs: [["Buan by the sea", "Walk on the rocks at Chaeseokgang at low tide and watch the sunset over the West Sea. The nearby beaches are quiet and beautiful."],
    ["A forest path", `The road to ${K("내소사", "naesosa")} passes through tall fir trees. Even in summer it is cool and fresh.`],
    ["Gochang's giant stones", `Korea has the most dolmens ${K("고인돌", "goindol")} in the world, and Gochang has hundreds of them in one place. They are about 2,500 years old or more.`]],
  jj: `For a weekend away, Buan and Gochang give you sea, forest, temples and world heritage in one trip, all within Jeonbuk.`,
  say: [["바위가 책을 쌓은 것 같아요.", "The rocks look like stacked books."], ["고인돌은 아주 오래된 무덤이에요.", "Dolmens are very old tombs."]],
  know: [["Tide times", "물때", `Check the low tide time ${K("썰물", "sseolmul")} before you visit Chaeseokgang. At high tide you can't walk on the rocks.`],
    ["Temple stay", "템플스테이", "Some temples let you stay overnight, meditate and eat temple food."]],
  when: [["At a temple", "조용히 해 주세요.", "Please be quiet."], ["Asking about the tide", "썰물이 몇 시예요?", "What time is low tide?"]],
  terms: [["바위", "bawi", "rock"], ["절", "jeol", "Buddhist temple"], ["숲", "sup", "forest"], ["무덤", "mudeom", "tomb"], ["노을", "noeul", "sunset glow"], ["국립공원", "gungnipgongwon", "national park"]]});

/* ================= H 전주에서 살기 ================= */
page({code: "JB-H-01", t: "전주의 교통", en: "Getting Around Jeonju", pic: ["station.jpg", `${K("전주역", "jeonjuyeok")}: Jeonju Station`],
  facts: [["City buses", `${K("시내버스", "sinaebeoseu")}: they go all over Jeonju, including JJ University`],
    ["Card", `pay with a transportation card ${K("교통카드", "gyotongkadeu")} and get free or cheap transfers`],
    ["KTX", `${K("전주역", "jeonjuyeok")} to Seoul (Yongsan) about 1 hour 40 minutes`],
    ["Express bus", "to Seoul about 2 hours 40 minutes"],
    ["Airport", "direct buses to Incheon Airport, about 3 to 4 hours"]],
  secs: [["Around the city", "City buses are the easiest way to get around. Check arrival times on a map app. Taxis are cheap compared with many countries."],
    ["Out of the city", `Trains leave from ${K("전주역", "jeonjuyeok")}; nearby ${K("익산역", "iksanyeok")} has even more KTX trains. Buses leave from the express and intercity bus terminals.`],
    ["Going home", "For flights, take the airport bus from Jeonju to Incheon. It is comfortable and you can sleep on the way."]],
  jj: `See the lesson 전주 시내 나가기 (University Life) to practice talking to a taxi driver. From campus, downtown and the Hanok Village are close by bus or taxi.`,
  tip: "Use Korean map apps like Naver Map or Kakao Map. Google Maps does not give full directions in Korea.",
  say: [["이 버스 전주역에 가요?", "Does this bus go to Jeonju Station?"], ["다음 정류장에서 내려요.", "I get off at the next stop."]],
  know: [["Transfers", "환승", `Tap your card when you get off, too. Then your next bus ${K("환승", "hwanseung")} is free or cheaper.`],
    ["Trains app", "기차 예매", "Book KTX tickets on the Korail app. Weekend trains to Seoul sell out fast."]],
  when: [["Buying a train ticket", "서울 가는 KTX 한 장 주세요.", "One KTX ticket to Seoul, please."], ["In a taxi", "전주대학교로 가 주세요.", "To Jeonju University, please."]],
  terms: [["버스", "beoseu", "bus"], ["기차", "gicha", "train"], ["역", "yeok", "station"], ["터미널", "teomineol", "bus terminal"], ["환승", "hwanseung", "transfer"], ["예매", "yemae", "advance booking"]]});

page({code: "JB-H-02", t: "생활비와 장보기", en: "Living Costs and Shopping", pic: ["market.jpg", "A traditional market"],
  facts: [["Cost of living", "lower than Seoul, especially rent and food"],
    ["Eat out", "a full Korean meal is often about 8,000 to 12,000 won"],
    ["Markets", `traditional markets ${K("전통시장", "jeontongsijang")} like Nambu Market and Moraenae Market`],
    ["Big stores", "supermarkets and department stores downtown"],
    ["Delivery", "food and shopping delivery apps work everywhere in the city"]],
  secs: [["Save money in Jeonju", "Student restaurants, set menus and generous side dishes mean you eat well for little money. Many students say they spend less here than they expected."],
    ["Market shopping", "Traditional markets have fresh fruit and vegetables at good prices. Sellers often add a little extra for regulars."],
    ["Everyday shopping", `For quick things, convenience stores ${K("편의점", "pyeonuijeom")} are open 24 hours. For bigger shopping, go to a supermarket on the weekend.`]],
  jj: `JJ University's student cafeteria is one of the cheapest ways to eat a good meal. Ask your buddy about scholarships and part-time job rules too (see University Life and Part-time Jobs).`,
  say: [["이거 얼마예요?", "How much is this?"], ["봉투 필요 없어요.", "I don't need a bag."]],
  know: [["Plastic bags", "봉투", "Shops charge for plastic bags. Bring your own bag."],
    ["1+1 deals", "원 플러스 원", `Look for ${K("1+1", "won peulleoseu won")} (buy one, get one free) at convenience stores.`]],
  when: [["At the checkout", "카드로 계산할게요.", "I'll pay by card."], ["Asking for a receipt", "영수증 주세요.", "A receipt, please."]],
  terms: [["생활비", "saenghwalbi", "living costs"], ["장보기", "jangbogi", "grocery shopping"], ["싸다", "ssada", "cheap"], ["비싸다", "bissada", "expensive"], ["편의점", "pyeonuijeom", "convenience store"], ["영수증", "yeongsujeung", "receipt"]]});

page({code: "JB-H-03", t: "전주 사투리", en: "Jeonju Dialect",
  facts: [["Dialect", `${K("사투리", "saturi")}: the local way of speaking`],
    ["Jeolla dialect", `${K("전라도 사투리", "jeollado saturi")}: warm, friendly and full of feeling`],
    ["Who uses it", "older people, market sellers, and young people with friends"],
    ["Should I use it?", "Learn standard Korean first, but knowing some dialect makes people smile"]],
  secs: [["Words you will hear", `${K("겁나", "geomna")} = very (매우): 겁나 맛있어! “Super tasty!”`, `${K("거시기", "geosigi")} = “that thing, you know”: used when you can't think of the word.`, `${K("징하다", "jinghada")} = too much, amazing or tiresome.`],
    ["Endings you will hear", `${K("-잉", "-ing")}: a soft ending: 그래잉 “OK~”.`, `${K("-당께", "-dangkke")} = -다니까 “I told you”: 맛있당께!`, `${K("-허다", "-heoda")} = -하다: 좋아허다.`],
    ["Feelings", `${K("아따", "atta")} and ${K("오메", "ome")} are surprise words like “wow” or “oh my”. You will hear them at the market!`]],
  jj: `Try saying 겁나 맛있어요! at a Jeonju restaurant. The owner will laugh and probably give you extra side dishes.`,
  say: [["겁나 맛있어요!", "It's super delicious! (dialect)"], ["아따, 많이 주셨네요!", "Wow, you gave me so much!"]],
  know: [["Standard Korean", "표준어", `${K("표준어", "pyojuneo")} (standard Korean) is based on Seoul speech. TOPIK and classes use it.`],
    ["Every region", "지역마다", "Busan, Jeju and other areas have their own dialects too. Jeju dialect is very different!"]],
  when: [["When you don't understand", "그게 무슨 뜻이에요?", "What does that mean?"], ["Asking about dialect", "이거 사투리예요?", "Is this dialect?"]],
  terms: [["사투리", "saturi", "dialect"], ["표준어", "pyojuneo", "standard language"], ["겁나", "geomna", "very (Jeolla dialect)"], ["거시기", "geosigi", "that thing (Jeolla)"], ["뜻", "tteut", "meaning"], ["말투", "maltu", "way of speaking"]]});

fs.writeFileSync(path.join(root, "data/JB.json"), JSON.stringify(P));
const tf = path.join(root, "src/titles-en.txt"), old = fs.readFileSync(tf, "utf8").split("\n").filter(l => !l.startsWith("JB-"));
while (old.length && !old[old.length - 1].trim()) old.pop();
fs.writeFileSync(tf, old.concat(TITLES).join("\n") + "\n");
console.log(P.length, "pages; photos", P.filter(p => p.info.includes("img/jb/")).length);
