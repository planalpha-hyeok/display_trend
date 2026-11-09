/* 발행 전 점검: 호 페이지를 브라우저로 열어 오류·쪽수·링크 없는 출처를 확인한다.
   사용: node tools/check_issue.js docs/weekly/2026-11-02
   (playwright 필요: require('playwright') 가 안 되면 NODE_PATH=$(npm root -g) 를 붙인다) */
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const dir = path.resolve(process.argv[2]);
  const b = await chromium.launch();
  let bad = false;
  for (const [name, w] of [['desk', 1280], ['phone', 400]]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    const errs = [];
    p.on('pageerror', e => errs.push(e.message));
    p.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await p.goto('file://' + dir + '/index.html');
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => ({
      pages: document.querySelectorAll('.page').length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      srcNoLink: [...document.querySelectorAll('.src')].filter(e => !e.querySelector('a')).length
    }));
    console.log(name, JSON.stringify(r), errs.length ? 'ERRORS: ' + errs.join(' / ') : 'no errors');
    if (errs.length || r.pages < 2 || r.overflow || r.srcNoLink) bad = true;
  }
  await b.close();
  // 본문 미확인 기사·확인 과정 설명 금지 (config/scope.md 11·12)
  const fs = require('fs');
  const src = fs.readFileSync(path.join(dir, 'content.js'), 'utf8');
  const banned = [/"headline"\s*:\s*true/, /제목 기준/, /제목만/, /확인하지 못/, /본문을 열/, /게시처만/, /기준으로만 확인/];
  const hits = banned.filter(re => re.test(src)).map(re => re.source);
  console.log('banned', hits.length ? 'FOUND: ' + hits.join(', ') : 'none');
  if (hits.length) bad = true;
  console.log(bad ? 'CHECK FAILED' : 'CHECK OK');
  process.exit(bad ? 1 : 0);
})();
