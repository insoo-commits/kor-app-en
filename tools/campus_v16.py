#!/usr/bin/env python3
"""v1.15 (RYU 2026-11-25): Jeonju University rules for English-track students, from the
2026-2 수강 편람 (course handbook) RYU sent. Three new 대학 생활 lessons:
  K4-D-05 수강 정정과 취소, K4-E-05 영어 트랙 이수 기준, K4-G-03 학사 경고와 추가 시험.
Run once from the repository root: python3 tools/campus_v16.py && node build.js
Text format as in campus_v15.py."""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from campus_v15 import D, word, dline, lesson, ORDER

NEW = [
lesson("K4-D-05", "수강 정정과 취소", 2, "낱말",
 ["수강 신청을 한 뒤 과목을 바꾸거나 취소할 때 쓰는 말입니다. 전주대 수강 편람을 바탕으로 했습니다.",
  "Words for changing or dropping courses after registration, based on Jeonju University's course handbook."],
 [word("수강바구니 | sugangbaguni | course cart (saved list before registration)", [
   "수강바구니에 과목을 담았어요. | sugangbaguni-e gwamogeul damasseoyo | I put courses in my course cart. | 과목=gwamok=course ; 담다=damtta=to put in",
   "수강바구니는 수강 신청 전에 열려요. | sugangbaguni-neun sugang sincheong jeone yeollyeoyo | The course cart opens before registration. | 전에=jeone=before ; 열리다=yeollida=to open",
   "바구니에 담아도 신청이 됐는지 꼭 확인하세요. | baguni-e damado sincheongi dwaenneunji kkok hwaginhaseyo | Even if a course is in the cart, be sure to check that you are registered. | 꼭=kkok=be sure to ; 확인하다=hwaginhada=to check"],
   "미리 담아 두는 과목 목록"),
  word("수강 정정 | sugang jeongjeong | add/drop (changing courses)", [
   "수강 정정 기간에 과목을 바꿨어요. | sugang jeongjeong gigane gwamogeul bakkwosseoyo | I changed a course during the add/drop period. | 기간=gigan=period ; 바꾸다=bakkuda=to change",
   "수강 정정은 개강 첫 주에 해요. | sugang jeongjeongeun gaegang cheot jue haeyo | Add/drop is in the first week of the semester. | 개강=gaegang=start of the semester ; 첫 주=cheot ju=first week",
   "정정 기간에는 새 과목을 더 신청할 수 있어요. | jeongjeong giganeneun sae gwamogeul deo sincheonghal su isseoyo | During add/drop you can sign up for more courses. | 새=sae=new ; 더=deo=more"],
   "신청한 과목을 바꾸는 것"),
  word("폐강 | pyegang | course cancellation", [
   "이 과목은 폐강됐어요. | i gwamogeun pyegangdwaesseoyo | This course has been cancelled. | 과목=gwamok=course",
   "신청한 학생이 적으면 폐강돼요. | sincheonghan haksaengi jeogeumyeon pyegangdwaeyo | If few students sign up, the course is cancelled. | 학생=haksaeng=student ; 적다=jeokda=to be few",
   "폐강 과목은 학교 홈페이지 공지에 올라와요. | pyegang gwamogeun hakkyo hompeiji gongjie ollawayo | Cancelled courses are posted in the notices on the school website. | 홈페이지=hompeiji=website ; 공지=gongji=notice"],
   "사람이 적어서 수업이 없어짐"),
  word("수강 취소 | sugang chwiso | dropping a course", [
   "한 과목을 수강 취소했어요. | han gwamogeul sugang chwisohaesseoyo | I dropped one course. | 한=han=one",
   "수강 취소는 인스타에서 해요. | sugang chwisoneun inseutaeseo haeyo | You drop a course on inSTAR. | 인스타=inseuta=inSTAR (student portal)",
   "취소한 과목은 다시 신청할 수 없어요. | chwisohan gwamogeun dasi sincheonghal su eopseoyo | You can't sign up again for a course you dropped. | 다시=dasi=again"],
   "듣던 과목을 그만두는 것"),
  word("최저 학점 | choejeo hakjeom | minimum credits", [
   "최저 학점은 십이 학점이에요. | choejeo hakjeomeun sibi hakjeomieyo | The minimum is 12 credits. | 학점=hakjeom=credit",
   "최저 학점보다 적게 들으면 안 돼요. | choejeo hakjeomboda jeokge deureumyeon an dwaeyo | You must not take fewer than the minimum credits. | 적게=jeokge=fewer ; 안 되다=an doeda=must not",
   "사 학년은 최저 학점 제한이 없어요. | sa hangnyeoneun choejeo hakjeom jehani eopseoyo | Fourth-year students have no minimum credit limit. | 학년=hangnyeon=school year ; 제한=jehan=limit"],
   "꼭 들어야 하는 가장 적은 학점"),
  word("최대 학점 | choedae hakjeom | maximum credits", [
   "이번 학기 최대 학점이 몇 학점이에요? | ibeon hakki choedae hakjeomi myeot hakjeomieyo? | What's my maximum number of credits this semester? | 이번 학기=ibeon hakki=this semester ; 몇=myeot=how many",
   "최대 학점은 지난 학기 성적에 따라 달라요. | choedae hakjeomeun jinan hakki seongjeoge ttara dallayo | The maximum depends on last semester's grades. | 성적=seongjeok=grades ; -에 따라=-e ttara=depending on ; 다르다=dareuda=to differ",
   "수강 신청 화면에서 최대 학점을 확인하세요. | sugang sincheong hwamyeoneseo choedae hakjeomeul hwaginhaseyo | Check your maximum on the registration screen. | 화면=hwamyeon=screen ; 확인하다=hwaginhada=to check"],
   "들을 수 있는 가장 많은 학점")],
 [dline("아나", "민수 씨, 제가 신청한 과목이 폐강됐어요. | minsu ssi, jega sincheonghan gwamogi pyegangdwaesseoyo | Minsu, a course I signed up for was cancelled. | 신청하다=sincheonghada=to sign up ; 폐강되다=pyegangdoeda=to be cancelled (course)"),
  dline("민수", "걱정하지 마세요. 정정 기간에 다른 과목을 신청하면 돼요. | geokjeonghaji maseyo jeongjeong gigane dareun gwamogeul sincheonghamyeon dwaeyo | Don't worry. You can sign up for another course in the add/drop period. | 걱정하다=geokjeonghada=to worry ; 다른=dareun=other"),
  dline("아나", "정정은 어디에서 해요? | jeongjeongeun eodieseo haeyo? | Where do I make changes? | 어디=eodi=where"),
  dline("민수", "수강 신청 사이트에서 해요. 취소는 인스타에서 하고요. | sugang sincheong sa-iteueseo haeyo chwisoneun inseutaeseo hagoyo | On the registration site. Dropping is done on inSTAR. | 사이트=sa-iteu=website ; 인스타=inseuta=inSTAR"),
  dline("아나", "취소하고 나중에 다시 신청할 수도 있어요? | chwisohago najunge dasi sincheonghal sudo isseoyo? | Can I drop it and sign up again later? | 나중에=najunge=later ; 다시=dasi=again"),
  dline("민수", "아니요, 취소한 과목은 다시 못 들어요. 잘 생각하고 취소하세요. | aniyo, chwisohan gwamogeun dasi mot deureoyo jal saenggakago chwisohaseyo | No, you can't take a dropped course again. Think carefully before you drop. | 못=mot=can't ; 생각하다=saenggakada=to think")],
 [["수강 정정은 어디에서 해요?", "수강 신청 사이트"], ["수강 취소한 과목을 다시 신청할 수 있어요?", "아니요"], ['"course cancellation"을 한국어로?', "폐강"]],
 [["전주대 수강 신청과 정정은 수강 신청 사이트(sugang.jj.ac.kr)에서, 수강 취소는 학생 포털 inSTAR(instar.jj.ac.kr)에서 합니다.",
   "At Jeonju University you register and make changes on the registration site (sugang.jj.ac.kr), and you drop courses on the student portal inSTAR (instar.jj.ac.kr)."],
  ["외국인 유학생은 다른 학생보다 일주일쯤 먼저 수강 신청을 합니다. 날짜는 학기마다 학사 일정에서 꼭 확인하세요.",
   "International students register about a week before other students. Always check the dates in the academic calendar each semester."],
  ["수강 취소는 한 학기에 6학점까지만 할 수 있고, 취소한 뒤에는 되돌리거나 다른 과목으로 바꿀 수 없습니다.",
   "You can drop up to 6 credits a semester. A drop can't be undone or swapped for another course."]]),

lesson("K4-E-05", "영어 트랙 이수 기준", 2, "낱말",
 ["영어 트랙 학생이 졸업하려면 무엇을 들어야 하는지 알아보는 말입니다. 전주대 수강 편람을 바탕으로 했습니다.",
  "Words for what English-track students must take to graduate, based on Jeonju University's course handbook."],
 [word("졸업 학점 | joreop hakjeom | credits needed to graduate", [
   "졸업 학점은 백십 학점이에요. | joreop hakjeomeun baeksip hakjeomieyo | You need 110 credits to graduate. | 졸업=joreop=graduation ; 학점=hakjeom=credit",
   "졸업 학점을 다 채웠어요. | joreop hakjeomeul da chaewosseoyo | I've earned all the credits I need to graduate. | 다=da=all ; 채우다=chaeuda=to fill",
   "졸업 학점이 모자라면 한 학기 더 다녀야 해요. | joreop hakjeomi mojaramyeon han hakki deo danyeoya haeyo | If you're short of credits, you have to attend one more semester. | 모자라다=mojarada=to be short ; 다니다=danida=to attend"],
   "졸업하려면 받아야 하는 학점"),
  word("이수하다 | isuhada | to complete (a course)", [
   "한국어 과목을 네 개 이수해야 해요. | han-gugeo gwamogeul ne gae isuhaeya haeyo | I have to complete four Korean courses. | 과목=gwamok=course ; 네 개=ne gae=four (things)",
   "이 과목은 지난 학기에 이수했어요. | i gwamogeun jinan hakkie isuhaesseoyo | I completed this course last semester. | 지난 학기=jinan hakki=last semester",
   "필수 과목을 모두 이수해야 졸업할 수 있어요. | pilsu gwamogeul modu isuhaeya joreopal su isseoyo | You can graduate only after completing all required courses. | 필수=pilsu=required ; 모두=modu=all"],
   "과목을 다 듣고 학점을 받다"),
  word("전공 필수 | jeon-gong pilsu | required major course", [
   "이 과목은 전공 필수예요. | i gwamogeun jeon-gong pilsuyeyo | This is a required major course. | 과목=gwamok=course",
   "전공 필수는 꼭 들어야 해요. | jeon-gong pilsuneun kkok deureoya haeyo | You must take the required major courses. | 꼭=kkok=surely",
   "전공 선택 과목은 내가 골라서 들어요. | jeon-gong seontaek gwamogeun naega gollaseo deureoyo | I choose my major electives myself. | 전공 선택=jeon-gong seontaek=major elective ; 고르다=goreuda=to choose"],
   "전공에서 꼭 들어야 하는 과목"),
  word("진로지도세미나 | jillo jido semina | career guidance seminar", [
   "이번 학기에도 진로지도세미나를 신청했어요. | ibeon hakkiedo jillo jido seminareul sincheonghaesseoyo | I signed up for the career guidance seminar this semester too. | 이번 학기=ibeon hakki=this semester ; 신청하다=sincheonghada=to sign up",
   "영어 트랙 학생은 진로지도세미나를 육 학점 들어야 해요. | yeongeo teuraek haksaengeun jillo jido seminareul yuk hakjeom deureoya haeyo | English-track students must take 6 credits of career guidance seminar. | 영어 트랙=yeongeo teuraek=English track ; 육=yuk=six",
   "진로지도세미나에서 취업 이야기를 들었어요. | jillo jido seminaeseo chwieop iyagireul deureosseoyo | I heard about getting a job in the career seminar. | 취업=chwieop=getting a job ; 이야기=iyagi=talk"],
   "진로를 함께 생각하는 수업"),
  word("원격 수업 | wongyeok su-eop | online (distance) class", [
   "이 과목은 원격 수업이에요. | i gwamogeun wongyeok su-eobieyo | This course is an online class. | 과목=gwamok=course",
   "원격 수업은 한 학기에 육 학점까지 들을 수 있어요. | wongyeok su-eobeun han hakkie yuk hakjeomkkaji deureul su isseoyo | You can take up to 6 credits of online classes a semester. | 학기=hakki=semester ; -까지=-kkaji=up to",
   "원격 수업도 정해진 날까지 강의를 들어야 해요. | wongyeok su-eopto jeonghaejin nalkkaji gang-uireul deureoya haeyo | For online classes too, you must watch the lectures by the set date. | 정해지다=jeonghaejida=to be set ; 강의=gang-ui=lecture"],
   "온라인으로 듣는 수업"),
  word("현장 실습 | hyeonjang silseup | internship (field training)", [
   "방학에 현장 실습을 했어요. | banghage hyeonjang silseubeul haesseoyo | I did an internship during the vacation. | 방학=banghak=vacation",
   "현장 실습도 학점을 받을 수 있어요. | hyeonjang silseupto hakjeomeul badeul su isseoyo | You can get credits for an internship too. | 학점=hakjeom=credit ; 받다=batta=to get",
   "호텔에서 한 학기 동안 현장 실습을 하고 싶어요. | hoteleseo han hakki dongan hyeonjang silseubeul hago sipeoyo | I want to do a semester-long internship at a hotel. | 호텔=hotel=hotel ; 동안=dongan=for (a period)"],
   "회사에서 일하며 배우는 수업")],
 [dline("아나", "조교님, 졸업하려면 몇 학점이 필요해요? | jogyonim, joreoparyeomyeon myeot hakjeomi piryohaeyo? | Excuse me, how many credits do I need to graduate? | 조교=jogyo=department assistant ; 필요하다=piryohada=to be needed"),
  dline("조교", "영어 트랙은 백십 학점이에요. | yeongeo teuraegeun baeksip hakjeomieyo | For the English track it's 110 credits. | 영어 트랙=yeongeo teuraek=English track"),
  dline("아나", "한국어 수업도 꼭 들어야 해요? | han-gugeo su-eopto kkok deureoya haeyo? | Do I have to take Korean classes too? | 꼭=kkok=surely"),
  dline("조교", "네, 한국어 과목을 네 개 이수해야 해요. 진로지도세미나도 육 학점 들어야 하고요. | ne, han-gugeo gwamogeul ne gae isuhaeya haeyo jillo jido seminado yuk hakjeom deureoya hagoyo | Yes, you must complete four Korean courses. You also need 6 credits of career guidance seminar. | 이수하다=isuhada=to complete (a course)"),
  dline("아나", "원격 수업도 졸업 학점에 들어가요? | wongyeok su-eopto joreop hakjeome deureogayo? | Do online classes count toward graduation credits? | 원격 수업=wongyeok su-eop=online class ; 들어가다=deureogada=to go into"),
  dline("조교", "네, 그런데 한 학기에 육 학점까지만 들을 수 있어요. | ne, geureonde han hakkie yuk hakjeomkkajiman deureul su isseoyo | Yes, but you can take only up to 6 credits a semester. | 그런데=geureonde=but ; -까지만=-kkajiman=only up to")],
 [["영어 트랙 졸업 학점은?", "백십 학점 (110)"], ["원격 수업은 한 학기에 몇 학점까지?", "육 학점 (6)"], ['"internship"을 한국어로?', "현장 실습"]],
 [["영어 트랙(영어영문, 경영, 호텔경영, 관광경영, 예술심리치료학과)과 국제학부는 졸업 학점이 110학점이고, 졸업 학점의 50% 이상을 영어로 하는 수업으로 듣습니다.",
   "The English track (English, Business, Hotel Management, Tourism Management and Art Therapy) and the School of International Studies need 110 credits to graduate, and at least half of them are courses taught in English."],
  ["한국어 과목은 2025학번부터(국제학부는 2026학번부터) 4과목 12학점, 그 전 학번은 2과목 6학점을 이수합니다. 내 학번의 기준은 학과 사무실에서 확인하세요.",
   "Korean courses: from the 2025 intake (International Studies from 2026) 4 courses, 12 credits; earlier intakes 2 courses, 6 credits. Check the rules for your own year at your department office."],
  ["교양 과목은 모두 합쳐 50학점까지만 들을 수 있고, 현장 실습은 재학 중 28학점까지 받을 수 있습니다.",
   "General education courses are limited to 50 credits in total, and internships to 28 credits during your studies."]]),

lesson("K4-G-03", "학사 경고와 추가 시험", 2, "낱말",
 ["출석, 시험, 성적과 관련된 학교 규칙을 말할 때 쓰는 말입니다. 전주대 수강 편람을 바탕으로 했습니다.",
  "Words for the school's rules on attendance, exams and grades, based on Jeonju University's course handbook."],
 [word("학사 경고 | haksa gyeonggo | academic warning (probation)", [
   "학사 경고를 받았어요. | haksa gyeonggoreul badasseoyo | I got an academic warning. | 받다=batta=to get",
   "평점이 일 점 오보다 낮으면 학사 경고를 받아요. | pyeongjeomi il jeom oboda najeumyeon haksa gyeonggoreul badayo | If your GPA is below 1.5, you get an academic warning. | 평점=pyeongjeom=GPA ; 낮다=natta=to be low",
   "학사 경고를 받으면 다음 학기에 십오 학점까지만 들을 수 있어요. | haksa gyeonggoreul badeumyeon da-eum hakkie sibo hakjeomkkajiman deureul su isseoyo | With an academic warning, you can take only up to 15 credits next semester. | 다음 학기=da-eum hakki=next semester ; -까지만=-kkajiman=only up to"],
   "성적이 너무 낮을 때 받는 경고"),
  word("출석률 | chulseongnyul | attendance rate", [
   "출석률이 중요해요. | chulseongnyuri jungyohaeyo | Your attendance rate is important. | 중요하다=jungyohada=to be important",
   "출석률이 낮으면 시험을 볼 수 없어요. | chulseongnyuri najeumyeon siheomeul bol su eopseoyo | If your attendance rate is low, you can't take the exam. | 낮다=natta=to be low ; 시험을 보다=siheomeul boda=to take an exam",
   "출석률은 전자 출결로 자동으로 계산돼요. | chulseongnyureun jeonja chulgyeollo jadongeuro gyesandwaeyo | Attendance is calculated automatically by the electronic attendance system. | 전자 출결=jeonja chulgyeol=electronic attendance ; 자동으로=jadongeuro=automatically ; 계산되다=gyesandoeda=to be calculated"],
   "수업에 나온 비율"),
  word("추가 시험 | chuga siheom | make-up exam", [
   "아파서 추가 시험을 봤어요. | apaseo chuga siheomeul bwasseoyo | I was sick, so I took a make-up exam. | 아프다=apeuda=to be sick",
   "추가 시험은 입원했거나 가족이 돌아가셨을 때 볼 수 있어요. | chuga siheomeun ibwonhaetkkeona gajogi doragasyeosseul ttae bol su isseoyo | You can take a make-up exam if you were in hospital or a family member died. | 입원하다=ibwonhada=to be hospitalized ; 가족=gajok=family ; 돌아가시다=doragasida=to pass away (honorific)",
   "추가 시험은 시험이 끝나고 사흘 안에 신청해야 해요. | chuga siheomeun siheomi kkeunnago saheul ane sincheonghaeya haeyo | You must apply for a make-up exam within three days after the exam. | 끝나다=kkeunnada=to end ; 사흘=saheul=three days ; 안에=ane=within"],
   "시험을 못 봤을 때 나중에 보는 시험"),
  word("부정행위 | bujeonghaeng-wi | cheating", [
   "부정행위를 하면 안 돼요. | bujeonghaeng-wireul hamyeon an dwaeyo | You must not cheat. | 안 되다=an doeda=must not",
   "시험 중에 휴대폰을 보면 부정행위가 돼요. | siheom junge hyudaeponeul bomyeon bujeonghaeng-wiga dwaeyo | Looking at your phone during an exam counts as cheating. | 중에=junge=during ; 휴대폰=hyudaepon=mobile phone",
   "부정행위를 하면 그 과목 시험이 무효가 돼요. | bujeonghaeng-wireul hamyeon geu gwamok siheomi muhyoga dwaeyo | If you cheat, your exam for that course becomes void. | 과목=gwamok=course ; 무효=muhyo=void"],
   "시험에서 몰래 답을 보는 것"),
  word("상대 평가 | sangdae pyeongga | grading on a curve", [
   "이 수업은 상대 평가예요. | i su-eobeun sangdae pyeonggayeyo | This class is graded on a curve. | 수업=su-eop=class",
   "상대 평가에서는 A를 받는 학생이 삼십 퍼센트까지예요. | sangdae pyeonggaeseoneun Areul banneun haksaengi samsip peosenteukkajieyo | On a curve, up to 30 percent of students get an A. | 퍼센트=peosenteu=percent",
   "영어로 하는 수업은 A가 더 많을 수 있어요. | yeongeoro haneun su-eobeun Aga deo maneul su isseoyo | Classes taught in English can have more A's. | 영어로=yeongeoro=in English ; 많다=manta=to be many"],
   "다른 학생과 비교해서 성적을 주는 것"),
  word("제적 | jejeok | expulsion (losing student status)", [
   "학사 경고를 세 번 연속 받으면 제적될 수 있어요. | haksa gyeonggoreul se beon yeonsok badeumyeon jejeokdoel su isseoyo | Three academic warnings in a row can get you expelled. | 연속=yeonsok=in a row",
   "등록하지 않아도 제적될 수 있어요. | deungnokaji anado jejeokdoel su isseoyo | You can also lose your student status if you don't register. | 등록하다=deungnokada=to register (pay fees)",
   "제적되면 비자에도 문제가 생겨요. | jejeokdoemyeon bijaedo munjega saenggyeoyo | If you're expelled, your visa has problems too. | 비자=bija=visa ; 문제=munje=problem ; 생기다=saenggida=to arise"],
   "학교에서 학생 신분이 없어짐")],
 [dline("아나", "선배, 이번 학기에 결석을 좀 많이 했어요. | seonbae, ibeon hakkie gyeolseogeul jom mani haesseoyo | I've missed quite a few classes this semester. | 선배=seonbae=senior student ; 결석=gyeolseok=absence"),
  dline("지훈", "몇 번 빠졌어요? 삼분의 일이 넘으면 F예요. | myeot beon ppajyeosseoyo? sambunui iri neomeumyeon Fyeyo | How many times? If it's over a third, it's an F. | 빠지다=ppajida=to miss ; 삼분의 일=sambunui il=one third ; 넘다=neomtta=to go over"),
  dline("아나", "지각도 결석이 돼요? | jigakdo gyeolseogi dwaeyo? | Does being late count as an absence too? | 지각=jigak=being late"),
  dline("지훈", "네, 지각 두 번이 결석 한 번이에요. | ne, jigak du beoni gyeolseok han beonieyo | Yes, two lates make one absence. | 번=beon=time(s)"),
  dline("아나", "큰일이네요. 성적이 낮으면 어떻게 돼요? | keunirineyo seongjeogi najeumyeon eotteoke dwaeyo? | That's bad. What happens if my grades are low? | 큰일=keunil=big trouble ; 성적=seongjeok=grades"),
  dline("지훈", "평점이 일 점 오보다 낮으면 학사 경고예요. 이제부터 빠지지 말고 열심히 해요. | pyeongjeomi il jeom oboda najeumyeon haksa gyeonggoyeyo ijebuteo ppajiji malgo yeolsimhi haeyo | Below a 1.5 GPA is an academic warning. From now on, don't miss class and work hard. | 이제부터=ijebuteo=from now on ; 열심히=yeolsimhi=hard")],
 [["지각 몇 번이 결석 한 번이에요?", "두 번"], ["평점이 얼마보다 낮으면 학사 경고예요?", "일 점 오 (1.5)"], ['"cheating"을 한국어로?', "부정행위"]],
 [["전주대에서는 수업 시간의 3분의 1보다 많이 결석하면 F가 되고, 3분의 2 이상 출석해야 시험을 볼 수 있습니다.",
   "At Jeonju University, missing more than a third of a course's class time means an F, and you must attend at least two thirds to take the exams."],
  ["성적은 A+(4.5)부터 F(0)까지입니다. C+(79점) 이하를 받은 과목은 두 번까지 재수강할 수 있고, 재수강 성적은 A(94점)까지 받을 수 있습니다.",
   "Grades go from A+ (4.5) to F (0). A course graded C+ (79) or lower can be retaken up to twice, and the retake grade can be at most A (94)."],
  ["성적이 이상하면 성적이 나오고 7일 안에 inSTAR에서 이의 신청을 하세요. 추가 시험 성적은 B+까지만 받을 수 있습니다.",
   "If a grade looks wrong, appeal on inSTAR within 7 days after grades come out. A make-up exam can give at most B+."]]),
]

TITLES = {"K4-D-05": "Add/Drop and Dropping Courses", "K4-E-05": "English-Track Requirements", "K4-G-03": "Academic Warning and Make-up Exams"}

if __name__ == "__main__":
    codes = {b["code"] for b in NEW}
    k4 = [b for b in json.load(open(D("K4"))) if b["code"] not in codes] + NEW
    k4.sort(key=lambda b: (ORDER.index(b["code"][:4]), b["code"]))
    json.dump(k4, open(D("K4"), "w"), ensure_ascii=False, separators=(",", ":"))
    p = os.path.join(os.path.dirname(D("K4")), "..", "src", "titles-en.txt")
    lines = [l for l in open(p, encoding="utf-8").read().splitlines() if l.split(" | ")[0] not in codes]
    lines += [c + " | " + t for c, t in TITLES.items()]
    open(p, "w", encoding="utf-8").write("\n".join(lines) + "\n")
    print("K4", len(k4))
