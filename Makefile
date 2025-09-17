.PHONY: build
build: setup
	bun run ./script/build.ts

.PHONY: run
run: setup
	bun run ./src/main.ts

.PHONY: lint
lint: lint-biome lint-tsc

.PHONY: lint-biome
lint-biome: setup
	bun x @biomejs/biome check

.PHONY: lint-tsc
lint-tsc: setup
	bun x typescript --project .

.PHONY: format
format: setup
	bun x @biomejs/biome check --write

.PHONY: update-schema
update-schema:
	bun run ./script/schema/update.ts

.PHONY: test
test: setup test-bun test-build

.PHONY: test-bun
test-bun:
	bun test

.PHONY: test-build
test-build: build
	node ./dist/bin/naughty-list/main.js --help

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: clean build

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: reset
reset: clean
	rm -rf ./node_modules
