# Examples

One minimal example per backend. Run `npm run build` first so `dist/` exists.

## WebGL (`webgl/index.html`)

Renders in any browser with WebGL2. Serve the repo root with any static file
server and open the example, e.g.:

```sh
npx serve .
# then open http://localhost:.../examples/webgl/
```

## WebGPU (`webgpu/index.html`)

Same as above, but requires a WebGPU-capable browser (Chrome 113+):

```sh
npx serve .
# then open http://localhost:.../examples/webgpu/
```

## Node (`node/load-model.js`)

Headless - parses a glTF file and prints its structure, no canvas or GPU
required:

```sh
node examples/node/load-model.js
```
