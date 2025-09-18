#!/usr/bin/env -S bun run --

import { $, file } from "bun";
import { generateSchema } from "./generate";

const definition = await generateSchema();
await file("./src/lib/schema.json").write(
  JSON.stringify(definition, null, "  "),
);

await $`bun x @biomejs/biome check --write src/lib/schema.json`;
