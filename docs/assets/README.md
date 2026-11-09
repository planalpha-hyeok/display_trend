# 잡지형 페이지 구조 (GitHub Pages: docs/)

## 폴더
| 경로 | 역할 |
|---|---|
| `docs/index.html` | 첫 화면. 종류별 최신 호 + 전체 목록 |
| `docs/issues.js` | 발행 목록 (`window.ISSUES`). 새 호를 올릴 때 맨 앞에 한 줄 추가 |
| `docs/assets/issue.html` | 각 호의 index.html 원본. 새 호 폴더에 그대로 복사 |
| `docs/assets/css/` | base(토큰·골격), components(표지·기사 카드), report(표·이슈·전망), hub(첫 화면) |
| `docs/assets/js/` | core(공통 부품), blocks(블록별 화면), render(표지+섹션 조립), hub(첫 화면) |
| `docs/assets/img/` | 공용 사진 (Unsplash, 촬영자 표기 필수) |
| `docs/weekly/YYYY-MM-DD/` | 주간 호: `index.html` + `content.js` |
| `docs/monthly/YYYY-MM/` | 월간 호 |
| `docs/quarterly/YYYY-QN/` | 분기 호 |

새 호를 만들 때는 **content.js 만 작성**하고 index.html 은 `assets/issue.html` 을 복사한다.
사진 목록은 `assets/img/catalog.json`. 사진을 새로 추가하면 catalog.json 에도 한 줄(file, topic, alt, credit) 넣는다. 고르기는 `node tools/pick_photos.js`.

## content.js 형식
```js
window.REPORT = {
  type: "weekly" | "monthly" | "quarterly",
  issue: { brand, titleOutline, titleSolid, date, vol, period, side, pageTitle },
  cover: {
    photo: { src, alt, credit, caption, tag },
    briefTitle: "이번 주 핵심 3줄",            // 월간: 이달의 핵심 5줄, 분기: 분기 요약 5줄
    brief: [["키워드", "한 줄 요약"], ...],
    footnote: "(선택) 표지 아래 안내 문구"
  },
  sections: [
    { id, outline, solid, desc, blocks: [ 블록, ... ] }
  ],
  extraSources: [["매체 (날짜) 기사 제목", "주소"], ...]   // (선택) 본문에 싣지 않은 참고 기사
};
```

## 블록 종류
| kind | 용도 | 필드 |
|---|---|---|
| `feature` | 사진 + 기사 카드 | `layout`("split" 또는 "grid"), `photo`, `stories[]` |
| `issues` | 이슈 Top N | `items[]`: `title, what, why, impact, src` |
| `table` | 표 | `title?`, `columns[]`, `rows[][]`, `note?`. 셀에 `{text, level:"high"/"mid"/"low"}` → 배지, `{text, url}` → 링크 |
| `outlook` | 분기 전망 카드 | `items[]`: `area, now, next, confidence("high"/"mid"/"low"), basis` |
| `notes` | 실무 노트 | `rows: [["항목","내용"], ...]` |
| `terms` | 용어 풀이 | `rows: [["용어","설명"], ...]` |
| `closing` | 마무리 띠 | `text`, `url?` |

기사 카드(`stories[]`) 필드: `label, title, body, why?, est?(전망·해석 포함 표시), src: [["매체 (날짜)", 주소 또는 null], ...]`

## 종류별 권장 섹션
- 주간: 제품군별 `feature` 섹션들 + FIELD NOTE(`notes`, `terms`, `closing`)
- 월간: TOP FIVE(`issues`) → BY PRODUCT(`table`) → KOREA / GLOBAL MARKET(`feature`) → NEW ARRIVALS(`table`) → NEXT MONTH(`table`, `closing`)
- 분기: 회고(`issues`) → 전망(`outlook`) → RISK & CHANCE(`table`) → CALENDAR(`table`, `closing`)

## 출처 전체 목록 (자동)
각 호 맨 끝에 ALL SOURCES 쪽이 자동으로 붙는다. 본문의 모든 출처 링크를 모으고, `extraSources` 가 있으면 '참고 기사'로 따로 보여준다.
`closing` 블록의 링크는 Drive 같은 외부 비공개 주소를 쓰지 않는다. 지난 호 목록은 `"url": "../../"`.
