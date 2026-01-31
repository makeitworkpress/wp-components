import * as esbuild from "esbuild";
import { lessLoader } from "esbuild-plugin-less";
import fs from "fs";

const isWatch = process.argv.includes("--watch");

const ctx = await esbuild.context({
  // Multiple entry points for separate output files
  entryPoints: [
    { in: "src/assets/styles/styles.less", out: "wpc-styles.min" },
    { in: "src/assets/script/blocks.ts", out: "wpc-blocks" },
    { in: "src/assets/scripts/scripts.ts", out: "wpc-scripts.min" },
  ],
  bundle: true,
  outdir: "public",
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
          fs.writeFileSync("public/version.php", content);
          console.log(`✓ Assets updated: ${version}`);
        });
      },
    },
  ],
  // Prevent WP core from being bundled into the blocks script
  external: ["@wordpress/*"],
});

if (isWatch) {
  await ctx.watch();
  console.log("Watching for changes...");
} else {
  await ctx.rebuild();
  await ctx.dispose();
}
