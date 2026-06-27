/**
 * Evolution and Consciousness — the "Lumen" visual skin. Generative luminous-abstract plates
 * (tools/lumen/), each card derived from its coordinates: form(suit) · operation(rank) · light(station)
 * · modulation(number) — "form emerging as light." Importing this registers the 78 PNGs under the
 * "evolution"/"lumen" skin. Filenames are bare card slugs; the glob pairs them to cards directly.
 */
import { registerImagePack, registerPack } from "@/runtime/defineCard";

const files = import.meta.glob("./lumen/*.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;
const urls: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const slug = path.slice(path.lastIndexOf("/") + 1).replace(/\.png$/, "");
  urls[slug] = url;
}

registerImagePack("evolution", "lumen", urls);
registerPack("evolution", { id: "lumen", label: "Lumen", description: "generative luminous abstraction — form as light, derived from each card's axes" });
