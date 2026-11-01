/* content.js 의 REPORT 데이터로 페이지를 구성한다. 글자는 모두 textContent 로 넣는다. */
(function () {
  "use strict";

  const R = window.REPORT;
  const book = document.getElementById("book");

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function twoTone(outline, solid) {
    const frag = document.createDocumentFragment();
    frag.append(el("span", "outline", outline), document.createTextNode(" "), el("span", "solid", solid));
    return frag;
  }

  function page(id) {
    const p = el("section", "page");
    if (id) p.id = id;
    p.dataset.side = R.issue.side;
    return p;
  }

  function photo(ph, tagPos) {
    const f = el("figure", "photo");
    const img = el("img");
    img.src = ph.src;
    img.alt = ph.alt;
    img.loading = "lazy";
    f.append(img);
    if (ph.tag) {
      const t = el("span", "tag", ph.tag);
      Object.assign(t.style, tagPos || { left: "12px", top: "14px" });
      f.append(t);
    }
    if (ph.caption) f.append(el("figcaption", null, ph.caption));
    if (ph.credit) f.append(el("span", "credit", ph.credit));
    return f;
  }

  function story(s) {
    const a = el("article", "story");
    a.append(el("span", "label", s.label));
    const h = el("h4", null, s.title);
    if (s.est) h.append(el("span", "est", "전망·해석 포함"));
    a.append(h, el("p", null, s.body));
    if (s.why) a.append(el("p", "why", s.why));
    const src = el("p", "src", "출처: ");
    s.src.forEach(([name, url], i) => {
      if (i) src.append(document.createTextNode(" · "));
      if (url) {
        const l = el("a", null, name);
        l.href = url;
        l.target = "_blank";
        l.rel = "noopener";
        src.append(l);
      } else {
        src.append(document.createTextNode(name));
      }
    });
    a.append(src);
    return a;
  }

  function sectionHead(sec, no) {
    const h = el("header", "sec-head");
    const t = el("h2", "sec-title");
    t.append(twoTone(sec.outline, sec.solid));
    const bar = el("div", "sec-bar");
    bar.append(el("p", null, sec.desc), el("span", "mag", "WEEKLY"), el("span", "no", String(no).padStart(2, "0")));
    h.append(t, bar);
    return h;
  }

  /* ---------- 표지 ---------- */
  function renderCover() {
    const p = page("cover");
    const mast = el("header", "mast");
    const brand = el("div", "mast-brand");
    brand.append(el("b", null, R.issue.brand));
    const title = el("h1", "mast-title");
    title.append(twoTone(R.issue.titleOutline, R.issue.titleSolid));
    const meta = el("div", "mast-meta");
    meta.append(el("span", null, R.issue.date), el("span", null, R.issue.vol));
    mast.append(brand, title, meta);

    const body = el("div", "cover-body");
    body.append(photo({ src: R.cover.photo, alt: R.cover.alt, credit: R.cover.credit, caption: R.cover.caption, tag: R.cover.tag }, { left: "-6px", top: "22px" }));

    const toc = el("nav", "contents");
    toc.setAttribute("aria-label", "목차");
    toc.append(el("h3", null, "CONTENTS"));
    const ol = el("ol");
    R.sections.forEach((s, i) => {
      const li = el("li");
      const a = el("a");
      a.href = "#" + s.id;
      a.style.display = "contents";
      a.append(el("span", null, String(i + 1).padStart(2, "0")), el("span", null, s.outline + " " + s.solid));
      li.append(a);
      ol.append(li);
    });
    const liNote = el("li");
    liNote.append(el("span", null, String(R.sections.length + 1).padStart(2, "0")), el("span", null, "FIELD NOTE"));
    ol.append(liNote);
    toc.append(ol);

    const side = el("div");
    side.style.display = "grid";
    side.style.gap = "16px";
    side.style.alignContent = "start";
    const brief = el("div", "brief");
    brief.append(el("h3", null, "이번 주 핵심 3줄 · " + R.issue.period));
    const bl = el("ol");
    R.cover.brief.forEach(([k, v]) => {
      const li = el("li");
      li.append(el("b", null, k + " "), document.createTextNode(v));
      bl.append(li);
    });
    brief.append(bl);
    side.append(toc, brief);
    body.append(side);

    p.append(mast, body, el("p", "page-foot", "이미지는 내용 이해를 돕기 위한 대체 사진이며 기사 속 실제 제품·현장과 다릅니다."));
    book.append(p);
  }

  /* ---------- 기사 섹션 ---------- */
  function renderSection(sec, no) {
    const p = page(sec.id);
    p.append(sectionHead(sec, no));
    const [first, ...rest] = sec.stories;

    if (sec.layout === "split") {
      const split = el("div", "split grid");
      split.append(photo(sec.photo), story(first));
      p.append(split);
      if (rest.length) {
        const g = el("div", "grid");
        rest.forEach((s) => g.append(story(s)));
        if (rest.length === 1) g.style.gridTemplateColumns = "1fr";
        p.append(g);
      }
    } else {
      const g = el("div", "grid wide-first");
      g.append(photo(sec.photo));
      sec.stories.forEach((s) => g.append(story(s)));
      p.append(g);
    }
    book.append(p);
  }

  /* ---------- 실무 노트·용어·출처 ---------- */
  function renderField(no) {
    const p = page("field");
    p.append(sectionHead({ outline: "FIELD", solid: "NOTE", desc: "현장 실무 참고 · 용어 풀이" }, no));

    const dl = el("dl", "notes");
    R.notes.forEach(([k, v]) => {
      const row = el("div");
      row.append(el("dt", null, k), el("dd", null, v));
      dl.append(row);
    });

    const terms = el("div", "terms");
    R.terms.forEach(([k, v]) => {
      const c = el("div");
      c.append(el("b", null, k), el("span", null, v));
      terms.append(c);
    });

    const closing = el("div", "closing");
    closing.append(el("b", null, R.issue.brand));
    const full = el("a", null, "전체 기사 목록과 출처 40여 건은 상세 리포트(Google 문서)에서 확인");
    full.href = R.issue.fullReport;
    full.target = "_blank";
    full.rel = "noopener";
    closing.append(full);

    p.append(dl, terms, closing);
    book.append(p);
  }

  renderCover();
  R.sections.forEach((s, i) => renderSection(s, i + 1));
  renderField(R.sections.length + 1);
})();
