import { es2022Lib } from "@cubing/dev-config/esbuild/es2022";
import { build } from "esbuild";

await build({
  ...es2022Lib(),
  entryPoints: ["./src/bin/main.ts"],
  outdir: "dist/bin/naughty-list",
});

await build({
  ...es2022Lib(),
  entryPoints: ["./src/lib/index.ts"],
  outdir: "dist/lib/naughty-list",
});
