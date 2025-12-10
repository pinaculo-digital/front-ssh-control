import tailwindcss from "@tailwindcss/vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";

export default defineConfig({
  base: "/front-ssh",
  plugins: [tailwindcss(), sveltekit()],
  preview: {
    allowedHosts: true,
  },
  server: {
    allowedHosts: true,
  },
});
