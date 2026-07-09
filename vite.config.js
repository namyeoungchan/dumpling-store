import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // GitHub Pages 프로젝트 사이트 경로 (https://namyeoungchan.github.io/dumpling-store/)
  base: "/dumpling-store/",
  plugins: [react(), tailwindcss()],
});
