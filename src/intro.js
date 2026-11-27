/* JeyCampus intro page (v1.25, RYU 2026-11-27; design from the approved mockup, project folder kor-app-en/mockup/intro/).
   Shown when the app opens without a lesson link, once per visit. Language and playback choices are written straight into
   the app's saved state (window.JC.S, from src/app.js), so the next visit opens with them and lessons change them as before. */
(function(){
"use strict";
const JC = window.JC; if (!JC) return;
const S = JC.S, URL_APP = "jeycampus.pages.dev";
const MENUS = [["K2","안녕","기초회화"],["K1","가나","한글"],["K6","은는","문법"],["K7","단어","어휘"],["LS","듣기","듣기연습"],["TP","TOPIK","TOPIK"],["K4","학교","대학 생활"],["K5","알바","아르바이트"],["KR","한국","대한민국"],["JB","전주","전주"],["HP","?","도움말"]];
const LEARN = 6;
const T = {
en:{hello:"Welcome to Jeonju University",h1:"Your Korean starts here, on campus.",lead:"Learn conversation, Hangeul, grammar, vocabulary, listening and TOPIK with Jey, plus everything you need for university life, part-time jobs and Jeonju.",
 st:["Words","Sentences","Menus","Languages"],s1:"Choose your language",s1n:"Korean stays Korean. Meanings, tips and help are shown in your language.",
 s2:"Set up how you listen",s2n:"You can change these any time inside a lesson.",pass:"My learning setup",rep:"Repeat each line",spd:"Speed",voice:"Hear meanings in English",voiceN:"Korean, then your language, then Korean again.",
 theme:"Theme",th:["Auto","Light","Dark"],fz:"Text size",sample:"Hello. I'm Jey.",listen:"Listen to a sample",start:"Start Learning",how:"How to use",inside:"What's inside",learn:"Learn Korean",live:"Life in Korea",
 mn:{K2:"Basic Conversation",K1:"Hangeul",K6:"Grammar",K7:"Vocabulary",LS:"Listening Practice",TP:"TOPIK",K4:"University Life",K5:"Part-time Jobs",KR:"About Korea",JB:"Jeonju",HP:"Help"},
 it:"Put JeyCampus on your home screen",itn:"It works like an app: full screen, and it keeps working offline once the audio is saved. No app store needed.",det:"Looks like you're using",other:"Other devices",
 dlt:"Downloads",dla:"Install the app",dlad:"Opens full screen, like any app.",inst:"Install",seehow:"See how",dlv:"Save all audio",dlvd:"Korean voice + {L} voice, for use without internet. Use Wi‑Fi.",save:"Save",dlp:"Poster to share",dlpd:"Tell your friends about JeyCampus.",dl:"Download",
 qr:"Open on your phone",qrd:"Scan with your phone camera.",copy:"Copy",copied:"Address copied",foot:"Free for every Jeonju University student.",vname:"English",
 steps:{ios:["Open this page in Safari.","Tap the Share button {share} at the bottom.","Scroll down and tap “Add to Home Screen”.","Tap “Add”. Jey is now on your home screen."],
  android:["Tap “Install” below.","Don't see it? Open Chrome's {dots} menu and choose “Install app”.","Tap “Install”, then open JeyCampus from your home screen."],
  ipad:["Open this page in Safari.","Tap the Share button {share} at the top right.","Tap “Add to Home Screen”, then “Add”."],
  chrome:["In Chrome or Edge, click the install icon {inst} at the right end of the address bar.","Click “Install”. JeyCampus opens in its own window with a desktop shortcut."],
  safari:["In Safari on a Mac, open the File menu.","Choose “Add to Dock”, then “Add”."]}},
vi:{hello:"Chào mừng đến Đại học Jeonju",h1:"Tiếng Hàn của bạn bắt đầu từ đây, ngay tại trường.",lead:"Học hội thoại, Hangeul, ngữ pháp, từ vựng, luyện nghe và TOPIK cùng Jey, cùng mọi điều cần cho đời sống đại học, việc làm thêm và Jeonju.",
 st:["Từ","Câu","Mục","Ngôn ngữ"],s1:"Chọn ngôn ngữ",s1n:"Tiếng Hàn giữ nguyên. Nghĩa, mẹo và hướng dẫn hiện bằng ngôn ngữ của bạn.",
 s2:"Cài đặt cách nghe",s2n:"Bạn có thể đổi bất cứ lúc nào trong bài học.",pass:"Cài đặt học của tôi",rep:"Lặp lại mỗi câu",spd:"Tốc độ",voice:"Nghe nghĩa bằng tiếng Việt",voiceN:"Tiếng Hàn, rồi tiếng của bạn, rồi lại tiếng Hàn.",
 theme:"Giao diện",th:["Tự động","Sáng","Tối"],fz:"Cỡ chữ",sample:"Xin chào. Mình là Jey.",listen:"Nghe thử",start:"Bắt đầu học",how:"Cách dùng",inside:"Có gì bên trong",learn:"Học tiếng Hàn",live:"Cuộc sống ở Hàn",
 mn:{K2:"Hội thoại cơ bản",K1:"Chữ Hangeul",K6:"Ngữ pháp",K7:"Từ vựng",LS:"Luyện nghe",TP:"TOPIK",K4:"Đời sống đại học",K5:"Việc làm thêm",KR:"Về Hàn Quốc",JB:"Jeonju",HP:"Hướng dẫn"},
 it:"Thêm JeyCampus vào màn hình chính",itn:"Dùng như một ứng dụng: mở toàn màn hình và vẫn chạy khi không có mạng sau khi lưu âm thanh. Không cần kho ứng dụng.",det:"Có vẻ bạn đang dùng",other:"Thiết bị khác",
 dlt:"Tải về",dla:"Cài ứng dụng",dlad:"Mở toàn màn hình như ứng dụng.",inst:"Cài đặt",seehow:"Xem cách làm",dlv:"Lưu toàn bộ âm thanh",dlvd:"Giọng Hàn + giọng {L}, dùng khi không có mạng. Hãy dùng Wi‑Fi.",save:"Lưu",dlp:"Áp phích để chia sẻ",dlpd:"Giới thiệu JeyCampus cho bạn bè.",dl:"Tải về",
 qr:"Mở trên điện thoại",qrd:"Quét bằng camera điện thoại.",copy:"Sao chép",copied:"Đã sao chép địa chỉ",foot:"Miễn phí cho mọi sinh viên Đại học Jeonju.",vname:"tiếng Việt",
 steps:{ios:["Mở trang này bằng Safari.","Chạm nút Chia sẻ {share} ở phía dưới.","Kéo xuống và chọn “Thêm vào MH chính”.","Chạm “Thêm”. Jey đã có trên màn hình chính."],
  android:["Chạm “Cài đặt” bên dưới.","Không thấy? Mở menu {dots} của Chrome và chọn “Cài đặt ứng dụng”.","Chạm “Cài đặt”, rồi mở JeyCampus từ màn hình chính."],
  ipad:["Mở trang này bằng Safari.","Chạm nút Chia sẻ {share} ở góc trên bên phải.","Chọn “Thêm vào MH chính”, rồi “Thêm”."],
  chrome:["Trên Chrome hoặc Edge, bấm biểu tượng cài đặt {inst} ở cuối thanh địa chỉ.","Bấm “Cài đặt”. JeyCampus mở trong cửa sổ riêng và có lối tắt trên màn hình."],
  safari:["Trên Safari của máy Mac, mở menu Tệp.","Chọn “Thêm vào Dock”, rồi “Thêm”."]}},
ne:{hello:"जोन्जु विश्वविद्यालयमा स्वागत छ",h1:"तपाईंको कोरियाली यहीँ, क्याम्पसबाटै सुरु हुन्छ।",lead:"जेसँग कुराकानी, हाङ्गुल, व्याकरण, शब्दावली, सुन्ने अभ्यास र TOPIK सिक्नुहोस्, साथै विश्वविद्यालय जीवन, अंशकालीन काम र जोन्जुका लागि चाहिने सबै कुरा।",
 st:["शब्द","वाक्य","मेनु","भाषा"],s1:"भाषा छान्नुहोस्",s1n:"कोरियाली कोरियालीमै रहन्छ। अर्थ, सुझाव र सहायता तपाईंको भाषामा देखिन्छ।",
 s2:"सुन्ने तरिका मिलाउनुहोस्",s2n:"यी कुरा पाठभित्र जुनसुकै बेला बदल्न सकिन्छ।",pass:"मेरो सिकाइ सेटिङ",rep:"हरेक वाक्य दोहोर्याउने",spd:"गति",voice:"अर्थ नेपालीमा सुन्ने",voiceN:"पहिले कोरियाली, त्यसपछि तपाईंको भाषा, फेरि कोरियाली।",
 theme:"थिम",th:["स्वचालित","उज्यालो","अँध्यारो"],fz:"अक्षरको आकार",sample:"नमस्ते। म जे हुँ।",listen:"नमुना सुन्नुहोस्",start:"सिक्न सुरु गर्नुहोस्",how:"कसरी प्रयोग गर्ने",inside:"भित्र के छ",learn:"कोरियाली सिक्नुहोस्",live:"कोरियामा जीवन",
 mn:{K2:"आधारभूत कुराकानी",K1:"हाङ्गुल",K6:"व्याकरण",K7:"शब्दावली",LS:"सुन्ने अभ्यास",TP:"TOPIK",K4:"विश्वविद्यालय जीवन",K5:"अंशकालीन काम",KR:"कोरियाको परिचय",JB:"जोन्जु",HP:"सहायता"},
 it:"JeyCampus लाई होम स्क्रिनमा राख्नुहोस्",itn:"यो एप जस्तै चल्छ: पूरा स्क्रिनमा खुल्छ, अडियो सेभ गरेपछि इन्टरनेट बिना पनि चल्छ। एप स्टोर चाहिँदैन।",det:"तपाईं यो प्रयोग गर्दै हुनुहुन्छ जस्तो छ",other:"अरू उपकरण",
 dlt:"डाउनलोड",dla:"एप इन्स्टल",dlad:"अरू एपजस्तै पूरा स्क्रिनमा खुल्छ।",inst:"इन्स्टल",seehow:"तरिका हेर्नुहोस्",dlv:"सबै अडियो सेभ गर्नुहोस्",dlvd:"कोरियाली आवाज + {L} आवाज, इन्टरनेट बिना प्रयोगका लागि। Wi‑Fi प्रयोग गर्नुहोस्।",save:"सेभ",dlp:"बाँड्ने पोस्टर",dlpd:"साथीहरूलाई JeyCampus बारे बताउनुहोस्।",dl:"डाउनलोड",
 qr:"फोनमा खोल्नुहोस्",qrd:"फोनको क्यामेराले स्क्यान गर्नुहोस्।",copy:"कपी",copied:"ठेगाना कपी भयो",foot:"जोन्जु विश्वविद्यालयका सबै विद्यार्थीका लागि निःशुल्क।",vname:"नेपाली",
 steps:{ios:["यो पेज Safari मा खोल्नुहोस्।","तल रहेको Share बटन {share} थिच्नुहोस्।","तल सरेर “Add to Home Screen” छान्नुहोस्।","“Add” थिच्नुहोस्। अब जे तपाईंको होम स्क्रिनमा छ।"],
  android:["तलको “इन्स्टल” थिच्नुहोस्।","देखिएन? Chrome को {dots} मेनु खोलेर “Install app” छान्नुहोस्।","“Install” थिच्नुहोस्, अनि होम स्क्रिनबाट JeyCampus खोल्नुहोस्।"],
  ipad:["यो पेज Safari मा खोल्नुहोस्।","माथि दायाँको Share बटन {share} थिच्नुहोस्।","“Add to Home Screen” छानेर “Add” थिच्नुहोस्।"],
  chrome:["Chrome वा Edge मा, ठेगाना पट्टीको दायाँ छेउको इन्स्टल आइकन {inst} क्लिक गर्नुहोस्।","“Install” क्लिक गर्नुहोस्। JeyCampus आफ्नै विन्डोमा खुल्छ र डेस्कटपमा सर्टकट बन्छ।"],
  safari:["Mac को Safari मा File मेनु खोल्नुहोस्।","“Add to Dock” छानेर “Add” थिच्नुहोस्।"]}},
my:{hello:"ဂျွန်ဂျူ တက္ကသိုလ်မှ ကြိုဆိုပါတယ်",h1:"သင့်ကိုရီးယားစာ ဒီကျောင်းဝင်းမှာ စတင်ပါပြီ။",lead:"Jey နဲ့အတူ စကားပြော၊ ဟန်ဂူးလ်၊ သဒ္ဒါ၊ ဝေါဟာရ၊ နားထောင်ခြင်းနဲ့ TOPIK ကို လေ့လာပါ။ တက္ကသိုလ်ဘဝ၊ အချိန်ပိုင်းအလုပ်နဲ့ ဂျွန်ဂျူအတွက် လိုအပ်တာတွေလည်း ပါပါတယ်။",
 st:["စကားလုံး","ဝါကျ","မီနူး","ဘာသာစကား"],s1:"ဘာသာစကား ရွေးပါ",s1n:"ကိုရီးယားစာက ကိုရီးယားလိုပဲ ရှိနေမယ်။ အဓိပ္ပာယ်၊ အကြံပြုချက်နဲ့ အကူအညီတွေကို သင့်ဘာသာစကားနဲ့ ပြပါမယ်။",
 s2:"နားထောင်ပုံ သတ်မှတ်ပါ",s2n:"သင်ခန်းစာထဲမှာ အချိန်မရွေး ပြောင်းနိုင်ပါတယ်။",pass:"ကျွန်ုပ်ရဲ့ လေ့လာမှု ဆက်တင်",rep:"စာကြောင်းတိုင်း ထပ်ခါ",spd:"အမြန်နှုန်း",voice:"အဓိပ္ပာယ်ကို မြန်မာလို နားထောင်ရန်",voiceN:"ကိုရီးယားလို အရင်၊ ပြီးရင် သင့်ဘာသာစကား၊ ပြီးတော့ ကိုရီးယားလို ထပ်။",
 theme:"မျက်နှာပြင်",th:["အလိုအလျောက်","အလင်း","အမှောင်"],fz:"စာလုံးအရွယ်အစား",sample:"မင်္ဂလာပါ။ ကျွန်တော် Jey ပါ။",listen:"နမူနာ နားထောင်ရန်",start:"စတင်လေ့လာမယ်",how:"အသုံးပြုနည်း",inside:"ဘာတွေ ပါလဲ",learn:"ကိုရီးယားစာ လေ့လာရန်",live:"ကိုရီးယားမှာ နေထိုင်ခြင်း",
 mn:{K2:"အခြေခံ စကားပြော",K1:"ဟန်ဂူးလ်",K6:"သဒ္ဒါ",K7:"ဝေါဟာရ",LS:"နားထောင်ခြင်း လေ့ကျင့်ရန်",TP:"TOPIK",K4:"တက္ကသိုလ်ဘဝ",K5:"အချိန်ပိုင်းအလုပ်",KR:"ကိုရီးယားအကြောင်း",JB:"ဂျွန်ဂျူ",HP:"အကူအညီ"},
 it:"JeyCampus ကို ပင်မမျက်နှာပြင်မှာ ထည့်ပါ",itn:"အက်ပ်လိုပဲ သုံးနိုင်ပါတယ်။ မျက်နှာပြင်အပြည့် ဖွင့်ပြီး အသံတွေ သိမ်းပြီးရင် အင်တာနက်မရှိလည်း သုံးနိုင်ပါတယ်။ App Store မလိုပါ။",det:"သင်သုံးနေတာ",other:"အခြား စက်များ",
 dlt:"ဒေါင်းလုဒ်",dla:"အက်ပ် ထည့်သွင်းရန်",dlad:"အက်ပ်တွေလိုပဲ မျက်နှာပြင်အပြည့် ပွင့်ပါတယ်။",inst:"ထည့်သွင်းရန်",seehow:"နည်းလမ်း ကြည့်ရန်",dlv:"အသံအားလုံး သိမ်းရန်",dlvd:"ကိုရီးယား အသံ + {L} အသံ၊ အင်တာနက်မရှိဘဲ သုံးရန်။ Wi‑Fi သုံးပါ။",save:"သိမ်းရန်",dlp:"မျှဝေရန် ပိုစတာ",dlpd:"သူငယ်ချင်းတွေကို JeyCampus အကြောင်း ပြောပြပါ။",dl:"ဒေါင်းလုဒ်",
 qr:"ဖုန်းမှာ ဖွင့်ရန်",qrd:"ဖုန်းကင်မရာနဲ့ စကင်ဖတ်ပါ။",copy:"ကူးရန်",copied:"လိပ်စာ ကူးပြီးပါပြီ",foot:"ဂျွန်ဂျူ တက္ကသိုလ် ကျောင်းသားအားလုံးအတွက် အခမဲ့။",vname:"မြန်မာ",
 steps:{ios:["ဒီစာမျက်နှာကို Safari နဲ့ ဖွင့်ပါ။","အောက်ခြေက Share ခလုတ် {share} ကို နှိပ်ပါ။","အောက်ကို ဆွဲပြီး “Add to Home Screen” ကို ရွေးပါ။","“Add” ကို နှိပ်ပါ။ Jey က ပင်မမျက်နှာပြင်မှာ ရောက်ပါပြီ။"],
  android:["အောက်က “ထည့်သွင်းရန်” ကို နှိပ်ပါ။","မတွေ့ဘူးလား။ Chrome ရဲ့ {dots} မီနူးကို ဖွင့်ပြီး “Install app” ကို ရွေးပါ။","“Install” ကို နှိပ်ပြီး ပင်မမျက်နှာပြင်က JeyCampus ကို ဖွင့်ပါ။"],
  ipad:["ဒီစာမျက်နှာကို Safari နဲ့ ဖွင့်ပါ။","ညာဘက်အပေါ်က Share ခလုတ် {share} ကို နှိပ်ပါ။","“Add to Home Screen” ကို ရွေးပြီး “Add” ကို နှိပ်ပါ။"],
  chrome:["Chrome သို့မဟုတ် Edge မှာ လိပ်စာဘားရဲ့ ညာဘက်စွန်းက install အိုင်ကွန် {inst} ကို နှိပ်ပါ။","“Install” ကို နှိပ်ပါ။ JeyCampus က သီးသန့်ဝင်းဒိုးမှာ ပွင့်ပြီး desktop shortcut ရပါမယ်။"],
  safari:["Mac ရဲ့ Safari မှာ File မီနူးကို ဖွင့်ပါ။","“Add to Dock” ကို ရွေးပြီး “Add” ကို နှိပ်ပါ။"]}},
lo:{hello:"ຍິນດີຕ້ອນຮັບສູ່ມະຫາວິທະຍາໄລ ຈອນຈູ",h1:"ພາສາເກົາຫຼີຂອງເຈົ້າ ເລີ່ມຕົ້ນທີ່ນີ້ ໃນມະຫາວິທະຍາໄລ.",lead:"ຮຽນການສົນທະນາ, ຮັນກຶນ, ໄວຍາກອນ, ຄຳສັບ, ການຟັງ ແລະ TOPIK ກັບ Jey, ພ້ອມທຸກຢ່າງທີ່ຕ້ອງການສຳລັບຊີວິດມະຫາວິທະຍາໄລ, ວຽກພິເສດ ແລະ ຈອນຈູ.",
 st:["ຄຳສັບ","ປະໂຫຍກ","ເມນູ","ພາສາ"],s1:"ເລືອກພາສາ",s1n:"ພາສາເກົາຫຼີຍັງເປັນພາສາເກົາຫຼີ. ຄວາມໝາຍ, ຄຳແນະນຳ ແລະ ການຊ່ວຍເຫຼືອ ຈະສະແດງເປັນພາສາຂອງເຈົ້າ.",
 s2:"ຕັ້ງຄ່າການຟັງ",s2n:"ປ່ຽນໄດ້ທຸກເວລາໃນບົດຮຽນ.",pass:"ການຕັ້ງຄ່າການຮຽນຂອງຂ້ອຍ",rep:"ຫຼິ້ນຊ້ຳແຕ່ລະປະໂຫຍກ",spd:"ຄວາມໄວ",voice:"ຟັງຄວາມໝາຍເປັນພາສາລາວ",voiceN:"ເກົາຫຼີກ່ອນ, ແລ້ວພາສາຂອງເຈົ້າ, ແລ້ວເກົາຫຼີອີກ.",
 theme:"ໜ້າຈໍ",th:["ອັດຕະໂນມັດ","ແຈ້ງ","ມືດ"],fz:"ຂະໜາດຕົວອັກສອນ",sample:"ສະບາຍດີ. ຂ້ອຍແມ່ນ Jey.",listen:"ຟັງຕົວຢ່າງ",start:"ເລີ່ມຮຽນ",how:"ວິທີໃຊ້",inside:"ມີຫຍັງແດ່",learn:"ຮຽນພາສາເກົາຫຼີ",live:"ຊີວິດໃນເກົາຫຼີ",
 mn:{K2:"ການສົນທະນາພື້ນຖານ",K1:"ຮັນກຶນ",K6:"ໄວຍາກອນ",K7:"ຄຳສັບ",LS:"ຝຶກຟັງ",TP:"TOPIK",K4:"ຊີວິດມະຫາວິທະຍາໄລ",K5:"ວຽກພິເສດ",KR:"ກ່ຽວກັບເກົາຫຼີ",JB:"ຈອນຈູ",HP:"ຄູ່ມື"},
 it:"ເພີ່ມ JeyCampus ໃສ່ໜ້າຈໍຫຼັກ",itn:"ໃຊ້ໄດ້ຄືແອັບ: ເປີດເຕັມຈໍ ແລະ ໃຊ້ໄດ້ໂດຍບໍ່ມີອິນເຕີເນັດ ຫຼັງຈາກບັນທຶກສຽງແລ້ວ. ບໍ່ຕ້ອງໃຊ້ App Store.",det:"ເບິ່ງຄືເຈົ້າກຳລັງໃຊ້",other:"ອຸປະກອນອື່ນ",
 dlt:"ດາວໂຫຼດ",dla:"ຕິດຕັ້ງແອັບ",dlad:"ເປີດເຕັມຈໍຄືແອັບທົ່ວໄປ.",inst:"ຕິດຕັ້ງ",seehow:"ເບິ່ງວິທີ",dlv:"ບັນທຶກສຽງທັງໝົດ",dlvd:"ສຽງເກົາຫຼີ + ສຽງ{L}, ສຳລັບໃຊ້ໂດຍບໍ່ມີອິນເຕີເນັດ. ໃຊ້ Wi‑Fi.",save:"ບັນທຶກ",dlp:"ໂປສເຕີສຳລັບແບ່ງປັນ",dlpd:"ບອກໝູ່ກ່ຽວກັບ JeyCampus.",dl:"ດາວໂຫຼດ",
 qr:"ເປີດໃນໂທລະສັບ",qrd:"ສະແກນດ້ວຍກ້ອງໂທລະສັບ.",copy:"ສຳເນົາ",copied:"ສຳເນົາທີ່ຢູ່ແລ້ວ",foot:"ຟຣີສຳລັບນັກສຶກສາມະຫາວິທະຍາໄລ ຈອນຈູ ທຸກຄົນ.",vname:"ລາວ",
 steps:{ios:["ເປີດໜ້ານີ້ໃນ Safari.","ແຕະປຸ່ມແບ່ງປັນ {share} ຢູ່ລຸ່ມ.","ເລື່ອນລົງ ແລ້ວເລືອກ “Add to Home Screen”.","ແຕະ “Add”. Jey ຢູ່ໜ້າຈໍຫຼັກແລ້ວ."],
  android:["ແຕະ “ຕິດຕັ້ງ” ຢູ່ລຸ່ມນີ້.","ບໍ່ເຫັນບໍ? ເປີດເມນູ {dots} ຂອງ Chrome ແລ້ວເລືອກ “Install app”.","ແຕະ “Install”, ແລ້ວເປີດ JeyCampus ຈາກໜ້າຈໍຫຼັກ."],
  ipad:["ເປີດໜ້ານີ້ໃນ Safari.","ແຕະປຸ່ມແບ່ງປັນ {share} ຢູ່ເທິງເບື້ອງຂວາ.","ເລືອກ “Add to Home Screen”, ແລ້ວ “Add”."],
  chrome:["ໃນ Chrome ຫຼື Edge, ຄລິກໄອຄອນຕິດຕັ້ງ {inst} ຢູ່ທ້າຍແຖບທີ່ຢູ່.","ຄລິກ “Install”. JeyCampus ຈະເປີດໃນໜ້າຕ່າງຂອງມັນເອງ ແລະ ມີທາງລັດໃນ desktop."],
  safari:["ໃນ Safari ຂອງ Mac, ເປີດເມນູ File.","ເລືອກ “Add to Dock”, ແລ້ວ “Add”."]}}
};
const KO = {s1:"설명 언어 선택",s2:"재생 설정",inside:"메뉴",it:"앱 설치와 다운로드",rep:"반복 횟수",spd:"재생 속도",voice:"설명 언어 음성",theme:"화면",fz:"글자 크기",pass:"학습 설정"};
const ICON = {
 play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>',
 stop:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="2"/></svg>',
 arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
 share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11H5v10h14V11h-1"/></svg>',
 inst:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="14" rx="2"/><path d="M12 8v6M9 11l3 3 3-3"/></svg>',
 dots:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>',
 audio:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14v-2a9 9 0 0 1 18 0v2"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/></svg>',
 img:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 17l3-4 2 2 3-4"/></svg>',
 phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="7" y="3" width="10" height="18" rx="2.5"/></svg>',
 pc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8"/></svg>',
 globe:'<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/></svg>'
};
const FONTS = {en:"", vi:"", ne:'"Noto Sans Devanagari","Noto Sans","IBM Plex Sans KR",system-ui,sans-serif', my:'"Noto Sans Myanmar","Noto Sans","IBM Plex Sans KR",system-ui,sans-serif', lo:'"Noto Sans Lao","Noto Sans","IBM Plex Sans KR",system-ui,sans-serif'};

const LANGS = JC.LANG_LIST.map(([c, n, k]) => [c, n, k, c === "en" || !!JC.LANGS[c]]);   // a language not yet in the app shows as 준비 중
const NL = LANGS.filter(l => l[3]).length;
let lang = LANGS.some(l => l[0] === S.lang && l[3]) ? S.lang : JC.LG;
const ua = navigator.userAgent || "";
const isIPad = /iPad/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
const REAL = isIPad ? "ipad" : /iPhone|iPod/.test(ua) ? "ios" : /Android/.test(ua) ? (/Mobile/.test(ua) ? "android" : "atab") : /Mac/.test(ua) ? "mac" : "pc";
const os = {phone: REAL === "android" ? "android" : "ios", pad: REAL === "atab" ? "atab" : "ipad", pc: REAL === "mac" ? "safari" : "chrome"};
const standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
let bip = null;   // Chrome/Edge/Android install prompt
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); bip = e; });

const t = () => T[lang];
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const kb = s => esc(s).replace(/\{(share|inst|dots)\}/g, (m, k) => '<span class="kbd">' + ICON[k] + '</span>');
const fmt = n => Number(n).toLocaleString("en-US");
const rep = () => String(S.rep || 2), rate = () => String(S.rate || 1), voice = () => S.sayLo !== false, theme = () => S.theme || "auto", fz = () => S.fz || 1;
function isDark(){ const th = theme(); if (th === "dark") return true; if (th === "light") return false; return !!(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches); }
function devOf(){ const w = window.innerWidth; return w < 700 ? "phone" : w < 1100 ? "pad" : "pc"; }

let lmenu = false;   // the 🌐 button at the top opens a language list too (RYU 2026-11-27)
function langPill(){ const L = LANGS.find(x => x[0] === lang);
  return `<div class="lpwrap"><button type="button" class="langpill" data-act="lmenu" aria-expanded="${lmenu}">${ICON.globe} ${esc(L[1])} <span aria-hidden="true">▾</span></button>${lmenu ? `<div class="lpmenu" role="menu">${LANGS.map(([c, n, k, ok]) => `<button type="button" role="menuitemradio" aria-checked="${c === lang}" class="${c === lang ? "on" : ""}" data-lang="${c}"${dis(ok)}><b>${c.toUpperCase()}</b><span>${esc(n)}<small>${k}${soon(ok)}</small></span></button>`).join("")}</div>` : ""}</div>`; }
function heroCopy(){ const x = t(); return `
  <div class="hello"><span class="star"></span>${esc(x.hello)}</div>
  <h1>${esc(x.h1)}</h1>
  <p class="lead">${esc(x.lead)}</p>
  <div class="stats"><div><b>${fmt(JC.nWords)}</b><span>${esc(x.st[0])}</span></div><div><b>${fmt(JC.nSents)}</b><span>${esc(x.st[1])}</span></div><div><b>${JC.nAreas}</b><span>${esc(x.st[2])}</span></div><div><b>${NL}</b><span>${esc(x.st[3])}</span></div></div>`; }
function brand(){ return `<div class="brand"><img src="icon-192.png" alt=""><div><b>JeyCampus</b><span>Korean for JJ Campus Life</span></div></div>`; }
function step(n, k, note){ const x = t(); return `<div class="sh"><span class="n">${n}</span><div><h2>${esc(x[k])} <span class="kosub">${KO[k]}</span></h2>${note ? `<p>${esc(x[note])}</p>` : ""}</div></div>`; }
const dis = ok => ok ? "" : " disabled";
const soon = ok => ok ? "" : '<span class="soon">준비 중</span>';
function langList(){ return `<div class="langs">${LANGS.map(([c, n, k, ok]) => `<button type="button" class="lopt${c === lang ? " on" : ""}" data-lang="${c}" aria-pressed="${c === lang}"${dis(ok)}><span class="code">${c.toUpperCase()}</span><span class="nm">${esc(n)}<small>${k}${soon(ok)}</small></span><span class="ck"></span></button>`).join("")}</div>`; }
function langChips(cls){ return `<div class="${cls}">${LANGS.map(([c, n, k, ok]) => `<button type="button" class="lchip${c === lang ? " on" : ""}" data-lang="${c}" aria-pressed="${c === lang}"${dis(ok)}><b>${c.toUpperCase()}</b>${esc(n)}</button>`).join("")}</div>`; }
function seg(name, opts, cur, cls){ return `<div class="seg${cls ? " " + cls : ""}" role="group">${opts.map(([v, l]) => `<button type="button" data-${name}="${v}" class="${String(v) === String(cur) ? "on" : ""}" aria-pressed="${String(v) === String(cur)}">${esc(l)}</button>`).join("")}</div>`; }
function pass(withLangs, withCta){ const x = t();
  return `<div class="pass">
  <div class="passhead"><span class="ph"><img src="img/jey/jey.webp" alt=""></span><div><div class="pt">JEY PASS</div><div class="pn">${esc(x.pass)}</div></div><div class="pid">JJU · ${lang.toUpperCase()}<br>${new Date().getFullYear()}</div></div>
  ${withLangs ? langChips("lgrid") : ""}
  <div class="passbody">
   <div class="row"><div class="lab">${esc(x.rep)}<small>${KO.rep}</small></div>${seg("rep", [1,2,3,4,5].map(n => [n, n + "×"]), rep())}</div>
   <div class="row full"><div class="rate"><div class="lab">${esc(x.spd)}<small>${KO.spd}</small></div><input type="range" min="0.7" max="2" step="0.1" value="${rate()}" data-rate aria-label="${esc(x.spd)}"><output>×${(+rate()).toFixed(1)}</output></div>
     <div class="ticks"><span>0.7</span><span>1.0</span><span>1.5</span><span>2.0</span></div></div>
   <div class="row"><div class="lab">${esc(x.voice)}<small>${KO.voice} · ${esc(x.voiceN)}</small></div><button type="button" class="sw${voice() ? " on" : ""}" data-voice role="switch" aria-checked="${voice()}" aria-label="${esc(x.voice)}"></button></div>
   <div class="row"><div class="lab">${esc(x.theme)}<small>${KO.theme}</small></div>${seg("theme", [["auto", x.th[0]], ["light", x.th[1]], ["dark", x.th[2]]], theme(), "txt")}</div>
   <div class="row"><div class="lab">${esc(x.fz)}<small>${KO.fz}</small></div>${seg("fz", [[0.9, "A−"], [1, "A"], [1.15, "A+"], [1.3, "A++"]], fz())}</div>
   <div class="sample"><button type="button" class="play" data-act="sample" aria-label="${esc(x.listen)}">${ICON.play}</button><div><div class="s1">${SAMPLE_KO}</div><div class="s2">${esc(sampleM())}</div></div><div class="s3">${rep()}× · ×${(+rate()).toFixed(1)}<br>${esc(x.listen)}</div></div>
  </div>
  ${withCta ? `<div class="passcta">${cta()}</div>` : ""}
  <div class="passfoot"><span>${esc(x.s2n)}</span><span class="barcode" aria-hidden="true"></span></div>
 </div>`; }
function menus(){ const x = t(); const tile = (m, i) => `<button type="button" class="mt${i >= LEARN ? " live" : ""}" data-area="${m[0]}"><span class="g"${m[1].length > 3 ? ' style="font-size:.58em"' : ""}>${m[1]}</span><span class="t"><b>${esc(x.mn[m[0]])}</b><small>${m[2]}</small></span></button>`;
  return `<div class="menus"><div class="mgl">${esc(x.learn)}</div>${MENUS.slice(0, LEARN).map(tile).join("")}<div class="mgl">${esc(x.live)}</div>${MENUS.slice(LEARN).map((m, i) => tile(m, i + LEARN)).join("")}</div>`; }
function osTabs(dev){ const o = dev === "phone" ? [["ios","iPhone"],["android","Android"]] : dev === "pad" ? [["ipad","iPad"],["atab","Android"]] : [["chrome","Chrome · Edge"],["safari","Mac Safari"]];
  return `<div class="otabs" role="group" aria-label="${esc(t().other)}">${o.map(([k, l]) => `<button type="button" data-os="${dev}:${k}" class="${os[dev] === k ? "on" : ""}">${l}</button>`).join("")}</div>`; }
function steps(dev){ const x = t(), k = os[dev] === "atab" ? "android" : os[dev]; return `<ol class="steps">${x.steps[k].map(s => `<li><span>${kb(s)}</span></li>`).join("")}</ol>`; }
function detectChip(dev){ const x = t(); const name = {phone:{ios:"iPhone · Safari",android:"Android · Chrome"},pad:{ipad:"iPad · Safari",atab:"Android tablet"},pc:{chrome:"PC · Chrome/Edge",safari:"Mac · Safari"}}[dev][os[dev]];
  return `<span class="detect"><i>${dev === "pc" ? ICON.pc : ICON.phone}</i>${esc(x.det)}: <b>${name}</b></span>`; }
function downloads(dev){ const x = t(), ios = (dev === "phone" && os.phone === "ios") || (dev === "pad" && os.pad === "ipad") || (dev === "pc" && os.pc === "safari");
  const poster = {en:1, vi:1, ne:1, my:1, lo:1}[lang] ? lang : "en", hasAudio = !!document.getElementById("dlAll") && !document.getElementById("dlbox").hidden;
  return `<div class="dls">
   <div class="dl"><span class="ic"><img src="icon-192.png" alt=""></span><span class="tx"><b>${esc(x.dla)}</b><small>${esc(x.dlad)}</small></span>${standalone ? '<span class="go y">✓</span>' : `<button type="button" class="go y" data-act="${ios ? "how" : "install"}">${esc(ios ? x.seehow : x.inst)}</button>`}</div>
   ${hasAudio ? `<div class="dl"><span class="ic">${ICON.audio}</span><span class="tx"><b>${esc(x.dlv)}</b><small>${esc(x.dlvd.replace("{L}", x.vname))}</small><small class="dlmsg" data-dlmsg></small></span><button type="button" class="go" data-act="audio">${esc(x.save)}</button></div>` : ""}
   <div class="dl"><span class="ic">${ICON.img}</span><span class="tx"><b>${esc(x.dlp)}</b><small>${esc(x.dlpd)}</small></span><a class="go" href="img/help/poster-${poster}.webp" download="JeyCampus-poster-${poster}.webp">${esc(x.dl)}</a></div>
  </div>`; }
function addr(){ return `<div class="addr">${URL_APP}<button type="button" data-act="copy">${esc(t().copy)}</button></div>`; }
function foot(){ return `<div class="foot"><img src="img/jju/${isDark() ? "logo_ko_d" : "logo_ko_t"}.png" alt="전주대학교 Jeonju University"><div>${esc(t().foot)}</div><div>${URL_APP} · ${esc(JC.ver)}</div></div>`; }
function cta(){ return `<button type="button" class="btn pri" data-act="start">${esc(t().start)} ${ICON.arrow}</button>`; }

function phone(){ const x = t(); return `
 <div class="hero"><img class="bg" src="img/jb/jju_blossom_jey.jpg" alt="">
  <div class="top">${brand()}${langPill()}</div>
  <div class="copy">${heroCopy()}</div></div>
 <div class="sec">${step(1, "s1", "s1n")}${langChips("lchips")}</div>
 <div class="sec">${step(2, "s2")}${pass(false)}</div>
 <div class="sec"><div class="sh"><div><h2>${esc(x.inside)} <span class="kosub">${KO.inside}</span></h2></div></div>${menus()}</div>
 <div class="inst"><img class="bg" src="img/jb/jju_stargarden_night.jpg" alt="">
  ${detectChip("phone")}<h2>${esc(x.it)}</h2><p style="margin:0;opacity:.85;font-size:.88em">${esc(x.itn)}</p>
  ${osTabs("phone")}${steps("phone")}${downloads("phone")}${addr()}</div>
 ${foot()}
 <div class="sticky">${cta()}</div>`; }
function pad(){ const x = t(); return `
 <div class="hero"><img class="bg" src="img/jb/jju_jey_rapeseed.jpg" alt="">
  <div class="top">${brand()}${langPill()}</div>
  <div class="copy">${heroCopy()}</div></div>
 <div class="wrap">
  <div class="duo">
   <div class="lcard">${step(1, "s1", "s1n")}${langList()}</div>
   ${pass(false)}
  </div>
  <div class="ctarow" style="margin-top:-8px"><button type="button" class="btn sec" data-act="how">${esc(x.how)}</button>${cta()}</div>
  <div style="display:grid;gap:12px"><h2 style="font-size:1.25em">${esc(x.inside)} <span class="kosub">${KO.inside}</span></h2>${menus()}</div>
 </div>
 <div class="inst"><img class="bg" src="img/jb/jju_stargarden_night.jpg" alt="">
  <div style="display:grid;gap:14px;align-content:start">${detectChip("pad")}<h2 style="font-size:1.4em">${esc(x.it)}</h2><p style="margin:0;opacity:.85;font-size:.9em">${esc(x.itn)}</p>${osTabs("pad")}${steps("pad")}</div>
  <div style="display:grid;gap:12px;align-content:start"><h3 style="font-size:1em;opacity:.9">${esc(x.dlt)}</h3>${downloads("pad")}${addr()}</div>
 </div>
 <div class="frow">${foot()}<img src="img/jey/friends.webp" alt="" style="width:190px;height:auto"></div>`; }
function pc(){ const x = t(); return `
 <div class="hero"><img class="bg" src="img/jb/jju_aerial.jpg" alt="">
  <div class="nav">${brand()}${["K2","TP","K4","HP"].map(a => `<a href="#" data-area="${a}">${esc(x.mn[a])}</a>`).join("")}${langPill()}${cta()}</div>
  <div class="hgrid">
   <div class="copy">${heroCopy()}<div class="cta">${cta()}<button type="button" class="btn ghost" data-act="how">${esc(x.how)}</button></div></div>
   <div class="passwrap"><img class="jeyp" src="img/jey/jey.webp" alt="">${pass(true, true)}</div>
  </div></div>
 <div class="band">
  <div style="display:grid;gap:12px;align-content:start"><div class="eyebrow">JeyCampus</div><h2>${esc(x.inside)}</h2><span class="kosub">${KO.inside}</span><p style="margin:0;color:var(--mm);font-size:.92em">${esc(x.s1n)}</p></div>
  <div>${menus()}<div class="gal"><img src="img/jb/jju_starcenter_wide.jpg" alt="스타센터"><img src="img/jb/jju_library.jpg" alt="도서관"><img src="img/jb/jju_spring.jpg" alt="봄 캠퍼스"></div></div>
 </div>
 <div class="inst"><img class="bg" src="img/jb/jju_stargarden_night.jpg" alt="">
  <div style="display:grid;gap:14px;align-content:start">${detectChip("pc")}<h2 style="font-size:1.5em">${esc(x.it)}</h2><p style="margin:0;opacity:.85;font-size:.92em">${esc(x.itn)}</p>${osTabs("pc")}${steps("pc")}</div>
  <div style="display:grid;gap:12px;align-content:start;justify-items:start"><h3 style="font-size:1em">${esc(x.qr)}</h3><div class="qrbox"><img src="img/jju/qr.png" alt="QR ${URL_APP}"></div><p style="margin:0;opacity:.85;font-size:.85em">${esc(x.qrd)}</p>${addr()}</div>
  <div style="display:grid;gap:12px;align-content:start"><h3 style="font-size:1em;opacity:.9">${esc(x.dlt)}</h3>${downloads("pc")}</div>
 </div>
 <div class="frow">${foot()}<img src="img/jey/friends.webp" alt="" style="width:220px;height:auto"></div>`; }

/* ---- show, redraw, close ---- */
let box = null, curDev = null;
function render(){
  if (!box) return;
  const d = devOf(), y = box.scrollTop;
  box.className = "m notr " + (d === "phone" ? "P" : d === "pad" ? "T" : "D") + (isDark() ? " dk" : "");   // notr: the app's label swapper leaves the intro alone (it has its own texts; it turned "English" into the app language)
  box.setAttribute("data-l", lang); box.lang = lang;
  box.style.setProperty("--fz", fz());
  if (FONTS[lang]){ box.style.setProperty("--tf", FONTS[lang]); box.style.setProperty("--tf2", FONTS[lang]); } else { box.style.removeProperty("--tf"); box.style.removeProperty("--tf2"); }
  box.innerHTML = '<div class="wrapin">' + (d === "phone" ? phone() : d === "pad" ? pad() : pc()) + "</div>";
  box.scrollTop = d === curDev ? y : 0; curDev = d;
  mirrorDl();
}
function open(){
  if (box) return;
  box = document.createElement("div"); box.id = "intro"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "JeyCampus");
  document.body.appendChild(box); document.documentElement.classList.add("introon");
  render();
  try { sessionStorage.setItem("jc-intro", "open"); } catch (e) {}   // a refresh keeps the intro (RYU 2026-11-27)
}
function close(){
  stopSample();
  try { sessionStorage.setItem("jc-intro", "closed"); } catch (e) {}   // a refresh keeps the main screen
  if (!S.lang){ S.lang = lang; JC.save(); }
  if (lang !== JC.LG){ S.lang = lang; JC.save(); location.reload(); return; }   // the app loads a language's texts at start
  if (box){ box.remove(); box = null; } document.documentElement.classList.remove("introon");
}
let rT = 0;
window.addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(() => { if (box && devOf() !== curDev) render(); }, 150); });
if (window.matchMedia) { const mq = matchMedia("(prefers-color-scheme: dark)"); if (mq.addEventListener) mq.addEventListener("change", () => { if (box && theme() === "auto") render(); }); }

function setRep(v){ S.rep = String(v); JC.save(); const e = document.getElementById("repSel"); if (e) e.value = S.rep; }
function setRate(v){ S.rate = String(v); JC.save(); const e = document.getElementById("rateSel"); if (e) e.value = S.rate; }

/* sample: a real lesson sentence (K2-A-01) played with the app's own recorded voices, so speed 1.0 is the normal speed for both
   Korean and the meaning (RYU 2026-11-27: the phone's voices ran at different speeds). The meaning voice is the app's language;
   when the intro shows another language (not loaded until Start), the device's voice reads it. */
const SAMPLE_KO = "웃으면서 인사해요.";
const SAMPLE_M = {en: "I say hello with a smile.", vi: "Tôi mỉm cười chào.", ne: "म मुस्कुराउँदै अभिवादन गर्छु।", my: "ပြုံးပြီး နှုတ်ဆက်ပါတယ်။", lo: "ທັກທາຍດ້ວຍຮອຍຍິ້ມ."};
const sampleM = () => SAMPLE_M[lang] || t().sample;
let playing = false;
function stopSample(){ if (playing){ playing = false; try { JC.quiet(); } catch (e) {} try { speechSynthesis.cancel(); } catch (e) {} } }
function speak(text, l){ return new Promise(res => { try { const u = new SpeechSynthesisUtterance(text); u.lang = l; u.rate = +rate() || 1; u.onend = res; u.onerror = res; speechSynthesis.speak(u); setTimeout(res, 2500 + text.length * 300); } catch (e) { res(); } }); }
async function sample(){
  if (playing){ stopSample(); return; }
  playing = true; const n = +rep() || 1, VL = {en:"en-US", vi:"vi-VN", ne:"ne-NP", my:"my-MM", lo:"lo-LA"};
  for (let i = 0; i < n && playing; i++){
    await JC.speak(SAMPLE_KO, false);
    if (i === 0 && voice() && playing) await (lang === JC.LG ? JC.speak(sampleM(), true) : speak(sampleM(), VL[lang]));
    if (playing) await new Promise(r => setTimeout(r, 350));
  }
  playing = false;
}
function toast(msg){ if (!box) return; const el = document.createElement("div"); el.className = "toast"; el.textContent = msg; el.style.position = "fixed"; el.style.bottom = "calc(96px + env(safe-area-inset-bottom,0px))"; box.appendChild(el); setTimeout(() => el.remove(), 2200); }
/* the app's own "save all audio" button does the work; its progress text is copied here */
function mirrorDl(){ const src = document.getElementById("dlMsg"), dst = box && box.querySelector("[data-dlmsg]"); if (src && dst) dst.textContent = src.textContent; }
{ const src = document.getElementById("dlMsg"); if (src && window.MutationObserver) new MutationObserver(mirrorDl).observe(src, {childList: true, characterData: true, subtree: true}); }
function goArea(a){ const b = document.querySelector('[data-g="' + a + '"]'); close(); if (b && lang === JC.LG) b.click(); }

document.addEventListener("click", ev => {
  if (!box || !box.contains(ev.target)) return;
  const b = ev.target.closest("button,a");
  if (lmenu && (!b || !b.closest(".lpwrap"))){ lmenu = false; render(); if (!b) return; }
  if (!b || b.disabled) return;
  if (b.dataset.act === "lmenu"){ lmenu = !lmenu; render(); return; }
  if (b.dataset.lang){ lmenu = false; lang = b.dataset.lang; S.lang = lang; JC.save(); render(); return; }
  if (b.dataset.rep){ setRep(b.dataset.rep); render(); return; }
  if (b.dataset.theme){ S.theme = b.dataset.theme; JC.save(); JC.applyPrefs(); render(); return; }
  if (b.dataset.fz){ S.fz = +b.dataset.fz; JC.save(); JC.applyPrefs(); render(); return; }
  if (b.hasAttribute("data-voice")){ JC.setSayLo(!voice()); render(); return; }
  if (b.dataset.os){ const [d, k] = b.dataset.os.split(":"); os[d] = k; render(); return; }
  if (b.dataset.area){ ev.preventDefault(); goArea(b.dataset.area); return; }
  const a = b.dataset.act; if (!a) return;
  ev.preventDefault();
  if (a === "start") close();
  else if (a === "sample") sample();
  else if (a === "copy"){ const done = () => toast(t().copied); try { navigator.clipboard.writeText("https://" + URL_APP).then(done, done); } catch (e) { done(); } }
  else if (a === "install"){ if (bip){ bip.prompt(); bip.userChoice.then(() => { bip = null; }, () => {}); } else { const el = box.querySelector(".steps"); if (el) el.scrollIntoView({behavior: "smooth", block: "center"}); } }
  else if (a === "audio"){ const d = document.getElementById("dlAll"); if (d) d.click(); }
  else if (a === "how"){ const el = box.querySelector(".steps"); if (el) el.scrollIntoView({behavior: "smooth", block: "center"}); }
});
document.addEventListener("input", ev => { if (box && ev.target.matches("#intro [data-rate]")){ const v = (+ev.target.value).toFixed(1).replace(/\.0$/, ""); setRate(v); const o = ev.target.parentNode.querySelector("output"); if (o) o.textContent = "×" + (+v).toFixed(1); } });
document.addEventListener("change", ev => { if (box && ev.target.matches("#intro [data-rate]")) render(); });
document.addEventListener("keydown", ev => { if (box && ev.key === "Escape"){ if (lmenu){ lmenu = false; render(); } else close(); } }, true);

/* a way back: a button under the theme row */
{ const pf = document.getElementById("prefs"); if (pf){ const p = document.createElement("p"); p.className = "langline";
  const b = document.createElement("button"); b.type = "button"; b.className = "pb"; b.innerHTML = '<img src="icon-192.png" alt="" style="width:18px;height:18px;border-radius:5px;vertical-align:-4px"> JeyCampus <span class="ko">첫 화면</span>';
  b.addEventListener("click", open); p.appendChild(b); (pf.nextElementSibling && pf.nextElementSibling.classList.contains("langline") ? pf.nextElementSibling : pf).after(p); } }

/* open: no lesson link in the address, and not yet shown in this visit */
/* refresh keeps whichever screen was showing: the intro stays open until Start is pressed */
let st = null; try { st = sessionStorage.getItem("jc-intro"); } catch (e) {}
if (st === "open" || (location.hash.length <= 1 && st !== "closed")) open();
window.JC.intro = open;
})();
