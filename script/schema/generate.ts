import { $ } from "bun";
import type { Definition } from "typescript-json-schema";

export async function generateSchema(): Promise<Definition> {
  // TODO: We need `--skipLibCheck` because otherwise this borks on `@types/bun` vs. `@types/node` (even if we are passing `make lint`). 😭
  // TODO: file an issue with `typescript-json-schema` about this.
  return $`bun x typescript-json-schema --skipLibCheck --required './src/lib/schema.d.ts' NaughtyListConfig`.json(); // TODO: invoke the JS API rather than the binary?
}
