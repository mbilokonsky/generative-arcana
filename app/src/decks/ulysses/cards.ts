/**
 * Ulysses's visual packs. The deck offers two art treatments, selectable in the browser:
 *   1. "Animated" — the raw p5 instance-mode sketches migrated from the prior tool (one source string
 *      per slug; rendered via <RawP5Card>). Complete, 77/77. Registered first → the default.
 *   2. "Pixel · Vico" — a hand-composed pixel-art set whose palette/light is driven by each card's
 *      Vico age (built by tools/pixel/). Partial while in progress; missing cards fall back to the
 *      animated pack per-card.
 *
 * Both are disentangled from the deck JSON — /decks/ulysses/deck.json stays renderer-agnostic.
 */
import codes from "./visuals.json";
import { registerRawPack, registerImagePack, registerPack } from "@/runtime/defineCard";

// 1. animated p5 pack
registerRawPack("ulysses", "animated", codes as Record<string, string>);
registerPack("ulysses", { id: "animated", label: "Animated", kind: "p5", medium: "animated", description: "the original migrated p5 sketches" });

// 2. pixel "Vico" pack — filenames are bare card slugs (major-0.png, towers-3.png …)
const pixelFiles = import.meta.glob("./pixel/*.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const pixelUrls: Record<string, string> = {};
for (const [path, url] of Object.entries(pixelFiles)) {
  const slug = path.slice(path.lastIndexOf("/") + 1).replace(/\.png$/, "");
  pixelUrls[slug] = url;
}
registerImagePack("ulysses", "pixel", pixelUrls);
registerPack("ulysses", { id: "pixel", label: "Pixel · Vico", kind: "image", medium: "static", description: "pixel art keyed to each card's Vico age" });
