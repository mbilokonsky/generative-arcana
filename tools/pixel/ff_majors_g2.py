"""
Final Fantasy Tarot — MAJOR ARCANA 8–14 (the FF monomyth beats), chibi pixel direction.

Element (station_slug) = palette + light only (flat_backdrop + ELEMENTS colors). The CARD's meaning +
visuals.detailed_description dictate the scene. ONE clear iconic idea per card, flat fills, bold OUT
outlines, big eyes — never soft-gradient 3D. Each fn() returns an 80x120 Canvas:
  flat_backdrop(c, station)  →  bespoke scene  →  E.atmosphere(c, station, fx, fy)  (+ contact where apt)

  major-8  The Summoned Gods  (fire)   — colossus rising behind a tiny summoner, arms flung wide
  major-9  The Deep Lore      (thunder)— a lone scholar over a glowing tablet in a vaulted dark
  major-10 The Magitek        (earth)  — ochre machines, tubes draining glow from caged forms, a gear
  major-11 The Betrayal       (holy)   — two figures, a hand of trust drawn back, merciless flat light
  major-12 The Sacrifice      (ice)    — the fellowship frozen around a fallen companion, one shaft
  major-13 The Fall           (water)  — a vast wave over a sinking land, a tower going under
  major-14 The God-Ascendant  (wind)   — a winged luminous figure rising, humanity blowing to ash
"""
import math
from pixelkit import Canvas, shade
from ff_flatkit import (fe, fblob, frect, eye, cel, capsule, blade, OUT, W, H,
                        flat_backdrop, contact)
import ff_elements as E


# ════════════════════════════════════════════════════════════════════════════════
# reusable chibi helpers (bold outline, flat fill — element lights the world)
# ════════════════════════════════════════════════════════════════════════════════
def chibi_figure(c, cx, feet, h, body, line=OUT, look=0, arms="down", skin=None,
                 head_col=None, robe=False, alpha=255):
    """A small chibi person: round head + capsule body + stub legs. arms: 'down','wide','reach',
    'mourn','none'. Returns (head_cx, head_cy)."""
    skin = skin or shade(body, 0.5)
    head_col = head_col or skin
    hr = max(2, round(h * 0.20))
    head_cy = feet - h + hr
    bw = max(2, round(h * 0.16))
    body_top = head_cy + hr
    body_bot = feet - max(3, round(h * 0.26))
    # legs
    lw = max(1, bw - 1)
    frect(c, cx - bw + 1, body_bot - 1, lw, feet - body_bot, body, line)
    frect(c, cx + bw - lw, body_bot - 1, lw, feet - body_bot, body, line)
    # torso (capsule)
    if robe:
        # a trapezoid robe widening to the feet
        for i, yy in enumerate(range(body_top, feet)):
            t = (yy - body_top) / max(1, feet - body_top)
            ww = round(bw + t * (bw + 1))
            c.hline(cx - ww - 1, cx + ww + 1, yy, line, alpha)
        for i, yy in enumerate(range(body_top, feet)):
            t = (yy - body_top) / max(1, feet - body_top)
            ww = round(bw + t * (bw + 1))
            c.hline(cx - ww, cx + ww, yy, body, alpha)
    else:
        fblob(c, cx, (body_top + body_bot) // 2, bw, (body_bot - body_top) // 2 + 1, body, line)
    # arms
    sh_y = body_top + 2
    al = max(2, round(h * 0.22))
    if arms == "wide":
        capsule(c, [(cx - bw, sh_y), (cx - bw - al, sh_y - al + 1), (cx - bw - al - 2, sh_y - al - 2)],
                max(1, bw // 2), body, line)
        capsule(c, [(cx + bw, sh_y), (cx + bw + al, sh_y - al + 1), (cx + bw + al + 2, sh_y - al - 2)],
                max(1, bw // 2), body, line)
    elif arms == "reach":
        capsule(c, [(cx + bw, sh_y), (cx + bw + al, sh_y - 1), (cx + bw + al + 3, sh_y - 2)],
                max(1, bw // 2), body, line)
        capsule(c, [(cx - bw, sh_y), (cx - bw - 1, sh_y + al // 2)], max(1, bw // 2), body, line)
    elif arms == "mourn":
        capsule(c, [(cx - bw, sh_y), (cx - bw + 1, sh_y + al)], max(1, bw // 2), body, line)
        capsule(c, [(cx + bw, sh_y), (cx + bw - 1, sh_y + al)], max(1, bw // 2), body, line)
    elif arms == "down":
        capsule(c, [(cx - bw, sh_y), (cx - bw - 1, body_bot)], max(1, bw // 2), body, line)
        capsule(c, [(cx + bw, sh_y), (cx + bw + 1, body_bot)], max(1, bw // 2), body, line)
    # head
    fblob(c, cx, head_cy, hr, hr, head_col, line)
    return cx, head_cy


def mini_face(c, cx, cy, r, col, line=OUT):
    """A tiny upturned face (for crowds far below)."""
    fblob(c, cx, cy, r, r, col, line)
    if r >= 2:
        c.set(cx - 1, cy, OUT); c.set(cx + 1, cy, OUT)


# ════════════════════════════════════════════════════════════════════════════════
# major-8 — The Summoned Gods (fire): a colossal fiery being rises behind a tiny summoner
# ════════════════════════════════════════════════════════════════════════════════
def major_8():
    c = Canvas(); st = "fire"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    flame, core, edge = p["glow"], p["bright"], p["accent"]

    # heat-shimmer haze rising across the whole sky
    for k in range(7):
        c.dither_rect(0, 10 + k * 9, W, 3, p["accent"], 0.10)

    # ── THE COLOSSUS: a massive flame-and-muscle being, towering, arms flung wide ──
    gx, gtop, gfeet = 40, 12, 84
    # huge body mass — broad torso of fire dissolving into a wide skirt of flame at the base
    fblob(c, gx, gtop + 40, 15, 18, flame, OUT)            # great chest/torso
    cel(c, gx - 6, gtop + 34, 5, 8, edge)                  # lit flank
    # the lower body widens into a roaring flame-skirt (no legs — it is made of fire)
    for yy in range(gtop + 52, gfeet):
        t = (yy - (gtop + 52)) / max(1, gfeet - (gtop + 52))
        ww = round(13 + t * 8)
        c.hline(gx - ww - 1, gx + ww + 1, yy, OUT)
        c.hline(gx - ww, gx + ww, yy, flame)
    # licking flame-tongues along the lower edge
    for tx in range(gx - 18, gx + 19, 6):
        fblob(c, tx, gfeet - 1, 2, 2, flame, OUT)
        c.set(tx, gfeet - 3, core, 220)
    # broad shoulders + arms flung WIDE and up (a god answering a call)
    capsule(c, [(gx - 11, gtop + 30), (gx - 26, gtop + 20), (gx - 30, gtop + 2)], 5, flame, OUT)
    capsule(c, [(gx + 11, gtop + 30), (gx + 26, gtop + 20), (gx + 30, gtop + 2)], 5, flame, OUT)
    # great clawed hands
    for hx, s in [(gx - 30, -1), (gx + 30, 1)]:
        fblob(c, hx, gtop + 2, 4, 4, flame, OUT)
        for d in (-3, 0, 3):
            c.line(hx + d * 0.6, gtop - 1, hx + d, gtop - 6, edge)
    # the head: a horned, fierce skull of fire, set low between the shoulders
    hx, hy = gx, gtop + 16
    fblob(c, hx, hy, 9, 8, flame, OUT)
    # two great horns sweeping up and back
    capsule(c, [(hx - 6, hy - 6), (hx - 11, hy - 14), (hx - 9, hy - 22)], 2, edge, OUT)
    capsule(c, [(hx + 6, hy - 6), (hx + 11, hy - 14), (hx + 9, hy - 22)], 2, edge, OUT)
    cel(c, hx - 3, hy - 3, 3, 3, core)
    # blazing eyes
    c.disc(hx - 4, hy, 2, core); c.disc(hx + 4, hy, 2, core)
    c.set(hx - 4, hy, OUT); c.set(hx + 4, hy, OUT)
    # licks of flame rising off the colossus's outline
    for (lx, ly) in [(gx - 14, gtop + 28), (gx + 14, gtop + 28), (gx - 20, gtop + 18),
                     (gx + 20, gtop + 18), (gx, gtop + 24)]:
        c.disc(lx, ly, 1, core, 230)
        c.glow(lx, ly, 4, flame, 0.4)

    # ── THE TINY SUMMONER below, arms flung wide, dwarfed yet unafraid ──
    sx, sfeet = 40, 116
    chibi_figure(c, sx, sfeet, 24, p["stone_dk"], OUT, arms="wide",
                 skin=p["stone_lt"], head_col=p["stone_lt"])
    # backlit by the god — a hot rim along the summoner so it reads against the dark floor
    c.hline(sx - 9, sx + 9, sfeet - 1, edge, 160)
    # a thread of trust: a thin bright line running up from the summoner to the god's heart
    for t in range(0, 9):
        yy = sfeet - 16 - t * 4
        c.set(sx, yy, core, 150)
    c.glow(sx, gtop + 44, 9, flame, 0.3)

    contact(c, sx, sfeet, st, w=12)
    E.atmosphere(c, st, gx, gtop + 40)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-9 — The Deep Lore (thunder): a lone figure over a glowing tablet in a vaulted dark
# ════════════════════════════════════════════════════════════════════════════════
def major_9():
    c = Canvas(); st = "thunder"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]

    # a vaulted dark: heavy stone arch framing the scene, deep shadow above
    c.rect(0, 0, W, 70, shade(p["sky_top"], -0.4))
    # the vault arch (two columns + a rounded keystone span)
    frect(c, 4, 30, 8, 78, p["stone_dk"], p["ink"])
    frect(c, 68, 30, 8, 78, p["stone_dk"], p["ink"])
    for x in range(8, 72):
        t = abs(x - 40) / 32
        ay = round(30 - 16 * (1 - t * t))
        c.vline(x, ay, ay + 5, p["stone_dk"])
        c.set(x, ay, p["ink"])
    # faint murals of an older age flickering on the walls
    for (mx, my) in [(16, 56), (16, 70), (62, 58), (62, 72)]:
        c.disc(mx, my, 2, p["stone"], 110)
        c.set(mx, my - 3, p["stone_lt"], 90); c.hline(mx - 2, mx + 2, my + 3, p["stone_lt"], 80)

    # ── THE SINGLE CHARGED SHAFT of light striking down onto the tablet (drawn first) ──
    tx, ty = 40, 90
    c.line(tx, 2, tx - 3, 40, p["bright"], 240)
    c.line(tx - 3, 40, tx, ty - 12, p["bright"], 230)
    c.line(tx + 1, 6, tx - 1, 44, p["accent"], 170)
    c.dither_rect(tx - 6, 6, 12, ty - 16, p["bright"], 0.10)

    # ── THE GLOWING TABLET raised on a plinth, ancient script charged with light ──
    frect(c, tx - 8, ty + 4, 16, 16, p["stone_dk"], p["ink"])     # plinth
    # the tablet face, tilted toward us, blazing — the focal light of the card
    fblob(c, tx, ty, 15, 9, shade(p["glow"], 0.1), OUT)
    fe(c, tx, ty, 13, 7, p["bright"])
    # rows of glowing ancient script
    for r, yy in enumerate((ty - 4, ty, ty + 4)):
        for sx in range(tx - 10, tx + 11, 3):
            c.set(sx, yy, p["accent"], 230)
    c.glow(tx, ty, 18, p["glow"], 0.55)
    # violet shadows crackling at the edges — small forked arcs
    for (bx, by, dx) in [(12, 40, -1), (68, 44, 1), (16, 84, -1), (64, 86, 1)]:
        c.line(bx, by, bx + dx * 3, by + 6, p["accent"], 200)
        c.line(bx + dx * 3, by + 6, bx + dx, by + 12, p["accent"], 180)

    # ── THE LONE SCHOLAR bent over the tablet from the right (robed, hooded, intent) ──
    cx, ffeet = 58, 112
    for yy in range(ty - 4, ffeet):                      # robe trapezoid kneeling beside the light
        t = (yy - (ty - 4)) / max(1, ffeet - (ty - 4))
        ww = round(4 + t * 7)
        c.hline(cx - ww - 1, cx + ww + 1, yy, OUT)
        c.hline(cx - ww, cx + ww, yy, p["stone"])
    # the near edge of the robe catches the tablet glow
    for yy in range(ty + 2, ffeet, 2):
        c.set(cx - 6, yy, shade(p["glow"], -0.05), 150)
    # hooded head bowed low toward the tablet
    fblob(c, cx - 4, ty - 4, 5, 5, p["stone"], OUT)
    fe(c, cx - 5, ty - 3, 3, 3, p["ink"])                # shadowed face inside hood
    c.set(cx - 7, ty - 3, p["glow"], 220)                # a glint of the tablet on the face
    # a reaching hand laid toward the tablet
    capsule(c, [(cx - 6, ty + 2), (cx - 12, ty + 1)], 1, p["stone"], OUT)

    E.atmosphere(c, st, tx, ty - 4)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-10 — The Magitek (earth): ochre machines, tubes draining glow from caged forms, a gear
# ════════════════════════════════════════════════════════════════════════════════
def major_10():
    c = Canvas(); st = "earth"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    machine, mlt, mdk = p["stone"], p["stone_lt"], p["stone_dk"]
    drain = p["accent"]

    # heavy industrial dust in the air
    c.dither_rect(0, 0, W, 90, mdk, 0.10)

    # ── A VAST GEAR turning slowly behind, upper-right ──
    gx, gy, gr = 60, 26, 20
    c.disc(gx, gy, gr, mdk)
    c.ring(gx, gy, gr, p["ink"])
    c.ring(gx, gy, gr - 6, p["ink"])
    c.disc(gx, gy, 4, machine); c.disc(gx, gy, 2, mdk)
    for k in range(12):                                  # gear teeth
        a = k * math.pi / 6
        tx = gx + round(math.cos(a) * (gr + 2)); ty = gy + round(math.sin(a) * (gr + 2))
        c.disc(tx, ty, 2, mdk); c.set(tx, ty, p["ink"])
    # spokes
    for k in range(4):
        a = k * math.pi / 2
        c.line(gx, gy, gx + round(math.cos(a) * (gr - 6)), gy + round(math.sin(a) * (gr - 6)), p["ink"])

    # ── GREAT OCHRE MACHINES: a bank of heavy blocks grinding across the works ──
    frect(c, 0, 70, W, 50, mdk, p["ink"])               # the works floor / base mass
    for (bx, bw, bh) in [(2, 18, 30), (54, 24, 36)]:    # two heavy machine towers
        frect(c, bx, 70 - bh, bw, bh, machine, p["ink"])
        c.hline(bx, bx + bw - 1, 70 - bh, mlt)          # lit top edge
        for ry in range(70 - bh + 4, 68, 7):            # rivet rows
            for rx in range(bx + 3, bx + bw - 2, 5):
                c.set(rx, ry, p["ink"])
    # a grinding piston / smokestack on the left machine
    frect(c, 8, 30, 5, 12, mlt, p["ink"])
    c.disc(10, 28, 3, mdk, 160)                          # puff of exhaust

    # ── CAGED, HALF-LIVING FORMS being drained, center-low ──
    for i, cgx in enumerate((26, 40)):
        cy = 96
        frect(c, cgx - 7, cy - 14, 14, 16, mdk, p["ink"])   # cage box
        for bxx in range(cgx - 6, cgx + 7, 3):          # cage bars
            c.vline(bxx, cy - 13, cy, p["ink"])
        # the dim living form curled inside, faintly glowing (the stolen vitality)
        fblob(c, cgx, cy - 6, 4, 5, shade(drain, -0.2), p["ink"])
        c.disc(cgx, cy - 7, 2, p["bright"], 150)        # its fading inner glow
        c.set(cgx - 1, cy - 6, p["ink"]); c.set(cgx + 1, cy - 6, p["ink"])  # dim eyes

    # ── TUBES drawing the faint glow UP from the cages into the machine ──
    for (cgx, cy) in [(26, 90), (40, 90)]:
        capsule(c, [(cgx, cy), (cgx, cy - 8), (54, 64), (60, 56)], 1, machine, p["ink"])
        # glow-droplets travelling up the tube
        for t, yy in enumerate(range(cy - 2, 56, -5)):
            xx = round(cgx + (60 - cgx) * ((cy - 2 - yy) / max(1, cy - 2 - 56)))
            c.set(xx, yy, p["bright"], 200 - t * 12)
    c.glow(57, 58, 8, drain, 0.35)                       # glow pooling where tubes feed in

    E.atmosphere(c, st, 57, 58)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-11 — The Betrayal (holy): two figures, a hand of trust drawn back, merciless flat light
# ════════════════════════════════════════════════════════════════════════════════
def major_11():
    c = Canvas(); st = "holy"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]

    # merciless even gold light — a flat overcast that hides nothing
    c.rect(0, 0, W, 96, shade(p["sky_bot"], 0.04))
    c.glow(40, 6, 50, p["glow"], 0.45)
    c.dither_rect(0, 30, W, 50, p["bright"], 0.06)

    # long hard fingers of shadow pointing BETWEEN the two figures on the floor
    floor_y = 100
    frect(c, 0, floor_y, W, H - floor_y, p["ground"], None)
    for (sx0) in (36, 40, 44):
        c.line(sx0, floor_y + 1, sx0 + (sx0 - 40) * 2, H - 1, p["ink"], 120)
    # the central rift of shadow dividing them
    c.line(40, 70, 38, floor_y, p["ink"], 90)

    # ── THE BETRAYER (left): dark-robed, turned away, a blade rising in the near hand ──
    bx, bfeet = 24, 100
    chibi_figure(c, bx, bfeet, 30, shade(p["stone_dk"], -0.1), OUT,
                 arms="none", skin=p["stone_dk"], robe=True)
    fblob(c, bx - 1, bfeet - 26, 5, 5, shade(p["stone"], -0.1), OUT)   # head, turned away (faceless)
    c.set(bx - 3, bfeet - 26, p["ink"])                  # a single cold eye, looking back
    # the trust-hand DRAWN BACK / down, refusing the reach
    capsule(c, [(bx + 4, bfeet - 17), (bx + 7, bfeet - 11)], 2, shade(p["stone_dk"], -0.1), OUT)
    # the blade RAISED in the far hand, behind — the blade from a known hand, lifted to strike
    capsule(c, [(bx - 4, bfeet - 18), (bx - 8, bfeet - 22)], 2, shade(p["stone_dk"], -0.1), OUT)
    blade(c, bx - 8, bfeet - 22, bx - 5, bfeet - 36, 4, p["bright"], OUT)
    c.glow(bx - 6, bfeet - 32, 5, p["glow"], 0.3)        # merciless light glinting on the steel

    # ── THE BETRAYED (right): reaching out in trust, recognizing it a half-second late ──
    tx, tfeet = 56, 100
    chibi_figure(c, tx, tfeet, 30, p["stone_lt"], OUT, arms="none", skin=p["bright"], robe=True)
    fblob(c, tx, tfeet - 26, 5, 5, p["bright"], OUT)
    # eyes wide — the dawning recognition
    eye(c, tx - 2, tfeet - 27, 2, look=-1)
    # the trusting hand still extended toward the betrayer
    capsule(c, [(tx - 4, tfeet - 18), (tx - 11, tfeet - 18), (tx - 15, tfeet - 17)],
            2, p["stone_lt"], OUT)
    fblob(c, tx - 15, tfeet - 17, 2, 2, p["bright"], OUT)

    # the gap between the reaching hand and the withdrawn one — the broken trust
    c.glow(40, tfeet - 16, 6, p["glow"], 0.25)

    contact(c, bx, bfeet, st, w=10)
    contact(c, tx, tfeet, st, w=10)
    E.atmosphere(c, st, 40, 14)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-12 — The Sacrifice (ice): the fellowship frozen around a fallen companion
# ════════════════════════════════════════════════════════════════════════════════
def major_12():
    c = Canvas(); st = "ice"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]

    # pale ice floor with a hard glassy sheen
    frect(c, 0, 92, W, H - 92, shade(p["ground"], 0.04), None)
    for y in (98, 106, 114):
        c.hline(0, W, y, p["bright"], 70)
    # the cold holding the moment like glass — faint crack-lines radiating from center
    for (dx, dy) in [(-20, 10), (22, 8), (-14, 16), (16, 18), (0, 20)]:
        c.line(40, 100, 40 + dx, 100 + dy, p["stone_dk"], 90)

    # ── THE SINGLE WAN SHAFT of light falling on the still figure ──
    c.line(40, 0, 30, 100, p["bright"], 130)
    c.line(40, 0, 50, 100, p["bright"], 130)
    c.dither_rect(28, 0, 24, 100, p["bright"], 0.18)
    c.glow(40, 100, 18, p["glow"], 0.5)

    # ── THE FALLEN COMPANION lying on the ice, lit by the shaft, head to the left ──
    fcx, fcy = 42, 103
    # prone body: one clean horizontal silhouette — torso then legs to the right
    fblob(c, fcx, fcy, 13, 3, p["stone_lt"], OUT)        # the laid-out body
    cel(c, fcx - 2, fcy - 1, 6, 1, p["bright"])
    c.hline(fcx + 8, fcx + 13, fcy + 1, p["stone"])      # feet
    fblob(c, fcx - 14, fcy - 1, 3, 3, p["bright"], OUT)  # the still head (left)
    c.hline(fcx - 16, fcx - 13, fcy - 1, OUT)            # closed-eye line — at rest
    # their sword stood up out of the ice at the head, marking the fallen
    blade(c, fcx - 14, fcy - 4, fcx - 14, fcy - 18, 3, p["bright"], OUT)
    c.hline(fcx - 17, fcx - 11, fcy - 14, p["stone_lt"]) # the crossguard

    # ── THE FELLOWSHIP standing frozen around, breath stopped, faces in disbelief/resolve ──
    mourners = [(12, 98, 22, "mourn", -1), (24, 96, 26, "mourn", 1),
                (58, 96, 26, "mourn", -1), (70, 98, 22, "down", 1)]
    cols = [p["stone"], p["stone_dk"], p["stone"], p["stone_dk"]]
    for (mx, mfeet, mh, arms, lk), col in zip(mourners, cols):
        hx, hy = chibi_figure(c, mx, mfeet, mh, col, OUT, arms=arms,
                              skin=shade(p["stone_lt"], 0.05))
        eye(c, hx + lk, hy, 2, look=0, dn=0)             # downcast, looking to the fallen
        # one held, unmoving breath
        c.disc(hx + lk * 3, hy - 4, 1, p["bright"], 110)
        contact(c, mx, mfeet, st, w=8)

    # the moment frozen — a drifting glaze of frost over everything
    c.dither_rect(0, 70, W, 50, p["bright"], 0.07)
    E.atmosphere(c, st, fcx, fcy)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-13 — The Fall (water): a vast wave over a sinking land, a tower going under
# ════════════════════════════════════════════════════════════════════════════════
def major_13():
    c = Canvas(); st = "water"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    deep, mid, foam = shade(p["ground"], -0.1), p["glow"], p["bright"]

    # ── THE VAST WAVE rising and curling over from the right, filling the upper sky ──
    # the towering body of the wave (a dark teal mass)
    for x in range(0, W):
        # crest height: high on the right, curling down-left
        crest = 10 + max(0, (x - 8)) * 0.55
        crest = min(crest, 64)
        c.vline(x, round(crest), 80, shade(p["sky_bot"], -0.18))
    # the great curling lip of the wave (a bright arc of foam scrolling over)
    lip = [(72, 12), (60, 8), (48, 8), (38, 12), (30, 20), (26, 30), (28, 40), (36, 46)]
    for i in range(len(lip) - 1):
        c.line(lip[i][0], lip[i][1], lip[i + 1][0], lip[i + 1][1], foam, 230)
        c.line(lip[i][0], lip[i][1] + 1, lip[i + 1][0], lip[i + 1][1] + 1, mid, 200)
    # the hollow barrel of the wave, shadowed inside
    fblob(c, 46, 30, 12, 12, shade(p["sky_bot"], -0.28), None)
    # foam spray flicking off the crest
    for (sx, sy) in [(68, 8), (58, 5), (50, 5), (42, 8), (34, 14), (72, 16)]:
        c.disc(sx, sy, 1, foam, 220)
        c.set(sx - 1, sy - 1, foam, 150)
    # streaks of foam running down the wave face
    for fxx in (54, 62, 68, 74):
        c.line(fxx, 18, fxx - 3, 60, foam, 110)

    # ── THE SINKING LAND + A TOWER GOING UNDER, small against the dark water ──
    water_y = 86
    frect(c, 0, water_y, W, H - water_y, deep, None)     # the risen sea below
    c.dither_rect(0, water_y, W, H - water_y, mid, 0.16)  # surface glints
    # the tower, tilting, only its top still above the rising water
    twx = 16
    frect(c, twx - 4, 66, 8, 24, p["stone_dk"], p["ink"])  # tower shaft (lower part submerged)
    frect(c, twx - 5, 62, 10, 5, p["stone"], p["ink"])     # battlement top
    for cren in (twx - 4, twx, twx + 3):
        frect(c, cren, 59, 2, 3, p["stone"], p["ink"])
    c.set(twx, 70, p["glow"], 180)                          # one last lit window going under
    # the waterline cutting across the tower — it is being taken
    c.hline(twx - 6, twx + 6, water_y, foam, 160)
    fe(c, twx, water_y + 3, 9, 3, foam, 120)               # churn around the drowning tower

    # tiny figures small against the dark water, being swept
    for (hx, hy) in [(30, 90), (40, 94), (50, 91)]:
        mini_face(c, hx, hy, 2, p["stone_lt"])
        c.disc(hx, hy + 3, 1, p["stone"], 180)

    E.atmosphere(c, st, 46, 30)
    return c


# ════════════════════════════════════════════════════════════════════════════════
# major-14 — The God-Ascendant (wind): a winged luminous figure rising, humanity blowing to ash
# ════════════════════════════════════════════════════════════════════════════════
def major_14():
    c = Canvas(); st = "wind"; flat_backdrop(c, st)
    p = E.ELEMENTS[st]
    lum, glow, edge = p["bright"], p["glow"], p["accent"]

    # everything streams upward and outward — high thin cold scattering sky
    for k in range(8):
        y = 8 + k * 9
        c.dither_rect(0, y, W, 2, p["stone_lt"], 0.4)
    # upward streaks converging on the rising figure
    for (x0) in (8, 22, 40, 58, 72):
        c.line(x0, 112, 40 + (x0 - 40) // 4, 24, p["stone_lt"], 90)

    # ── THE WINGED, LUMINOUS FIGURE rising, high in the frame ──
    fx, fy = 40, 40          # head height
    # great wings spread wide and swept up (luminous, feather-edged)
    for s in (-1, 1):
        wing = [(fx + s * 6, fy + 8), (fx + s * 20, fy - 2), (fx + s * 30, fy - 14),
                (fx + s * 28, fy + 4), (fx + s * 22, fy + 12), (fx + s * 12, fy + 16)]
        # outline
        for i in range(len(wing) - 1):
            c.line(wing[i][0], wing[i][1], wing[i + 1][0], wing[i + 1][1], OUT)
        # fill — bright luminous feathers
        fe(c, fx + s * 18, fy, 11, 9, lum, 255)
        fe(c, fx + s * 15, fy - 2, 6, 5, (255, 255, 255), 200)   # white-hot inner glow
        # feather divisions
        for d in range(4):
            c.line(fx + s * 8, fy + 6, fx + s * (16 + d * 4), fy - 8 + d * 4, p["accent"], 150)
        c.glow(fx + s * 18, fy, 10, glow, 0.4)
    # the luminous body — a radiant standing figure, arms slightly raised
    bx = fx
    capsule(c, [(bx, fy + 6), (bx, fy + 26)], 4, lum, OUT)
    capsule(c, [(bx - 3, fy + 10), (bx - 8, fy + 4), (bx - 9, fy - 2)], 2, lum, OUT)
    capsule(c, [(bx + 3, fy + 10), (bx + 8, fy + 4), (bx + 9, fy - 2)], 2, lum, OUT)
    # head — featureless, haloed, no longer quite human
    fblob(c, fx, fy, 5, 5, lum, OUT)
    c.glow(fx, fy, 16, glow, 0.6)
    c.glow(fx, fy + 16, 12, glow, 0.35)
    # the last of their humanity blowing away like ash to the upper-right
    for (ax, ay) in [(50, 34), (56, 28), (62, 24), (54, 40), (60, 36), (66, 30),
                     (48, 24), (58, 20), (64, 18)]:
        c.disc(ax, ay, 1, p["stone_dk"], 170)
        c.set(ax + 1, ay - 1, p["stone_lt"], 120)

    # ── TINY UPTURNED FACES far below, those they left behind ──
    ground_y = 110
    frect(c, 0, ground_y, W, H - ground_y, p["ground"], None)
    for (hx) in (10, 20, 30, 40, 50, 60, 70):
        jitter = (hx % 7) - 3
        mini_face(c, hx, ground_y - 1 + jitter % 2, 1, p["stone_lt"])
    # a couple slightly larger nearer faces, looking up
    for (hx, hy) in [(24, 108), (52, 109)]:
        fblob(c, hx, hy, 2, 2, p["stone_lt"], OUT)
        c.set(hx, hy - 1, glow, 150)

    E.atmosphere(c, st, fx, fy)
    return c


CARDS = {
    "major-8": major_8,
    "major-9": major_9,
    "major-10": major_10,
    "major-11": major_11,
    "major-12": major_12,
    "major-13": major_13,
    "major-14": major_14,
}
