"""
suit_kidneys — the Kidneys minor arcana (Mundane Acceptance) for the Ulysses "Vico" pack.

Core motif: the `organ`/bean, food, hearth/stove with ember glow, cup, plate, bed, the warm body,
a cat. The warmest, most domestic suit. Each card = body/nourishment/hearth imagery arranged by the
rank's idea, painted in the card's Vico age (AGES[station_slug]). Lean warm within every age.

Stations (from deck.json):
  ricorso : 0 Homecoming, 4 Outsider, 8 Invitation, 12 Mother
  gods    : 1 Replacement, 5 Identity, 9 Recurrence, 13 Affirmation
  heroes  : 2 Trinity, 6 Asymmetry, 10 Child
  men     : 3 City, 7 History, 11 Father
"""
from motifs import *

W, H = 80, 120


# ── local helpers ──────────────────────────────────────────────────────────────
def warm(p):
    """A warm domestic accent for this suit: nudge the ember toward butter/flesh."""
    return shade(p["ember"], 0.25)


def backdrop(c, p, station):
    """Set the age's sky/ground register before any subject is drawn."""
    if station == "gods":
        c.vgrad(0, 0, W, 88, p["sky_top"], p["sky_bot"])
        c.scatter(0, 0, W, 56, p["ink"], 0.22, a=150, seed=7, falloff=0.4)
        c.rect(0, 88, W, H - 88, p["ground"])
    elif station == "heroes":
        c.vgrad(0, 0, W, 92, p["sky_top"], p["horizon"])
        c.rect(0, 92, W, H - 92, p["ground"])
    elif station == "men":
        c.vgrad(0, 0, W, 72, p["sky_top"], p["sky_bot"])  # flat civic field
        c.rect(0, 72, W, H - 72, p["ground"])
    else:  # ricorso
        c.vgrad(0, 0, W, 96, p["sky_top"], p["sky_bot"])
        c.rect(0, 96, W, H - 96, p["ground"])
        c.scatter(0, 60, W, 50, p["stone_lt"], 0.10, a=70, seed=5)  # river-fog


def vign(c, station):
    if station == "gods":
        c.vignette(0.55)
    elif station == "heroes":
        c.vignette(0.4)
    elif station == "men":
        c.vignette(0.2)
    else:
        c.vignette(0.45, col=AGES["ricorso"]["ink"])


def steam(c, x, y, p, n=3, seed=1):
    """Organic rising steam/breath — warmth made visible."""
    for k in range(n):
        sx = x + (k - (n - 1) / 2) * 3
        c.scatter(int(sx) - 1, int(y) - 14, 3, 14, p["bright"], 0.30, a=90, seed=seed + k)


def cup(c, x, y, p, w=8, h=7):
    """A mug: body + handle + warm rim, lit upper-left."""
    c.rect(x, y, w, h, shade(p["stone_lt"], 0.05))
    c.rect(x, y, w, 2, shade(p["bright"], -0.05))  # rim highlight
    c.rect(x + 2, y + h, w - 4, 1, shade(p["stone"], -0.25))  # base shadow
    c.ring(x + w + 1, y + h // 2, 2, shade(p["stone_lt"], -0.1))  # handle


def plate(c, x, y, p, r=6):
    c.disc(x, y, r, shade(p["stone_lt"], 0.08))
    c.disc(x, y, r - 2, shade(p["stone_lt"], -0.12))
    c.disc(x - 1, y - 1, max(1, r - 4), warm(p))  # food on it


def hearth(c, x, ybase, w, h, p, glow=True):
    """A stove/hearth block with an ember mouth — the civic/domestic heart."""
    c.rect(x, ybase - h, w, h, shade(p["stone"], -0.05))
    c.rect(x, ybase - h, w, 2, shade(p["stone_lt"], 0.05))  # top lit
    mw, mh = w // 2, h // 2
    mx, my = x + (w - mw) // 2, ybase - mh - 2
    c.rect(mx, my, mw, mh, p["ink"])
    if glow:
        c.glow(mx + mw / 2, my + mh / 2, mw, p["ember"], 0.85)
        c.rect(mx + 1, my + mh - 3, mw - 2, 2, p["ember"])  # ember bed
        c.rect(mx + 2, my + mh - 2, mw - 4, 1, shade(p["accent"], 0.2))


def bed(c, x, ybase, w, p, body=True):
    """A bed: frame + rumpled cover + optional sleeping body lump."""
    h = 16
    c.rect(x, ybase - h, w, h, shade(p["stone"], -0.2))  # frame
    c.rect(x, ybase - h, w, 5, shade(p["stone_lt"], 0.0))  # pillow band lit
    c.rect(x + 2, ybase - h + 2, 10, 4, shade(p["bright"], -0.08))  # pillow
    cov = shade(warm(p), -0.1)
    for i in range(w - 4):  # rumpled blanket arc
        hump = int(2 * math.sin(i / 5.0))
        c.vline(x + 2 + i, ybase - h + 6 - hump, ybase - 2, cov)
    if body:
        c.disc(x + w - 14, ybase - h + 4, 4, p["figure"])  # head on pillow
        for i in range(16):  # body mound under blanket
            hump = int(4 * math.sin((i + 2) / 7.0))
            c.vline(x + w - 22 + i, ybase - h + 7 - hump, ybase - h + 8, shade(cov, 0.12))


def beanfield(c, cx, cy, n, p, spread=14, ry=4, jitter=True):
    """n kidney-beans scattered organically — for numbered ranks."""
    import math as _m
    for i in range(n):
        ang = 2 * _m.pi * i / n
        rad = spread * (0.6 + 0.4 * ((i * 7) % 5) / 4) if jitter else spread
        bx = int(cx + rad * _m.cos(ang))
        by = int(cy + rad * 0.6 * _m.sin(ang))
        col = warm(p) if i % 2 == 0 else shade(p["accent"], 0.05)
        organ(c, bx, by, ry + 1, ry, col)


def catfig(c, x, ybase, p):
    """A small curled cat — domestic warmth."""
    col = shade(p["figure"], 0.15)
    c.disc(x, ybase - 3, 4, col)            # curled body
    c.disc(x - 4, ybase - 5, 2, col)        # head
    c.set(x - 5, ybase - 7, col); c.set(x - 3, ybase - 7, col)  # ears
    c.line(x + 3, ybase - 1, x - 2, ybase, col)  # tail


def window(c, x, y, w, h, p, lit=True):
    c.rect(x, y, w, h, shade(p["stone"], -0.1))
    inner = shade(p["accent"], 0.2) if lit else shade(p["sky_bot"], -0.1)
    c.rect(x + 1, y + 1, w - 2, h - 2, inner)
    c.vline(x + w // 2, y + 1, y + h - 2, shade(p["stone"], -0.2))
    c.hline(x + 1, x + w - 2, y + h // 2, shade(p["stone"], -0.2))


# ── cards ───────────────────────────────────────────────────────────────────────
def kidneys_0():  # Homecoming — ricorso. Lamplit kitchen, cocoa, bed through doorway.
    p = AGES["ricorso"]; c = Canvas()
    backdrop(c, p, "ricorso")
    # warm room glow
    c.glow(26, 64, 34, p["ember"], 0.30)
    # doorway to bedroom (right) — framed opening, darker room beyond, then the bed
    c.rect(50, 30, 30, 72, shade(p["stone"], -0.05))           # wall block around the door
    c.rect(54, 34, 22, 66, shade(p["stone"], 0.1))             # door frame (lit jamb)
    c.rect(56, 36, 18, 64, shade(p["sky_top"], -0.05))         # dim bedroom interior
    bed(c, 56, 98, 18, p, body=True)
    c.glow(65, 80, 12, warm(p), 0.35)                          # warm bedroom glow
    # hearth/stove left with cocoa cup on top
    hearth(c, 6, 100, 24, 32, p)
    cup(c, 12, 62, p)
    steam(c, 15, 60, p, n=3, seed=3)
    lamp(c, 38, 28, p, r=14, strength=0.6)
    # the suit bean, prominent on a plate on a small table
    c.rect(28, 96, 18, 3, shade(p["stone"], -0.1))            # table
    plate(c, 37, 90, p, r=7)
    organ(c, 37, 88, 5, 4, warm(p))
    vign(c, "ricorso")
    return c


def kidneys_1():  # Replacement — gods. Two comforts in succession: morning cup / afternoon plate.
    p = AGES["gods"]; c = Canvas()
    backdrop(c, p, "gods")
    c.glow(20, 50, 26, p["ember"], 0.5)   # morning fire glow left
    c.glow(60, 70, 24, p["ember"], 0.35)  # afternoon glow right (handing off)
    # left: morning kidney sizzling in pan
    c.disc(20, 56, 9, shade(p["stone_dk"], 0.1))     # pan
    c.disc(20, 56, 7, shade(p["ink"], 0.2))
    organ(c, 20, 55, 5, 4, p["ember"])               # sizzling kidney
    steam(c, 20, 50, p, n=3, seed=2)
    c.vline(28, 56, 60, shade(p["stone"], -0.2))     # pan handle
    # arrow of succession
    for i in range(8):
        c.set(34 + i, 70 - i // 2, shade(p["accent"], 0.1))
    # right: afternoon sandwich + wine cup
    plate(c, 58, 74, p, r=7)
    c.rect(54, 70, 8, 4, shade(p["accent"], -0.1))   # sandwich
    cup(c, 64, 80, p)
    vign(c, "gods")
    return c


def kidneys_2():  # Trinity — heroes. Three vignettes in a triangle: feed / rest / pleasure.
    p = AGES["heroes"]; c = Canvas()
    backdrop(c, p, "heroes")
    c.glow(40, 64, 40, p["ember"], 0.28)
    # top: nourishment — plate + bean
    plate(c, 40, 30, p, r=8)
    organ(c, 40, 28, 6, 4, warm(p))
    steam(c, 40, 22, p, n=3, seed=4)
    # lower-left: rest — a small bed
    bed(c, 4, 100, 26, p, body=True)
    # lower-right: pleasure — cup + a heart-warm glow
    plate(c, 64, 92, p, r=7)
    cup(c, 60, 78, p)
    c.glow(64, 90, 12, warm(p), 0.5)
    # connective triangle of light
    c.line(40, 36, 14, 86, shade(p["accent"], 0.0), a=90)
    c.line(40, 36, 64, 80, shade(p["accent"], 0.0), a=90)
    vign(c, "heroes")
    return c


def kidneys_3():  # The City — men. Foursquare civic grid of hearths around a Liffey-artery.
    p = AGES["men"]; c = Canvas()
    backdrop(c, p, "men")
    # the Liffey as a warm artery bisecting
    for y in range(0, H):
        x = 40 + int(6 * math.sin(y / 14.0))
        c.rect(x - 2, y, 4, 1, shade(p["accent"], -0.2))
    # four civic blocks, each a hearth (the city as organs of care)
    for (bx, by) in [(8, 56), (52, 56), (8, 110), (52, 110)]:
        c.rect(bx, by - 22, 20, 22, shade(p["stone"], 0.05))
        c.rect(bx, by - 22, 20, 2, p["stone_lt"])
        window(c, bx + 3, by - 17, 6, 6, p, lit=True)
        window(c, bx + 11, by - 17, 6, 6, p, lit=True)
        c.glow(bx + 10, by - 8, 7, p["ember"], 0.4)
        c.rect(bx + 7, by - 7, 6, 4, p["ink"])  # doorway/mouth
    # a kidney-bean set into the central crossing — the city knows what bodies need
    c.disc(40, 80, 9, shade(p["stone_lt"], 0.06))   # a civic medallion behind it
    c.disc(40, 80, 8, shade(p["accent"], -0.25))
    organ(c, 40, 79, 6, 5, warm(p))
    c.glow(40, 80, 10, p["ember"], 0.35)
    vign(c, "men")
    return c


def kidneys_4():  # The Outsider — ricorso. Fed body at table, marked apart at the edge.
    p = AGES["ricorso"]; c = Canvas()
    backdrop(c, p, "ricorso")
    c.glow(50, 70, 26, p["ember"], 0.32)
    # the table of nourishment, off-center to the right
    c.rect(34, 78, 42, 4, shade(p["stone"], -0.05))
    c.rect(36, 82, 3, 18, shade(p["stone"], -0.2)); c.rect(70, 82, 3, 18, shade(p["stone"], -0.2))
    plate(c, 50, 74, p, r=7)
    organ(c, 50, 72, 5, 4, warm(p))   # the kidney feeds him regardless
    cup(c, 62, 70, p)
    steam(c, 50, 66, p, n=2, seed=6)
    # the outsider figure pushed to the left margin, half off-frame
    figure(c, 10, 100, 40, p["figure"])
    # five-pointed star marking otherness, faint, upper-left
    cx, cy, r = 14, 24, 6
    pts = []
    for i in range(5):
        a = -math.pi / 2 + i * 2 * math.pi / 5
        pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
    order = [0, 2, 4, 1, 3, 0]
    for i in range(5):
        x0, y0 = pts[order[i]]; x1, y1 = pts[order[i + 1]]
        c.line(x0, y0, x1, y1, shade(p["accent"], 0.1), a=150)
    vign(c, "ricorso")
    return c


def kidneys_5():  # Identity — gods. Two figures sharing a meal: recognition through bodily care.
    p = AGES["gods"]; c = Canvas()
    backdrop(c, p, "gods")
    c.glow(40, 72, 30, p["ember"], 0.55)
    # shared table between them
    c.rect(28, 80, 24, 4, shade(p["stone"], 0.0))
    plate(c, 40, 76, p, r=6)
    organ(c, 40, 74, 5, 4, warm(p))
    steam(c, 40, 68, p, n=3, seed=8)
    # two figures facing the shared food
    figure(c, 18, 104, 38, p["figure"])
    figure(c, 62, 104, 38, p["figure"])
    # recognition: a warm arc of light linking their heads
    c.glow(40, 70, 22, warm(p), 0.30)
    cup(c, 22, 82, p); cup(c, 50, 82, p)
    vign(c, "gods")
    return c


def kidneys_6():  # Asymmetry — heroes. Seven beans, uneven (3 large / 4 small), still nourishing.
    p = AGES["heroes"]; c = Canvas()
    backdrop(c, p, "heroes")
    c.glow(40, 60, 36, p["ember"], 0.28)
    # three large meals (top, uneven row)
    big = [(20, 38, 7), (44, 32, 8), (64, 44, 7)]
    for (bx, by, r) in big:
        plate(c, bx, by + 4, p, r=r)
        organ(c, bx, by, r, r - 2, warm(p))
    # four small snacks (lower, scattered)
    small = [(16, 70), (34, 80), (52, 74), (68, 84)]
    for (bx, by) in small:
        organ(c, bx, by, 4, 3, shade(p["accent"], 0.05))
    # a contented body grounding it
    figure(c, 40, 112, 26, p["figure"])
    vign(c, "heroes")
    return c


def kidneys_7():  # History — men. Layered hearths through time, all feeding into 1904 stove.
    p = AGES["men"]; c = Canvas()
    backdrop(c, p, "men")
    # receding strata of older hearths (each fainter/higher = deeper past)
    for k, (yy, dim) in enumerate([(34, -0.35), (50, -0.22), (66, -0.1)]):
        c.rect(14 + k * 4, yy, 52 - k * 8, 12, shade(p["stone"], dim))
        c.glow(40, yy + 7, 8, p["ember"], 0.25 + 0.1 * k)
        c.rect(36, yy + 6, 8, 4, p["ink"])
    # the present 1904 stove, foreground, fully realized
    hearth(c, 24, 110, 32, 30, p)
    plate(c, 40, 88, p, r=6)
    organ(c, 40, 86, 5, 4, warm(p))
    steam(c, 40, 80, p, n=3, seed=9)
    vign(c, "men")
    return c


def kidneys_8():  # Invitation — ricorso. A drawn bath, steam rising, hand at the threshold.
    p = AGES["ricorso"]; c = Canvas()
    backdrop(c, p, "ricorso")
    c.glow(40, 80, 34, warm(p), 0.30)
    # the bathtub, warm water waiting
    c.rect(20, 78, 44, 22, shade(p["stone"], 0.05))
    c.rect(20, 78, 44, 4, p["stone_lt"])          # lit rim
    water = shade(p["accent"], -0.05)
    c.rect(22, 84, 40, 14, water)
    c.rect(22, 84, 40, 2, shade(p["accent"], 0.18))  # water surface sheen
    # tub feet
    c.rect(24, 100, 4, 4, shade(p["stone"], -0.2)); c.rect(56, 100, 4, 4, shade(p["stone"], -0.2))
    # steam rising in organic curves
    c.scatter(26, 56, 34, 26, p["bright"], 0.16, a=90, seed=11)
    steam(c, 34, 78, p, n=3, seed=12); steam(c, 50, 78, p, n=3, seed=13)
    # the figure at the threshold, hand reaching toward the offered comfort
    figure(c, 70, 104, 34, p["figure"])
    c.rect(58, 76, 8, 2, p["figure"])  # reaching arm
    vign(c, "ricorso")
    return c


def kidneys_9():  # Recurrence — gods. Ten beans in a warm ring/cycle — daily need returning.
    p = AGES["gods"]; c = Canvas()
    backdrop(c, p, "gods")
    c.glow(40, 60, 34, p["ember"], 0.55)
    cx, cy, R = 40, 60, 26
    for i in range(10):
        a = -math.pi / 2 + i * 2 * math.pi / 10
        bx = cx + R * math.cos(a); by = cy + R * 0.85 * math.sin(a)
        col = warm(p) if i % 2 == 0 else shade(p["accent"], 0.05)
        organ(c, int(bx), int(by), 4, 3, col)
    # the cycle's connecting ring
    c.ring(cx, cy, R, shade(p["accent"], -0.1), a=120)
    c.ring(cx, cy, R, shade(p["accent"], -0.1), a=70)
    # central warm hearth — the body that keeps needing/being fed
    c.glow(cx, cy, 10, warm(p), 0.6)
    organ(c, cx, cy, 6, 5, p["bright"])
    vign(c, "gods")
    return c


def kidneys_10():  # Child — heroes. A small figure eating with unselfconscious joy.
    p = AGES["heroes"]; c = Canvas()
    backdrop(c, p, "heroes")
    c.glow(40, 70, 32, p["ember"], 0.30)
    # low table sized for a child
    c.rect(26, 82, 28, 3, shade(p["stone"], 0.0))
    c.rect(28, 85, 3, 12, shade(p["stone"], -0.2)); c.rect(50, 85, 3, 12, shade(p["stone"], -0.2))
    plate(c, 40, 78, p, r=7)
    organ(c, 40, 76, 6, 4, warm(p))         # the kidney, prominent
    steam(c, 40, 70, p, n=2, seed=14)
    # the child — small figure, leaning in to eat
    figure(c, 40, 70, 22, p["figure"])
    # a curled cat at the child's feet — domestic ease
    catfig(c, 60, 98, p)
    vign(c, "heroes")
    return c


def kidneys_11():  # Father — men. Bloom at the stove, practiced, offering food outward.
    p = AGES["men"]; c = Canvas()
    backdrop(c, p, "men")
    window(c, 50, 18, 22, 22, p, lit=True)   # kitchen window daylight
    # the stove, the father's domain
    hearth(c, 10, 104, 26, 30, p)
    c.disc(20, 72, 7, shade(p["stone_dk"], 0.1))  # pan on stove
    organ(c, 20, 71, 5, 4, warm(p))
    steam(c, 20, 66, p, n=3, seed=15)
    # Bloom, middle-aged, attentive, offering a plate outward
    figure(c, 48, 108, 42, p["figure"])
    c.rect(36, 84, 10, 2, p["figure"])       # extended arm
    plate(c, 32, 86, p, r=5)                  # the offered plate
    vign(c, "men")
    return c


def kidneys_12():  # Mother — ricorso. Molly substantial in bed; the body as fact and presence.
    p = AGES["ricorso"]; c = Canvas()
    backdrop(c, p, "ricorso")
    c.glow(40, 74, 36, warm(p), 0.34)
    # a large bed filling the lower frame
    by = 108
    c.rect(8, by - 28, 64, 28, shade(p["stone"], -0.2))      # frame
    c.rect(8, by - 28, 64, 6, shade(p["stone_lt"], 0.0))     # headboard lit
    c.rect(12, by - 26, 16, 6, shade(p["bright"], -0.06))    # pillow
    # the substantial reclining body, generous organic curves
    for i in range(56):                                       # blanketed reclining mound
        hump = int(9 * math.sin((i + 6) / 22.0))
        c.vline(12 + i, by - 18 - hump, by - 2, shade(warm(p), -0.12))
    # shoulder rising toward the pillow so the head connects to the mound
    for i in range(12):
        c.vline(50 + i, by - 22 - i, by - 4, shade(warm(p), -0.05))
    c.disc(60, by - 22, 6, shade(p["stone_lt"], 0.12))       # face flesh, conscious, on pillow
    c.disc(60, by - 23, 2, shade(p["figure"], 0.2))          # hair/brow shadow
    c.rect(56, by - 30, 12, 4, shade(p["figure"], 0.1))      # hair on pillow
    # one warm bean at the foot — the suit's body-fact
    organ(c, 20, by - 8, 5, 4, warm(p))
    catfig(c, 66, by - 4, p)
    vign(c, "ricorso")
    return c


def kidneys_13():  # Affirmation — gods. A glowing YES built from warmth; the fed, sensual body.
    p = AGES["gods"]; c = Canvas()
    backdrop(c, p, "gods")
    c.glow(40, 54, 40, p["ember"], 0.6)
    # the word YES, blocky, glowing warm — made of bodily warmth
    col = p["bright"]; gl = warm(p)
    # Y
    c.line(10, 30, 16, 44, col); c.line(22, 30, 16, 44, col); c.vline(16, 44, 56, col)
    # E
    c.vline(30, 30, 56, col); c.hline(30, 40, 30, col); c.hline(30, 38, 43, col); c.hline(30, 40, 56, col)
    # S
    c.hline(48, 60, 30, col); c.vline(48, 30, 43, col); c.hline(48, 60, 43, col)
    c.vline(60, 43, 56, col); c.hline(48, 60, 56, col)
    c.glow(35, 43, 30, gl, 0.30)  # the warmth behind the word
    # the warm fed body below, the sensual yes
    figure(c, 40, 110, 30, p["figure"])
    c.glow(40, 96, 14, warm(p), 0.5)
    organ(c, 40, 92, 6, 5, p["bright"])  # the heart/bean of embodied existence
    vign(c, "gods")
    return c


CARDS = {
    "kidneys-0": kidneys_0,
    "kidneys-1": kidneys_1,
    "kidneys-2": kidneys_2,
    "kidneys-3": kidneys_3,
    "kidneys-4": kidneys_4,
    "kidneys-5": kidneys_5,
    "kidneys-6": kidneys_6,
    "kidneys-7": kidneys_7,
    "kidneys-8": kidneys_8,
    "kidneys-9": kidneys_9,
    "kidneys-10": kidneys_10,
    "kidneys-11": kidneys_11,
    "kidneys-12": kidneys_12,
    "kidneys-13": kidneys_13,
}
