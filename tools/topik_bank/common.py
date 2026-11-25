"""Helpers for the TOPIK question bank (v1.17, RYU 2026-11-25: every objective area 100+ questions, random practice).
New questions are written in the style of the test, never copied from past papers.
Each part file (b.py, c.py, ...) fills ADD = {bundle code: [questions]}; tools/topik_bank.py appends them to data/TP.json.
Short forms:
  au("f:line|m:line")          listening script (f woman, m man, n announcer)
  Q(o, a, x, au=, p=, d=, dl=)  one question; d/dl default to the bundle's own direction
  S(qs, au=, p=, d=, dl=)       a set: one script or text, several (q, o, a, x) questions
  pics([(emoji, caption) x4])   four picture choices"""


def au(s):
    return [[x.split(":", 1)[0].strip(), x.split(":", 1)[1].strip()] for x in s.split("|")]


def Q(o, a, x, au=None, p=None, d=None, dl=None, lo=False):
    q = {}
    if d: q["d"] = d
    if dl: q["dl"] = dl
    if au: q["au"] = au
    if p: q["p"] = p
    q.update({"o": o, "a": a, "x": x})
    if lo: q["lo"] = True
    return q


def S(qs, au=None, p=None, d="다음을 듣고 물음에 답하십시오.", dl="Listen and answer the questions."):
    q = {"d": d, "dl": dl}
    if au: q["au"] = au
    if p: q["p"] = p
    q["qs"] = [{"q": a, "o": b, "a": c, "x": e} for a, b, c, e in qs]
    return q


def SR(qs, p):
    return S(qs, p=p, d="다음을 읽고 물음에 답하십시오.", dl="Read and answer the questions.")


def pics(rows):
    return '<div class="pics">' + "".join(f'<div><b>{"①②③④"[i]}</b><span>{e}</span><small>{c}</small></div>' for i, (e, c) in enumerate(rows)) + "</div>"


def notice(*lines):
    return '<div class="notice">' + "<br>".join(lines) + "</div>"


O4 = ["①", "②", "③", "④"]
