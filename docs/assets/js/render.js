/* 호(issue) 하나를 그린다: 표지 → 섹션들. 데이터는 각 호 폴더의 content.js (window.REPORT). */
(function () {
  "use strict";
  const { el, twoTone, page, photo, sectionHead } = window.DT;
  const B = window.DT.blocks;
  const R = window.REPORT;
  const book = document.getElementById("book");
  const MAG = { weekly: "WEEKLY", monthly: "MONTHLY", quarterly: "QUARTERLY" }[R.type] || "WEEKLY";

  function renderCover() {
    const p = page("cover", R.issue.side);
    const mast = el("header", "mast");
    const brand = el("div", "mast-brand");
    brand.append(el("b", null, R.issue.brand));
    const title = el("h1", "mast-title");
    title.append(twoTone(R.issue.titleOutline, R.issue.titleSolid));
    const meta = el("div", "mast-meta");
    meta.append(el("span", null, R.issue.date), el("span", null, R.issue.vol));
    mast.append(brand, title, meta);

    const body = el("div", "cover-body");
    body.append(photo(R.cover.photo, { left: "-6px", top: "22px" }));

    const side = el("div", "cover-side");
    const toc = el("nav", "contents");
    toc.setAttribute("aria-label", "목차");
    toc.append(el("h3", null, "CONTENTS"));
    const ol = el("ol");
    R.sections.forEach((s, i) => {
      const li = el("li");
      const a = el("a");
      a.href = "#" + s.id;
      a.append(el("span", null, String(i + 1).padStart(2, "0")), el("span", null, s.outline + " " + s.solid));
      li.append(a);
      ol.append(li);
    });
    toc.append(ol);

    const brief = el("div", "brief");
    brief.append(el("h3", null, R.cover.briefTitle + " · " + R.issue.period));
    const bl = el("ol");
    R.cover.brief.forEach(([k, v]) => {
      const li = el("li");
      li.append(el("b", null, k + " "), document.createTextNode(v));
      bl.append(li);
    });
    brief.append(bl);
    side.append(toc, brief);
    body.append(side);

    p.append(mast, body, el("p", "page-foot", R.cover.footnote || "이미지는 내용 이해를 돕기 위한 대체 사진이며 기사 속 실제 제품·현장과 다릅니다."));
    book.append(p);
  }

  function renderSection(sec, no) {
    const p = page(sec.id, R.issue.side);
    p.append(sectionHead(sec, no, MAG));
    sec.blocks.forEach((b) => {
      const fn = B[b.kind];
      if (fn) p.append(fn(b, R));
    });
    book.append(p);
  }

  /* 출처 전체 목록: 본문의 모든 src·basis·표 링크 + R.extraSources(본문에 싣지 않은 참고 기사) */
  function collectSources() {
    const seen = new Set(), list = [];
    const add = (name, url) => { if (!url || seen.has(url)) return; seen.add(url); list.push([name, url]); };
    (function walk(o) {
      if (Array.isArray(o)) {
        if (o.length === 2 && typeof o[0] === "string" && typeof o[1] === "string" && /^https?:/.test(o[1])) return add(o[0], o[1]);
        return o.forEach(walk);
      }
      if (o && typeof o === "object") {
        if (typeof o.text === "string" && typeof o.url === "string" && /^https?:/.test(o.url) && o.kind !== "closing") add(o.text, o.url);
        Object.keys(o).forEach((k) => { if (k !== "extraSources") walk(o[k]); });
      }
    })(R.sections);
    return { used: list, extra: (R.extraSources || []).filter(([, u]) => u && !seen.has(u)) };
  }

  function renderSources(no) {
    const { used, extra } = collectSources();
    if (!used.length && !extra.length) return;
    const p = page("sources", R.issue.side);
    p.append(sectionHead({ outline: "ALL", solid: "SOURCES", desc: "이 호에 쓰인 출처 전체" + (extra.length ? " · 참고 기사" : "") }, no, MAG));
    const mk = (title, arr) => {
      const box = el("div", "src-list");
      box.append(el("h4", null, title + " (" + arr.length + ")"));
      const ol = el("ol");
      arr.forEach(([name, url]) => { const li = el("li"); li.append(window.DT.link(name, url)); ol.append(li); });
      box.append(ol);
      return box;
    };
    if (used.length) p.append(mk("본문 출처", used));
    if (extra.length) p.append(mk("참고 기사 (본문에 싣지 않음)", extra));
    book.append(p);
  }

  document.title = R.issue.pageTitle || document.title;
  renderCover();
  R.sections.forEach((s, i) => renderSection(s, i + 1));
  renderSources(R.sections.length + 1);
})();
