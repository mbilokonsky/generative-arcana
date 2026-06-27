/**
 * Final Fantasy's visual skin: the "Pixel" chibi pack — hand-built pixel art (tools/pixel/ff_*.py),
 * each card lit by its station on the Elemental Wheel. Importing this registers the 78 PNGs under the
 * "finalfantasy"/"pixel" skin. Filenames are bare card slugs (major-0.png, chocobo-3.png …), so the
 * glob pairs them to cards directly. Disentangled from the deck data — deck.json stays renderer-agnostic.
 */
import { registerImagePack, registerPack } from "@/runtime/defineCard";

const files = import.meta.glob("./pixel/*.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const urls: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const slug = path.slice(path.lastIndexOf("/") + 1).replace(/\.png$/, "");
  urls[slug] = url;
}

registerImagePack("finalfantasy", "pixel", urls);
registerPack("finalfantasy", { id: "pixel", label: "Pixel", description: "chibi pixel art, each card lit by its element" });
