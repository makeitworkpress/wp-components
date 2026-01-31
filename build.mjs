import * as esbuild from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isWatch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  // Multiple entry points for separate output files
  entryPoints: [
    { in: "src/assets/styles/styles.less", out: "wpc-styles.min" },
    { in: "src/assets/scripts/blocks.ts", out: "wpc-blocks.min" },
    { in: "src/assets/scripts/scripts.ts", out: "wpc-scripts.min" },
  ],
  bundle: true,
  outdir: "public",

  alias: {
    "@components": path.resolve(__dirname, "./src/components"),
    "@scripts": path.resolve(__dirname, "./src/assets/scripts"),
    "@styles": path.resolve(__dirname, "./src/assets/styles"),
  },

  jsx: "transform",
  jsxFactory: "wp.element.createElement",
  jsxFragment: "wp.element.Fragment",
  minify: !isWatch,
  sourcemap: isWatch,
  plugins: [
    lessLoader({ javascriptEnabled: true }),
    {
      name: "version-gen",
      setup(build) {
        build.onEnd(() => {
          const version = Date.now();
          const content = `<?php return ['version' => '${version}'];`;
          fs.writeFileSync("src/assets/version.php", content);
          console.log(`✓ Assets updated: ${version}`);
        });
      },
    },
  ],
  // Prevent WP core from being bundled into the blocks script
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react/jsx-dev-runtime",
    "@wordpress/*",
  ],
});

if (isWatch) {
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
