# 플로우 채팅 발행 알림 절차

평일 오전(한국시간 10시 이후) 예약 작업 메시지를 받으면 따른다.

1. 저장소를 최신으로 맞춘다.
   ```
   git fetch origin ccr-8f07b9c9-ec53uj && git checkout ccr-8f07b9c9-ec53uj && git reset --hard origin/ccr-8f07b9c9-ec53uj
   ```
2. 실행: `node tools/flow_notify.js`
   - 쉬는 날(토·일·`config/holidays_kr.json`)이면 `SKIP` → 아무것도 보내지 않고 끝낸다.
   - 직전 영업일 다음날 ~ 오늘 발행된 호를 모아 **한 메시지**로 보낸다(주간·월간·분기가 겹쳐도 1건).
   - 출력 첫 줄: `SENT n` / `NONE` / `SKIP 사유` / `FAIL 사유`
3. `FAIL` 이면 PushNotification 으로 `[실패] 플로우 알림: 사유` 를 보낸다. 같은 날 재시도는 1회만.
   `FAIL ... 공휴일 자료가 없음` 이면 `config/holidays_kr.json` 에 다음 해 공휴일을 추가해야 한다고 알린다(추측해서 넣지 않는다).
4. 이 절차에서는 파일을 수정·푸시하지 않는다.

## 설정
- `config/flow.json`: `mode`("user" 개인 API 키 / "v1" 관리자 API 키), `roomId`(채팅방 ID), `registerId`(v1 일 때 작성자 ID)
- API 키: 환경의 Network secrets(호스트 `api.flow.team`, 헤더 `x-flow-api-key`) 또는 환경변수 `FLOW_API_KEY`. 저장소에 쓰지 않는다.
- 키·채팅방 확인(읽기 전용): `node tools/flow_notify.js --check`
- 미리보기: `node tools/flow_notify.js --date 2026-11-02 --dry-run`
