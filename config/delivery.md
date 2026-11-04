# 저장·전달 규칙

## 발행 위치: GitHub Pages
- 첫 화면: https://planalpha-hyeok.github.io/display_trend/
- 원본: 저장소 `planalpha-hyeok/display_trend`, 브랜치 `ccr-8f07b9c9-ec53uj`, 폴더 `docs/`

| 종류 | 폴더 | 주소 |
|---|---|---|
| 주간 | `docs/weekly/YYYY-MM-DD/` (실행일) | `.../display_trend/weekly/YYYY-MM-DD/` |
| 월간 | `docs/monthly/YYYY-MM/` (대상 달) | `.../display_trend/monthly/YYYY-MM/` |
| 분기 | `docs/quarterly/YYYY-QN/` (전망 대상 분기) | `.../display_trend/quarterly/YYYY-QN/` |

- 각 호 폴더: `index.html`(= `docs/assets/issue.html` 복사) + `content.js`
- 발행 목록: `docs/issues.js` 맨 앞에 한 줄 추가

## 알림
- 발행용 세션이 PushNotification 으로 휴대폰 푸시를 보낸다(이메일 알림은 이 방식에서 지원되지 않음).
- 형식: 종류·호 / 핵심 요약 3줄 이내 / 호 주소. 실패 시 첫 줄 `[실패] 단계: 사유`.

## 플로우 채팅 알림
- 별도 예약 작업이 평일 10시 이후 `prompts/notify_flow.md` 절차로 보낸다.
- 토·일·공휴일(`config/holidays_kr.json`)에는 보내지 않고, 그동안 발행된 호는 다음 영업일에 함께 보낸다.
- 같은 날 여러 호(주간·월간·분기)는 메시지 1건으로 합친다.
- 공휴일 목록은 해마다 다음 해 분을 추가해야 한다(한국천문연구원 월력요항, 보통 6월 발표). 임시공휴일은 지정 시 추가.

## 예전 방식 (사용 중지)
- Google Drive `내 드라이브/가이드삼정/project/display_trend` 폴더 저장은 2026-11-02부터 사용하지 않는다.
