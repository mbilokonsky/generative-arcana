"""
lumenkit — a small luminous-abstract compositor (Pillow), for the Evolution & Consciousness deck.

The opposite of the pixel kit: smooth, anti-aliased, light-based. Work at high internal resolution
(supersampled) and downscale once with LANCZOS so edges are clean and glows are soft. The vocabulary is
deliberately spare — deep grounds, radial glows, crisp geometric forms emerging AS LIGHT, faint grain,
a vignette. Author in logical 200x300 coords; everything scales by SS internally; save() outputs 400x600.
"""
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import math

W, H = 200, 300          # logical card (2:3)
SS = 4                   # supersample factor
WW, HH = W * SS, H * SS


def _s(v):
    return int(round(v * SS))


def _lerp(a, b, f):
    return (round(a[0] + (b[0] - a[0]) * f), round(a[1] + (b[1] - a[1]) * f), round(a[2] + (b[2] - a[2]) * f))


class Lumen:
    def __init__(self, bg=(0, 0, 0)):
        self.img = Image.new("RGB", (WW, HH), bg)
        self.d = ImageDraw.Draw(self.img)

    # ── grounds ──────────────────────────────────────────────────────────────
    def fill(self, color):
        self.d.rectangle([0, 0, WW, HH], fill=color)

    def vgrad(self, top, bot, y0=0, y1=H):
        a, b = _s(y0), _s(y1)
        for y in range(a, b):
            self.d.line([(0, y), (WW, y)], fill=_lerp(top, bot, (y - a) / max(1, b - a)))

    def rgrad(self, cx, cy, r, inner, outer):
        """radial ground: inner color at center fading to outer at radius r."""
        base = Image.new("RGB", (WW, HH), outer)
        lay = Image.new("RGB", (WW, HH), inner)
        mask = Image.new("L", (WW, HH), 0)
        ImageDraw.Draw(mask).ellipse([_s(cx - r), _s(cy - r), _s(cx + r), _s(cy + r)], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(_s(r) * 0.5))
        self.img = Image.composite(lay, base, mask)
        self.d = ImageDraw.Draw(self.img)

    # ── forms (crisp; author in logical coords) ──────────────────────────────
    def disc(self, x, y, r, color):
        self.d.ellipse([_s(x - r), _s(y - r), _s(x + r), _s(y + r)], fill=color)

    def ring(self, x, y, r, color, width=2):
        self.d.ellipse([_s(x - r), _s(y - r), _s(x + r), _s(y + r)], outline=color, width=max(1, _s(width)))

    def line(self, x0, y0, x1, y1, color, width=2):
        self.d.line([_s(x0), _s(y0), _s(x1), _s(y1)], fill=color, width=max(1, _s(width)))

    def rect(self, x, y, w, h, color, width=0):
        box = [_s(x), _s(y), _s(x + w), _s(y + h)]
        if width:
            self.d.rectangle(box, outline=color, width=max(1, _s(width)))
        else:
            self.d.rectangle(box, fill=color)

    def poly(self, pts, color):
        self.d.polygon([(_s(px), _s(py)) for px, py in pts], fill=color)

    # ── light ────────────────────────────────────────────────────────────────
    def glow(self, x, y, r, color, strength=0.8):
        """a soft radial light, screened onto the scene — the core 'form as light' move."""
        g = Image.new("RGB", (WW, HH), (0, 0, 0))
        ImageDraw.Draw(g).ellipse([_s(x - r), _s(y - r), _s(x + r), _s(y + r)], fill=color)
        g = g.filter(ImageFilter.GaussianBlur(_s(r) * 0.55))
        if strength < 1:
            g = ImageChops.multiply(g, Image.new("RGB", (WW, HH), tuple([int(255 * strength)] * 3)))
        self.img = ImageChops.screen(self.img, g)
        self.d = ImageDraw.Draw(self.img)

    def bloom(self, amount=0.5, radius=6):
        """lift the whole image's bright areas into a soft halation."""
        b = self.img.filter(ImageFilter.GaussianBlur(_s(radius)))
        b = ImageChops.multiply(b, Image.new("RGB", (WW, HH), tuple([int(255 * amount)] * 3)))
        self.img = ImageChops.screen(self.img, b)
        self.d = ImageDraw.Draw(self.img)

    def vignette(self, strength=0.5, color=(0, 0, 0)):
        mask = Image.new("L", (WW, HH), 0)
        md = ImageDraw.Draw(mask)
        m = int(WW * 0.62)
        md.ellipse([WW // 2 - m, HH // 2 - int(m * 1.5), WW // 2 + m, HH // 2 + int(m * 1.5)], fill=255)
        mask = mask.filter(ImageFilter.GaussianBlur(_s(40)))
        dark = Image.new("RGB", (WW, HH), color)
        faded = Image.blend(dark, self.img, 1.0)
        # darken corners: where mask is low, pull toward color by strength
        inv = ImageChops.invert(mask).point(lambda v: int(v * strength))
        self.img = Image.composite(dark, self.img, inv)
        self.d = ImageDraw.Draw(self.img)

    def grain(self, amount=8, seed=1):
        import random
        rnd = random.Random(seed)
        noise = Image.new("L", (WW // 2, HH // 2))
        noise.putdata([128 + rnd.randint(-amount, amount) for _ in range((WW // 2) * (HH // 2))])
        noise = noise.resize((WW, HH)).convert("RGB")
        self.img = ImageChops.overlay(self.img, noise)
        self.d = ImageDraw.Draw(self.img)

    def save(self, path, out_scale=2):
        self.img.resize((W * out_scale, H * out_scale), Image.LANCZOS).save(path)

    def paste_logical(self, sheet, ox, oy):
        """downscale to logical and paste into a montage sheet (logical-space Image)."""
        small = self.img.resize((W, H), Image.LANCZOS)
        sheet.paste(small, (ox, oy))
