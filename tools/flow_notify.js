/* 발행 알림을 플로우 채팅으로 보낸다. 영업일에만, 하루 한 메시지로 합쳐서.
   사용: node tools/flow_notify.js [--date YYYY-MM-DD] [--dry-run]
         node tools/flow_notify.js --rooms      (채팅방 목록 확인)
   규칙: 실행일 D 가 쉬는 날이면 보내지 않는다.
         직전 영업일 P 다음날 ~ D 사이에 발행된 호(issues.js 의 date)를 모아 한 메시지로 보낸다.
         → 주말·공휴일에 발행된 호는 다음 영업일에 함께 나간다.
   출력 첫 줄: SENT n / NONE / SKIP 사유 / DRY-RUN n, 실패 시 FAIL 사유 (종료 코드 1) */
"use strict";
const fs = require("fs");
const path = require("path");
const bizday = require("./lib/bizday");
const msg = require("./lib/flow_message");
const api = require("./lib/flow_api");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i > -1 ? process.argv[i + 1] : null;
}

async function main() {
  if (process.argv.includes("--rooms")) {
    const r = await api.listRooms();
    console.log("HTTP " + r.status + "\n" + r.body);
    return;
  }
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "config", "flow.json"), "utf8"));
  const dry = process.argv.includes("--dry-run");
  const d = arg("--date") || bizday.todayKst();
  const hol = bizday.loadHolidays();

  const off = bizday.offReason(d, hol);
  if (off) { console.log("SKIP " + d + " 쉬는 날(" + off + ")"); return; }

  const prev = bizday.prevBusinessDay(d, hol);
  const picked = msg.pickIssues(msg.loadIssues(DOCS), prev, d);
  if (!picked.length) { console.log("NONE " + d + " 알릴 호 없음 (범위 " + bizday.addDays(prev, 1) + " ~ " + d + ")"); return; }

  const text = msg.buildMessage(picked, DOCS, cfg.siteUrl);
  if (dry) { console.log("DRY-RUN " + picked.length + "\n" + text); return; }
  const data = await api.sendChat(cfg, text);
  console.log("SENT " + picked.length + " " + picked.map((x) => x.type + ":" + x.id).join(", ") + " messageId=" + (data.messageId || "-"));
}

main().catch((e) => { console.log("FAIL " + e.message); process.exit(1); });
