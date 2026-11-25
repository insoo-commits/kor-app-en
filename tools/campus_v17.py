#!/usr/bin/env python3
"""v1.16 (RYU 2026-11-25): K4-I-04 학생생활관 안내, from the Jeonju University dormitory page text RYU pasted
(buildings, room types, amenities, stay periods, inSTAR application, office phone numbers),
and K4-J-04 교내 장학금 from the scholarship table RYU pasted (the ones any enrolled student can get).
Run once from the repository root: python3 tools/campus_v17.py && node build.js"""
import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from campus_v15 import D, word, dline, lesson, ORDER

NEW = [
lesson("K4-I-04", "학생생활관 안내", 2, "낱말",
 ["전주대 학생생활관(기숙사)의 건물, 방, 시설과 신청 방법에 대한 말입니다. 학교 안내를 바탕으로 했습니다.",
  "Words about Jeonju University's dormitory: its buildings, rooms, facilities and how to apply, based on the school's guide."],
 [word("학생생활관 | haksaeng saenghwalgwan | student dormitory (official name)", [
   "학생생활관은 기숙사의 다른 이름이에요. | haksaeng saenghwalgwaneun gisuksae dareun ireumieyo | 학생생활관 is another name for the dormitory. | 기숙사=gisuksa=dormitory ; 이름=ireum=name",
   "학생생활관에는 스타타워, 스타빌, 스타홈이 있어요. | haksaeng saenghwalgwaneneun seutatawo, seutabil, seutahomi isseoyo | The dormitory has Star Tower, Star Ville and Star Home. | 스타타워=seutatawo=Star Tower",
   "학생생활관 신청은 인스타에서 해요. | haksaeng saenghwalgwan sincheongeun inseutaeseo haeyo | You apply for the dormitory on inSTAR. | 신청=sincheong=application ; 인스타=inseuta=inSTAR"],
   "학교 기숙사의 정식 이름"),
  word("입사 | ipsa | moving into the dorm", [
   "다음 주에 기숙사에 입사해요. | da-eum jue gisuksae ipsahaeyo | I move into the dorm next week. | 다음 주=da-eum ju=next week",
   "입사 신청 기간을 놓치지 마세요. | ipsa sincheong giganeul nochiji maseyo | Don't miss the dorm application period. | 기간=gigan=period ; 놓치다=nochida=to miss",
   "기숙사에서 '입사'는 들어가서 산다는 뜻이에요. | gisuksa-eseo ipsaneun deureogaseo sandaneun tteusieyo | At the dorm, '입사' means moving in to live. | 들어가다=deureogada=to go in ; 뜻=tteut=meaning"],
   "기숙사에 들어가 사는 것"),
  word("퇴사 | toesa | moving out of the dorm", [
   "방학 전에 퇴사해요. | banghak jeone toesahaeyo | I move out before the vacation. | 방학=banghak=vacation ; 전에=jeone=before",
   "퇴사할 때 방을 깨끗이 청소하세요. | toesahal ttae bangeul kkaekkeusi cheongsohaseyo | Clean your room when you move out. | 깨끗이=kkaekkeusi=cleanly ; 청소하다=cheongsohada=to clean",
   "퇴사 날짜는 생활관 사무실에 물어보세요. | toesa naljjaneun saenghwalgwan samusire mureoboseyo | Ask the dorm office about the move-out date. | 날짜=naljja=date ; 사무실=samusil=office"],
   "기숙사에서 나가는 것"),
  word("이인실 | i-insil | double room", [
   "저는 이인실에 살아요. | jeoneun i-insire sarayo | I live in a double room. | 살다=salda=to live",
   "스타빌과 스타홈은 모두 이인실이에요. | seutabilgwa seutahomeun modu i-insirieyo | Star Ville and Star Home are all double rooms. | 모두=modu=all",
   "스타타워에는 일인실, 이인실, 사인실이 있어요. | seutatawoeneun irinsil, i-insil, sa-insiri isseoyo | Star Tower has single, double and four-person rooms. | 일인실=irinsil=single room ; 사인실=sa-insil=four-person room"],
   "두 사람이 같이 쓰는 방"),
  word("부대시설 | budaesiseol | amenities (extra facilities)", [
   "스타타워에는 부대시설이 많아요. | seutatawoeneun budaesiseori manayo | Star Tower has many amenities. | 많다=manta=to be many",
   "편의점과 카페도 부대시설이에요. | pyeonuijeomgwa kapedo budaesiseorieyo | The convenience store and café are amenities too. | 편의점=pyeonuijeom=convenience store ; 카페=kape=café",
   "스타빌에는 독서실과 공동 취사실이 있어요. | seutabireneun dokseosilgwa gongdong chwisasiri isseoyo | Star Ville has a reading room and a shared kitchen. | 독서실=dokseosil=reading room ; 공동 취사실=gongdong chwisasil=shared kitchen"],
   "건물에 함께 있는 여러 시설"),
  word("공용 샤워실 | gongyong syawosil | shared shower room", [
   "스타홈은 공용 샤워실을 써요. | seutahomeun gongyong syawosireul sseoyo | Star Home uses shared shower rooms. | 쓰다=sseuda=to use",
   "스타타워는 방마다 샤워실과 화장실이 있어요. | seutatawoneun bangmada syawosilgwa hwajangsiri isseoyo | Star Tower has a shower and toilet in every room. | -마다=-mada=every ; 화장실=hwajangsil=toilet",
   "아침에는 공용 샤워실이 붐벼요. | achimeneun gongyong syawosiri bumbyeoyo | The shared showers are crowded in the morning. | 아침=achim=morning ; 붐비다=bumbida=to be crowded"],
   "여러 사람이 같이 쓰는 샤워실")],
 [dline("아나", "안녕하세요. 기숙사에 살고 싶어요. 어떻게 신청해요? | annyeonghaseyo gisuksae salgo sipeoyo eotteoke sincheonghaeyo? | Hello. I'd like to live in the dorm. How do I apply? | 기숙사=gisuksa=dormitory ; 신청하다=sincheonghada=to apply"),
  dline("직원", "인스타에서 입사 신청을 하시면 돼요. | inseutaeseo ipsa sincheongeul hasimyeon dwaeyo | You can apply on inSTAR. | 입사=ipsa=moving into the dorm"),
  dline("아나", "방에 샤워실이 있는 건물은 어디예요? | bange syawosiri inneun geonmureun eodiyeyo? | Which building has showers in the rooms? | 건물=geonmul=building"),
  dline("직원", "스타타워예요. 스타빌과 스타홈은 공용 샤워실을 써요. | seutatawoyeyo seutabilgwa seutahomeun gongyong syawosireul sseoyo | Star Tower. Star Ville and Star Home use shared showers. | 공용=gongyong=shared"),
  dline("아나", "방학에도 살 수 있어요? | banghagedo sal su isseoyo? | Can I live there during the vacation too? | 방학=banghak=vacation"),
  dline("직원", "연간이나 반기로 신청하면 방학에도 살 수 있어요. | yeon-ganina ban-giro sincheonghamyeon banghagedo sal su isseoyo | If you apply for a full year or a half year, you can stay during the vacation too. | 연간=yeon-gan=for a year ; 반기=ban-gi=half a year")],
 [["기숙사 신청은 어디에서 해요?", "인스타"], ["방마다 샤워실이 있는 건물은?", "스타타워"], ['"double room"을 한국어로?', "이인실"]],
 [["전주대 학생생활관에는 스타타워(지상 18층, 1·2·4인실, 방마다 샤워실과 화장실), 스타빌과 스타홈(2인실, 공용 샤워실)이 있습니다. 모두 1,885명을 모집합니다.",
   "Jeonju University's dormitory has Star Tower (18 floors, single, double and four-person rooms, each with its own shower and toilet) and Star Ville and Star Home (double rooms with shared showers). Together they take 1,885 students."],
  ["입사 기간은 연간(52주, 3월 초~다음 해 2월 말), 반기(26주, 학기 초~방학 끝), 학기(16주, 학기 초~방학 전)가 있습니다. 신청은 inSTAR(instar.jj.ac.kr)에서 합니다.",
   "You can stay for a year (52 weeks, early March to the end of next February), half a year (26 weeks, start of semester to end of vacation) or a semester (16 weeks, start of semester to the start of vacation). Apply on inSTAR (instar.jj.ac.kr)."],
  ["문의: 스타타워 운영사무실 063-239-5500, 스타빌·스타홈 운영사무실 063-239-5520.",
   "Questions: Star Tower office 063-239-5500, Star Ville and Star Home office 063-239-5520."]]),
lesson("K4-J-04", "교내 장학금", 2, "낱말",
 ["전주대 교내 장학금의 종류와 조건을 말할 때 쓰는 말입니다. 학교 장학 안내를 바탕으로 했습니다.",
  "Words for the kinds of Jeonju University scholarships and their conditions, based on the school's scholarship guide."],
 [word("성적우수장학금 | seongjeok usu janghakkeum | academic excellence scholarship", [
   "성적우수장학금을 받았어요. | seongjeok usu janghakkeumeul badasseoyo | I got an academic excellence scholarship. | 받다=batta=to get",
   "성적우수장학금은 수업료의 삼십 퍼센트예요. | seongjeok usu janghakkeumeun su-eomnyoui samsip peosenteuyeyo | The academic excellence scholarship is 30 percent of tuition. | 수업료=su-eomnyo=tuition ; 퍼센트=peosenteu=percent",
   "지난 학기에 십이 학점 이상 듣고 평점이 삼 점 이상이어야 해요. | jinan hakkie sibi hakjeom isang deutkko pyeongjeomi sam jeom isang-ieoya haeyo | You need 12 or more credits last semester and a GPA of 3.0 or higher. | 이상=isang=or more ; 평점=pyeongjeom=GPA"],
   "성적이 좋은 학생에게 주는 장학금"),
  word("수석 | suseok | top student (first place)", [
   "우리 학과 수석이 누구예요? | uri hakkwa suseogi nuguyeyo? | Who is the top student in our department? | 학과=hakkwa=department ; 누구=nugu=who",
   "학과 수석은 수업료의 육십오 퍼센트를 장학금으로 받아요. | hakkwa suseogeun su-eomnyoui yuksibo peosenteureul janghakkeumeuro badayo | The department's top student gets 65 percent of tuition as a scholarship. | 장학금=janghakkeum=scholarship",
   "친구가 이번 학기에 학과 수석을 했어요. | chin-guga ibeon hakkie hakkwa suseogeul haesseoyo | My friend came first in the department this semester. | 친구=chin-gu=friend"],
   "성적이 제일 좋은 사람"),
  word("수업료 | su-eomnyo | tuition (fee)", [
   "한 학기 수업료가 얼마예요? | han hakki su-eomnyoga eolmayeyo? | How much is tuition for one semester? | 얼마=eolma=how much",
   "장학금은 수업료보다 많이 받을 수 없어요. | janghakkeumeun su-eomnyoboda mani badeul su eopseoyo | A scholarship can't be more than your tuition. | -보다=-boda=than",
   "장학금을 받으면 고지서에서 수업료가 줄어요. | janghakkeumeul badeumyeon gojiseoeseo su-eomnyoga jureoyo | With a scholarship, the tuition on your bill goes down. | 고지서=gojiseo=bill ; 줄다=julda=to decrease"],
   "수업을 듣는 데 내는 돈"),
  word("고지서 | gojiseo | bill, payment notice", [
   "등록금 고지서가 나왔어요. | deungnokkeum gojiseoga nawasseoyo | The tuition bill is out. | 등록금=deungnokkeum=tuition and fees ; 나오다=na-oda=to come out",
   "고지서에 장학금이 적혀 있어요. | gojiseoe janghakkeumi jeokyeo isseoyo | The scholarship is written on the bill. | 적히다=jeokida=to be written",
   "고지서를 보고 기간 안에 등록금을 내세요. | gojiseoreul bogo gigan ane deungnokkeumeul naeseyo | Check the bill and pay the fees within the period. | 기간=gigan=period ; 내다=naeda=to pay"],
   "낼 돈을 알려 주는 종이"),
  word("포인트 | pointeu | points", [
   "스타트 프로그램에서 포인트를 모았어요. | seutateu peurogeuraemeseo pointeureul moasseoyo | I collected points in the StarT program. | 프로그램=peurogeuraem=program ; 모으다=mo-euda=to collect",
   "포인트 하나에 삼천 원씩 장학금을 줘요. | pointeu hana-e samcheon wonssik janghakkeumeul jwoyo | They give a 3,000-won scholarship for each point. | -씩=-ssik=each ; 주다=juda=to give",
   "포인트가 많으면 장학금도 많아요. | pointeuga maneumyeon janghakkeumdo manayo | The more points you have, the bigger the scholarship. | 많다=manta=to be many"],
   "활동하면 쌓이는 점수"),
  word("홍보대사 | hongbodaesa | student ambassador", [
   "저는 학교 홍보대사예요. | jeoneun hakkyo hongbodaesayeyo | I'm a school ambassador. | 학교=hakkyo=school",
   "홍보대사로 활동하면 장학금을 받아요. | hongbodaesaro hwaldonghamyeon janghakkeumeul badayo | Ambassadors get a scholarship for their work. | 활동하다=hwaldonghada=to be active",
   "학생회 간부도 장학금을 받을 수 있어요. | haksaenghoe ganbudo janghakkeumeul badeul su isseoyo | Student council officers can get a scholarship too. | 학생회=haksaenghoe=student council ; 간부=ganbu=officer"],
   "학교를 알리는 학생")],
 [dline("아나", "성적 장학금은 어떻게 받아요? | seongjeok janghakkeumeun eotteoke badayo? | How do I get a grade scholarship? | 성적=seongjeok=grades ; 어떻게=eotteoke=how"),
  dline("직원", "따로 신청하지 않아도 돼요. 학교에서 성적으로 뽑아요. | ttaro sincheonghaji anado dwaeyo hakkyoeseo seongjeogeuro ppobayo | You don't need to apply. The school picks students by their grades. | 따로=ttaro=separately ; 뽑다=ppopta=to pick"),
  dline("아나", "조건이 뭐예요? | jogeoni mwoyeyo? | What are the conditions? | 조건=jogeon=condition"),
  dline("직원", "지난 학기에 십이 학점 이상 듣고 평점이 삼 점 이상이어야 해요. | jinan hakkie sibi hakjeom isang deutkko pyeongjeomi sam jeom isang-ieoya haeyo | You need 12 or more credits last semester and a GPA of 3.0 or higher. | 평점=pyeongjeom=GPA"),
  dline("아나", "장학금은 언제 받아요? | janghakkeumeun eonje badayo? | When do I get the scholarship? | 언제=eonje=when"),
  dline("직원", "다음 학기 고지서에서 수업료가 줄어요. | da-eum hakki gojiseoeseo su-eomnyoga jureoyo | The tuition on next semester's bill goes down. | 고지서=gojiseo=bill ; 수업료=su-eomnyo=tuition")],
 [["성적우수장학금은 수업료의 몇 퍼센트예요?", "삼십 퍼센트 (30%)"], ["성적우수장학금의 평점 조건은?", "삼 점 (3.0) 이상"], ['"tuition"을 한국어로?', "수업료"]],
 [["전주대 성적우수장학금은 수업료의 30%(직전 학기 12학점 이상, 평점 3.0 이상), 학부(과) 수석장학금은 65%(평점 3.5 이상)입니다. 학교가 성적으로 뽑아서 다음 학기 고지서에서 깎아 줍니다.",
   "At Jeonju University the academic excellence scholarship is 30% of tuition (12+ credits and a GPA of 3.0+ last semester), and the department top-student scholarship is 65% (GPA 3.5+). The school selects students by grades and takes it off the next semester's bill."],
  ["StarT 프로그램 포인트(1점에 3,000원), 홍보대사, 학생회 간부, 봉사활동 장학금도 있습니다. 교내외 장학금은 모두 합쳐 수업료보다 많이 받을 수 없습니다.",
   "There are also scholarships for StarT program points (3,000 won a point), ambassadors, student council officers and volunteering. All scholarships together can't be more than your tuition."],
  ["장학 공지는 학교 홈페이지 공지사항(장학)과 단과대학 행정실 게시판에 올라옵니다. 유학생이 받을 수 있는 장학금은 국제교류원에도 꼭 물어보세요.",
   "Scholarship notices are posted on the school website (Notices › Scholarships) and on your college office board. Also ask the international office which scholarships international students can get."]]),
]

TITLES = {"K4-I-04": "Dormitory Guide", "K4-J-04": "On-campus Scholarships"}

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
