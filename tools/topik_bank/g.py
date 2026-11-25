"""TP-G 어휘·문법: new bank questions (v1.17). Right answer written first; tools/topik_bank.py shuffles the choices."""
from common import Q

def W(word, o, x):   # meaning of a word (choices in English)
    return Q(o, 0, x, p=f'<span class="ko">{word}</span>', lo=True)

def B(p, o, x):      # grammar or word in the blank
    return Q(o, 0, x, p=p)

ADD = {
"TP-G-01": [
 W("가볍다", ["Light (not heavy)", "Heavy", "Cheap", "Bright"], "가볍다 = light. 무겁다 = heavy."),
 W("갈아타다", ["To transfer (bus, subway)", "To get off", "To wait", "To walk"], "갈아타다 = to change to another bus or train."),
 W("빌리다", ["To borrow", "To lend", "To buy", "To return"], "빌리다 = to borrow; 빌려주다 = to lend."),
 W("시끄럽다", ["Noisy", "Quiet", "Dirty", "Busy"], "시끄럽다 = noisy. 조용하다 = quiet."),
 W("늦잠", ["Oversleeping", "A nap", "Staying up late", "Getting up early"], "늦잠을 자다 = to oversleep."),
],
"TP-G-02": [
 B("주말에 친구를 (  ) 영화를 봤어요.", ["만나서", "만나지만", "만나면", "만나러"], "Sequence (met, then watched) → -아서/어서."),
 B("저는 매운 음식을 잘 (  ).", ["못 먹어요", "안 먹고 싶어요", "먹지 마세요", "먹을까요"], "Can't (ability) → 못."),
 B("도서관에서 (  ) 안 돼요.", ["떠들면", "떠들어서", "떠들고", "떠들지만"], "Not allowed → -(으)면 안 돼요."),
 B("내일 비가 (  ) 우산을 가져가세요.", ["올 것 같으니까", "왔으니까", "오지만", "오고"], "Guess + advice → -(으)ㄹ 것 같으니까."),
 B("한국에 온 (  ) 육 개월이 됐어요.", ["지", "때", "후", "동안"], "Time since → -(으)ㄴ 지 (time) 되다."),
],
"TP-G-03": [
 B("시험 기간이라서 도서관에 자리가 (  ).", ["없을 정도이다", "없느라고", "없더라도", "없는 대신에"], "So much that … → -(으)ㄹ 정도이다."),
 B("친구가 (  ) 저도 그 수업을 신청했어요.", ["추천해 줘서", "추천하더라도", "추천하느라고", "추천하는 대신에"], "Reason (someone did it for me) → -아/어 줘서."),
 B("이번 학기에는 장학금을 (  ) 열심히 공부하고 있어요.", ["받기 위해서", "받는 바람에", "받다가", "받더니"], "Purpose → -기 위해서."),
 B("밥을 (  ) 전화가 와서 받았어요.", ["먹다가", "먹더라도", "먹기 위해서", "먹을 뿐만 아니라"], "Doing A, then B interrupts → -다가."),
 B("처음에는 어려웠는데 자꾸 (  ) 익숙해졌어요.", ["하다 보니까", "하느라고", "하더라도", "하는 대신에"], "By doing it again and again → -다 보니까."),
],
"TP-G-04": [
 B("열심히 준비했으니까 좋은 결과가 (  ).", ["나올 것이다", "나올 리가 없다", "나오는 셈이다", "나올 뻔했다"], "Confident prediction → -(으)ㄹ 것이다."),
 B("유학 생활이 힘들 (  ) 배우는 것도 많다.", ["뿐만 아니라", "텐데", "까 봐", "만큼"], "Not only hard but also … → -(으)ㄹ 뿐만 아니라."),
 B("늦을 (  ) 택시를 탔다.", ["까 봐", "만큼", "텐데", "수록"], "Afraid that … → -(으)ㄹ까 봐."),
 B("한국어는 배울(  ) 재미있다.", ["수록", "까 봐", "텐데", "만큼은"], "The more … the more → -(으)ㄹ수록."),
 B("이번 일은 경험이 많은 선배에게 (  ) 좋겠다.", ["맡기는 편이", "맡길 뻔해서", "맡기는 바람에", "맡기느라고"], "It would be better to … → -는 편이 좋겠다."),
],
"TP-G-05": [
 W("증가", ["Increase", "Decrease", "Stop", "Result"], "증 (add) → 증가 = increase. 감소 = decrease."),
 W("실시하다", ["To carry out", "To cancel", "To delay", "To report"], "실시하다 = to put into action (a survey, a test)."),
 W("대책", ["A countermeasure", "A cause", "A complaint", "A rumour"], "대책 = a plan to deal with a problem."),
 W("급증", ["A sharp rise", "A slow fall", "No change", "A small rise"], "급 (sudden) + 증 (increase) → 급증."),
 W("발표하다", ["To announce", "To hide", "To ask", "To forget"], "발표하다 = to announce (news), to present (class)."),
],
"TP-G-06": [
 B("저는 커피(  ) 차를 더 좋아해요.", ["보다", "처럼", "만", "까지"], "Comparison → -보다."),
 B("이 책은 학생(  ) 쉽게 읽을 수 있어요.", ["도", "보다", "에서", "이나"], "Even students → -도."),
 B("열 시(  ) 기숙사에 들어와야 해요.", ["까지", "부터", "에서", "마다"], "By (a deadline) → -까지."),
 B("방학(  ) 고향에 가요.", ["마다", "처럼", "보다", "에게"], "Every vacation → -마다."),
 B("동생(  ) 선물을 줬어요.", ["에게", "에서", "으로", "와"], "Giving to a person → -에게."),
],
"TP-G-07": [
 W("손이 크다", ["Generous (gives or cooks a lot)", "Has big hands", "Strong", "Rich"], "손이 크다 = to be generous, to make or give a lot."),
 W("눈코 뜰 새 없다", ["Extremely busy", "Very sleepy", "Very angry", "Very bored"], "No time to open your eyes and nose → extremely busy."),
 W("하늘의 별 따기", ["Very hard to get", "Very easy", "A dream come true", "Very expensive"], "Picking a star from the sky → nearly impossible."),
 W("작심삼일", ["A resolution that lasts only three days", "Working three days a week", "Thinking carefully", "A three-day holiday"], "작심 (decision) + 삼일 (three days) → it doesn't last."),
 W("귀가 얇다", ["Easily persuaded", "Hears well", "Doesn't listen", "Shy"], "귀가 얇다 = easily believes what others say."),
],
}
