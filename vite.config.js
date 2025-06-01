import { defineConfig } from "vite";
import million from "million/compiler"; // Import million plugin
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import Icons from 'unplugin-icons/vite'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import { resolve } from "node:path";
import { imagetools } from 'vite-imagetools';
import reactScan from '@react-scan/vite-plugin-react-scan'; // Import react-scan plugin

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
    }),
    reactScan(),
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
  server: {
        allowedHosts: [
          'f78ad1885f15eccc6d1681e73d3d82f3.serveo.net',
          '8ea27f368b4588.lhr.life'
        ],
    proxy: {
      // Proxy /youtube-feed requests to the YouTube RSS feed
      '/youtube-feed': {
        target: 'https://www.youtube.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/youtube-feed/, ''),
        secure: false,
      },
      // Proxy requests to your calendar API
      '/api/calendar': {
        target: 'https://gcal.pranjal.work',
        changeOrigin: true, // Important for virtual hosted sites
        rewrite: (path) => path.replace(/^\/api\/calendar/, '/calendar'), // Rewrite /api/calendar to /calendar
        secure: true, // Target is HTTPS
      },
      // Proxy requests for location search to your production backend API
      '/api/search-locations': {
        target: 'https://gcal.pranjal.work', // Your production backend API
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/search-locations/, '/search-locations'),
        secure: true, // Target is HTTPS
      },
      // Proxy requests to the new calendar-by-coordinates API
      '/api/calendar-by-coordinates': {
        target: 'https://gcal.pranjal.work',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/calendar-by-coordinates/, '/calendar-by-coordinates'),
        secure: true, // Target is HTTPS
      },
    },
  },
});
