#!/usr/bin/env -S bun run --

import { file } from "bun";
import { generateSchema } from "./generate";

const definition = await generateSchema();
await file("./src/schema.json").write(JSON.stringify(definition, null, "  "));
