import { default as assert } from "node:assert";
import { join } from "node:path";
import { LockfileMutex } from "lockfile-mutex";
import { xdgData, xdgRuntime } from "xdg-basedir";
import { NAUGHTY_LIST } from "./binary-name";

const lockfilePathXDGFolder = xdgRuntime ?? xdgData;

// biome-ignore lint/correctness/noUnusedVariables: Biome bug.
let lockFile: LockfileMutex | undefined;
export function lock() {
  assert(lockfilePathXDGFolder);

  lockFile ??= LockfileMutex.newLocked(
    join(lockfilePathXDGFolder, NAUGHTY_LIST, "lockfile"),
  ).lockfileMutex;
}
