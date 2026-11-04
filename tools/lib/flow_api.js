/* 플로우 OpenAPI 채팅 메시지 전송 (https://api.flow.team/docs)
   - mode "user": POST /user/chats/{roomId}/messages  body {contents}            (개인 API 키)
   - mode "v1"  : POST /v1/chats/{roomId}/messages    body {registerId, contents} (관리자 API 키)
   API 키: 환경변수 FLOW_API_KEY 가 있으면 x-flow-api-key 헤더로 넣는다.
   없으면 헤더 없이 보낸다(환경의 Network secrets 가 프록시에서 헤더를 넣는 경우). */
"use strict";

const BASE = "https://api.flow.team";

async function sendChat(cfg, contents) {
  if (!cfg.roomId) throw new Error("config/flow.json 의 roomId 가 비어 있음");
  const body = { contents };
  let url;
  if (cfg.mode === "v1") {
    if (!cfg.registerId) throw new Error("mode v1 은 registerId(작성자 ID) 필요");
    url = BASE + "/v1/chats/" + encodeURIComponent(cfg.roomId) + "/messages";
    body.registerId = cfg.registerId;
  } else {
    url = BASE + "/user/chats/" + encodeURIComponent(cfg.roomId) + "/messages";
  }
  const headers = { "content-type": "application/json" };
  if (process.env.FLOW_API_KEY) headers["x-flow-api-key"] = process.env.FLOW_API_KEY;
  const res = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
  const text = await res.text();
  let json = null;
  try { json = JSON.parse(text); } catch (_) { /* 본문이 JSON 이 아님 */ }
  if (!res.ok || !json || json.success !== true) {
    const why = json && json.error ? json.error.code + " " + json.error.message : text.slice(0, 200);
    throw new Error("플로우 전송 실패 HTTP " + res.status + ": " + why);
  }
  return json.data || {};
}

/* 채팅방 목록 (roomId 찾기용, user 모드) */
async function listRooms() {
  const headers = {};
  if (process.env.FLOW_API_KEY) headers["x-flow-api-key"] = process.env.FLOW_API_KEY;
  const res = await fetch(BASE + "/user/chats", { headers });
  return { status: res.status, body: await res.text() };
}

module.exports = { sendChat, listRooms };
