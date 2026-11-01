/* 출처 중 주소가 없는 항목([이름, null])을 아래 표에 따라 채운다. */
const fs = require('fs'), vm = require('vm');
const gn = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const MAP = {
  "지디넷코리아 (10/30)": ["지디넷코리아 (10/30)", "https://zdnet.co.kr/view/?no=20261030101656"],
  "연합뉴스 (10/30)": ["매일경제 (10/30)", gn.yonhap],
  "디딤코리아 (10/30)": ["디딤코리아 (10/30)", gn.didim],
  "한국신용신문 (10/30)": ["한국신용신문 (10/30)", gn.credit],
  "Sixteen:Nine (10/27)": ["Sixteen:Nine (10/27)", gn.omdia],
  "Sixteen:Nine (10/30)": ["Sixteen:Nine (10/30)", gn.sia],
  "Sixteen:Nine (10/2)": ["Sixteen:Nine (10/2)", gn.tele],
  "MarketScreener (10/28)": ["MarketScreener (10/28)", gn.mkts],
  "Reuters (10/27)": ["Reuters (10/27)", gn.reuters],
  "AOL.co.uk (10/28)": ["The Star·Reuters (10/28)", "https://www.thestar.com.my/tech/tech-news/2026/10/28/logitech-sheds-2-billion-in-market-cap-as-margin-concerns-overshadow-profit-beat"],
  "Yahoo (10/30)": ["Yahoo (10/30)", "https://news.google.com/rss/articles/CBMiggFBVV95cUxQLU5QNmxBTkpFY0ZGV1RaaVlqNlRnTl95VXczNjdOMmcwN2tCemJCeXlGMlotczZoWnpqQkRJNzhlNlh1MERDOGdYd1Y3RDZieF9UZldOOGJKYWIzZ0NXbXp0R25LdENMcGV0dnhtQUxqT1JHcy1COGN2Nm9vWUhkTHpB?oc=5"],
  "Digital AV Magazine (10/27)": ["Digital AV Magazine (10/27)", "https://news.google.com/rss/articles/CBMitgFBVV95cUxNb05DZHlBVG5jdjdJOEtpQWNGODhwX0FEdEM3OW5SOXc2YnVoSjU2SFJKajVQOXZmM1d0TFpUeDdxUlAtTUllQ3dCaUJvcTRza0kxajZlTklZVmNtNkxqTDdMaUxiTlJQU0ZZLXRxTEdUbEl6UmRGTW03THRrTE1xTDFFRGc2LW5NMWs4VnJrUU5Ramw5TGlvVERPbGN0ZFc2UkFNYjZlVkFYa0VwV2lKVXB0RFN2UQ?oc=5"],
  "InPark Magazine (10/28)": ["InPark Magazine (10/28)", "https://news.google.com/rss/articles/CBMidEFVX3lxTE10Z0tEd1oyRGpQNG1URTZkUnBPcC16WlhoWXBJRS15UjFoRHNjcGd5Q19WTTN1UEd6elhwVGdKTGlqbFNYMU9QVEVFdmMwVEVqWHo1bmVFMm9wbTRpbUNBWTk5MUs5VE1yQ0JoNEF5Z1RNRnB50gF6QVVfeXFMT1FybTl0X09lbGpVTElPS0pnUmMyOUtFWXgwWWd0QTdFdTJXdVkxUWJ3bGx6YkhDcHJYZzFEOEtlb2FEYUIxWHVzNC1rR1pLUkZSM0tYWk8wdjVMdHpCM2EySndGY1FZaU43bm85aTJYQUdCbENoSTRFc2c?oc=5"],
  "뉴스1·폴리뉴스 (10/28)": null,   /* 둘로 나눔: 아래 SPLIT */
  "브릿지경제·테크월드 (10/12)": ["데이터넷 (10/12)", "https://www.datanet.co.kr/news/articleView.html?idxno=215016"],
  "이투데이 (10/29)": ["오피니언뉴스 (10/31)", "http://www.opinionnews.co.kr/news/articleView.html?idxno=146460"],
  "매일경제 (10/30)": ["매일경제 (10/30)", "https://www.mk.co.kr/article/12191456"],
  "삼성전자 뉴스룸 (10/15)": ["삼성전자 뉴스룸 (10/15)", "https://news.samsung.com/kr/%ec%8a%a4%eb%a7%88%ed%8a%b8-%ec%8b%9c%ed%8b%b0%eb%b6%80%ed%84%b0-%eb%a0%88%ec%9d%b4%ec%8b%b1-%ec%84%9c%ed%82%b7%ea%b9%8c%ec%a7%80-%ec%bb%a8%ed%8a%b8%eb%a1%a4%eb%a3%b8%ec%9d%98-%ec%a4%91%ec%8b%ac"],
  "뉴스핌 (9/21)": ["전자신문 (9/21)", "https://www.etnews.com/20260921000255"],
  "Gogi Tech (9/16)": ["Gogi Tech (9/16)", gn.gogi]
};
const SPLIT = { "뉴스1·폴리뉴스 (10/28)": [["뉴스1 (10/28)", "https://www.news1.kr/local/gwangju-jeonnam/6335001"], ["폴리뉴스 (10/28)", "https://www.polinews.co.kr/news/articleView.html?idxno=616092"]] };
function fix(list) {
  const out = [];
  for (const [name, url] of list) {
    if (url) { out.push([name, url]); continue; }
    if (SPLIT[name]) { out.push(...SPLIT[name]); continue; }
    if (MAP[name]) { out.push(MAP[name]); continue; }
    out.push([name, null]); console.error('  남음:', name);
  }
  return out;
}
function walk(o) {
  if (Array.isArray(o)) return o.map(walk);
  if (o && typeof o === 'object') {
    for (const k of Object.keys(o)) o[k] = ((k === 'src' || k === 'basis') && Array.isArray(o[k])) ? fix(o[k]) : walk(o[k]);
  }
  return o;
}
for (const f of process.argv.slice(3)) {
  const txt = fs.readFileSync(f, 'utf8');
  const head = txt.slice(0, txt.indexOf('window.REPORT'));
  const c = { window: {} }; vm.createContext(c); vm.runInContext(txt, c);
  const R = walk(JSON.parse(JSON.stringify(c.window.REPORT)));
  fs.writeFileSync(f, head + 'window.REPORT = ' + JSON.stringify(R, null, 2) + ';\n');
  console.log('done', f);
}
