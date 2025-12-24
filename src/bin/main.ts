#!/usr/bin/env -S bun run --

import { argv } from "node:process";
import {
  choice,
  constant,
  message,
  object,
  option,
  withDefault,
} from "@optique/core";
import { run } from "@optique/run";
import { Path } from "path-class";
import { description, version as VERSION } from "../../package.json";
import {
  ON_UNKNOWN_BEHAVIOURS,
  ON_UNKNOWN_DEFAULT_BEHAVIOUR,
  sweep,
} from "../lib/sweep";

const args = run(
  object({
    subcommand: constant("read"),
    onUnknown: withDefault(
      option(
        "--on-unknown",
        choice(ON_UNKNOWN_BEHAVIOURS, { metavar: "BEHAVIOUR" }),
      ),
      ON_UNKNOWN_DEFAULT_BEHAVIOUR,
    ),
  }),
  {
    programName: new Path(argv[1]).basename.path,
    description: message`${description}`,
    help: "option",
    completion: {
      mode: "option",
      name: "plural",
    },
    version: {
      mode: "option",
      value: VERSION,
    },
  },
);

await sweep(args);
