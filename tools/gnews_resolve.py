"""Google 뉴스 링크(news.google.com/rss/articles/...)를 원문 기사 주소로 바꾼다.
사용:
  python3 tools/gnews_resolve.py <링크>                 원문 주소 출력
  python3 tools/gnews_resolve.py --fix docs/weekly/<호>/content.js
                                                        파일 안의 Google 뉴스 링크를 원문 주소로 교체(실패한 것은 그대로 둠)
Google 뉴스 기사 페이지의 공개 데이터(서명·시각)로 원문 주소를 조회하는 방식이다."""
import json, re, sys, time, urllib.parse, urllib.request

UA = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/124 Safari/537.36"}
PAT = re.compile(r"https://news\.google\.com/rss/articles/[A-Za-z0-9_\-]+(?:\?[^\"'\s]*)?")


def _get(url):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=30).read().decode("utf8", "replace")


def resolve(link):
    gid = re.search(r"articles/([^?]+)", link).group(1)
    page = _get("https://news.google.com/rss/articles/" + gid)
    sg = re.search(r'data-n-a-sg="([^"]+)"', page)
    ts = re.search(r'data-n-a-ts="([^"]+)"', page)
    if not (sg and ts):
        return None
    inner = ["garturlreq", [["X", "X", ["X", "X"], None, None, 1, 1, "US:en", None, 1, None, None, None, None, None, 0, 1],
                            "X", "X", 1, [1, 1, 1], 1, 1, None, 0, 0, None, 0], gid, int(ts.group(1)), sg.group(1)]
    body = "f.req=" + urllib.parse.quote(json.dumps([[["Fbv4je", json.dumps(inner)]]]))
    req = urllib.request.Request("https://news.google.com/_/DotsSplashUi/data/batchexecute", data=body.encode(),
                                 headers={**UA, "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"})
    text = urllib.request.urlopen(req, timeout=30).read().decode()
    m = re.search(r'\[\\"garturlres\\",\\"(.*?)\\"', text)
    if not m:
        return None
    url = m.group(1).encode().decode("unicode_escape").replace("\\u003d", "=").replace("\\u0026", "&")
    return url if url.startswith("http") else None


def fix_file(path):
    src = open(path, encoding="utf8").read()
    links = sorted(set(PAT.findall(src)))
    ok = fail = 0
    for link in links:
        try:
            url = resolve(link)
        except Exception:
            url = None
        if url:
            src = src.replace(link, url)
            ok += 1
        else:
            fail += 1
        time.sleep(0.5)
    open(path, "w", encoding="utf8").write(src)
    print(f"RESOLVED {ok} / FAILED {fail} ({path})")


if __name__ == "__main__":
    if len(sys.argv) == 3 and sys.argv[1] == "--fix":
        fix_file(sys.argv[2])
    elif len(sys.argv) == 2:
        print(resolve(sys.argv[1]) or "FAIL")
    else:
        print(__doc__)
