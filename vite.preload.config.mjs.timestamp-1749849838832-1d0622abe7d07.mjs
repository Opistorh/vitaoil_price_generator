// vite.preload.config.mjs
import { defineConfig } from "file:///D:/tailwind-demo/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
var vite_preload_config_default = defineConfig({
  resolve: {
    alias: {
      "@": resolve("src")
    }
  },
  build: {
    outDir: "dist/preload",
    lib: {
      entry: "src/preload.js",
      formats: ["cjs"],
      fileName: () => "[name].js"
    },
    rollupOptions: {
      external: ["electron"]
    },
    minify: process.env.NODE_ENV === "production",
    emptyOutDir: true,
    watch: process.env.NODE_ENV === "development" ? {} : null
  }
});
export {
  vite_preload_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5wcmVsb2FkLmNvbmZpZy5tanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFx0YWlsd2luZC1kZW1vXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFx0YWlsd2luZC1kZW1vXFxcXHZpdGUucHJlbG9hZC5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi90YWlsd2luZC1kZW1vL3ZpdGUucHJlbG9hZC5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWdcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IHJlc29sdmUoJ3NyYycpXHJcbiAgICB9XHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdC9wcmVsb2FkJyxcclxuICAgIGxpYjoge1xyXG4gICAgICBlbnRyeTogJ3NyYy9wcmVsb2FkLmpzJyxcclxuICAgICAgZm9ybWF0czogWydjanMnXSxcclxuICAgICAgZmlsZU5hbWU6ICgpID0+ICdbbmFtZV0uanMnLFxyXG4gICAgfSxcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgZXh0ZXJuYWw6IFsnZWxlY3Ryb24nXSxcclxuICAgIH0sXHJcbiAgICBtaW5pZnk6IHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicsXHJcbiAgICBlbXB0eU91dERpcjogdHJ1ZSxcclxuICAgIHdhdGNoOiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ2RldmVsb3BtZW50JyA/IHt9IDogbnVsbCxcclxuICB9XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdQLFNBQVMsb0JBQW9CO0FBQ3JSLFNBQVMsZUFBZTtBQUd4QixJQUFPLDhCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLFFBQVEsS0FBSztBQUFBLElBQ3BCO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLElBQ1IsS0FBSztBQUFBLE1BQ0gsT0FBTztBQUFBLE1BQ1AsU0FBUyxDQUFDLEtBQUs7QUFBQSxNQUNmLFVBQVUsTUFBTTtBQUFBLElBQ2xCO0FBQUEsSUFDQSxlQUFlO0FBQUEsTUFDYixVQUFVLENBQUMsVUFBVTtBQUFBLElBQ3ZCO0FBQUEsSUFDQSxRQUFRLFFBQVEsSUFBSSxhQUFhO0FBQUEsSUFDakMsYUFBYTtBQUFBLElBQ2IsT0FBTyxRQUFRLElBQUksYUFBYSxnQkFBZ0IsQ0FBQyxJQUFJO0FBQUEsRUFDdkQ7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
