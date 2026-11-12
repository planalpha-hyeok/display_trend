# 월간 요약 발행 절차

`prompts/publish_common.md` 를 따른다. 아래는 월간만의 규칙이다.

- 대상 기간: 직전 달 1일 ~ 말일. 실행일은 매월 1일(한국시간).
  수집: `python3 tools/collect_gnews.py <직전 달 1일> <이번 달 1일> /tmp/news.json`
- 먼저 `docs/weekly/` 에서 대상 기간에 해당하는 주간 호의 `content.js` 를 모두 읽어 기본 자료로 쓴다. 빠진 부분만 추가 수집한다.
- 호 이름(폴더): `docs/monthly/<대상 달 YYYY-MM>/`
- `type: "monthly"`, `cover.briefTitle: "이달의 핵심 5줄"`, 핵심 5줄.
- 섹션 구성 (샘플: `docs/monthly/2026-10/content.js` 참고):
  1. TOP FIVE — `issues` 5건 (무엇이 / 왜 중요한가 / 우리 회사 영향)
  2. BY PRODUCT — `table` 제품군별 한 달 요약, 영향 배지(high/mid/low)
  3. KOREA MARKET — `feature` (split)
  4. GLOBAL MARKET — `feature` (grid)
  5. NEW ARRIVALS — `table` 브랜드 / 제품 / 구분 / 날짜 / 출처(링크 셀 `{text, url}`)
  6. NEXT MONTH — `table` 다음 달 일정 + `closing`
- 플로우 알림: 1·4·7·10월이면 건너뛴다(분기 발행이 함께 보냄). `publish_common.md` 5단계.
