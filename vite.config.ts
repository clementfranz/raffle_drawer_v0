import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Your App Name",
        short_name: "App",
        description: "A description of your app",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icons/KopikoBlancaLogoTrimmed.ico",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/KopikoBlancaLogoTrimmed.ico",
            sizes: "512x512",
            type: "image/png"
          }
        ]
      }
    }),
    reactRouter(),
    tsconfigPaths()
  ]
});
