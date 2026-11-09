/* 플로우 OpenAPI 채팅 메시지 전송 (https://api.flow.team/docs)
   - mode "user": POST /user/chats/{roomId}/messages  body {contents}            (개인 API 키)
   - mode "v1"  : POST /v1/chats/{roomId}/messages    body {registerId, contents} (관리자 API 키)
   API 키는 환경의 Network secrets 가 프록시에서 x-flow-api-key 헤더로 넣는다.
   Node 내장 fetch 는 HTTPS_PROXY 를 쓰지 않아 키가 붙지 않으므로, 프록시를 따르는 curl 로 호출한다.
   환경변수 FLOW_API_KEY 가 있으면 그 값을 헤더로 직접 넣는다. */
"use strict";
const { execFileSync } = require("child_process");

const BASE = "https://api.flow.team";

/* curl 호출: 응답 본문과 HTTP 코드를 돌려준다. 본문은 표준입력으로 넘긴다(명령줄에 남지 않게) */
function curl(method, url, body) {
  const args = ["-sS", "-X", method, "-w", "\n%{http_code}", url];
  if (process.env.FLOW_API_KEY) args.push("-H", "x-flow-api-key: " + process.env.FLOW_API_KEY);
  let input;
  if (body !== undefined) {
    args.push("-H", "content-type: application/json", "--data-binary", "@-");
    input = JSON.stringify(body);
  }
  const out = execFileSync("curl", args, { input, encoding: "utf8", maxBuffer: 10 * 1024 * 1024 });
  const i = out.lastIndexOf("\n");
  return { status: Number(out.slice(i + 1)), text: out.slice(0, i) };
}

function sendChat(cfg, contents) {
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
  const res = curl("POST", url, body);
  let json = null;
  try { json = JSON.parse(res.text); } catch (_) { /* 본문이 JSON 이 아님 */ }
  const r = json && json.response ? json.response : json; // 응답이 {response:{...}} 로 감싸진 경우
  if (res.status !== 200 || !r || r.success !== true) {
    const why = r && r.error ? r.error.code + " " + r.error.message : res.text.slice(0, 200);
    throw new Error("플로우 전송 실패 HTTP " + res.status + ": " + why);
  }
  return r.data || {};
}

/* 채팅방 정보 확인 (읽기 전용) */
function getRoom(cfg) {
  const path = cfg.mode === "v1" ? "/v1/chats/" : "/user/chats/";
  return curl("GET", BASE + path + encodeURIComponent(cfg.roomId));
}

module.exports = { sendChat, getRoom };
