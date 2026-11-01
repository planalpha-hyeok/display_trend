# display_trend — 업계 동향 정기 리포트

(주)가이드삼정·프로젝터바이 취급 제품군의 업계 동향·트렌드·전망을 정기적으로 자동 작성합니다.

## 리포트 종류

| 종류 | 주기 | 실행 시각 (한국시간) | 저장 위치 |
|---|---|---|---|
| 주간 디테일 | 매주 월요일 | 08:40 시작 → 09:00 전후 완료 | `reports/weekly/` |
| 월간 요약 | 매월 1일 | 09:20 시작 | `reports/monthly/` |
| 분기 전망 | 1·4·7·10월 1일 | 09:50 시작 (같은 날 월간 리포트 완료 후) | `reports/quarterly/` |

## 전달 방법

- GitHub: 이 저장소 `reports/` 폴더 (Markdown 원본 + 게시판용 .txt)
- Google Drive: `디스플레이 동향 리포트` 폴더 (Google 문서)
- 알림: 완료 시 휴대폰 푸시 + 이메일 (Claude 계정 이메일)

## 폴더 구조

| 경로 | 역할 |
|---|---|
| `config/products.md` | 대상 제품군·브랜드 목록 |
| `config/scope.md` | 국내/국제 비중, 포함·제외 기준 |
| `config/sources.md` | 참고 정보원 목록 |
| `config/delivery.md` | 저장 경로, 파일명, Drive 폴더 ID, 알림 규칙 |
| `templates/` | 리포트 종류별 서식 |
| `prompts/` | 예약 작업(Routine)이 따르는 작업 절차 |
| `reports/` | 생성된 리포트 |

## 설정 변경 방법

제품·범위·서식을 바꾸려면 `config/` 또는 `templates/` 파일만 수정하면 됩니다.
예약 작업은 실행할 때마다 이 파일들을 새로 읽으므로 다음 실행부터 반영됩니다.
