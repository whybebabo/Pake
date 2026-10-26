import { build } from "esbuild";

await build({
  entryPoints: ["bilibili-glass.jsx"],
  bundle: true,
  minify: true,
  format: "iife",
  platform: "browser",
  define: { "process.env.NODE_ENV": '"production"' },
  outfile: "dist/bilibili-glass.js",
});
