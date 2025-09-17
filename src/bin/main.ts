#!/usr/bin/env -S bun run --

import("../lib/lockfile");

import { binary, command, oneOf, option, optional, run } from "cmd-ts-too";
import {
  ON_UNKNOWN_BEHAVIOURS,
  ON_UNKNOWN_DEFAULT_BEHAVIOUR,
  sweep,
} from "../lib/sweep";

const app = command({
  name: "naughty-list",
  args: {
    onUnknown: option({
      description: `Output format. One of: ${ON_UNKNOWN_BEHAVIOURS.join(", ")} (default: ${ON_UNKNOWN_DEFAULT_BEHAVIOUR})`,
      type: optional(oneOf(ON_UNKNOWN_BEHAVIOURS)),
      long: "on-unknown",
    }),
  },
  handler: async ({ onUnknown }) => {
    sweep({ onUnknown });
  },
});

await run(binary(app), process.argv);
