import { default as assert } from "node:assert";
import { readdir, readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { exit } from "node:process";
import json5 from "json5";
import { validate } from "jsonschema";
import trash from "trash";
import { xdgConfig } from "xdg-basedir";
import { NAUGHTY_LIST } from "./binary-name";
import { CounterLog } from "./CounterLog";
import { lock } from "./lockfile";
import type { NaughtyListConfig } from "./schema";
import { default as schema } from "./schema.json" with { type: "json" };

export const ON_UNKNOWN_BEHAVIOURS = [
  "error-and-continue",
  "error-and-abort",
  "warn",
  "ignore",
] as const;

export type OnUnknownBehaviour = (typeof ON_UNKNOWN_BEHAVIOURS)[number];

export const ON_UNKNOWN_DEFAULT_BEHAVIOUR: (typeof ON_UNKNOWN_BEHAVIOURS)[number] =
  "error-and-continue";

// Workaround for bad exports in `json5`.
const { parse } = json5;

export async function sweep(options?: {
  onUnknown?: OnUnknownBehaviour;
  // Use a custom callback to trash files.
  // Note: this callback may be called multiple times with any number of paths each, not necessarily with all paths at once.
  trashCallback?: (paths: string[]) => Promise<void>;
}): Promise<void> {
  lock();

  // TODO: handle the default at parse-time.
  const onUnknown = options?.onUnknown ?? ON_UNKNOWN_DEFAULT_BEHAVIOUR;

  assert(xdgConfig);
  const configFilePath = join(xdgConfig, NAUGHTY_LIST, `${NAUGHTY_LIST}.json5`);

  const config: NaughtyListConfig = await (async () => {
    const configJSONString = await (async () => {
      try {
        return await readFile(configFilePath, "utf-8");
        // biome-ignore lint/suspicious/noExplicitAny: Required by TS
      } catch (e: any) {
        if ((e as { code: string }).code === "ENOENT") {
          console.error(
            `A configuration file is required. Please create one at: ${configFilePath}

Here's an example:

{
  "$schema": "https://raw.githubusercontent.com/lgarron/naughty-list/44e8a279d266950f310edef10ad56b6dfb5c46eb/src/schema.json",
  "paths": {
    "ignore": [
      ".cache",
      ".config",
      ".DS_Store", // macOS
      ".local",
      ".ssh",
      ".Trash", // macOS
      ".vscode", // https://github.com/microsoft/vscode/issues/3884
    ],
    "delete": [
      ".docker",
      ".npm",
    ]
  }
}
`,
          );
        }
        exit(1);
      }
    })();
    const config = parse(configJSONString);
    {
      const validationResult = validate(config, schema);
      if (!validationResult.valid) {
        console.error(validationResult.toString());
        exit(1);
      }
    }
    // TODO: is there a way to return only the validated subset?
    return config;
  })();

  const toIgnore = new Set(config.paths.ignore);
  const toDelete = new Set(config.paths.delete);

  const failedDueToUnknownPaths: string[] = [];
  const counterLog = new CounterLog();

  // We have to manually iterate through all the home dir entries, because `node`'s built-in `glob()` is super borked: https://github.com/nodejs/node/issues/56321
  for (const path of await readdir(homedir())) {
    if (!path.startsWith(".")) {
      continue;
    }

    if (toIgnore.has(path)) {
      console.info(`Ignoring: ${path}`);
    } else if (toDelete.has(path)) {
      console.error(`Trashing and logging: ${path}`);
      const fullPath = join(homedir(), path);
      if (options?.trashCallback) {
        await options.trashCallback([fullPath]);
      } else {
        await trash(fullPath);
      }

      await counterLog.record(fullPath);
    } else {
      switch (onUnknown) {
        case "error-and-continue": {
          console.error(`Unknown path: ${path}`);
          failedDueToUnknownPaths.push(path);
          break;
        }
        case "error-and-abort": {
          console.error(`Unknown path: ${path}`);
          throw new Error(`Failed due to unknown path: ${path}`);
        }
        case "warn": {
          console.warn(`Unknown path: ${path}`);
          break;
        }
        case "ignore": {
          console.warn(`Ignoring: ${path}`);
          break;
        }
        default: {
          throw new Error("Internal error");
        }
      }
    }
  }

  if (failedDueToUnknownPaths.length > 0) {
    throw new Error(`Failed due to unknown paths:
${failedDueToUnknownPaths.join("\n")}`);
  }
}
