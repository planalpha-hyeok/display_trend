# display_trend — 업계 동향 정기 리포트

(주)가이드삼정·프로젝터바이 취급 제품군의 업계 동향·트렌드·전망을 정기적으로 자동 작성합니다.

## 보는 곳
**https://planalpha-hyeok.github.io/display_trend/** (주간·월간·분기 최신 호와 전체 목록)

## 리포트 종류

| 종류 | 주기 | 실행 시각 (한국시간) | 주소 |
|---|---|---|---|
| 주간 디테일 | 매주 월요일 | 08:40 시작 → 09:00 전후 발행 | `/weekly/YYYY-MM-DD/` |
| 월간 요약 | 매월 1일 | 09:20 시작 | `/monthly/YYYY-MM/` |
| 분기 전망 | 1·4·7·10월 1일 | 09:50 시작 (같은 날 월간 발행 후) | `/quarterly/YYYY-QN/` |

## 구조
| 경로 | 역할 |
|---|---|
| `config/` | 제품군(products), 범위·작성 원칙(scope), 정보원·수집 방법(sources), 발행 위치(delivery) |
| `prompts/publish_*.md` | 발행용 세션이 따르는 절차 (공통 / 주간 / 월간 / 분기) |
| `tools/` | 자료 수집(Google 뉴스 RSS), 원문 링크 찾기(네이버), 발행 전 점검 |
| `docs/` | GitHub Pages 웹 페이지 (구조는 `docs/assets/README.md`) |
| `templates/` | 예전 Drive 방식 문서 서식 (참고용) |

## 동작 방식
예약 작업(Routine)이 정해진 시각에 **발행용 세션**을 깨운다. 발행용 세션은 이 저장소가 연결돼 있어,
`prompts/publish_*.md` 절차대로 자료 수집 → `docs/` 에 새 호 작성 → 점검 → 푸시 → 휴대폰 푸시 알림을 한다.

## 설정 변경 방법
제품·범위·정보원은 `config/` 파일을, 발행 절차는 `prompts/` 파일을 고치면 다음 실행부터 반영됩니다.
