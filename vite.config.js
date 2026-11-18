import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";

const r = (p) => fileURLToPath(new URL(p, import.meta.url));

// Multi-page site: every folder with an index.html below is its own real page.
// Add a new page = add a folder + index.html + src/pages/<name>.jsx, list it here
// and in src/config/site.js.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  appType: "mpa",
  resolve: {
    alias: {
      "@": r("./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        home: r("./index.html"),
        about: r("./about/index.html"),
        work: r("./work/index.html"),
        contact: r("./contact/index.html"),
      },
    },
  },
});
