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

  document.title = R.issue.pageTitle || document.title;
  renderCover();
  R.sections.forEach((s, i) => renderSection(s, i + 1));
})();
