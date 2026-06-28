"""
The "Cube" skin for the Ultima Octave deck. NOT illustration — composition of precise components:
each minor = a flat field in the virtue's colour-cube colour + the octave's emblem + a top-centre
3-bit watermark (Truth/Love/Courage as empty/filled circles) + a faint lunar mark. Majors are the
proper nouns as single luminous emblems on graphite.

Run from repo root:  python tools/cube/cube_build.py [--montage]  ->  app/src/decks/ultima-octave/cube/<slug>.png
"""
import os, sys, json
from PIL import Image
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "lumen"))
from lumenkit import Lumen, W, H, _lerp

ROOT = os.path.join(os.path.dirname(__file__), "..", "..")
DECK = os.path.join(ROOT, "decks", "ultima-octave", "deck.json")
OUT = os.path.join(ROOT, "app", "src", "decks", "ultima-octave", "cube")
GRAPHITE = (12, 12, 14)

def hx(h): h = h.lstrip("#"); return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))
VIRHEX = {"humility":"#1B1B20","valor":"#D4453F","compassion":"#3FA85C","sacrifice":"#D8B23A",
          "honesty":"#3E6FD6","honor":"#B45ABF","justice":"#46BFC4","spirituality":"#ECE9E0"}
VIRBITS = {"humility":(0,0,0),"valor":(0,0,1),"compassion":(0,1,0),"sacrifice":(0,1,1),
           "honesty":(1,0,0),"honor":(1,0,1),"justice":(1,1,0),"spirituality":(1,1,1)}
PHASES = ["new-moon","waxing-crescent","first-quarter","waxing-gibbous","full-moon","waning-gibbous","last-quarter","waning-crescent"]
LIGHT, DARK = (238, 238, 233), (20, 20, 24)

def ink_for(rgb):
    lum = 0.2126*rgb[0] + 0.7152*rgb[1] + 0.0722*rgb[2]
    return DARK if lum > 145 else LIGHT

# ── the octave emblems (drawn in ink; `f` = field colour for knockouts) ──────────
def em_virtue(c, k, f):   # the Ankh — the sign of virtue
    c.ring(100, 116, 15, k, 4); c.line(100, 131, 100, 212, k, 5); c.line(72, 158, 128, 158, k, 5)
def em_place(c, k, f):    # a city gate
    c.rect(66, 150, 18, 60, k); c.rect(116, 150, 18, 60, k); c.rect(60, 138, 80, 14, k)
    for x in (62, 94, 126): c.rect(x, 128, 12, 10, k)
    c.rect(92, 172, 16, 38, f)
def em_role(c, k, f):     # a standing figure (the class)
    c.disc(100, 106, 12, k); c.rect(89, 122, 22, 50, k); c.rect(90, 170, 8, 40, k); c.rect(102, 170, 8, 40, k)
def em_companion(c, k, f):  # two figures
    c.disc(86, 112, 10, k); c.rect(77, 126, 18, 44, k); c.rect(78, 168, 7, 34, k); c.rect(88, 168, 7, 34, k)
    c.disc(122, 122, 8, k); c.rect(115, 134, 14, 34, k); c.rect(116, 166, 6, 28, k); c.rect(123, 166, 6, 28, k)
def em_word(c, k, f):     # a rune-stave (the mantra)
    c.line(100, 92, 100, 212, k, 5); c.line(100, 122, 78, 140, k, 4); c.line(100, 152, 124, 136, k, 4); c.line(100, 178, 80, 196, k, 4)
def em_stone(c, k, f):    # an octahedron (the colour-stone)
    p = [(100, 90), (132, 152), (100, 214), (68, 152)]
    for i in range(4): c.line(*p[i], *p[(i+1) % 4], k, 4)
    c.line(68, 152, 132, 152, k, 3); c.line(100, 90, 100, 214, k, 3)
def em_reagent(c, k, f):  # a flask
    c.ring(100, 170, 26, k, 4); c.rect(94, 110, 12, 42, k); c.rect(90, 106, 20, 8, k)
def em_shrine(c, k, f):   # a trilithon with an ankh
    c.rect(68, 134, 14, 74, k); c.rect(118, 134, 14, 74, k); c.rect(62, 120, 76, 14, k); c.rect(54, 208, 92, 8, k)
    c.ring(100, 158, 9, k, 3); c.line(100, 167, 100, 198, k, 3); c.line(86, 180, 114, 180, k, 3)

OCTEM = {"virtue":em_virtue, "place":em_place, "role":em_role, "companion":em_companion,
         "word":em_word, "stone":em_stone, "reagent":em_reagent, "shrine":em_shrine}

def watermark(c, bits, field, ink):
    col = _lerp(ink, field, 0.5)                 # subtle: halfway between ink and field
    for i, on in enumerate(bits):                # Truth, Love, Courage  (left -> right)
        x = 84 + i * 16
        if on: c.disc(x, 34, 5, col)
        else: c.ring(x, 34, 5, col, 1.6)

def lunar(c, station, field, ink):               # a faint phase mark, bottom centre
    idx = PHASES.index(station); col = _lerp(ink, field, 0.45)
    cx, cy, r = 100, 262, 8
    c.ring(cx, cy, r, col, 1.4)
    frac = idx / 7.0
    if idx == 0: pass
    elif idx == 4: c.disc(cx, cy, r - 1, col)
    else:
        # waxing left->full, waning->dark: fill a vertical slice
        import math
        for yy in range(-r, r + 1):
            half = int((r * r - yy * yy) ** 0.5)
            lit = int(half * 2 * (frac if frac <= 0.5 else (1 - frac)) * 2)
            if frac < 0.5: c.line(cx - half, cy + yy, cx - half + lit, cy + yy, col, 0.4)
            else: c.line(cx + half - lit, cy + yy, cx + half, cy + yy, col, 0.4)

def render_minor(card):
    suit = card["suit_slug"]; field = hx(VIRHEX[suit]); ink = ink_for(field)
    c = Lumen(field); c.fill(field)
    OCTEM[card["rank_slug"]](c, ink, field)
    watermark(c, VIRBITS[suit], field, ink)
    lunar(c, card["station_slug"], field, ink)
    c.vignette(0.16, _lerp(field, (0, 0, 0), 0.6)); c.grain(4)
    return c

# ── major emblems (luminous, on graphite) ───────────────────────────────────────
def mj_ankh(c, k): c.ring(100, 112, 17, k, 5); c.line(100, 129, 100, 216, k, 6); c.line(70, 158, 130, 158, k, 6)
def mj_crown(c, k):
    c.poly([(64, 170), (64, 120), (82, 146), (100, 112), (118, 146), (136, 120), (136, 170)], k)
    c.rect(64, 170, 72, 14, k)
def mj_eye(c, k):
    c.poly([(54, 150), (100, 122), (146, 150), (100, 178)], k); c.disc(100, 150, 13, GRAPHITE); c.disc(100, 150, 8, k)
def mj_book(c, k):
    c.rect(58, 120, 84, 64, k); c.rect(64, 126, 72, 52, GRAPHITE); c.line(100, 126, 100, 178, k, 3)
def mj_moon(c, k, full=True):
    c.disc(100, 150, 34, k)
    if not full: c.disc(112, 142, 30, GRAPHITE)
def mj_gem(c, k, shatter=False):
    p = [(100, 104), (138, 150), (100, 214), (62, 150)]
    for i in range(4): c.line(*p[i], *p[(i+1) % 4], k, 5)
    c.line(62, 150, 138, 150, k, 3); c.line(100, 104, 100, 214, k, 3)
    if shatter: c.line(100, 150, 124, 188, k, 3); c.line(100, 150, 74, 130, k, 3)
def mj_figure(c, k): c.disc(100, 106, 13, k); c.rect(88, 124, 24, 52, k); c.rect(89, 174, 9, 40, k); c.rect(104, 174, 9, 40, k)
def mj_gate(c, k):
    c.rect(60, 116, 16, 100, k); c.rect(124, 116, 16, 100, k); c.rect(56, 104, 88, 14, k); c.rect(80, 140, 40, 76, _lerp(k, GRAPHITE, 0.7))
def mj_rune(c, k):
    c.line(100, 96, 100, 214, k, 6); c.line(100, 124, 74, 144, k, 5); c.line(100, 156, 128, 138, k, 5); c.line(100, 184, 76, 202, k, 5)
def mj_flame(c, k): c.poly([(100, 100), (124, 160), (112, 156), (100, 200), (88, 156), (76, 160)], k)
def mj_wheel(c, k):
    c.ring(100, 156, 40, k, 5); c.ring(100, 156, 10, k, 4)
    import math
    for i in range(8):
        a = i / 8 * math.tau; c.line(100 + math.cos(a) * 12, 156 + math.sin(a) * 12, 100 + math.cos(a) * 38, 156 + math.sin(a) * 38, k, 3)
def mj_triad(c, k):
    for x in (72, 100, 128): c.disc(x, 150, 11, k)
def mj_star(c, k):
    import math
    for i in range(8):
        a = i / 8 * math.tau - math.pi / 2; r = 42 if i % 2 == 0 else 16
        c.line(100, 150, 100 + math.cos(a) * r, 150 + math.sin(a) * r, k, 4)
def mj_cube(c, k):
    c.rect(64, 130, 56, 56, k) if False else None
    # wireframe cube
    c.line(60, 138, 116, 138, k, 4); c.line(116, 138, 116, 194, k, 4); c.line(116, 194, 60, 194, k, 4); c.line(60, 194, 60, 138, k, 4)
    c.line(84, 118, 140, 118, k, 4); c.line(140, 118, 140, 174, k, 4)
    c.line(60, 138, 84, 118, k, 4); c.line(116, 138, 140, 118, k, 4); c.line(116, 194, 140, 174, k, 4)
def mj_spiral(c, k):
    import math
    pts = []
    for i in range(60):
        t = i / 59; a = t * math.tau * 2.2; r = 6 + t * 46
        pts.append((100 + math.cos(a) * r, 150 + math.sin(a) * r))
    for i in range(len(pts) - 1): c.line(*pts[i], *pts[i+1], k, 3)

MAJ = {
 0:(mj_ankh,"#ECE9E0"), 1:(mj_crown,"#D8B23A"), 2:(mj_eye,"#D4453F"), 3:(mj_book,"#ECE9E0"),
 4:(mj_ankh,"#ECE9E0"), 5:(lambda c,k: mj_moon(c,k,True),"#3E6FD6"), 6:(lambda c,k: mj_moon(c,k,False),"#46BFC4"),
 7:(mj_gem,"#B45ABF"), 8:(mj_spiral,"#B45ABF"), 9:(mj_cube,"#D4453F"),
 10:(mj_eye,"#5878B0"), 11:(mj_flame,"#4E8E63"), 12:(mj_figure,"#A85049"),
 13:(mj_gate,"#ECE9E0"), 14:(mj_rune,"#ECE9E0"), 15:(mj_gate,"#B45ABF"), 16:(mj_wheel,"#46BFC4"),
 17:(mj_triad,"#D8B23A"), 18:(mj_triad,"#3FA85C"), 19:(mj_star,"#ECE9E0"), 20:(lambda c,k: mj_gem(c,k,True),"#B45ABF"),
 21:(mj_cube,"#ECE9E0"),
}

def render_major(card):
    n = int(card["number"]); fn, accent = MAJ[n]; k = hx(accent)
    c = Lumen(GRAPHITE); c.fill(GRAPHITE)
    fn(c, k)
    c.glow(100, 150, 70, k, 0.28); c.vignette(0.4, (2, 2, 4)); c.grain(4)
    return c


def main():
    data = json.load(open(DECK, encoding="utf-8")); cards = data["cards"]
    os.makedirs(OUT, exist_ok=True)
    for slug, card in cards.items():
        c = render_minor(card) if card["arcana"] == "minor" else render_major(card)
        c.save(os.path.join(OUT, f"{slug}.png"), 2)
    print(f"rendered {len(cards)} -> {os.path.relpath(OUT)}")
    if "--montage" in sys.argv:
        pad = 5
        # minors: 8 octaves (rows) x 8 virtues (cols)
        octs = ["virtue","place","role","companion","word","stone","reagent","shrine"]
        virs = ["humility","valor","compassion","sacrifice","honesty","honor","justice","spirituality"]
        sheet = Image.new("RGB", ((W+pad)*8+pad, (H+pad)*8+pad), (10,10,12))
        for r, o in enumerate(octs):
            for cc, v in enumerate(virs):
                render_minor(cards[f"{v}-{o}"]).paste_logical(sheet, pad+cc*(W+pad), pad+r*(H+pad))
        sheet.save(os.path.join(os.path.dirname(__file__), "cube_montage_minors.png")); print("minors montage")
        mj = sorted([c for c in cards.values() if c["arcana"]=="major"], key=lambda c:int(c["number"]))
        ms = Image.new("RGB", ((W+pad)*6+pad, (H+pad)*4+pad), (10,10,12))
        for i, card in enumerate(mj):
            render_major(card).paste_logical(ms, pad+(i%6)*(W+pad), pad+(i//6)*(H+pad))
        ms.save(os.path.join(os.path.dirname(__file__), "cube_montage_majors.png")); print("majors montage")


if __name__ == "__main__":
    main()
