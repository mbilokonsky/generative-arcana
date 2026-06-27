"""
Final Fantasy chibi pixel pack — the CACTUAR suit (Bane·Place).

Cactuar = territory, boundary, the guarded ground, spines, the sudden needle. The whole charm is
VARIED right-angle poses: limbs always emerge perpendicular from the body and shoot straight out to
the sides, bending at 90 degrees, NEVER crossing the body. The element (station_slug) lights the
WORLD; the RANK dictates the composition.

Exports CARDS = {slug: fn} for cactuar-0 … cactuar-13.
"""
from pixelkit import Canvas, shade
from ff_flatkit import (fe, fblob, frect, eye, cel, capsule, blade, OUT,
                        flat_backdrop, contact, W, H)
from ff_creatures import CACTUAR as P
import ff_elements as E
import math


# ── building blocks ───────────────────────────────────────────────────────────

def needle(c, x0, y0, x1, y1, col=None):
    """A thrown spine: a thin pale dart with a dark tip."""
    col = col or P["spine"]
    c.line(x0, y0, x1, y1, col)
    c.set(x1, y1, P["dark"])


def head_spikes(c, cx, top, n=3, h=5, col=None):
    """The cactuar's head-top spikes, fanning up."""
    col = col or P["dark"]
    if n == 1:
        c.line(cx, top, cx, top - h, col)
        return
    for i, dx in enumerate(range(-(n // 2), n // 2 + 1)):
        c.line(cx + dx * 3, top, cx + dx * 3, top - h, col)


def cactuar_pose(c, cx, by, arms, legs, scale=1.0, face_look=0, bloom=False,
                 frost=False, spikes=3, body_col=None, lean=0):
    """
    A full cactuar built from primitives so the pose can VARY per card.
      arms  : list of polyline tails (each a list of (dx,dy) offsets from the body edge).
      legs  : list of polyline tails likewise (from the lower body).
      lean  : horizontal offset of the head/upper body vs. the feet (a tilt into a wind, etc).
    Every limb starts perpendicular (a horizontal stub) then bends — never crossing the body.
    Returns (cx, eye_y).
    """
    bc = body_col or P["body"]
    rx, ry = round(7 * scale), round(14 * scale)
    r = max(2, round(2 * scale))
    hcx = cx + lean                       # head/upper-body center (leans off the feet line)
    # limbs first, so the body draws over the roots (arms hang off the leaned upper body)
    for tail in arms:
        capsule(c, [(hcx + dx, by + dy) for (dx, dy) in tail], r, bc, OUT)
    for tail in legs:
        capsule(c, [(cx + dx, by + dy) for (dx, dy) in tail], r, bc, OUT)
    if lean:                              # a slanted trunk connecting feet to leaned head
        capsule(c, [(cx, by + ry - 2), (hcx, by)], max(2, rx - 2), bc, OUT)
    # body
    fblob(c, hcx, by, rx, ry, bc, OUT)
    cel(c, hcx - round(3 * scale), by - round(6 * scale), max(1, round(2 * scale)), round(4 * scale),
        P["light"] if not frost else (236, 248, 252))
    # head-top spikes
    head_spikes(c, hcx, by - ry + 1, n=spikes, h=round(5 * scale))
    # face: dot eyes + O mouth
    ey = by - round(4 * scale)
    cx = hcx
    c.disc(cx - 3, ey, 1, P["face"]); c.disc(cx + 3, ey, 1, P["face"])
    if face_look:
        c.set(cx - 3 + face_look, ey, P["face"]); c.set(cx + 3 + face_look, ey, P["face"])
    c.ring(cx, by + round(2 * scale), 2, P["face"])
    # body spines
    for (sx, sy) in ((-5, -8), (5, -2), (-5, 6), (4, 11)):
        c.set(cx + round(sx * scale), by + round(sy * scale), P["spine"])
    if frost:
        for (sx, sy) in ((-6, -4), (6, 2), (-4, 9), (3, -10)):
            c.set(cx + round(sx * scale), by + round(sy * scale), (236, 248, 255))
    if bloom:
        c.disc(cx, by - ry - 4, 2, P["spine"])
        for a in range(6):
            ang = a / 6 * 2 * math.pi
            c.set(cx + round(3 * math.cos(ang)), by - ry - 4 + round(3 * math.sin(ang)), (255, 210, 120))
        c.disc(cx, by - ry - 4, 1, (255, 232, 150))
    return cx, ey


def mini_cactuar(c, cx, by, arms, legs, scale=1.0, body_col=None, spikes=2):
    """A simplified mini-cactuar: small green body + a couple of right-angle stub limbs + O mouth."""
    bc = body_col or P["body"]
    rx, ry = round(4 * scale), round(8 * scale)
    r = max(1, round(2 * scale) - 1)
    for tail in arms:
        capsule(c, [(cx + dx, by + dy) for (dx, dy) in tail], r, bc, OUT)
    for tail in legs:
        capsule(c, [(cx + dx, by + dy) for (dx, dy) in tail], r, bc, OUT)
    fblob(c, cx, by, rx, ry, bc, OUT)
    head_spikes(c, cx, by - ry + 1, n=spikes, h=3)
    ey = by - round(2 * scale)
    c.set(cx - 2, ey, P["face"]); c.set(cx + 2, ey, P["face"])
    c.ring(cx, by + round(2 * scale), 1, P["face"])
    c.set(cx - 2, by - 4, P["spine"]); c.set(cx + 2, by + 2, P["spine"])
    return cx, ey


def boundary_stone(c, x, y, st, w=5, h=6):
    p = E.ELEMENTS[st]
    frect(c, x - w // 2, y - h, w, h, p["stone"], OUT)
    c.hline(x - w // 2, x + w // 2, y - h, p["stone_lt"])


def seam(c, x0, x1, y, st):
    """A scored boundary line in the ground."""
    p = E.ELEMENTS[st]
    for x in range(x0, x1, 3):
        c.set(x, y, p["stone_dk"])
        c.set(x + 1, y, shade(p["ground"], -0.2))


# Pose tail vocabulary (offsets from body edge). Right-angle: a horizontal stub then a bend.
ARM_UP_R   = [(6, -5), (13, -5), (13, -12)]
ARM_UP_L   = [(-6, -5), (-13, -5), (-13, -12)]
ARM_OUT_R  = [(6, -3), (15, -3)]
ARM_OUT_L  = [(-6, -3), (-15, -3)]
ARM_DOWN_R = [(6, -1), (13, -1), (13, 6)]
ARM_DOWN_L = [(-6, -1), (-13, -1), (-13, 6)]
LEG_STAND_R = [(4, 12), (9, 12), (9, 21)]
LEG_STAND_L = [(-4, 12), (-9, 12), (-9, 21)]
LEG_SPLAY_R = [(4, 12), (11, 12), (13, 21)]
LEG_SPLAY_L = [(-4, 12), (-11, 12), (-13, 21)]
LEG_DASH_R  = [(4, 12), (12, 12), (16, 18)]   # trailing
LEG_DASH_L  = [(-4, 12), (-9, 12), (-9, 21)]   # planted


# ── the 14 cards ───────────────────────────────────────────────────────────────

def cactuar_0():
    """Ace · wind — one cactuar + a first needle/sprout, a single line claimed on open air."""
    st = "wind"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 100
    by = feet - 20
    # disturbed ring of sand drifting at its feet
    c.ring(cx, feet + 1, 11, shade(p["ground"], -0.18))
    c.ring(cx, feet + 1, 7, shade(p["ground"], -0.1))
    # drifting seed-spores streaming sideways
    for (sx, sy) in ((10, 40), (62, 30), (18, 64), (66, 70), (50, 22)):
        c.set(sx, sy, p["stone_lt"]); c.set(sx + 2, sy, p["bright"])
    cactuar_pose(c, cx, by, [ARM_UP_R, ARM_OUT_L], [LEG_STAND_R, LEG_STAND_L])
    # the first needle — a single planted spine standing in the sand beside it
    c.vline(cx + 16, feet - 9, feet, P["spine"]); c.set(cx + 16, feet - 9, P["dark"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_1():
    """Two · dark — a pair facing off across a seam in near-total black."""
    st = "dark"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    feet = 100
    # the thin scored dividing seam in the ground between them (short, in the dirt only)
    for y in range(feet - 1, feet + 5, 2):
        c.set(40, y, p["stone_lt"]); c.set(40, y + 1, p["stone_dk"])
    # left guardian: braced wide, both arms thrust toward the seam (right); faces right
    cactuar_pose(c, 22, feet - 20,
                 [ARM_OUT_R, [(6, 4), (12, 4), (16, 4)]], [LEG_SPLAY_R, LEG_STAND_L], face_look=1)
    # right guardian: held back, arm up wary + arm out toward center; faces left
    cactuar_pose(c, 58, feet - 20, [ARM_OUT_L, ARM_UP_R], [LEG_STAND_R, LEG_SPLAY_R],
                 face_look=-1)
    E.atmosphere(c, st, 40, feet - 24); contact(c, 22, feet, st); contact(c, 58, feet, st)
    return c


def cactuar_2():
    """Three · fire — sentinel + three blooms in a guarded forge-bright patch."""
    st = "fire"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 100
    by = feet - 20
    # the defended patch glowing like a forge floor
    fe(c, cx, feet + 2, 20, 4, shade(p["glow"], -0.1), a=150)
    cactuar_pose(c, cx, by, [ARM_UP_R, ARM_UP_L], [LEG_STAND_R, LEG_STAND_L])
    # three bright blossoms low against its base
    for (bx, col) in ((cx - 14, p["accent"]), (cx, p["bright"]), (cx + 14, p["accent"])):
        c.vline(bx, feet - 5, feet, P["dark"])
        c.disc(bx, feet - 7, 2, col); c.disc(bx, feet - 7, 1, p["bright"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_3():
    """Four · thunder — four cactuars at the corners of a squared plot, a planted fortress."""
    st = "thunder"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    # the squared perimeter — a bold ranged fence of stakes between the corners
    fx0, fx1, fy0, fy1 = 14, 66, 62, 106
    for x in range(fx0, fx1 + 1, 4):
        c.vline(x, fy0 - 2, fy0, p["stone_dk"]); c.vline(x, fy1, fy1 + 2, p["stone_dk"])
    c.hline(fx0, fx1, fy0, p["stone"]); c.hline(fx0, fx1, fy1, p["stone"])
    for y in range(fy0, fy1 + 1, 4):
        c.vline(fx0 - 2, y, y, p["stone_dk"]); c.set(fx0, y, p["stone"])
        c.set(fx1, y, p["stone"]); c.vline(fx1 + 2, y, y, p["stone_dk"])
    boundary_stone(c, 40, fy0 + 1, st, w=7, h=6)
    # four small guardians at the cardinal corners, planted firm
    minis = [(fx0 + 3, fy0 + 8), (fx1 - 3, fy0 + 8), (fx0 + 3, fy1 - 1), (fx1 - 3, fy1 - 1)]
    for (mx, my) in minis:
        mini_cactuar(c, mx, my - 9, [[(4, -3), (9, -3), (9, -8)]],
                     [[(3, 9), (6, 9), (6, 14)], [(-3, 9), (-6, 9), (-6, 14)]], scale=0.95)
    E.atmosphere(c, st, 40, 70);
    for (mx, my) in minis:
        contact(c, mx, my, st, w=8)
    return c


def cactuar_4():
    """Five · earth — a lone cactuar braced on a shrinking patch as boulders press in."""
    st = "earth"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 102
    by = feet - 20
    # heavy boulders / dunes pressing in from both sides + buried stones
    fblob(c, 8, feet - 4, 12, 9, p["stone"], OUT); cel(c, 4, feet - 9, 3, 2, p["stone_lt"])
    fblob(c, 72, feet - 2, 13, 10, p["stone_dk"], OUT); cel(c, 68, feet - 7, 3, 2, p["stone"])
    fblob(c, 64, feet + 4, 9, 6, p["stone"], OUT)
    # cracked ground line
    for x in range(20, 60, 4):
        c.set(x, feet + 4, shade(p["ground"], -0.25))
    # braced stance — arms down digging in, legs splayed wide
    cactuar_pose(c, cx, by, [ARM_DOWN_R, ARM_DOWN_L], [LEG_SPLAY_R, LEG_SPLAY_L])
    # dust banked against the base
    fe(c, cx - 9, feet, 5, 2, p["stone_lt"], a=160); fe(c, cx + 9, feet, 5, 2, p["stone_lt"], a=160)
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_5():
    """Six · holy — a wary exchange across an oasis boundary, radiant grace."""
    st = "holy"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    feet = 102
    # the small clear oasis pool between them
    fblob(c, 50, feet + 2, 16, 5, p["accent"], OUT)
    fe(c, 50, feet + 1, 12, 3, p["bright"])
    c.glow(50, feet, 14, p["glow"], 0.4)
    # the guardian, one arm lowered granting passage (left arm out, low)
    cx = 26; by = feet - 20
    cactuar_pose(c, cx, by, [ARM_OUT_R, ARM_DOWN_L], [LEG_STAND_R, LEG_STAND_L])
    # a faint approaching mini-cactuar with a lowered arm (open hands), respectfully halted
    fx = 66
    mini_cactuar(c, fx, feet - 12, [[(-4, -2), (-9, -2), (-9, 2)]],
                 [[(3, 7), (6, 7), (6, 12)], [(-3, 7), (-6, 7), (-6, 12)]], scale=0.85)
    E.atmosphere(c, st, 50, feet - 6); contact(c, cx, feet, st)
    return c


def cactuar_6():
    """Seven · ice — a lone sentinel frozen at its threshold-stone, the unvisited watch."""
    st = "ice"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 100
    by = feet - 20
    boundary_stone(c, cx + 17, feet, st, w=6, h=9)      # the frost-rimed boundary-stone
    c.hline(cx + 14, cx + 20, feet - 9, p["bright"])
    # frost glitter scattered in the empty cold
    for (sx, sy) in ((12, 36), (66, 28), (20, 70), (60, 64), (40, 22)):
        c.set(sx, sy, p["bright"])
    # huddled lonely watch: both arms held low and close, a stark single silhouette
    cactuar_pose(c, cx, by, [ARM_DOWN_R, ARM_DOWN_L], [LEG_STAND_R, LEG_STAND_L],
                 frost=True, spikes=1)
    # breath — the only motion
    c.set(cx - 9, by - 6, p["bright"]); c.set(cx - 11, by - 7, p["bright"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_7():
    """Eight · water — a darting dash, 1000 needles, motion at the waterline."""
    st = "water"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 38, 98
    by = feet - 20
    # the shallow tidal flat / waterline
    fe(c, 40, feet + 4, 40, 4, p["accent"], a=170)
    for x in range(4, 76, 5):
        c.set(x, feet + 2, p["bright"])
    # motion: trailing dash-lines behind
    for dy in (-12, -6, 2, 8):
        c.hline(cx - 24, cx - 12, by + dy, p["glow"], a=150)
    # darting pose — arm thrown forward, legs in a dash
    cactuar_pose(c, cx, by, [ARM_OUT_R, ARM_UP_L], [LEG_DASH_R, LEG_DASH_L])
    # 1000 needles flying forward from the lead arm
    for (nx, ny) in ((cx + 18, by - 6), (cx + 22, by - 2), (cx + 20, by + 3)):
        needle(c, nx - 6, ny, nx, ny, p["bright"])
    # reflection doubling on the wet sand
    fe(c, cx, feet + 6, 6, 3, shade(p["accent"], 0.1), a=120)
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_8():
    """Nine · wind — a worn, heavily-spined cactuar leaning into a hard sidewind at the threshold."""
    st = "wind"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 44, 100
    by = feet - 19
    # scouring particulate streaming one way
    for (sx, sy, ln) in ((8, 34, 10), (54, 26, 12), (16, 60, 8), (40, 70, 14), (24, 46, 10)):
        c.hline(sx, sx + ln, sy, p["stone_lt"], a=160); c.set(sx + ln, sy, p["bright"])
    # leaning stance: whole body tilted into the wind; arms streaming downwind (to the left)
    arms = [ARM_OUT_L, [(-6, 2), (-13, 4), (-18, 4)]]
    cactuar_pose(c, cx, by, arms, [LEG_SPLAY_R, [(-4, 12), (-10, 14), (-12, 21)]], lean=-7)
    # extra streaming spines blown off to the left
    for (nx, ny) in ((cx - 18, by - 8), (cx - 22, by - 2), (cx - 20, by + 5)):
        needle(c, nx + 7, ny, nx, ny, P["spine"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_9():
    """Ten · dark — a tall worn guardian over a glowing cluster of new sprouts, the watch handed on."""
    st = "dark"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 96
    by = feet - 22
    # old guardian receding into void above, arms spread wide releasing the ground to the next
    cactuar_pose(c, cx, by, [ARM_OUT_R, ARM_OUT_L], [LEG_STAND_R, LEG_STAND_L], scale=1.1)
    # a cluster of tiny new sprouts catching the single weak light at its base
    c.glow(cx, feet + 3, 18, p["glow"], 0.7)
    c.glow(cx, feet + 3, 10, p["bright"], 0.4)
    for (mx, off) in ((cx - 12, 1), (cx, 3), (cx + 12, 1), (cx - 6, -1), (cx + 7, -1)):
        sy = feet + off
        c.vline(mx, sy - 6, sy, P["light"])
        c.set(mx, sy - 7, P["spine"])
        c.line(mx, sy - 4, mx - 2, sy - 5, P["light"]); c.line(mx, sy - 5, mx + 2, sy - 6, P["light"])
        c.set(mx - 2, sy - 5, P["dark"]); c.set(mx + 2, sy - 6, P["dark"])
    E.atmosphere(c, st, cx, feet + 2); contact(c, cx, feet, st)
    return c


def cactuar_10():
    """Freelancer · fire — a small plain young sprout cactuar, all raw spark, bristling everywhere."""
    st = "fire"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 100
    by = feet - 18
    # embers swirling around it
    for (sx, sy) in ((16, 48), (62, 40), (22, 66), (58, 60)):
        c.set(sx, sy, p["glow"]); c.set(sx + 1, sy - 1, p["accent"])
    # young, slightly crooked, both arms thrown out wide — undecided where the threat is
    cactuar_pose(c, cx, by, [ARM_OUT_R, ARM_OUT_L], [LEG_SPLAY_R, LEG_STAND_L], scale=0.9)
    # fresh spines bristling in every direction
    for (ex, ey) in ((-12, -10), (12, -10), (-16, -2), (16, -2), (-10, 8), (10, 8), (0, -18)):
        needle(c, cx + ex // 2, by + ey // 2, cx + ex, by + ey, p["accent"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_11():
    """Knight · thunder — a cactuar mid-dash striking, one arm flung up, lightning behind."""
    st = "thunder"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 38, 100
    by = feet - 20
    # a hard white flash / bolt splitting the sky behind
    c.line(56, 8, 50, 30, p["bright"]); c.line(50, 30, 58, 46, p["bright"])
    c.glow(54, 30, 12, p["glow"], 0.4)
    # decisive strike pose: lead arm flung up, trailing arm out, mid-stride dash
    cactuar_pose(c, cx, by, [ARM_UP_R, ARM_OUT_L], [LEG_DASH_R, LEG_DASH_L])
    # the committed strike — needles loosed from the raised arm
    for (nx, ny) in ((cx + 14, by - 14), (cx + 17, by - 11), (cx + 12, by - 17)):
        needle(c, nx - 5, ny + 3, nx, ny, p["bright"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st)
    return c


def cactuar_12():
    """Sage · earth — a still, rooted, centered ancient cactuar merged with canyon stone."""
    st = "earth"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 104
    by = feet - 24
    # canyon walls of warm ochre stone flanking it, heavy grounded mass
    fblob(c, 7, 70, 12, 28, p["stone"], OUT); cel(c, 4, 52, 3, 6, p["stone_lt"])
    fblob(c, 73, 74, 12, 26, p["stone_dk"], OUT); cel(c, 70, 58, 3, 5, p["stone"])
    # base merged with the settled earth (roots) — a wide mound the body sinks into
    fblob(c, cx, feet + 1, 18, 6, shade(p["ground"], -0.1), shade(p["ground"], -0.25))
    for rx2 in (-12, -7, 7, 12):                  # root fingers spreading into the ground
        c.line(cx + rx2 // 2, feet - 1, cx + rx2, feet + 4, shade(P["dark"], -0.1))
    # still, symmetric, rooted — short stub arms low, legs planted wide, no flared threat
    cactuar_pose(c, cx, by, [[(6, 4), (12, 4)], [(-6, 4), (-12, 4)]],
                 [LEG_SPLAY_R, LEG_SPLAY_L], scale=1.15, spikes=3)
    # weathered cracks on the body suggesting age/stone
    c.line(cx - 2, by - 4, cx - 2, by + 6, shade(P["dark"], -0.1))
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st, w=16)
    return c


def cactuar_13():
    """Warrior of Light · holy — a grand radiant crowned cactuar sheltering an oasis."""
    st = "holy"; c = Canvas(); flat_backdrop(c, st); p = E.ELEMENTS[st]
    cx, feet = 40, 100
    by = feet - 22
    # streaming light from above
    c.glow(cx, 6, 60, p["glow"], 0.5)
    # the flourishing guarded oasis green + small sheltered figures behind
    fe(c, cx, feet + 4, 26, 5, shade(p["accent"], -0.1))
    for (gx) in (24, 40, 56):
        c.vline(gx, feet - 2, feet + 2, P["dark"]); c.disc(gx, feet - 3, 2, P["body"])
    for (sx) in (30, 50):
        fblob(c, sx, feet - 5, 2, 4, shade(p["bright"], -0.1), OUT)
    # grand cactuar, arms spread wide like rays, crowned with a bloom
    cactuar_pose(c, cx, by, [ARM_OUT_R, ARM_OUT_L], [LEG_STAND_R, LEG_STAND_L],
                 scale=1.15, bloom=True, spikes=5)
    # radiant rays from the spread arms
    for (ex, ey) in ((-22, -6), (22, -6), (-18, 2), (18, 2)):
        c.line(cx + ex // 2, by + ey, cx + ex, by + ey - 3, p["bright"])
    E.atmosphere(c, st, cx, by); contact(c, cx, feet, st, w=16)
    return c


CARDS = {
    "cactuar-0": cactuar_0, "cactuar-1": cactuar_1, "cactuar-2": cactuar_2,
    "cactuar-3": cactuar_3, "cactuar-4": cactuar_4, "cactuar-5": cactuar_5,
    "cactuar-6": cactuar_6, "cactuar-7": cactuar_7, "cactuar-8": cactuar_8,
    "cactuar-9": cactuar_9, "cactuar-10": cactuar_10, "cactuar-11": cactuar_11,
    "cactuar-12": cactuar_12, "cactuar-13": cactuar_13,
}
