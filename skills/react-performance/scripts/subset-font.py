"""Subset fonts to the characters a site uses; optionally rename them (OFL Reserved Font Name).

python subset-font.py --chars site-chars.json --out DIR [--rename OLD=NEW]
                      [--base RANGES] [--features LIST] FONT [FONT ...]

Needs fontTools with brotli: pip install fonttools brotli. --chars comes from site-chars.mjs.
Keeps the base set plus every site character the font has. --base takes extra ranges in
pyftsubset syntax (e.g. U+0400-04FF for Cyrillic of a planned language).
Layout features default to those browsers apply on their own (ccmp, locl, liga, kern, mark,
mkmk); add others only if the site uses them (font-feature-settings, tabular-nums - and only
if the font has them).
"""
import argparse
import json
import sys
from pathlib import Path

from fontTools.subset import Options, Subsetter, parse_unicodes
from fontTools.ttLib import TTFont

DEFAULT_BASE = (
    "U+0020-007E,U+00A0-00FF,"  # Basic Latin, Latin-1
    "U+2000-206F,"  # spaces, dashes, quotes, ellipsis
    "U+20A0-20CF,"  # currency signs
    "U+2116,U+2122,U+2212,U+2248,U+2260,U+2264,U+2265"  # No. TM minus and comparisons
)
DEFAULT_FEATURES = "ccmp,locl,liga,kern,mark,mkmk"
# Name records that carry the family name; copyright (0), trademark (7) and license (13, 14) stay.
RENAME_IDS = {1, 3, 4, 6, 16, 17, 18, 21, 22, 25}

ap = argparse.ArgumentParser()
ap.add_argument("fonts", nargs="+", type=Path)
ap.add_argument("--chars", required=True, type=Path)
ap.add_argument("--out", required=True, type=Path)
ap.add_argument("--rename", help="OLD=NEW family name (required for an OFL font with a Reserved Font Name)")
ap.add_argument("--base", default="", help="extra base ranges, pyftsubset syntax")
ap.add_argument("--features", default=DEFAULT_FEATURES)
args = ap.parse_args()

site = {cp for cp, _ in json.loads(args.chars.read_text(encoding="utf-8"))["chars"]}
base = set(parse_unicodes(DEFAULT_BASE + ("," + args.base if args.base else "")))
old, new = args.rename.split("=", 1) if args.rename else (None, None)

report = []
for src in args.fonts:
    font = TTFont(src)
    cmap = set(font.getBestCmap())
    opts = Options()
    opts.layout_features = args.features.split(",")
    opts.name_IDs = ["*"]
    opts.name_legacy = True
    opts.name_languages = ["*"]
    opts.notdef_outline = True
    opts.flavor = "woff2"
    sub = Subsetter(opts)
    sub.populate(unicodes=sorted((base | site) & cmap))
    sub.subset(font)

    if old:
        for rec in font["name"].names:
            text = rec.toUnicode()
            if rec.nameID in RENAME_IDS and old in text:
                rec.string = text.replace(old, new)
            elif rec.nameID == 5 and new not in text:
                rec.string = f"{text}; {new}: subset of {old}"

    args.out.mkdir(parents=True, exist_ok=True)
    stem = src.stem.replace(old, new) if old else src.stem
    dst = args.out / f"{stem}.woff2"
    font.save(dst)

    check = TTFont(dst)
    report.append({
        "file": dst.name,
        "before_kb": round(src.stat().st_size / 1024, 1),
        "after_kb": round(dst.stat().st_size / 1024, 1),
        "chars": len(check.getBestCmap()),
        "site_chars_lost": [chr(c) for c in sorted((site & cmap) - set(check.getBestCmap()))],
        "names_with_old": [r.nameID for r in check["name"].names if old and r.nameID in RENAME_IDS and old in r.toUnicode()],
        "family": check["name"].getDebugName(1),
        "site_chars_not_in_font": "".join(chr(c) for c in sorted(site - cmap) if c > 0x20)[:300],
    })

sys.stdout.reconfigure(encoding="utf-8")  # Windows consoles default to a legacy code page
print(json.dumps(report, ensure_ascii=False, indent=1))
