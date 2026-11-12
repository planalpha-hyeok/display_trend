# 주간 디테일 발행 절차

`prompts/publish_common.md` 를 따른다. 아래는 주간만의 규칙이다.

- 대상 기간: 실행일(월요일, 한국시간) 기준 직전 7일 = 지난주 월요일 ~ 어제 일요일.
  수집: `python3 tools/collect_gnews.py <지난주 월요일> <실행일> /tmp/news.json`
- 호 이름(폴더): `docs/weekly/<실행일 YYYY-MM-DD>/`
- `type: "weekly"`, `cover.briefTitle: "이번 주 핵심 3줄"`, 핵심 3줄.
- `issue`: `date` 예 "NOV 02 2026", `vol` 예 "WEEKLY 2026-W45", `period` 예 "2026.10.26 – 11.01", `side` 예 "GUIDE SAMJUNG DISPLAY TREND · WEEKLY 2026-11-02", `pageTitle` 예 "주간 디테일 2026.10.26 – 11.01 · Guide Samjung Display Trend".
- 섹션 구성(소식이 없는 섹션은 빼고, 대신 FIELD NOTE 의 notes 에 "특이사항 없음: ○○"로 한 줄 남긴다):
  1. HOT ISSUE — 이번 주 가장 중요한 1~2건 (`feature`, layout "split")
  2. LED SIGNAL — 파인피치·실외·컨트롤러 (`feature`, layout "grid")
  3. EPSON BEAM — 프로젝터·프린터
  4. CLASS & MEET — 전자칠판·화상회의
  5. MEDIA ART TECH — 미디어아트 구현 기술·학습·체험
  6. GLOBAL WATCH — 국제 기술·시장·공급망
  7. FIELD NOTE — `notes`(현장 실무 참고), `terms`(용어 풀이 4~6개), `closing`
- 기사 카드 하나: label / title / body 2~4문장 / why(실무 시사점, 있을 때) / src.
- 분량: 섹션당 기사 1~5건, 전체 15~30건.
- 플로우 알림: 실행일이 1일이면 건너뛴다(월간 발행이 함께 보냄). `publish_common.md` 5단계.
