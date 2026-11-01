# display_trend — 업계 동향 정기 리포트

(주)가이드삼정·프로젝터바이 취급 제품군의 업계 동향·트렌드·전망을 정기적으로 자동 작성합니다.

## 리포트 종류

| 종류 | 주기 | 실행 시각 (한국시간) | Drive 저장 폴더 |
|---|---|---|---|
| 주간 디테일 | 매주 월요일 | 08:40 시작 → 09:00 전후 완료 | `1_주간` |
| 월간 요약 | 매월 1일 | 09:20 시작 | `2_월간` |
| 분기 전망 | 1·4·7·10월 1일 | 09:50 시작 (같은 날 월간 리포트 완료 후) | `3_분기` |

## 전달 방법

- Google Drive: `내 드라이브/가이드삼정/project/display_trend` 폴더 (리포트 Google 문서 + 게시판용 .txt)
- 알림: 완료 시 휴대폰 푸시 + 이메일 (Claude 계정 이메일)

예약 작업 세션은 GitHub 저장소에 접근할 수 없어서, 실제 설정은 Drive `0_설정` 폴더의 문서를 사용합니다.
이 저장소의 파일은 그 문서들의 원본 사본입니다.

| 저장소 파일 | Drive `0_설정` 문서 |
|---|---|
| `config/products.md` | config_제품군 |
| `config/scope.md` | config_범위 |
| `config/sources.md` | config_정보원 |
| `config/delivery.md` | config_저장규칙 |
| `templates/weekly.md` / `monthly.md` / `quarterly.md` | template_주간 / 월간 / 분기 |
| `templates/plaintext.md` | template_게시판용 |
| `prompts/common.md` / `weekly.md` / `monthly.md` / `quarterly.md` | procedure_공통 / 주간 / 월간 / 분기 |

## 폴더 구조

| 경로 | 역할 |
|---|---|
| `config/products.md` | 대상 제품군·브랜드 목록 |
| `config/scope.md` | 국내/국제 비중, 포함·제외 기준 |
| `config/sources.md` | 참고 정보원 목록 |
| `config/delivery.md` | 저장 경로, 파일명, Drive 폴더 ID, 알림 규칙 |
| `templates/` | 리포트 종류별 서식 |
| `prompts/` | 예약 작업(Routine)이 따르는 작업 절차 |

## 설정 변경 방법

제품·범위·서식을 바꾸려면 Drive `0_설정` 폴더의 해당 문서를 수정하면 됩니다.
예약 작업은 실행할 때마다 이 문서들을 새로 읽으므로 다음 실행부터 반영됩니다.
(저장소 파일을 고쳐도 예약 작업에는 반영되지 않습니다.)
