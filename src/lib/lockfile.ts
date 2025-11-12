import { LockfileMutex } from "lockfile-mutex";
import { Path } from "path-class";
import { NAUGHTY_LIST } from "./binary-name";

// biome-ignore lint/correctness/noUnusedVariables: Biome bug.
let lockFile: LockfileMutex | undefined;
export function lock() {
  lockFile ??= LockfileMutex.newLocked(
    Path.xdg.runtimeWithStateFallback.join(NAUGHTY_LIST, "lockfile"),
  ).lockfileMutex;
}
