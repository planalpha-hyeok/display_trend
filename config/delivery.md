# 저장·전달 규칙

## GitHub
- 저장소: `planalpha-hyeok/display_trend`
- 브랜치: `ccr-8f07b9c9-ec53uj`
- 파일 경로·이름 (날짜는 한국시간 기준 실행일)

| 종류 | Markdown 원본 | 게시판용 텍스트 |
|---|---|---|
| 주간 | `reports/weekly/YYYY/YYYY-MM-DD_주간.md` | `reports/weekly/YYYY/YYYY-MM-DD_주간_게시판용.txt` |
| 월간 | `reports/monthly/YYYY/YYYY-MM_월간.md` | `reports/monthly/YYYY/YYYY-MM_월간_게시판용.txt` |
| 분기 | `reports/quarterly/YYYY/YYYY-QN_분기.md` | `reports/quarterly/YYYY/YYYY-QN_분기_게시판용.txt` |

- 두 파일을 한 커밋으로 올린다 (`mcp__github__push_files`).
- 커밋 메시지: `리포트: <종류> <기간>` (예: `리포트: 주간 2026-11-02`)

## Google Drive
- 상위 폴더: `디스플레이 동향 리포트` (ID `17_h0ysXBuyPxzaoUS3eCOx1bzTP_p8ag`)

| 종류 | 폴더 이름 | 폴더 ID |
|---|---|---|
| 주간 | 1_주간 | `1DPrKP6sbfqPnKtAnonlw4owChK3-wB9Z` |
| 월간 | 2_월간 | `1fWHzxgrYkJWJzO5_8ZzDZiwFekhF3fW4` |
| 분기 | 3_분기 | `1XFbKX82owWSg6K2WcPSLXQJl1EmnoWMs` |

- `mcp__Google_Drive__create_file`로 Markdown 원본을 올린다.
  - `contentMimeType`: `text/markdown`, `textContent`: 리포트 본문, `parentId`: 위 폴더 ID
  - 변환을 끄지 않는다 (Google 문서로 자동 변환되게 둔다).
- 문서 제목: GitHub 파일 이름에서 확장자를 뺀 것 (예: `2026-11-02_주간`)

## 알림
- 예약 작업 설정의 푸시·이메일 알림이 실행 완료 시 자동 발송된다.
- 작업 마지막 응답(최종 요약)은 알림 본문으로 쓰이므로 다음 형식으로 짧게 쓴다.
  - 1줄: 리포트 종류와 기간
  - 3~5줄: 핵심 이슈 요약
  - Google 문서 링크, GitHub 파일 링크
