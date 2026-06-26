import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// The Generative Arcana deck app. Static SPA, GitHub-Pages-ready:
//  - base "./" so it works under any /<repo-name>/ path without hardcoding it
//  - hash routing (see src/app/router.ts) so no server rewrites / 404 fallback are needed
//  - "@"     -> this app's source (src/)
//  - "@decks" -> the top-level, renderer-agnostic deck DATA corpus (../decks)
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@decks": fileURLToPath(new URL("../decks", import.meta.url)),
    },
  },
  // let the dev server read the sibling decks/ corpus (one level above this app root)
  server: { open: false, fs: { allow: [".."] } },
});
