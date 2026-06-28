"""
Generator for the Ultima Octave Tarot — a lattice deck. Garriott hung every 8-fold correspondence off
one 3-bit value (Truth=4, Love=2, Courage=1). Here that value is the SUIT (a virtue = a colour-cube
corner), the RANK is the octave (the symbol-system the virtue is read through), and the card is their
intersection. We hold the correspondences once and derive all 64 minors; majors are the proper nouns.

Run from repo root:  python tools/gen/gen_octave.py  ->  decks/ultima-octave/deck.json
"""
import json, os, collections

OD = collections.OrderedDict

# ── the eight virtues (suits): 3-bit value, colour-cube corner, principles ──────
# bit: Truth=4, Love=2, Courage=1
VIR = [
    # slug, Name, idx, colour, hex, principles(T,L,C present), Vice, short, gloss
    ("humility", "Humility", 0, "black", "#1B1B20", (0,0,0), "Pride",
     "claiming nothing — the ground from which all virtue springs",
     "Zero: the empty set of principles, the precondition that holds none yet enables all. Pride is the fall from it."),
    ("valor", "Valor", 1, "red", "#D4453F", (0,0,1), "Cowardice",
     "facing what must be faced",
     "One: the unit, the operator — Courage, the single act that must come first for any other virtue to be practised at all."),
    ("compassion", "Compassion", 2, "green", "#3FA85C", (0,1,0), "Hatred",
     "feeling with another",
     "Two: the first prime — Love, irreducible, the first real reach of the self beyond itself."),
    ("sacrifice", "Sacrifice", 3, "yellow", "#D8B23A", (0,1,1), "Selfishness",
     "giving of oneself for others",
     "Three: prime — Love and Courage fused (yellow), an irreducible giving that no analysis divides."),
    ("honesty", "Honesty", 4, "blue", "#3E6FD6", (1,0,0), "Deceit",
     "truth in word and seeming",
     "Four = two squared: Truth as built structure (blue) — a single principle that nonetheless reads as an edifice, the framework reason stands inside."),
    ("honor", "Honor", 5, "magenta", "#B45ABF", (1,0,1), "Disgrace",
     "living by one's word in the open",
     "Five: prime — Truth and Courage (magenta), the stand taken in the open and answered for."),
    ("justice", "Justice", 6, "cyan", "#46BFC4", (1,1,0), "Tyranny",
     "to each their due — mercy and law in balance",
     "Six = two times three: Truth+Love by the bits (cyan), yet Compassion x Sacrifice by the factors — the card whose binary and prime parents disagree."),
    ("spirituality", "Spirituality", 7, "white", "#ECE9E0", (1,1,1), "Worldliness",
     "the whole — all three principles held at once",
     "Seven: prime — all three principles together (white), the irreducible union that cannot be assembled from fewer."),
]
VIRD = {v[0]: v for v in VIR}
CHAR = {0:"identity",1:"identity",2:"prime",3:"prime",4:"composite",5:"prime",6:"composite",7:"prime"}
FACT = {4:[2,2],6:[2,3]}

# ── the eight octaves (ranks): the symbol-systems, each a duality ────────────────
# per-virtue member tuples: (upright_member, upright_desc, inverted_member, inverted_desc)
PLACE = {
 "humility":("Magincia","the city of pride brought low and rebuilt as humility","the Abyss","the final descent where pride is undone"),
 "valor":("Jhelom","the island city of fighters and the dueling arena","Destard","the dragon-pit, where courage curdles to bloodlust"),
 "compassion":("Britain","Lord British's capital, the warm heart of the realm","Despise","the dungeon of contempt — love soured to scorn"),
 "sacrifice":("Minoc","the mountain town of tinkers and open-handed giving","Covetous","the hoard-dungeon — giving inverted to grasping"),
 "honesty":("Moonglow","the island city of mages and the Lycaeum","Deceit","the dungeon of lies — truth turned to illusion"),
 "honor":("Trinsic","the walled city of paladins","Shame","the dungeon of disgrace — honor lost"),
 "justice":("Yew","the forest city of druids and the courts","Wrong","the dungeon of injustice — law without mercy"),
 "spirituality":("Skara Brae","the island of rangers and the spirit","Hythloth","the deep dungeon nearest the Abyss — spirit lost in the dark"),
}
ROLE = {
 "humility":("the Shepherd","the lowly herder who claims nothing","the Servile","self-abasement mistaken for humility"),
 "valor":("the Fighter","the warrior who meets danger head-on","the Brute","courage without cause, violence for its own sake"),
 "compassion":("the Bard","the singer who moves hearts","the Charlatan","feeling weaponized — sympathy as manipulation"),
 "sacrifice":("the Tinker","the maker who gives their craft to others","the Martyr","giving turned to self-erasure and reproach"),
 "honesty":("the Mage","the scholar who seeks what is true","the Deceiver","knowledge used to mislead"),
 "honor":("the Paladin","the holy knight bound by their word","the Zealot","honor hardened to merciless pride"),
 "justice":("the Druid","the keeper of balance and law","the Tyrant","law without mercy, balance as control"),
 "spirituality":("the Ranger","the wanderer at home in the whole","the Lost","detachment become rootlessness"),
}
COMP = {
 "humility":("Katrina","the shepherd of Magincia, humble and steady","Katrina astray","humility curdled to self-erasure"),
 "valor":("Geoffrey","the fighter, captain of the guard","Geoffrey astray","valor curdled to recklessness"),
 "compassion":("Iolo","the bard, Lord British's oldest friend","Iolo astray","compassion curdled to indulgence"),
 "sacrifice":("Julia","the tinker of Minoc","Julia astray","sacrifice curdled to grievance"),
 "honesty":("Mariah","the mage of Moonglow","Mariah astray","honesty curdled to cold disclosure"),
 "honor":("Dupre","the paladin of Trinsic","Dupre astray","honor curdled to pride"),
 "justice":("Jaana","the druid of Yew","Jaana astray","justice curdled to severity"),
 "spirituality":("Shamino","the ranger, the Avatar's truest companion","Shamino astray","spirituality curdled to endless wandering"),
}
MANTRA = {"humility":"LUM","valor":"RA","compassion":"MU","sacrifice":"CAH","honesty":"AHM","honor":"SUMM","justice":"BEH","spirituality":"OM"}
WORD = {v: (f"the mantra {MANTRA[v]}", f"the word of power intoned at the Shrine of {VIRD[v][1]}",
            "the unsaid word", "the mantra swallowed — the virtue gone mute") for v in VIRD}
STONE = {v: (f"the {VIRD[v][3]} stone", f"the {VIRD[v][1]} stone of the Abyss, raised to pass its barrier",
             f"the {VIRD[v][3]} stone misused", "the stone turned against the one who carries it") for v in VIRD}
REAG = {
 "honesty":("Black Pearl","the reagent of clarity and direct force","Black Pearl in black magic","truth's reagent bent to harm"),
 "compassion":("Ginseng","the reagent of healing","Ginseng in black magic","the healing herb turned to poison"),
 "valor":("Sulfurous Ash","the reagent of fire and energy","Sulfurous Ash in black magic","valor's fire turned only destructive"),
 "justice":("Spider Silk","the reagent of binding","Spider Silk in black magic","the binding turned to a snare"),
 "sacrifice":("Blood Moss","the reagent of movement and blood","Blood Moss in black magic","the gift of motion turned to bleeding"),
 "honor":("Garlic","the reagent of warding and protection","Garlic in black magic","the ward turned to a curse"),
 "spirituality":("Mandrake Root","the reagent of deepest power","Mandrake Root in black magic","the deep power turned to ruin"),
 "humility":("Nightshade","the reagent of poison and the ego's end","Nightshade in black magic","the humbling draught turned to murder"),
}
SHRINE = {v: (f"the Shrine of {VIRD[v][1]}", f"the wilderness shrine where {VIRD[v][1]} is meditated and the Codex glimpsed",
              "the shrine desecrated", "meditation failed, the vision withheld") for v in VIRD}
SELF = {v: (VIRD[v][1], VIRD[v][7], VIRD[v][6], f"the virtue overturned into {VIRD[v][6].lower()}") for v in VIRD}

OCT = [
 ("virtue","Virtue","Virtue","the virtue itself, named and met head-on", SELF),
 ("place","Place","Place","the city that houses the virtue, or the dungeon that is its shadow", PLACE),
 ("role","Role","Role","the avatar-class that practises the virtue, or the shadow it becomes", ROLE),
 ("companion","Companion","Companion","the party-member who embodies the virtue, present or astray", COMP),
 ("word","Word","Word","the mantra that invokes the virtue, or its silence", WORD),
 ("stone","Stone","Stone","the colour-stone of the Abyss, raised rightly or misused", STONE),
 ("reagent","Reagent","Reagent","the reagent aligned to the virtue, in white magic or black", REAG),
 ("shrine","Shrine","Shrine","the shrine of the virtue, elevation or desecration", SHRINE),
]

# ── the lunar transversal (Felucca's 8 phases -> moongates) ─────────────────────
PHASES = [
 ("new-moon","New Moon","no moonlight; a dark gate; the void before the cycle"),
 ("waxing-crescent","Waxing Crescent","a thin silver rim; light beginning"),
 ("first-quarter","First Quarter","half dark, half silver; the gate half-open"),
 ("waxing-gibbous","Waxing Gibbous","swelling silver, nearly full; a rising tide of light"),
 ("full-moon","Full Moon","a flood of silver-white; the gate wide; all washed in lunar light"),
 ("waning-gibbous","Waning Gibbous","the light past its peak, beginning to ebb"),
 ("last-quarter","Last Quarter","half-light waning; the gate half-closing"),
 ("waning-crescent","Waning Crescent","the last sliver; the cycle closing toward dark"),
]
STRIDE = 3

# ── the 22 majors (the proper nouns) ────────────────────────────────────────────
MAJ = [
 ("The Avatar","you — the seeker who takes up the quest of the eight virtues, the one the cards are dealt to","the seeker who quests for power or fame rather than virtue; the false avatar"),
 ("Lord British","the sovereign who set the quest and keeps the realm; rightful authority in service of virtue","authority clung to; the king who rules for himself"),
 ("The Guardian","the great adversary, the red titan who would master Britannia; domination, the will to control","the adversary within — your own will to power, recognized"),
 ("The Codex of Ultimate Wisdom","the book at the bottom of the Abyss; truth made whole, the answer to the quest","wisdom sought as possession; the word taken without the journey"),
 ("The Ankh","the sign of the Avatar; life, virtue made visible, resurrection","the symbol worn without the substance; piety as costume"),
 ("Trammel","the inner moon, the steady one; constancy, law, the fixed light to steer by","rigidity; constancy become inability to change"),
 ("Felucca","the outer moon, the changing one that opens the gates; flux, passage, opportunity","change for its own sake; the gate taken to flee rather than to seek"),
 ("Mondain","the first foe, the dark wizard and his Gem of Immortality; the refusal of death, power hoarded","the fear of ending that drives one to monstrousness"),
 ("Minax","the enchantress, Mondain's heir; seduction, the twisting of time and desire","manipulation; the past or future used to escape the present"),
 ("Exodus","neither human nor machine, the daemon-engine; the rule of pure system without soul","intelligence without conscience; the machine that forgets it serves life"),
 ("The Shadowlord of Falsehood","the negation of Truth; the lie that walks, deceit given a body","the small lie you tell yourself; falsehood mistaken for tact"),
 ("The Shadowlord of Hatred","the negation of Love; contempt given a body","the hardening of the heart; hatred dressed as discernment"),
 ("The Shadowlord of Cowardice","the negation of Courage; flight given a body","the retreat that calls itself prudence"),
 ("The Stygian Abyss","the final descent; the trial that gathers every virtue at once, the way to the Codex","the descent refused, or made for the prize and not the passage"),
 ("The Word of Power","VERAMOCOR — the eight-syllable word that opens the Abyss; the key earned syllable by syllable","the shortcut sought; the door forced without the work"),
 ("The Black Gate","the doorway the Guardian would open into the world; the threshold of ruin disguised as gift","the tempting offer whose true cost is hidden"),
 ("The Time Lord","the keeper of the streams of time; right timing, the long view","fatalism, or the meddling that breaks what it would mend"),
 ("The Bell, Book, and Candle","the three keys to the Abyss; the gathered means, preparation complete","the keys collected, the quest never begun"),
 ("The Fellowship","the cult of false virtue (Unity, Trust, Worthiness) that fronts for the Guardian; counterfeit goodness, the captured community","the comfortable lie of belonging; virtue outsourced to a group"),
 ("The Quest of the Avatar","the journey itself — the becoming of a virtuous self, not the reaching of a place","the quest mistaken for a checklist; the path walked for the badge"),
 ("The Gem of Immortality","the shattered gem that split Britannia into its mirrored lands; the One refracted into the many","grasping the whole and shattering it; immortality bought with the world"),
 ("Britannia","the realm entire — the eight cities, the two moons, the land made of virtue; the world restored and whole","the world taken for granted; wholeness that stops questing"),
]
MFACT = {0:"identity",1:"identity",2:"prime",3:"prime",4:"composite",5:"prime",6:"composite",7:"prime",8:"composite",9:"composite",10:"composite",11:"prime",12:"composite",13:"prime",14:"composite",15:"composite",16:"composite",17:"prime",18:"composite",19:"prime",20:"composite",21:"composite"}
MFACTORS = {4:[2,2],6:[2,3],8:[2,2,2],9:[3,3],10:[2,5],12:[2,2,3],14:[2,7],15:[3,5],16:[2,2,2,2],18:[2,3,3],20:[2,2,5],21:[3,7]}

def glyph(bits):
    # three pips: Truth, Love, Courage (left->right), filled where the principle is present
    parts = ['<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">']
    for i, on in enumerate(bits):  # bits = (T,L,C)
        cx = 28 + i * 22
        if on:
            parts.append(f'<circle cx="{cx}" cy="50" r="11" fill="currentColor"/>')
        else:
            parts.append(f'<circle cx="{cx}" cy="50" r="11" fill="none" stroke="currentColor" stroke-width="4"/>')
    parts.append('</svg>')
    return ''.join(parts)

def build():
    deck = OD()
    deck["name"] = "Ultima Octave Tarot"
    deck["slug"] = "ultima-octave"
    deck["version"] = "1.0.0"
    deck["theme"] = OD([
        ("name", "Ultima — The Octave of Virtue"),
        ("description", "A companion to the Ultima Tarot built on the bones of Garriott's design: the eight virtues are not a list but a 3-bit algebra over three Principles — Truth (4), Love (2), Courage (1) — so the eight are exactly the eight corners of the additive colour cube (black to white through R/G/B and C/M/Y). Every Ultima 8-fold hangs off that one value, so this deck makes the value the SUIT (a virtue = a colour) and the OCTAVE the rank: each card is one virtue read through one symbol-system — Place of Justice is Yew, Role of Valor is the Fighter, Companion of Spirituality is Shamino. Where the other decks spread meaning across four axes, this one concentrates it: the suit alone carries virtue, colour, binary principle-subset, and prime/composite character at once. The lunar cycle of Felucca runs across it as weather; the majors are the proper nouns the lattice hangs from."),
        ("creator", "Mykola Bilokonsky & Isaac Z. Schlueter"),
    ])
    # suits = virtues
    suits = OD()
    for slug, Name, idx, col, hexc, bits, vice, short, gloss in VIR:
        princ = "+".join([n for n, b in zip(("Truth","Love","Courage"), bits) if b]) or "none"
        suits[slug] = OD([
            ("index", idx), ("name", Name), ("slug", slug),
            ("description", f"The virtue of {Name} — {short}. Principles: {princ} ({''.join(str(b) for b in bits)} = {idx}); its colour is {col}."),
            ("symbol", OD([("name", f"{Name} ({col})"), ("description", f"Three pips for Truth, Love, Courage — filled where {Name} holds them ({''.join(str(b) for b in bits)})."), ("svg", glyph(bits))])),
            ("meaning", OD([("upright", [Name.lower(), short, princ, col]), ("inverted", [vice.lower(), f"{Name} overturned"])])),
            ("visual_style", f"The colour of {Name}: {col} ({hexc}). Forms in {col} light on a neutral graphite ground; spare and heraldic, the cube-corner made a world."),
        ])
    deck["suits"] = suits
    # ranks = octaves
    ranks = OD()
    for i, (oslug, Name, sing, lens, _members) in enumerate(OCT):
        ranks[oslug] = OD([
            ("index", i), ("arcana", "minor"), ("numeric_value", i), ("name", Name), ("symbol", Name[0]),
            ("description", f"The {sing} octave — {lens}."),
            ("question", f"Read through {{suit}}, what is its {sing}?"),
        ])
    deck["ranks"] = ranks
    # transversal = lunar
    stations = OD()
    for i, (pslug, Name, motif) in enumerate(PHASES):
        dest = VIR[i][1]
        stations[pslug] = OD([
            ("slug", pslug), ("index", i), ("name", Name),
            ("description", f"Felucca at {Name} — the moongate it opens leads to {dest}."),
            ("meaning", OD([("upright", [Name.lower(), "timing", "the gate open"]), ("inverted", ["the moongate", "displacement", "carried elsewhere"])])),
            ("visual_motif", f"{motif}; the silver weather of {Name} laid over the scene."),
        ])
    deck["transversal"] = OD([
        ("name", "The Lunar Cycle"),
        ("description", "Felucca, the outer moon, turns through eight phases, and at each a moongate opens to one of the eight cities. Across this lattice the moon is weather and timing — under which phase a card is read, not which virtue it is. It moves at the pace of the heavens, indifferent to the virtue or octave it lights."),
        ("ordering_rationale", "The natural lunar order, new moon to waning crescent; suit_stride 3 (coprime to 8) so a virtue is lit by a different phase in each octave, keeping the moon cross-cutting rather than pinned to any city."),
        ("suit_stride", STRIDE),
        ("stations", stations),
    ])
    deck["major_arcana"] = OD([
        ("story", "The proper nouns of Britannia — the named ones the lattice of virtues hangs from. The Avatar takes up the quest Lord British set; the Guardian and the three early foes (Mondain, Minax, Exodus) oppose it; the three Shadowlords are the living negations of the three Principles; and the Codex, the Ankh, the moons, the Word, and the Abyss are the furniture of the cosmos in which the eight virtues are practised."),
        ("visual_style", "Spare and iconic on the graphite ground, each named one rendered as a single luminous emblem; the palette free to use any of the eight virtue-colours as the figure demands, since the named ones stand outside the cube even as they move within it."),
        ("symbol", OD([("name", "The Cube"), ("description", "The eight-cornered colour cube of the virtues."), ("svg", '<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M30 30 H62 V62 H30 Z" fill="none" stroke="currentColor" stroke-width="5"/><path d="M44 18 H76 V50" fill="none" stroke="currentColor" stroke-width="5"/><line x1="30" y1="30" x2="44" y2="18" stroke="currentColor" stroke-width="5"/><line x1="62" y1="30" x2="76" y2="18" stroke="currentColor" stroke-width="5"/><line x1="62" y1="62" x2="76" y2="50" stroke="currentColor" stroke-width="5"/></svg>')])),
    ])
    # cards
    cards = OD()
    order = ["new-moon","waxing-crescent","first-quarter","waxing-gibbous","full-moon","waning-gibbous","last-quarter","waning-crescent"]
    # minors: octave (rank) x virtue (suit)
    for oi, (oslug, ONm, sing, lens, members) in enumerate(OCT):
        for slug, VNm, vidx, col, hexc, bits, vice, short, gloss in VIR:
            up_m, up_d, inv_m, inv_d = members[slug]
            st = order[(oi + STRIDE * vidx) % 8]
            cslug = f"{slug}-{oslug}"
            up = f"{up_m} — {up_d}. The {sing} of {VNm}: {VNm} ({col}) seen as {ONm.lower()}."
            inv = f"{inv_m} — {inv_d}. {VNm} inverted toward {vice}."
            vis = f"{up_m}, rendered as a {col} emblem (the colour of {VNm}) on graphite, under the silver weather of {st.replace('-', ' ')}."
            card = OD([
                ("name", f"{sing} of {VNm}"), ("number", str(vidx)), ("slug", cslug), ("arcana", "minor"),
                ("suit_slug", slug), ("rank_slug", oslug), ("station_slug", st),
                ("factorization", OD([("character", CHAR[vidx]), ("gloss", gloss)] + ([("factors", FACT[vidx])] if vidx in FACT else []))),
                ("meaning", OD([("upright", up), ("inverted", inv)])),
                ("visuals", OD([("detailed_description", vis)])),
            ])
            if vidx in FACT:
                card["factorization"]["factors"] = FACT[vidx]
            cards[cslug] = card
    # majors
    for n, (Name, up, inv) in enumerate(MAJ):
        st = order[n % 8]
        f = OD([("character", MFACT[n]), ("gloss", f"{Name}: number {n} ({MFACT[n]}).")])
        if n in MFACTORS: f["factors"] = MFACTORS[n]
        cards[f"major-{n}"] = OD([
            ("name", Name), ("number", str(n)), ("slug", f"major-{n}"), ("arcana", "major"),
            ("station_slug", st), ("factorization", f),
            ("meaning", OD([("upright", up), ("inverted", inv)])),
            ("visuals", OD([("detailed_description", f"{Name} as a single luminous emblem on graphite, under the silver weather of {st.replace('-', ' ')}.")])),
        ])
    deck["cards"] = cards
    return deck

d = build()
out = os.path.join("decks", "ultima-octave", "deck.json")
json.dump(d, open(out, "w", encoding="utf-8"), indent=2, ensure_ascii=False)
print("wrote", out)
print("suits", len(d["suits"]), "ranks", len(d["ranks"]), "stations", len(d["transversal"]["stations"]), "cards", len(d["cards"]))
mn = sum(c["arcana"] == "minor" for c in d["cards"].values()); mj = sum(c["arcana"] == "major" for c in d["cards"].values())
print("minors", mn, "majors", mj)
print("samples:", d["cards"]["justice-place"]["name"], "|", d["cards"]["valor-role"]["name"], "|", d["cards"]["spirituality-companion"]["name"])
