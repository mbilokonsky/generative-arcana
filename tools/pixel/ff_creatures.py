"""
Final Fantasy pixel pack — the four suit creatures.

Each creature keeps its iconic identity colors and is then LIT by the card's element (a rim-light in the
element's signature color, ambient glow tying it to the scene). draw_* place the creature centered at
(cx, feet) and return the focal (x, y) for the atmosphere glow.

Iterate by looking: render -> Read montage -> refine the silhouettes here.
"""
from pixelkit import Canvas, shade
from ff_elements import rimlight

W, H = 80, 120


def ell(c, cx, cy, rx, ry, base, hi=0.26, lo=-0.34, a=255, rim=None, rim_a=170):
    """A filled ellipse, auto-shaded as if lit from the upper-left; optional element rim on the lit edge."""
    cx, cy = round(cx), round(cy)
    for yy in range(-int(ry) - 1, int(ry) + 2):
        for xx in range(-int(rx) - 1, int(rx) + 2):
            q = (xx / rx) ** 2 + (yy / ry) ** 2
            if q <= 1:
                f = -(xx / rx) * 0.55 - (yy / ry) * 0.72           # +upper-left .. -lower-right
                amt = hi * f if f >= 0 else lo * (-f)
                c.set(cx + xx, cy + yy, shade(base, amt), a)
                if rim and q > 0.66 and f > 0.3:                   # bright lit edge
                    c.set(cx + xx, cy + yy, rim, rim_a)


# ── identity palettes ───────────────────────────────────────────────────────────
CHOCOBO = dict(body=(250, 212, 72), light=(255, 238, 156), dark=(206, 158, 40),
               beak=(238, 156, 56), beak_dk=(196, 112, 36), foot=(232, 150, 54), eye=(28, 22, 16),
               wing=(214, 170, 48))
MOOGLE = dict(body=(238, 232, 222), light=(255, 253, 248), dark=(198, 190, 178),
              pom=(226, 78, 88), pom_dk=(178, 52, 66), ear=(214, 184, 184), eye=(34, 28, 30),
              wing=(222, 216, 208))
CACTUAR = dict(body=(98, 180, 98), light=(154, 216, 142), dark=(56, 132, 72),
               spine=(214, 232, 174), face=(24, 40, 24), foot=(70, 150, 80))
TONBERRY = dict(robe=(198, 178, 134), robe_lt=(226, 210, 172), robe_dk=(150, 130, 92),
                skin=(120, 176, 120), skin_lt=(162, 206, 150), skin_dk=(78, 134, 90),
                eye=(245, 178, 70), lantern=(255, 214, 120),
                lantern_dk=(200, 150, 70), blade=(214, 224, 228))


# ── chocobo — tall riding bird, the Boon·Journey suit ───────────────────────────
def draw_chocobo(c, cx, feet, el):
    P, rim = CHOCOBO, rimlight(el)
    # legs + feet
    for lx in (cx - 4, cx + 4):
        c.rect(lx - 1, feet - 13, 3, 13, P["foot"])
        c.hline(lx - 3, lx + 1, feet, P["beak_dk"])
    # tail plume (back / right)
    ell(c, cx + 11, feet - 28, 6, 9, P["dark"])
    ell(c, cx + 12, feet - 31, 4, 5, P["body"])
    # body
    ell(c, cx, feet - 24, 11, 15, P["body"], rim=rim)
    ell(c, cx + 3, feet - 22, 5, 9, P["wing"])           # folded wing
    # neck
    ell(c, cx - 5, feet - 38, 4, 11, P["body"], rim=rim)
    # head (up-left, facing left)
    hx, hy = cx - 7, feet - 44
    ell(c, hx, hy, 5, 5, P["body"], rim=rim)
    # beak
    c.rect(hx - 9, hy - 1, 5, 3, P["beak"]); c.rect(hx - 9, hy, 4, 1, P["beak_dk"])
    # eye
    c.disc(hx - 1, hy - 1, 1, P["eye"])
    # crest — the three signature feathers
    for dx in (-3, 0, 3):
        c.line(hx + dx, hy - 5, hx + dx - 2, hy - 12, P["dark"])
        c.line(hx + dx + 1, hy - 5, hx + dx - 1, hy - 12, P["body"])
    return hx, hy


# ── moogle — round hearth-helper, the Boon·Place suit ───────────────────────────
def draw_moogle(c, cx, feet, el):
    P, rim = MOOGLE, rimlight(el)
    # tiny feet
    for lx in (cx - 4, cx + 4):
        ell(c, lx, feet - 2, 3, 3, P["dark"])
    # wings (behind)
    ell(c, cx - 11, feet - 18, 5, 7, P["wing"]); ell(c, cx + 11, feet - 18, 5, 7, P["wing"])
    # body
    ell(c, cx, feet - 13, 10, 11, P["body"], rim=rim)
    # head (overlaps body — moogles are mostly head)
    hy = feet - 26
    ell(c, cx, hy, 11, 10, P["body"], rim=rim)
    # ears
    ell(c, cx - 8, hy - 7, 3, 4, P["body"]); ell(c, cx + 8, hy - 7, 3, 4, P["body"])
    c.set(cx - 8, hy - 7, P["ear"]); c.set(cx + 8, hy - 7, P["ear"])
    # face
    c.disc(cx - 4, hy, 1, P["eye"]); c.disc(cx + 4, hy, 1, P["eye"])
    c.hline(cx - 1, cx + 1, hy + 4, P["dark"])           # small mouth
    # antenna + the red pom-pom
    c.vline(cx, hy - 10, hy - 16, P["dark"])
    ell(c, cx, hy - 19, 4, 4, P["pom"]); ell(c, cx - 1, hy - 20, 2, 2, shade(P["pom"], 0.3))
    return cx, hy - 19


# ── cactuar — desert sentinel, the Bane·Place suit ──────────────────────────────
def draw_cactuar(c, cx, feet, el):
    P, rim = CACTUAR, rimlight(el)
    # running legs (splayed)
    c.line(cx - 2, feet - 18, cx - 8, feet, P["dark"]); c.line(cx - 1, feet - 18, cx - 7, feet, P["body"])
    c.line(cx + 2, feet - 18, cx + 8, feet, P["dark"]); c.line(cx + 1, feet - 18, cx + 7, feet, P["body"])
    # body column
    bx, by = cx, feet - 30
    for yy in range(-18, 19):
        half = 6 if -14 < yy < 14 else 4
        for xx in range(-half, half + 1):
            f = -xx * 0.09 - yy * 0.01
            c.set(bx + xx, by + yy, shade(P["body"], 0.22 * f if f > 0 else -0.3 * -f))
    ell(c, bx, by, 6, 19, P["body"], hi=0.28, lo=-0.36, rim=rim)
    # arms: one out (left), one up (right) — the iconic pose
    c.rect(bx - 14, by - 4, 9, 5, P["body"]); ell(c, bx - 14, by - 2, 2, 2, P["dark"])
    c.rect(bx + 5, by - 16, 5, 9, P["body"]); ell(c, bx + 7, by - 16, 2, 2, P["light"])
    # face — the classic dots + O
    c.disc(bx - 2, by - 6, 1, P["face"]); c.disc(bx + 2, by - 6, 1, P["face"])
    c.ring(bx, by - 1, 2, P["face"])
    # a few spine flecks
    for (sx, sy) in ((-4, -12), (3, -2), (-3, 8), (4, 12)):
        c.set(bx + sx, by + sy, P["spine"])
    return bx, by - 6


# ── tonberry — the hooded, lantern-bearing passage, the Bane·Journey suit ───────
def draw_tonberry(c, cx, feet, el):
    P, rim = TONBERRY, rimlight(el)
    # cloaked body: a pointed hood narrowing at top, flaring to a robe at the base; leaning forward (left)
    top = feet - 40
    span = feet - top
    for j in range(span):
        yy = top + j
        f = j / max(1, span)
        half = round(2 + 14 * f) if f < 0.28 else round(6 + 9 * (f - 0.28) / 0.72)
        lean = round(3 * (1 - f))
        for xx in range(-half, half + 1):
            sh = -xx * 0.06
            c.set(cx + xx - lean, yy, shade(P["robe"], 0.18 * sh if sh > 0 else -0.36 * -sh))
        c.set(cx - half - lean, yy, rim, 165)               # lit (left) edge
    # the dark hood opening with two small glowing eyes
    ell(c, cx - 2, top + 6, 4, 5, P["robe_dk"])
    c.disc(cx - 3, top + 6, 1, P["eye"]); c.disc(cx + 1, top + 6, 1, P["eye"])
    # the lantern, held out front (left) — its own warm light regardless of element
    lx, ly = cx - 14, feet - 18
    c.glow(lx, ly, 13, P["lantern"], 0.75)
    c.rect(lx - 2, ly - 4, 5, 7, P["lantern_dk"]); c.rect(lx - 1, ly - 3, 3, 5, P["lantern"])
    c.line(lx + 1, ly - 4, cx - 7, feet - 24, P["robe_dk"])  # the arm
    # a small knife glint on the near (right) side
    c.line(cx + 9, feet - 16, cx + 12, feet - 23, P["blade"])
    return lx, ly
