#!/usr/bin/env python3
"""v1.5 (RYU 2026-11-25): campus situations for English-track students.
- 대학 생활 (K4): subs shown in the order of a student's year (codes kept, so saved places still work),
  new sub K4-N 생활 정착 (5 lessons) and K4-D-04 휴학과 복학.
- 듣기연습 LS-A: the 10 children's songs become 10 campus announcements (캠퍼스 방송), same codes.
- 기초회화 K2-G-04 기숙사 생활 -> 함께 사는 생활 (the dorm itself is in 대학 생활 > 주거).
Run once from the repository root: python3 tools/campus_v15.py && node build.js
Text format: sentence "ko | rom | en | note ; note", note "ko=rom=en"."""
import json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = lambda a: os.path.join(ROOT, "data", a + ".json")


def notes(s):
    return [n.strip().split("=") for n in s.split(";") if n.strip()] if s.strip() else []


def sent(line):
    ko, rom, en, *nt = [x.strip() for x in line.split("|")]
    return [ko, rom, en, notes(nt[0] if nt else "")]


def word(head, sents, kdef=None):
    ko, rom, en = [x.strip() for x in head.split("|")]
    w = [ko, rom, en, [sent(s) for s in sents]]
    if kdef: w.append(kdef)
    return w


def dline(spk, line):
    ko, rom, en, *nt = [x.strip() for x in line.split("|")]
    return [spk, ko, en, notes(nt[0] if nt else ""), rom]


def lesson(code, t, lv, typ, i, words, dl, qz, tp):
    return {"code": code, "t": t, "lv": lv, "type": typ, "i": i, "m": [], "l": [], "w": words, "f": [], "c": [], "e": [], "x": [],
            "tp": tp, "pr": [], "dl": dl, "qz": qz, "sm": []}


# ---------------------------------------------------------------- K4-N 생활 정착
K4N = [
lesson("K4-N-01", "휴대폰 개통", 2, "낱말",
 ["한국에 와서 휴대폰을 개통하고 본인 인증을 할 때 쓰는 말입니다.", "Words for getting a Korean phone line and verifying your identity."],
 [word("개통 | gaetong | opening a phone line", [
   "휴대폰 개통하러 왔어요. | hyudaepon gaetonghareo wasseoyo | I came to open a phone line. | 휴대폰=hyudaepon=mobile phone ; 개통하다=gaetonghada=to open (a phone line)",
   "개통은 외국인 등록증이 있으면 쉬워요. | gaetongeun oegugin deungnokjjeungi isseumyeon swiwoyo | Opening a line is easy if you have a residence card. | 외국인 등록증=oegugin deungnokjjeung=residence card ; 쉽다=swipta=to be easy",
   "개통하는 데 삼십 분쯤 걸려요. | gaetonghaneun de samsip bunjjeum geollyeoyo | It takes about 30 minutes to open a line. | -쯤=-jjeum=about ; 걸리다=geollida=to take (time)"], "휴대폰을 쓸 수 있게 하는 것"),
  word("유심 | yusim | SIM card", [
   "유심을 바꿨어요. | yusimeul bakkwosseoyo | I changed my SIM card. | 바꾸다=bakkuda=to change",
   "편의점에서도 유심을 살 수 있어요. | pyeonijeomeseodo yusimeul sal su isseoyo | You can buy a SIM card at a convenience store too. | 편의점=pyeonijeom=convenience store ; 사다=sada=to buy",
   "유심을 넣고 전원을 켜세요. | yusimeul neoko jeonwoneul kyeoseyo | Put in the SIM card and turn on the power. | 넣다=neota=to put in ; 전원=jeonwon=power ; 켜다=kyeoda=to turn on"], "휴대폰에 넣는 작은 칩"),
  word("요금제 | yogeumje | phone plan", [
   "어떤 요금제가 좋아요? | eotteon yogeumjega joayo? | Which plan is good? | 어떤=eotteon=which",
   "데이터 무제한 요금제로 할게요. | deiteo mujehan yogeumjero halkkeyo | I'll go with an unlimited data plan. | 데이터=deiteo=data ; 무제한=mujehan=unlimited",
   "학생 요금제는 한 달에 삼만 원이에요. | haksaeng yogeumjeneun han dare samman wonieyo | The student plan is 30,000 won a month. | 학생=haksaeng=student ; 한 달=han dal=one month"], "매달 내는 휴대폰 요금의 종류"),
  word("알뜰폰 | altteulpon | budget phone plan (MVNO)", [
   "알뜰폰은 요금이 싸요. | altteulponeun yogeumi ssayo | Budget phone plans are cheap. | 요금=yogeum=fee, charge ; 싸다=ssada=to be cheap",
   "유학생들은 알뜰폰을 많이 써요. | yuhaksaengdeureun altteulponeul mani sseoyo | Many international students use budget plans. | 유학생=yuhaksaeng=international student ; 많이=mani=a lot",
   "알뜰폰은 인터넷으로 가입해요. | altteulponeun inteoneseuro gaipaeyo | You sign up for a budget plan online. | 인터넷=inteonet=internet ; 가입하다=gaipada=to sign up"], "값이 싼 휴대폰 서비스"),
  word("본인 인증 | bonin injeung | identity verification", [
   "본인 인증을 해 주세요. | bonin injeungeul hae juseyo | Please verify your identity. | 하다=hada=to do",
   "은행 앱에서 본인 인증이 필요해요. | eunhaeng aebeseo bonin injeungi piryohaeyo | The bank app needs identity verification. | 은행=eunhaeng=bank ; 앱=aep=app ; 필요하다=piryohada=to be needed",
   "휴대폰이 내 이름으로 되어 있어야 본인 인증을 할 수 있어요. | hyudaeponi nae ireumeuro doe-eo isseoya bonin injeungeul hal su isseoyo | You can verify your identity only if the phone is in your name. | 이름=ireum=name ; -어야=-eoya=only if"], "내가 맞는지 확인하는 것"),
  word("인증번호 | injeungbeonho | verification code", [
   "인증번호를 입력하세요. | injeungbeonhoreul imnyeokaseyo | Enter the verification code. | 입력하다=imnyeokada=to enter (type in)",
   "인증번호가 안 와요. | injeungbeonhoga an wayo | The verification code doesn't come. | 오다=oda=to come",
   "인증번호는 삼 분 안에 넣어야 해요. | injeungbeonhoneun sam bun ane neoeoya haeyo | You have to enter the code within three minutes. | 안에=ane=within ; 넣다=neota=to put in"], "문자로 오는 확인 숫자")],
 [dline("직원", "어서 오세요. 무엇을 도와드릴까요? | eoseo oseyo mu-eoseul dowadeurilkkayo? | Welcome. How can I help you? | 도와드리다=dowadeurida=to help (honorific)"),
  dline("마리아", "휴대폰을 개통하고 싶어요. | hyudaeponeul gaetonghago sipeoyo | I'd like to open a phone line. | 개통하다=gaetonghada=to open (a phone line) ; 싶다=sipta=to want to"),
  dline("직원", "외국인 등록증 있으세요? | oegugin deungnokjjeung isseuseyo? | Do you have your residence card? | 외국인 등록증=oegugin deungnokjjeung=residence card"),
  dline("마리아", "네, 여기 있어요. 싼 요금제가 있어요? | ne, yeogi isseoyo ssan yogeumjega isseoyo? | Yes, here it is. Is there a cheap plan? | 싸다=ssada=to be cheap ; 요금제=yogeumje=phone plan"),
  dline("직원", "이 학생 요금제는 한 달에 삼만 원이에요. | i haksaeng yogeumjeneun han dare samman wonieyo | This student plan is 30,000 won a month. | 학생=haksaeng=student ; 요금제=yogeumje=phone plan"),
  dline("마리아", "좋아요. 그걸로 할게요. | joayo geugeollo halkkeyo | Good. I'll take that one. | 그것=geugeot=that")],
 [['"SIM card"를 한국어로?', "유심"], ['"인증번호"의 뜻은?', "verification code"], ["값이 싼 휴대폰 서비스는? 알뜰폰 / 요금제", "알뜰폰"]],
 [["한국에서는 은행, 배달, 쇼핑 앱에 가입할 때 휴대폰 본인 인증을 많이 합니다. 휴대폰이 내 이름으로 되어 있으면 편합니다.", "In Korea you often verify your identity by phone to join bank, delivery and shopping apps. It is easier if the phone line is in your own name."],
  ["여권만으로 개통할 수 있는 요금제도 있지만, 외국인 등록증이 나온 뒤에 개통하면 고르기가 더 쉽습니다.", "Some plans can be opened with just a passport, but after you get your residence card you have more choices."]]),

lesson("K4-N-02", "건강보험", 2, "낱말",
 ["유학생이 가입하는 국민건강보험과 병원비에 대한 말입니다.", "Words about National Health Insurance for international students and medical costs."],
 [word("건강보험 | geon-gangboheom | health insurance", [
   "유학생도 건강보험에 가입해요. | yuhaksaengdo geon-gangboheome gaipaeyo | International students also join health insurance. | 유학생=yuhaksaeng=international student ; 가입하다=gaipada=to join",
   "건강보험이 있으면 병원비가 싸요. | geon-gangboheomi isseumyeon byeongwonbiga ssayo | With health insurance, hospital bills are cheaper. | 병원비=byeongwonbi=hospital bill ; 싸다=ssada=to be cheap",
   "건강보험은 외국인 등록을 하면 자동으로 가입돼요. | geon-gangboheomeun oegugin deungnogeul hamyeon jadongeuro gaipttwaeyo | You are signed up for health insurance automatically when you register as a foreigner. | 외국인 등록=oegugin deungnok=alien registration ; 자동으로=jadongeuro=automatically"], "아플 때 병원비를 도와주는 보험"),
  word("보험료 | boheomnyo | insurance premium", [
   "보험료가 얼마예요? | boheomnyoga eolmayeyo? | How much is the premium? | 얼마=eolma=how much",
   "보험료는 매달 내요. | boheomnyoneun maedal naeyo | You pay the premium every month. | 매달=maedal=every month ; 내다=naeda=to pay",
   "유학생은 보험료가 조금 싸요. | yuhaksaengeun boheomnyoga jogeum ssayo | International students pay a slightly lower premium. | 조금=jogeum=a little"], "보험에 내는 돈"),
  word("고지서 | gojiseo | bill (payment notice)", [
   "보험료 고지서가 왔어요. | boheomnyo gojiseoga wasseoyo | The insurance bill came. | 보험료=boheomnyo=insurance premium ; 오다=oda=to come",
   "고지서는 기숙사로 와요. | gojiseoneun gisuksaro wayo | The bill comes to the dormitory. | 기숙사=gisuksa=dormitory",
   "고지서를 잃어버렸어요. | gojiseoreul ireobeoryeosseoyo | I lost the bill. | 잃어버리다=ireobeorida=to lose"], "낼 돈을 알려 주는 종이"),
  word("자동 이체 | jadong iche | automatic payment", [
   "보험료를 자동 이체로 내요. | boheomnyoreul jadong ichero naeyo | I pay the premium by automatic transfer. | 보험료=boheomnyo=insurance premium ; 내다=naeda=to pay",
   "자동 이체를 신청했어요. | jadong ichereul sincheonghaesseoyo | I applied for automatic payment. | 신청하다=sincheonghada=to apply",
   "통장에 돈이 없으면 자동 이체가 안 돼요. | tongjange doni eopseumyeon jadong ichega an dwaeyo | If there's no money in the account, the automatic payment fails. | 통장=tongjang=bank account ; 돈=don=money ; 없다=eopta=to not have"], "통장에서 돈이 저절로 나가는 것"),
  word("밀리다 | millida | to be overdue", [
   "보험료가 두 달 밀렸어요. | boheomnyoga du dal millyeosseoyo | My premium is two months overdue. | 두 달=du dal=two months",
   "보험료가 밀리면 비자 연장이 어려워요. | boheomnyoga millimyeon bija yeonjangi eoryeowoyo | If your premium is overdue, it's hard to extend your visa. | 비자=bija=visa ; 연장=yeonjang=extension ; 어렵다=eoryeopta=to be difficult",
   "밀린 돈을 오늘 다 냈어요. | millin doneul oneul da naesseoyo | I paid all the overdue money today. | 오늘=oneul=today ; 다=da=all"], "낼 돈을 제때 못 내다"),
  word("병원비 | byeongwonbi | hospital bill", [
   "병원비가 많이 나왔어요. | byeongwonbiga mani nawasseoyo | The hospital bill was high. | 많이=mani=a lot ; 나오다=na-oda=to come out",
   "병원비는 카드로 낼게요. | byeongwonbineun kadeuro naelkkeyo | I'll pay the hospital bill by card. | 카드=kadeu=card",
   "보험이 있어서 병원비가 반쯤 나왔어요. | boheomi isseoseo byeongwonbiga banjjeum nawasseoyo | Thanks to insurance, the bill was about half. | 보험=boheom=insurance ; 반=ban=half"], "병원에 내는 돈")],
 [dline("샘", "민하 씨, 이 종이가 뭐예요? | minha ssi, i jongiga mwoyeyo? | Minha, what is this paper? | 종이=jongi=paper"),
  dline("민하", "건강보험 고지서예요. 보험료를 내야 해요. | geon-gangboheom gojiseoyeyo boheomnyoreul naeya haeyo | It's a health insurance bill. You have to pay the premium. | 고지서=gojiseo=bill ; 보험료=boheomnyo=insurance premium"),
  dline("샘", "얼마예요? | eolmayeyo? | How much is it? | 얼마=eolma=how much"),
  dline("민하", "학생은 조금 싸요. 자동 이체로 하면 편해요. | haksaengeun jogeum ssayo jadong ichero hamyeon pyeonhaeyo | It's a bit cheaper for students. Automatic payment is convenient. | 자동 이체=jadong iche=automatic payment ; 편하다=pyeonhada=to be convenient"),
  dline("샘", "안 내면 어떻게 돼요? | an naemyeon eotteoke dwaeyo? | What happens if I don't pay? | 내다=naeda=to pay"),
  dline("민하", "밀리면 비자 연장이 어려워요. 꼭 내세요. | millimyeon bija yeonjangi eoryeowoyo kkok naeseyo | If it's overdue, extending your visa is hard. Be sure to pay. | 밀리다=millida=to be overdue ; 꼭=kkok=be sure to")],
 [['"health insurance"를 한국어로?', "건강보험"], ['"보험료"의 뜻은?', "insurance premium"], ["낼 돈을 알려 주는 종이는? 고지서 / 신청서", "고지서"]],
 [["유학생(D-2, D-4)은 외국인 등록을 하면 국민건강보험에 자동으로 가입됩니다. 보험료를 오래 안 내면 비자 연장이 어려울 수 있습니다.", "International students (D-2, D-4) are enrolled in National Health Insurance automatically after alien registration. If you leave premiums unpaid for a long time, visa extension can become difficult."],
  ["보험료는 은행, 편의점, 앱으로 낼 수 있습니다. 모르면 국민건강보험공단(1577-1000)에 물어봅니다.", "You can pay premiums at a bank, a convenience store or by app. If unsure, ask the National Health Insurance Service (1577-1000)."]]),

lesson("K4-N-03", "체류지 변경 신고", 2, "낱말",
 ["이사하면 십오 일 안에 해야 하는 체류지 변경 신고에 대한 말입니다.", "Words about reporting your new address, which you must do within 15 days of moving."],
 [word("체류지 | cheryuji | place of residence", [
   "체류지가 바뀌었어요. | cheryujiga bakkwi-eosseoyo | My place of residence changed. | 바뀌다=bakkwida=to change",
   "외국인 등록증 뒤에 체류지가 있어요. | oegugin deungnokjjeung dwie cheryujiga isseoyo | Your address is on the back of the residence card. | 뒤=dwi=back",
   "기숙사가 제 체류지예요. | gisuksaga je cheryujiyeyo | The dormitory is my place of residence. | 기숙사=gisuksa=dormitory ; 제=je=my (polite)"], "한국에서 사는 곳"),
  word("변경 | byeon-gyeong | change", [
   "주소 변경을 하러 왔어요. | juso byeon-gyeongeul hareo wasseoyo | I came to change my address. | 주소=juso=address",
   "수강 과목을 변경했어요. | sugang gwamogeul byeon-gyeonghaesseoyo | I changed my course. | 수강=sugang=taking a class ; 과목=gwamok=subject",
   "전화번호가 변경되면 학교에 알려 주세요. | jeonhwabeonhoga byeon-gyeongdoemyeon hakkyo-e allyeo juseyo | If your phone number changes, let the school know. | 전화번호=jeonhwabeonho=phone number ; 알리다=allida=to let know"], "바꾸는 것"),
  word("신고 | sin-go | report (to the authorities)", [
   "이사하고 신고를 했어요. | isahago sin-goreul haesseoyo | I moved and reported it. | 이사하다=isahada=to move (house)",
   "신고는 십오 일 안에 해야 해요. | sin-goneun sibo il ane haeya haeyo | You must report within 15 days. | 십오 일=sibo il=15 days ; 안에=ane=within",
   "늦게 신고하면 과태료를 내요. | neutkke sin-gohamyeon gwataeryoreul naeyo | If you report late, you pay a fine. | 늦게=neutkke=late ; 과태료=gwataeryo=fine"], "관청에 알리는 것"),
  word("주민센터 | juminsenteo | community service center", [
   "주민센터에서 신고할 수 있어요. | juminsenteo-eseo sin-gohal su isseoyo | You can report it at the community service center. | 신고하다=sin-gohada=to report",
   "주민센터는 아홉 시에 문을 열어요. | juminsenteoneun ahop sie muneul yeoreoyo | The center opens at nine. | 문을 열다=muneul yeolda=to open",
   "가까운 주민센터가 어디예요? | gakkaun juminsenteoga eodiyeyo? | Where is the nearest community service center? | 가깝다=gakkapta=to be near"], "동네 일을 보는 관청"),
  word("하이코리아 | ha-ikoria | HiKorea (immigration website)", [
   "하이코리아에서 온라인으로 신고했어요. | ha-ikoria-eseo ollaineuro sin-gohaesseoyo | I reported it online on HiKorea. | 온라인=ollain=online",
   "하이코리아에서 방문 예약을 해요. | ha-ikoria-eseo bangmun yeyageul haeyo | You make a visit reservation on HiKorea. | 방문=bangmun=visit ; 예약=yeyak=reservation",
   "하이코리아는 영어로도 볼 수 있어요. | ha-ikorianeun yeongeorodo bol su isseoyo | HiKorea is available in English too. | 영어=yeongeo=English"], "외국인 체류 일을 보는 누리집"),
  word("임대차 계약서 | imdaecha gyeyaksseo | lease contract", [
   "신고할 때 임대차 계약서가 필요해요. | sin-gohal ttae imdaecha gyeyaksseoga piryohaeyo | You need your lease contract to report. | 필요하다=piryohada=to be needed",
   "임대차 계약서를 복사해 주세요. | imdaecha gyeyaksseoreul boksahae juseyo | Please copy the lease contract. | 복사하다=boksahada=to copy",
   "기숙사는 임대차 계약서 대신 거주 확인서를 내요. | gisuksaneun imdaecha gyeyaksseo daesin geoju hwaginseoreul naeyo | Dorm residents submit a residence confirmation instead of a lease. | 대신=daesin=instead ; 거주 확인서=geoju hwaginseo=residence confirmation"], "방을 빌릴 때 쓰는 계약서")],
 [dline("라히마", "기숙사에서 원룸으로 이사했어요. 뭘 해야 해요? | gisuksa-eseo wollumeuro isahaesseoyo mwol haeya haeyo? | I moved from the dorm to a studio. What do I need to do? | 원룸=wollum=studio apartment ; 이사하다=isahada=to move (house)"),
  dline("직원", "십오 일 안에 체류지 변경 신고를 하세요. | sibo il ane cheryuji byeon-gyeong sin-goreul haseyo | Report your change of address within 15 days. | 체류지=cheryuji=place of residence ; 신고=sin-go=report"),
  dline("라히마", "어디에서 해요? | eodieseo haeyo? | Where do I do it? | 어디=eodi=where"),
  dline("직원", "주민센터나 하이코리아에서 할 수 있어요. | juminsenteona ha-ikoria-eseo hal su isseoyo | At the community service center or on HiKorea. | 주민센터=juminsenteo=community service center"),
  dline("라히마", "뭘 가져가야 해요? | mwol gajeogaya haeyo? | What do I need to bring? | 가져가다=gajeogada=to take along"),
  dline("직원", "외국인 등록증과 임대차 계약서를 가져오세요. | oegugin deungnokjjeunggwa imdaecha gyeyaksseoreul gajeo-oseyo | Bring your residence card and lease contract. | 임대차 계약서=imdaecha gyeyaksseo=lease contract")],
 [['"report"를 한국어로?', "신고"], ['"체류지"의 뜻은?', "place of residence"], ["이사하면 며칠 안에 신고해요? 십오 일 / 삼십 일", "십오 일"]],
 [["외국인은 이사하면 십오 일 안에 체류지 변경 신고를 해야 합니다. 늦으면 과태료를 낼 수 있습니다.", "Foreigners must report a change of address within 15 days of moving. If you are late, you may have to pay a fine."],
  ["주소가 바뀌면 학교 국제교류원에도 꼭 알려 주세요.", "When your address changes, also tell the school's International Office."]]),

lesson("K4-N-04", "분실과 긴급 신고", 2, "낱말",
 ["물건을 잃어버리거나 급한 일이 생겼을 때 쓰는 말입니다.", "Words for when you lose something or have an emergency."],
 [word("잃어버리다 | ireobeorida | to lose", [
   "지갑을 잃어버렸어요. | jigabeul ireobeoryeosseoyo | I lost my wallet. | 지갑=jigap=wallet",
   "학생증을 잃어버려서 다시 만들었어요. | haksaengjjeungeul ireobeoryeoseo dasi mandeureosseoyo | I lost my student ID, so I got a new one made. | 학생증=haksaengjjeung=student ID ; 다시=dasi=again ; 만들다=mandeulda=to make",
   "버스에서 휴대폰을 잃어버렸어요. | beoseu-eseo hyudaeponeul ireobeoryeosseoyo | I lost my phone on the bus. | 버스=beoseu=bus ; 휴대폰=hyudaepon=mobile phone"], "가지고 있던 것이 없어지다"),
  word("분실물 센터 | bunsilmul senteo | lost and found", [
   "분실물 센터가 어디예요? | bunsilmul senteoga eodiyeyo? | Where is the lost and found? | 어디=eodi=where",
   "학생회관에 분실물 센터가 있어요. | haksaenghoegwane bunsilmul senteoga isseoyo | There's a lost and found in the student union building. | 학생회관=haksaenghoegwan=student union building",
   "분실물 센터에 우산을 맡겼어요. | bunsilmul senteo-e usaneul matkkyeosseoyo | I left an umbrella at the lost and found. | 우산=usan=umbrella ; 맡기다=matkkida=to leave in someone's care"], "잃어버린 물건을 찾는 곳"),
  word("신고하다 | sin-gohada | to report", [
   "경찰에 신고했어요. | gyeongchare sin-gohaesseoyo | I reported it to the police. | 경찰=gyeongchal=police",
   "도둑을 보면 바로 신고하세요. | dodugeul bomyeon baro sin-gohaseyo | If you see a thief, report it right away. | 도둑=doduk=thief ; 바로=baro=right away",
   "카드를 잃어버리면 은행에 먼저 신고하세요. | kadeureul ireobeorimyeon eunhaenge meonjeo sin-gohaseyo | If you lose your card, report it to the bank first. | 카드=kadeu=card ; 먼저=meonjeo=first"], "경찰이나 관청에 알리다"),
  word("경찰서 | gyeongchalsseo | police station", [
   "경찰서에 가서 물어봤어요. | gyeongchalsseo-e gaseo mureobwasseoyo | I went to the police station and asked. | 물어보다=mureoboda=to ask",
   "경찰서는 밤에도 열려 있어요. | gyeongchalsseoneun bamedo yeollyeo isseoyo | The police station is open at night too. | 밤=bam=night ; 열리다=yeollida=to be open",
   "잃어버린 여권은 경찰서에 신고해요. | ireobeorin yeogwoneun gyeongchalsseo-e sin-gohaeyo | You report a lost passport to the police. | 여권=yeogwon=passport"], "경찰이 일하는 곳"),
  word("응급실 | eunggeupssil | emergency room", [
   "밤에 아파서 응급실에 갔어요. | bame apaseo eunggeupssire gasseoyo | I got sick at night and went to the ER. | 아프다=apeuda=to be sick",
   "응급실은 스물네 시간 열어요. | eunggeupssireun seumulle sigan yeoreoyo | The ER is open 24 hours. | 스물네 시간=seumulle sigan=24 hours",
   "응급실은 병원비가 더 비싸요. | eunggeupssireun byeongwonbiga deo bissayo | The ER is more expensive. | 병원비=byeongwonbi=hospital bill ; 비싸다=bissada=to be expensive"], "급한 환자를 보는 병원 방"),
  word("구급차 | gugeupcha | ambulance", [
   "구급차를 불러 주세요! | gugeupchareul bulleo juseyo! | Please call an ambulance! | 부르다=bureuda=to call",
   "일일구에 전화하면 구급차가 와요. | irilgue jeonhwahamyeon gugeupchaga wayo | If you call 119, an ambulance comes. | 전화하다=jeonhwahada=to call (on the phone)",
   "구급차는 돈을 안 내요. | gugeupchaneun doneul an naeyo | You don't pay for the ambulance. | 돈=don=money ; 내다=naeda=to pay"], "아픈 사람을 병원으로 옮기는 차")],
 [dline("존", "민하 씨, 큰일 났어요. 지갑을 잃어버렸어요. | minha ssi, keunil nasseoyo jigabeul ireobeoryeosseoyo | Minha, I'm in trouble. I lost my wallet. | 큰일 나다=keunil nada=to be in big trouble ; 지갑=jigap=wallet"),
  dline("민하", "어디에서 잃어버렸어요? | eodieseo ireobeoryeosseoyo? | Where did you lose it? | 잃어버리다=ireobeorida=to lose"),
  dline("존", "도서관에서요. 카드도 지갑에 있어요. | doseogwaneseoyo kadeudo jigabe isseoyo | At the library. My card is in the wallet too. | 도서관=doseogwan=library"),
  dline("민하", "먼저 은행에 카드 분실 신고를 하세요. | meonjeo eunhaenge kadeu bunsil sin-goreul haseyo | First report the lost card to the bank. | 분실=bunsil=loss ; 신고=sin-go=report"),
  dline("존", "네. 그다음에는요? | ne geuda-eumeneunyo? | OK. And then? | 그다음=geuda-eum=after that"),
  dline("민하", "학생회관 분실물 센터에 가 봐요. 같이 가요. | haksaenghoegwan bunsilmul senteo-e ga bwayo gachi gayo | Let's check the lost and found at the student union. Let's go together. | 분실물 센터=bunsilmul senteo=lost and found ; 같이=gachi=together")],
 [['"emergency room"을 한국어로?', "응급실"], ['"분실물 센터"의 뜻은?', "lost and found"], ["불이 나거나 많이 다쳤을 때 거는 번호는? 112 / 119", "119"]],
 [["경찰은 112, 불이 나거나 구급차가 필요하면 119에 전화합니다. 외국어 통역도 됩니다.", "Call 112 for the police, and 119 for fire or an ambulance. Interpretation in foreign languages is available."],
  ["생활에 도움이 필요하면 1345(외국인종합안내센터)에 전화해서 영어로 물어볼 수 있습니다.", "If you need help with daily life, call 1345 (Immigration Contact Center) and ask in English."]]),

lesson("K4-N-05", "생활 앱", 2, "낱말",
 ["한국 생활에 꼭 필요한 앱과 관련된 말입니다.", "Words about the apps you need for daily life in Korea."],
 [word("카카오톡 | kakaotok | KakaoTalk (messenger app)", [
   "카카오톡 아이디가 뭐예요? | kakaotok aidiga mwoyeyo? | What's your KakaoTalk ID? | 아이디=aidi=ID",
   "조별 과제는 카카오톡으로 이야기해요. | jobyeol gwajeneun kakaotogeuro iyagihaeyo | We discuss group projects on KakaoTalk. | 조별 과제=jobyeol gwaje=group project ; 이야기하다=iyagihada=to talk",
   "교수님이 카카오톡 단체방을 만드셨어요. | gyosunimi kakaotok dancheppangeul mandeusyeosseoyo | The professor made a KakaoTalk group chat. | 단체방=dancheppang=group chat ; 만들다=mandeulda=to make"], "한국 사람이 많이 쓰는 메신저"),
  word("지도 앱 | jido aep | map app", [
   "지도 앱으로 길을 찾아요. | jido aebeuro gireul chajayo | I find my way with a map app. | 길=gil=way ; 찾다=chatta=to find",
   "한국에서는 네이버 지도나 카카오맵을 많이 써요. | han-gugeseoneun neibeo jidona kakaomaebeul mani sseoyo | In Korea, people often use Naver Map or KakaoMap. | 네이버=neibeo=Naver ; 카카오맵=kakaomaep=KakaoMap",
   "지도 앱에서 버스 도착 시간도 볼 수 있어요. | jido aebeseo beoseu dochak sigando bol su isseoyo | You can also see bus arrival times in the map app. | 도착=dochak=arrival ; 시간=sigan=time"], "길을 찾는 앱"),
  word("배달 앱 | baedal aep | delivery app", [
   "배달 앱으로 치킨을 시켰어요. | baedal aebeuro chikineul sikyeosseoyo | I ordered chicken with a delivery app. | 치킨=chikin=fried chicken ; 시키다=sikida=to order",
   "배달 앱에 기숙사 주소를 넣으세요. | baedal aebe gisuksa jusoreul neoeuseyo | Put the dorm address in the delivery app. | 주소=juso=address ; 넣다=neota=to put in",
   "배달비가 삼천 원이에요. | baedalbiga samcheon wonieyo | The delivery fee is 3,000 won. | 배달비=baedalbi=delivery fee"], "음식을 시키는 앱"),
  word("교통 카드 | gyotong kadeu | transit card", [
   "교통 카드를 충전했어요. | gyotong kadeureul chungjeonhaesseoyo | I topped up my transit card. | 충전하다=chungjeonhada=to top up",
   "편의점에서 교통 카드를 팔아요. | pyeonijeomeseo gyotong kadeureul parayo | Convenience stores sell transit cards. | 편의점=pyeonijeom=convenience store ; 팔다=palda=to sell",
   "교통 카드를 찍고 버스에 타요. | gyotong kadeureul jjikko beoseu-e tayo | Tap your transit card and get on the bus. | 찍다=jjikta=to tap (a card) ; 타다=tada=to ride"], "버스와 지하철을 탈 때 쓰는 카드"),
  word("간편 결제 | ganpyeon gyeoljje | mobile payment", [
   "간편 결제로 낼게요. | ganpyeon gyeoljjero naelkkeyo | I'll pay by mobile payment. | 내다=naeda=to pay",
   "간편 결제를 쓰려면 카드를 등록해야 해요. | ganpyeon gyeoljjereul sseuryeomyeon kadeureul deungnokaeya haeyo | To use mobile payment, you need to register a card. | 등록하다=deungnokada=to register",
   "간편 결제는 빠르고 편해요. | ganpyeon gyeoljjeneun ppareugo pyeonhaeyo | Mobile payment is fast and convenient. | 빠르다=ppareuda=to be fast ; 편하다=pyeonhada=to be convenient"], "휴대폰으로 쉽게 돈을 내는 것"),
  word("알림 | allim | notification", [
   "학교 앱 알림을 켜 두세요. | hakkyo aep allimeul kyeo duseyo | Keep the school app notifications on. | 켜다=kyeoda=to turn on",
   "휴강 알림이 왔어요. | hyugang allimi wasseoyo | A class cancellation notice came. | 휴강=hyugang=class cancellation",
   "알림이 너무 많아서 껐어요. | allimi neomu manaseo kkeosseoyo | There were too many notifications, so I turned them off. | 너무=neomu=too ; 많다=manta=to be many ; 끄다=kkeuda=to turn off"], "앱이 알려 주는 소식")],
 [dline("샘", "민하 씨, 한국에서 꼭 필요한 앱이 뭐예요? | minha ssi, han-gugeseo kkok piryohan aebi mwoyeyo? | Minha, what apps are essential in Korea? | 꼭=kkok=definitely ; 필요하다=piryohada=to be needed"),
  dline("민하", "먼저 카카오톡이요. 다 카카오톡으로 연락해요. | meonjeo kakaotogiyo da kakaotogeuro yeollakaeyo | KakaoTalk first. Everyone keeps in touch on KakaoTalk. | 연락하다=yeollakada=to contact"),
  dline("샘", "길 찾을 때는요? | gil chajeul ttaeneunyo? | And for finding the way? | 길=gil=way ; 찾다=chatta=to find"),
  dline("민하", "네이버 지도를 쓰세요. 버스 시간도 나와요. | neibeo jidoreul sseuseyo beoseu sigando nawayo | Use Naver Map. It shows bus times too. | 지도=jido=map"),
  dline("샘", "밥은 배달 앱으로 시키면 돼요? | babeun baedal aebeuro sikimyeon dwaeyo? | Can I order food with a delivery app? | 배달 앱=baedal aep=delivery app ; 시키다=sikida=to order"),
  dline("민하", "네, 기숙사 주소를 정확하게 넣으세요. | ne, gisuksa jusoreul jeonghwakage neoeuseyo | Yes, enter the dorm address exactly. | 정확하게=jeonghwakage=exactly ; 주소=juso=address")],
 [['"transit card"를 한국어로?', "교통 카드"], ['"간편 결제"의 뜻은?', "mobile payment"], ["한국 사람이 많이 쓰는 메신저는? 카카오톡 / 하이코리아", "카카오톡"]],
 [["한국에서는 구글 지도보다 네이버 지도나 카카오맵을 많이 씁니다. 버스와 지하철 시간이 더 정확합니다.", "In Korea, people use Naver Map or KakaoMap more than Google Maps. Bus and subway times are more accurate."],
  ["배달 앱과 간편 결제는 휴대폰 본인 인증이 필요한 경우가 많습니다.", "Delivery apps and mobile payment often need phone identity verification."]]),
]

K4D4 = lesson("K4-D-04", "휴학과 복학", 2, "낱말",
 ["학교를 잠시 쉬거나 다시 다닐 때, 성적을 고칠 때 쓰는 말입니다.", "Words for taking a break from school, coming back, and correcting grades."],
 [word("휴학 | hyuhak | leave of absence", [
   "한 학기 휴학하려고 해요. | han hakki hyuhakaryeogo haeyo | I'm planning to take one semester off. | 학기=hakki=semester ; -려고 하다=-ryeogo hada=to plan to",
   "휴학하면 비자가 어떻게 돼요? | hyuhakamyeon bijaga eotteoke dwaeyo? | What happens to my visa if I take a leave? | 비자=bija=visa",
   "휴학 신청은 학과 사무실에서 해요. | hyuhak sincheongeun hakkwa samusireseo haeyo | You apply for leave at the department office. | 학과 사무실=hakkwa samusil=department office"], "학교를 잠시 쉬는 것"),
  word("복학 | bokak | returning to school", [
   "다음 학기에 복학할 거예요. | da-eum hakkie bokakal kkeoyeyo | I'll return to school next semester. | 다음=da-eum=next ; 학기=hakki=semester",
   "복학 신청 기간을 확인하세요. | bokak sincheong giganeul hwaginhaseyo | Check the application period for returning. | 기간=gigan=period ; 확인하다=hwaginhada=to check",
   "군대에 다녀와서 복학한 선배가 있어요. | gundae-e danyeowaseo bokakan seonbaega isseoyo | There's a senior who came back to school after military service. | 군대=gundae=military ; 선배=seonbae=senior (at school)"], "쉬던 학교에 다시 다님"),
  word("휴학계 | hyuhakkye | leave of absence form", [
   "휴학계를 냈어요. | hyuhakkyereul naesseoyo | I submitted a leave of absence form. | 내다=naeda=to submit",
   "휴학계에 지도 교수님 서명이 필요해요. | hyuhakkye-e jido gyosunim seomyeongi piryohaeyo | The form needs your advisor's signature. | 지도 교수=jido gyosu=academic advisor ; 서명=seomyeong=signature",
   "휴학계는 인터넷으로도 낼 수 있어요. | hyuhakkyeneun inteoneseurodo nael su isseoyo | You can submit the form online too. | 인터넷=inteonet=internet"], "휴학을 신청하는 서류"),
  word("재수강 | jaesugang | retaking a course", [
   "이 과목은 재수강해야 해요. | i gwamogeun jaesuganghaeya haeyo | I have to retake this course. | 과목=gwamok=course",
   "재수강하면 성적이 올라갈 수 있어요. | jaesuganghamyeon seongjeogi ollagal su isseoyo | Retaking can raise your grade. | 성적=seongjeok=grade ; 올라가다=ollagada=to go up",
   "재수강은 수강 신청할 때 해요. | jaesugangeun sugang sincheonghal ttae haeyo | You sign up for a retake during course registration. | 수강 신청=sugang sincheong=course registration"], "들었던 과목을 다시 듣는 것"),
  word("성적 정정 | seongjeok jeongjeong | grade correction", [
   "성적 정정 기간이 언제예요? | seongjeok jeongjeong gigani eonjeyeyo? | When is the grade correction period? | 기간=gigan=period ; 언제=eonje=when",
   "출석 점수가 틀려서 성적 정정을 신청했어요. | chulsseok jjeomsuga teullyeoseo seongjeok jeongjeongeul sincheonghaesseoyo | My attendance score was wrong, so I asked for a grade correction. | 출석=chulseok=attendance ; 점수=jeomsu=score ; 틀리다=teullida=to be wrong",
   "성적 정정은 교수님께 이메일로 부탁드려요. | seongjeok jeongjeongeun gyosunimkke imeillo butaktteuryeoyo | You ask the professor for a correction by e-mail. | 이메일=imeil=e-mail ; 부탁드리다=butaktteurida=to ask (polite)"], "잘못된 성적을 고치는 것"),
  word("학적 | hakjjeok | student status (record)", [
   "학적 문제는 학사 지원팀에 물어보세요. | hakjjeok munjeneun haksa jiwontime mureoboseyo | Ask the academic affairs team about student status. | 문제=munje=problem ; 학사 지원팀=haksa jiwontim=academic affairs team",
   "휴학하면 학적이 휴학생으로 바뀌어요. | hyuhakamyeon hakjjeogi hyuhaksaengeuro bakkwi-eoyo | If you take leave, your status changes to \"on leave\". | 휴학생=hyuhaksaeng=student on leave ; 바뀌다=bakkwida=to change",
   "졸업하려면 학적에 문제가 없어야 해요. | joreoparyeomyeon hakjjeoge munjega eopseoya haeyo | To graduate, your student record must have no problems. | 졸업하다=joreopada=to graduate ; 문제=munje=problem"], "학생으로서의 기록")],
 [dline("존", "교수님, 다음 학기에 휴학하고 싶어요. | gyosunim, da-eum hakkie hyuhakago sipeoyo | Professor, I'd like to take a leave next semester. | 휴학하다=hyuhakada=to take a leave of absence"),
  dline("교수님", "무슨 일이 있어요? | museun iri isseoyo? | Is something wrong? | 무슨 일=museun il=what matter"),
  dline("존", "집에 일이 있어서 고향에 가야 해요. | jibe iri isseoseo gohyange gaya haeyo | Something happened at home, so I have to go back to my country. | 고향=gohyang=hometown"),
  dline("교수님", "그래요. 휴학계를 내고 국제교류원에도 꼭 알리세요. | geuraeyo hyuhakkyereul naego gukjjegyoryuwonedo kkok alliseyo | I see. Submit the leave form and be sure to tell the International Office too. | 휴학계=hyuhakkye=leave of absence form ; 국제교류원=gukjjegyoryuwon=International Office"),
  dline("존", "비자는 어떻게 돼요? | bijaneun eotteoke dwaeyo? | What about my visa? | 비자=bija=visa"),
  dline("교수님", "휴학하면 비자가 바뀔 수 있으니까 꼭 먼저 물어보세요. | hyuhakamyeon bijaga bakkwil su isseunikka kkok meonjeo mureoboseyo | Your visa can change if you take leave, so be sure to ask first. | 바뀌다=bakkwida=to change ; 먼저=meonjeo=first")],
 [['"leave of absence"를 한국어로?', "휴학"], ['"재수강"의 뜻은?', "retaking a course"], ["쉬던 학교에 다시 다니는 것은? 복학 / 휴학", "복학"]],
 [["유학생(D-2)이 휴학하면 체류 자격에 문제가 생길 수 있습니다. 휴학 전에 꼭 국제교류원과 상담하세요.", "If an international student (D-2) takes a leave of absence, it can affect their visa status. Always talk to the International Office before taking leave."],
  ["성적은 정정 기간 안에만 고칠 수 있습니다. 성적이 나오면 바로 확인하세요.", "Grades can only be corrected during the correction period. Check your grades as soon as they come out."]])

# ---------------------------------------------------------------- LS-A 캠퍼스 방송
LSI = ["학교에서 듣는 안내 방송이에요. 날짜, 시간, 장소를 잘 들어 보세요. 듣는 순서: ❶ 본문 전체 듣기 → ❷ 한 줄씩 다시 듣기 → ❸ 단어 → ❹ 확인 문제.",
       "Announcements you hear at school. Listen carefully for dates, times and places. Order: ❶ Listen to the whole text → ❷ Listen line by line → ❸ Words → ❹ Quiz."]


def ann(code, t, lines, words, qz, tp):
    b = lesson(code, t, 2, "듣기", LSI, words, [dline("", l) for l in lines], qz, tp)
    b["mv"] = []
    return b


LSA = [
ann("LS-A-01", "수강 신청 안내",
 ["학생 여러분께 수강 신청 일정을 알려 드립니다. | haksaeng yeoreobunkke sugang sincheong iljeongeul allyeo deurimnida | Students, here is the course registration schedule. | 수강 신청=sugang sincheong=course registration ; 일정=iljeong=schedule ; 알려 드리다=allyeo deurida=to inform (honorific)",
  "수강 신청은 이월 십오 일 오전 열 시에 시작합니다. | sugang sincheongeun iwol sibo il ojeon yeol sie sijakamnida | Registration starts on February 15 at 10 a.m. | 이월=iwol=February ; 오전=ojeon=a.m. ; 시작하다=sijakada=to start",
  "학교 홈페이지에 로그인해서 신청하세요. | hakkyo hompeijie rogeuinhaeseo sincheonghaseyo | Log in to the school website and register. | 홈페이지=hompeiji=website ; 로그인하다=rogeuinhada=to log in",
  "인기 있는 과목은 빨리 마감되니까 미리 시간표를 짜 두세요. | inkki inneun gwamogeun ppalli magamdoenikka miri siganpyoreul jja duseyo | Popular courses fill up fast, so plan your timetable in advance. | 인기=inkki=popularity ; 마감되다=magamdoeda=to close ; 시간표=siganpyo=timetable ; 짜다=jjada=to plan (a timetable)",
  "영어 트랙 학생은 영어 강의를 먼저 확인하세요. | yeongeo teuraek haksaengeun yeongeo gang-ireul meonjeo hwaginhaseyo | English-track students, check the English-taught courses first. | 영어 트랙=yeongeo teuraek=English track ; 강의=gang-i=lecture",
  "문제가 있으면 학사 지원팀으로 연락하세요. | munjega isseumyeon haksa jiwontimeuro yeollakaseyo | If you have problems, contact the academic affairs team. | 문제=munje=problem ; 학사 지원팀=haksa jiwontim=academic affairs team ; 연락하다=yeollakada=to contact"],
 [word("수강 신청 | sugang sincheong | course registration", [
   "수강 신청을 벌써 했어요? | sugang sincheongeul beolsseo haesseoyo? | Have you already registered for courses? | 벌써=beolsseo=already",
   "수강 신청이 너무 어려워요. | sugang sincheongi neomu eoryeowoyo | Course registration is so hard. | 어렵다=eoryeopta=to be difficult"]),
  word("일정 | iljeong | schedule", [
   "시험 일정이 나왔어요. | siheom iljeongi nawasseoyo | The exam schedule is out. | 시험=siheom=exam ; 나오다=na-oda=to come out",
   "이번 주 일정이 너무 바빠요. | ibeon ju iljeongi neomu bappayo | My schedule this week is so busy. | 바쁘다=bappeuda=to be busy"]),
  word("마감 | magam | deadline, closing", [
   "신청 마감이 내일이에요. | sincheong magami naeirieyo | The application deadline is tomorrow. | 신청=sincheong=application ; 내일=naeil=tomorrow",
   "그 과목은 벌써 마감됐어요. | geu gwamogeun beolsseo magamdwaesseoyo | That course is already full. | 과목=gwamok=course ; 벌써=beolsseo=already"]),
  word("시간표 | siganpyo | timetable", [
   "이번 학기 시간표를 짰어요. | ibeon hakki siganpyoreul jjasseoyo | I made my timetable for this semester. | 학기=hakki=semester ; 짜다=jjada=to plan (a timetable)",
   "월요일에 수업이 너무 많아요. | woryoire su-eobi neomu manayo | I have too many classes on Monday. | 월요일=woryoil=Monday ; 수업=su-eop=class"]),
  word("연락하다 | yeollakada | to contact", [
   "늦으면 미리 연락하세요. | neujeumyeon miri yeollakaseyo | If you're late, contact us in advance. | 늦다=neutta=to be late ; 미리=miri=in advance",
   "교수님께 이메일로 연락했어요. | gyosunimkke imeillo yeollakaesseoyo | I contacted the professor by e-mail. | 이메일=imeil=e-mail"])],
 [["수강 신청은 언제 시작해요?", "이월 십오 일 오전 열 시"], ["어디에서 신청해요?", "학교 홈페이지"], ["문제가 있으면 어디로 연락해요?", "학사 지원팀"]],
 [["한국 대학교에서는 인기 과목이 아주 빨리 마감돼서 '수강 신청 전쟁'이라고도 해요.", "At Korean universities, popular courses fill up so fast that people call it the 'course registration war'."],
  ["'-니까'는 이유를 말할 때 써요: 빨리 마감되니까 미리 짜 두세요.", "'-니까' gives a reason: they close fast, so plan ahead."]]),

ann("LS-A-02", "기숙사 안내 방송",
 ["기숙사생 여러분, 안내 말씀 드립니다. | gisuksasaeng yeoreobun, annae malsseum deurimnida | Dorm residents, here is an announcement. | 기숙사생=gisuksasaeng=dorm resident ; 안내=annae=notice ; 말씀 드리다=malsseum deurida=to say (humble)",
  "오늘 밤 열 시부터 열두 시까지 온수가 나오지 않습니다. | oneul bam yeol sibuteo yeoldu sikkaji onsuga na-oji ansseumnida | There will be no hot water tonight from 10 to 12. | 온수=onsu=hot water ; 나오다=na-oda=to come out",
  "보일러 점검이 있기 때문입니다. | boilleo jeomgeomi itkki ttaemunimnida | This is because of a boiler inspection. | 보일러=boilleo=boiler ; 점검=jeomgeom=inspection",
  "샤워는 그 전에 해 주시기 바랍니다. | syawoneun geu jeone hae jusigi baramnida | Please take your shower before then. | 샤워=syawo=shower ; 전=jeon=before ; -기 바랍니다=-gi baramnida=please (formal)",
  "그리고 내일 아침 아홉 시에 소방 훈련이 있습니다. | geurigo naeil achim ahop sie sobang hullyeoni itsseumnida | Also, there is a fire drill tomorrow at 9 a.m. | 소방 훈련=sobang hullyeon=fire drill",
  "경보가 울리면 계단으로 나와 주세요. | gyeongboga ullimyeon gyedaneuro nawa juseyo | When the alarm rings, come out by the stairs. | 경보=gyeongbo=alarm ; 울리다=ullida=to ring ; 계단=gyedan=stairs"],
 [word("기숙사생 | gisuksasaeng | dorm resident", [
   "기숙사생은 열두 시까지 들어와야 해요. | gisuksasaengeun yeoldu sikkaji deureowaya haeyo | Dorm residents must come back by 12. | 들어오다=deureo-oda=to come in",
   "기숙사생 회의가 있어요. | gisuksasaeng hoeiga isseoyo | There's a dorm residents' meeting. | 회의=hoei=meeting"]),
  word("온수 | onsu | hot water", [
   "온수가 안 나와요. | onsuga an nawayo | There's no hot water. | 나오다=na-oda=to come out",
   "아침에는 온수가 잘 나와요. | achimeneun onsuga jal nawayo | Hot water comes well in the morning. | 아침=achim=morning"]),
  word("점검 | jeomgeom | inspection", [
   "오늘 엘리베이터 점검이 있어요. | oneul ellibeiteo jeomgeomi isseoyo | There's an elevator inspection today. | 엘리베이터=ellibeiteo=elevator",
   "방 점검 때 방을 깨끗하게 해 두세요. | bang jeomgeom ttae bangeul kkaekkeutage hae duseyo | Keep your room clean for the room inspection. | 방=bang=room ; 깨끗하다=kkaekkeutada=to be clean"]),
  word("훈련 | hullyeon | drill, training", [
   "소방 훈련에 꼭 참여하세요. | sobang hullyeone kkok chamyeohaseyo | Be sure to take part in the fire drill. | 참여하다=chamyeohada=to take part",
   "훈련은 삼십 분쯤 걸려요. | hullyeoneun samsip bunjjeum geollyeoyo | The drill takes about 30 minutes. | 걸리다=geollida=to take (time)"]),
  word("계단 | gyedan | stairs", [
   "계단으로 올라가요. | gyedaneuro ollagayo | I go up by the stairs. | 올라가다=ollagada=to go up",
   "불이 나면 엘리베이터 말고 계단을 쓰세요. | buri namyeon ellibeiteo malgo gyedaneul sseuseyo | In a fire, use the stairs, not the elevator. | 불이 나다=buri nada=a fire breaks out ; 말고=malgo=not ... but"])],
 [["오늘 밤 몇 시부터 온수가 안 나와요?", "열 시부터 열두 시까지"], ["왜 온수가 안 나와요?", "보일러 점검"], ["소방 훈련 때 어디로 나와요?", "계단"]],
 [["'-기 바랍니다'는 방송에서 '-세요'보다 더 정중하게 부탁할 때 써요.", "'-기 바랍니다' is a more formal way than '-세요' to ask something in announcements."],
  ["한국 기숙사는 보통 통금 시간이 있고, 방 점검도 해요.", "Korean dormitories usually have a curfew and room inspections."]]),

ann("LS-A-03", "축제 안내",
 ["전주대학교 가을 축제에 여러분을 초대합니다! | jeonjudaehakkyo ga-eul chukjjee yeoreobuneul chodaehamnida! | We invite you to the Jeonju University autumn festival! | 가을=ga-eul=autumn ; 축제=chukjje=festival ; 초대하다=chodaehada=to invite",
  "축제는 시월 이십 일부터 사흘 동안 열립니다. | chukjjeneun siwol isip ilbuteo saheul dongan yeollimnida | The festival runs for three days from October 20. | 시월=siwol=October ; 사흘=saheul=three days ; 열리다=yeollida=to be held",
  "낮에는 학과별 부스와 푸드 트럭이 있습니다. | najeneun hakkwabyeol buseuwa pudeu teureogi itsseumnida | During the day there are department booths and food trucks. | 낮=nat=daytime ; 부스=buseu=booth ; 푸드 트럭=pudeu teureok=food truck",
  "저녁 일곱 시에는 운동장에서 공연이 시작됩니다. | jeonyeok ilgop sieneun undongjangeseo gongyeoni sijakttoemnida | In the evening at 7, the concert starts on the sports field. | 저녁=jeonyeok=evening ; 운동장=undongjang=sports field ; 공연=gongyeon=concert, show",
  "유학생 부스에서는 여러 나라 음식을 팝니다. | yuhaksaeng buseueseoneun yeoreo nara eumsigeul pamnida | The international students' booth sells food from many countries. | 유학생=yuhaksaeng=international student ; 나라=nara=country ; 팔다=palda=to sell",
  "친구들과 함께 꼭 오세요! | chin-gudeulgwa hamkke kkok oseyo! | Be sure to come with your friends! | 함께=hamkke=together ; 꼭=kkok=be sure to"],
 [word("축제 | chukjje | festival", [
   "축제 때 가수가 와요. | chukjje ttae gasuga wayo | A singer comes during the festival. | 가수=gasu=singer",
   "축제에서 떡볶이를 팔았어요. | chukjjeeseo tteokbokkireul parasseoyo | We sold tteokbokki at the festival. | 떡볶이=tteokbokki=tteokbokki (spicy rice cakes)"]),
  word("초대하다 | chodaehada | to invite", [
   "친구를 생일 파티에 초대했어요. | chin-gureul saengil patie chodaehaesseoyo | I invited my friend to my birthday party. | 생일=saengil=birthday ; 파티=pati=party",
   "초대해 주셔서 감사합니다. | chodaehae jusyeoseo gamsahamnida | Thank you for inviting me. | 감사하다=gamsahada=to thank"]),
  word("부스 | buseu | booth", [
   "우리 학과 부스에 놀러 오세요. | uri hakkwa buseue nolleo oseyo | Come visit our department's booth. | 학과=hakkwa=department ; 놀러 오다=nolleo oda=to come and hang out",
   "부스에서 게임을 했어요. | buseueseo geimeul haesseoyo | We played a game at the booth. | 게임=geim=game"]),
  word("공연 | gongyeon | performance, concert", [
   "공연이 정말 멋있었어요. | gongyeoni jeongmal meosisseosseoyo | The concert was really cool. | 멋있다=meositta=to be cool",
   "공연 표를 샀어요. | gongyeon pyoreul sasseoyo | I bought a concert ticket. | 표=pyo=ticket"]),
  word("사흘 | saheul | three days", [
   "사흘 동안 비가 왔어요. | saheul dongan biga wasseoyo | It rained for three days. | 동안=dongan=for (a time) ; 비=bi=rain",
   "시험이 사흘 남았어요. | siheomi saheul namasseoyo | The exam is three days away. | 남다=namda=to remain"])],
 [["축제는 며칠 동안 해요?", "사흘"], ["공연은 몇 시에 어디에서 시작해요?", "저녁 일곱 시, 운동장"], ["유학생 부스에서는 뭘 팔아요?", "여러 나라 음식"]],
 [["'하루, 이틀, 사흘, 나흘'은 날을 세는 고유어예요.", "'하루, 이틀, 사흘, 나흘' are native Korean words for counting days (1, 2, 3, 4 days)."],
  ["한국 대학교 축제에는 유명한 가수가 와서 공연을 자주 해요.", "Famous singers often perform at Korean university festivals."]]),

ann("LS-A-04", "학생 식당 메뉴",
 ["오늘의 학생 식당 메뉴를 알려 드립니다. | oneure haksaeng siktang menyureul allyeo deurimnida | Here is today's cafeteria menu. | 오늘=oneul=today ; 학생 식당=haksaeng siktang=student cafeteria ; 메뉴=menyu=menu",
  "점심 메뉴는 비빔밥과 미역국입니다. | jeomsim menyuneun bibimppapkkwa miyeokkugimnida | Lunch is bibimbap and seaweed soup. | 점심=jeomsim=lunch ; 비빔밥=bibimbap=bibimbap ; 미역국=miyeokguk=seaweed soup",
  "고기를 안 드시는 학생을 위해 채식 메뉴도 있습니다. | gogireul an deusineun haksaengeul wihae chaesik menyudo itsseumnida | There is also a vegetarian menu for students who don't eat meat. | 고기=gogi=meat ; 드시다=deusida=to eat (honorific) ; 채식=chaesik=vegetarian food",
  "가격은 한 그릇에 오천 원입니다. | gagyeogeun han geureuse ocheon wonimnida | The price is 5,000 won per bowl. | 가격=gagyeok=price ; 그릇=geureut=bowl",
  "식당은 열한 시 반부터 한 시 반까지 운영합니다. | siktangeun yeoran si banbuteo han si bankkaji unyeonghamnida | The cafeteria is open from 11:30 to 1:30. | 반=ban=half ; 운영하다=unyeonghada=to operate",
  "학생증을 보여 주시면 오백 원 할인됩니다. | haksaengjjeungeul boyeo jusimyeon obaek won harindoemnida | Show your student ID for 500 won off. | 학생증=haksaengjjeung=student ID ; 할인되다=harindoeda=to be discounted"],
 [word("메뉴 | menyu | menu", [
   "오늘 메뉴가 뭐예요? | oneul menyuga mwoyeyo? | What's on the menu today? | 오늘=oneul=today",
   "메뉴를 보고 고를게요. | menyureul bogo goreulkkeyo | I'll look at the menu and choose. | 고르다=goreuda=to choose"]),
  word("채식 | chaesik | vegetarian food", [
   "저는 채식을 해요. | jeoneun chaesigeul haeyo | I'm vegetarian. | 저=jeo=I (polite)",
   "채식 메뉴가 있어요? | chaesik menyuga isseoyo? | Is there a vegetarian menu? | 메뉴=menyu=menu"]),
  word("가격 | gagyeok | price", [
   "가격이 싸고 맛있어요. | gagyeogi ssago masisseoyo | It's cheap and tasty. | 싸다=ssada=to be cheap ; 맛있다=masitta=to be tasty",
   "가격이 올랐어요. | gagyeogi ollasseoyo | The price went up. | 오르다=oreuda=to go up"]),
  word("운영하다 | unyeonghada | to run, to operate", [
   "도서관은 밤 열 시까지 운영해요. | doseogwaneun bam yeol sikkaji unyeonghaeyo | The library is open until 10 p.m. | 도서관=doseogwan=library",
   "방학에는 식당을 운영하지 않아요. | banghageneun siktangeul unyeonghaji anayo | The cafeteria is closed during vacation. | 방학=banghak=vacation"]),
  word("할인 | harin | discount", [
   "학생 할인이 돼요? | haksaeng harini dwaeyo? | Is there a student discount? | 학생=haksaeng=student",
   "할인 받아서 사천오백 원에 먹었어요. | harin badaseo sacheonobaek wone meogeosseoyo | I got the discount and ate for 4,500 won. | 받다=batta=to receive ; 먹다=meokta=to eat"])],
 [["오늘 점심 메뉴는 뭐예요?", "비빔밥과 미역국"], ["식당은 몇 시까지 해요?", "한 시 반"], ["학생증을 보여 주면 얼마예요?", "사천오백 원"]],
 [["학생 식당은 줄여서 '학식'이라고 많이 말해요.", "Students often shorten 학생 식당 to '학식'."],
  ["'드시다'는 '먹다'의 높임말이에요.", "'드시다' is the honorific form of '먹다' (to eat)."]]),

ann("LS-A-05", "셔틀버스 안내",
 ["셔틀버스 이용 안내입니다. | syeoteulbeoseu iyong annaeimnida | This is information about the shuttle bus. | 셔틀버스=syeoteulbeoseu=shuttle bus ; 이용=iyong=use",
  "셔틀버스는 전주역과 학교 사이를 다닙니다. | syeoteulbeoseuneun jeonjuyeokkwa hakkyo saireul danimnida | The shuttle runs between Jeonju Station and the school. | 전주역=jeonjuyeok=Jeonju Station ; 사이=sai=between ; 다니다=danida=to run (go back and forth)",
  "아침 여덟 시부터 삼십 분마다 출발합니다. | achim yeodeol ssibuteo samsip bunmada chulbalhamnida | It leaves every 30 minutes from 8 a.m. | -마다=-mada=every ; 출발하다=chulbalhada=to depart",
  "요금은 무료이고, 학생증을 찍고 타면 됩니다. | yogeumeun muryoigo, haksaengjjeungeul jjikko tamyeon doemnida | It's free; just tap your student ID and get on. | 요금=yogeum=fare ; 무료=muryo=free ; 찍다=jjikta=to tap (a card)",
  "타는 곳은 학생회관 앞 정류장입니다. | taneun goseun haksaenghoegwan ap jjeongnyujangimnida | The stop is in front of the student union. | 학생회관=haksaenghoegwan=student union ; 정류장=jeongnyujang=bus stop",
  "주말과 공휴일에는 운행하지 않습니다. | jumalgwa gonghyuireneun unhaenghaji ansseumnida | It does not run on weekends and holidays. | 주말=jumal=weekend ; 공휴일=gonghyuil=public holiday ; 운행하다=unhaenghada=to run (a vehicle)"],
 [word("셔틀버스 | syeoteulbeoseu | shuttle bus", [
   "셔틀버스를 타고 역에 갔어요. | syeoteulbeoseureul tago yeoge gasseoyo | I took the shuttle bus to the station. | 역=yeok=station",
   "셔틀버스가 방금 떠났어요. | syeoteulbeoseuga banggeum tteonasseoyo | The shuttle just left. | 방금=banggeum=just now ; 떠나다=tteonada=to leave"]),
  word("출발하다 | chulbalhada | to depart", [
   "기차가 몇 시에 출발해요? | gichaga myeot sie chulbalhaeyo? | What time does the train leave? | 기차=gicha=train",
   "우리 내일 아침에 출발해요. | uri naeil achime chulbalhaeyo | We leave tomorrow morning. | 내일=naeil=tomorrow"]),
  word("무료 | muryo | free (of charge)", [
   "이 행사는 무료예요. | i haengsaneun muryoyeyo | This event is free. | 행사=haengsa=event",
   "기숙사 와이파이는 무료예요. | gisuksa waipaineun muryoyeyo | The dorm Wi-Fi is free. | 와이파이=waipai=Wi-Fi"]),
  word("정류장 | jeongnyujang | bus stop", [
   "정류장에서 버스를 기다려요. | jeongnyujangeseo beoseureul gidaryeoyo | I wait for the bus at the stop. | 기다리다=gidarida=to wait",
   "다음 정류장에서 내리세요. | da-eum jeongnyujangeseo naeriseyo | Get off at the next stop. | 내리다=naerida=to get off"]),
  word("공휴일 | gonghyuil | public holiday", [
   "공휴일에는 수업이 없어요. | gonghyuireneun su-eobi eopseoyo | There are no classes on public holidays. | 수업=su-eop=class",
   "다음 주 월요일은 공휴일이에요. | da-eum ju woryoireun gonghyuirieyo | Next Monday is a public holiday. | 월요일=woryoil=Monday"])],
 [["셔틀버스는 어디와 어디 사이를 다녀요?", "전주역과 학교"], ["몇 분마다 출발해요?", "삼십 분마다"], ["주말에도 운행해요?", "아니요"]],
 [["'-마다'는 '매번, 같은 간격으로'라는 뜻이에요: 삼십 분마다, 날마다.", "'-마다' means 'every': 삼십 분마다 (every 30 minutes), 날마다 (every day)."],
  ["버스 안내에서는 '운행하다'를, 가게 안내에서는 '영업하다'를 자주 들어요.", "You often hear '운행하다' (to run) for buses and '영업하다' (to be open) for shops."]]),

ann("LS-A-06", "장학금 공지",
 ["국제교류원에서 장학금 신청을 안내합니다. | gukjjegyoryuwoneseo janghakkeum sincheongeul annaehamnida | The International Office announces scholarship applications. | 국제교류원=gukjjegyoryuwon=International Office ; 장학금=janghakkeum=scholarship ; 안내하다=annaehada=to inform",
  "이번 장학금은 성적 우수 유학생을 위한 장학금입니다. | ibeon janghakkeumeun seongjeok usu yuhaksaengeul wihan janghakkeumimnida | This scholarship is for international students with excellent grades. | 성적=seongjeok=grades ; 우수=usu=excellent",
  "지난 학기 평균 학점이 삼 점 오 이상이어야 합니다. | jinan hakki pyeonggyun hakjjeomi sam jjeom o isangieoya hamnida | Your GPA last semester must be 3.5 or higher. | 지난=jinan=last ; 평균 학점=pyeonggyun hakjjeom=GPA ; 이상=isang=or more",
  "토픽 성적표도 함께 내 주세요. | topik seongjeokpyodo hamkke nae juseyo | Please also submit your TOPIK score report. | 토픽=topik=TOPIK ; 성적표=seongjeokpyo=score report",
  "신청 기간은 삼월 이 일부터 십 일까지입니다. | sincheong giganeun samwol i ilbuteo sip ilkkajiimnida | The application period is from March 2 to 10. | 기간=gigan=period ; 삼월=samwol=March",
  "자세한 내용은 학교 홈페이지 공지 사항을 보세요. | jasehan naeyongeun hakkyo hompeiji gongji sahangeul boseyo | For details, see the notices on the school website. | 자세하다=jasehada=to be detailed ; 내용=naeyong=content ; 공지 사항=gongji sahang=notice"],
 [word("장학금 | janghakkeum | scholarship", [
   "장학금을 받았어요! | janghakkeumeul badasseoyo! | I got a scholarship! | 받다=batta=to receive",
   "장학금 덕분에 등록금이 반이에요. | janghakkeum deokbune deungnokkeumi banieyo | Thanks to the scholarship, my tuition is half. | 덕분에=deokbune=thanks to ; 등록금=deungnokkeum=tuition"]),
  word("평균 | pyeonggyun | average", [
   "평균 점수가 몇 점이에요? | pyeonggyun jeomsuga myeot jjeomieyo? | What's the average score? | 점수=jeomsu=score",
   "이번 시험 평균이 높아요. | ibeon siheom pyeonggyuni nopayo | The average on this exam is high. | 높다=nopta=to be high"]),
  word("학점 | hakjjeom | credit; grade (GPA)", [
   "이번 학기에 십팔 학점을 들어요. | ibeon hakkie sippal hakjjeomeul deureoyo | I'm taking 18 credits this semester. | 듣다=deutta=to take (a class)",
   "학점이 좋아야 장학금을 받아요. | hakjjeomi joaya janghakkeumeul badayo | You need good grades to get a scholarship. | 장학금=janghakkeum=scholarship"]),
  word("이상 | isang | or more", [
   "열 명 이상 오면 시작해요. | yeol myeong isang omyeon sijakaeyo | We'll start when ten or more people come. | 명=myeong=people (counter)",
   "출석이 팔십 퍼센트 이상이어야 해요. | chulsseogi palsip peosenteu isangieoya haeyo | Attendance must be 80 percent or more. | 출석=chulseok=attendance ; 퍼센트=peosenteu=percent"]),
  word("공지 사항 | gongji sahang | notice", [
   "공지 사항을 꼭 읽으세요. | gongji sahangeul kkok ilgeuseyo | Be sure to read the notices. | 읽다=ikta=to read",
   "휴강은 공지 사항에 올라와요. | hyugangeun gongji sahange ollawayo | Class cancellations are posted in the notices. | 휴강=hyugang=class cancellation ; 올라오다=olla-oda=to be posted"])],
 [["이 장학금은 누구를 위한 거예요?", "성적 우수 유학생"], ["평균 학점이 얼마 이상이어야 해요?", "삼 점 오"], ["신청 기간은 언제예요?", "삼월 이 일부터 십 일까지"]],
 [["'학점'은 '수업 단위(credit)'와 '성적(grade)' 두 뜻으로 다 써요.", "'학점' is used for both 'credits' and 'grades (GPA)'."],
  ["장학금 공지는 보통 학교 홈페이지와 국제교류원 카카오톡 채널에 올라와요.", "Scholarship notices are usually posted on the school website and the International Office's KakaoTalk channel."]]),

ann("LS-A-07", "건강 검진 안내",
 ["보건실에서 신입생 건강 검진을 안내합니다. | bogeonsireseo sinipsaeng geon-gang geomjineul annaehamnida | The health center announces health check-ups for new students. | 보건실=bogeonsil=health center ; 신입생=sinipsaeng=new student ; 건강 검진=geon-gang geomjin=health check-up",
  "검진은 다음 주 월요일부터 수요일까지 학생회관 이 층에서 합니다. | geomjineun da-eum ju woryoilbuteo suyoilkkaji haksaenghoegwan i cheungeseo hamnida | Check-ups are Monday to Wednesday next week on the 2nd floor of the student union. | 검진=geomjin=check-up ; 층=cheung=floor",
  "검진 전날 밤 아홉 시부터는 아무것도 드시지 마세요. | geomjin jeonnal bam ahop sibuteoneun amugeotto deusiji maseyo | Do not eat anything from 9 p.m. the night before. | 전날=jeonnal=the day before ; 아무것도=amugeotto=nothing ; 드시다=deusida=to eat (honorific)",
  "물은 조금 마셔도 괜찮습니다. | mureun jogeum masyeodo gwaenchansseumnida | A little water is fine. | 물=mul=water ; 마시다=masida=to drink ; 괜찮다=gwaenchanta=to be okay",
  "결과는 이 주 뒤에 이메일로 보내 드립니다. | gyeolgwaneun i ju dwie imeillo bonae deurimnida | Results will be sent by e-mail two weeks later. | 결과=gyeolgwa=result ; 보내 드리다=bonae deurida=to send (honorific)",
  "검진은 무료이니 꼭 받으세요. | geomjineun muryoini kkok badeuseyo | The check-up is free, so be sure to get it. | 무료=muryo=free ; 받다=batta=to receive"],
 [word("보건실 | bogeonsil | health center (school clinic)", [
   "머리가 아파서 보건실에 갔어요. | meoriga apaseo bogeonsire gasseoyo | I had a headache, so I went to the health center. | 머리=meori=head ; 아프다=apeuda=to hurt",
   "보건실에서 약을 받았어요. | bogeonsireseo yageul badasseoyo | I got medicine at the health center. | 약=yak=medicine"]),
  word("검진 | geomjin | check-up", [
   "일 년에 한 번 검진을 받아요. | il lyeone han beon geomjineul badayo | I get a check-up once a year. | 일 년=il lyeon=a year",
   "검진 결과가 좋아요. | geomjin gyeolgwaga joayo | My check-up results are good. | 결과=gyeolgwa=result"]),
  word("전날 | jeonnal | the day before", [
   "시험 전날에는 일찍 자요. | siheom jeonnareneun iljjik jayo | I go to bed early the day before an exam. | 일찍=iljjik=early ; 자다=jada=to sleep",
   "여행 전날에 짐을 쌌어요. | yeohaeng jeonnare jimeul ssasseoyo | I packed the day before the trip. | 여행=yeohaeng=trip ; 짐을 싸다=jimeul ssada=to pack"]),
  word("아무것도 | amugeotto | nothing (with a negative)", [
   "아침에 아무것도 안 먹었어요. | achime amugeotto an meogeosseoyo | I didn't eat anything this morning. | 아침=achim=morning",
   "아무것도 모르겠어요. | amugeotto moreugesseoyo | I don't understand anything. | 모르다=moreuda=to not know"]),
  word("결과 | gyeolgwa | result", [
   "시험 결과가 나왔어요. | siheom gyeolgwaga nawasseoyo | The exam results are out. | 시험=siheom=exam",
   "결과는 문자로 알려 줘요. | gyeolgwaneun munjaro allyeo jwoyo | They let you know the result by text. | 문자=munja=text message"])],
 [["건강 검진은 어디에서 해요?", "학생회관 이 층"], ["검진 전날 몇 시부터 먹으면 안 돼요?", "밤 아홉 시"], ["결과는 어떻게 받아요?", "이메일"]],
 [["'-아도/어도 괜찮다'는 해도 된다는 뜻이에요: 물은 마셔도 괜찮습니다.", "'-아도/어도 괜찮다' means something is allowed: 물은 마셔도 괜찮습니다 (it's fine to drink water)."],
  ["학교 보건실에서는 간단한 약을 무료로 받을 수 있어요.", "At the school health center, you can get simple medicine for free."]]),

ann("LS-A-08", "외국인 등록 단체 신청",
 ["신입 유학생 여러분, 국제교류원에서 알려 드립니다. | sinip yuhaksaeng yeoreobun, gukjjegyoryuwoneseo allyeo deurimnida | New international students, this is a notice from the International Office. | 신입=sinip=new (student) ; 국제교류원=gukjjegyoryuwon=International Office",
  "외국인 등록을 학교에서 단체로 신청할 수 있습니다. | oegugin deungnogeul hakkyo-eseo danchero sincheonghal su itsseumnida | You can apply for alien registration as a group through the school. | 외국인 등록=oegugin deungnok=alien registration ; 단체=danche=group",
  "여권, 사진 한 장, 수수료 삼만 원을 준비하세요. | yeogwon, sajin han jang, susuryo samman woneul junbihaseyo | Prepare your passport, one photo and the 30,000 won fee. | 여권=yeogwon=passport ; 장=jang=sheet (counter) ; 수수료=susuryo=fee ; 준비하다=junbihada=to prepare",
  "다음 주 수요일까지 국제교류원 사무실에 내 주세요. | da-eum ju suyoilkkaji gukjjegyoryuwon samusire nae juseyo | Submit them to the International Office by next Wednesday. | 수요일=suyoil=Wednesday ; 사무실=samusil=office",
  "등록증은 한 달쯤 뒤에 학교로 옵니다. | deungnokjjeungeun han daljjeum dwie hakkyoro omnida | Your card will arrive at the school in about a month. | 등록증=deungnokjjeung=registration card ; 뒤=dwi=after",
  "그동안 여권을 꼭 가지고 다니세요. | geudongan yeogwoneul kkok gajigo daniseyo | Meanwhile, be sure to carry your passport. | 그동안=geudongan=meanwhile ; 가지고 다니다=gajigo danida=to carry around"],
 [word("신입생 | sinipsaeng | freshman, new student", [
   "신입생 환영회가 있어요. | sinipsaeng hwanyeonghoega isseoyo | There's a welcome party for new students. | 환영회=hwanyeonghoe=welcome party",
   "저는 올해 신입생이에요. | jeoneun olhae sinipsaengieyo | I'm a freshman this year. | 올해=olhae=this year"]),
  word("단체 | danche | group", [
   "단체 사진을 찍었어요. | danche sajineul jjigeosseoyo | We took a group photo. | 사진=sajin=photo ; 찍다=jjikta=to take (a photo)",
   "단체로 가면 할인돼요. | danchero gamyeon harindwaeyo | There's a discount if you go as a group. | 할인되다=harindoeda=to be discounted"]),
  word("준비하다 | junbihada | to prepare", [
   "발표를 준비하고 있어요. | balpyoreul junbihago isseoyo | I'm preparing a presentation. | 발표=balpyo=presentation",
   "필요한 서류를 다 준비했어요. | piryohan seoryureul da junbihaesseoyo | I've prepared all the documents I need. | 서류=seoryu=documents"]),
  word("사무실 | samusil | office", [
   "사무실은 몇 층이에요? | samusireun myeot cheungieyo? | What floor is the office on? | 층=cheung=floor",
   "점심시간에는 사무실이 문을 닫아요. | jeomsimsiganeneun samusiri muneul dadayo | The office closes at lunchtime. | 점심시간=jeomsimsigan=lunchtime ; 닫다=datta=to close"]),
  word("그동안 | geudongan | meanwhile; all this time", [
   "그동안 잘 지냈어요? | geudongan jal jinaesseoyo? | How have you been? | 지내다=jinaeda=to get along",
   "그동안 도와주셔서 감사합니다. | geudongan dowajusyeoseo gamsahamnida | Thank you for all your help. | 도와주다=dowajuda=to help"])],
 [["외국인 등록을 어떻게 신청할 수 있어요?", "학교에서 단체로"], ["수수료는 얼마예요?", "삼만 원"], ["등록증이 나올 때까지 뭘 가지고 다녀요?", "여권"]],
 [["외국인 등록은 한국에 온 지 구십 일 안에 해야 해요.", "Alien registration must be done within 90 days of arriving in Korea."],
  ["'그동안 잘 지냈어요?'는 오랜만에 만난 사람에게 하는 인사예요.", "'그동안 잘 지냈어요?' is a greeting for someone you haven't seen in a while."]]),

ann("LS-A-09", "언어 교환 모집",
 ["한국 학생과 유학생이 함께하는 언어 교환 프로그램 참가자를 모집합니다. | han-guk haksaenggwa yuhaksaengi hamkkehaneun eoneo gyohwan peurogeuraem chamgajareul mojipamnida | We are recruiting participants for a language exchange program for Korean and international students. | 언어 교환=eoneo gyohwan=language exchange ; 참가자=chamgaja=participant ; 모집하다=mojipada=to recruit",
  "일주일에 한 번, 한 시간씩 만나서 서로 언어를 가르쳐 줍니다. | iljjuire han beon, han siganssik mannaseo seoro eoneoreul gareuchyeo jumnida | You meet once a week for an hour and teach each other your languages. | 일주일=iljjuil=a week ; -씩=-ssik=each ; 서로=seoro=each other ; 가르치다=gareuchida=to teach",
  "한국어를 배우고 싶은 유학생은 누구나 신청할 수 있습니다. | han-gugeoreul baeugo sipeun yuhaksaengeun nuguna sincheonghal su itsseumnida | Any international student who wants to learn Korean can apply. | 배우다=baeuda=to learn ; 누구나=nuguna=anyone",
  "열 번 이상 참여하면 활동 증명서를 드립니다. | yeol beon isang chamyeohamyeon hwaldong jeungmyeongseoreul deurimnida | If you take part ten or more times, you get a certificate of participation. | 참여하다=chamyeohada=to take part ; 활동=hwaldong=activity ; 증명서=jeungmyeongseo=certificate",
  "신청은 이번 달 말까지 이메일로 하세요. | sincheongeun ibeon dal malkkaji imeillo haseyo | Apply by e-mail by the end of this month. | 이번 달=ibeon dal=this month ; 말=mal=end",
  "좋은 친구도 사귀고 한국어 실력도 키워 보세요! | joeun chin-gudo sagwigo han-gugeo sillyeoktto kiwo boseyo! | Make good friends and build your Korean skills! | 사귀다=sagwida=to make (friends) ; 실력=sillyeok=skill ; 키우다=kiuda=to build up"],
 [word("모집하다 | mojipada | to recruit", [
   "동아리에서 새 회원을 모집해요. | dongarieseo sae hoewoneul mojipaeyo | The club is recruiting new members. | 동아리=dongari=club ; 회원=hoewon=member",
   "아르바이트생을 모집합니다. | areuba-iteusaengeul mojipamnida | We are hiring part-timers. | 아르바이트생=areuba-iteusaeng=part-time worker"]),
  word("참가자 | chamgaja | participant", [
   "참가자가 오십 명이에요. | chamgajaga osip myeongieyo | There are 50 participants. | 명=myeong=people (counter)",
   "참가자는 이름표를 다세요. | chamgajaneun ireumpyoreul daseyo | Participants, please wear a name tag. | 이름표=ireumpyo=name tag ; 달다=dalda=to put on (a tag)"]),
  word("서로 | seoro | each other", [
   "우리는 서로 도와요. | urineun seoro dowayo | We help each other. | 돕다=dopda=to help",
   "서로 이름을 물어봤어요. | seoro ireumeul mureobwasseoyo | We asked each other's names. | 물어보다=mureoboda=to ask"]),
  word("실력 | sillyeok | skill, ability", [
   "한국어 실력이 많이 늘었어요. | han-gugeo sillyeogi mani neureosseoyo | My Korean has improved a lot. | 늘다=neulda=to improve",
   "친구는 요리 실력이 좋아요. | chin-guneun yori sillyeogi joayo | My friend is a good cook. | 요리=yori=cooking"]),
  word("사귀다 | sagwida | to make (friends); to date", [
   "한국 친구를 많이 사귀고 싶어요. | han-guk chin-gureul mani sagwigo sipeoyo | I want to make many Korean friends. | 친구=chin-gu=friend",
   "동아리에서 친구를 사귀었어요. | dongarieseo chin-gureul sagwi-eosseoyo | I made friends at the club. | 동아리=dongari=club"])],
 [["언어 교환은 얼마나 자주 만나요?", "일주일에 한 번"], ["누가 신청할 수 있어요?", "한국어를 배우고 싶은 유학생 누구나"], ["어떻게 신청해요?", "이메일"]],
 [["'-씩'은 같은 양을 나눌 때 써요: 한 시간씩, 두 개씩.", "'-씩' shows an equal amount each time: 한 시간씩 (an hour each), 두 개씩 (two each)."],
  ["언어 교환은 한국 친구를 사귀는 가장 쉬운 방법 중 하나예요.", "Language exchange is one of the easiest ways to make Korean friends."]]),

ann("LS-A-10", "졸업식 안내",
 ["이번 학기 졸업식을 안내합니다. | ibeon hakki joreopsigeul annaehamnida | Here is information about this semester's graduation ceremony. | 졸업식=joreopsik=graduation ceremony ; 안내하다=annaehada=to inform",
  "졸업식은 이월 이십오 일 오전 열한 시, 대강당에서 열립니다. | joreopsigeun iwol isibo il ojeon yeoran si, daegangdangeseo yeollimnida | The ceremony is on February 25 at 11 a.m. in the main auditorium. | 대강당=daegangdang=main auditorium ; 열리다=yeollida=to be held",
  "졸업 가운은 학과 사무실에서 빌릴 수 있습니다. | joreop gauneun hakkwa samusireseo billil su itsseumnida | You can borrow a graduation gown at the department office. | 가운=gaun=gown ; 빌리다=billida=to borrow",
  "가족과 친구도 함께 참석할 수 있습니다. | gajokkwa chin-gudo hamkke chamseokal su itsseumnida | Family and friends can also attend. | 가족=gajok=family ; 참석하다=chamseokada=to attend",
  "졸업 증명서는 졸업식 다음 날부터 뗄 수 있습니다. | joreop jeungmyeongseoneun joreopsik da-eum nalbuteo ttel su itsseumnida | You can get your graduation certificate from the day after the ceremony. | 졸업 증명서=joreop jeungmyeongseo=graduation certificate ; 떼다=tteda=to get (a certificate)",
  "졸업생 여러분, 진심으로 축하합니다! | joreopsaeng yeoreobun, jinsimeuro chukahamnida! | Graduates, congratulations from the bottom of our hearts! | 졸업생=joreopsaeng=graduate ; 진심으로=jinsimeuro=sincerely ; 축하하다=chukahada=to congratulate"],
 [word("졸업식 | joreopsik | graduation ceremony", [
   "졸업식에 부모님이 오세요. | joreopsige bumonimi oseyo | My parents are coming to the graduation. | 부모님=bumonim=parents",
   "졸업식 날 사진을 많이 찍었어요. | joreopsik nal sajineul mani jjigeosseoyo | We took many photos on graduation day. | 날=nal=day"]),
  word("참석하다 | chamseokada | to attend", [
   "회의에 참석할 수 있어요? | hoeie chamseokal su isseoyo? | Can you attend the meeting? | 회의=hoei=meeting",
   "바빠서 참석하지 못했어요. | bappaseo chamseokaji motaesseoyo | I was busy, so I couldn't attend. | 바쁘다=bappeuda=to be busy ; 못하다=motada=can't"]),
  word("빌리다 | billida | to borrow, to rent", [
   "친구한테 우산을 빌렸어요. | chin-guhante usaneul billyeosseoyo | I borrowed an umbrella from a friend. | -한테=-hante=from (a person) ; 우산=usan=umbrella",
   "노트북을 빌릴 수 있어요? | noteubugeul billil su isseoyo? | Can I borrow a laptop? | 노트북=noteubuk=laptop"]),
  word("증명서 | jeungmyeongseo | certificate", [
   "증명서를 떼러 왔어요. | jeungmyeongseoreul ttereo wasseoyo | I came to get a certificate. | 떼다=tteda=to get (a certificate)",
   "증명서가 영어로도 나와요? | jeungmyeongseoga yeongeorodo nawayo? | Is the certificate available in English too? | 영어=yeongeo=English"]),
  word("축하하다 | chukahada | to congratulate", [
   "졸업 축하해요! | joreop chukahaeyo! | Congratulations on your graduation! | 졸업=joreop=graduation",
   "친구의 합격을 축하했어요. | chin-gue hapkkyeogeul chukahaesseoyo | I congratulated my friend on passing. | 합격=hapkkyeok=passing (an exam)"])],
 [["졸업식은 언제, 어디에서 해요?", "이월 이십오 일, 대강당"], ["졸업 가운은 어디에서 빌려요?", "학과 사무실"], ["졸업 증명서는 언제부터 뗄 수 있어요?", "졸업식 다음 날"]],
 [["'증명서를 떼다'는 '증명서를 발급받다'라는 뜻으로 자주 써요.", "'증명서를 떼다' commonly means 'to get a certificate issued'."],
  ["한국 졸업식에서는 꽃다발을 선물하고 학사모를 던지며 사진을 찍어요.", "At Korean graduations, people give bouquets and take photos throwing their caps."]]),
]

ORDER = ["K4-B", "K4-N", "K4-I", "K4-M", "K4-C", "K4-A", "K4-D", "K4-E", "K4-F", "K4-G", "K4-H", "K4-K", "K4-J", "K4-L"]   # a student's year

if __name__ == "__main__":
    k4 = [b for b in json.load(open(D("K4"))) if not b["code"].startswith("K4-N-") and b["code"] != "K4-D-04"]
    k4 += K4N + [K4D4]
    assert {b["code"][:4] for b in k4} == set(ORDER), {b["code"][:4] for b in k4} ^ set(ORDER)
    k4.sort(key=lambda b: (ORDER.index(b["code"][:4]), b["code"]))
    json.dump(k4, open(D("K4"), "w"), ensure_ascii=False, separators=(",", ":"))
    ls = json.load(open(D("LS")))
    new = {b["code"]: b for b in LSA}
    ls = [new.get(b["code"], b) for b in ls]
    assert all(b in ls for b in LSA)
    json.dump(ls, open(D("LS"), "w"), ensure_ascii=False, separators=(",", ":"))
    k2 = json.load(open(D("K2")))
    for b in k2:
        if b["code"] == "K2-G-04":
            b["t"] = "함께 사는 생활"
            b["i"] = ["룸메이트나 이웃과 같이 살 때 쓰는 말입니다. 기숙사 생활은 '대학 생활 > 주거'에 더 있습니다.", "Words for living with roommates and neighbors. More about dormitory life is in University Life > Housing."]
    json.dump(k2, open(D("K2"), "w"), ensure_ascii=False, separators=(",", ":"))
    print("K4", len(k4), "LS-A", len(LSA))
