"""Google 뉴스 RSS로 기간별 기사 목록을 모은다. 사용: python3 collect.py <after YYYY-MM-DD> <before YYYY-MM-DD> <out.json>"""
import sys, json, re, html, urllib.parse, urllib.request, time
after, before, out = sys.argv[1:4]
KO = ["파인피치 LED","COB LED 디스플레이","LED 디스플레이 설치","LED 회의실","LED 관제실","LED전광판","옥외 전광판","안내전광판","미디어파사드","마이크로LED",
      "노바스타","컬러라이트 LED","엡손 프로젝터","한국엡손","익스트론","무선 프레젠테이션 장비","전자칠판","교실 칠판 조달","로지텍 화상회의","화상회의 장비",
      "인터랙티브 체험학습","바닥 프로젝션","스크린 파크골프","엡손 복합기","엡손 프린터","미디어아트 전시 기술","프로젝션 맵핑","조달청 전광판","옥외광고물 디지털","우수조달물품 디스플레이","LED 디스플레이 시장"]
EN = ["fine pitch LED","small pitch LED","COB LED display","dvLED","LED video wall","outdoor LED display","digital billboard","MicroLED display","Novastar OR Colorlight",
      "Epson projector","Extron","interactive display classroom","EDLA interactive panel","Logitech Rally OR Logitech video conferencing","projection mapping","virtual production LED volume","LED display market TrendForce","LED display price","Omdia LED display"]
def fetch(q, lang):
    hl = "hl=ko&gl=KR&ceid=KR:ko" if lang=="ko" else "hl=en-US&gl=US&ceid=US:en"
    url = "https://news.google.com/rss/search?q=" + urllib.parse.quote_plus(f"{q} after:{after} before:{before}") + "&" + hl
    for i in range(3):
        try:
            s = urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent":"Mozilla/5.0"}), timeout=30).read().decode("utf-8","ignore"); break
        except Exception as e:
            s = ""; time.sleep(2)
    items=[]
    for it in re.findall(r"<item>(.*?)</item>", s, re.S):
        g=lambda t:(re.search(rf"<{t}[^>]*>(.*?)</{t}>", it, re.S) or [None,""])[1]
        items.append({"q":q,"lang":lang,"title":html.unescape(g("title")),"date":g("pubDate"),"src":html.unescape(re.sub("<[^>]+>","",g("source"))),"link":g("link")})
    return items
allit=[]; stat={}
for q in KO: r=fetch(q,"ko"); stat[q]=len(r); allit+=r
for q in EN: r=fetch(q,"en"); stat[q]=len(r); allit+=r
seen=set(); uniq=[]
for x in allit:
    k=re.sub(r"\s+-\s+[^-]+$","",x["title"])[:60]
    if k in seen: continue
    seen.add(k); uniq.append(x)
json.dump({"stat":stat,"items":uniq},open(out,"w"),ensure_ascii=False,indent=0)
print("queries",len(stat),"raw",len(allit),"unique",len(uniq)); print({k:v for k,v in stat.items()})
