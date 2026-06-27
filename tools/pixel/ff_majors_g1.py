"""
Final Fantasy Tarot — MAJOR ARCANA 0–7, bespoke chibi pixel scenes (the FF monomyth beats).

These are NOT the suit creatures. Each card is one clear, iconic idea drawn in the flat chibi style
(bold outlines, flat cel fills, NO soft-gradient 3D) and LIT by its element. Element = palette + light
only (laid down by flat_backdrop + atmosphere); the card's meaning + visuals decide the content.

  major-0 The Unwritten (fire)   — amnesiac youth at dawn's edge, back to us, unwritten horizon.
  major-1 The Call (thunder)     — a shaft of charged light strikes an upraised hand; a crystal pulses.
  major-2 The Companion (earth)  — two figures, one steadying the other across a gap; the bond.
  major-3 The Mentor (holy)      — an elder haloed in descending light, hand on a youth's shoulder.
  major-4 The Fellowship (ice)   — a ring of figures on a frozen plateau, a small fire of resolve.
  major-5 The Empire (water)     — a vast iron fortress-city over a dark sea, one tiny boat dwarfed.
  major-6 The Airship (wind)     — an airship banking through bright cloud, the world small below.
  major-7 The Trial (dark)       — a lone figure at the mouth of a black passage, one weak light.

Render:  python tools/pixel/ff_build.py --module ff_majors_g1
"""
import math
from pixelkit import Canvas, shade
import ff_elements as E
from ff_flatkit import (
    W, H, OUT, fe, fblob, frect, capsule, blade, eye, cel, flat_backdrop, contact,
)


# ── helpers ──────────────────────────────────────────────────────────────────

def _mix(a, b, t):
    return (round(a[0] + (b[0] - a[0]) * t),
            round(a[1] + (b[1] - a[1]) * t),
            round(a[2] + (b[2] - a[2]) * t))


def hero(c, cx, feet, p, h=46, *,
         skin=(244, 206, 160), hair=(96, 64, 44), cloth=None, cloth2=None,
         face="front", look=0, arms="down", lit=None):
    """A chibi adventurer: big head, big eyes, plain traveler's clothes. ~h tall, standing on (cx,feet).

    face: 'front' (eyes) | 'back' (no face, hair fills) | 'side'.
    arms: 'down' | 'up' (both raised) | 'reach' (one arm out to the +x side, lower) | 'cross'.
    cloth = tunic color, cloth2 = trouser color. lit = rim/highlight color (element light).
    Returns (head_cx, head_cy) of the head center.
    """
    cloth = cloth or _mix(p["stone"], (60, 70, 110), 0.4)
    cloth2 = cloth2 or shade(cloth, -0.35)
    lit = lit or p["bright"]
    head_r = 9
    hy = feet - h + head_r           # head center
    # --- legs ---
    leg_top = feet - 12
    frect(c, cx - 5, leg_top, 4, 12, cloth2, OUT)
    frect(c, cx + 2, leg_top, 4, 12, cloth2, OUT)
    fe(c, cx - 3, feet + 1, 3, 2, OUT)          # boots
    fe(c, cx + 4, feet + 1, 3, 2, OUT)
    # --- torso ---
    body_top = hy + head_r - 1
    fblob(c, cx, (body_top + leg_top) // 2, 7, (leg_top - body_top) // 2 + 2, cloth, OUT)
    cel(c, cx - 3, body_top + 2, 2, 3, _mix(cloth, lit, 0.45))
    # --- arms ---
    sh = body_top + 2
    if arms == "up":
        capsule(c, [(cx - 6, sh), (cx - 9, sh - 6), (cx - 8, hy - 9)], 2, cloth, OUT)
        capsule(c, [(cx + 6, sh), (cx + 9, sh - 6), (cx + 8, hy - 9)], 2, cloth, OUT)
    elif arms == "reach":
        capsule(c, [(cx + 5, sh), (cx + 11, sh + 1), (cx + 17, sh)], 2, cloth, OUT)
        capsule(c, [(cx - 5, sh), (cx - 8, sh + 5)], 2, cloth, OUT)
    elif arms == "cross":
        capsule(c, [(cx - 6, sh), (cx - 2, sh + 5)], 2, cloth, OUT)
        capsule(c, [(cx + 6, sh), (cx + 2, sh + 5)], 2, cloth, OUT)
    else:  # down
        capsule(c, [(cx - 6, sh), (cx - 8, sh + 7)], 2, cloth, OUT)
        capsule(c, [(cx + 6, sh), (cx + 8, sh + 7)], 2, cloth, OUT)
    # --- head ---
    fblob(c, cx, hy, head_r, head_r, skin, OUT)
    if face == "back":
        # hair covers the whole skull from behind, with a clear nape + collar so it reads as a person
        fblob(c, cx, hy - 1, head_r, head_r - 1, hair, OUT)
        fe(c, cx, hy + head_r - 3, head_r - 2, 3, hair)      # nape
        c.hline(cx - 4, cx + 4, body_top, shade(cloth, -0.4))  # collar line at the shoulders
        c.set(cx - head_r + 1, hy + 2, _mix(hair, lit, 0.5))   # a strand catching light
        cel(c, cx + 2, hy - 4, 3, 2, _mix(hair, lit, 0.45))
    else:
        # hair as a top cap
        fe(c, cx, hy - 4, head_r, 5, hair)
        c.disc(cx - head_r + 2, hy - 1, 2, hair); c.disc(cx + head_r - 2, hy - 1, 2, hair)
        cel(c, cx - 4, hy - 4, 2, 1, _mix(hair, lit, 0.5))
        if face == "front":
            eye(c, cx - 4, hy + 1, 3, look=look)
            eye(c, cx + 4, hy + 1, 3, look=look)
            c.set(cx + look, hy + 5, shade(skin, -0.4))      # nose dot
        else:  # side — faces the direction of `look` (default right). nose on that side.
            d = -1 if look < 0 else 1
            eye(c, cx + 3 * d, hy + 1, 3, look=d)
            c.set(cx + 6 * d, hy + 4, shade(skin, -0.3))   # nose juts forward
            fe(c, cx - 6 * d, hy - 2, 2, 4, hair)          # hair bulks at the back of the head
    return cx, hy


def edge_light(c, cx, hy, feet, lit, side=-1, span=10):
    """Element rim-light that HUGS the silhouette: for each row, find the outermost non-background
    pixel within `span` of the body center on `side`, and brighten it. Reads as light on the edge,
    never a floating bar. Call AFTER the figure is drawn."""
    for y in range(hy - 9, min(feet + 1, H)):
        edge = None
        rng = range(cx, cx + side * span, side)
        for x in rng:
            if not (0 <= x < W):
                break
            px = c.px[y][x]
            if px == OUT:                    # the bold outline = the silhouette edge
                edge = x
                break
        if edge is not None:
            c.set(edge, y, lit, a=180)
            c.set(edge - side, y, _mix(c.px[y][edge - side], lit, 0.5))


def crystal(c, cx, cy, r, p, *, faces=(232, 244, 255)):
    """A faceted upright crystal, flat cel facets, element-lit core."""
    top = cy - r * 2
    bot = cy + r
    body = p["accent"]
    lt = _mix(body, faces, 0.6)
    dk = shade(body, -0.35)
    # diamond body: top point, mid widest, bottom point
    pts_l = [(cx, top), (cx - r, cy - 2), (cx - r + 1, cy + 2), (cx, bot)]
    pts_r = [(cx, top), (cx + r, cy - 2), (cx + r - 1, cy + 2), (cx, bot)]
    # fill via horizontal spans
    for y in range(top, bot + 1):
        if y < cy:
            t = (y - top) / max(1, (cy - top))
            half = round(r * t)
        else:
            t = (y - cy) / max(1, (bot - cy))
            half = round(r * (1 - t))
        for x in range(cx - half, cx + half + 1):
            col = lt if x < cx - 1 else (body if x < cx + half - 1 else dk)
            c.set(x, y, col)
    # outline edges
    for a, b in zip(pts_l, pts_l[1:]):
        c.line(a[0], a[1], b[0], b[1], OUT)
    for a, b in zip(pts_r, pts_r[1:]):
        c.line(a[0], a[1], b[0], b[1], OUT)
    c.line(cx, top, cx, bot, shade(body, -0.2))      # center ridge
    c.set(cx - 2, cy - r, p["bright"])               # glint
    c.glow(cx, cy, r + 4, p["glow"], 0.5)


def airship(c, cx, cy, p, scale=1.0, bank=-0.25):
    """A flat chibi airship: balloon envelope + hull + fin, banking. bank = tilt slope (dy/dx)."""
    s = scale
    env_rx, env_ry = round(20 * s), round(10 * s)     # balloon half-widths
    hull_w, hull_h = round(22 * s), round(7 * s)
    env_top = _mix(p["stone_dk"], (180, 120, 90), 0.45)   # warm balloon top (contrasts pale sky)
    env_lt = _mix(env_top, p["bright"], 0.5)
    stripe = p["accent"]
    hull = _mix(p["stone_dk"], (120, 88, 56), 0.5)
    hull_lt = _mix(hull, p["bright"], 0.4)

    def at(dx, dy):
        return (cx + dx, cy + dy + round(dx * bank))

    # --- envelope (skewed solid balloon) ---
    ecy = -env_ry - 4
    for xx in range(-env_rx, env_rx + 1):
        tx = xx / env_rx
        h = round(env_ry * math.sqrt(max(0.0, 1 - tx * tx)))
        bxp, byp = at(xx, ecy)
        for yy in range(-h, h + 1):
            # tonal bands: top lit, a mid stripe, lower shade
            if yy < -h + 2:
                col = env_lt
            elif -2 <= yy <= 1:
                col = stripe
            elif yy > h - 3:
                col = shade(env_top, -0.2)
            else:
                col = env_lt if xx < -env_rx // 3 else env_top
            c.set(bxp, byp + yy, col)
    # envelope outline
    for xx in range(-env_rx, env_rx + 1):
        tx = xx / env_rx
        h = round(env_ry * math.sqrt(max(0.0, 1 - tx * tx)))
        bxp, byp = at(xx, ecy)
        c.set(bxp, byp - h - 1, OUT); c.set(bxp, byp + h + 1, OUT)
    el_, _ = at(-env_rx - 1, ecy); er_, _ = at(env_rx + 1, ecy)
    c.set(el_, at(-env_rx, ecy)[1], OUT); c.set(er_, at(env_rx, ecy)[1], OUT)
    # ribs
    for k in (-2, -1, 0, 1, 2):
        rx, ry = at(k * env_rx * 2 // 5, ecy)
        hh = round(env_ry * math.sqrt(max(0.0, 1 - (k * 2 / 5) ** 2)))
        c.vline(rx, ry - hh + 1, ry + hh - 1, shade(env_top, -0.25), a=140)

    # --- hull (wooden boat) ---
    for j in range(hull_h):
        t = j / max(1, hull_h - 1)
        half = round(hull_w / 2 * (1 - 0.5 * t))
        col = hull_lt if j == 0 else (hull if j < hull_h - 1 else shade(hull, -0.3))
        bx, by = at(0, 4 + j)
        c.hline(bx - half, bx + half, by, col)
    # hull outline + keel point
    hlx, hly = at(-hull_w // 2, 4); hrx, hry = at(hull_w // 2, 4)
    kx, ky = at(0, 4 + hull_h)
    c.line(hlx, hly, kx, ky, OUT); c.line(hrx, hry, kx, ky, OUT)
    c.line(hlx, hly, hrx, hry, OUT)
    # connecting struts (envelope -> hull)
    for sxp in (-env_rx + 4, env_rx - 4):
        a = at(sxp, ecy + env_ry); b = at(sxp, 3)
        c.line(a[0], a[1], b[0], b[1], OUT)
    # tail fin (front of travel = +x)
    fxp, fyp = at(hull_w // 2 - 1, 3)
    c.line(fxp, fyp, fxp + round(8 * s), fyp - round(8 * s), OUT)
    fe(c, fxp + round(4 * s), fyp - round(3 * s), round(3 * s), round(4 * s), stripe)
    c.line(fxp + round(8 * s), fyp - round(8 * s), fxp + 1, fyp - round(2 * s), OUT)
    # a tiny pennant streaming back (-x, the wind)
    pxp, pyp = at(-env_rx - 1, ecy)
    c.line(pxp, pyp, pxp - round(9 * s), pyp - 2, stripe)
    c.line(pxp - round(9 * s), pyp - 2, pxp - round(14 * s), pyp, stripe, a=170)


def fortress(c, base_y, p):
    """A vast iron fortress-city silhouette filling the upper frame — tiered towers, lit windows."""
    stone = p["stone"]
    dk = shade(stone, -0.45)
    md = shade(stone, -0.25)
    lt = p["stone_lt"]
    win = p["glow"]
    # main mass: a stepped wall across the width
    c.rect(0, base_y - 30, W, 30, dk)
    # tiered blocks rising
    blocks = [(2, 18, 18), (16, 34, 26), (38, 26, 22), (56, 22, 30), (66, 14, 16)]
    for bx, bw, bh in blocks:
        top = base_y - bh
        c.rect(bx, top, bw, bh, md)
        c.vline(bx, top, base_y, lt, a=120)               # lit left edge
        c.rect(bx, top, bw, 2, shade(md, 0.15))           # cap
        # crenellations
        for k in range(bx + 1, bx + bw - 1, 4):
            c.rect(k, top - 2, 2, 2, md)
        # windows (lit specks)
        for wy in range(top + 4, base_y - 3, 5):
            for wx in range(bx + 2, bx + bw - 2, 4):
                c.set(wx, wy, win)
    # a central spire/keep
    sx = 44
    c.rect(sx, base_y - 46, 8, 46, md)
    c.rect(sx, base_y - 46, 8, 2, lt)
    for tip in range(3):
        c.set(sx + 1 + tip * 3, base_y - 48, md); c.set(sx + 1 + tip * 3, base_y - 47, md)
    for wy in range(base_y - 42, base_y - 4, 6):
        c.set(sx + 2, wy, win); c.set(sx + 5, wy, win)
    c.disc(sx + 4, base_y - 50, 2, p["accent"])           # a beacon


def little_boat(c, cx, wy, p):
    """A tiny boat with one figure, dwarfed."""
    hull = shade(p["stone"], -0.1)
    frect(c, cx - 5, wy - 2, 11, 3, hull, OUT)
    c.line(cx - 5, wy + 1, cx + 5, wy + 1, OUT)
    fe(c, cx - 6, wy, 2, 2, hull); fe(c, cx + 6, wy, 2, 2, hull)   # prow/stern
    # tiny figure
    c.disc(cx, wy - 5, 2, p["bright"])
    c.rect(cx - 1, wy - 4, 3, 4, _mix(p["stone_lt"], p["bright"], 0.3))
    c.vline(cx + 4, wy - 9, wy - 2, OUT)                  # a little mast


def campfire(c, cx, gy, p):
    """A small flat fire of resolve."""
    # logs
    c.line(cx - 4, gy, cx + 3, gy - 2, shade((110, 78, 50), -0.2))
    c.line(cx - 3, gy - 2, cx + 4, gy, shade((110, 78, 50), -0.1))
    # flame tongues
    flame = (255, 180, 70)
    core = (255, 232, 150)
    for dx, hh in ((-2, 6), (0, 9), (2, 6)):
        fe(c, cx + dx, gy - hh // 2 - 1, 2, hh // 2 + 1, flame)
    fe(c, cx, gy - 5, 1, 3, core)
    c.glow(cx, gy - 4, 11, (255, 170, 60), 0.7)


def starfield_dark(c, p, n=40, seed=7):
    import random
    r = random.Random(seed)
    for _ in range(n):
        x = r.randint(0, W - 1); y = r.randint(0, 70)
        c.set(x, y, _mix(p["sky_bot"], p["bright"], r.uniform(0.3, 0.9)), a=180)


# ── CARDS ────────────────────────────────────────────────────────────────────

def major_0():
    """The Unwritten (fire) — amnesiac youth, back to us, at the lip of an unlit field at dawn."""
    el = "fire"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    # the unwritten field ahead: dark, low — keep it almost black past the figure
    c.rect(0, 92, W, H - 92, shade(p["ground"], -0.35))
    c.dither_rect(0, 88, W, 6, shade(p["ground"], -0.5), 0.4)
    # a single drifting spark rising (world being lit)
    for i, (sx, sy) in enumerate([(50, 60), (54, 48), (49, 36), (56, 24)]):
        c.disc(sx, sy, 2 - (i // 2), p["bright"])
        c.glow(sx, sy, 5, p["glow"], 0.6)
    # hero from behind, edge caught in gold
    fx, fy = 38, 92
    hx, hy = hero(c, fx, fy, p, face="back", arms="down",
                  hair=(70, 46, 30), cloth=_mix(p["stone"], (90, 70, 60), 0.4))
    edge_light(c, hx, hy, fy, _mix(p["glow"], p["bright"], 0.35), side=1)   # dawn light on the right edge
    contact(c, fx, fy, el, w=12)
    E.atmosphere(c, el, 53, 40)
    return c


def major_1():
    """The Call (thunder) — a shaft of charged light strikes an upraised hand; a crystal pulses."""
    el = "thunder"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    # the crystal behind/left, pulsing, throwing hard blue shadow
    crystal(c, 22, 60, 9, p)
    # the bolt: a jagged shaft from the sky down to the upraised hand
    bx = [40, 36, 44, 39, 45, 42]
    by = [2, 16, 28, 40, 50, 58]
    for a in range(len(bx) - 1):
        c.line(bx[a], by[a], bx[a + 1], by[a + 1], p["bright"])
        c.line(bx[a] + 1, by[a], bx[a + 1] + 1, by[a + 1], _mix(p["bright"], p["glow"], 0.5), a=170)
    c.glow(43, 56, 14, p["glow"], 0.8)
    # hero, arm raised to meet it, hair/cloak lifted by static
    fx, fy = 50, 100
    hx, hy = hero(c, fx, fy, p, arms="up", look=0,
                  hair=(60, 52, 92), cloth=_mix(p["stone"], (90, 80, 150), 0.5))
    # the upraised right hand catching the bolt
    c.disc(58, 58, 3, p["bright"]); c.glow(58, 58, 8, p["glow"], 0.7)
    # static-lifted hair flecks
    for hx2, hy2 in ((42, 50), (47, 46), (39, 54)):
        c.set(hx2, hy2, p["bright"], a=200)
    edge_light(c, hx, hy, fy, p["glow"], side=-1)
    contact(c, fx, fy, el, w=12)
    E.atmosphere(c, el, 50, 56)
    return c


def major_2():
    """The Companion (earth) — two figures, one steadying the other across a gap in the stone."""
    el = "earth"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    # two solid ochre rock ledges (left lower, right a step up) with a dark chasm between
    lg, rg = 96, 92                      # ledge top y for left / right
    c.rect(0, lg, 30, H - lg, shade(p["ground"], 0.05))
    c.rect(50, rg, W - 50, H - rg, shade(p["ground"], 0.05))
    c.rect(0, lg, 30, 3, p["stone_lt"]); c.rect(50, rg, W - 50, 3, p["stone_lt"])   # lit ledge tops
    # the chasm: pure dark falling away between the ledges
    c.rect(30, lg, 20, H - lg, shade(p["ground"], -0.6))
    c.dither_rect(30, lg, 20, 6, p["stone_dk"], 0.5)
    c.line(30, lg, 32, H, p["stone_dk"]); c.line(49, rg, 47, H, p["stone_dk"])   # chasm walls
    # cliff faces under each ledge
    c.dither_rect(0, lg + 3, 30, H - lg - 3, p["stone_dk"], 0.18)
    c.dither_rect(50, rg + 3, W - 50, H - rg - 3, p["stone_dk"], 0.18)
    clothA = _mix(p["stone"], (160, 100, 50), 0.4)
    clothB = _mix(p["stone"], (110, 70, 44), 0.45)
    jx, jy = 40, lg - 30            # the clasp point, over the chasm
    # figure A: planted near the left edge, leaning in, side-on toward the gap (faces right)
    ax = 22
    hero(c, ax, lg, p, h=42, arms="cross", look=1, face="side", hair=(64, 44, 28), cloth=clothA)
    # figure B: stepping across from the right ledge, side-on toward the gap (faces left)
    bx = 58
    hb_x, hb_y = hero(c, bx, rg, p, h=42, arms="cross", look=-1, face="side",
                      hair=(40, 30, 22), cloth=clothB)
    # both arms reach to the SAME joint over the gap
    shA = lg - 30
    capsule(c, [(ax + 6, shA + 2), (ax + 11, shA), (jx - 1, jy)], 2, clothA, OUT)   # A's arm
    capsule(c, [(bx - 6, jy - 2), (bx - 12, jy - 1), (jx + 1, jy)], 2, clothB, OUT) # B's arm
    # the two hands clasp (a clear bright joint)
    c.disc(jx, jy, 3, (244, 206, 160)); c.set(jx - 1, jy - 1, p["bright"])
    c.glow(jx, jy, 7, p["glow"], 0.45)
    E.atmosphere(c, el, jx, jy)
    return c


def major_3():
    """The Mentor (holy) — elder haloed in descending light, hand on a youth's shoulder; charts/tools."""
    el = "holy"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    gy = 100
    # descending shaft of soft gold light from above
    for y in range(0, gy):
        t = y / gy
        half = round(6 + 20 * t)
        c.hline(40 - half, 40 + half, y, p["glow"], a=int(60 * (1 - t * 0.4)))
    c.glow(40, 4, 30, p["bright"], 0.5)
    # the elder (left, taller, robed), one hand toward youth's shoulder, other to horizon
    ex, ey = 28, gy
    e_hx, e_hy = hero(c, ex, ey, p, h=50, arms="reach", look=1,
                      hair=(232, 230, 222), skin=(228, 198, 162),
                      cloth=_mix(p["stone"], (210, 200, 230), 0.5))
    c.rect(ex - 7, ey - 22, 14, 22, _mix(p["stone_lt"], (220, 215, 235), 0.4))   # long robe
    c.line(ex - 7, ey, ex + 6, ey, OUT)
    # a soft halo behind the elder's head
    c.ring(e_hx, e_hy, 12, p["accent"], a=200); c.ring(e_hx, e_hy, 11, p["bright"], a=160)
    # the youth (right, smaller), shoulder under the elder's hand
    yx, yy = 52, gy
    y_hx, y_hy = hero(c, yx, yy, p, h=40, look=-1,
                      hair=(120, 80, 50), cloth=_mix(p["stone"], (180, 160, 120), 0.4))
    c.disc(yx - 5, yy - 26, 2, (228, 198, 162)); c.set(yx - 5, yy - 26, p["bright"])  # elder's hand on shoulder
    # charts + tools at their feet
    frect(c, 60, gy - 4, 9, 4, p["accent"], OUT)            # a rolled chart
    c.line(60, gy - 4, 69, gy - 4, shade(p["accent"], -0.3))
    c.disc(20, gy - 1, 2, p["stone_dk"])                    # a tool
    c.rect(15, gy - 2, 4, 2, p["stone_dk"])
    E.atmosphere(c, el, 40, 30)
    return c


def major_4():
    """The Fellowship (ice) — a ring of figures on a frozen plateau, a small fire of resolve between."""
    el = "ice"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    gy = 104
    # frozen plateau: a flat icy shelf
    c.rect(0, gy, W, H - gy, shade(p["ground"], 0.06))
    c.dither_rect(0, gy, W, 4, p["bright"], 0.3)
    c.hline(0, W, gy, _mix(p["ground"], p["bright"], 0.5))
    # crystalline distance: a few sharp peaks
    for px, ph in ((10, 14), (24, 22), (66, 18)):
        c.line(px, gy - ph, px - 6, gy, shade(p["stone"], 0.1))
        c.line(px, gy - ph, px + 6, gy, shade(p["stone"], -0.1))
        c.line(px - 6, gy, px + 6, gy, shade(p["stone"], -0.2))
    cloths = [_mix(p["stone"], (80, 120, 170), 0.45), _mix(p["stone"], (160, 100, 110), 0.4),
              _mix(p["stone"], (90, 160, 140), 0.4), _mix(p["stone"], (120, 110, 175), 0.4),
              _mix(p["stone"], (180, 150, 100), 0.4)]
    hairs = [(60, 80, 110), (90, 50, 50), (50, 90, 80), (70, 60, 110), (110, 90, 50)]
    # FAR side of the ring: three smaller figures standing BEHIND the fire (drawn first)
    for i, hxp in enumerate((24, 40, 56)):
        hero(c, hxp, gy - 11, p, h=27, look=0, hair=hairs[i], cloth=cloths[i])
    # the small fire of resolve, clearly central, in the open foreground gap
    campfire(c, 40, gy + 2, p)
    c.glow(40, gy - 1, 20, (255, 170, 70), 0.4)
    # NEAR side of the ring: two larger figures flanking the fire (fire-lit inner edges)
    for hxp, ci in ((13, 3), (67, 4)):
        hx, hy = hero(c, hxp, gy + 4, p, h=40, look=(1 if hxp < 40 else -1),
                      hair=hairs[ci], cloth=cloths[ci])
        edge_light(c, hx, hy, gy + 4, (255, 190, 90), side=(1 if hxp < 40 else -1))
    E.atmosphere(c, el, 40, gy - 1)
    return c


def major_5():
    """The Empire (water) — a vast iron fortress-city over a dark sea, one tiny boat dwarfed."""
    el = "water"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    water_y = 88
    # heavy rain sky
    for rx in range(0, W, 5):
        c.line(rx, 0, rx - 4, 18, _mix(p["sky_bot"], p["bright"], 0.3), a=70)
    # the fortress fills the upper frame
    fortress(c, water_y, p)
    # huge wet banners hanging from the wall, each with a pale insignia
    for bxp in (12, 62):
        bw, bh = 7, 24
        frect(c, bxp, water_y - bh, bw, bh, shade(p["accent"], -0.25), shade(p["accent"], -0.5))
        c.rect(bxp, water_y - bh, bw, 2, p["accent"])                 # crossbar
        # tapered wet hem
        c.line(bxp, water_y, bxp + bw - 1, water_y, shade(p["accent"], -0.5))
        c.disc(bxp + bw // 2, water_y + 1, 1, shade(p["accent"], -0.5))
        # insignia diamond
        ix, iy = bxp + bw // 2, water_y - bh + 11
        for d in range(-3, 4):
            c.hline(ix - (3 - abs(d)), ix + (3 - abs(d)), iy + d, _mix(p["accent"], p["bright"], 0.6))
    # the dark sea + fractured reflection
    c.rect(0, water_y, W, H - water_y, shade(p["ground"], -0.1))
    for y in range(water_y, H, 2):
        c.hline(0, W, y, _mix(shade(p["ground"], -0.1), p["glow"], 0.12), a=120)
    # broken reflection of the keep
    for y in range(water_y, water_y + 14, 2):
        c.set(48, y, _mix(p["glow"], p["stone"], 0.4), a=110)
        c.set(44, y + 1, p["glow"], a=80)
    # the single tiny boat, dwarfed, in the foreground
    little_boat(c, 40, H - 12, p)
    # rain over the sea
    for rx in range(2, W, 6):
        c.line(rx, water_y, rx - 3, water_y + 12, _mix(p["sky_bot"], p["bright"], 0.4), a=60)
    E.atmosphere(c, el, 44, water_y - 30)
    return c


def major_6():
    """The Airship (wind) — an airship banking through bright cloud, the world small below."""
    el = "wind"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    # bright scattering clouds (flat puffs)
    cloud = _mix(p["sky_bot"], p["bright"], 0.7)
    cloud2 = p["bright"]
    for cxp, cyp, r in ((14, 22, 9), (60, 14, 10), (24, 40, 7), (68, 44, 8)):
        fe(c, cxp, cyp, r + 2, r, cloud)
        fe(c, cxp - 2, cyp - 1, r - 1, r - 2, cloud2)
    # the world made small below: a faint distant land + horizon arc
    c.rect(0, 98, W, H - 98, _mix(p["ground"], p["stone_lt"], 0.4))
    for hxp, hh in ((12, 5), (30, 7), (52, 4), (68, 6)):
        c.disc(hxp, 100, hh, _mix(p["stone"], p["ground"], 0.5))   # tiny hills far below
    c.dither_rect(0, 96, W, 4, p["bright"], 0.3)
    # the airship banking, mid-frame, catching high light
    airship(c, 42, 58, p, scale=1.0, bank=-0.28)
    # tiny fellowship at the rail (specks looking out)
    for dx in (-3, 0, 3):
        c.set(42 + dx, 60 + round(dx * -0.28), p["stone_dk"])
        c.set(42 + dx, 59 + round(dx * -0.28), (120, 90, 70))
    # wind streaming everything backward
    for k in range(4):
        yy = 30 + k * 12
        c.line(0, yy, 18, yy - 2, p["bright"], a=120)
        c.line(58, yy + 4, W, yy + 1, p["bright"], a=100)
    E.atmosphere(c, el, 42, 50)
    return c


def major_7():
    """The Trial (dark) — a lone figure at the mouth of a black passage, one weak guttering light."""
    el = "dark"; p = E.ELEMENTS[el]
    c = Canvas(); flat_backdrop(c, el)
    gy = 104
    # the black passage: a tall arch of pure dark swallowing the center
    arch = shade(p["ground"], -0.7)
    # rough stone walls framing the mouth
    c.rect(0, 0, 22, gy, shade(p["stone"], -0.3))
    c.rect(W - 22, 0, 22, gy, shade(p["stone"], -0.3))
    c.dither_rect(0, 0, 22, gy, p["stone_dk"], 0.3)
    c.dither_rect(W - 22, 0, 22, gy, p["stone_dk"], 0.3)
    # the arch mouth
    for y in range(0, gy):
        if y < 30:
            half = round(6 + (y / 30) * 16)
        else:
            half = 22
        c.hline(40 - half, 40 + half, y, arch)
    # ragged top of the arch
    c.disc(40, 6, 18, arch)
    # the ground floor
    c.rect(0, gy, W, H - gy, shade(p["ground"], -0.2))
    c.dither_rect(0, gy, W, 4, p["stone_dk"], 0.3)
    # the lone figure at the mouth, weapon drawn, set face — picked out by the weak light
    fx, fy = 40, gy
    hx, hy = hero(c, fx, fy, p, h=44, arms="reach", look=0,
                  hair=(40, 34, 52), cloth=_mix(p["stone"], (70, 56, 90), 0.4),
                  lit=p["glow"])
    # a drawn weapon (sword) raised in the reaching hand
    blade(c, fx + 16, fy - 20, fx + 16, fy - 40, 3, _mix(p["stone_lt"], p["bright"], 0.4), OUT)
    frect(c, fx + 14, fy - 20, 5, 2, p["accent"], OUT)        # crossguard
    # the weak guttering light (a held torch low-left)
    lx, ly = fx - 14, fy - 16
    c.glow(lx, ly, 16, p["glow"], 0.85)
    c.disc(lx, ly, 2, p["bright"]); fe(c, lx, ly - 1, 1, 2, (255, 244, 220))
    c.vline(lx, ly + 1, ly + 6, shade((110, 78, 50), -0.2))   # torch handle
    # the light picks out the figure's lit edge
    edge_light(c, hx, hy, fy, p["glow"], side=-1)
    contact(c, fx, fy, el, w=12)
    E.atmosphere(c, el, lx, ly)
    return c


CARDS = {
    "major-0": major_0,
    "major-1": major_1,
    "major-2": major_2,
    "major-3": major_3,
    "major-4": major_4,
    "major-5": major_5,
    "major-6": major_6,
    "major-7": major_7,
}
