/**
 * Card registry assembly. Importing this module registers every implemented card sketch
 * (side effect of each card's `registerCard(...)` call) so the deck browser can resolve them
 * by slug via `getCardSketch`. The slice ships 5 of 78: one per suit + one major.
 */
import majorTwoMoons from "./major-2";
import crownsFour from "./crowns-four";
import bladesFive from "./blades-five";
import runesAce from "./runes-ace";
import moongatesEight from "./moongates-eight";

export const SLICE_CARDS = [majorTwoMoons, crownsFour, bladesFive, runesAce, moongatesEight];
export { majorTwoMoons, crownsFour, bladesFive, runesAce, moongatesEight };
