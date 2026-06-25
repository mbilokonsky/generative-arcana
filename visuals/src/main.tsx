import { createRoot } from "react-dom/client";
import "@/decks"; // registers every bundled deck and its card sketches
import { App } from "@/app/App";

createRoot(document.getElementById("root")!).render(<App />);
