# 분기 전망 발행 절차

`prompts/publish_common.md` 를 따른다. 아래는 분기만의 규칙이다.

- 실행일: 1·4·7·10월 1일(한국시간). 회고 대상 = 직전 분기, 전망 대상 = 실행일이 속한 분기.
- 먼저 `docs/monthly/` 와 `docs/weekly/` 에서 직전 분기 호를 읽는다. 같은 날 월간 호가 아직 없으면 기다리지 말고 있는 자료로 작성하고, 표지 footnote 에 그 사실을 적는다.
  추가 수집: `python3 tools/collect_gnews.py <직전 분기 첫날> <실행일> /tmp/news.json`
  조사기관 공개 전망, 제조사 발표, 정책·법 시행 일정을 별도로 검색한다.
- 호 이름(폴더): `docs/quarterly/<전망 대상 분기 YYYY-QN>/` (예: 2027-Q1)
- `type: "quarterly"`, `issue.titleSolid: "OUTLOOK"`, `cover.briefTitle: "분기 요약 5줄"`, `cover.footnote` 에 "전망은 공개 자료를 근거로 한 추정" 문구.
- 섹션 구성 (샘플: `docs/quarterly/2026-Q4/content.js` 참고):
  1. Q? REVIEW — `issues` 직전 분기 핵심 변화 5건
  2. Q? OUTLOOK — `outlook` 제품군별 카드: now / next / basis(근거 링크) / confidence(high/mid/low)
  3. RISK & CHANCE — `table` 구분 / 내용 / 영향 제품군 / 대응 아이디어
  4. Q? CALENDAR — `table` 분기 일정 + `closing`
- 근거 없는 전망은 쓰지 않는다. 추정에는 "(추정)"을 붙인다.
