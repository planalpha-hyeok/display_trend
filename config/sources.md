# 참고 정보원 및 수집 방법

검색 도구(WebSearch)는 최근 1~2주 기사가 잘 잡히지 않는다. 아래 순서로 수집한다.

## 방법 1 (주력): Google 뉴스 RSS
`python3 tools/collect_gnews.py <시작일> <종료일 다음날> <결과.json>` 으로 아래 검색어 전체를 한 번에 수집한다(기간 지정은 after:/before:). 각 항목에 매체명과 발행일이 나온다. 개별 조회는 WebFetch 로 아래 주소를 연다.

- 한국어: `https://news.google.com/rss/search?q=<검색어>+when:<기간>&hl=ko&gl=KR&ceid=KR:ko`
- 영어: `https://news.google.com/rss/search?q=<검색어>+when:<기간>&hl=en-US&gl=US&ceid=US:en`
- `<기간>`: 주간 `7d`, 월간 `31d`, 분기 `92d`
- 검색어의 띄어쓰기는 `+`, 여러 단어 중 하나는 `OR` 사용 (예: `Novastar+OR+Colorlight`)
- 아래 검색어 목록을 **모두** 조회한다. 결과가 0건이어도 기록만 하고 넘어간다.
- RSS 링크는 Google 뉴스 경유 주소다. 출처에는 매체명 + 기사 제목 + 발행일 + 그 링크를 적는다.

### 한국어 검색어
| 제품군 | 검색어 |
|---|---|
| LED 파인피치 (주력) | `파인피치+LED`, `COB+LED+디스플레이`, `LED+디스플레이+설치`, `LED+회의실`, `LED+관제실`, `P1.2+LED`, `P1.5+LED` |
| LED 실외·안내 | `LED전광판`, `옥외+전광판`, `안내전광판`, `미디어파사드` |
| LED 장기 기술 | `마이크로LED` (비중 낮게) |
| LED 컨트롤러 | `노바스타`, `컬러라이트+LED` |
| 프로젝터 | `엡손+프로젝터`, `한국엡손` |
| 영상 주변기기 | `익스트론`, `무선+프레젠테이션+장비` |
| 전자칠판 | `전자칠판`, `교실+칠판+조달` |
| 화상회의 | `로지텍+화상회의`, `화상회의+장비` |
| 학습장치·체험형 | `인터랙티브+체험학습`, `바닥+프로젝션`, `스크린+파크골프` |
| 프린터 | `엡손+복합기`, `엡손+프린터` |
| 미디어아트 | `미디어아트+전시+기술`, `프로젝션+맵핑` |
| 조달·정책 | `조달청+전광판`, `옥외광고물+디지털`, `우수조달물품+디스플레이` |

### 영어 검색어
| 제품군 | 검색어 |
|---|---|
| LED 파인피치 (주력) | `fine+pitch+LED`, `small+pitch+LED`, `COB+LED+display`, `dvLED`, `LED+video+wall` |
| LED 실외 | `outdoor+LED+display`, `digital+billboard` |
| LED 장기 기술 | `MicroLED+display` (비중 낮게) |
| LED 컨트롤러 | `Novastar+OR+Colorlight` |
| 프로젝터 | `Epson+projector` |
| 영상 주변기기 | `Extron` |
| 전자칠판 | `interactive+display+classroom`, `EDLA+interactive+panel` |
| 화상회의 | `Logitech+Rally+OR+Logitech+video+conferencing` |
| 미디어아트 | `projection+mapping`, `virtual+production+LED+volume` |
| 시장·가격 | `LED+display+market+TrendForce`, `LED+display+price` |

## 방법 2: 목록 페이지 직접 확인 (2026-11-01 접속 확인)
| 정보원 | 주소 | 비고 |
|---|---|---|
| 조달청 보도자료 | https://www.pps.go.kr/kor/bbs/list.do?key=00634 | 날짜 표시됨. 조달·우수제품·칠판 관련 확인 |
| LEDinside 뉴스 | https://www.ledinside.com/news | 날짜 표시됨 |
| Epson 미국 뉴스룸 | https://news.epson.com/ | 날짜 표시됨. 프로젝터·프린터 글로벌 소식 |
| AV Network 뉴스 | https://www.avnetwork.com/news | 날짜 표시됨 |
| 전자신문 전자 섹션 | https://www.etnews.com/news/section.html?id1=06 | 날짜 표시됨 |
| Colorlight 뉴스 | https://www.colorlightinside.com/news/all/ | 중국어, 게시 빈도 낮음 |
| Novastar 뉴스 | https://www.novastar.tech/content/content.html?catid=19 | 날짜 미표시 → 날짜는 다른 출처로 확인 |
| 한국엡손 뉴스 | https://www.epson.co.kr/news | 확인 당시 503 오류. 열리면 사용 |

접속이 안 되는 곳(확인일 기준): ravepubs.com(403), extron.com(차단), corporate.epson(403), news.logitech.com(목록 표시 안 됨), displaydaily.com(갱신 중단 상태).

## 방법 3: 원문 주소 확보 (실을 기사마다 필수)
- Google 뉴스 RSS 링크는 원문 주소가 아니다. 실을 기사는 원문 주소를 찾아 출처에 넣는다.
- 한국어 기사: `python3 tools/naver_search.py "기사 제목 핵심 단어"` → 결과의 LINKS 중 해당 매체 주소를 고르고, 열어서 제목·날짜를 대조한다.
- 영어 기사: WebSearch 로 원문을 찾는다.
- 원문을 못 찾으면 Google 뉴스 링크를 쓴다(브라우저에서 원문으로 이동함). 출처 주소를 비워 두지 않는다.

## 방법 4 (보조): WebSearch
- 방법 1·2에서 찾은 소식의 상세 내용 확인, 배경 조사에 사용한다.
