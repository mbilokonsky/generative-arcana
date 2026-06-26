"""
Ulysses "Vico" pixel pack — suit TOWERS (Mythic Resistance).

Core motif: the tower / spire (motifs.tower). Each card = the tower arranged by its rank's idea,
painted in the card's Vico age (gods/heroes/men/ricorso). The age supplies palette + register:
storm-dark primal awe; monumental twilight; flat civic daylight; dissolving night→dawn.

Authoring loop: render -> look -> refine.  python tools/pixel/build.py --suit towers
"""
from motifs import *   # Canvas, AGES, shade, W, H, figure, crowd, building, tower, column, headstone, ...


# ── local helpers ──────────────────────────────────────────────────────────────
def spire(c, x, ybase, w, h, pal, lean=0.0, crack=False, ghost=False, crown=False):
    """A tall angular tower-spire (the suit's sharper cousin of motifs.tower).
    lean: px the top shifts right per full height; crack: a fracture line; ghost: translucent;
    crown: a bright capstone (triumph)."""
    top = ybase - h
    a = 120 if ghost else 255
    for j in range(h):
        ty = top + j
        f = j / max(1, h - 1)              # 0 top .. 1 base
        cx = x + lean * (1 - f)            # top leans, base anchored
        for i in range(w):
            # light from upper-left across the width
            col = shade(pal["stone"], 0.34 - 0.72 * (i / max(1, w - 1)))
            c.set(cx + i, ty, col, a)
    # crenellations
    step = max(2, w // 3)
    for i in range(0, w + 1, step):
        cx = x + lean
        c.rect(cx + i - 1, top - 3, max(2, w // 5), 3,
               pal["stone_lt"] if i < w / 2 else pal["stone_dk"], a)
    c.hline(x + lean, x + lean + w - 1, top, pal["stone_lt"], a)
    # narrow slit window
    c.rect(x + lean + w // 2 - 1, top + 6, 2, 5, pal["ink"], a)
    # doorway at base
    c.rect(x + w // 2 - 1, ybase - 8, 3, 8, pal["ink"], a)
    if crack:
        cx = x + w // 2
        cy = top + 4
        for k in range(h - 6):
            cx += (1 if (k % 3) else -1)
            c.set(min(x + w - 1, max(x, cx)), cy + k, pal["ink"])
            c.set(min(x + w - 1, max(x, cx)) + 1, cy + k, shade(pal["stone"], -0.35))
    if crown:
        cx = x + lean + w // 2
        c.disc(cx, top - 4, 2, pal["accent"])
        c.set(cx, top - 7, pal["bright"])
        c.glow(cx, top - 4, 9, pal["bright"], 0.45)


def hill(c, ybase, pal, h=14):
    """The rounded hill the tower stands on (deck symbol: 'tower on hill')."""
    cx = W // 2
    for yy in range(ybase - h, ybase + 1):
        f = (yy - (ybase - h)) / max(1, h)
        half = int((W * 0.62) * (0.4 + 0.6 * f))
        c.hline(cx - half, cx + half, yy, shade(pal["ground"], 0.06 - 0.18 * f))


def storm(c, pal, seed=1):
    """Age-of-gods storm sky overlay."""
    c.scatter(0, 0, W, 46, pal["ink"], 0.5, seed=seed, falloff=0.9)
    c.scatter(0, 0, W, 32, pal["stone_dk"], 0.35, seed=seed + 9, falloff=1.0, a=190)


def fog(c, pal, y, h, seed=1, dens=0.32):
    """Ricorso drifting fog / motes."""
    c.scatter(0, y, W, h, pal["stone_lt"], dens, seed=seed, a=110, falloff=0.5)
    c.scatter(0, y, W, h, pal["bright"], dens * 0.4, seed=seed + 5, a=90)


# ════════════════════════════════════════════════════════════════════════════════
# towers-0  Homecoming — GODS  : the lone Martello on its hill, figure at threshold
# ════════════════════════════════════════════════════════════════════════════════
def homecoming():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 88, p["sky_top"], p["sky_bot"])
    storm(c, p, seed=4)
    c.glow(40, 30, 22, p["horizon"], 0.25)
    c.rect(0, 88, W, H - 88, p["ground"])
    hill(c, 96, p, 16)
    tower(c, 30, 90, 22, 50, p)
    # a lone key dropped at the threshold (access surrendered)
    kx, ky = 56, 78
    c.ring(kx, ky, 3, p["accent"]); c.set(kx, ky, p["bright"])
    c.vline(kx, ky + 3, ky + 11, p["accent"]); c.hline(kx, kx + 3, ky + 11, p["accent"])
    figure(c, 44, 90, 15, p["figure"])      # ambiguous: arriving or leaving
    c.vignette(0.55)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-1  Replacement — HEROES : one tower fading, another solidifying; figure between
# ════════════════════════════════════════════════════════════════════════════════
def replacement():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 88, p["sky_top"], p["horizon"])
    c.glow(40, 22, 16, p["bright"], 0.3)
    c.rect(0, 88, W, H - 88, p["ground"])
    c.hline(0, W - 1, 88, shade(p["ground"], 0.15))
    spire(c, 12, 92, 16, 46, p, ghost=True)     # old tower dissolving
    spire(c, 50, 92, 18, 58, p)                 # new tower, taller, solid
    figure(c, 40, 92, 16, p["figure"])          # the handoff
    c.vignette(0.4)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-2  Trinity — MEN : three towers in civic daylight, linked, figure centered
# ════════════════════════════════════════════════════════════════════════════════
def trinity():
    p = AGES["men"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 90, p["sky_top"], p["horizon"])
    c.rect(0, 90, W, H - 90, p["ground"])
    c.hline(0, W - 1, 90, shade(p["ground"], -0.12))
    # three distinct towers in a triangle (two flanking + one taller behind/center)
    spire(c, 46, 64, 16, 40, p)                 # center, set back, tallest
    tower(c, 8, 92, 18, 44, p)                  # left
    tower(c, 54, 92, 18, 44, p)                 # right
    # ley-lines connecting them (the system)
    c.line(17, 52, 46, 26, p["accent"], 150)
    c.line(63, 52, 46, 26, p["accent"], 150)
    c.line(17, 52, 63, 52, p["accent"], 120)
    figure(c, 40, 92, 13, p["figure"])          # held in tension at center
    c.vignette(0.2)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-3  The City — RICORSO : Dublin's forest of spires dissolving into river-fog
# ════════════════════════════════════════════════════════════════════════════════
def the_city():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 96, p["sky_top"], p["sky_bot"])
    c.glow(40, 84, 30, p["horizon"], 0.25)
    water_y = 100
    # skyline of many verticals of varying height + shape (pointed spires & blocky towers)
    spec = [(3, 18, "p"), (11, 30, "b"), (19, 22, "p"), (27, 38, "b"),
            (36, 26, "p"), (44, 46, "p"), (54, 24, "b"), (62, 34, "p"), (71, 20, "b")]
    for sx, sh, kind in spec:
        sw = 6
        top = water_y - sh
        for j in range(sh):
            for i in range(sw):
                c.set(sx + i, water_y - j, shade(p["stone"], 0.18 - 0.5 * (i / (sw - 1)) - 0.18 * (j / sh)))
        if kind == "p":      # pointed Gothic spire
            c.line(sx, top, sx + sw // 2, top - 7, p["stone_lt"])
            c.line(sx + sw - 1, top, sx + sw // 2, top - 7, shade(p["stone"], -0.2))
            c.set(sx + sw // 2, top - 8, p["stone_lt"])
        else:                # crenellated block
            for i in range(0, sw, 3):
                c.rect(sx + i, top - 3, 2, 3, p["stone_lt"] if i < sw / 2 else p["stone_dk"])
    fog(c, p, 64, 36, seed=3, dens=0.26)
    c.rect(0, water_y, W, H - water_y, shade(p["sky_bot"], -0.18))
    # reflection of skyline in the river
    c.reflect(0, water_y - 46, water_y, water_y, tint=p["horizon"], shimmer=0.55, fade=0.5)
    figure(c, 40, water_y + 8, 9, shade(p["figure"], 0.1))   # tiny, dwarfed, in the streets
    c.vignette(0.45, col=p["ink"])
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-4  The Outsider — GODS : a lone tower apart, across water from the city cluster
# ════════════════════════════════════════════════════════════════════════════════
def the_outsider():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 92, p["sky_top"], p["sky_bot"])
    storm(c, p, seed=8)
    # the city's approved cluster of spires, small, far right, four-square
    for sx, sh in [(58, 14), (64, 20), (70, 12), (74, 17)]:
        for j in range(sh):
            c.vline(sx, 92 - sh + j, 92 - sh + j, shade(p["stone_dk"], 0.05))
            c.rect(sx, 92 - sh, 4, sh, shade(p["stone_dk"], 0.05 - 0.2 * j / sh))
    c.rect(0, 92, W, H - 92, p["ground"])
    # separating water
    c.rect(40, 92, 40, 6, shade(p["sky_bot"], -0.2))
    # the outsider tower — round Martello, alone, left, on its own ground
    tower(c, 14, 94, 22, 56, p)
    figure(c, 25, 94, 14, p["figure"])
    c.vignette(0.55)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-5  Identity — HEROES : a forge below, a tower being made; a kindred tower answers
# ════════════════════════════════════════════════════════════════════════════════
def identity():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 88, p["sky_top"], p["horizon"])
    c.rect(0, 88, W, H - 88, p["ground"])
    c.hline(0, W - 1, 88, shade(p["ground"], 0.15))
    # the forged tower, central, just taking shape
    spire(c, 30, 88, 18, 52, p, crown=False)
    # a kindred tower in the distance — recognition across the gap
    spire(c, 62, 88, 10, 30, p)
    c.line(48, 44, 67, 60, p["bright"], 130)    # line of sight / recognition
    # forge: anvil + fire in the foreground
    c.glow(22, 98, 13, p["ember"], 0.9)
    c.rect(16, 100, 12, 4, p["stone_dk"])       # anvil body
    c.rect(14, 99, 4, 2, p["stone_lt"])         # anvil horn
    c.rect(21, 96, 5, 3, p["ember"])            # bright forge fire
    figure(c, 36, 100, 13, p["figure"])         # the maker
    c.vignette(0.4)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-6  Asymmetry — MEN : seven towers, 3 + gap + 4, that can't be balanced
# ════════════════════════════════════════════════════════════════════════════════
def asymmetry():
    p = AGES["men"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 92, p["sky_top"], p["horizon"])
    c.rect(0, 92, W, H - 92, p["ground"])
    c.hline(0, W - 1, 92, shade(p["ground"], -0.12))

    def little(x, h):
        w = 7
        for j in range(h):
            for i in range(w):
                c.set(x + i, 92 - j, shade(p["stone"], 0.2 - 0.45 * (i / (w - 1)) - 0.15 * j / h))
        for i in range(0, w, 3):
            c.rect(x + i, 92 - h - 2, 2, 2, p["stone_dk"])
    # three on the left
    for x, h in [(2, 30), (11, 38), (20, 26)]:
        little(x, h)
    # four on the right (across a gap)
    for x, h in [(44, 34), (53, 28), (62, 36), (71, 24)]:
        little(x, h)
    # the uncomfortable empty gap in the middle
    c.scatter(30, 50, 12, 42, p["stone_dk"], 0.06, seed=2, a=120)
    c.vignette(0.2)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-7  History — RICORSO : strata of towers across time, a figure in the waves
# ════════════════════════════════════════════════════════════════════════════════
def history():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 92, p["sky_top"], p["sky_bot"])
    c.glow(40, 30, 30, p["horizon"], 0.18)
    water_y = 96
    # palimpsest: oldest/tallest towers far back & faint, newer ones nearer & solider,
    # stepped left->right so the strata of time read as overlapping layers.
    layers = [(2, 64, 90, -0.05), (16, 50, 130, 0.05), (32, 78, 170, 0.12),
              (50, 42, 200, 0.2), (62, 60, 255, 0.28)]
    for x, h, a, lt in layers:
        w = 13
        top = water_y - h
        for j in range(h):
            for i in range(w):
                c.set(x + i, water_y - j, shade(p["stone"], lt - 0.5 * (i / (w - 1))), a)
        # crenellated cap so each reads as a tower not a slab
        for i in range(0, w, 4):
            c.rect(x + i, top - 3, 2, 3, shade(p["stone_lt"], -0.1), a)
        c.hline(x, x + w - 1, top, p["stone_lt"], a)
        c.rect(x + w // 2 - 1, top + 6, 2, 5, p["ink"], a)
    # the ocean of history at the base
    c.rect(0, water_y, W, H - water_y, shade(p["sky_bot"], -0.12))
    for k in range(5):
        c.scatter(0, water_y + k * 4, W, 3, p["stone_lt"], 0.28 - 0.04 * k, seed=k + 1, a=130)
    fog(c, p, 56, 34, seed=6, dens=0.24)
    figure(c, 38, water_y + 7, 12, shade(p["figure"], 0.12))  # struggling in the waves
    c.vignette(0.45, col=p["ink"])
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-8  Invitation — GODS : a door open at the tower's top onto stars / beyond
# ════════════════════════════════════════════════════════════════════════════════
def invitation():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 96, p["sky_top"], p["sky_bot"])
    starfield(c, 0, 2, W, 50, p, density=0.05, seed=2)
    storm(c, p, seed=12)
    c.rect(0, 96, W, H - 96, p["ground"])
    # one big tower filling the lower frame, its top crenellated
    tower(c, 24, 110, 32, 66, p)
    # an OPEN doorway at the top — the exit, lit from beyond
    dx, dy = 36, 50
    c.glow(dx + 4, dy + 5, 12, p["bright"], 0.6)
    c.rect(dx, dy, 9, 12, shade(p["sky_top"], 0.3))   # bright opening
    c.rect(dx, dy, 9, 12, None)                        # (frame)
    c.vline(dx - 1, dy - 1, dy + 12, p["stone_lt"])
    c.vline(dx + 9, dy - 1, dy + 12, p["stone_dk"])
    c.hline(dx - 1, dx + 9, dy - 1, p["stone_lt"])
    figure(c, dx + 4, dy + 12, 11, p["figure"])        # at the threshold
    c.vignette(0.55)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-9  Recurrence — HEROES : ten towers in a ring/cycle, last touching first
# ════════════════════════════════════════════════════════════════════════════════
def recurrence():
    import math
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, H, p["sky_top"], p["horizon"])
    c.glow(40, 60, 30, p["bright"], 0.18)
    cx, cy, R = 40, 60, 30
    n = 10
    pts = []
    for i in range(n):
        t = -math.pi / 2 + 2 * math.pi * i / n
        pts.append((cx + R * math.cos(t), cy + R * math.sin(t)))
    # connecting ring (the cycle)
    for i in range(n):
        a = pts[i]; b = pts[(i + 1) % n]
        c.line(a[0], a[1], b[0], b[1], p["accent"], 140)
    # little radial towers, each pointing outward from the ring
    for i, (px, py) in enumerate(pts):
        h = 9 + (i % 3) * 3
        w = 4
        for j in range(h):
            for k in range(w):
                c.set(px - w // 2 + k, py - j, shade(p["stone"], 0.25 - 0.5 * k / (w - 1)))
        c.set(px, py - h - 1, p["stone_lt"])
    figure(c, cx, cy + 6, 12, p["figure"])     # standing inside the recursive ring
    c.vignette(0.4)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-10  Child — MEN : young figure before an unfinished, scaffolded tower
# ════════════════════════════════════════════════════════════════════════════════
def child():
    p = AGES["men"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 92, p["sky_top"], p["horizon"])
    c.rect(0, 92, W, H - 92, p["ground"])
    c.hline(0, W - 1, 92, shade(p["ground"], -0.12))
    # the finished Martello in the far background, faint (the aspiration)
    spire(c, 60, 92, 13, 40, p, ghost=True)
    # unfinished tower in foreground — only lower courses laid, top open with rubble edge
    bx, bw, blaid = 24, 24, 30
    for j in range(blaid):
        for i in range(bw):
            c.set(bx + i, 92 - j, shade(p["stone"], 0.3 - 0.6 * (i / (bw - 1))))
    # ragged top course of stones (work-in-progress edge)
    for i in range(0, bw, 4):
        c.rect(bx + i, 92 - blaid - 2, 3, 2, shade(p["stone"], 0.05))
    c.rect(bx + bw // 2 - 1, 92 - 8, 3, 8, p["ink"])     # doorway
    # scaffolding poles + ladder rungs hugging the tower's right side
    sx0, sx1 = bx + bw + 1, bx + bw + 6
    c.vline(sx0, 92 - blaid - 14, 92, p["stone_dk"])
    c.vline(sx1, 92 - blaid - 14, 92, p["stone_dk"])
    for sy in range(92 - blaid - 12, 92, 5):
        c.hline(sx0, sx1, sy, p["stone_dk"])
    # books stacked as building material at the base
    for k, by in enumerate(range(98, 106, 3)):
        c.rect(8, by, 14 - 2 * k, 2, shade(p["accent"], 0.05 - 0.12 * k))
        c.hline(8, 8 + 14 - 2 * k - 1, by, shade(p["accent"], 0.2))
    figure(c, 14, 98, 16, p["figure"])         # the young builder
    c.vignette(0.2)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-11  Father — RICORSO : a weary man at ground level among towers he abandoned
# ════════════════════════════════════════════════════════════════════════════════
def father():
    p = AGES["ricorso"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 94, p["sky_top"], p["sky_bot"])
    c.glow(40, 80, 26, p["horizon"], 0.22)
    c.rect(0, 94, W, H - 94, p["ground"])
    c.hline(0, W - 1, 94, shade(p["ground"], 0.12))
    # towers he has built & abandoned: complete, partial, ruined — set back, dimmed
    spire(c, 5, 90, 13, 48, p)                  # complete, distant (left)
    spire(c, 22, 90, 12, 30, p, crack=True)     # cracked / partial
    # a ruin: a jagged broken stump
    rx, rh = 44, 18
    for j in range(rh):
        notch = (j > rh - 6 and (j % 2 == 0))   # broken top
        for i in range(12):
            if notch and i % 3 == 0:
                continue
            c.set(rx + i, 90 - j, shade(p["stone"], 0.1 - 0.45 * i / 11))
    spire(c, 62, 90, 13, 42, p)                 # another complete (right)
    # dim the abandoned towers behind a veil of river-fog so the Father reads in front
    fog(c, p, 40, 54, seed=7, dens=0.3)
    c.glow(40, 92, 22, p["horizon"], 0.2)              # soft ground-light behind him
    figure(c, 40, 104, 22, shade(p["figure"], 0.28))   # large, foreground, at ground level
    c.vignette(0.45, col=p["ink"])
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-12  Mother — GODS : a large grounded figure; towers rise behind, she is the earth
# ════════════════════════════════════════════════════════════════════════════════
def mother():
    p = AGES["gods"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 90, p["sky_top"], p["sky_bot"])
    storm(c, p, seed=15)
    c.rect(0, 90, W, H - 90, p["ground"])
    hill(c, 102, p, 18)
    # towers rising behind her — sharp, ambitious, reaching (dim but legible)
    spire(c, 6, 88, 12, 52, p)
    spire(c, 58, 88, 14, 60, p)
    spire(c, 34, 84, 12, 40, p)
    # veil them slightly so the Mother dominates the foreground
    c.scatter(0, 30, W, 60, p["sky_bot"], 0.22, seed=21, a=110)
    # the Mother: large, solid, foreground, foundational (warmer figure tone)
    fcol = shade(p["figure"], 0.2)
    figure(c, 40, 110, 32, fcol)
    # hands resting on the earth she holds (attached to the body, not floating)
    c.rect(24, 100, 7, 4, fcol)
    c.rect(49, 100, 7, 4, fcol)
    c.hline(24, 30, 104, shade(p["ground"], 0.12))
    c.hline(49, 55, 104, shade(p["ground"], 0.12))
    c.vignette(0.55)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# towers-13  Affirmation — HEROES : the tower whole, crowned, triumphant. YES.
# ════════════════════════════════════════════════════════════════════════════════
def affirmation():
    p = AGES["heroes"]; c = Canvas(bg=p["sky_top"])
    c.vgrad(0, 0, W, 92, p["sky_top"], p["horizon"])
    c.glow(40, 36, 26, p["bright"], 0.4)
    c.rect(0, 92, W, H - 92, p["ground"])
    c.hline(0, W - 1, 92, shade(p["ground"], 0.18))
    hill(c, 98, p, 14)
    # flanking lesser towers (the ones built before), framing the triumphant central one
    spire(c, 8, 92, 12, 34, p, ghost=True)
    spire(c, 60, 92, 12, 34, p, ghost=True)
    # the central tower, whole and crowned
    spire(c, 30, 92, 20, 64, p, crown=True)
    # affirming figure at the base
    figure(c, 40, 92, 13, p["figure"])
    c.glow(40, 28, 18, p["accent"], 0.35)
    c.vignette(0.4)
    return c


CARDS = {
    "towers-0": homecoming,
    "towers-1": replacement,
    "towers-2": trinity,
    "towers-3": the_city,
    "towers-4": the_outsider,
    "towers-5": identity,
    "towers-6": asymmetry,
    "towers-7": history,
    "towers-8": invitation,
    "towers-9": recurrence,
    "towers-10": child,
    "towers-11": father,
    "towers-12": mother,
    "towers-13": affirmation,
}
