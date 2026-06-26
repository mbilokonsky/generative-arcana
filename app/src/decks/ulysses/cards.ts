/**
 * Ulysses's visual pack: the raw p5 instance-mode sketches migrated from the prior tool (one source
 * string per card slug). Importing this module registers them under the "ulysses" deck namespace, so
 * the deck browser renders them via <RawP5Card>. Disentangled out of the deck JSON — the data corpus
 * at /decks/ulysses/deck.json stays renderer-agnostic; the art lives here in the app.
 */
import codes from "./visuals.json";
import { registerRawPack } from "@/runtime/defineCard";

registerRawPack("ulysses", codes as Record<string, string>);
