import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Change this to your desired port
  },
  assetsInclude: ["**/*.svg"],
  base: "/",
  define: {
    global: {},
  },
  node: {
    crypto: "empty",
  },
});
