# Changelog

All notable changes to this project are documented in this file.

## [5.1.0] - 2026-07-25

### Added

- Public TypeScript type declarations for the `RedCube` class across all three
  entry points (WebGL, WebGPU, Node), plus `package.json` `exports`/`types`
  fields (`redcube.js`, `redcube.js/webgpu`, `redcube.js/node`).
- `examples/` directory with a runnable example for each backend (WebGL,
  WebGPU, Node) — see [`examples/README.md`](./examples/README.md).
- CI workflow (typecheck, lint, unit tests, build) on every push and PR.

### Fixed

- The Node.js build (`dist/redcube.node.cjs`) was never actually produced by
  the build script — the `index.js` example was broken. The build now
  correctly produces all three entry points.
- The WebGL bundle (`dist/redcube.js`) had stale output containing leaked
  WebGPU code, from a build script that only ever built one target regardless
  of which file it claimed to build.
- `resize()` now works with no arguments on all three backends — WebGL
  previously required one.
- Unhelpful/typo'd error messages (`"Webgl 2 doesnt support"`, generic
  `"Url not found"`) now name what's actually wrong and suggest a fix.
- A dependency conflict (an unused `esbuild-plugin-copy` package) that broke
  `npm ci` has been resolved.
- All `npm audit` findings resolved (they were rooted in the same unused
  dependency, via an outdated Jest toolchain).

### Changed

- **Breaking**: `init()` on the WebGPU and Node backends no longer silently
  swallows errors and calls back with a half-built scene. A failed load now
  rejects the returned promise, matching the WebGL backend's existing
  behavior. If your code relied on the old silent-continue behavior, wrap
  `init()` calls in error handling.
- WebGL's `init(cb)` callback now receives the loaded `Scene`, matching
  WebGPU and Node (existing callbacks that take no arguments are unaffected).

### Internal

- Migrated the test runner from Jest/ts-jest to Vitest — ts-jest doesn't
  support TypeScript 7's compiler API.
- Migrated linting from ESLint to oxlint.
- Full TypeScript strictness pass across the codebase (2,469 errors → 0).
