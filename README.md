# KoJey (코제이) · Korean for JJ Campus Life (전주대 캠퍼스 한국어)

전주대학교 영어트랙 유학생이 한국어를 배우는 웹앱입니다. (Learn Korean: an app for English-track students at Jeonju University.)
라오스어판 KOR Lang(insoo-commits/kor-app)을 바탕으로 만들었습니다. 설명은 영어, 독음은 로마자(실제 소리), 음성은 한국어 + 영어.

- 주소: https://insoo-commits.github.io/kor-app-en/
- 만들기: `src/`와 `data/`를 고친 뒤 `node build.js` (버전은 build.js의 VER)
- 음성: `node build.js` → `python3 tools/tts_gen.py` → `node build.js`
- 영역: 기초회화, 문자학습, 문장규칙, 짝말비교, 비슷한말, 단어가족, 대학생활(전주대), 아르바이트, 듣기연습, TOPIK, 대한민국, 도움말
- tools/korea_*.js, tools/topik*, tools/help_info.js 는 라오스어판에서 온 생성기라 지금 data/KR·TP·HP.json(영어)을 만들지 않습니다. 이 데이터는 data/ 파일이 원본입니다.
