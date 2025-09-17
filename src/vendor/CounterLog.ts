import "../lockfile";

import { default as assert } from "node:assert";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { ErgonomicDate } from "ergonomic-date";
import { xdgData } from "xdg-basedir";
import { NAUGHTY_LIST } from "../binary-name";
import { lock } from "../lockfile";

assert(xdgData);
const logRootPath = join(xdgData, NAUGHTY_LIST);

// if (argv.length < 2) {
//   exit(1);
// }

// const [fileName, jsonKey] = argv.slice(2);

// const f = file(fileName);
// const contents = (await f.exists()) ? await file(fileName).json() : {};
// // biome-ignore lint/suspicious/noAssignInExpressions: Caching pattern.
// (contents[jsonKey] ??= []).push(new ErgonomicDate().multipurposeTimestamp);
// await write(f, JSON.stringify(contents, null, "  "));

// console.log()

type CounterJSON = Record<string, string[]>;

export class CounterLog {
  counterFilePath: string;
  json: CounterJSON;
  constructor() {
    lock();

    const ergonomicDate = new ErgonomicDate();
    // Initialized here to keep a stable path per instance.
    this.counterFilePath = join(
      logRootPath,
      `${ergonomicDate.localYearMonth}.${NAUGHTY_LIST}.json`,
    );

    console.log("Recording to: ", this.counterFilePath);

    if (existsSync(this.counterFilePath)) {
      this.json = JSON.parse(readFileSync(this.counterFilePath, "utf-8"));
    } else {
      mkdirSync(dirname(this.counterFilePath), { recursive: true });
      this.json = {};
      this.flush();
    }
  }

  async flush() {
    await writeFile(
      this.counterFilePath,
      JSON.stringify(this.json, null, "  "),
      "utf-8",
    );
  }

  async record(key: string) {
    // biome-ignore lint/suspicious/noAssignInExpressions: Caching pattern
    (this.json[key] ??= []).push(new ErgonomicDate().multipurposeTimestamp);

    // We write immediately in case the program crashes later.
    this.flush();
  }
}
