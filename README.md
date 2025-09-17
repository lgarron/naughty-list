# `naughty-list`

Sweep dotfile pollution in your home dir.

Scans for dotfiles in your home directory.

Offending entries will be [trashed](https://github.com/sindresorhus/trash) and recorded.

## Configuration example

```json5
// ~/.config/naughty-list/naughty-list.json5
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
      ".cargo",
      ".docker",
      ".gnupg",
      ".lldb",
      ".npm",
      ".python_history",
      ".rustup",
      ".terraform.d",
    ]
  }
}
```

## Usage

```shell
# bun
bun x naughty-list

# npm
npx naughty-list
```
