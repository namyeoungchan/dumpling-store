import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages(프로젝트 경로)에서만 /dumpling-store/, Vercel 등에서는 루트(/)
  base: process.env.GITHUB_ACTIONS ? "/dumpling-store/" : "/",
  plugins: [react(), tailwindcss()],
});
