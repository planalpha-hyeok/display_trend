"""네이버 뉴스 검색 결과에서 제목·매체·요약·원문 링크를 뽑는다. 사용: python3 naver.py "검색어" """
import sys, re, html, urllib.parse, urllib.request
q=sys.argv[1]
u="https://search.naver.com/search.naver?where=news&sort=1&query="+urllib.parse.quote(q)
s=urllib.request.urlopen(urllib.request.Request(u,headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}),timeout=30).read().decode("utf-8","ignore")
links=re.findall(r'href="(https?://(?!search\.naver|news\.naver|blog|cafe|ssl\.pstatic|www\.naver|help\.naver|m\.)[^"]+)"',s)
seen=[];[seen.append(l) for l in links if l not in seen]
txt=html.unescape(re.sub(r"<[^>]+>"," ",re.sub(r"<(script|style).*?</\1>","",s,flags=re.S)))
txt=re.sub(r"\s+"," ",txt)
i=txt.find("구독하세요."); body=txt[i+12:i+1100] if i>=0 else txt[:1100]
body=re.sub(r"(새 창 열림|Keep에 저장|Keep에 바로가기|네이버뉴스)"," ",body); print(re.sub(r"\s+"," ",body))
print("LINKS:",[l for l in seen if not re.search(r"naver\.com|pstatic",l)][:4])
