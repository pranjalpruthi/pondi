import { defineConfig } from "vite";
import million from "million/compiler"; // Import million plugin
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Icons from 'unplugin-icons/vite'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { imagetools } from 'vite-imagetools';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    million.vite({ auto: true }), // Add million plugin, auto mode is common
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
    tailwindcss(),
    Icons({
      compiler: 'jsx',
      jsx: 'react',
      autoInstall: true,
      scale: 1.2
    }),
    imagetools({
      defaultDirectives: new URLSearchParams([
        ['format', 'webp,avif,jpg'], // Prefer modern formats
        ['quality', '80'],           // Good quality with smaller file size
        ['progressive', 'true'],     // Progressive loading
      ])
    })
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
    },
  },
});
