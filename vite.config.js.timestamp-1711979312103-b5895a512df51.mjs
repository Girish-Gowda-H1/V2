// vite.config.js
import { defineConfig } from "file:///D:/kishan/kishansync/Backup/node_modules/vite/dist/node/index.js";
import react from "file:///D:/kishan/kishansync/Backup/node_modules/@vitejs/plugin-react/dist/index.mjs";
import eslintPlugin from "file:///D:/kishan/kishansync/Backup/node_modules/vite-plugin-eslint/dist/index.mjs";
import { sentryVitePlugin } from "file:///D:/kishan/kishansync/Backup/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
var __vite_injected_original_import_meta_url = "file:///D:/kishan/kishansync/Backup/vite.config.js";
var vite_config_default = defineConfig({
  envPrefix: "RB_",
  // Sentry Config
  build: {
    sourcemap: true
  },
  plugins: [
    react(),
    // eslintPlugin({
    //   cache: false,
    // }),
    sentryVitePlugin({
      org: "royal-brothers-04",
      project: "cdash-reactjs",
      authToken: process.env.RB_SENTRY_AUTH_TOKEN
    })
  ],
  resolve: {
    alias: {
      "@components": new URL("src/ui/components", __vite_injected_original_import_meta_url).pathname,
      "@assets": new URL("src/assets", __vite_injected_original_import_meta_url).pathname,
      "@schemas": new URL("src/ui/form-schemas", __vite_injected_original_import_meta_url).pathname,
      "@constants": new URL("src/constants", __vite_injected_original_import_meta_url).pathname,
      "@hooks": new URL("src/hooks", __vite_injected_original_import_meta_url).pathname,
      "@utils": new URL("src/utils", __vite_injected_original_import_meta_url).pathname,
      "@config": new URL("config.js", __vite_injected_original_import_meta_url).pathname,
      "@menu-items": new URL("src/menu-items", __vite_injected_original_import_meta_url).pathname,
      "@context": new URL("src/context", __vite_injected_original_import_meta_url).pathname,
      "@pages": new URL("src/ui/pages", __vite_injected_original_import_meta_url).pathname
    }
  },
  // For Less Preprocessor
  css: {
    preprocessorOptions: {
      less: {
        math: "always",
        relativeUrls: true,
        javascriptEnabled: true
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxraXNoYW5cXFxca2lzaGFuc3luY1xcXFxCYWNrdXBcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGtpc2hhblxcXFxraXNoYW5zeW5jXFxcXEJhY2t1cFxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDova2lzaGFuL2tpc2hhbnN5bmMvQmFja3VwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnO1xuaW1wb3J0IGVzbGludFBsdWdpbiBmcm9tICd2aXRlLXBsdWdpbi1lc2xpbnQnO1xuaW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gJ0BzZW50cnkvdml0ZS1wbHVnaW4nO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgZW52UHJlZml4OiAnUkJfJyxcblxuICAvLyBTZW50cnkgQ29uZmlnXG4gIGJ1aWxkOiB7XG4gICAgc291cmNlbWFwOiB0cnVlLFxuICB9LFxuXG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIC8vIGVzbGludFBsdWdpbih7XG4gICAgLy8gICBjYWNoZTogZmFsc2UsXG4gICAgLy8gfSksXG4gICAgc2VudHJ5Vml0ZVBsdWdpbih7XG4gICAgICBvcmc6ICdyb3lhbC1icm90aGVycy0wNCcsXG4gICAgICBwcm9qZWN0OiAnY2Rhc2gtcmVhY3RqcycsXG4gICAgICBhdXRoVG9rZW46IHByb2Nlc3MuZW52LlJCX1NFTlRSWV9BVVRIX1RPS0VOLFxuICAgIH0pLFxuICBdLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAY29tcG9uZW50cyc6IG5ldyBVUkwoJ3NyYy91aS9jb21wb25lbnRzJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcbiAgICAgICdAYXNzZXRzJzogbmV3IFVSTCgnc3JjL2Fzc2V0cycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXG4gICAgICAnQHNjaGVtYXMnOiBuZXcgVVJMKCdzcmMvdWkvZm9ybS1zY2hlbWFzJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcbiAgICAgICdAY29uc3RhbnRzJzogbmV3IFVSTCgnc3JjL2NvbnN0YW50cycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXG4gICAgICAnQGhvb2tzJzogbmV3IFVSTCgnc3JjL2hvb2tzJywgaW1wb3J0Lm1ldGEudXJsKS5wYXRobmFtZSxcbiAgICAgICdAdXRpbHMnOiBuZXcgVVJMKCdzcmMvdXRpbHMnLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxuICAgICAgJ0Bjb25maWcnOiBuZXcgVVJMKCdjb25maWcuanMnLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxuICAgICAgJ0BtZW51LWl0ZW1zJzogbmV3IFVSTCgnc3JjL21lbnUtaXRlbXMnLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxuICAgICAgJ0Bjb250ZXh0JzogbmV3IFVSTCgnc3JjL2NvbnRleHQnLCBpbXBvcnQubWV0YS51cmwpLnBhdGhuYW1lLFxuICAgICAgJ0BwYWdlcyc6IG5ldyBVUkwoJ3NyYy91aS9wYWdlcycsIGltcG9ydC5tZXRhLnVybCkucGF0aG5hbWUsXG4gICAgfSxcbiAgfSxcblxuICAvLyBGb3IgTGVzcyBQcmVwcm9jZXNzb3JcblxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBsZXNzOiB7XG4gICAgICAgIG1hdGg6ICdhbHdheXMnLFxuICAgICAgICByZWxhdGl2ZVVybHM6IHRydWUsXG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTJRLFNBQVMsb0JBQW9CO0FBQ3hTLE9BQU8sV0FBVztBQUNsQixPQUFPLGtCQUFrQjtBQUN6QixTQUFTLHdCQUF3QjtBQUhvSSxJQUFNLDJDQUEyQztBQU10TixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixXQUFXO0FBQUE7QUFBQSxFQUdYLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQSxFQUNiO0FBQUEsRUFFQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFJTixpQkFBaUI7QUFBQSxNQUNmLEtBQUs7QUFBQSxNQUNMLFNBQVM7QUFBQSxNQUNULFdBQVcsUUFBUSxJQUFJO0FBQUEsSUFDekIsQ0FBQztBQUFBLEVBQ0g7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLGVBQWUsSUFBSSxJQUFJLHFCQUFxQix3Q0FBZSxFQUFFO0FBQUEsTUFDN0QsV0FBVyxJQUFJLElBQUksY0FBYyx3Q0FBZSxFQUFFO0FBQUEsTUFDbEQsWUFBWSxJQUFJLElBQUksdUJBQXVCLHdDQUFlLEVBQUU7QUFBQSxNQUM1RCxjQUFjLElBQUksSUFBSSxpQkFBaUIsd0NBQWUsRUFBRTtBQUFBLE1BQ3hELFVBQVUsSUFBSSxJQUFJLGFBQWEsd0NBQWUsRUFBRTtBQUFBLE1BQ2hELFVBQVUsSUFBSSxJQUFJLGFBQWEsd0NBQWUsRUFBRTtBQUFBLE1BQ2hELFdBQVcsSUFBSSxJQUFJLGFBQWEsd0NBQWUsRUFBRTtBQUFBLE1BQ2pELGVBQWUsSUFBSSxJQUFJLGtCQUFrQix3Q0FBZSxFQUFFO0FBQUEsTUFDMUQsWUFBWSxJQUFJLElBQUksZUFBZSx3Q0FBZSxFQUFFO0FBQUEsTUFDcEQsVUFBVSxJQUFJLElBQUksZ0JBQWdCLHdDQUFlLEVBQUU7QUFBQSxJQUNyRDtBQUFBLEVBQ0Y7QUFBQTtBQUFBLEVBSUEsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osTUFBTTtBQUFBLFFBQ04sY0FBYztBQUFBLFFBQ2QsbUJBQW1CO0FBQUEsTUFDckI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
