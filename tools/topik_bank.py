#!/usr/bin/env python3
"""TOPIK question bank (v1.17, RYU 2026-11-25): adds the questions in tools/topik_bank/<part>.py to data/TP.json,
so that every objective area has 100+ questions for the random practice (TP-H-00) and the random mock tests.
Re-runnable: questions added earlier (marked "bk": 1) are taken out first.
Choices are shuffled (fixed seed per question) except picture choices ①②③④; the right answer index follows.
Run from the repository root: python3 tools/topik_bank.py && node build.js"""
import json, os, random, sys, hashlib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(ROOT, "tools", "topik_bank"))
import b, c, d, f, g
import importlib
MORE = [importlib.import_module(m) for m in ("b2", "c2", "d2", "f2", "g2") if os.path.exists(os.path.join(ROOT, "tools", "topik_bank", m + ".py"))]

def shuffle(q):
    if q["o"] in (["①", "②", "③", "④"], ["㉠", "㉡", "㉢", "㉣"]): return   # picture choices and places in a text keep their order
    r = random.Random(hashlib.md5(json.dumps(q, ensure_ascii=False).encode()).hexdigest())
    idx = list(range(len(q["o"]))); r.shuffle(idx)
    q["a"] = idx.index(q["a"]); q["o"] = [q["o"][i] for i in idx]

path = os.path.join(ROOT, "data", "TP.json")
tp = json.load(open(path, encoding="utf-8"))
by = {x["code"]: x for x in tp}
n = 0
for x in tp:
    if x.get("tq"): x["tq"] = [q for q in x["tq"] if not q.get("bk")]
for part in (b, c, d, f, g, *MORE):
    for code, qs in part.ADD.items():
        bd = by[code]
        first = bd["tq"][0]
        for q in qs:
            q = json.loads(json.dumps(q))
            if "qs" in q:
                for s in q["qs"]: shuffle(s)
            else:
                shuffle(q)
                q.setdefault("d", first["d"]); q.setdefault("dl", first.get("dl", ""))
                if first.get("lo") and "lo" not in q and q.get("p", "").startswith('<span class="ko">'): q["lo"] = True
            for s in (q.get("qs") or [q]):
                assert 2 <= len(s["o"]) <= 4 and 0 <= s["a"] < len(s["o"]) and s["x"], (code, s)
            q = {"d": q.pop("d"), "dl": q.pop("dl"), **q, "bk": 1}
            bd["tq"].append(q); n += 1
json.dump(tp, open(path, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))
flat = lambda x: sum(len(q["qs"]) if "qs" in q else 1 for q in x.get("tq", []))
tot = {}
for x in tp: tot[x["code"][:4]] = tot.get(x["code"][:4], 0) + flat(x)
print(n, "items added;", tot)
