import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

// The Ultima Tarot deck app. Static SPA, GitHub-Pages-ready:
//  - base "./" so it works under any /<repo-name>/ path without hardcoding it
//  - hash routing (see src/app/router.ts) so no server rewrites / 404 fallback are needed
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  server: { open: false },
});
