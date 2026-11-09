/* 호에 넣을 사진 고르기 (docs/assets/img/catalog.json)
   사용: node tools/pick_photos.js cover:outdoor-led led:led-macro epson:projector ...
         각 인자는 "용도:주제". 주제 목록은 catalog.json 의 topics.
   규칙: 최근 4개 호(docs/issues.js 순서)에 쓴 사진은 고르지 않는다.
         그 외에는 한 번도 안 쓴 사진 → 오래전에 쓴 사진 순으로 고른다. 같은 실행 안에서 중복 없음.
         주제에 남은 사진이 없으면 다른 주제의 안 쓴 사진으로 대신하고 (대체) 라고 표시한다.
   출력: 용도별 photo 객체(JSON) — content.js 의 photo 에 그대로 넣고 caption·tag 만 채운다. */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const ROOT = path.join(__dirname, "..");
const DOCS = path.join(ROOT, "docs");
const RECENT = 4;

function loadWindow(file) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), ctx);
  return ctx.window;
}

/* 호별 사용 사진: [[파일, ...], ...] 최신 호가 앞 */
function usedByIssue() {
  const issues = loadWindow(path.join(DOCS, "issues.js")).ISSUES || [];
  return issues.map((it) => {
    const f = path.join(DOCS, it.path, "content.js");
    if (!fs.existsSync(f)) return [];
    const src = fs.readFileSync(f, "utf8");
    return [...src.matchAll(/assets\/img\/([\w.-]+\.jpg)/g)].map((m) => m[1]);
  });
}

function main() {
  const cat = JSON.parse(fs.readFileSync(path.join(DOCS, "assets", "img", "catalog.json"), "utf8"));
  const req = process.argv.slice(2).map((a) => a.split(":"));
  if (!req.length || req.some((r) => r.length !== 2)) {
    console.log("사용: node tools/pick_photos.js 용도:주제 ...\n주제: " + Object.keys(cat.topics).join(", "));
    process.exit(1);
  }
  const used = usedByIssue();
  const blocked = new Set(used.slice(0, RECENT).flat());
  const lastUsed = new Map(); // 파일 → 몇 번째 호에서 마지막으로 썼는지 (작을수록 최근)
  used.forEach((files, i) => files.forEach((f) => { if (!lastUsed.has(f)) lastUsed.set(f, i); }));
  const score = (p) => (lastUsed.has(p.file) ? lastUsed.get(p.file) : 1e6); // 클수록 우선
  const taken = new Set();
  const out = {};
  for (const [purpose, topic] of req) {
    if (!cat.topics[topic]) { console.error("없는 주제: " + topic); process.exit(1); }
    const free = (p) => !blocked.has(p.file) && !taken.has(p.file);
    let pool = cat.photos.filter((p) => p.topic === topic && free(p));
    let note = "";
    if (!pool.length) { pool = cat.photos.filter(free); note = " (대체: " + topic + " 주제 사진 소진)"; }
    if (!pool.length) { console.error("고를 수 있는 사진이 없음"); process.exit(1); }
    pool.sort((a, b) => score(b) - score(a) || a.file.localeCompare(b.file));
    const p = pool[0];
    taken.add(p.file);
    out[purpose] = { src: "../../assets/img/" + p.file, alt: p.alt, credit: "Photo: " + p.credit + " / Unsplash", _topic: p.topic + note };
  }
  console.log(JSON.stringify(out, null, 2));
}

main();
