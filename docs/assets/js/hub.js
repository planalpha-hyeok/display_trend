/* 첫 화면: 종류별 최신 호 카드 + 지난 호 목록 (issues.js 의 window.ISSUES) */
(function () {
  "use strict";
  const hub = document.getElementById("hub");
  const LABEL = { weekly: ["WEEKLY", "주간 디테일"], monthly: ["MONTHLY", "월간 요약"], quarterly: ["QUARTERLY", "분기 전망"] };
  function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  const list = window.ISSUES || [];

  const latest = el("div", "hub-latest");
  ["weekly", "monthly", "quarterly"].forEach((t) => {
    const it = list.find((x) => x.type === t);
    const a = el("a", "hub-card");
    a.append(el("span", "hub-kind", LABEL[t][0]), el("b", null, LABEL[t][1]));
    if (it) { a.href = it.path; a.append(el("span", "hub-title", it.title + (it.sample ? " (샘플)" : ""))); }
    else { a.classList.add("empty"); a.append(el("span", "hub-title", "아직 발행 전")); }
    latest.append(a);
  });

  const archive = el("div", "hub-archive");
  archive.append(el("h3", null, "ALL ISSUES"));
  const ul = el("ul");
  list.forEach((it) => {
    const li = el("li");
    const a = el("a", null, it.title + (it.sample ? " (샘플)" : ""));
    a.href = it.path;
    li.append(el("span", "hub-kind", LABEL[it.type][0]), a);
    ul.append(li);
  });
  archive.append(ul);
  hub.append(latest, archive);
})();
