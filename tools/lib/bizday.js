/* 영업일 계산: 토·일·공휴일(config/holidays_kr.json) 제외 */
"use strict";
const fs = require("fs");
const path = require("path");

const HOLIDAY_FILE = path.join(__dirname, "..", "..", "config", "holidays_kr.json");

function loadHolidays(file = HOLIDAY_FILE) {
  const raw = JSON.parse(fs.readFileSync(file, "utf8"));
  const map = new Map();
  const years = new Set();
  Object.keys(raw).filter((k) => /^\d{4}$/.test(k)).forEach((y) => {
    years.add(y);
    raw[y].forEach(([d, name]) => map.set(d, name));
  });
  return { map, years };
}

/* YYYY-MM-DD 문자열 ↔ 날짜 (시간대 영향 없도록 UTC 정오 기준) */
function parse(d) { return new Date(d + "T12:00:00Z"); }
function fmt(dt) { return dt.toISOString().slice(0, 10); }
function addDays(d, n) { const t = parse(d); t.setUTCDate(t.getUTCDate() + n); return fmt(t); }

/* 한국시간 오늘 */
function todayKst(now = new Date()) {
  return new Date(now.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);
}

/* 쉬는 날이면 사유, 영업일이면 null. 해당 연도 공휴일 자료가 없으면 오류 */
function offReason(d, hol) {
  if (!hol.years.has(d.slice(0, 4))) throw new Error(d.slice(0, 4) + "년 공휴일 자료가 config/holidays_kr.json 에 없음");
  const wd = parse(d).getUTCDay();
  if (wd === 0) return "일요일";
  if (wd === 6) return "토요일";
  return hol.map.get(d) || null;
}

/* d 이전의 가장 가까운 영업일 */
function prevBusinessDay(d, hol) {
  let x = addDays(d, -1);
  for (let i = 0; i < 30; i++, x = addDays(x, -1)) if (!offReason(x, hol)) return x;
  throw new Error("30일 안에 영업일 없음: " + d);
}

module.exports = { loadHolidays, offReason, prevBusinessDay, todayKst, addDays };
