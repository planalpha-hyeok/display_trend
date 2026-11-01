/* 공통 화면 부품. 모든 글자는 textContent 로 넣는다(HTML 주입 방지).
   window.DT 에 부품을 모아 render.js 가 사용한다. */
(function () {
  "use strict";

  function el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function twoTone(outline, solid) {
    const f = document.createDocumentFragment();
    f.append(el("span", "outline", outline), document.createTextNode(" "), el("span", "solid", solid));
    return f;
  }

  function link(name, url) {
    if (!url) return document.createTextNode(name);
    const a = el("a", null, name);
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener";
    return a;
  }

  /* 출처 목록 [[이름, 주소|null], ...] → "출처: A · B" */
  function sources(list, prefix) {
    const p = el("p", "src", prefix == null ? "출처: " : prefix);
    (list || []).forEach(([name, url], i) => {
      if (i) p.append(document.createTextNode(" · "));
      p.append(link(name, url));
    });
    return p;
  }

  function page(id, side) {
    const p = el("section", "page");
    if (id) p.id = id;
    p.dataset.side = side;
    return p;
  }

  function photo(ph, tagPos) {
    const f = el("figure", "photo");
    const img = el("img");
    img.src = ph.src;
    img.alt = ph.alt || "";
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
    if (s.headline) h.append(el("span", "est", "제목 기준"));
    a.append(h, el("p", null, s.body));
    if (s.why) a.append(el("p", "why", s.why));
    a.append(sources(s.src));
    return a;
  }

  function sectionHead(sec, no, mag) {
    const h = el("header", "sec-head");
    const t = el("h2", "sec-title");
    t.append(twoTone(sec.outline, sec.solid));
    const bar = el("div", "sec-bar");
    bar.append(el("p", null, sec.desc), el("span", "mag", mag), el("span", "no", String(no).padStart(2, "0")));
    h.append(t, bar);
    return h;
  }

  window.DT = { el, twoTone, link, sources, page, photo, story, sectionHead };
})();
