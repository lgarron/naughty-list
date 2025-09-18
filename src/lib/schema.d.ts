export type NaughtyListEntry = string;

export type NaughtyListConfig = {
  $schema?: string;
  // Note that any files to be trashed are placed immediately after this prefix.
  // Ensure that you pass any appropriate flags (e.g. `--`) to ensure all arguments are treated as paths.
  //
  // If not specified, https://github.com/sindresorhus/trash is invoked (as a library).
  //
  // Note: `/usr/bin/trash` on macOS does *not* currently accept a `--` argument.
  trashCommandPrefix?: string[];
  paths: {
    ignore?: NaughtyListEntry[];
    delete?: NaughtyListEntry[];
  };
};
