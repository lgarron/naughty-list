.PHONY: build
build: build-js build-types

.PHONY: build-js
build-js: setup
	bun run ./script/build-js.ts

.PHONY: build-types
build-types: setup
	bun x typescript --project ./tsconfig.build-types.json

.PHONY: run
run: setup
	bun run ./src/bin/main.ts

.PHONY: lint
lint: lint-biome lint-tsc

.PHONY: lint-biome
lint-biome: setup
	bun x @biomejs/biome check

.PHONY: lint-tsc
lint-tsc: setup
	bun x typescript --noEmit --project .

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
	node ./dist/naughty-list/bin/main.js --help

.PHONY: setup
setup:
	bun install --frozen-lockfile

.PHONY: publish
publish:
	npm publish

.PHONY: prepublishOnly
prepublishOnly: clean lint test build

.PHONY: clean
clean:
	rm -rf ./dist

.PHONY: reset
reset: clean
	rm -rf ./node_modules
