import { expect, test } from "bun:test";
import { file } from "bun";
import type { Definition } from "typescript-json-schema";
import { generateSchema } from "../../script/schema/generate";

test("Schema is up to date", async () => {
  const definition = await generateSchema();
  const json: Definition = await file("./src/lib/schema.json").json();

  expect(definition).not.toEqual({});
  expect(definition).toEqual(json);
});
