# 저장·전달 규칙

저장소는 Google Drive만 사용한다. (예약 작업 세션에서는 GitHub에 접근할 수 없음)

## Google Drive 폴더
- 상위 폴더: `디스플레이 동향 리포트` (ID `17_h0ysXBuyPxzaoUS3eCOx1bzTP_p8ag`)

| 용도 | 폴더 이름 | 폴더 ID |
|---|---|---|
| 설정 | 0_설정 | `1FavjM_w4gVWIJ7RUCa8Dp8SUkw5STlav` |
| 주간 | 1_주간 | `1DPrKP6sbfqPnKtAnonlw4owChK3-wB9Z` |
| 월간 | 2_월간 | `1fWHzxgrYkJWJzO5_8ZzDZiwFekhF3fW4` |
| 분기 | 3_분기 | `1XFbKX82owWSg6K2WcPSLXQJl1EmnoWMs` |

## 파일 이름 (날짜는 한국시간 기준)

| 종류 | 리포트 (Google 문서) | 게시판용 텍스트 (.txt) |
|---|---|---|
| 주간 | `YYYY-MM-DD_주간` (실행일) | `YYYY-MM-DD_주간_게시판용.txt` |
| 월간 | `YYYY-MM_월간` (대상 달) | `YYYY-MM_월간_게시판용.txt` |
| 분기 | `YYYY-QN_분기` (전망 대상 분기) | `YYYY-QN_분기_게시판용.txt` |

## 올리는 방법 (`mcp__Google_Drive__create_file`)
- 리포트: `contentMimeType` = `text/markdown`, `textContent` = 본문, `parentId` = 해당 폴더 ID.
  변환을 끄지 않는다 (Google 문서로 자동 변환되게 둔다).
- 게시판용 텍스트: `contentMimeType` = `text/plain`, `disableConversionToGoogleType` = true.

## 알림
- 예약 작업 설정의 푸시·이메일 알림이 실행 완료 시 자동 발송된다.
- PushNotification 도구를 따로 호출하지 않는다 (알림 중복 방지).
- 최종 응답이 알림 본문으로 쓰이므로 다음 형식으로 짧게 쓴다.
  - 1줄: 리포트 종류와 기간
  - 3~5줄: 핵심 이슈 요약
  - Google 문서 링크
