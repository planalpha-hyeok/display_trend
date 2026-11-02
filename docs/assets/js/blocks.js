/* 섹션 안에 들어가는 블록 종류별 화면 구성.
   kind: feature | table | outlook | issues | notes | terms | closing */
(function () {
  "use strict";
  const { el, sources, photo, story, link } = window.DT;

  /* 사진 + 기사 카드 */
  function feature(b) {
    const out = document.createDocumentFragment();
    const [first, ...rest] = b.stories;
    if (b.layout === "split") {
      const split = el("div", "split grid");
      split.append(photo(b.photo), story(first));
      out.append(split);
      if (rest.length) {
        const g = el("div", "grid");
        if (rest.length === 1) g.classList.add("one");
        rest.forEach((s) => g.append(story(s)));
        out.append(g);
      }
    } else {
      const g = el("div", "grid wide-first");
      if (b.photo) g.append(photo(b.photo));
      b.stories.forEach((s) => g.append(story(s)));
      out.append(g);
    }
    return out;
  }

  /* 표: columns = ["제품군", ...], rows = [["LED", ...], ...]
     셀 값이 {text, level} 이면 영향 정도 배지로 표시 */
  function table(b) {
    const wrap = el("div", "tbl-wrap");
    if (b.title) wrap.append(el("h4", "tbl-title", b.title));
    const scroller = el("div", "tbl-scroll");
    const t = el("table", "tbl");
    const thead = el("thead");
    const hr = el("tr");
    b.columns.forEach((c) => hr.append(el("th", null, c)));
    thead.append(hr);
    const tbody = el("tbody");
    b.rows.forEach((r) => {
      const tr = el("tr");
      r.forEach((cell, ci) => {
        const td = el("td");
        td.dataset.label = b.columns[ci] || "";
        if (cell && typeof cell === "object" && cell.level) {
          td.append(el("span", "lv lv-" + cell.level, cell.text));
        } else if (cell && typeof cell === "object" && cell.url !== undefined) {
          td.append(link(cell.text, cell.url));
        } else {
          td.textContent = cell == null ? "" : String(cell);
        }
        tr.append(td);
      });
      tbody.append(tr);
    });
    t.append(thead, tbody);
    scroller.append(t);
    wrap.append(scroller);
    if (b.note) wrap.append(el("p", "tbl-note", b.note));
    return wrap;
  }

  /* 이슈 Top N: 번호 + 제목 + 무엇/왜/영향 */
  function issues(b) {
    const ol = el("ol", "issues");
    b.items.forEach((it, i) => {
      const li = el("li", "issue");
      li.append(el("span", "issue-no", String(i + 1).padStart(2, "0")));
      const body = el("div", "issue-body");
      body.append(el("h4", null, it.title));
      const dl = el("dl");
      [["무엇이", it.what], ["왜 중요한가", it.why], ["우리 회사 영향", it.impact]].forEach(([k, v]) => {
        if (!v) return;
        dl.append(el("dt", null, k), el("dd", null, v));
      });
      body.append(dl, sources(it.src));
      li.append(body);
      ol.append(li);
    });
    return ol;
  }

  /* 전망 카드: 제품군별 현재 → 전망, 근거, 확신 정도 */
  function outlook(b) {
    const g = el("div", "outlook");
    b.items.forEach((it) => {
      const c = el("article", "ol-card");
      const head = el("div", "ol-head");
      head.append(el("h4", null, it.area), el("span", "lv lv-" + it.confidence, "확신 " + { high: "높음", mid: "보통", low: "낮음" }[it.confidence]));
      c.append(head);
      c.append(el("p", "ol-now", "현재: " + it.now));
      c.append(el("p", "ol-next", "이번 분기: " + it.next));
      if (it.basis) c.append(sources(it.basis, "근거: "));
      g.append(c);
    });
    return g;
  }

  function notes(b) {
    const dl = el("dl", "notes");
    b.rows.forEach(([k, v]) => {
      const row = el("div");
      row.append(el("dt", null, k), el("dd", null, v));
      dl.append(row);
    });
    return dl;
  }

  function terms(b) {
    const g = el("div", "terms");
    b.rows.forEach(([k, v]) => {
      const c = el("div");
      c.append(el("b", null, k), el("span", null, v));
      g.append(c);
    });
    return g;
  }

  function closing(b, R) {
    const c = el("div", "closing");
    c.append(el("b", null, R.issue.brand));
    if (b.text) c.append(b.url ? link(b.text, b.url) : el("span", null, b.text));
    return c;
  }

  window.DT.blocks = { feature, table, issues, outlook, notes, terms, closing };
})();
