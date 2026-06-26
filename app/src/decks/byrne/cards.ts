/**
 * Byrne's visual pack: the pre-rendered card PNGs migrated from the prior tool. Importing this module
 * registers them under the "byrne" deck namespace, so the deck browser renders them as images.
 * Disentangled out of the deck data — /decks/byrne/deck.json stays renderer-agnostic; the art is here.
 *
 * Filenames are zero-padded (`structures-00.png`, `major-00.png`); deck card slugs are not
 * (`structures-0`, `major-0`), so we strip the pad to pair them. Vite hashes the assets and rewrites
 * the URLs for the deployed base path via the `?url` glob import.
 */
import { registerImagePack, registerPack } from "@/runtime/defineCard";

const files = import.meta.glob("./cards/*.png", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

const urls: Record<string, string> = {};
for (const [path, url] of Object.entries(files)) {
  const base = path.slice(path.lastIndexOf("/") + 1).replace(/\.png$/, ""); // e.g. "structures-00"
  const cut = base.lastIndexOf("-");
  const slug = `${base.slice(0, cut)}-${parseInt(base.slice(cut + 1), 10)}`; // "structures-00" -> "structures-0"
  urls[slug] = url;
}

registerImagePack("byrne", "illustrated", urls);
registerPack("byrne", { id: "illustrated", label: "Illustrated", kind: "image", medium: "static" });
