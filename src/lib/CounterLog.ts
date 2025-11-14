import { existsSync } from "node:fs";
import { ErgonomicDate } from "ergonomic-date";
import { Path } from "path-class";
import "path-class/sync";
import { NAUGHTY_LIST } from "./binary-name";
import { lock } from "./lockfile";

const logRootPath = Path.xdg.data.join(NAUGHTY_LIST);

type CounterJSON = Record<string, string[]>;

export class CounterLog {
  counterFilePath: Path;
  json: CounterJSON;
  constructor() {
    lock();

    const ergonomicDate = new ErgonomicDate();
    // Initialized here to keep a stable path per instance.
    this.counterFilePath = logRootPath.join(
      `${ergonomicDate.localYearMonth}.${NAUGHTY_LIST}.json`,
    );

    console.log(`Recording to: ${this.counterFilePath}`);

    if (existsSync(this.counterFilePath.path)) {
      this.json = this.counterFilePath.readJSONSync();
    } else {
      this.json = {};
      this.flush();
    }
  }

  async flush() {
    await this.counterFilePath.writeJSON(this.json);
  }

  async record(key: string) {
    // biome-ignore lint/suspicious/noAssignInExpressions: Caching pattern
    (this.json[key] ??= []).push(new ErgonomicDate().multipurposeTimestamp);

    // We write immediately in case the program crashes later.
    this.flush();
  }
}
