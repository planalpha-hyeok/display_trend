/* 발행 알림 메시지 만들기: 여러 호를 한 메시지로 합친다 */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const KIND = { weekly: "주간 디테일", monthly: "월간 요약", quarterly: "분기 전망" };
const ORDER = { quarterly: 0, monthly: 1, weekly: 2 };

/* window.X = ... 형태의 js 파일을 읽어 window 객체를 돌려준다 */
function loadWindowJs(file) {
  const ctx = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), ctx, { filename: file });
  return ctx.window;
}

function loadIssues(docsDir) {
  return loadWindowJs(path.join(docsDir, "issues.js")).ISSUES || [];
}

/* 알림 대상: 샘플 제외, 발행일(date)이 (from, to] 범위 */
function pickIssues(issues, from, to) {
  return issues
    .filter((it) => !it.sample && it.date && it.date > from && it.date <= to)
    .sort((a, b) => (ORDER[a.type] ?? 9) - (ORDER[b.type] ?? 9));
}

function issueBlock(it, docsDir, siteUrl) {
  const R = loadWindowJs(path.join(docsDir, it.path, "content.js")).REPORT || {};
  const lines = ["■ " + (KIND[it.type] || it.type) + " · " + it.title];
  const brief = (R.cover && R.cover.brief) || [];
  brief.slice(0, 3).forEach(([k, v]) => lines.push("· " + k + ": " + v));
  lines.push(siteUrl + it.path);
  return lines.join("\n");
}

function buildMessage(picked, docsDir, siteUrl) {
  const head = picked.length === 1
    ? "[디스플레이 트렌드] " + (KIND[picked[0].type] || picked[0].type) + " 발행"
    : "[디스플레이 트렌드] 새 리포트 " + picked.length + "건 발행";
  const body = picked.map((it) => issueBlock(it, docsDir, siteUrl));
  return [head, ...body, "전체 목록: " + siteUrl].join("\n\n");
}

module.exports = { loadIssues, pickIssues, buildMessage };
